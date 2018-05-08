const mongoose = require('mongoose');
const ItemRegistry = mongoose.model('ItemRegistry');
const Event = mongoose.model('Event');
const Payment = mongoose.model('Payment');
const format = require('../lib/response-format');
const itemRegistryRoute = {
	addItem(req, res) {
    let itemRegistry = [];
		if (!Array.isArray(req.body)) {
      itemRegistry.push(req.body);
		}else{
      itemRegistry = req.body;
    }

    itemRegistry.map((item) => {
      item.user = req.user.id;
      return new ItemRegistry(req.body)
    })
    ItemRegistry.insertMany(itemRegistry, (err, items) => {
			if (err) return res.send(format.error(err));
			Event.findById(req.params.eventId, (err, event) => {
				if (err) return res.send(format.error(err));
        items.forEach((v) => {
          event.itemRegistry.push(v.id);
        })
				event.save((err) => {
					if (err) return res.send(format.error(err));
					res.send(format.success(itemRegistry, 'Item successfully added to event'));
				});
			});
		});

	},

	signUpForItem(req, res) {
		ItemRegistry.findById(req.params.eventId, (err, item) => {
			if (err) return res.send(format.error(err));
			item.assigned = req.user.id;
			if (item.quantity === 0) {
				res.send(format.error({
					message: 'you can not subscribe for this item because the quantity is already 0'
				}));
			} else {
				item.quantity -= req.body.quantity ? req.body.quantity : 1;
				item.save((err) => {
					if (err) return res.send(format.error(err));
					const payment = new Payment(req.body);
					payment.save((err) => {
						if (err) return res.send(format.error(err));
						res.send(format.success({
							item,
							payment
						}), 'User subscribed for the item')
					})
				});
			}
		});
	},

	getItemsForAnEvent(req, res) {
		Event.findById(req.params.eventId, (err, event) => {
			if (err) return res.send(format.error(err));
			ItemRegistry.find({
				_id: event.itemRegistry
			}, (err, items) => {
				if (err) return res.send(format.error(err));
				res.send(format.success(items, 'Itemregistry successfully fetched'));
			});
		});
	}
};


module.exports = itemRegistryRoute;
