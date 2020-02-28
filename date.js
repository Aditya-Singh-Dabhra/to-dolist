//jshint esversion:6


exports.getDate=function(){
let today=new Date();
// var weekday=["sunday","monday","tuesday","wednesday","thrusday","friday","saturday"];
// var day=weekday[currentday];
let option={
  weekday:"long",
  day:"numeric",
  month:"long"
};


let day=today.toLocaleDateString("en-US",option);
return day;
}

exports.getday=function (){
let today=new Date();
// var weekday=["sunday","monday","tuesday","wednesday","thrusday","friday","saturday"];
// var day=weekday[currentday];
let option={
  weekday:"long",

};


let day=today.toLocaleDateString("en-US",option);
return day;
}
