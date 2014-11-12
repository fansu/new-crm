var mongodbService = require('./data_service/mongodb_service.js');
var Promise = require('promise');

var without_internal_field = {
  _id: 0,
  name: 1,
  email: 1,
  phone: 1
};

exports.getAgents = function (req, res) {
  var fulfill = function(agents) {
    res.json(agents);
  }
  var reject = function(err) {
    res.json({error: err});
  }

  var name_q = new RegExp(req.param('name'));
  var is_all = (req.param('all')) ? true : false;
  var page_no =(req.param('p')) ? req.param('p') : 1;
  var per_page = (req.param('per_page')) ? req.param('per_page') : 10;

  var getAllAgentsPromise = function() {
      return new Promise(function(fulfill, reject) {
        mongodbService.Agent.find({}).exec(function(err, agents) {
        if (err) reject(err);
        else fulfill(agents);
      });
    });
  };

  var getAgentsPromise = function(name_q, page_no, per_page) {
      return new Promise(function(fulfill, reject) {
        mongodbService.Agent.find({name: name_q}, {_id: 0, __v: 0})
                            .skip((page_no - 1) * per_page)
                            .limit(per_page).exec(function(err, agents) {
        if (err) reject(err);
        else fulfill(agents);
      });
    });
  };

  if (is_all) {
    getAllAgentsPromise().done(fulfill, reject);
  } else {
    getAgentsPromise(name_q, page_no, per_page).done(fulfill, reject);
  }
};

exports.getCustomers = function (req, res) {
  var fulfill = function(customers) {
    res.json(customers);
  }
  var reject = function(err) {
    res.json({error: err});
  }

  var getAllCustomersPromise = function() {
      return new Promise(function(fulfill, reject) {
        mongodbService.Customer.find({}).exec(function(err, customers) {
        if (err) reject(err);
        else fulfill(customers);
      });
    });
  };

  var is_all = (req.param('all')) ? true : false;
  var name_q = new RegExp(req.param('name'));
  var page_no =(req.param('p')) ? req.param('p') : 1;
  var per_page = (req.param('per_page')) ? req.param('per_page') : 10;

  var getCustomersPromise = function(name_q, page_no, per_page) {
      return new Promise(function(fulfill, reject) {
        mongodbService.Customer.find({name: name_q}, without_internal_field)
                               .populate('agent', without_internal_field)
                               .skip((page_no - 1) * per_page)
                               .limit(per_page).exec(function(err, customers) {
        if (err) reject(err);
        else fulfill(customers);
      });
    });
  };

  if (is_all) {
    getAllCustomersPromise().done(fulfill, reject);
  } else {
    getCustomersPromise(name_q, page_no, per_page).done(fulfill, reject);
  }
};

exports.getContactRecords = function (req, res) {
  var fulfill = function(contactRecords) {
    res.json(contactRecords);
  }
  var reject = function(err) {
    res.json({error: err});
  }

  var is_all = (req.param('all')) ? true : false;
  var page_no =(req.param('p')) ? req.param('p') : 1;
  var per_page = (req.param('per_page')) ? req.param('per_page') : 10;

  var getAllContactRecordsPromise = function() {
      return new Promise(function(fulfill, reject) {
        mongodbService.ContactRecord.find({}).exec(function(err, contactRecords) {
        if (err) reject(err);
        else fulfill(contactRecords);
      });
    });
  };

  var getContactRecordsPromise = function(page_no, per_page) {
      return new Promise(function(fulfill, reject) {
        mongodbService.ContactRecord.find({}, {_id: 0, __v: 0})
                                    .populate('agent', without_internal_field)
                                    .populate('customer', without_internal_field)
                                    .skip((page_no - 1) * per_page)
                                    .limit(per_page).exec(function(err, contactRecords) {
        if (err) reject(err);
        else fulfill(contactRecords);
      });
    });
  };

  if (is_all) {
    getAllContactRecordsPromise().done(fulfill, reject);
  } else {
    getContactRecordsPromise(page_no, per_page).done(fulfill, reject);
  }
};