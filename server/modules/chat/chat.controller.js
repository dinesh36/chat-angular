'use strict';

exports.getMessage = getMessage;

var q = require('q');
// var chat = global.Chat;

function getMessage(req, res) {
  Chat.find({}, function (err, data) {
      if(err) {
        res.sendError(new Exception('DBError', 'Error in getting saved messages.'));
      } else {
        if(data) {
          res.send(data);
        } else {
          res.sendError(new Exception('Object Not Found'));
        }
      }
    });
}