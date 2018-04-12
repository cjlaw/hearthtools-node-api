let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/', (req, res) => {
    res.send(`Hello World!`);
});

router.get('/about', (req, res) => {
    res.send(`Simple Node API`);
});

module.exports = router;