process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp);

const EXAMPLE_RESULT_SYLVANAS = {
  "result": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_016_premium.gif"
};

describe('card controller', () => {
  describe('/POST', () => {
    it('it should return a card search result', (done) => {
      chai.request(server)
        .post('/card')
        .send({'term':'sylvanas'})
        .end(async (err, res) => {
          res.text.should.equal(JSON.stringify(EXAMPLE_RESULT_SYLVANAS));
          await done();
        });
    });
  });
});