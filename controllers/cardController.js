const request = require('request-promise');
var path = require('path');
var dotEnvPath = path.resolve('./.env');
require('dotenv').config({ path: dotEnvPath});
const hsApiUrl = 'https://omgvamp-hearthstone-v1.p.mashape.com/cards/search/';
const hsApiHeaders = {
    'X-Mashape-Key': process.env.mashape_hscard_token,
    'Accept': 'application/json'
};
const _cardSearchSingle = async (term) => {
  let opts = {
      url: encodeURI(hsApiUrl + term),
      headers: hsApiHeaders
  };
  let searchResult = await request(opts);
  let parsedSearchResult = JSON.parse(searchResult);
  return parsedSearchResult[0].imgGold;
};

const cardSearchSingle = async (req, res) => {
  try {
    let searchResult = await _cardSearchSingle(req.body.term);
    res.status(200).json({ result: searchResult });
  }
  catch (err) {
    res.status(500).send(err);
  }
};

module.exports = cardSearchSingle;