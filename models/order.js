const {Schema, model} = require('mongoose');

const orderSchema = new Schema({
	
	goods: [
		{
			goodsItem: {
					type: Object,
					required: true
				},
				count: {
					type: Number,
					required: true
				}
			}
	],
	user: {
		name: String,
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		}
	},
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = model('Order', orderSchema);