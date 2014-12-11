var customerApp = angular.module('crmCustomerApp',[]);
var ecommCustomerApp = angular.module('ecommCustomerApp', []);

customerApp.controller('showDetailController', ['$scope', '$http', '$window', '$location', function($scope, $http, $window, $location) {
  $scope.customerId = $location.absUrl().split("/")[4];
  $http.get('/api/v1.00/entities/customers/' + $scope.customerId)
    .success(function(data, status, headers, config) {
      $scope.customer = data.data;
      data.links.forEach(function(link){
        if (link.rel == 'agent')
          $scope.agentLink = link.href;
      });
      $http.get($scope.agentLink)
        .success(function(data, status, headers, config) {
          $scope.agent = data.data;
          $http.get('/api/v1.00/entities/contact_records?q=customer=' + $scope.customerId + ',agent=' + $scope.agent._id)
            .success(function(data, status, headers, config) {
              $scope.contact_records = data.data;
            })
            .error(function(data, status, headers, config) {
              $scope.errorStatus = status;
              $scope.errorData = data;
              $window.alert("Status: " + status + ", " + data);
            });
      })
      .error(function(data, status, headers, config) {
        $scope.errorStatus = status;
        $scope.errorData = data;
        $window.alert("Status: " + status + ", " + data);
      });
    })
    .error(function(data, status, headers, config) {
      $scope.errorStatus = status;
      $scope.errorData = data;
      $window.alert("Status: " + status + ", " + data);
    });
  $scope.customerViewEdit = function(customerId) {
    $window.location.href = "/customers/" + customerId + "/edit";
  };
}]);

customerApp.controller('editDetailController', ['$scope', '$http', '$window', '$location', function($scope, $http, $window, $location) {
  $scope.customerId = $location.absUrl().split("/")[4];
  $http.get('/api/v1.00/entities/customers/' + $scope.customerId)
    .success(function(data, status, headers, config) {
      $scope.customer = data.data;
    })
    .error(function(data, status, headers, config) {
      $scope.errorStatus = status;
      $scope.errorData = data;
      $window.alert("Status: " + status + ", " + data);
    });
  $scope.editCustomerSubmit = function(customerId, name, phone, email, location) {
    var data = {name: name, phone: phone, email: email, location: location};
    $http({
      url: '/api/v1.00/entities/customers/' + $scope.customerId,
      method: 'PUT',
      data: data})
      .success(function(data, status, headers, config) {
        $window.location.href="/customers/" + customerId;
      })
      .error(function(data, status, headers, config) {
        $scope.errorStatus = status;
        $scope.errorData = data;
        $window.alert("Status: " + status + ", " + data);
      });
  };
  $scope.returnToCustomer = function(customerId) {
    $window.location.href = "/customers/" + customerId;
  };
}]);

ecommCustomerApp.controller('retrieveProductController', ['$scope', '$http', '$window', '$location', function($scope, $http, $window, $location) {
  $scope.categoryChoice = 'All';
  $scope.filterCategorys = [
    {name: 'all'},
    {name: 'music'},
    {name: 'book'},
    {name: 'cd'}
  ];

  $scope.searchKey = '';
  $http.get('/api/v1.00/entities/products?category=all')
    .success(function(data, status, headers, config) {
      $scope.products = [];
      data.data.forEach(function(product){
        var productsAttributes = {};
        for (key in product) {
          if (key!= 'id' && key!= 'links' && key!= 'Name'){
            productsAttributes[key] = product[key];
          }
        }
        $scope.products.push({Name: product['Name'], productsAttributes: productsAttributes});
      });

    })
    .error(function(data, status, headers, config) {
      $scope.errorStatus = status;
      $scope.errorData = data;
      $window.alert("Status: " + status + ", " + data);
    });
  $scope.productFilter = function(product_category, searchKey) {
    $http.get('/api/v1.00/entities/products?category=' + $scope.categoryChoice.name + '&searchKey=' + $scope.searchKey)
      .success(function(data, status, headers, config) {
        $scope.products = data.products;
      })
      .error(function(data, status, headers, config) {
        $scope.errorStatus = status;
        $scope.errorData = data;
        $window.alert("Status: " + status + ", " + data);
      });
  }
  $scope.productSearch = function(product_category, searchKey) {
    $http.get('/api/v1.00/entities/products?category=' + $scope.categoryChoice.name + '&searchKey=' + $scope.searchKey)
      .success(function(data, status, headers, config) {
        $scope.products = data.products;
      })
      .error(function(data, status, headers, config) {
        $scope.errorStatus = status;
        $scope.errorData = data;
        $window.alert("Status: " + status + ", " + data);
      });
  };
  $scope.productDetail = function(product_id) {
    $window.location.href = "/ecomm/customer/Product/" + product_id;
  };
}]);

ecommCustomerApp.controller('productDetailController', ['$scope', '$http', '$window', '$location', function($scope, $http, $window, $location) {
  $scope.productId = $location.absUrl().split("/")[6];
  $http.get('/api/v1.00/entities/product/' + $scope.productId)
    .success(function(data, status, headers, config) {
      $scope.shortDescription = data.data.shortDescription;
      $scope.longDescription = data.data.longDescription;
      $scope.sellerComments = data.data.sellerComments;
      $scope.imageLink = data.data.imageLink;
    })
    .error(function(data, status, headers, config) {
      $scope.errorStatus = status;
      $scope.errorData = data;
      $window.alert("Status: " + status + ", " + data);
    });
  $scope.getProducts = function(){
    $window.location.href="/ecomm/customer/products";
  };
}]);
