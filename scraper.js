const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const stringify = require('csv-stringify');

const urlToScrape = 'https://books.toscrape.com/';

axios.get(urlToScrape)
    .then(res => {
        const html = res.data;
        const $ = cheerio.load(html);

        const siteTitle = $('header > .page_inner > .row > div > a').text();

        const books = [];
        $('ol > li > article').each((i, el) => {
            const Title = $(el).children('h3').children('a').attr('title');

            const Rating = $(el).children('p').attr('class').slice(12);

            const Price = $(el).children('.product_price').children('.price_color').text();

            const halfLink = $(el).children('.image_container').children('a').attr('href');
            const Link = urlToScrape.concat(halfLink);
            
            books[i] = { Title, Rating, Price, Link };
        })

        stringify(books, { header: true }, (err, output) => {
            if(err) throw err;
            fs.writeFile('scraped.csv', output, (err) => {
                if(err) throw err;
            });
        })

        console.log('The data is successfully scraped and stored in a CSV file.');
    })
    .catch(err => {
        console.log(err);
    })