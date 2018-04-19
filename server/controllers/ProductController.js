/**
 * Created by Academy
 */
var Product = require('../models/Product');
var Order = require('../models/Order');
var HttpStatus = require('http-status');
var Validation = require('./Validation');

//Your controller variable is defined here
var ProductController = require('./ProductController.js');

//use exec to run a shell script for example
// if you want to create a folder then you can run exec('mkdir folderpath', callback function) 
var exec = require('child_process').exec;

//User node-fs to create files in a given folderr
var fs = require('node-fs');


//Implement the following functionalities

//save method to Save a new Product
//saveProducts method to seed the database with initial data
exports.saveProducts= function() {
    console.log('Inside saveProducts method');
    //Inserting Product Mini Tiffin in db
    var product1 = new Product();
    product1.name= "Mini Tiffin",
    product1.category="South Indian",
    product1.description= "Rava Kesari, mini idly 5pcs, rava kichadi, mini masala dosai",
    product1.price= "399",
    product1.productImg= {fileName:"product",filePath: "./public/images/",fileType: "png"}

    product1.save(function (err) {  
        if (err){ 
            console.log("Product Mini Tiffin already Created!");
        }else{
            console.log("Product Mini Tiffin Created !");
    }
    });
    
    //Inserting product Big Boy Burger
    var product2 = new Product();
    product2.name= "Big Boy Burger",
    product2.category="American",
    product2.description= "Double patty burger with cheese and fries",
    product2.price= "500",
    product2.productImg= {fileName:"product",filePath: "./public/images/",fileType: "png"}

    product2.save(function (err) {  
        if (err){ 
            console.log("Product Big Boy Burger already Created!");
        }else{
            console.log("Product Big Boy Burger Created !");
    }
    });
    
    //Inserting product Melanzane Parmagianna
    var product3 = new Product();
    product3.name= "Melanzane Parmagianna",
    product3.category="Italian",
    product3.description= "Baked layers of sliced aubergine with fresh basil, mozarella, tomato sauce, sprinkled with parmesan cheese",
    product3.price= "450",
    product3.productImg= {fileName:"product",filePath: "./public/images/",fileType: "png"}

    product3.save(function (err) {  
        if (err){ 
             console.log("Product Melanzane Parmagianna already Created!");
        }else{
             console.log("Product Melanzane Parmagianna Created !");
    }
    });

    //Inserting product Sebze Kefta Tagine
    var product4 = new Product();
    product4.name= "Sebze Kefta Tagine",
    product4.category="Mediterranean",
    product4.description= "Cottage cheese mince with garlic, fresh coriander and parsley, cinnamon is rolled into balls and cooked in a tomato and onion sauce",
    product4.price= "532",
    product4.productImg= {fileName:"product",filePath: "./public/images/",fileType: "png"}

    product4.save(function (err) {  
        if (err){ 
             console.log("Product Sebze Kefta Tagine already Created!");
        }else{
             console.log("Product Sebze Kefta Tagine Created !");  
        }
});
}

//To set a default image for a new product implement and call
//saveProductImg to Save a default image for it
//default image: ./public/images/product.png
//create a folder in the path ./public/images/Product
//in the new folder create the image with 
//filename: _id+"_Product."+imageextension
//eg: if uploaded file is image.jpg for item with _id: abcdefghij
//then filename: abdefghij_Product.jpg 

//list method to List all products in db
exports.listProducts= function(request,response) {
    console.log('Display list of Products stored in db');
    Product.find(function (err, products) {  
        if (err) {  
            response.send(err);  
        }  
        response.send(products);  
    });  
}  

//fetchProductImg method to Fetch the productImage of a given product
exports.fetchProductImg= function(request,response) {
    console.log('Fetching the productImage of a given product Id'+request.params.id);
    Product.findById(request.params.id, function (err, products) {  
        if (err) {  
            response.send(err);  
        } 
      var __dirname="./public/images/";
      response.sendFile('product.png', { root: __dirname }); 
    });   
}  

//Save the incoming order to the Order collection
exports.saveOrder= function(request,response) {
    console.log('Saving the incoming order to the Order collection');

    var order = new Order({
    items: request.body.items,
    checkoutDetails: request.body.checkoutDetails
    });

    order.save(function (err) {  
        if (err){
            response.send(err);
        }else{
        console.log("Order has been placed successfully!!!");
        response.send({ message: 'Order has been placed successfully!!!' })  
        }
    });
}
