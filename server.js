let express = require('express');
let app = express();
let router = express.Router(); 
let bodyParser = require('body-parser');
app.use(bodyParser.json());                                     
app.use(bodyParser.urlencoded({extended: true}));               
app.use(bodyParser.text());                                    
app.use(bodyParser.json({ type: 'application/json'}));  

let mcache = require('memory-cache');
const CACHE_DURATION = 300000;
let port = process.env.PORT || 3000;
let server = app.listen(port, () => {
  console.log(`Express server listening on port ${port}!`);
});

let cache = (duration) => {
  return (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url
    let cachedBody = mcache.get(key)
    if (cachedBody) {
      console.log('caching works!')
      res.send(cachedBody)
      return
    } else {
      res.sendResponse = res.send
      res.send = (body) => {
        mcache.put(key, body, duration * 1000);
        res.sendResponse(body)
      }
      next()
    }
  }
};

let exampleController = require('./controllers/exampleController');
let hsJsonController = require('./controllers/hsJsonController');
let cardController = require('./controllers/cardController');
let deckController = require('./controllers/deckController');
let collectionController = require('./controllers/collectionController');

// middleware to use for all requests
router.use((req, res, next) => {
  // Do logging, etc.
  next(); // make sure we go to the next routes and don't stop here
});

router.get(['/', '/about'], cache(CACHE_DURATION), exampleController);
router.all('/hsjson', cache(CACHE_DURATION), hsJsonController);
router.all('/card', cardController);
router.all('/deck/*', deckController);
router.all('/collection/*', collectionController);

app.use('/', router);

module.exports = app; // for testing