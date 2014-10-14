var model = require('./model.js');

exports.addAgent = function (newAgent, callback) {
  models['Agent'].create(newAgent, callback);
};

exports.getAllAgents = function(callback) {
  models['Agent'].find({}, callback);
};

exports.getAgentById = function(agentId, callback) {
  models['Agent'].findById(agentId).populate('customers').exec(callback);
};

exports.getCustomerById = function(customerId, callback) {
  models['Customer'].findById(customerId).populate('agent').exec(callback);
};

exports.updateAgentById = function(agentId, updatedInfo, callback) {
  models['Agent'].findByIdAndUpdate(agentId, updatedInfo, callback);
};

exports.getContactHistoryByAgentIdAndCustomerId = function(agentId, customerId, callback) {
  models['ContactHistory'].where('agent').equals(agentId)
                          .where('customer').equals(customerId)
                          .exec(callback);
};

exports.getContactHistoryById = function(contactHistoryId, callback) {
  models['ContactHistory'].findById(contactHistoryId)
                          .populate('agent')
                          .populate('customer')
                          .exec(callback);
};

exports.addContactHistory = function(newContactHistory, callback) {
  models['ContactHistory'].create(newContactHistory, callback);
};