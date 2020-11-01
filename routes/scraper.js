var express = require('express');
var router = express.Router();

//HTML SCRAPER CONTROLLER
var ScraperSource = require('../controller/scraper');
var scraper = new ScraperSource(); 

//SCRAPER ROUTES
router.get('/', function(req, res) {
  res.json(scraper.processDirectory());
});

//APIs for the Client Config Collector
router.get('/domain', function(req, res) {
  res.json(scraper.processDirectory()[0]);
});

router.get('/file_system', function(req, res) {
  res.json(scraper.processDirectory()[1]);
});

module.exports = router;