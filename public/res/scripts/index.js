angular.module('ProductService', ['ngResource']).factory('Product', function($resource) {
    return $resource('/:entity/:id', {
        id: '@id'
    }, {
        fetch: {
            method: 'GET',
            params: {
                entity: 'product'
            }
        },
        placeOrder: {
            method: 'POST',
            params: {
                entity: 'placeOrder'
            }
        }
    });
});

var Capstone = angular.module('Capstone', ['ProductService','ngRoute']);

//Capstone modeule route configuration using ng-view
function CapstoneRouteConfig($routeProvider, $locationProvider) {
    var app_dir = '../../pages/new';

    $routeProvider.otherwise('/login');

    $routeProvider
        .when('/list', {
            templateUrl: app_dir + '/list.html',
            controller: productCtrl
        }).when('/cart', {
        templateUrl: app_dir + '/cart.html',
        controller: cartCtrl
    }).when('/login', {
        templateUrl: app_dir + '/login.html',
        controller: productCtrl
    }).when('/productDetails/:id', {
        templateUrl: app_dir + '/product-details.html',
        controller: detailsCtrl
    })
}
Capstone.config(CapstoneRouteConfig);

//Product Controller
function productCtrl(Product, $scope, $http, $filter,$timeout,$location,$sce,$rootScope) {
    $scope.catArray=[];

    //Function to Filter the Products
    $scope.filterFunction=function(Products,categories){
        return Products.filter(function(product) {
            if (categories.indexOf(product.category) != -1) {
                return true;
            }
            return false;
        });
    };

    //Function to reset the Filter
    $scope.removeFilter=function(item){
        var index=$scope.catArray.indexOf(item);
        $scope.catArray.splice(index,1);
        if($scope.catArray.length==0){
            $scope.Products=$scope.filterData;
        }
        else{
            $scope.Products=$scope.filterFunction($scope.filterData,$scope.catArray)
        }
    };

    //scope variables
    $scope.categories = [];
    $scope.filterData = [];

    //Populates Products
    $scope.getProducts = function() {
        $http({
            method: 'GET',
            url: '/products'
        }).then(function successCallback(response) {
            console.log(response);
            $scope.Products = response.data;
            $scope.filterData = angular.copy($scope.Products);
            $scope.categories = [];
            $scope.Products.forEach(function(data) {
                if ($scope.categories.indexOf(data.category) == -1) {
                    $scope.categories.push(data.category)
                }
            })
        }, function errorCallback(response) {

        });
    };
    $scope.getProducts();

    //update flag
    $scope.update = false;

    //function to edit the product
    $scope.editProduct = function(item) {
        $scope.data=angular.copy(item);
        $scope.update = true;
    };

    //flag for status message
    $scope.statusMsg = '';

    //Helper Functio For Drag end event
    $scope.insertFn=function(id){
        $scope.catArray=[];
        if($scope.catArray.indexOf(id)==-1)
            $scope.catArray.push(id);
        $scope.Products=$scope.filterFunction($scope.filterData,$scope.catArray)
    };

    $scope.resetFilter=function(){
        $scope.catArray=[];
        $scope.Products = $scope.filterData;
    }

    $scope.cartItems=[];
    $scope.cartItemsCheck=[];
    if(localStorage.getItem('cartItems'))
    $scope.cartItems=JSON.parse( localStorage.getItem('cartItems'));
    $scope.cartItems.forEach(function(item){
        $scope.cartItemsCheck.push(item._id)
    })
    $rootScope.cartItems= $scope.cartItems;

    $scope.addToCart=function(item){

        if($scope.cartItemsCheck.indexOf(item._id)==-1){
            $scope.cartItemsCheck.push(item._id)
            $scope.cartItems.push(item)
            $scope.cartmessage='Success! item added to cart'
            localStorage.setItem( 'cartItems', JSON.stringify( $scope.cartItems ) );
        }
        else{
            $scope.cartmessage='item already added to the cart'
        }
        $('#exampleModal').modal('show')
        //localStorage.cartItems=$scope.cartItems;

    }

    $scope.showDetails=function(id){
        $location.path('/productDetails/'+id)
    }

}

function cartCtrl($scope,$timeout,$rootScope,$location,Product){
    console.log()
    $scope.checkOut={}
    $scope.checkout=false;
    $scope.cartItems=[];
    if((localStorage.getItem('cartItems')))

    $scope.cartItems=JSON.parse( localStorage.getItem('cartItems'));
    $rootScope.cartItems= $scope.cartItems;


    $scope.getTotal=function(){
        $scope.subTotal=0;
        if($scope.cartItems.length>0)
        $scope.cartItems.forEach(function(item){
            $scope.subTotal+=item.quantity*item.price;
        })

    };

    $timeout(function(){
        $scope.getTotal()

    },500)
    $scope.checkOutDetails={};
    
    $scope.nextpage=function(callFrom,checkoutObj){
        if(callFrom=='continue'){
            if($.isEmptyObject(checkoutObj)||$.isEmptyObject(checkoutObj.address)){
                $scope.message='Please fill the Delivery details'
                $('#cartModal').modal('show');
            }
            else{
                if(!checkoutObj.name){
                    $scope.message='Please enter name';
                    $('#cartModal').modal('show');
                }
                if(!checkoutObj.address.line1){
                    $scope.message='Please enter your address';
                    $('#cartModal').modal('show');
                }
                else if(!checkoutObj.address.country){
                    $scope.message='Please enter country';
                    $('#cartModal').modal('show');
                }
                else  if(!checkoutObj.address.state){
                    $scope.message='Please enter state';
                    $('#cartModal').modal('show');
                }
                else if(!checkoutObj.address.pinCode){
                    $scope.message='Please enter a valid pinCode';
                    $('#cartModal').modal('show');
                }
                else{
                    $scope.checkout=!$scope.checkout;
                    $scope.checkOutDetails=checkoutObj;
                }
            }
        }
        else{
            $scope.checkout=!$scope.checkout;
        }
    };

    $scope.orderCompleted=false;
    $scope.subTotal=0;

    $scope.clearCart=function(){
        $scope.checkOutDetails.name=($.trim( $scope.checkOutDetails.name))
        $scope.checkOutDetails.address.line1= ($.trim( $scope.checkOutDetails.address.line1))
        $scope.checkOutDetails.address.country= ($.trim( $scope.checkOutDetails.address.country))
        $scope.checkOutDetails.address.state= ($.trim( $scope.checkOutDetails.address.state))
        $scope.checkOutDetails.address.pinCode=($.trim( $scope.checkOutDetails.address.pinCode))
        $scope.checkOutDetails.total=$scope.subTotal;
        $scope.checkOutDetails.date=new Date();
            Product.placeOrder({},{items:$scope.cartItems,checkoutDetails:$scope.checkOutDetails},function(res){
                console.log(res)
            })
        $scope.orderCompleted=true;
        $scope.message='Your order will be delivered Shortly'
        $('#cartModal').modal('show');
        localStorage.setItem('cartItems','')
        $timeout(function(){
            $scope.clearModal();
        },1000)
    };

    $scope.clearModal=function(){
        $('#cartModal').modal('hide')
        $timeout(function(){
            $location.path('/list')
        },500)
    }
}

function detailsCtrl($scope,Product,$routeParams){
    Product.fetch({id:$routeParams.id},function(res){
        $scope.product=res.data;
        console.log(res)
    })
}
