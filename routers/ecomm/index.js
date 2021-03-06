var express = require('express');
var router = express.Router();

var businessService = require('../../business_service/business_service.js');
var managerFacade = businessService.managerFacade;
var agentFacade = businessService.agentFacade;
var customerFacade = businessService.customerFacade;

router.get('/', function (req, res) {
  res.render('ecommHome');
});

router.get('/about', function (req, res) {
  res.render('ecommAbout');
});

/////////////////////
// Ecommerce-Manager Facade //
/////////////////////
router.get('/managers/products', managerFacade.showProductsPage);
router.get('/managers/createProduct', managerFacade.createProductsPage);
router.get('/managers/product/:productId', managerFacade.showProductDetail);

/////////////////////
// Ecommerce-Customer Facade //
/////////////////////
router.get('/customers/products', customerFacade.showProductsPage);
router.get('/customers/product/:productId', customerFacade.showProductDetail);
router.get('/customers/shoppingCarts', customerFacade.showShoppingCarts);
router.get('/customers/viewStats', customerFacade.showViewStats);

module.exports = router;
