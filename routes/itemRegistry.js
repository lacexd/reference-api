const mongoose = require('mongoose');
const ItemRegistry = mongoose.model('ItemRegistry');
const Event = mongoose.model('Event');
const itemRegistryRoute = {
    addItem(req, res) {
        const itemRegistry = new ItemRegistry(req.body);
        itemRegistry.user = req.user.id;
        itemRegistry.save((err) => {
            if (err) return res.send(err);
        });

        Event.findById(req.params.id, (err, event) => {
            if (err) return res.send(err);
            event.itemRegistry.push(itemRegistry.id);
            event.save((err) => {
                if (err) res.send(err);
                res.send('Item successfully added to event');
            });
        });
    },

    signUpForItem(req, res) {
        ItemRegistry.findById(req.params.id, (err, item) => {
            if (err) res.send(err);
            item.assigned = req.user.id;
            if (item.quantity === 0) {
                res.send('you can not subscribe for this item because the quantity is already 0');
            } else {
                item.quantity -= req.body.quantity ? req.body.quantity : 1;
                item.save((err) => {
                    if (err) res.send(err);
                    res.send('user subscribed for the item');
                });
            }
        });
    },

    getItemsForAnEvent(req, res) {
        Event.findById(req.params.eventId, (err, event) => {
            if (err) return res.send(err);
            ItemRegistry.find({
                _id: event.itemRegistry
            }, (err, items) => {
                if (err) return res.send(err);
                res.send(items);
            });
        });
    }
};


module.exports = itemRegistryRoute;
