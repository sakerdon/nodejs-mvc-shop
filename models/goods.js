const {Schema, model} = require('mongoose');

const goods = new Schema({
	title: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	image: String,
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	}
});

module.exports = model('Goods', goods);