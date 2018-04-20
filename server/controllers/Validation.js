/**
 * Created by Academy
 */

//Create a Validation method
//Capture any schema validation errors
//Check the error type and 
//Return a meaningfull message that the user will be able to understand 

//Name Validator to check if the user has provided name else 
//return error message.
exports.nameValidator=function(){
    [function(name){
        return name.length>0;
    }, 'Path `checkoutDetails.name` is required.'];
}