
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp);

describe('Virements Externe', () => {
 
  describe('/GET Virement externe  ', () => {
      it('it should GET all the externe virements', (done) => {
        chai.request(server)
            .get('/gestionnaire/listVirementEx')
            .set({'token':'Vk5sdkIaq5fAnhepbrXOndqFtRscTXrVQWPUKX5bjAKsZAI4UJSpEKItNEoBJdsgECrVCHTCOohIozlsuugwnD3wKnRtYOtnZBJ14NGwZH4Ya6TnOpfSWbo5Bxvh4ybjI1385jHklEDfsqoSwLstQv792W7E6ENA3klObi4QrMExjbEPOJUbmUX5j6uwT36MM87zNIjXqOW6c3GKaXGANvQ9HOCaX2eNaDQtySq5iJv5dvUJgnQodrN7GYXVpxq'})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.Virements.should.be.a('array');
                res.body.Virements.length.should.be.eql(1);
              done();
            });
      });
  });

  describe('/GET historique ', () => {
    it('it should GET historique', (done) => {
      chai.request(server)
          .get('/clients/historique')
          .set({'token':'Vk5sdkIaq5fAnhepbrXOndqFtRscTXrVQWPUKX5bjAKsZAI4UJSpEKItNEoBJdsgECrVCHTCOohIozlsuugwnD3wKnRtYOtnZBJ14NGwZH4Ya6TnOpfSWbo5Bxvh4ybjI1385jHklEDfsqoSwLstQv792W7E6ENA3klObi4QrMExjbEPOJUbmUX5j6uwT36MM87zNIjXqOW6c3GKaXGANvQ9HOCaX2eNaDQtySq5iJv5dvUJgnQodrN7GYXVpxq'})
          .end((err, res) => {
              res.should.have.status(200);
              res.body.historique.should.be.a('array');
            
            done();
          });
    });
});

describe('/Post Virement externe ', () => {
  it('it should effectue un virement entre un compte courant et un compte epargne', (done) => {
    chai.request(server)
        .post('/virement/local')
        .set({'token':'Vk5sdkIaq5fAnhepbrXOndqFtRscTXrVQWPUKX5bjAKsZAI4UJSpEKItNEoBJdsgECrVCHTCOohIozlsuugwnD3wKnRtYOtnZBJ14NGwZH4Ya6TnOpfSWbo5Bxvh4ybjI1385jHklEDfsqoSwLstQv792W7E6ENA3klObi4QrMExjbEPOJUbmUX5j6uwT36MM87zNIjXqOW6c3GKaXGANvQ9HOCaX2eNaDQtySq5iJv5dvUJgnQodrN7GYXVpxq'})
        .send({
          'montant': '10',
          'type1': '0',
          'type2': '1',
          'motif':'virement'
        })
        .end((err, res) => {
            res.should.have.status(200);
            
          
          done();
        });
  });
});

});