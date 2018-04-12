const request = require('request-promise');
const opts = {
  url: 'https://api.hearthstonejson.com/v1/latest/enUS/cards.json'
};

const getHSJson = async (req, res) => {
  try {
    let result = await request(opts);
    result = JSON.parse(result);
    res.status(200).json({ json: result[0] }); // Only return the first object for now
  }
  catch (err) {
    res.status(500).send(err);
  }
};

module.exports = getHSJson;