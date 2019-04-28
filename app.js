const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

class Product {
    constructor(id, title, city, date, price, link, img) {
        this.id = id;
        this.title = title;
        this.city = city;
        this.date = date;
        this.price = price;
        this.link = link;
        this.img = img;
    }
}
let products = [];
let getProducts = new Promise(function (resolve) {
    const prods = [];
    request('https://market.kz/almaty/elektronika/computery/noutbuki/', (err, res, page) => {
        if (!err && res.statusCode == 200) {
            const $ = cheerio.load(page);
            const item = $('.content')
                .each((i, el) => {
                    if ($(el).find('.item-title >a').text()) {
                        const id = $(el).find('.photo a').attr('data-product-id');
                        const title = $(el).find('.item-title >a').text().trim();
                        const city = $(el).find('.city-name').text().trim();
                        const addDate = $(el).find('.add-date').text().trim();
                        const price = $(el).find('.price >span').text().trim();
                        const link = $(el).find('.photo a').attr('href');
                        const img = $(el).find('.photo a img').attr('src');
                        prods.push(new Product(id, title, city, addDate, price, link, img));
                    }
                })
        }
        resolve(prods);
    })
});
let takeProducts = function () {
    getProducts
        .then(data => {
            products = [...data];
        })
        .catch(err => {
            console.log('Йа ошибко!!! ', err);
        });
}
takeProducts();
app.use('/', (req, res, next) => {
    res.render('index', {
        prods: products,
        pageTitle: 'Market Scraping',
        path: '/'
    })
});

app.listen(3000, () => {
    console.log('Открой http://localhost:3000 юный падаван');
});