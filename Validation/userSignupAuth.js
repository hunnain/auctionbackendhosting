const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data){
  //all the errors put here after checking
  let errors = {};


  //this checks all the data coming from server.js file is empty or not
  data.firstName = !isEmpty(data.firstName) ? data.firstName : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.lastName = !isEmpty(data.lastName) ? data.lastName : '';
  data.mobileNo = !isEmpty(data.mobileNo) ? data.mobileNo : '';


  if(!validator.isLength(data.firstName , {min : 3 , max : 15})){
    errors.firstName = 'First Name  must be  between 3 and 15 characters';
  }
  if(!validator.isEmail(data.email)){
    errors.email = 'Email is Invalid';
  }
  if(isEmpty(data.password)){
    errors.password = 'Password is Required';
  }
  if(isEmpty(data.lastName)){
    errors.lastName = 'Last Name is Required';
  }
  if(isEmpty(data.mobileNo)){
    errors.mobileNo = 'User Id is Required';
  }

  
  return {
    errors,
    //if it is true it means errors doesnt occurs
    isValid : isEmpty(errors)
  }
}