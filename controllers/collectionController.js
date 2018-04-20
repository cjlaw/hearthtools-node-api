const express = require('express');
const router = express.Router();
const q = require('q');
const YUI = require('yui').YUI;
const html2json = require('html2json').html2json;
var fs = require("fs");
let hpCardsJson = JSON.parse(fs.readFileSync('./hp_cards.json', 'utf8'));

// Inspired by/based on https://github.com/Freezard/hs-collection-tracker
const _grabCollectionFromHearthPwn = (username) => {
  let deferred = q.defer();
  YUI().use('yql', (Y) => {
    Y.YQL(`select * from htmlstring where url="http://www.hearthpwn.com/members/${username}/collection" 
      and xpath="//div[contains(@class, \'owns-card\')]"`, (response, error) => {    
      if (error) {
          deferred.reject(error);
      } else {
          deferred.resolve(response);
      }
    }, {
      format: 'json',
      env: 'store://datatables.org/alltableswithkeys'
      }, {
      base: '://query.yahooapis.com/v1/public/yql?',
      proto: 'https'
    });
  });
  return deferred.promise;
}

// Inspired by/based on https://github.com/Freezard/hs-collection-tracker
const _processCollectionFromHearthPwn = (results) => {
  let collection = [];

  results.forEach((result) => {
    let externalID = result.attr["data-id"];
    let cardData = hpCardsJson.find((e) => e.hpid == externalID);
    let rarity = cardData.rarity;
    let copies = 0;
    let quality = "";

    if (result.attr["data-is-gold"] == "False") {
      quality = "normal";
      copies = Math.min(result.child[0].child[1].attr["data-card-count"],
          rarity === 'LEGENDARY' ? 1 : 2);
    }
    else {
      quality = "golden";
      copies = Math.min(result.child[0].child[1].attr["data-card-count"],
          rarity === 'LEGENDARY' ? 1 : 2);
    }
    cardData.golden = quality === 'golden'
    cardData.quantity = copies;
    collection.push(cardData);
  });
  return collection;
}

router.get('/collection/:username', async (req, res) => {
  try {   
    let resultsFromHearthPwn = await _grabCollectionFromHearthPwn(req.params.username);

    if (resultsFromHearthPwn.query.results.result == "") {
      throw(`Wrong username or collection set to private: ${req.params.username}`);
    }

    let html = resultsFromHearthPwn.query.results.result.replace(/&#13;/g, '');
    html = html.replace(/\n/ig, '');
    html = html.replace(/\s\s+/g, '');
    let results = html2json(html).child;

    let collection = _processCollectionFromHearthPwn(results);

    console.log(`Collection imported successfully. ${collection.length} cards imported!`);
    res.status(200).json({ result: collection });   
  }
  catch (err) {
    res.status(500).send({result: null, error: true, errorMsg: err.message || err });
  }
});

module.exports = router;