var managerApp = angular.module('crmManagerApp', []);
var ecommManagerApp = angular.module('ecommCustomerApp', []);

managerApp.factory('uuid2', [
  function() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
                 .toString(16).substring(1);
    };
    return {
      newuuid: function() {
      // http://www.ietf.org/rfc/rfc4122.txt
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
          s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = "-";
      return s.join("");
      },
      newguid: function() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
               s4() + '-' + s4() + s4() + s4();
      }
    }
  }
]);

managerApp.controller('agentIndexController', ['$scope', '$http', '$window', function($scope, $http, $window) {
  $http.get('/api/v1.00/entities/agents')
    .success(function(data, status, headers, config) {
       $scope.agents = data.data;
  });
  $scope.createAgent = function() {
    $window.location.href="/agents/create";
  };
  $scope.agentDetail = function(id) {
    $window.location.href="/agents/" + id;
  }
}]);

managerApp.controller('agentCreateController', ['$scope', '$http', '$window', 'uuid2', function($scope, $http, $window, uuid2) {
  $scope.uuid = uuid2.newuuid();
  $scope.createAgentSubmit = function(agent_name, agent_phone, agent_email, agent_location) {
    var data = {name: agent_name, phone: agent_phone, email: agent_email, location: agent_location};
    $http({
      url: '/api/v1.00/entities/agents',
      method: 'POST',
      headers: {'nonce' : 'POST' + JSON.stringify(data) + $scope.uuid},
      data: data})
      .success(function(data, status, headers, config) {
       $window.location.href="/agents";
      })
      .error(function(data, status, headers, config) {
        $scope.errorStatus = status;
        $scope.errorData = data;
        $window.alert("Status: " + status + ", " + data);
      });
  };
  $scope.createAgentCancel = function() {
    $window.location.href="/agents";
  };
}]);

ecommManagerApp.controller('retrieveProductController', ['$scope', '$http', '$window', '$location', function($scope, $http, $window, $location) {
  $http.get('/api/v1.00/ecomm/entities/products')
    .success(function(data, status, headers, config) {
      $scope.products = data.products;
    })
    .error(function(data, status, headers, config) {
      $scope.errorStatus = status;
      $scope.errorData = data;
      $window.alert("Status: " + status + ", " + data);
    });
  $scope.createProduct = function() {
    $window.location.href = "/ecomm/manager/createProduct";
  }
}]);

ecommManagerApp.controller('addProductController', ['$scope', '$http', '$window', '$location', function($scope, $http, $window, $location) {
  $scope.templates = [
    {name: 'Books'},
    {name: 'No template'}
  ];
  $scope.templateChange = function(template) {
    $scope.fields=[];
    if (template.name == 'Books') {
       $scope.fields = [
          {field_num: '1', attr: 'Name', read: 'true', type: "text", data: '', name_place: 'Name',field_place: 'Name'},
          {field_num: '2', attr: 'Price', read: 'true', type: "number", data: '', name_place: 'Price',field_place: 'Price'},
          {field_num: '3', attr: 'ISBN', read: 'true', type: "text", data: '', name_place: 'ISBN',field_place: 'ISBN'}
        ];
    } else if (template.name == 'No template') {
        $scope.fields = [
          {field_num: '1', attr: '', read: "false", type: "text", data: '', name_place: 'Field Name', field_place: 'Field value'},
          {field_num: '2', attr: '', read: "false", type: "text", data: '', name_place: 'Field Name', field_place: 'Field value'},
          {field_num: '3', attr: '', read: "false", type: "text", data: '', name_place: 'Field Name', field_place: 'Field value'}
        ];
    }
  };

  $scope.createProductSubmit = function(product_id, fields) {
    var post_data = {
      Id: product_id, 
      Field0: fields[0].attr, 
      Field1: fields[1].attr, 
      Field2: fields[2].attr,
      Value0: fields[0].data, 
      Value1: fields[1].data, 
      Value2: fields[2].data };
    $http({
      url: '/api/v1.00/ecomm/entities/products', 
      method: 'POST', 
      headers: {'nonce' : 'POST' + JSON.stringify(post_data) + $scope.uuid},
      data: post_data})
      .success(function(data, status, headers, config) {
        $window.location.href="/ecomm/manager/products";
      })
      .error(function(data, status, headers, config) {
        $scope.errorStatus = status;
        $scope.errorData = data;
        $window.alert("Status: " + status + ", " + data);
      });
  }
  $scope.createProductCancel = function() {
    $window.location.href = "/ecomm/manager/products";
  }

}]);