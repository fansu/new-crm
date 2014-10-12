var mongoose = require('mongoose');
var models = require('../model.js');
var db = require('../db.js');

module.exports = new function () {
  return {
    create: function (req, res) {
      var url = require('url'),
          agentID = Number(url.parse(req.url, true).query.agentID),
          customerID = Number(url.parse(req.url, true).query.customerID);

      var contactHistory = {
        time : req.param('time'),
        data : req.param('data'),
        textSummary : req.param('textSummary'),
        model : req.param('model'),
        agent: agentID,
        customer: customerID,
      };

      console.log('Connected to MongoDB !');
      models['ContactHistory'].create(contactHistory, function(err){
        if (err){
          res.send(500, { error: "Database Error." });
        } else {
          res.redirect('/agent' + agentID + '/customer/' + customerID);
        }
      });
    },

    showCreate: function (req, res) {
      res.render('contact_history/create');
    },

    retrieve: function (req, res) {
      var contactHistoryID = req.param(contactHistoryID);

      console.log('Connected to MongoDB !');
  models['ContactHistory'].find({}).where('_id').equals(contactHistoryID).exec(function(err, agent)
      {
        if (err){
	  res.send(500, { error: "Database Error." });
        } else {
          res.set('Content-Type', 'application/json');
          res.render('contact_history/retrieve', contactHistory);
         }
      });
    }
  };
};
