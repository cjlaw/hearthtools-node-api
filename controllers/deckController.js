const express = require('express');
const router = express.Router();
const request = require('request-promise');
const { decode, encode } = require("deckstrings");

const url = 'https://api.hearthstonejson.com/v1/latest/enUS/cards.json';
const hscard_headers = {
    'Accept': 'application/json'
};
let cardsjson = null;

const _buildResponseFromDecodecDeckString = (decodedDeckString, deckString) => {
    let cardList = _buildCardList(decodedDeckString.cards);
    let className = _buildClassName(decodedDeckString.heroes[0]);
    let setFormat = decodedDeckString.format === 1 ? 'Wild' : 'Standard';
    return {
        class: className,
        format: setFormat,
        cardList: cardList,
        deckstring: deckString        
    };
};

const _buildCardList = (cardCodes) => {
    let cardList = [];
    cardCodes.forEach((cardCode) => {
        let cardId = cardCode[0];
        let cardJson = cardsjson.find((e) => e.dbfId === cardId);
        let cardObject = {};
        cardObject.amount = `${cardCode[1]}x`; //Ex. 1x or 2x
        cardObject.cost = cardJson.cost;
        cardObject.name = cardJson.name;
        cardObject.rarity = cardJson.rarity[0].toUpperCase() + cardJson.rarity.substring(1).toLowerCase();
        cardObject.id = cardJson.id;

        cardList.push(cardObject);
    });

    // Sort card list by cost
    cardList.sort((a, b) => a.cost - b.cost);

    return cardList;
};

const _buildClassName = (heroId) => {
    let heroJson = cardsjson.find((element) => element.dbfId === heroId && element.type === "HERO");
    return heroJson.cardClass[0].toUpperCase() + heroJson.cardClass.substring(1).toLowerCase();
}

const _fetchHearthstoneJson = () => {
    let opts = {
        url: url
    };
    return request(opts);
};

router.post('/deck/decode', async (req, res) => {
  try {            
    let cardStream = await _fetchHearthstoneJson();
    cardsjson = JSON.parse(cardStream);
    let decodedDeckString = decode(req.body.query);
    let formattedResponse = _buildResponseFromDecodecDeckString(decodedDeckString, req.body.query);
    res.status(200).json({ result: formattedResponse });    
  }
  catch (err) {
    res.status(500).send(err);
  }
});

router.post('/deck/encode', async (req, res) => {
    try {            
      let cardStream = await _fetchHearthstoneJson();
      cardsjson = JSON.parse(cardStream);
      let encodedDeckString = encode(JSON.parse(req.body.query));
      res.status(200).json({ result: encodedDeckString });    
    }
    catch (err) {
      res.status(500).send({result: null, error: true, errorMsg: err.message || err });
    }
  });

module.exports = router;