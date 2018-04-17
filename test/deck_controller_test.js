process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp);

const EXAMPLE_DECKSTRING = 'AAECAR8GxwPJBLsFmQfZB/gIDI0B2AGoArUDhwSSBe0G6wfbCe0JgQr+DAA=';

describe('deck controller', () => {
  describe('/POST to /decode', () => {
    it('it should return data representing the decoded deck string', (done) => {
      chai.request(server)
        .post('/decode')
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
});