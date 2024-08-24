const axios = require("axios");
const { JSDOM } = require("jsdom")
const cors = require('cors');
const express = require('express');

const app = express();
const port = 3001;
app.use(cors());

app.get('/getProducts', async (req, res) => {
  try {
    const { data } = await axios.get('https://www.mikroprinc.com/sr/proizvodi/arduino?limit=999999');
    const document = new JSDOM(data).window.document;
    const products = document.querySelectorAll('.products-table tbody tr');
    let results = [...products].map(element => {
      const [, textElement, priceElement, statusElement] = [...element.querySelectorAll('td')];
      const title = textElement.querySelector('h3 a').textContent.replace(/[\t|\n]/g, '').trim();
      const price = Number(priceElement.querySelector('.price span').childNodes[0].textContent.split(',')[0].replace(/\./g, ''));
      const isAvailable = statusElement.querySelector('.text-status').textContent === 'Dostupan';

      return {
        title: title,
        price: price,
        isAvailable: isAvailable
      };
    });

    results = results.sort((a, b) => {
      if (a.isAvailable && !b.isAvailable) {
        return -1;
      } else if (!a.isAvailable && b.isAvailable) {
        return 1;
      }
      return 0;
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});