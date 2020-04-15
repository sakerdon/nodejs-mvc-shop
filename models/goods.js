const uuid = require('uuid/v4');
const fs = require('fs');
const path = require('path');


class Goods {
	constructor ({title = '', price = '', image = '', id = null}) {
		this.title = title;
		this.price = price;
		this.image = image;
		this.id = id || uuid();;

		console.log('test');
	}

	toJSON() {
		return {
			title: this.title,
			price: this.price,
			image: this.image,
			id: this.id
		};
	}

	async update() {
		const goods = await this.getAll();
		const index = goods.findIndex( el => el.id === this.id );
		this.save(index);
	}

	async getById(id) {
		const goods = await this.getAll();
		return goods.find(el => el.id === id);
		
	}

	getAll() {
		return new Promise((resolve, reject) => {
			fs.readFile(
				path.join(__dirname, '..', 'db', 'goods.json'),
				'utf-8',
				(err, content) => {
					if (err) reject(err);
					else resolve(JSON.parse(content)); 
				}
			);

		});

	} 

	async save(index = -1) {
		const goods = await this.getAll();

		if (index === -1) {
			goods.push(this.toJSON());
		} else {
			goods[index] = this.toJSON();
		}

		// console.log('goods', goods);

		return new Promise( (resolve, reject) => {
			fs.writeFile(
				path.join(__dirname, '..', 'db', 'goods.json'),
				JSON.stringify(goods),
				(err) => {
					if (err) reject(err);
					else resolve();
				}
			);
		});

	}
}

module.exports = Goods;