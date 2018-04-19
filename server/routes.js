/**
 * Created by Academy
 */
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();
var UserController=require('./controllers/UserController');
var ProductController=require('./controllers/ProductController');

module.exports = function (app) {
  app.all('/', function (req, res) {
    var __dirname='./public/pages/new/';
      res.sendFile('index.html', { root: __dirname });
    });

  app.all('/home/', function (req, res) {
    var __dirname='./public/pages/';
    res.sendFile('index.html', { root: __dirname });
  });

  //Product routes
  //Add the routes for the 
  //rest apis you created in the controllers
  
//route for /products GET endpoint to fetch 
//the list of products stored in db
app.get("/products", ProductController.listProducts)

//route for GET endpoint to fetch the product Image
app.get("/product/:id/image", ProductController.fetchProductImg)

//route for POST endpoint to save the order in Order collection of db
app.post("/placeOrder", ProductController.saveOrder)

};