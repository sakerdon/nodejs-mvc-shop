const path = require('path');
const fs = require('fs'); 


const dbPath = path.join(
  path.dirname(process.mainModule.filename),
  'db',
  'cart.json'
);


class Cart {

  static totalCount() {
    const cart = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    
    if (!cart.goods) return '';
    return cart.goods.reduce( (acc, el) => acc + el.count, 0);


  }

  static async add(goodsItem) {
    const cart = await Cart.fetch();

    const index = cart.goods.findIndex(c => c.id === goodsItem.id);
    const tmp = cart.goods[index];

    if (tmp) {
      tmp.count++;
      cart.goods[index] = tmp;
    } else {
      goodsItem.count = 1;
      cart.goods.push(goodsItem);
    }

    cart.price += Number(goodsItem.price);

    return new Promise((resolve, reject) => {
      fs.writeFile(dbPath, JSON.stringify(cart), err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      })
    })
  }

  static async remove(id) {
    const cart = await Cart.fetch();
  	const index = cart.goods.findIndex(el => el.id === id);
    const item = cart.goods[index];

    if (!item) {
    	return Promise.reject(new Error('Nothing to remove'));
    }
	
	if (item.count > 1) {
		item.count--;
	} else {
		cart.goods = cart.goods.filter( el => el.id !== id);
	}

	cart.price -= item.price;

	return new Promise((resolve, reject) => {
	  fs.writeFile(dbPath, JSON.stringify(cart), err => {
	    if (err) {
	      reject(err);
	    } else {
	      resolve();
	    }
	  })
	})    	

  }

  static async inCart(id) {
  	const cart = await Cart.fetch(); 
  	Boolean(~cart.goods.findIndex(el => el.id === id));

  }

  static async fetch() {
    return new Promise((resolve, reject) => {
      fs.readFile(dbPath, 'utf-8', (err, content) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(content));
        }
      })
    })
  }

}

module.exports = Cart