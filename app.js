//jshint esversion:6

const express=require("express");
const bodyparser=require("body-parser");
const mongoose=require("mongoose");
const date=require(__dirname+"/date.js");
const lodash=require("lodash");


// let items=["buy food","cook food","eat food"];
let workItems=[];

const app=express();
app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://admin-aditya:adi1234@cluster0-oqycq.mongodb.net/todolistDB",{useNewUrlParser:true,useUnifiedTopology: true,useFindAndModify: false})
const itemSchema=new mongoose.Schema({
  name:String,
});

const Item=mongoose.model("Item",itemSchema);

const buyFood=new Item({
  name:"Buy Food",
});

const cookFood=new Item({
  name:"Cook Food",
});

const eatFood=new Item({
  name:"Eat Food",
});

const defaultItem=[buyFood,cookFood,eatFood];

const listSchema=new mongoose.Schema({
  name:String,
  items:[itemSchema],
});

const List=new mongoose.model("List",listSchema);





app.get("/",function(req,res){

  // let day=date.getDate();

  Item.find({},function(err,items){
    if(items.length===0){
      Item.insertMany(defaultItem,function(err){
        if(err){
          console.log("error");
        }else{
          console.log("document saved ");
        }
      });
      res.redirect("/");
    }else{
        res.render('list',{listTitle:"Today",items:items});
      }

  });


});

app.post("/",function(req,res){
  // console.log(req.body);
   const itemName=req.body.new;
   const listName=req.body.button;
   // console.log(listName);


   const newItem= new Item({
     name:itemName,
   });

   if( listName === "Today"){
     newItem.save();
     res.redirect("/");
   } else {
      List.findOne({name:listName},function(err,list){
        list.items.push(newItem);
        list.save();
        res.redirect("/"+listName);
      });
   }





   // if(req.body.button==="work"){
   //   workItems.push(newitem);
   //   res.redirect("/work");
   // }else{
   //   items.push(newitem);
   //   res.redirect("/");
   // }


});

app.post("/delete",function(req,res){
  const checkedItemID = req.body.checkbox;
  const listName=req.body.listName;
  if(listName==="Today"){
    Item.findByIdAndRemove(checkedItemID,function(err){
      if(err){
        console.log(err);
      }else{
        console.log("item is delted");
      }
    });
    res.redirect("/");

  }else{
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemID}}},function(err,list){
      if(!err){
          res.redirect("/"+listName);
      }

    });

  }

});

app.get("/:customListName",function(req,res){
  const customListName =lodash.capitalize( req.params.customListName);

  List.findOne({name:customListName},function(err,list){
    if(!list){
      const list=new List({
        name:customListName,
        items:defaultItem,
      });
      list.save();
        res.render("/" + customListName);

    }else{
        res.render('list',{listTitle:customListName,items:list.items});
    }
  })

})

app.get("/work",function(req,res){
  res.render("list",{day:"work",items:workItems});
});

app.post("/work",function(req,res){
  let workitem=req.body.new;
  workItems.push(workitem);
  res.redirect("/work");
});

app.get("/about",function(req,res){
  res.render("about");
});

const PORT = process.env.PORT || 5000


app.listen(PORT,function(){
  console.log("server start listening on port 3000");
});
