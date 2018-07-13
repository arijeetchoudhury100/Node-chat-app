var moment = require('moment');
//january 1st 1970 00:00:00 am :utc timestamp
//timestamp in javascript is in milisecond

// var date = new Date();
// console.log(date.getMonth());


// var date = moment();
//var createdAt = 1234786876868;
var someTimestamp = moment().valueOf();
console.log(someTimestamp);
var date = moment();
console.log(date.format('MMM Do, YYYY'));
console.log(date.format('h:mm:ss a'));
console.log(date.format('h:mm a'));
