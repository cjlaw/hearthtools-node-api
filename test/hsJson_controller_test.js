process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp);

const EXPECTED_RESULT = {
  "result": {
      "attack": 0,
      "cardClass": "NEUTRAL",
      "cost": 0,
      "dbfId": 52424,
      "faction": "ALLIANCE",
      "health": 0,
      "id": "ART_BOT_Bundle_001",
      "name": "Golden Legendary",
      "rarity": "LEGENDARY",
      "set": "TB",
      "type": "MINION"
  }
};

describe('hsJson controller', () => {
  describe('/GET', () => {
    it('it should GET the first card object', (done) => {
      chai.request(server)
        .get('/hsjson')
        .end(async (err, res) => {
          JSON.stringify(res.body).should.equal(JSON.stringify(EXPECTED_RESULT));
          await done();
        });
    });
  });
});