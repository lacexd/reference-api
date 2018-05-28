const mongoose = require('mongoose');
const ItemRegistry = mongoose.model('ItemRegistry');
const Event = mongoose.model('Event');
const Payment = mongoose.model('Payment');
const User = mongoose.model('User');
const ItemQuantity = mongoose.model('ItemQuantity');
const format = require('../lib/response-format');
const _ = require('underscore');
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
				event.isItemRegistry = true;
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
		ItemRegistry.findById(req.params.itemId, (err, item) => {
				if (err) return res.send(format.error(err));
				User.find({
					phoneNumber: req.body.map((user) => user.phoneNumber)
				}, (err, users) => {
					if (err) return res.send(format.error(err));
					// const recordsPopulatedWithIds =	_.values(_.extend(_.indexBy(users, 'phoneNumber'), _.indexBy(req.body, 'phoneNumber'))).map((quantity) => {
					// 	quantity.user = quantity.id;
					// 	return quantity;
					// });
					const recordsPopulatedWithIds = req.body.map((quantity) => {
						const foundUser = users.find((user) => {
							return user.phoneNumber === quantity.phoneNumber;
						})
						if(foundUser){
							quantity.user = foundUser.id;
							return quantity;
						}
						return null;
					}).filter((body) => body);


					console.log(recordsPopulatedWithIds);
					ItemQuantity.insertMany(recordsPopulatedWithIds, (err, quantities) => {
						if (err) return res.send(format.error(err));
						if(!item.assignedTo.constructor === Array){
							item.assignedTo = [];
						}
						const quantityIds = quantities.map((quantity) => quantity.id);
						item.assignedTo.push(quantityIds);
						item.assignedTo = [].concat(...item.assignedTo);
						const sumOfQuanitities = quantities.reduce((sum, quantity) => {
							sum += quantity.quantity;
							return sum;
						}, 0);
						item.quantity -= sumOfQuanitities;
						item.save((err) => {
							if (err) return res.send(format.error(err));
							res.send(format.success(quantities, 'Users were assigned to item successfully'));
						})
					});
				})
		});



	},

	getItemsForAnEvent(req, res) {
		Event.findById(req.params.eventId, (err, event) => {
			if (err) return res.send(format.error(err));
			ItemRegistry.find({
				_id: event.itemRegistry
			})
			.populate({
				path: 'assignedTo'
			})
			.exec((err, items) => {
				if (err) return res.send(format.error(err));
				res.send(format.success(items, 'Itemregistry successfully fetched'));
			});
		});
	},

	markItemAsDeleted(req, res) {
		ItemRegistry.findById(req.params.Item, (err, item) => {
			if (err) return res.send(format.error(err));
				item.isMarkedAsDeleted = true;
				item.save((err) => {
					if (err) return res.send(format.error(err));
					res.send(format.success(items, 'Item successfully deleted'));
				});
		});
	},

	editItem(req, res) {
		ItemRegistry.findById(req.params.Item, (err, item) => {
			if (err) return res.send(format.error(err));
				for(var i in req.body){
					item[i] = req.body[i];
				}
				item.save((err) => {
					if (err) return res.send(format.error(err));
					res.send(format.success(items, 'Item updated deleted'));
				});
		});
	}
};


module.exports = itemRegistryRoute;
