var express = require('express');
var router = express.Router();
var controller = require('./chat.controller');

router.get('/', controller.getMessage);

module.exports = function (app) {
  app.use('/api/chats',router);
}