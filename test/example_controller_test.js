process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);
describe('example controller', () => {
  describe('/GET', () => {
      it('it should GET a Hello World message', (done) => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
                res.text.should.equal('Hello World?');
              done();
            });
      });

      it('it should GET an about message', (done) => {
        chai.request(server)
            .get('/about')
            .end((err, res) => {
                res.text.should.equal('Simple Node API');
              done();
            });
      });
  });
});