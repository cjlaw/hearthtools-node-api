
let express = require('express');
let app = express();
let router = express.Router(); 
let bodyParser = require('body-parser');
app.use(bodyParser.json());                                     
app.use(bodyParser.urlencoded({extended: true}));               
app.use(bodyParser.text());                                    
app.use(bodyParser.json({ type: 'application/json'}));  

let port = process.env.PORT || 3000;
let server = app.listen(port, () => {
  console.log(`Express server listening on port ${port}!`);
});
let exampleController = require('./controllers/exampleController');

// middleware to use for all requests
router.use(function(req, res, next) {
    console.log('We are being hit!');
    next(); // make sure we go to the next routes and don't stop here
});

router.get(['/', '/about'], exampleController);

app.use('/', router);

module.exports = app; // for testing