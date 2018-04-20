process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp);

const EXAMPLE_DECKSTRING = 'AAECAR8GxwPJBLsFmQfZB/gIDI0B2AGoArUDhwSSBe0G6wfbCe0JgQr+DAA=';

const EXAMPLE_DECK_TO_ENCODE =
{
  "cards": [
    [141, 2],
    [216, 2],
    [296, 2],
    [437, 2],
    [455, 1],
    [519, 2],
    [585, 1],
    [658, 2],
    [699, 1],
    [877, 2],
    [921, 1],
    [985, 1],
    [1003, 2],
    [1144, 1], 
    [1243, 2],
    [1261, 2], 
    [1281, 2],
    [1662, 2]
  ],
  "heroes": [31],
  "format": 2
};

const EXAMPLE_ENCODED_DECK = 'AAECAR8GxwPJBLsFmQfZB/gIDI0B2AGoArUDhwSSBe0G6wfbCe0JgQr+DAA=';

describe('deck controller', () => {
  describe('/POST to /decode', () => {
    it('it should return data representing the decoded deck string', (done) => {
      chai.request(server)
        .post('/deck/decode')
        .send({'query':EXAMPLE_DECKSTRING})
        .end(async (err, res) => {
          res.status.should.equal(200);
          let response = JSON.parse(res.text);
          let result = response.result;
          result.should.not.equal(null);
          result.should.not.equal({});
          result.class.should.equal('Hunter');
          result.format.should.equal('Standard');
          result.cardList.length.should.equal(18);
          await done();
        });
    });
  });

  describe('/POST to /encode', () => {
    it('it should return an encoded deck string', (done) => {
      chai.request(server)
        .post('/deck/encode')
        .send({'query': JSON.stringify(EXAMPLE_DECK_TO_ENCODE)})
        .end(async (err, res) => {
          console.log(res.text)
          res.status.should.equal(200);
          let response = JSON.parse(res.text);
          let result = response.result;
          result.should.not.equal(null);
          result.should.not.equal({});
          result.should.equal(EXAMPLE_ENCODED_DECK);
          await done();
        });
    });
  });
});