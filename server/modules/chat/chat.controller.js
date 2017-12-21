'use strict';

exports.getMessage = getMessage;

var q = require('q');
// var chat = global.Chat;

function getMessage(req, res) {
    var msgTo = req.query.msgTo;
    var msgFrom = req.query.msgFrom;
    var query = {
        $or : [
            { $and : [ { msgTo : msgTo }, { msgFrom : msgFrom } ] },
            { $and : [ { msgTo : msgFrom }, { msgFrom : msgTo } ] }
        ]
    };
  Chat.find(query, function (err, data) {
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