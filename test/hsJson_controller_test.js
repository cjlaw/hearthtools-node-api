process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp);

const EXPECTED_RESULT = {
  "json":{"artist":"Nutthapon Petchthai","cardClass":"MAGE","collectible":true,"cost":5,"dbfId":2539,
  "flavor":"It's on the rack next to ice lance, acid lance, and English muffin lance.","id":"AT_001",
  "name":"Flame Lance","playRequirements":{"REQ_MINION_TARGET":0,"REQ_TARGET_TO_PLAY":0},"rarity":"COMMON",
  "set":"TGT","text":"Deal $8 damage to a minion.","type":"SPELL"}
};

describe('hsJson controller', () => {
  describe('/GET', () => {
    it('it should GET the first card object', (done) => {
      chai.request(server)
        .get('/hsjson')
        .end(async (err, res) => {
          res.text.should.equal(JSON.stringify(EXPECTED_RESULT));
          await done();
        });
    });
  });
});