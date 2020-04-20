const {Schema, model} = require('mongoose');

const userSchema = new Schema({
	email: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	cart: {
		items: [{
			count: {
				type: Number,
				required: true,
				default: 1
			},
			goodsId: {
				type: Schema.Types.ObjectId,
				ref: 'Goods',
				required: true
			}
		}]
	}
});

userSchema.methods.clearCart = function() {
	this.cart.items = [];
	return this.save();
}

userSchema.methods.getTotalCount = function(goodsItem) {
	return this.cart.items.reduce( (acc, el) => acc + el.count, 0 );
}
	
userSchema.methods.addToCart = function(goodsItem) {
	const items = [...this.cart.items];
	const index = items.findIndex(el => el.goodsId.toString() === goodsItem._id.toString());
	if (index >= 0) {
		items[index].count++;
	} else {
		items.push({
			count: 1,
			goodsId: goodsItem._id
		})
	}

	this.cart = {items};
	return this.save();
}

userSchema.methods.removeFromCart = function(id) {
	const items = [...this.cart.items];
	const index = items.findIndex(el => el.goodsId.toString() === id.toString());

	if (items[index].count > 1) {
		items[index].count--;
	} else {
		console.log(123);
		items.splice(index, 1);
	}
	this.cart = {items};
	return this.save();
}

module.exports = model('User', userSchema);