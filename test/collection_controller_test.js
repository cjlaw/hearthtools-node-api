process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp);

const EXAMPLE_RESULT = {
  "hpid": 548,
  "set": "CORE",
  "name": "Innervate",
  "id": "EX1_169",
  "dbfId": 254,
  "cardClass": "DRUID",
  "rarity": "FREE",
  "hpset": "basic",
  "golden": false,
  "quantity": 2
};

describe('collection controller', () => {
  describe('/GET /collection/:username', () => {
    it('it should fetch a card collection given a valid user', (done) => {
      chai.request(server)
        .get('/collection/ultimakillz')
        .end(async (err, res) => {
          res.status.should.equal(200);
          let collectionCount = res.body.result.length;
          (collectionCount > 0).should.be.true;
          JSON.stringify(res.body.result[0]).should.equal(JSON.stringify(EXAMPLE_RESULT));
          await done();
        });
    });

    it('it should return an error with an invalid username', (done) => {
      chai.request(server)
        .get('/collection/ultimakill')
        .end(async (err, res) => {
          let error = JSON.parse(res.text)
          res.status.should.equal(500);
          error.error.should.be.true;
          error.errorMsg.should.equal(`Wrong username or collection set to private: ultimakill`);
          (error.result === null).should.be.true;
          await done();
        });
    });
  });
});