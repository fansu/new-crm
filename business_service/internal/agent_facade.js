var crmService = require('./crm_service.js');

exports.showProfileAPI = function (req, res) {
  var agentId = req.param('agentId');
  crmService.retrieveAgentById(agentId, function(err, agent) {
    if (err) {
      res.status(500).send({ error: "Database Error." });
    } else {
      crmService.retrieveCustomersByAgentId(agentId, function(err, customers) {
        if (err) {
          res.status(500).send({ error: "Database Error." });
        } else {
          var data = {
            agent: agent,
            customers: customers
          };
          res.json(data);
        }
      });
    }
  });
};
exports.showProfile = function (req, res) {
  res.render('agents/retrieve');
}

exports.showCustomerByCustomerId = function (req, res) {
  res.render('customers/agent_view/retrieve');
}
exports.showCustomerByCustomerIdAPI = function (req, res) {
  var agentId = req.param('agentId');
  var customerId = req.param('customerId');
  crmService.retrieveCustomerById(customerId, function(err, customer) {
    if (err) {
      res.status(500).send({ error: "Database Error." });
    } else if (customer == null) {
      res.status(400).send({ error: "Customer doesn't exist."});
    } else {
      crmService.retrieveContactHistoryByAgentIdAndCustomerId(agentId, customerId, function(err, contactHistory) {
        var data = {
          agent: customer.agent,
          customer: customer,
          contact_history: contactHistory
        };
        res.json(data);
      });
    }
  });
};

exports.showProfileUpdatePageAPI = function (req, res) {
  var agentId = req.param('agentId');
  crmService.retrieveAgentById(agentId, function(err, agent) {
    if (err) {
      res.status(500).send({ error: "Database Error." });
    } else if (agent == null) {
      res.status(400).send({ error: "Agent doesn't exist." });
    } else {
      res.json({agent: agent});
    }
  });
};
exports.showProfileUpdatePage = function (req, res) {
  res.render('agents/update');
};

exports.updateProfileAPI = function (req, res) {
  var agentId = req.param('agentId');
  var updateInfo = {name: req.param('name'), phone: req.param('phone'), email: req.param('email')};
  crmService.updateAgentById(agentId, updateInfo, function(err, agent) {
    if (err) {
      res.status(500).send({ error: "Database Error." });
    } else {
      res.json({agentId: agentId});
    }
  });
};

exports.showCustomerCreationPage = function (req, res) {
  var agentId = req.param('agentId');
  res.render('customers/agent_view/create');
};

exports.createCustomerAPI = function (req, res) {
  var customer = {
    name : req.param('name'),
    email : req.param('email'),
    phone : req.param('phone'),
    agent : req.param('agentId')
  };

  crmService.createCustomer(customer, function (err) {
    if (err) {
      res.status(500).send({ error: "Database Error." });
    } else {
      res.redirect('/agent/' + req.param('agentId'));
    }
  });
};

exports.showCustomerUpdatePage = function (req, res) {
  var customerId = req.param('customerId');
  var agentId = req.param('agentId');

  crmService.retrieveCustomerById(customerId, function (err, customer) {
    if (err) {
      res.status(500).send({ error: "Database Error." });
    } else {
      res.render('customers/agent_view/update', {
        customer: customer,
        customerId: customerId,
        agentId: agentId
      });
    }
  });
};

exports.updateCustomerAPI = function (req, res) {
  var customerId = req.param('customerId');
  var agentId = req.param('agentId');
  var newCustomerInfo = req.body;

  crmService.updateCustomerById(customerId, newCustomerInfo, function(err, updatedCustomerInfo) {
    if (err) {
      res.status(500).send({ errpr: "Database Error."});
    } else if (updatedCustomerInfo == null) {
      res.status(404).send({ error: "Customer doesn't exist."});
    } else {
      res.send({ redirect: '/agent/'+agentId+'/customer/'+customerId });
    }
  });
};

exports.removeCustomerByIdAPI = function (req, res) {
  var customerId = req.param('customerId');
  var agentId = req.param('agentId');

  crmService.deleteCustomerById(customerId, function(err) {
    if (err) {
      res.status(500).send({ error: "Database Error." });
    } else {
      res.send({redirect: '/agent/'+agentId});
    }
  });
};

exports.showContactRecordCreationPage = function (req, res) {
  var agentId = req.param('agentId');
  var customerId = req.param('customerId');

  res.render('contact_history/create', {
    agentId: agentId,
    customerId: customerId
  });
};

exports.createContactRecordAPI = function (req, res) {
  var newContactHistory = {
    time : req.param('time'),
    data : req.param('data'),
    textSummary : req.param('textSummary'),
    model : req.param('model'),
    agent: req.param('agentId'),
    customer: req.param('customerId'),
  };
  var agentId = req.param('agentId');
  var customerId = req.param('customerId');

  crmService.createContactHistory(newContactHistory, function(err, contactHistory) {
    if (err) {
      res.status(500).send({ error: "Database Error." });
    } else {
      res.send({ redirect: '/agent/'+agentId+'/customer/'+customerId });
    }
  });
};

exports.retrieveContactRecordByIdAPI = function (req, res) {
  var contactHistoryId = req.param('contactHistoryId');
  crmService.retrieveContactHistoryById(contactHistoryId, function (err, contactHistory) {
    if (err) {
      res.status(500).send({ error: "Database Error." });
    } else {
      res.json({
        contact_history: contactHistory,
        agentId: contactHistory['agent'],
        customerId: contactHistory['customer']
      });
    }
  });
};

exports.retrieveContactRecordById = function (req, res) {
  res.render('contact_history/retrieve');
}
