var express = require('express');
var router = express.Router();
var InvoiceSubFile = require('../models/invoiceSubFile');
var ReturnsSubFile = require('../models/returnsSubFile');
var User = require('../models/user');
var BatchFermentationIngredients = require('../models/batchFermentationIngredients');
var BlendingTanks = require('../models/blendingTanks');
var BlendingDays = require('../models/blendingDays');
var FinalProductEvaluation = require('../models/finalProductEvaluation');
var Ware = require('../models/ware');
var BatchPackaging = require('../models/batchPackaging')
var Packaging = require('../models/packaging')
var CrushedItems = require('../models/crushedItems');
var Warehouse = require('../models/warehouse');
var SaleStock = require('../models/salesStock');
var Customer = require('../models/customer');
var BatchR = require('../models/batchR');
var BatchRR = require('../models/batchRR');
var FermentationProduct = require('../models/fermentationProduct');
var DrainedProducts = require('../models/drainedProducts');
var BlendedItems = require('../models/blendedItems');
var BatchCooking = require('../models/batchCooking');
var GingerWash = require('../models/gingerWash');
var BatchGingerWash = require('../models/batchGingerWash');
var Cooking = require('../models/cooking');
var DrainedTanks = require('../models/drainedTanks');
var GingerCrush = require('../models/gingerCrush');
var BatchGingerCrush = require('../models/batchGingerCrush');
var Ingredients = require('../models/ingredients');
var FinalProduct = require('../models/finalProduct');
var Processed = require('../models/ingredients');
var Fermentation = require('../models/fermentation');
var BatchFermentation = require('../models/batchFermentation');
var InvoiceSubBatch= require('../models/invoiceSubBatch');
var RtnsSubBatch= require('../models/rtnsSubBatch');
var SaleStock = require('../models/salesStock');
var BatchD = require('../models/batchD');
var InvoNum = require('../models/invoNum');
var RefNo = require('../models/refNo');
const USB = require("webusb").USB;
var RefNoDisp = require('../models/refNoDisp');
var RefNoSeq = require('../models/refNoSeq');
var RefNoSeqDisp = require('../models/refNoSeqDisp');
var RepoFiles = require('../models/repoFiles');
var StockV = require('../models/stockV');
var StockVoucher = require('../models/stockVoucher');
var StockD = require('../models/stockD');
var StockR = require('../models/stockR');
var StockRM = require('../models/stockRM');
var RawMat = require('../models/rawMaterials');
var StockRMFile = require('../models/stockRMFile');
var Product = require('../models/product');
var Truck = require('../models/truck');
var SalesList = require('../models/salesList');
const keys = require('../config1/keys')
const stripe = require('stripe')('sk_test_IbxDt5lsOreFtqzmDUFocXIp0051Hd5Jol');
var xlsx = require('xlsx')
const Month =require('../models/month')
var multer = require('multer')
const fs = require('fs-extra')
var path = require('path');
var passport = require('passport');
var moment = require('moment')
var hbs = require('handlebars');
var mongoose = require('mongoose')
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const puppeteer = require('puppeteer')
const jwt = require('jsonwebtoken');
const JWT_KEY = "jwtactive987";
const JWT_RESET_KEY = "jwtreset987";
var bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
var multer = require('multer')
var Axios = require('axios')
var mongodb = require('mongodb');
var FormData = require('form-data')
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
var VoucherNum = require('../models/vouNum');
const { Vonage } = require('@vonage/server-sdk')

const vonage = new Vonage({
  apiKey: "64ff8fb9",
  apiSecret: "F4nr3GVpi9NynJSu"
})
const arr = {}
const arr2 = {}
const arrE ={}
const arrE2 ={}

const admin = require("firebase-admin")

const getMessaging = require("firebase/messaging")
//var serviceAccount = require('../pushnot-f1f03-firebase-adminsdk-nteud-0ad6d1ad7f.json')
const tokenArray = ['crgbFGc4T9vSRU8rY3IwOy:APA91bHI3c9A3Y5Rwrl996k51IBhAAC2RssH9WYD2TVl9HhC8rxawa67h8e0VxxZifdixG4ZyIVTVXGiRQ7chusiq7-Uo7pzFTUMrat10xTy817UBobw02g']
/*admin.initializeApp({
  credential:admin.credential.cert(serviceAccount)
})*/

const arrStatement = {}
let arrStatementR = []
var storageX = multer.diskStorage({
  destination:function(req,file,cb){
      cb(null,'./public/uploads/')
  },
  filename:(req,file,cb)=>{
      cb(null,file.originalname)
  }
})



var uploadX = multer({
  storage:storageX
})

const mongoURI = process.env.MONGO_URL ||'mongodb://0.0.0.0:27017/kambuchaDB';

const conn = mongoose.createConnection(mongoURI);

// Init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});




/* Create storage engine*/
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
        const filename = file.originalname;
  
        const fileInfo = {
          filename: filename,
     
          bucketName: 'uploads'
        };
        resolve(fileInfo);
    });
  }
});


const upload = multer({ storage })


router.get('/prefix',function(req,res){
  let prefix
  Product.find(function(err,docs){
    for(var i = 0;i<docs.length;i++){
      let id = docs[i]._id
      if(docs[i].name == 'kambucha No1'){
        prefix = 'NO1'
      }else if(docs[i].name == 'kambucha No2'){
        prefix = 'NO2'
      }else if(docs[i].name == 'kambucha No3'){
        prefix = 'NO3'
      }else if(docs[i].name == 'kambucha lite'){
        prefix = 'LTE'
      }else if(docs[i].name == 'manyuchi'){
        prefix = 'MNC'
      }

      Product.findByIdAndUpdate(id,{$set:{prefix:prefix}},function(err,tocs){

      })
    }
  })
})


router.get('/rawUpdate',function(req,res){
  RawMat.find(function(err,docs){
    for(var i = 0; i<docs.length;i++){
      let id = docs[i]._id
      RawMat.findByIdAndUpdate(id,{$set:{uniqueMeasure:0}},function(err,locs){

      })
    }
  })
})





router.get('/rawUnit',function(req,res){
  RawMat.find(function(err,docs){
    for(var i = 0; i<docs.length;i++){
      let id = docs[i]._id
      let item = docs[i].item
      let stage = docs[i].stage
      if(item == 'ginger' && stage == 'raw'){
      RawMat.findByIdAndUpdate(id,{$set:{unit:'(kgs)'}},function(err,locs){

      })
    }
    else if(item == 'ginger' && stage == 'wash' ){
      RawMat.findByIdAndUpdate(id,{$set:{unit:'(crates)'}},function(err,locs){

      })
    }


    else if(item == 'ginger' && stage == 'crush' ){
      RawMat.findByIdAndUpdate(id,{$set:{unit:'(drums)'}},function(err,locs){

      })
    }


    else if(item == 'bananas' && stage == 'crush' ){
      RawMat.findByIdAndUpdate(id,{$set:{unit:'(drums)'}},function(err,locs){

      })
    }


    else if(item == 'ginger' && stage == 'cooking' ){
      RawMat.findByIdAndUpdate(id,{$set:{unit:'(tanks)'}},function(err,locs){

      })
    }

    else if(item == 'colour' && stage == 'cooking' ){
      RawMat.findByIdAndUpdate(id,{$set:{unit:'(tanks)'}},function(err,locs){

      })
    }

     else if(item == 'colour' && stage == 'fermentation' ){
      RawMat.findByIdAndUpdate(id,{$set:{unit:'(tanks)'}},function(err,locs){

      })
    }
    else if(item == 'colour' && stage == 'blending' ){
      RawMat.findByIdAndUpdate(id,{$set:{unit:'(tanks)'}},function(err,locs){

      })
    }
    else if(item == 'tea'){
      RawMat.findByIdAndUpdate(id,{$set:{unit:'(bags)'}},function(err,locs){

      })
    }
    else if(item == 'honey'){
      RawMat.findByIdAndUpdate(id,{$set:{unit:'(buckets)'}},function(err,locs){

      })
    }

    else if(item == 'sugar'){
      RawMat.findByIdAndUpdate(id,{$set:{unit:'(bags)'}},function(err,locs){

      })
    }

    else {
      RawMat.findByIdAndUpdate(id,{$set:{unit:'(kgs)'}},function(err,locs){

      })
    }


   


  }
  })
})





router.get('/finalUnit',function(req,res){
  FinalProduct.find(function(err,docs){
    for(var i = 0; i<docs.length;i++){
      let id = docs[i]._id
      let item = docs[i].ingredient
 
      if(item == 'gingerTea' ){
      FinalProduct.findByIdAndUpdate(id,{$set:{unit:'(tanks)'}},function(err,locs){

      })
    }
    else if(item == 'colour'){
      FinalProduct.findByIdAndUpdate(id,{$set:{unit:'(tanks)'}},function(err,locs){

      })
    }


    else if(item == 'sugar'  ){
      FinalProduct.findByIdAndUpdate(id,{$set:{unit:'(bags)'}},function(err,locs){

      })
    }


    else if(item == 'honey' ){
      FinalProduct.findByIdAndUpdate(id,{$set:{unit:'(buckets)'}},function(err,locs){

      })
    }


    

   


  }
  })
})

router.get('/warehouseStock',isLoggedIn,function(req,res){
  var pro = req.user
  //res.render('admin/dash6',{pro:pro})
  Product.find({},function(err,docs){
 Warehouse.find({},function(err,hocs){
  res.render('rStock/dash7',{pro:pro,arr:docs,arr1:hocs})
})
  })
})



router.post('/dashChartStockSub',isLoggedIn,function(req,res){

  
  var stage = req.body.stage
  console.log(stage,'stage')
   var date = req.body.date
   var arr = []
   var id = req.user._id
   let num = req.user.num
   num++
   
  
  
   RawMat.find({stage:stage},function(err,docs) {
    // console.log(docs,'docs')
    /* for(var i = 0;i<docs.length;i++){

    console.log(docs,'docs')
  
        if(arr.length > 0 && arr.find(value => value.stage == docs[i].stage  && value.item == docs[i].item )){
               console.log('true')
              arr.find(value => value.stage == docs[i].stage).massKgs += docs[i].massKgs;
         }else{
  arr.push(docs[i])
         }
  
       
     }*/
    //console.log(arr,'arr')
    console.log(docs,'555')
    res.send(docs)
   })
  
  
  })
  
  
  

  router.post('/dashChartFermentation',isLoggedIn,function(req,res){

  
    var item = req.body.item
    var status = req.body.status
  //console.log(warehouse,'warehouse')
 
   var date = req.body.date
   var arr = []
   var id = req.user._id
   let num = req.user.num
   num++
   
  
  
   BatchFermentation.find({product:item,status:status},function(err,docs) {
    // console.log(docs,'docs')
    /* for(var i = 0;i<docs.length;i++){

    console.log(docs,'docs')
  
        if(arr.length > 0 && arr.find(value => value.stage == docs[i].stage  && value.item == docs[i].item )){
               console.log('true')
              arr.find(value => value.stage == docs[i].stage).massKgs += docs[i].massKgs;
         }else{
  arr.push(docs[i])
         }
  
       
     }*/
    //console.log(arr,'arr')
    console.log(docs,'888')
    res.send(docs)
   })
  
  })
  

  
  router.post('/dashChartBlendingTanks',isLoggedIn,function(req,res){

  
    var product = req.body.product
   
   var arr = []
   var id = req.user._id
  
   
  
  
   BlendingTanks.find({product:product},function(err,docs) {
    // console.log(docs,'docs')
    /* for(var i = 0;i<docs.length;i++){

    console.log(docs,'docs')
  
        if(arr.length > 0 && arr.find(value => value.stage == docs[i].stage  && value.item == docs[i].item )){
               console.log('true')
              arr.find(value => value.stage == docs[i].stage).massKgs += docs[i].massKgs;
         }else{
  arr.push(docs[i])
         }
  
       
     }*/
    //console.log(arr,'arr')
    console.log(docs,'888')
    res.send(docs)
   })
  
  })
  
  
  






    router.post('/batchAuto',function(req,res){
      var grvNumber = req.body.code
      BatchRR.find({status:"complete",grvNumber:grvNumber},function(err,docs){
        res.send(docs)
      })
    })
    

    
  router.get('/batch',isLoggedIn,function(req,res){
    /*var errorMsg = req.flash('danger')[0];
  var successMsg = req.flash('success')[0];*/
  var pro = req.user
  var readonly = 'hidden'
  var read =''
  let prefix = ''
  BatchRR.find({status:'complete',stage:"wash"}).lean().then(docs=>{
  var arr = docs
   if(docs.length >0){
     prefix = docs[0].prefix
   }
  res.render('production/batch',{arr:arr,prefix:prefix,pro:pro,user:req.query,readonly:readonly,read:read})
  })

  })


  router.post('/batch',isLoggedIn,function(req,res){
    var date = req.body.date
    var shift = req.body.shift
    var prefix = req.body.prefix
    var grvNumber = req.body.grvNumber


    //console.log(batchNumber,'batchNumber')
    let id = req.user._id
    let m = moment()
    var month = m.format('MMMM')
    var year = m.format('YYYY')
    req.check('date','Enter Date').notEmpty();
    //req.check('name','Enter Name').notEmpty();
    req.check('shift','Enter Shift').notEmpty();
    req.check('grvNumber','Enter GRVNumber').notEmpty();
    

    
    var errors = req.validationErrors();

    if (errors) {
      
      req.session.errors = errors;
      req.session.success = false;
      req.flash('danger', req.session.errors[0].msg);


      res.redirect('/production/batch');
    
}
else{

  
  let date6 =  moment().format('l');
  let dateValue = moment().valueOf()

  let date7 =  date6.replace(/\//g, "");
  
    BatchRR.find({grvNumber:grvNumber},function(err,docs){
      if(docs){
        let item = docs[0].item
        let supplier = docs[0].supplier
        let availableMass = docs[0].closingWeightKg
        let refNumber = docs[0].refNumber
        let batchNumber = docs[0].batchNumber
       
    RawMat.find({item:item,stage:'raw'},function(err,noc){

    let avbMass = noc[0].massKgs

      User.findByIdAndUpdate(id,{$set:{item:item,supplier:supplier,date:date,availableMass:avbMass,refNumber:grvNumber}},function(err,vocs){

      })

    })
      



      RefNo.find({date:date,type:"gingerWash",item:item},function(err,docs){
        let size = docs.length + 1
       refNo = date7+prefix+'B'+size+'WSH'
        console.log(refNo,'refNo')
    
        var truck = new BatchGingerWash()
        truck.date = date
        truck.mformat = date6
        truck.dateValue = dateValue
        truck.item = item
        truck.prefix = prefix
        truck.status2 = "null"
        truck.refNumber = grvNumber
        truck.voucherNo = refNumber
        truck.batchNumber = refNo
        truck.month = month
        truck.qtyInMass = 0
        truck.qtyOutMass= 0
        truck.month = month
        truck.status = 'null'
        truck.year = year
       
        
       
    
        truck.save()
            .then(pro =>{
    
              User.findByIdAndUpdate(id,{$set:{batchNumber:refNo,batchId:pro._id,prefix:prefix}},function(err,vocs){

              })
              var book = new RefNo();
              book.refNumber = refNo
              book.item = item
              book.date = date
              book.type = 'gingerWash'
              book.save()
              .then(prod =>{
          
               
          
              })

            })

          })

        }

      
    })
    res.redirect('/production/gingerWash2')
  }
  })


  router.get('/gingerWash2',isLoggedIn,function(req,res){
    res.redirect('/production/gingerWash')
  })


  router.get('/gingerWash/',isLoggedIn,function(req,res){
var supplier = req.user.supplier
var item = req.user.item
var date = req.user.date
var prefix = req.user.prefix
var batchNumber = req.user.batchNumber
var refNumber = req.user.refNumber
var availableMass = req.user.availableMass
var batchId = req.user.batchId

res.render('production/addMaterial2',{supplier:supplier,batchNumber:batchNumber,
refNumber:refNumber,availableMass:availableMass,item:item,date:date,batchId:batchId,prefix:prefix})

    
    
    })


    router.post('/qtyInGingerWash',function(req,res){
      var m = moment()
      var mformat = m.format('L')
      var month = m.format('MMMM')
      var year = m.format('YYYY')
      let dateValue = moment().valueOf()
      let arrV = []
      let number1
      //let refNo = req.user.refNumber
      let refNumber = req.user.refNumber
      let batchId = req.user.batchId
      let mass = req.body.code
      let bags = req.body.bags
      let massTonne

      let batchNumber = req.body.batchNumber
      BatchRR.find({grvNumber:refNumber},function(err,docs){
        //console.log(docs,'docs')
        let supplier = docs[0].supplier
        let item = docs[0].item
        let date = docs[0].date
        let driver = docs[0].driver
        let regNumber = docs[0].regNumber
        let mobile = docs[0].mobile
        let trailer = docs[0].trailer
        let address = docs[0].address
        //let batchNumber = docs[0].batchNumber
        let grvNumber = docs[0].grvNumber
        let idNumber = docs[0].idNumber
        let voucherNumber = docs[0].voucherNumber
        let dateValue = docs[0].dateValue
        let prefix = docs[0].prefix
        let openingWeightKg = docs[0].openingWeightKg
        let openingWeightTonne = docs[0].openingWeightTonne
        let newMassNum = 0
      
      
      
      GingerWash.find({batchNumber:batchNumber},function(err,docs){
      
      for(var i = 0;i<docs.length; i++){
       // console.log(docs[i].newMass,'serima')
      arrV.push(docs[i].newMass)
        }
        //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
       //console.log(arrV,'arrV')
      
      //InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
      number1=0;
      for(var z in arrV) { number1 += arrV[z]; }
      number1.toFixed(2)
      let reg = /\d+\.*\d*/g;
      let resultQty = mass.match(reg)
      let massNum = Number(resultQty)
      
      let total5 = massNum + number1
      
      massNum.toFixed(2)
      let size = docs.length + 1
      let weight = 'weight'+size
       console.log(batchId,'batchId')
      var stock = new GingerWash();
      stock.weight = weight
      stock.date =mformat
      stock.address = address
      stock.regNumber = regNumber
      stock.item = item
      stock.bags = bags
      stock.status = "ready"
      stock.supplier = supplier
      stock.driver = driver
      stock.type = 'qtyIn'
      stock.voucherNumber = voucherNumber
      stock.batchNumber = batchNumber
      stock.trailer = trailer
      stock.prefix = prefix
      stock.voucherNo = voucherNumber
      //stock.batchNumber = refNo
      stock.refNumber =refNumber
      stock.mobile = mobile
      stock.month = month
      stock.year = year
      stock.batchId = batchId
      stock.openingBatchWeightKg = openingWeightKg
     
      stock.openingMass = number1
      stock.newMass = mass
      stock.closingMass = massNum + number1
      stock.size = size
      stock.dateValue = dateValue
      
      stock.save()
      .then(pro =>{
      
        res.send(pro)
      
      })
      
      
      
      })
      
      })
      })
      

      router.get('/closeBatch/:id',isLoggedIn,function(req,res){
        let id = req.params.id
        let refNumber = req.user.refNumber
        let number1
        let arrV=[]
        let batchId = req.user.batchId
        console.log(id,batchId,'id')
        GingerWash.find({batchId:batchId,refNumber:refNumber,type:'qtyIn'},function(err,docs){
        let item = docs[0].item
          for(var i = 0;i<docs.length; i++){
           
          arrV.push(docs[i].newMass)
            }
            //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
           console.log(arrV,'arrV')
          
          //InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
          number1=0;
          for(var z in arrV) { number1 += arrV[z]; }

          BatchGingerWash.findByIdAndUpdate(batchId,{$set:{qtyInMass:number1,status:'qtyIn'}},function(err,vocs){

            RawMat.find({item:item,stage:'raw'},function(err,tocs){
              let opBal = tocs[0].massKgs - number1
              let opBalTonnes = opBal / 1000
              let id4 = tocs[0]._id

              if(opBal < 0){
                RawMat.findByIdAndUpdate(id4,{massKgs:0,massTonnes:0,uniqueMeasure:0},function(err,locs){

                })  
              }else {
            RawMat.findByIdAndUpdate(id4,{massKgs:opBal,massTonnes:opBalTonnes,uniqueMeasure:opBal},function(err,locs){

            })  
          }

            })

           /* RawMat.find({item:item,stage:'wash'},function(err,focs){
              let opBal2 = focs[0].massKgs + number1
              let id5 = focs[0]._id
              let opBal2Tonnes = opBal2 / 1000

              RawMat.findByIdAndUpdate(id5,{massKgs:opBal2, massTonnes:opBal2Tonnes},function(err,locs){

              }) 
            })*/
          })
          res.redirect('/production/batchList')
        })
      
       
      })
      
      router.post('/reloadGinger/:id', (req, res) => {
        var pro = req.user
        var m = moment()
        var id = req.params.id
      
        var mformat = m.format("L")
        
        GingerWash.find({refNumber:id,type:"qtyIn"},(err, docs) => {
       console.log(docs,'docs')
          res.send(docs)
                  })
      
        }); 
  
      
 
router.get('/batchList',isLoggedIn,function(req,res){
  BatchGingerWash.find(function(err,docs){
  
    let arr=[]
    for(var i = docs.length - 1; i>=0; i--){
  
      arr.push(docs[i])
    }
  
    res.render('production/batchList',{listX:arr})
  
  })
  
  
  
  })




  
  router.get('/gingerWashQtyOut/:id/',isLoggedIn,function(req,res){
    var id = req.params.id

    GingerWash.find({refNumber:id},function(err,docs){

    
    var supplier = docs[0].supplier
    var item = docs[0].item
    var date = docs[0].date
    var batchNumber = docs[0].batchNumber
    var refNumber = docs[0].refNumber
    var availableMass = docs[0].availableMass
    var batchId = docs[0].batchId

    BatchGingerWash.findById(batchId,function(err,doc){
      let availableMass = doc.qtyInMass
   
    
    res.render('production/addMaterial3',{supplier:supplier,batchNumber:batchNumber,
    refNumber:refNumber,availableMass:availableMass,item:item,date:date,batchId:batchId})
    
  })
}) 
        })
        

        

    router.post('/qtyOutGingerWash',function(req,res){
      var m = moment()
      var mformat = m.format('L')
      var month = m.format('MMMM')
      var year = m.format('YYYY')
      let dateValue = moment().valueOf()
      let arrV = []
      let arrT=[]
      let number1
      let refNumber = req.body.refNumber
      let batchId = req.body.batchId
      let availableMass = req.body.availableMass
      let mass = req.body.code
      let crates = req.body.crates
      let massTonne, totalMass
      let batchNumber = req.body.batchNumber
      BatchRR.find({grvNumber:refNumber},function(err,docs){
        //console.log(docs,'docs')
        let supplier = docs[0].supplier
        let item = docs[0].item
        let date = docs[0].date
        let driver = docs[0].driver
        let regNumber = docs[0].regNumber
        let mobile = docs[0].mobile
        let trailer = docs[0].trailer
        let address = docs[0].address
        //let batchNumber = docs[0].batchNumber
        let idNumber = docs[0].idNumber
        let voucherNumber = docs[0].voucherNumber
        let dateValue = docs[0].dateValue
        let openingWeightKg = docs[0].openingWeightKg
        let openingWeightTonne = docs[0].openingWeightTonne
        let newMassNum = 0
      
      let number2
      
      GingerWash.find({batchNumber:batchNumber,type:'qtyOut'},function(err,docs){
      
      for(var i = 0;i<docs.length; i++){
       // console.log(docs[i].newMass,'serima')
      arrV.push(docs[i].newMass)
        }
        //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
       //console.log(arrV,'arrV')
      
      //InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
      number1=0;
      for(var z in arrV) { number1 += arrV[z]; }
      number1.toFixed(2)

   number2 =availableMass - number1
      let reg = /\d+\.*\d*/g;
      let resultQty = mass.match(reg)
      let massNum = Number(resultQty)
      
      let total5 = massNum + number1
      
      massNum.toFixed(2)
      let size = docs.length + 1
      let weight = 'weight'+size
       console.log(batchId,'batchId')
      var stock = new GingerWash();
      stock.weight = weight
      stock.date =mformat
      stock.address = address
      stock.regNumber = regNumber
      stock.item = item
      stock.crates = crates
      stock.status = "ready"
      stock.supplier = supplier
      stock.driver = driver
      stock.type = 'qtyOut'
      stock.voucherNo = voucherNumber
      stock.batchNumber = batchNumber
      stock.trailer = trailer
      stock.refNumber = refNumber
      stock.mobile = mobile
      stock.month = month
      stock.year = year
      stock.batchId = batchId
      stock.openingBatchWeightKg = availableMass
      stock.totalMass = total5
      stock.openingMass = number2
      stock.newMass = mass
      stock.closingMass = number2 - massNum
      stock.size = size
      stock.dateValue = dateValue
      
      stock.save()
      .then(pro =>{
      
        res.send(pro)
      
      })
      
      
      
      })
      
      })
      })




  
      router.post('/reloadGingerOut/:id', (req, res) => {
        var pro = req.user
        var m = moment()
        var id = req.params.id
      
        var mformat = m.format("L")
        
        GingerWash.find({refNumber:id,type:"qtyOut"},(err, docs) => {
       console.log(docs,'docs')
          res.send(docs)
                  })
      
        }); 
      
      router.get('/closeBatchOut/:id',isLoggedIn,function(req,res){
        let id = req.params.id
        let refNumber = req.user.refNumber
        let number1, number2
        let arrV=[]
        let arrT=[]
        let batchId = req.user.batchId
        let variance
        console.log(id,batchId,'id')
        GingerWash.find({batchId:batchId,refNumber:refNumber,type:'qtyOut'},function(err,docs){
let item = docs[0].item
          for(var i = 0;i<docs.length; i++){
           
          arrV.push(docs[i].newMass)
          arrT.push(docs[i].crates)
            }
            //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
           console.log(arrV,'arrV')
          
          //InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
          number1=0;
          for(var z in arrV) { number1 += arrV[z]; }

          number2=0;
          for(var a in arrT) { number2 += arrT[a]; }

          BatchGingerWash.findById(batchId,function(err,doc){
            let qtyInMass= doc.qtyInMass
            variance = number1 - qtyInMass
          BatchGingerWash.findByIdAndUpdate(batchId,{$set:{qtyOutMass:number1,status:'qtyOut',variance:variance,nxtStage:"crushing",crates:number2}},function(err,vocs){


            /*RawMat.find({item:item,stage:'wash'},function(err,tocs){
              let opBal = tocs[0].massKgs - number1
              let opBalTonnes = opBal / 1000
              let id4 = tocs[0]._id
            RawMat.findByIdAndUpdate(id4,{massKgs:opBal,massTonnes:opBalTonnes},function(err,locs){

            })  

            })*/

            RawMat.find({item:item,stage:'wash'},function(err,focs){
              let opBal2 = focs[0].massKgs + number1
              let id5 = focs[0]._id
              let opBal2Tonnes = opBal2 / 1000

              RawMat.findByIdAndUpdate(id5,{massKgs:opBal2,uniqueMeasure:opBal2,crates:number2, /*massTonnes:opBal2Tonnes*/},function(err,locs){

              }) 
            })


            
          })

        })
          res.redirect('/production/batchList')
        })
      
       
      })
      
      router.get('/crushBatch',isLoggedIn,function(req,res){
        /*var errorMsg = req.flash('danger')[0];
      var successMsg = req.flash('success')[0];*/
      var pro = req.user
      var readonly = 'hidden'
      var read =''
      var arr = []
      

      BatchRR.find({status:'complete',stage:'crush'}).lean().then(ocs=>{

        for(var i = 0;i<ocs.length;i++){
          //console.log(ocs[i],'ocs')
          arr.push(ocs[i])
        }
        
        //arr =ocs
      BatchGingerWash.find({status:'qtyOut',status2:"null"}).lean().then(docs=>{
   // arr.push(docs[0])
    
    for(var i = 0;i<docs.length;i++){
     // console.log(docs[i],'docs')
      arr.push(docs[i])
    }
      //arr=docs
     // console.log(docs[0],'docs')
    console.log(arr,'arr')
      res.render('production/batchCrushing',{arr:arr,pro:pro,user:req.query,readonly:readonly,read:read})
      })
      })
      })
      

      

  router.post('/crushBatch',isLoggedIn,function(req,res){
    var date = req.body.date
    var shift = req.body.shift
    var refNumber = req.body.batchNumber
    let id = req.user._id
    let m = moment()
    var month = m.format('MMMM')
    var year = m.format('YYYY')
    req.check('date','Enter Date').notEmpty();
    //req.check('name','Enter Name').notEmpty();
    req.check('shift','Enter Shift').notEmpty();
    req.check('batchNumber','Enter BatchNumber').notEmpty();
    

    
    var errors = req.validationErrors();

    if (errors) {
      
      req.session.errors = errors;
      req.session.success = false;
      req.flash('danger', req.session.errors[0].msg);


      res.redirect('/production/crushBatch');
    
}
else{

  
  let date6 =  moment().format('l');
  let dateValue = moment().valueOf()

  let date7 =  date6.replace(/\//g, "");
  
    BatchGingerWash.find({batchNumber:refNumber},function(err,docs){
      if(docs.length > 0){
        let item = docs[0].item
     
        let availableMass = docs[0].qtyOutMass
        let refNumber = docs[0].refNumber
        let gingerBatch = docs[0].batchNumber
        let prefix = docs[0].prefix
      User.findByIdAndUpdate(id,{$set:{item:item,date:date,availableMass:availableMass,refNumber:refNumber,batchNumber:gingerBatch}},function(err,vocs){

      })
      



      RefNo.find({date:date,type:"crush"},function(err,docs){
        let size = docs.length + 1
       refNo = date7+prefix+'B'+size+'CRS'
        console.log(refNo,'refNo')
    
        var truck = new BatchGingerCrush()
        truck.date = date
        truck.mformat = date6
        truck.dateValue = dateValue
        truck.item = item
        truck.refNumber = gingerBatch
        //truck.refNumber2 = refNo
        truck.type ='normal'
        truck.batchNumber = refNo
        truck.month = month
        truck.qtyInMass = 0
        truck.qtyOutMass= 0
        truck.month = month
        truck.status = 'null'
        truck.year = year
       
        
       
    
        truck.save()
            .then(pro =>{
    
              User.findByIdAndUpdate(id,{$set:{batchNumber:refNo,refNumber:gingerBatch,batchId:pro._id}},function(err,vocs){

              })
              var book = new RefNo();
              book.refNumber = refNo
              book.item = item
              book.date = date
              book.type = 'crush'
              book.save()
              .then(prod =>{
          
               
          
              })

            })

          })

        }else{
          BatchRR.find({batchNumber:refNumber},function(err,docs){
          let item = docs[0].item
     
          let availableMass = docs[0].closingWeightKg
          let refNumber = docs[0].refNumber
          let grvNumber = docs[0].grvNumber
          let prefix = docs[0].prefix
  
        User.findByIdAndUpdate(id,{$set:{item:item,date:date,availableMass:availableMass,refNumber:grvNumber}},function(err,vocs){
  
        })
        
  
  
  
        RefNo.find({date:date,type:"crush"},function(err,docs){
          let size = docs.length + 1
         refNo = date7+prefix+'B'+size+'CRS'
          console.log(refNo,'refNo')
      
          var truck = new BatchGingerCrush()
          truck.date = date
          truck.mformat = date6
          truck.dateValue = dateValue
          truck.item = item
          truck.refNumber = grvNumber
          
          truck.batchNumber = refNo
          truck.month = month
          truck.qtyInMass = 0
          truck.qtyOutMass= 0
          truck.month = month
          truck.type ='normal'
          truck.status = 'null'
          truck.year = year
         
          
         
      
          truck.save()
              .then(pro =>{
      
                User.findByIdAndUpdate(id,{$set:{batchNumber:refNo,refNumber:grvNumber,batchId:pro._id}},function(err,vocs){
  
                })
                var book = new RefNo();
                book.refNumber = refNo
                book.item = item
                book.date = date
                book.type = 'crush'
                book.save()
                .then(prod =>{
            
                 
            
                })
  
              })
            })
            })    
        }

        res.redirect('/production/crush2')
    })
  
  }
  })



  
  router.get('/crush2',isLoggedIn,function(req,res){
    res.redirect('/production/crush')
  })


  router.get('/crush/',isLoggedIn,function(req,res){

var item = req.user.item
var date = req.user.date
var batchNumber = req.user.batchNumber
var refNumber = req.user.refNumber
var availableMass = req.user.availableMass
var batchId = req.user.batchId

res.render('production/addMaterialCrush',{batchNumber:batchNumber,
refNumber:refNumber,availableMass:availableMass,item:item,date:date,batchId:batchId})

    
    
    })
    


    router.post('/qtyInGingerCrush',function(req,res){
      var m = moment()
      var mformat = m.format('L')
      var month = m.format('MMMM')
      var year = m.format('YYYY')
      let dateValue = moment().valueOf()
      let arrV = []
      let number1
      let refNumber = req.user.refNumber
      let batchId = req.user.batchId
      let mass = req.body.code
      let crates = req.body.crates
      let massTonne
      var item = req.user.item
      let batchNumber = req.body.batchNumber
      //let refNumber = req.body.refNumber
      console.log(batchNumber,'batchNumber666')

      if(item == 'ginger'){
      BatchGingerWash.find({batchNumber:refNumber},function(err,docs){
        //console.log(docs,'docs')
      
        let item = docs[0].item
        let date = docs[0].date
       // let refNo = docs[0].refNumber
        let batchWashNumber = docs[0].batchNumber
       
        let dateValue = docs[0].dateValue
        let openingMass= docs[0].qtyOutMass

        let newMassNum = 0
      
      
      
      GingerCrush.find({batchNumber:batchNumber},function(err,docs){
      
      for(var i = 0;i<docs.length; i++){
       // console.log(docs[i].newMass,'serima')
      arrV.push(docs[i].newMass)
        }
        //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
       //console.log(arrV,'arrV')
      
      //InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
      number1=0;
      for(var z in arrV) { number1 += arrV[z]; }
      number1.toFixed(2)
      let reg = /\d+\.*\d*/g;
      let resultQty = mass.match(reg)
      let massNum = Number(resultQty)
      
      let total5 = massNum + number1
      
      massNum.toFixed(2)
      let size = docs.length + 1
      let weight = 'weight'+size
       console.log(batchId,'batchId')
      var stock = new GingerCrush();
      stock.weight = weight
      stock.date =mformat
      stock.item = item
      stock.crates = crates
      stock.status = "ready"
      stock.type = 'qtyIn'
      stock.batchNumber = batchNumber
      stock.refNumber = batchWashNumber
      stock.month = month
      stock.year = year
      stock.batchId = batchId
      stock.totalMass = total5
      stock.openingMass = number1
      stock.newMass = mass
      stock.closingMass = massNum + number1
      stock.size = size
      stock.dateValue = dateValue
      
      stock.save()
      .then(pro =>{
      
        res.send(pro)
      
      })
      
      
      
      })
      
      })
    }else if(item == 'bananas'){

      BatchRR.find({grvNumber:refNumber},function(err,docs){
        //console.log(docs,'docs')
      
        let item = docs[0].item
        let date = docs[0].date
       // let refNo = docs[0].refNumber
        let grvNumber = docs[0].grvNumber
       
        let dateValue = docs[0].dateValue
        

        
        let openingMass= docs[0].closingWeightKg

        let newMassNum = 0
      
      
      
      GingerCrush.find({batchNumber:batchNumber},function(err,docs){
      
      for(var i = 0;i<docs.length; i++){
       // console.log(docs[i].newMass,'serima')
      arrV.push(docs[i].newMass)
        }
        //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
       //console.log(arrV,'arrV')
      
      //InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
      number1=0;
      for(var z in arrV) { number1 += arrV[z]; }
      number1.toFixed(2)
      let reg = /\d+\.*\d*/g;
      let resultQty = mass.match(reg)
      let massNum = Number(resultQty)
      
      let total5 = massNum + number1
      
      massNum.toFixed(2)
      let size = docs.length + 1
      let weight = 'weight'+size
       console.log(batchId,'batchId')
      var stock = new GingerCrush();
      stock.weight = weight
      stock.date =mformat
      stock.crates = crates
      stock.item = item
      stock.status = "ready"
      stock.type = 'qtyIn'
      stock.batchNumber = batchNumber
      stock.refNumber = grvNumber
      stock.month = month
      stock.year = year
      stock.batchId = batchId
      stock.totalMass = total5
      stock.openingMass = number1
      stock.newMass = mass
      stock.closingMass = massNum + number1
      stock.size = size
      stock.dateValue = dateValue
      
      stock.save()
      .then(pro =>{
      
        res.send(pro)
      
      })
      
      
      
      })
      
      })



    }


    else if(item == 'lemon'){

      BatchRR.find({batchNumber:refNumber},function(err,docs){
        //console.log(docs,'docs')
      
        let item = docs[0].item
        let date = docs[0].date
       // let refNo = docs[0].refNumber
        let grvNumber = docs[0].grvNumber
       
        let dateValue = docs[0].dateValue
        

        
        let openingMass= docs[0].closingWeightKg

        let newMassNum = 0
      
      
      
      GingerCrush.find({batchNumber:batchNumber},function(err,docs){
      
      for(var i = 0;i<docs.length; i++){
       // console.log(docs[i].newMass,'serima')
      arrV.push(docs[i].newMass)
        }
        //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
       //console.log(arrV,'arrV')
      
      //InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
      number1=0;
      for(var z in arrV) { number1 += arrV[z]; }
      number1.toFixed(2)
      let reg = /\d+\.*\d*/g;
      let resultQty = mass.match(reg)
      let massNum = Number(resultQty)
      
      let total5 = massNum + number1
      
      massNum.toFixed(2)
      let size = docs.length + 1
      let weight = 'weight'+size
       console.log(batchId,'batchId')
      var stock = new GingerCrush();
      stock.weight = weight
      stock.date =mformat
      stock.item = item
      stock.crates = crates
      stock.status = "ready"
      stock.type = 'qtyIn'
      stock.batchNumber = batchNumber
      stock.refNumber = grvNumber
      stock.month = month
      stock.year = year
      stock.batchId = batchId
      stock.totalMass = total5
      stock.openingMass = number1
      stock.newMass = mass
      stock.closingMass = massNum + number1
      stock.size = size
      stock.dateValue = dateValue
      
      stock.save()
      .then(pro =>{
      
        res.send(pro)
      
      })
      
      
      
      })
      
      })



    }




    
   
    else if(item == 'garlic'){

      BatchRR.find({batchNumber:refNumber},function(err,docs){
        //console.log(docs,'docs')
      
        let item = docs[0].item
        let date = docs[0].date
       // let refNo = docs[0].refNumber
        let grvNumber = docs[0].grvNumber
       
        let dateValue = docs[0].dateValue
        

        
        let openingMass= docs[0].closingWeightKg

        let newMassNum = 0
      
      
      
      GingerCrush.find({batchNumber:batchNumber},function(err,docs){
      
      for(var i = 0;i<docs.length; i++){
       // console.log(docs[i].newMass,'serima')
      arrV.push(docs[i].newMass)
        }
        //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
       //console.log(arrV,'arrV')
      
      //InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
      number1=0;
      for(var z in arrV) { number1 += arrV[z]; }
      number1.toFixed(2)
      let reg = /\d+\.*\d*/g;
      let resultQty = mass.match(reg)
      let massNum = Number(resultQty)
      
      let total5 = massNum + number1
      
      massNum.toFixed(2)
      let size = docs.length + 1
      let weight = 'weight'+size
       console.log(batchId,'batchId')
      var stock = new GingerCrush();
      stock.weight = weight
      stock.date =mformat
      stock.item = item
      stock.status = "ready"
      stock.type = 'qtyIn'
      stock.batchNumber = batchNumber
      stock.refNumber = grvNumber
      stock.month = month
      stock.year = year
      stock.batchId = batchId
      stock.totalMass = total5
      stock.openingMass = number1
      stock.newMass = mass
      stock.closingMass = massNum + number1
      stock.size = size
      stock.dateValue = dateValue
      
      stock.save()
      .then(pro =>{
      
        res.send(pro)
      
      })
      
      
      
      })
      
      })


    }
      })
      

      router.get('/closeBatchCrush/:id',isLoggedIn,function(req,res){
        let id = req.params.id
        let refNumber = req.user.refNumber
        let number1
        let arrV=[]
        let batchId = req.user.batchId
        console.log(id,batchId,'id')
        GingerCrush.find({batchId:batchId,refNumber:refNumber,type:'qtyIn'},function(err,docs){

          for(var i = 0;i<docs.length; i++){
           
         // arrV.push(docs[i].newMass)
         arrV.push(docs[i].crates)
            }
            //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
           console.log(arrV,'arrV')
          
          //InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
          number1=0;
          for(var z in arrV) { number1 += arrV[z]; }

          BatchGingerCrush.findByIdAndUpdate(batchId,{$set:{qtyInMass:number1,status:'qtyIn',crates:number1}},function(err,doc){
          let item = doc.item

          CrushedItems.find({item:item},function(err,docs){
            let id = docs[0]._id
          CrushedItems.findByIdAndUpdate(id,{$set:{massKgs:number1,uniqueMeasure:number1,crates:number1}},function(err,tocs){

          })
          })

            


          })
          res.redirect('/production/batchListCrush')
        })
      
       
      })
      

  
   
 
router.get('/batchListCrush',function(req,res){
  BatchGingerCrush.find({type:"normal"},function(err,docs){
  
    let arr=[]
    for(var i = docs.length - 1; i>=0; i--){
  
      arr.push(docs[i])
    }
  
    res.render('production/batchListCrush',{listX:arr})
  
  })
  
  
  
  })





  router.post('/reloadGingerCrush/:id', (req, res) => {
    var pro = req.user
    var m = moment()
    var id = req.params.id
  
    var mformat = m.format("L")
    
    GingerCrush.find({refNumber:id},(err, docs) => {
   console.log(docs,'docs')
      res.send(docs)
              })
  
    }); 



  router.get('/gingerCrushQtyOut/:id/',isLoggedIn,function(req,res){
    var id = req.params.id
console.log(id,'id')
    GingerCrush.find({refNumber:id},function(err,docs){

    

    var item = docs[0].item
    var date = docs[0].date
    var batchNumber = docs[0].batchNumber
    var refNumber = docs[0].refNumber
    var availableMass = docs[0].availableMass
    var batchId = docs[0].batchId

    BatchGingerCrush.findById(batchId,function(err,doc){
      let availableMass = doc.qtyInMass
   
    
    res.render('production/addMaterialCrush2',{batchNumber:batchNumber,
    refNumber:refNumber,availableMass:availableMass,item:item,date:date,batchId:batchId})
    
  })
}) 
        })
        

        

    router.post('/qtyOutGingerCrush',function(req,res){
      var m = moment()
      var mformat = m.format('L')
      var month = m.format('MMMM')
      var year = m.format('YYYY')
      let dateValue = moment().valueOf()
      let arrV = []
      var item = req.body.item
      let number1
      let refNumber = req.body.refNumber
      let drums = req.body.drums
      let batchId = req.body.batchId
      let availableMass = req.body.availableMass
      let mass = req.body.code
      let massTonne
      let batchNumber = req.body.batchNumber
      //BatchRR.find({batchNumber:batchNumber},function(err,docs){
        //console.log(docs,'docs')
      /*  let supplier = docs[0].supplier
        let item = docs[0].item
        let date = docs[0].date
        let driver = docs[0].driver
        let regNumber = docs[0].regNumber
        let mobile = docs[0].mobile
        let trailer = docs[0].trailer
        let address = docs[0].address
        let batchNumber = docs[0].batchNumber
        let idNumber = docs[0].idNumber
        let voucherNumber = docs[0].voucherNumber
        let dateValue = docs[0].dateValue
        let openingWeightKg = docs[0].openingWeightKg
        let openingWeightTonne = docs[0].openingWeightTonne
        let newMassNum = 0*/
      
      let number2
      
      GingerCrush.find({batchNumber:batchNumber,type:'qtyOut'},function(err,docs){
      
      for(var i = 0;i<docs.length; i++){
       // console.log(docs[i].newMass,'serima')
      arrV.push(docs[i].newMass)
        }
        //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
       //console.log(arrV,'arrV')
      
      //InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
      number1=0;
      for(var z in arrV) { number1 += arrV[z]; }
      number1.toFixed(2)

   number2 =availableMass - number1
      let reg = /\d+\.*\d*/g;
      let resultQty = mass.match(reg)
      let massNum = Number(resultQty)
      
      let total5 = massNum + number1
      
      massNum.toFixed(2)
      let size = docs.length + 1
      let weight = 'weight'+size
       console.log(batchId,'batchId')
      var stock = new GingerCrush();
      stock.weight = weight
      stock.date =mformat
      stock.drums = drums
      stock.item = item
      stock.status = "ready"

      stock.type = 'qtyOut'
   
      stock.batchNumber = batchNumber

      stock.refNumber = refNumber

      stock.month = month
      stock.year = year
      stock.batchId = batchId
      stock.openingBatchWeightKg = availableMass
      stock.totalMass = total5
      stock.openingMass = number2
      stock.newMass = mass
      stock.closingMass = number2 - massNum
      stock.size = size
      stock.dateValue = dateValue
      
      stock.save()
      .then(pro =>{
      
        res.send(pro)
      
      })
      
      
      
      })
      
      //})
      })


      

  router.post('/reloadGingerCrushOut/:id', (req, res) => {
    var pro = req.user
    var m = moment()
    var id = req.params.id
  
    var mformat = m.format("L")
    
    GingerCrush.find({refNumber:id,type:"qtyOut"},(err, docs) => {
   console.log(docs,'docs')
      res.send(docs)
              })
  
    }); 





      
      router.get('/closeBatchOutCrush/:id',isLoggedIn,function(req,res){
        let id = req.params.id
        let refNumber = req.user.refNumber
        let number1
        var m = moment()
        var mformat = m.format("L")
        var month = m.format('MMMM')
      var year = m.format('YYYY')
        let arrV=[]
        let batchId = req.user.batchId
        let variance
        console.log(id,batchId,'id')
        GingerCrush.find({batchId:batchId,type:'qtyOut'},function(err,docs){
let item = docs[0].item
if(item == 'ginger'){
          for(var i = 0;i<docs.length; i++){
           
          //arrV.push(docs[i].newMass)
          arrV.push(docs[i].drums)
            }
            //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
           console.log(arrV,'arrV')
          
          //InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
          number1=0;
          for(var z in arrV) { number1 += arrV[z]; }

          BatchGingerCrush.findById(batchId,function(err,doc){
           // let qtyInMass= doc.qtyInMass
           let qtyInMass= doc.crates
            //variance = number1 - qtyInMass
          BatchGingerCrush.findByIdAndUpdate(batchId,{$set:{qtyOutMass:number1,status:'qtyOut',status2:'crushed',nxtStage:'cooking',drums:number1}},function(err,vocs){
 RawMat.find({item:item,stage:'wash'},function(err,tocs){
              let opBal = tocs[0].crates - qtyInMass
             // let opBalTonnes = opBal / 1000
              let id4 = tocs[0]._id
            RawMat.findByIdAndUpdate(id4,{massKgs:opBal,uniqueMeasure:opBal,drums:number1/*massTonnes:opBalTonnes*/},function(err,locs){

            })  

            })

            RawMat.find({item:item,stage:'crush'},function(err,focs){
              let opBal2 = focs[0].uniqueMeasure + number1
              let id5 = focs[0]._id
             // let opBal2Tonnes = opBal2 / 1000

              RawMat.findByIdAndUpdate(id5,{massKgs:opBal2,uniqueMeasure:opBal2, /*massTonnes:opBal2Tonnes*/},function(err,locs){

              }) 
            })




          })

        })
        res.redirect('/production/batchListCrush')

      }else if(item == 'bananas'){
        for(var i = 0;i<docs.length; i++){
           
          //arrV.push(docs[i].newMass)
          arrV.push(docs[i].drums)
            }
            //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
           console.log(arrV,'arrV')
          
          //InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
          number1=0;
          for(var z in arrV) { number1 += arrV[z]; }

          BatchGingerCrush.findById(batchId,function(err,doc){
           // let qtyInMass= doc.qtyInMass
           let qtyInMass= doc.crates
           let batchNumber = doc.batchNumber
            //variance = number1 - qtyInMass
          BatchGingerCrush.findByIdAndUpdate(batchId,{$set:{qtyOutMass:number1,status:'qtyOut',status2:'crushed',nxtStage:'cooking',drums:drums}},function(err,vocs){
 RawMat.find({item:item,stage:'wash'},function(err,tocs){
              let opBal = tocs[0].crates - qtyInMass
             // let opBalTonnes = opBal / 1000
              let id4 = tocs[0]._id
            RawMat.findByIdAndUpdate(id4,{massKgs:opBal,uniqueMeasure:opBal,drums:drums/*massTonnes:opBalTonnes*/},function(err,locs){

            })  

            })

            RawMat.find({item:item,stage:'crush'},function(err,focs){
              let opBal2 = focs[0].uniqueMeasure + number1
              let id5 = focs[0]._id
             // let opBal2Tonnes = opBal2 / 1000

              RawMat.findByIdAndUpdate(id5,{massKgs:opBal2,uniqueMeasure:opBal2, /*massTonnes:opBal2Tonnes*/},function(err,locs){

              }) 
            })






            var final = new FinalProduct()
            final.refNumber = batchNumber
            final.quantity = number1
            final.date = mformat
            final.ingredient = item
            final.month = month
            final.year = year
            final.status = 'null'
      
            final.save().then(pro =>{
      
              res.redirect('/production/batchListCrush')
            })


          })

        })
        
      }


      
      else if(item == 'honey'){
        for(var i = 0;i<docs.length; i++){
           
          arrV.push(docs[i].newMass)
            }
            //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
           console.log(arrV,'arrV')
          
          //InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
          number1=0;
          for(var z in arrV) { number1 += arrV[z]; }

          BatchGingerCrush.findById(batchId,function(err,doc){
            let qtyInMass= doc.qtyInMass
            let batchNumber = doc.batchNumber
            variance = number1 - qtyInMass
          BatchGingerCrush.findByIdAndUpdate(batchId,{$set:{qtyOutMass:number1,status:'qtyOut',variance:variance,status2:'crushed',nxtStage:'fermentation'}},function(err,vocs){
 RawMat.find({item:item,stage:'raw'},function(err,tocs){
              let opBal = tocs[0].massKgs - qtyInMass
              let opBalTonnes = opBal / 1000
              let id4 = tocs[0]._id
            RawMat.findByIdAndUpdate(id4,{massKgs:opBal,massTonnes:opBalTonnes},function(err,locs){

            })  

            })

            RawMat.find({item:item,stage:'crush'},function(err,focs){
              let opBal2 = focs[0].massKgs + number1
              let id5 = focs[0]._id
              let opBal2Tonnes = opBal2 / 1000

              RawMat.findByIdAndUpdate(id5,{massKgs:opBal2, massTonnes:opBal2Tonnes},function(err,locs){

              }) 
            })

            var final = new FinalProduct()
            final.refNumber = batchNumber
            final.quantity = number1
            final.date = mformat
            final.ingredient = item
            final.month = month
            final.year = year
            final.status = 'null'
      
            final.save().then(pro =>{
      
              res.redirect('/production/batchListCrush')
            })


          })

        })
        
      }


      else if(item == 'lemon'){
        for(var i = 0;i<docs.length; i++){
           
          arrV.push(docs[i].newMass)
            }
            //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
           console.log(arrV,'arrV')
          
          //InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
          number1=0;
          for(var z in arrV) { number1 += arrV[z]; }

          BatchGingerCrush.findById(batchId,function(err,doc){
            let qtyInMass= doc.qtyInMass
            let batchNumber = doc.batchNumber
            variance = number1 - qtyInMass

          BatchGingerCrush.findByIdAndUpdate(batchId,{$set:{qtyOutMass:number1,status:'qtyOut',variance:variance,status2:'crushed',nxtStage:'fermentation'}},function(err,vocs){
 RawMat.find({item:item,stage:'raw'},function(err,tocs){
              let opBal = tocs[0].massKgs - qtyInMass
              let opBalTonnes = opBal / 1000
              let id4 = tocs[0]._id
            RawMat.findByIdAndUpdate(id4,{massKgs:opBal,massTonnes:opBalTonnes},function(err,locs){

            })  

            })

            RawMat.find({item:item,stage:'crush'},function(err,focs){
              let opBal2 = focs[0].massKgs + number1
              let id5 = focs[0]._id
              let opBal2Tonnes = opBal2 / 1000

              RawMat.findByIdAndUpdate(id5,{massKgs:opBal2, massTonnes:opBal2Tonnes},function(err,locs){

              }) 
            })

            var final = new FinalProduct()
            final.refNumber = batchNumber
            final.quantity = number1
            final.date = mformat
            final.ingredient = item
            final.month = month
            final.year = year
            final.status = 'null'
      
            final.save().then(pro =>{
      
              res.redirect('/productionbatchListCrush')
            })


          })

        })
        
      }

      else if(item == 'garlic'){
        for(var i = 0;i<docs.length; i++){
           
          arrV.push(docs[i].newMass)
            }
            //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
           console.log(arrV,'arrV')
          
          //InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
          number1=0;
          for(var z in arrV) { number1 += arrV[z]; }

          BatchGingerCrush.findById(batchId,function(err,doc){
            let qtyInMass= doc.qtyInMass
            let batchNumber = doc.batchNumber
            variance = number1 - qtyInMass
          BatchGingerCrush.findByIdAndUpdate(batchId,{$set:{qtyOutMass:number1,status:'qtyOut',variance:variance,status2:'crushed',nxtStage:'cooking'}},function(err,vocs){
 RawMat.find({item:item,stage:'raw'},function(err,tocs){
              let opBal = tocs[0].massKgs - qtyInMass
              let opBalTonnes = opBal / 1000
              let id4 = tocs[0]._id
            RawMat.findByIdAndUpdate(id4,{massKgs:opBal,massTonnes:opBalTonnes},function(err,locs){

            })  

            })

            RawMat.find({item:item,stage:'crush'},function(err,focs){
              let opBal2 = focs[0].massKgs + number1
              let id5 = focs[0]._id
              let opBal2Tonnes = opBal2 / 1000

              RawMat.findByIdAndUpdate(id5,{massKgs:opBal2, massTonnes:opBal2Tonnes},function(err,locs){

              }) 
            })

            var final = new FinalProduct()
            final.refNumber = batchNumber
            final.quantity = number1
            final.date = mformat
            final.ingredient = item
            final.month = month
            final.year = year
            final.status = 'null'
      
            final.save().then(pro =>{
      
              res.redirect('/production/batchListCrush')
            })


          })

        })
        
      }
        })
      
       
      })
      


router.get('/cooking',isLoggedIn,function(req,res){
  res.render('production/cookingBatch')
})


router.post('/cooking',isLoggedIn,function(req,res){
var date = req.body.date
var shift = req.body.shift
var operator = req.body.operator
var teamLeader = req.body.teamLeader
var m = moment()
var month = m.format('MMMM')
var year = m.format('YYYY')
var mformat = m.format('L')
let date6 =  moment().format('l');
let dateValue = moment().valueOf()

let date7 =  date6.replace(/\//g, "");

req.check('date','Enter Date').notEmpty();
req.check('operator','Enter Operator').notEmpty();
req.check('shift','Enter Shift').notEmpty();
req.check('teamLeader','Enter Team Leader').notEmpty();



var errors = req.validationErrors();

if (errors) {
  
  req.session.errors = errors;
  req.session.success = false;
  req.flash('danger', req.session.errors[0].msg);


  res.redirect('/production/cooking');

}
else{


  RefNo.find({date:date,type:"cooking"},function(err,docs){
    let size = docs.length + 1
   refNo = date7+'B'+size+'CKN'
    console.log(refNo,'refNo')

  var stock = new BatchCooking();
  stock.operator = operator
  stock.date =mformat
  stock.shift = shift
  stock.teamLeader = teamLeader
  stock.quantity = 0
  stock.batchNumber=refNo
  stock.month = month
  stock.year = year
  
  stock.save()
  .then(pro =>{


   
    var book = new RefNo();
    book.refNumber = refNo
    book.date = date
    book.type = 'cooking'
    book.save()
    .then(prod =>{

      res.redirect('/production/cooking/'+pro._id)
     

    })
  })

  })
}



})





router.get('/cooking/:id',isLoggedIn,function(req,res){

var id = req.params.id
BatchCooking.findById(id,function(err,doc){
let batchNumber = doc.batchNumber
let shift = doc.shift
let operator = doc.operator
let teamLeader = doc.teamLeader
let date = doc.date
  res.render('production/cookingMaterial',{batchNumber:batchNumber,
  shift:shift,operator:operator,date:date,id:id,teamLeader:teamLeader})
})
})



router.post('/cookingMat/',isLoggedIn,function(req,res){

  var ingredient = req.body.ingredient
  var batchNumber = req.body.batchNumber
  var quantity = req.body.code
  var potNumber = req.body.potNumber
  var startTime = req.body.time
  var finishTime = req.body.finishTime
  var date = req.body.date
  var refNumber = req.body.refNumber
  var shift = req.body.shift
  var operator = req.body.operator
  var teamLeader = req.body.teamLeader
  let unit

  if(ingredient == 'ginger'){
    unit = 'drums'
  }else if(ingredient == 'tea'){
    unit = 'bags'
  }else if(ingredient == 'sugar'){
    unit = 'bags'
  }




var cook = new Cooking()
cook.ingredient = ingredient
cook.batchNumber = batchNumber
cook.quantity = quantity
cook.potNumber = potNumber
cook.time = startTime
cook.finishTime = finishTime
cook.date = date
cook.unit = unit
cook.refNumber = refNumber
cook.shift = shift
cook.operator = operator
cook.teamLeader = teamLeader

cook.save()
      .then(pro =>{
      
        res.send(pro)
      
      })
  





})



router.post('/reloadCooking/:id', (req, res) => {
  var pro = req.user
  var m = moment()
  var id = req.params.id

  var mformat = m.format("L")
  
  Cooking.find({refNumber:id},(err, docs) => {
 console.log(docs,'docs')
    res.send(docs)
            })

  }); 


  //Autocomplete for Crush
  router.get('/autocompleteCrush/',isLoggedIn, function(req, res, next) {
    var id = req.user._id


      var regex= new RegExp(req.query["term"],'i');
     
      var itemFilter =BatchGingerCrush.find({ item:regex,nxtStage:'cooking'},{'item':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
    
      
      itemFilter.exec(function(err,data){
     
   
    console.log('data',data)
    
    var result=[];
    
    if(!err){
       if(data && data.length && data.length>0){
         data.forEach(shop=>{
   

   
       
    
            
           let obj={
             id:shop._id,
             label: shop.item
  
         
       
         
           
            
    
             
           };
          
           result.push(obj);
        
          })
      
    
       }
     
       res.jsonp(result);
  
      }
    
    })
   
    });
  
 
//this route shop
    router.post('/autoCrush',isLoggedIn,function(req,res){
        var code = req.body.code
  

    
        
       
        BatchGingerCrush.find({item:code},function(err,docs){
       if(docs == undefined){
         res.redirect('/')
       }else

          res.send(docs[0])
        })
      
      
      })
 


      router.get('/closeCookingBatch/:id',isLoggedIn,function(req,res){

var id = req.params.id
let arrV = []
let number1 
var m = moment()
var month = m.format('MMMM')
var year = m.format('YYYY')
var mformat = m.format('L')
let total
let unit

BatchCooking.findById(id,function(err,doc){
  let batchNumber = doc.batchNumber
  let finalProduct

Cooking.find({batchNumber:batchNumber},function(err,docs){

  for(var i = 0;i<docs.length; i++){
           
    arrV.push(docs[i].quantity)
      }
      //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
     console.log(arrV,'arrV')
    
    //InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
    number1=0;
    for(var z in arrV) { number1 += arrV[z]; }
    total = number1
    BatchCooking.findByIdAndUpdate(id,{$set:{qauntity:number1}},function(err,locs){

    })

if(docs.length > 1){
  if(docs[0].ingredient == "ginger" && docs[1].ingredient == "tea" ||  docs[0].ingredient == "tea" && docs[1].ingredient == "ginger" ){
    finalProduct = 'gingerTea'
    //unit = 'tank'
  }
  else if(docs[0].ingredient == "sugar" && docs[1].ingredient == "tea" ||  docs[0].ingredient == "tea" && docs[1].ingredient == "sugar"){
    finalProduct = 'colour'
    //unit = 'tank'
  }
  else if(docs[0].ingredient == "ginger" && docs[1].ingredient == "garlic" ||  docs[0].ingredient == "garlic" && docs[1].ingredient == "ginger"){
    finalProduct = 'gingerGarlic'
    //unit = 'tank'
  }
  
  else{
    finalProduct = docs[0].ingredient
  }
}else if(docs.length == 1){
if(docs[0].ingredient == 'sugar'){
  finalProduct = 'colour'
  //unit = 'tank'
}else if(docs[0].ingredient == 'tea'){
  finalProduct = 'tea'
  //unit = 'bags'
}
else if(docs[0].ingredient == 'ginger'){
  finalProduct = 'ginger'
}


else{
  finalProduct =docs[0].ingredient 
}
}

console.log(finalProduct,'finalProduct33')

    BatchCooking.findByIdAndUpdate(id,{$set:{status:"complete",finalProduct:finalProduct,quantity:number1}},function(err,locs){
      Cooking.find({batchNumber:batchNumber},function(err,docs){
        for(var i = 0;i<docs.length; i++){

          let cid = docs[i]._id
          Cooking.findByIdAndUpdate(cid,{$set:{finalProduct:finalProduct}},function(err,kocs){
            
          })
          }
        })
      Ingredients.find({item:finalProduct},function(err,toc){
        let openingBalC = toc[0].massKgs + number1
        let openingBal = openingBalC / 5
        let id2 = toc[0]._id

      Ingredients.findByIdAndUpdate(id2,{$set:{massKgs:openingBal}},function(err,vocs){

      })

      })
  

     RawMat.find({item:finalProduct,stage:'cooking'},function(err,tocs){
       // let opBal = tocs[0].massKgs + number1
       let opBalV = number1 / 5
       let opBal = tocs[0].uniqueMeasure + opBalV
        //let opBalTonnes = opBal / 1000
        let id4 = tocs[0]._id
      RawMat.findByIdAndUpdate(id4,{massKgs:opBal,uniqueMeasure:opBal},function(err,locs){

      })  

      })

      let nTanks
      if(finalProduct == 'colour'){
        nTanks = number1 / 2
      }else{
        nTanks = number1 / 5
      }
      var final = new FinalProduct()
      final.refNumber = batchNumber
      final.quantity = nTanks
      final.date = mformat
      final.ingredient = finalProduct
      final.month = month
      final.year = year
      //final.unit = unit
      final.status = 'null'

      final.save().then(pro =>{

      
      })

      Cooking.find({batchNumber:batchNumber},function(err,docs){

        for(var i = 0;i<docs.length; i++){

          let item = docs[i].ingredient
          let quantity= docs[i].quantity
          let refNumber = docs[i].refNumber

          if(item == 'sugar'){
            RawMat.find({item:item,stage:'raw'},function(err,tocs){
              if(tocs.length > 0){
             // let opBal = tocs[0].massKgs - quantity
             let opBalKg = tocs[0].massKgs - quantity * 50
             let opBal = tocs[0].uniqueMeasure - quantity
              //let opBalTonnes = opBal / 1000
              let id4 = tocs[0]._id
            RawMat.findByIdAndUpdate(id4,{massKgs:opBal,uniqueMeasure:opBal},function(err,locs){
  
            })  
          }
            })

FinalProduct.find({ingredient:"sugar",refNumber:refNumber},function(err,roc){
  if(roc){
    let rocId = roc[0]._id
    let rocQty = roc[0].quantity - quantity

    if(rocQty > 0){

      FinalProduct.findByIdAndUpdate(rocId,{$set:{quantity:rocQty}},function(err,yoc){

      })
    }else{
    FinalProduct.findByIdAndUpdate(rocId,{$set:{quantity:0}},function(err,yoc){
        
      })
    }

  }
})
          }


         else  if(item == 'tea'){
            RawMat.find({item:item,stage:'raw'},function(err,tocs){
              if(tocs.length > 0){
             let opBalKg = tocs[0].massKgs - quantity * 50
             let opBal = tocs[0].uniqueMeasure - quantity
              //let opBalTonnes = opBal / 1000
              let id4 = tocs[0]._id
            RawMat.findByIdAndUpdate(id4,{massKgs:opBalKg,uniqueMeasure:opBal},function(err,locs){
  
            })  
          }
            })
          }
          RawMat.find({item:item,stage:'crush'},function(err,tocs){
            if(tocs.length > 0){
           // let opBal = tocs[0].massKgs - quantity
           let opBal = tocs[0].uniqueMeasure - quantity
            //let opBalTonnes = opBal / 1000
            let id4 = tocs[0]._id
          RawMat.findByIdAndUpdate(id4,{massKgs:opBal,uniqueMeasure:opBal},function(err,locs){

          })  
        }
          })
        
        }

        })
  

    
    })

})

res.redirect('/production/batchListIngredients')


})
      })


      
      
 
router.get('/batchListIngredients',function(req,res){
  Ingredients.find(function(err,docs){
  
    let arr=[]
    for(var i = docs.length - 1; i>=0; i--){
  
      arr.push(docs[i])
    }
  
    res.render('production/batchListIngredients',{listX:arr})
  
  })
  
  
  
  })





router.get('/batchFermentation',isLoggedIn,function(req,res){
  res.render('production/batchFermentation')
})


router.post('/batchFermentation',isLoggedIn,function(req,res){
  var date = req.body.date
  var product = req.body.product
  var operator = req.body.operator
  let prefix
  var water = req.body.water
  var endDate = req.body.endDate
  var m = moment()
  var month = m.format('MMMM')
  var year = m.format('YYYY')
  var mformat = m.format('L')
  let date6 =  moment().format('l');
  let dateValue = moment().valueOf()
  var id = req.user._id
  let date7 =  date6.replace(/\//g, "");
  
  req.check('date','Enter Date').notEmpty();
  req.check('operator','Enter Operator').notEmpty();
  req.check('water','Enter Litres of Water').notEmpty();
  req.check('product','Enter Product').notEmpty();
  req.check('endDate','Enter End Date').notEmpty();
  
  
  
  var errors = req.validationErrors();
  
  if (errors) {
    
    req.session.errors = errors;
    req.session.success = false;
    req.flash('danger', req.session.errors[0].msg);
  
  
    res.redirect('/production/batchFermentation');
  
  }
  else{
  
  Product.find({name:product},function(err,loc){
    if(loc){
     prefix = loc[0].prefix
    }
  
    RefNo.find({date:date,type:"fermentation"},function(err,docs){
      let size = docs.length + 1
     refNo = date7+prefix+'B'+size+'FM'
      console.log(refNo,'refNo')
  
    var stock = new BatchFermentation();
    stock.operator = operator
    stock.date =date
    stock.water = water
    stock.endDate = endDate
    stock.product = product
    stock.tanksDrained = 0
    stock.quantity = 0
    stock.status ='null'
    stock.batchNumber=refNo
    stock.month = month
    stock.year = year
    
    stock.save()
    .then(pro =>{
  
  User.findByIdAndUpdate(id,{$set:{endDate:endDate}},function(err,rocs){

  })
     
      var book = new RefNo();
      book.refNumber = refNo
      book.product = product
      book.date = date
      book.type = 'fermentation'
      book.save()
      .then(prod =>{
  
        res.redirect('/production/fermentation/'+pro._id)
       
  
      })
    })
    })
    })
  }
  
  
  
  })
  


  router.get('/fermentation/:id',isLoggedIn,function(req,res){
    var errorMsg = req.flash('danger')[0];
    var successMsg = req.flash('success')[0];
   
  
    var id = req.params.id
    BatchFermentation.findById(id,function(err,doc){
    let batchNumber = doc.batchNumber
    let product = doc.product
    let date = doc.date
    let operator = doc.operator
    let water = doc.water
    
    /*let date = doc.date*/
      res.render('production/fermentation',{batchNumber:batchNumber,
      product:product,operator:operator,date:date,id:id,water:water,successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg})
    })
    })
    
router.get('/fermentationPreload/:id',isLoggedIn,function(req,res){
  var id = req.params.id
console.log(id,'fermentationPreload')
   Fermentation.find({batchNumber:id},function(err,docs){
     res.send(docs)
   })
})



    router.post('/fermentationMat/',isLoggedIn,function(req,res){
      var tanks = req.body.tanks
      var ingredient = req.body.ingredient
      var batchNumber = req.body.batchNumber
      var quantity = req.body.code
      var date = req.body.date
      var refNumber = req.body.refNumber
      var operator = req.body.operator
      var product = req.body.product
      var water = req.body.water
      var endDate = req.user.endDate
  
    let unit
    if(ingredient == 'honey'){
      unit = 'bags'
    }else if (ingredient == 'gingerTea'){
      unit = 'tanks'
    }
    
  else if (ingredient == 'ginger'){
    unit = 'tanks'
  }else if(ingredient == 'colour'){
      unit = 'tanks'
    }else if(ingredient== 'sugar'){
      unit = 'bags'
    }
    
    
    var cook = new Fermentation()
    cook.ingredient = ingredient
    cook.batchNumber = batchNumber
    cook.quantity = quantity
    cook.date = date
    cook.endDate = endDate
    cook.product = product
    cook.water = water
    cook.unit = unit
    cook.refNumber = refNumber
    cook.operator = operator
    
    cook.save()
          .then(pro =>{

            BatchFermentationIngredients.find({batchNumber:batchNumber,ingredient:ingredient},function(err,docs){
              if(docs.length == 0){
                 var user = new BatchFermentationIngredients();
                  user.ingredient = ingredient;
                  user.quantity = quantity
                  user.tanks = tanks;
                  user.batchNumber = batchNumber
                  user.refNumber = refNumber
                  user.product = product
                  user.status = 'null'
              
                  user.save()
                    .then(user =>{
                    })

                  }else{
            console.log(pro.quantity,'quantity555')
            let idF = docs[0]._id
            let opQ = docs[0].quantity + pro.quantity
            BatchFermentationIngredients.findByIdAndUpdate(idF,{$set:{quantity:opQ}},function(err,pocs){

            })
                  }

                  })

                     if(ingredient == 'ginger'){
                  
                        RawMat.find({item:ingredient,stage:'cooking'},function(err,tocs){
                          let opBal = tocs[0].massKgs - pro.quantity
                          //let opBalTonnes = opBal / 1000
                          let id4 = tocs[0]._id
                        RawMat.findByIdAndUpdate(id4,{massKgs:opBal,uniqueMeasure:opBal},function(err,locs){
              
                        })  
              
                        })
        
        
                        RawMat.find({item:ingredient,stage:'fermentation'},function(err,tocs){
                          let opBal2 = tocs[0].massKgs + pro.quantity
                         // let opBalTonnes2 = opBal2 / 1000
                          let id5 = tocs[0]._id
                        RawMat.findByIdAndUpdate(id5,{massKgs:opBal2,uniqueMeasure:opBal2},function(err,locs){
                  
                        })  
                  
                        })
        
                      }else if(ingredient == 'sugar'){

                          RawMat.find({item:ingredient,stage:'raw'},function(err,tocs){
                            if(tocs.length > 0){
                           // let opBal = tocs[0].massKgs - quantity
                           let opBalKg = tocs[0].massKgs - quantity * 50
                           let opBal = tocs[0].uniqueMeasure - quantity
                            //let opBalTonnes = opBal / 1000
                            let id4 = tocs[0]._id
                          RawMat.findByIdAndUpdate(id4,{massKgs:opBal,uniqueMeasure:opBal},function(err,locs){
                
                          })  
                        }


                          })

                          FinalProduct.find({ingredient:"sugar",refNumber:refNumber},function(err,roc){
                            if(roc){
                              let rocId = roc[0]._id
                              let rocQty = roc[0].quantity - quantity
                          
                              if(rocQty > 0){
                          
                                FinalProduct.findByIdAndUpdate(rocId,{$set:{quantity:rocQty}},function(err,yoc){
                          
                                })
                              }else{
                              FinalProduct.findByIdAndUpdate(rocId,{$set:{quantity:0,status:"closed"}},function(err,yoc){
                                  
                                })
                              }
                          
                            }


                            RawMat.find({item:ingredient,stage:'fermentation'},function(err,tocs){
                              let opBal2 = tocs[0].massKgs + pro.quantity
                              let opBalV = tocs[0].uniqueMeasure + pro.quantity
                             // let opBalTonnes2 = opBal2 / 1000
                              let id5 = tocs[0]._id
                            RawMat.findByIdAndUpdate(id5,{massKgs:opBal2,uniqueMeasure:opBalV},function(err,locs){
                      
                            })  
                      
                            })
                          })
              
                      }
                       else if(ingredient == 'gingerTea'){
                  
                        RawMat.find({item:ingredient,stage:'cooking'},function(err,tocs){
                          let opBal = tocs[0].massKgs - pro.quantity
                          //let opBalTonnes = opBal / 1000
                          let opBal3 = tocs[0].uniqueMeasure - pro.quantity
                          let id4 = tocs[0]._id
                        RawMat.findByIdAndUpdate(id4,{massKgs:opBal,uniqueMeasure:opBal3},function(err,locs){
              
                        })  
              
                        })
        
        
                        RawMat.find({item:ingredient,stage:'fermentation'},function(err,tocs){
                          let opBal2 = tocs[0].massKgs + pro.quantity
                          let opBal4 = tocs[0].uniqueMeasure + pro.quantity
                         // let opBalTonnes2 = opBal2 / 1000
                          let id5 = tocs[0]._id
                        RawMat.findByIdAndUpdate(id5,{massKgs:opBal2,uniqueMeasure:opBal4},function(err,locs){
                  
                        })  
                  
                        })
        
                      }

                      else if(ingredient == 'honey'){
                  
                        RawMat.find({item:'honey',stage:'raw'},function(err,tocs){
                          let opBal = tocs[0].uniqueMeasure - pro.quantity
                          //let opBalTonnes = opBal / 1000
                          let id4 = tocs[0]._id
                        RawMat.findByIdAndUpdate(id4,{massKgs:opBal,uniqueMeasure:opBal},function(err,locs){
              
                        })  
              
                        })
        
        
                        RawMat.find({item:ingredient,stage:'fermentation'},function(err,tocs){
                          let opBal2 = tocs[0].uniqueMeasure + pro.quantity
                         // let opBalTonnes2 = opBal2 / 1000
                          let id5 = tocs[0]._id
                        RawMat.findByIdAndUpdate(id5,{massKgs:opBal2,uniqueMeasure:opBal2},function(err,locs){
                  
                        })  
                  
                        })




                        FinalProduct.find({ingredient:"honey",refNumber:refNumber},function(err,roc){
                          if(roc){
                            let rocId = roc[0]._id
                            let rocQty = roc[0].quantity - quantity
                        
                            if(rocQty > 0){
                        
                              FinalProduct.findByIdAndUpdate(rocId,{$set:{quantity:rocQty}},function(err,yoc){
                        
                              })
                            }else{
                            FinalProduct.findByIdAndUpdate(rocId,{$set:{quantity:0,status:"closed"}},function(err,yoc){
                                
                              })
                            }
                        
                          }
                        })
        
                      }
                      
                      
                      else if(ingredient == 'bananas'){
                        RawMat.find({item:ingredient,stage:'crush'},function(err,tocs){
                          let opBal = tocs[0].massKgs - pro.quantity
                          //let opBalTonnes = opBal / 1000
                          let id4 = tocs[0]._id
                        RawMat.findByIdAndUpdate(id4,{massKgs:opBal,uniqueMeasure:opBal},function(err,locs){
              
                        })  
              
                        })
        
        
                        RawMat.find({item:ingredient,stage:'fermentation'},function(err,tocs){
                          let opBal2 = tocs[0].massKgs + pro.quantity
                          //let opBalTonnes2 = opBal2 / 1000
                          let id5 = tocs[0]._id
                        RawMat.findByIdAndUpdate(id5,{massKgs:opBal2,uniqueMeasure:opBal},function(err,locs){
                  
                        })  
                  
                        })
        
                      }
                  

                      else if(ingredient == 'colour'){
                        RawMat.find({item:ingredient,stage:'cooking'},function(err,tocs){
                          let opBal = tocs[0].massKgs - pro.quantity
                          let opBal3 = tocs[0].uniqueMeasure - pro.quantity
                          let opBalTonnes = opBal / 1000
                          let id4 = tocs[0]._id
                          if(opBal3 > 0){
                        RawMat.findByIdAndUpdate(id4,{massKgs:opBal,uniqueMeasure:opBal3,massTonnes:opBalTonnes},function(err,locs){
              
                        })  
                      }else{
                        RawMat.findByIdAndUpdate(id4,{massKgs:0,uniqueMeasure:0,massTonnes:0},function(err,locs){
              
                        })  
                      }
              
                        })
        
        
                        RawMat.find({item:ingredient,stage:'fermentation'},function(err,tocs){
                          let opBal2 = tocs[0].massKgs + pro.quantity
                          let opBal4 = tocs[0].uniqueMeasure + pro.quantity
                          let opBalTonnes2 = opBal2 / 1000
                          let id5 = tocs[0]._id
                        RawMat.findByIdAndUpdate(id5,{massKgs:opBal2,uniqueMeasure:opBal4,massTonnes:opBalTonnes2},function(err,locs){
                  
                        })  
                  
                        })
        
                      }

                      else if(ingredient == 'gingerGarlic'){
                        RawMat.find({item:ingredient,stage:'cooking'},function(err,tocs){
                          let opBal = tocs[0].massKgs - pro.quantity
                          let opBalTonnes = opBal / 1000
                          let id4 = tocs[0]._id
                        RawMat.findByIdAndUpdate(id4,{massKgs:opBal,massTonnes:opBalTonnes},function(err,locs){
              
                        })  
              
                        })
        
        
                        RawMat.find({item:ingredient,stage:'fermentation'},function(err,tocs){
                          let opBal2 = tocs[0].massKgs + pro.quantity
                          let opBalTonnes2 = opBal2 / 1000
                          let id5 = tocs[0]._id
                        RawMat.findByIdAndUpdate(id5,{massKgs:opBal2,massTonnes:opBalTonnes2},function(err,locs){
                  
                        })  
                  
                        })
        
                      }
                  
          
          
            res.send(pro)
          
          })
      
    
    
    
    
    
    })
    
    


  //Autocomplete for Crush
  router.get('/autocompleteFerment/',isLoggedIn, function(req, res, next) {
    var id = req.user._id
    var customer = req.user.autoCustomer

      var regex= new RegExp(req.query["term"],'i');
     
      var itemFilter =FinalProduct.find({ refNumber:regex,status:"null"},{'refNumber':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
    
      
      itemFilter.exec(function(err,data){
     
   
    console.log('data',data)
    
    var result=[];
    
    if(!err){
       if(data && data.length && data.length>0){
         data.forEach(shop=>{
   

   
       
    
            
           let obj={
             id:shop._id,
             label: shop.refNumber
  
         
       
         
           
            
    
             
           };
          
           result.push(obj);
        
          })
      
    
       }
     
       res.jsonp(result);
  
      }
    
    })
   
    });
  
 
//this route shop
    router.post('/autoFerment',isLoggedIn,function(req,res){
        var code = req.body.code
  

    
        
       
        FinalProduct.find({refNumber:code},function(err,docs){
       if(docs == undefined){
         res.redirect('/')
       }else

          res.send(docs[0])
        })
      
      
      })
 



      
      router.post('/closeFermentationBatch/:id',isLoggedIn,function(req,res){

        var id = req.params.id
        let arrV = []
        let number1 

        var m = moment()
        var month = m.format('MMMM')
        var year = m.format('YYYY')
        var mformat = m.format('L')
        var tanks = req.body.code
        let product,  litres, refNumber
      
       console.log(tanks,'tanks')
  
        
        if (tanks == undefined || tanks == "") {
          
          /*req.session.errors = errors;
          req.session.success = false;*/
          req.flash('danger', "Enter Tank");
        
        
          res.redirect('/production/fermentation/'+id);
        
        }
        else{   
        BatchFermentation.findById(id,function(err,doc){
          let product = doc.product
          refNumber = doc.refNumber
          FermentationProduct.find({product:product},function(err,docs){
            let oTanks = docs[0].tanks + tanks
            let id2 = docs[0]._id


            FermentationProduct.findByIdAndUpdate(id2,{$set:{tanks:oTanks}},function(err,tocs){

            })

            console.log(refNumber,'refNumber777')
           

           

BatchFermentation.findByIdAndUpdate(id,{$set:{tanks:tanks}},function(err,gocs){


  res.send(gocs)


})
     
   
})
})

//res.redirect('/rm/batchFermentation')




        }


        })
        

router.get('/draining',isLoggedIn,function(req,res){
  BatchFermentation.find({status:"null"},function(err,docs){
       res.render('production/draining',{listX:docs})

      })
 })



 router.get('/draining/:id/:id2/:id3',isLoggedIn,function(req,res){
var id = req.params.id
var product = req.params.id2
var availableTanks = req.params.id3
var litres = availableTanks * 1000
  res.render('production/drain',{id:id,product:product,availableTanks:availableTanks,litres:litres})
 })
        





router.post('/draining/',isLoggedIn,function(req,res){
     var releasedBy = req.body.releasedBy
      //var batchNumber = req.body.batchNumber
    var m = moment()
    var month = m.format('MMMM')
      var receivedBy = req.body.receivedBy
      var date = req.body.date
      var batchNumber = req.body.batchNumber
      console.log(batchNumber,'batchNumber')
      var blendingTank = req.body.blendingTank
      var tanks= req.body.tanks
      var product = req.body.product
      //var water = req.body.wat
    
      var m = moment(date)
   
      var year = m.format('YYYY')
    
      var date = m.toString()
      var numDate = m.valueOf()
    var cook = new BlendedItems()
    cook.releasedBy = releasedBy
    //cook.refNumber = refNumber
    cook.receivedBy = receivedBy
    cook.date = date
    cook.month = month
    cook.blendingTank = blendingTank
    cook.year = year
    cook.product = product
    cook.tanks= tanks
    cook.litres = tanks * 1000
    cook.status = 'null'
    cook.refNumber = batchNumber
    //cook.operator = operator
    
    cook.save()
          .then(pro =>{
           console.log(pro,'proV')
BlendingTanks.find({tankNumber:blendingTank},function(err,toc){
  console.log(toc,'tock',toc.length)
  //if(toc.length > 0){
  
  let litresDrained = tanks * 1000
  let opLitres = toc[0].litres + litresDrained
  let maseId = toc[0]._id
  BlendingTanks.findByIdAndUpdate(maseId,{$set:{litres:opLitres,product:product,refNumber:batchNumber}},function(err,focs){


  })

//}

BatchFermentationIngredients.find({batchNumber:batchNumber},function(err,nocs){
  console.log(nocs.length,'nocs',nocs)
  for(var i = 0;i<nocs.length;i++){
    let quantity = nocs[i].quantity / nocs[i].tanks
    console.log(nocs[i].quantity,'/',nocs[i].tanks)
    let nQty =  quantity * tanks
    console.log(nQty,'nQty')
    let ingredient = nocs[i].ingredient
  


    Ingredients.find({item:ingredient},function(err,tocs){
  
      if(tocs.length > 0){

      
  
      // RawMat.find({item:item,stage:'fermentation'},function(err,tocs){
         //let opBal1 = tocs[0].massKgs - nQty
         let opBal1 = tocs[0].massKgs - nQty
        // let opBalTonnes1 = opBal1 / 1000
         let id4 = tocs[0]._id
       Ingredients.findByIdAndUpdate(id4,{massKgs:opBal1},function(err,locs){
   
       })  
      }
       //})
     })
    RawMat.find({item:ingredient,stage:"fermentation"},function(err,tocs){
  
  if(tocs.length>0){
     // RawMat.find({item:item,stage:'fermentation'},function(err,tocs){
        let opBal1 = tocs[0].massKgs - nQty
        let opBal2 = tocs[0].uniqueMeasure - nQty
        console.log(tocs[0].massKgs,'/',nQty,'output2')
        let opBalTonnes1 = opBal1 / 1000
        let id4 = tocs[0]._id
      RawMat.findByIdAndUpdate(id4,{massKgs:opBal1,uniqueMeasure:opBal2,massTonnes:opBalTonnes1},function(err,locs){
  
      })  
    }
      //})
    })
    //arrQ.push(nQty)
    RawMat.find({item:ingredient,stage:'blending'},function(err,tocs){
      if(tocs.length > 0){
      //let opBal2 = tocs[0].massKgs + nQty
      let opBal2 = tocs[0].uniqueMeasure + nQty
      let opBalTonnes2 = opBal2 / 1000
      let id5 = tocs[0]._id
    RawMat.findByIdAndUpdate(id5,{massKgs:opBal2,uniqueMeasure:opBal2},function(err,locs){
  
    })  
      }
    })
  
  }
  })     
BatchFermentation.find({batchNumber:batchNumber},function(err,docs){
let avTanks = docs[0].tanksDrained + pro.tanks
let remainingTanks = docs[0].tanks - avTanks
let id2 = docs[0]._id

if(remainingTanks == 0){


BatchFermentation.findByIdAndUpdate(id2,{$set:{tanksDrained:avTanks,remainingTanks:remainingTanks,status:"drained"}},function(err,vocs){


})

BatchFermentationIngredients.find({batchNumber:batchNumber},function(err,socs){
for(var i = 0; i<socs.length;i++){
  let sId = socs[i]._id
  BatchFermentationIngredients.findByIdAndUpdate(sId,{$set:{status:'complete'}},function(err,fox){
    
  })
}

})
}else{
  BatchFermentation.findByIdAndUpdate(id2,{$set:{tanksDrained:avTanks,remainingTanks:remainingTanks,}},function(err,vocs){


  })
}



FermentationProduct.find({product:product},function(err,docs){
  let oTanks = docs[0].tanks - tanks
  let idF = docs[0]._id
FermentationProduct.findByIdAndUpdate(idF,{$set:{tanks:oTanks}},function(err,yocs){
  
})
})




})
}) 


            
            res.send(pro)
          
          })
      
})


 //Autocomplete for Crush
 router.get('/autocompleteTank/',isLoggedIn, function(req, res, next) {
  var id = req.user._id
  var customer = req.user.autoCustomer

    var regex= new RegExp(req.query["term"],'i');
   
    var itemFilter =BlendingTanks.find({ tankNumber:regex},{'tankNumber':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
  
    
    itemFilter.exec(function(err,data){
   
 
  console.log('data',data)
  
  var result=[];
  
  if(!err){
     if(data && data.length && data.length>0){
       data.forEach(shop=>{
 

 
     
  
          
         let obj={
           id:shop._id,
           label: shop.tankNumber

       
     
       
         
          
  
           
         };
        
         result.push(obj);
      
        })
    
  
     }
   
     res.jsonp(result);

    }
  
  })
 
  });


//this route shop
  router.post('/autoTank',isLoggedIn,function(req,res){
      var code = req.body.code


  
      
     
      BlendingTanks.find({tankNumber:code},function(err,docs){
     if(docs == undefined){
       res.redirect('/')
     }else

        res.send(docs[0])
      })
    
    
    })



router.get('/closeDraining/:id',isLoggedIn,function(req,res){

  res.redirect('/production/draining')
})

 
  //Autocomplete for Crush
  router.get('/autocompleteDrain/',isLoggedIn, function(req, res, next) {
    var id = req.user._id
    var customer = req.user.autoCustomer

      var regex= new RegExp(req.query["term"],'i');
     
      var itemFilter =BatchFermentation.find({ refNumber:regex},{'refNumber':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
    
      
      itemFilter.exec(function(err,data){
     
   
    console.log('data',data)
    
    var result=[];
    
    if(!err){
       if(data && data.length && data.length>0){
         data.forEach(shop=>{
   

   
       
    
            
           let obj={
             id:shop._id,
             label: shop.refNumber
  
         
       
         
           
            
    
             
           };
          
           result.push(obj);
        
          })
      
    
       }
     
       res.jsonp(result);
  
      }
    
    })
   
    });
  
 
//this route shop
    router.post('/autoDrain',isLoggedIn,function(req,res){
        var code = req.body.code
  

    
        
       
        BatchFermentation.find({refNumber:code},function(err,docs){
       if(docs == undefined){
         res.redirect('/')
       }else

          res.send(docs[0])
        })
      
      
      })
 

      router.get('/updateStockBF',function(req,res){
        BatchFermentation.find(function(err,docs){
          for(var i = 0;i<docs.length;i++){
           let id = docs[i]._id
           BatchFermentation.findByIdAndRemove(id,(err,doc)=>{
      
           }) 
          }
          res.redirect('/rm/updateStockBFI')
        })
      })
      
      
      
      
      
      router.get('/updateStockBFI',function(req,res){
        BatchFermentationIngredients.find(function(err,docs){
          for(var i = 0;i<docs.length;i++){
           let id = docs[i]._id
           BatchFermentationIngredients.findByIdAndRemove(id,(err,doc)=>{
      
           }) 
          }
          res.redirect('/rm/updateBBC')
        })
      })


      router.get('/updateBBC',function(req,res){
        BatchCooking.find(function(err,docs){
          for(var i = 0;i<docs.length;i++){
           let id = docs[i]._id
           BatchCooking.findByIdAndRemove(id,(err,doc)=>{
      
           }) 
          }
          res.redirect('/rm/updateBRR')
        })
      })
      
          
  
      router.get('/updateBRR',function(req,res){
        BatchRR.find(function(err,docs){
          for(var i = 0;i<docs.length;i++){
           let id = docs[i]._id
           BatchRR.findByIdAndRemove(id,(err,doc)=>{
      
           }) 
          }
          res.redirect('/rm/updateBGC')
        })
      })


      router.get('/updateBGC',function(req,res){
        BatchGingerCrush.find(function(err,docs){
          for(var i = 0;i<docs.length;i++){
           let id = docs[i]._id
           BatchGingerCrush.findByIdAndRemove(id,(err,doc)=>{
      
           }) 
          }
          res.redirect('/rm/updateBGW')
        })
      })
  
      router.get('/updateBGW',function(req,res){
        BatchGingerWash.find(function(err,docs){
          for(var i = 0;i<docs.length;i++){
           let id = docs[i]._id
           BatchGingerWash.findByIdAndRemove(id,(err,doc)=>{
      
           }) 
          }
          res.redirect('/rm/updateGW')
        })
      })
  
      router.get('/updateGW',function(req,res){
        GingerWash.find(function(err,docs){
          for(var i = 0;i<docs.length;i++){
           let id = docs[i]._id
           GingerWash.findByIdAndRemove(id,(err,doc)=>{
      
           }) 
          }
          res.redirect('/rm/updateGC')
        })
      })


      router.get('/updateGC',function(req,res){
        GingerCrush.find(function(err,docs){
          for(var i = 0;i<docs.length;i++){
           let id = docs[i]._id
           GingerCrush.findByIdAndRemove(id,(err,doc)=>{
      
           }) 
          }
          res.redirect('/rm/updateC')
        })
      })



      router.get('/updateC',function(req,res){
        Cooking.find(function(err,docs){
          for(var i = 0;i<docs.length;i++){
           let id = docs[i]._id
           Cooking.findByIdAndRemove(id,(err,doc)=>{
      
           }) 
          }
          res.redirect('/rm/updateFP')
        })
      })

      router.get('/updateFP',function(req,res){
        FinalProduct.find(function(err,docs){
          for(var i = 0;i<docs.length;i++){
           let id = docs[i]._id
           FinalProduct.findByIdAndRemove(id,(err,doc)=>{
      
           }) 
          }
          res.redirect('/rm/updateBI')
        })
      })



      router.get('/updateBI',function(req,res){
        BlendedItems.find(function(err,docs){
          for(var i = 0;i<docs.length;i++){
           let id = docs[i]._id
           BlendedItems.findByIdAndRemove(id,(err,doc)=>{
      
           }) 
          }
          res.redirect('/rm/updateSV')
        })
      })


      router.get('/updateSV',function(req,res){
        StockVoucher.find(function(err,docs){
          for(var i = 0;i<docs.length;i++){
           let id = docs[i]._id
           StockVoucher.findByIdAndRemove(id,(err,doc)=>{
      
           }) 
          }
          res.redirect('/rm/updateSRM')
        })
      })


      router.get('/updateSRM',function(req,res){
       StockRM.find(function(err,docs){
          for(var i = 0;i<docs.length;i++){
           let id = docs[i]._id
          StockRM.findByIdAndRemove(id,(err,doc)=>{
      
           }) 
          }
          res.redirect('/rm/updateRM')
        })
      })

      router.get('/updateRM',function(req,res){
        RawMat.find(function(err,docs){
          for(var i = 0;i<docs.length;i++){
           let id = docs[i]._id
          RawMat.findByIdAndUpdate(id,{$set:{massKgs:0,massTonnes:0,uniqueMeasure:0,drums:0,crates:0}},function(err,tocs){

          })
          }
          res.redirect('/rm/updateIngredients')
        })
      })




      router.get('/updateIngredients',function(req,res){
        Ingredients.find(function(err,docs){
          for(var i = 0;i<docs.length;i++){
           let id = docs[i]._id
          Ingredients.findByIdAndUpdate(id,{$set:{massKgs:0}},function(err,tocs){

          })
          }
          res.redirect('/rm/updateCrushedItems')
        })
      })


      router.get('/updateCrushedItems',function(req,res){
        CrushedItems.find(function(err,docs){
          for(var i = 0;i<docs.length;i++){
           let id = docs[i]._id
          CrushedItems.findByIdAndUpdate(id,{$set:{massKgs:0,crates:0,uniqueMeasure:0}},function(err,tocs){

          })
          }
          res.redirect('/rm/updateBT')
        })
      })



      router.get('/updateBT',function(req,res){
        BlendingTanks.find(function(err,docs){
          for(var i = 0;i<docs.length;i++){
           let id = docs[i]._id
          BlendingTanks.findByIdAndUpdate(id,{$set:{litres:0,product:"null",refNumber:"null"}},function(err,tocs){

          })
          }
          res.redirect('/rm/warehouseStock')
        })
      })








      router.get('/statementGenGW/:id',isLoggedIn,function(req,res){
        //console.log(arrStatementR,'arrSingleUpdate')
        var arrStatemementR=[]
        var m = moment()
        var mformat = m.format('L')
        var month = m.format('MMMM')
        var year = m.format('YYYY')
        var date = req.user.date
        //var receiveDate = req.user.dispatchDate
        //var code ="Tiana Madzima"
        var id = req.params.id
       
        var arrG = []
        BatchGingerWash.find().lean().then(docs=>{
  
  
        
     let item = docs[0].item
     let refNumber = docs[0].refNumber
        //arrG.push(docs)
          
          console.log(docs,'arrG')
        //var studentName = 'Tiana Madzima'
        
        /*console.log(arr,'iiii')*/
        
        RefNoSeq.find(function(err,doc){
          let seqNum = doc[0].num
          let seqId = doc[0]._id
        //console.log(docs,'docs')
        
        const compile = async function (templateName, docs){
        const filePath = path.join(process.cwd(),'templates',`${templateName}.hbs`)
        
        const html = await fs.readFile(filePath, 'utf8')
        
        return hbs.compile(html)(docs)
        
        };
        
        
        
        
        (async function(){
        
        try{
        //const browser = await puppeteer.launch();
        const browser = await puppeteer.launch({
        headless: true,
        args: [
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--single-process",
        "--no-zygote",
        ],
        executablePath:
        process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath(),
        });
        
        const page = await browser.newPage()
        
        
        
        //const content = await compile('report3',arr[uid])
        const content = await compile('gw',docs)
        
        //const content = await compile('index',arr[code])
        
        await page.setContent(content, { waitUntil: 'networkidle2'});
        //await page.setContent(content)
        //create a pdf document
        await page.emulateMediaType('screen')
        //let height = await page.evaluate(() => document.documentElement.offsetHeight);
        await page.evaluate(() => matchMedia('screen').matches);
        await page.setContent(content, { waitUntil: 'networkidle0'});
        //console.log(await page.pdf(),'7777')
         
        let filename = 'GW'+seqNum+'.pdf'
        await page.pdf({
        //path:('../gitzoid2/reports/'+year+'/'+month+'/'+uid+'.pdf'),
        path:(`./public/statements/${year}/${month}/GW${seqNum}`+'.pdf'),
        format:"A4",
        width:'30cm',
        height:'21cm',
        landscape: true,
        //height: height + 'px',
        printBackground:true
        
        })
        
        //res.redirect('/rm/fileIdGW/'+filename)
        res.redirect('/production/openFileGW/'+seqNum)
        var repo = new RepoFiles();
        
        repo.filename = filename;
        repo.fileId = "null";
        repo.status = 'GW'
        repo.type = 'Washing'
        repo.item = item
        repo.date = mformat
        repo.year = year;
        repo.idNum = id
        repo.refNumber = refNumber
        
        
        console.log('done')
        
        repo.save().then(poll =>{
        
        })
        
        
        //upload.single('3400_Blessing_Musasa.pdf')
        
        
        
        /*await browser.close()
        
        /*process.exit()*/
        
        const file = await fs.readFile(`./public/statements/${year}/${month}/GW${seqNum}`+'.pdf');
        const form = new FormData();
        form.append("file", file,filename);
        //const headers = form.getHeaders();
        //Axios.defaults.headers.cookie = cookies;
        //console.log(form)
        await Axios({
          method: "POST",
         //url: 'https://portal.steuritinternationalschool.org/clerk/uploadStatement',
       url: 'https://niyonsoft.org/production/uploadStatementGW',
        //url:'http://localhost:8000/rm/uploadStatementGW',
          headers: {
            "Content-Type": "multipart/form-data"  
          },
          data: form
        });
        
        seqNum++
        RefNoSeq.findByIdAndUpdate(seqId,{$set:{num:seqNum}},function(err,tocs){
        
        })
          
        
       // res.redirect('/receiver/fileId/'+filename);
        
        
        }catch(e) {
        
        console.log(e)
        
        
        }
        
        
        }) ()
        
        })
      })
        
        //res.redirect('/hostel/discList')
        
        })
        
  
        router.get('/openFileGW/:id',isLoggedIn,function(req,res){
          var seqNum = req.params.id
         // var batchNumber = req.user.batchNumber
          var m = moment()
          var mformat = m.format('L')
          var month = m.format('MMMM')
          var year = m.format('YYYY')
          const path =`./public/statements/${year}/${month}/GW${seqNum}.pdf`
          if (fs.existsSync(path)) {
              res.contentType("application/pdf");
              fs.createReadStream(path).pipe(res)
          } else {
              res.status(500)
              console.log('File not found')
              res.send('File not found')
          }
          
          })
          
     
    
        
  router.post('/uploadStatementGW',upload.single('file'),(req,res,nxt)=>{
    var fileId = req.file.id
    console.log(fileId,'fileId')
    var filename = req.file.filename
    console.log(filename,'filename')
  RepoFiles.find({filename:filename},function(err,docs){
  if(docs.length>0){
  
  
  //console.log(docs,'docs')
  let id = docs[0]._id
  RepoFiles.findByIdAndUpdate(id,{$set:{fileId:fileId}},function(err,tocs){
  
  })
  
  }
  //res.redirect('/receiver/fileId/'+filename)
  res.redirect('/production/fileIdGW/'+filename)
  })
  
  })
  
  
  router.get('/fileIdGW/:id',function(req,res){
    console.log(req.params.id)
    var id = req.params.id
    
    res.redirect('/production/openGW/'+id)
    
    })
  
  
  router.get('/openGW/:id',(req,res)=>{
    var filename = req.params.id
    console.log(filename,'fileId')
      const bucket = new mongodb.GridFSBucket(conn.db,{ bucketName: 'uploads' });
      gfs.files.find({filename: filename}).toArray((err, files) => {
      console.log(files[0])
    
        const readStream = bucket.openDownloadStream(files[0]._id);
            readStream.pipe(res);
    
      })
     //gfs.openDownloadStream(ObjectId(mongodb.ObjectId(fileId))).pipe(fs.createWriteStream('./outputFile'));
    })
  
  
  ///gingerCrushing

  router.get('/statementGenGC/:id',isLoggedIn,function(req,res){
    //console.log(arrStatementR,'arrSingleUpdate')
    var arrStatemementR=[]
    var m = moment()
    var mformat = m.format('L')
    var month = m.format('MMMM')
    var year = m.format('YYYY')
    var date = req.user.date
    var id = req.params.id
    //var receiveDate = req.user.dispatchDate
    //var code ="Tiana Madzima"
   
    var arrG = []
    BatchGingerCrush.find({type:"normal"}).lean().then(docs=>{

      if(docs){
        let refNumber = docs[0].refNumber
        let item = docs[0].item
  
    
 
    //arrG.push(docs)
      
      console.log(docs,'arrG')
    //var studentName = 'Tiana Madzima'
    
    /*console.log(arr,'iiii')*/
    
    RefNoSeq.find(function(err,doc){
      let seqNum = doc[0].num
      let seqId = doc[0]._id
    //console.log(docs,'docs')
    
    const compile = async function (templateName, docs){
    const filePath = path.join(process.cwd(),'templates',`${templateName}.hbs`)
    
    const html = await fs.readFile(filePath, 'utf8')
    
    return hbs.compile(html)(docs)
    
    };
    
    
    
    
    (async function(){
    
    try{
    //const browser = await puppeteer.launch();
    const browser = await puppeteer.launch({
    headless: true,
    args: [
    "--disable-setuid-sandbox",
    "--no-sandbox",
    "--single-process",
    "--no-zygote",
    ],
    executablePath:
    process.env.NODE_ENV === "production"
      ? process.env.PUPPETEER_EXECUTABLE_PATH
      : puppeteer.executablePath(),
    });
    
    const page = await browser.newPage()
    
    
    
    //const content = await compile('report3',arr[uid])
    const content = await compile('gc',docs)
    
    //const content = await compile('index',arr[code])
    
    await page.setContent(content, { waitUntil: 'networkidle2'});
    //await page.setContent(content)
    //create a pdf document
    await page.emulateMediaType('screen')
    //let height = await page.evaluate(() => document.documentElement.offsetHeight);
    await page.evaluate(() => matchMedia('screen').matches);
    await page.setContent(content, { waitUntil: 'networkidle0'});
    //console.log(await page.pdf(),'7777')
     
    let filename = 'GC'+seqNum+'.pdf'
    await page.pdf({
    //path:('../gitzoid2/reports/'+year+'/'+month+'/'+uid+'.pdf'),
    path:(`./public/statements/${year}/${month}/GC${seqNum}`+'.pdf'),
    format:"A4",
    width:'30cm',
    height:'21cm',
    //height: height + 'px',
    landscape: true,
    printBackground:true
    
    })
    
    //res.redirect('/rm/fileIdGC/'+filename)
    res.redirect('/production/openFileGC/'+seqNum)
    var repo = new RepoFiles();
    
    repo.filename = filename;
    repo.fileId = "null";
    repo.status = 'GC'
    repo.type = 'Crushing'
    repo.item = item
    repo.date = mformat
    repo.year = year;
    repo.idNum = id
    repo.refNumber = refNumber
    repo.month = month
    
    
    console.log('done')
    
    repo.save().then(poll =>{
    
    })
    
    
    //upload.single('3400_Blessing_Musasa.pdf')
    
    
    
    /*await browser.close()
    
    /*process.exit()*/
    
    const file = await fs.readFile(`./public/statements/${year}/${month}/GC${seqNum}`+'.pdf');
    const form = new FormData();
    form.append("file", file,filename);
    //const headers = form.getHeaders();
    //Axios.defaults.headers.cookie = cookies;
    //console.log(form)
    await Axios({
      method: "POST",
     //url: 'https://portal.steuritinternationalschool.org/clerk/uploadStatement',
   url: 'https://niyonsoft.org/production/uploadStatementGC',
      //url:'http://localhost:8000/rm/uploadStatementGC',
      headers: {
        "Content-Type": "multipart/form-data"  
      },
      data: form
    });
    
    seqNum++
    RefNoSeq.findByIdAndUpdate(seqId,{$set:{num:seqNum}},function(err,tocs){
    
    })
      
    
   // res.redirect('/receiver/fileId/'+filename);
    
    
    }catch(e) {
    
    console.log(e)
    
    
    }
    
    
    }) ()
    
    })
  }
  })
    
    //res.redirect('/hostel/discList')
    
    })
    

    
router.get('/openFileGC/:id',isLoggedIn,function(req,res){
var seqNum= req.params.id
var batchNumber = req.user.batchNumber
var m = moment()
var mformat = m.format('L')
var month = m.format('MMMM')
var year = m.format('YYYY')
const path =`./public/statements/${year}/${month}/GC${seqNum}`+'.pdf'
if (fs.existsSync(path)) {
    res.contentType("application/pdf");
    fs.createReadStream(path).pipe(res)
} else {
    res.status(500)
    console.log('File not found')
    res.send('File not found')
}

})

    
router.post('/uploadStatementGC',upload.single('file'),(req,res,nxt)=>{
var fileId = req.file.id
console.log(fileId,'fileId')
var filename = req.file.filename
console.log(filename,'filename')
RepoFiles.find({filename:filename},function(err,docs){
if(docs.length>0){


//console.log(docs,'docs')
let id = docs[0]._id
RepoFiles.findByIdAndUpdate(id,{$set:{fileId:fileId}},function(err,tocs){

})

}
//res.redirect('/receiver/fileId/'+filename)
res.redirect('/production/fileIdGC/'+filename)
})

})


router.get('/fileIdGC/:id',function(req,res){
console.log(req.params.id)
var id = req.params.id

res.redirect('/production/openGC/'+id)

})


router.get('/openGC/:id',(req,res)=>{
var filename = req.params.id
console.log(filename,'fileId')
  const bucket = new mongodb.GridFSBucket(conn.db,{ bucketName: 'uploads' });
  gfs.files.find({filename: filename}).toArray((err, files) => {
  console.log(files[0])

    const readStream = bucket.openDownloadStream(files[0]._id);
        readStream.pipe(res);

  })
 //gfs.openDownloadStream(ObjectId(mongodb.ObjectId(fileId))).pipe(fs.createWriteStream('./outputFile'));
})

  ///cooking
  
  router.get('/statementGenCN/:id',isLoggedIn,function(req,res){
    //console.log(arrStatementR,'arrSingleUpdate')
    var arrStatemementR=[]
    var m = moment()
    var mformat = m.format('L')
    var month = m.format('MMMM')
    var year = m.format('YYYY')
    var date = req.user.date
    var id = req.params.id
    //var receiveDate = req.user.dispatchDate
    //var code ="Tiana Madzima"
   
    var arrG = []
    Cooking.find().lean().then(docs=>{

      if(docs){
        let refNumber = docs[0].refNumber
        let item = docs[0].item
  
    
 
    //arrG.push(docs)
      
      console.log(docs,'arrG')
    //var studentName = 'Tiana Madzima'
    
    /*console.log(arr,'iiii')*/
    
    RefNoSeq.find(function(err,doc){
      let seqNum = doc[0].num
      let seqId = doc[0]._id
    //console.log(docs,'docs')
    
    const compile = async function (templateName, docs){
    const filePath = path.join(process.cwd(),'templates',`${templateName}.hbs`)
    
    const html = await fs.readFile(filePath, 'utf8')
    
    return hbs.compile(html)(docs)
    
    };
    
    
    
    
    (async function(){
    
    try{
    //const browser = await puppeteer.launch();
    const browser = await puppeteer.launch({
    headless: true,
    args: [
    "--disable-setuid-sandbox",
    "--no-sandbox",
    "--single-process",
    "--no-zygote",
    ],
    executablePath:
    process.env.NODE_ENV === "production"
      ? process.env.PUPPETEER_EXECUTABLE_PATH
      : puppeteer.executablePath(),
    });
    
    const page = await browser.newPage()
    
    
    
    //const content = await compile('report3',arr[uid])
    const content = await compile('gcn',docs)
    
    //const content = await compile('index',arr[code])
    
    await page.setContent(content, { waitUntil: 'networkidle2'});
    //await page.setContent(content)
    //create a pdf document
    await page.emulateMediaType('screen')
    //let height = await page.evaluate(() => document.documentElement.offsetHeight);
    await page.evaluate(() => matchMedia('screen').matches);
    await page.setContent(content, { waitUntil: 'networkidle0'});
    //console.log(await page.pdf(),'7777')
     
    let filename = 'CN'+seqNum+'.pdf'
    await page.pdf({
    //path:('../gitzoid2/reports/'+year+'/'+month+'/'+uid+'.pdf'),
    path:(`./public/statements/${year}/${month}/CN${seqNum}`+'.pdf'),
    format:"A4",
    width:'30cm',
    height:'21cm',
    //height: height + 'px',
    landscape: true,
    printBackground:true
    
    })
    
    //res.redirect('/rm/fileIdGC/'+filename)
    res.redirect('/production/openFileCN/'+seqNum)
    var repo = new RepoFiles();
    
    repo.filename = filename;
    repo.fileId = "null";
    repo.status = 'CN'
    repo.type = 'Cooking'
    repo.item = item
    repo.date = mformat
    repo.year = year;
    repo.refNumber = refNumber
    repo.idNum = id
    repo.month = month
    
    
    console.log('done')
    
    repo.save().then(poll =>{
    
    })
    
    
    //upload.single('3400_Blessing_Musasa.pdf')
    
    
    
    /*await browser.close()
    
    /*process.exit()*/
    
    const file = await fs.readFile(`./public/statements/${year}/${month}/CN${seqNum}`+'.pdf');
    const form = new FormData();
    form.append("file", file,filename);
    //const headers = form.getHeaders();
    //Axios.defaults.headers.cookie = cookies;
    //console.log(form)
    await Axios({
      method: "POST",
     //url: 'https://portal.steuritinternationalschool.org/clerk/uploadStatement',
   url: 'https://niyonsoft.org/production/uploadStatementGC',
      //url:'http://localhost:8000/rm/uploadStatementCN',
      headers: {
        "Content-Type": "multipart/form-data"  
      },
      data: form
    });
    
    seqNum++
    RefNoSeq.findByIdAndUpdate(seqId,{$set:{num:seqNum}},function(err,tocs){
    
    })
      
    
   // res.redirect('/receiver/fileId/'+filename);
    
    
    }catch(e) {
    
    console.log(e)
    
    
    }
    
    
    }) ()
    
    })
  }
  })
    
    //res.redirect('/hostel/discList')
    
    })
    

    
router.get('/openFileCN/:id',isLoggedIn,function(req,res){
var seqNum= req.params.id
//var batchNumber = req.user.batchNumber
var m = moment()
var mformat = m.format('L')
var month = m.format('MMMM')
var year = m.format('YYYY')
const path =`./public/statements/${year}/${month}/CN${seqNum}`+'.pdf'
if (fs.existsSync(path)) {
    res.contentType("application/pdf");
    fs.createReadStream(path).pipe(res)
} else {
    res.status(500)
    console.log('File not found')
    res.send('File not found')
}

})

    
router.post('/uploadStatementCN',upload.single('file'),(req,res,nxt)=>{
var fileId = req.file.id
console.log(fileId,'fileId')
var filename = req.file.filename
console.log(filename,'filename')
RepoFiles.find({filename:filename},function(err,docs){
if(docs.length>0){


//console.log(docs,'docs')
let id = docs[0]._id
RepoFiles.findByIdAndUpdate(id,{$set:{fileId:fileId}},function(err,tocs){

})

}
//res.redirect('/receiver/fileId/'+filename)
res.redirect('/production/fileIdCN/'+filename)
})

})


router.get('/fileIdCN/:id',function(req,res){
console.log(req.params.id)
var id = req.params.id

res.redirect('/production/openCN/'+id)

})


router.get('/openCN/:id',(req,res)=>{
var filename = req.params.id
console.log(filename,'fileId')
  const bucket = new mongodb.GridFSBucket(conn.db,{ bucketName: 'uploads' });
  gfs.files.find({filename: filename}).toArray((err, files) => {
  console.log(files[0])

    const readStream = bucket.openDownloadStream(files[0]._id);
        readStream.pipe(res);

  })
 //gfs.openDownloadStream(ObjectId(mongodb.ObjectId(fileId))).pipe(fs.createWriteStream('./outputFile'));
})

//fermentation
router.get('/statementGenFM/:id',isLoggedIn,function(req,res){
  //console.log(arrStatementR,'arrSingleUpdate')
  var arrStatemementR=[]
  var m = moment()
  var mformat = m.format('L')
  var month = m.format('MMMM')
  var year = m.format('YYYY')
  var date = req.user.date
  var idNum = req.params.id
  console.log(idNum,'idNum')
  //var receiveDate = req.user.dispatchDate
  //var code ="Tiana Madzima"
 
  var arrG = []
  Fermentation.find().lean().then(docs=>{

    if(docs){
      let refNumber = docs[0].refNumber
      let item = docs[0].item

  

  //arrG.push(docs)
    
    console.log(docs,'arrG')
  //var studentName = 'Tiana Madzima'
  
  /*console.log(arr,'iiii')*/
  
  RefNoSeq.find(function(err,doc){
    let seqNum = doc[0].num
    let seqId = doc[0]._id
  //console.log(docs,'docs')
  
  const compile = async function (templateName, docs){
  const filePath = path.join(process.cwd(),'templates',`${templateName}.hbs`)
  
  const html = await fs.readFile(filePath, 'utf8')
  
  return hbs.compile(html)(docs)
  
  };
  
  
  
  
  (async function(){
  
  try{
  //const browser = await puppeteer.launch();
  const browser = await puppeteer.launch({
  headless: true,
  args: [
  "--disable-setuid-sandbox",
  "--no-sandbox",
  "--single-process",
  "--no-zygote",
  ],
  executablePath:
  process.env.NODE_ENV === "production"
    ? process.env.PUPPETEER_EXECUTABLE_PATH
    : puppeteer.executablePath(),
  });
  
  const page = await browser.newPage()
  
  
  
  //const content = await compile('report3',arr[uid])
  const content = await compile('fermentation',docs)
  
  //const content = await compile('index',arr[code])
  
  await page.setContent(content, { waitUntil: 'networkidle2'});
  //await page.setContent(content)
  //create a pdf document
  await page.emulateMediaType('screen')
  //let height = await page.evaluate(() => document.documentElement.offsetHeight);
  await page.evaluate(() => matchMedia('screen').matches);
  await page.setContent(content, { waitUntil: 'networkidle0'});
  //console.log(await page.pdf(),'7777')
   
  let filename = 'FM'+seqNum+'.pdf'
  await page.pdf({
  //path:('../gitzoid2/reports/'+year+'/'+month+'/'+uid+'.pdf'),
  path:(`./public/statements/${year}/${month}/FM${seqNum}`+'.pdf'),
  format:"A4",
  width:'30cm',
  height:'21cm',
  //height: height + 'px',
  printBackground:true
  
  })
  
  //res.redirect('/rm/fileIdGC/'+filename)
  res.redirect('/production/openFileFM/'+seqNum)
  var repo = new RepoFiles();
  
  repo.filename = filename;
  repo.fileId = "null";
  repo.status = 'FM'
  repo.type = 'Fermentation'
  repo.item = item
  repo.date = mformat
  repo.year = year;
  repo.refNumber = refNumber
  repo.idNum = idNum
  repo.month = month
  
  
  console.log('done')
  
  repo.save().then(poll =>{
  
  })
  
  
  //upload.single('3400_Blessing_Musasa.pdf')
  
  
  
  /*await browser.close()
  
  /*process.exit()*/
  
  const file = await fs.readFile(`./public/statements/${year}/${month}/FM${seqNum}`+'.pdf');
  const form = new FormData();
  form.append("file", file,filename);
  //const headers = form.getHeaders();
  //Axios.defaults.headers.cookie = cookies;
  //console.log(form)
  await Axios({
    method: "POST",
   //url: 'https://portal.steuritinternationalschool.org/clerk/uploadStatement',
 //url: 'https://niyonsoft.org/rm/uploadStatementGC',
    url:'https://niyonsoft.org/production/uploadStatementFM',
  //url:'http://localhost:8000/rm/uploadStatementFM',
    headers: {
      "Content-Type": "multipart/form-data"  
    },
    data: form
  });
  
  seqNum++
  RefNoSeq.findByIdAndUpdate(seqId,{$set:{num:seqNum}},function(err,tocs){
  
  })
    
  
 // res.redirect('/receiver/fileId/'+filename);
  
  
  }catch(e) {
  
  console.log(e)
  
  
  }
  
  
  }) ()
  
  })
}
})
  
  //res.redirect('/hostel/discList')
  
  })
  

  
router.get('/openFileFM/:id',isLoggedIn,function(req,res){
var seqNum= req.params.id
//var batchNumber = req.user.batchNumber
var m = moment()
var mformat = m.format('L')
var month = m.format('MMMM')
var year = m.format('YYYY')
const path =`./public/statements/${year}/${month}/FM${seqNum}`+'.pdf'
if (fs.existsSync(path)) {
  res.contentType("application/pdf");
  fs.createReadStream(path).pipe(res)
} else {
  res.status(500)
  console.log('File not found')
  res.send('File not found')
}

})

  
router.post('/uploadStatementFM',upload.single('file'),(req,res,nxt)=>{
var fileId = req.file.id
console.log(fileId,'fileId')
var filename = req.file.filename
console.log(filename,'filename')
RepoFiles.find({filename:filename},function(err,docs){
if(docs.length>0){


//console.log(docs,'docs')
let id = docs[0]._id
RepoFiles.findByIdAndUpdate(id,{$set:{fileId:fileId}},function(err,tocs){

})

}
//res.redirect('/receiver/fileId/'+filename)
res.redirect('/production/fileIdFM/'+filename)
})

})


router.get('/fileIdFM/:id',function(req,res){
console.log(req.params.id)
var id = req.params.id

res.redirect('/production/openFM/'+id)

})


router.get('/openFM/:id',(req,res)=>{
var filename = req.params.id
console.log(filename,'fileId')
const bucket = new mongodb.GridFSBucket(conn.db,{ bucketName: 'uploads' });
gfs.files.find({filename: filename}).toArray((err, files) => {
console.log(files[0])

  const readStream = bucket.openDownloadStream(files[0]._id);
      readStream.pipe(res);

})
//gfs.openDownloadStream(ObjectId(mongodb.ObjectId(fileId))).pipe(fs.createWriteStream('./outputFile'));
})


/////////////////





router.get('/grvFileRM/:id/:id2',isLoggedIn,function(req,res){

  var m = moment()
  var mformat = m.format('L')
  var month = m.format('MMMM')
  var year = m.format('YYYY')
  var date = req.user.date
  var refNumber = req.params.id2
  let batchId = req.user.batchId
  var idNum = req.params.id

  BatchRR.find({refNumber:refNumber}).lean().then(docs=>{


 


  
  const compile = async function (templateName,docs ){
  const filePath = path.join(process.cwd(),'templates',`${templateName}.hbs`)
  
  const html = await fs.readFile(filePath, 'utf8')
  
  return hbs.compile(html)(docs)
  
  };
  
  
  
  
  (async function(){
  
  try{

  const browser = await puppeteer.launch({
  headless: true,
  args: [
  "--disable-setuid-sandbox",
  "--no-sandbox",
  "--single-process",
  "--no-zygote",
  ],
  executablePath:
  process.env.NODE_ENV === "production"
    ? process.env.PUPPETEER_EXECUTABLE_PATH
    : puppeteer.executablePath(),
  });
  
  const page = await browser.newPage()
  
  
  
  //const content = await compile('report3',arr[uid])
  const content = await compile('grv',docs)
  

  
  await page.setContent(content, { waitUntil: 'networkidle2'});

  await page.emulateMediaType('screen')
  let height = await page.evaluate(() => document.documentElement.offsetHeight);
  await page.evaluate(() => matchMedia('screen').matches);
  await page.setContent(content, { waitUntil: 'networkidle0'});
 
   
  let filename = 'grv'+refNumber+'.pdf'
  await page.pdf({
 
  path:(`./public/grv/${year}/${month}/grv${refNumber}`+'.pdf'),
  format:"A4",

  height: height + 'px',
  printBackground:true
  
  })
  
 
  res.redirect('/production/openFileRM/'+refNumber)


  var repo = new RepoFiles();
  
  repo.filename = filename;
  repo.fileId = "null";
  repo.status = 'RM'
  repo.type = 'Raw'
  repo.date = mformat
  repo.year = year;
  repo.refNumber = refNumber
  repo.idNum = idNum
  repo.month = month
  
  
  console.log('done')
  
  repo.save().then(poll =>{
  
  })
  
  
  
 
 
  const file = await fs.readFile(`./public/grv/${year}/${month}/grv${refNumber}`+'.pdf');
  const form = new FormData();
  form.append("file", file,filename);
  
  await Axios({
    method: "POST",
   //url: 'https://portal.steuritinternationalschool.org/clerk/uploadStatement',
     //url: 'https://niyonsoft.org/uploadStatementDispatch',
     url:'https://niyonsoft.org/production/uploadGrvRM',
     //url:'localhost:8000/rm/uploadGrvRM',
    headers: {
      "Content-Type": "multipart/form-data"  
    },
    data: form
  });
  
  
  //res.redirect('/rm/fileIdGrv/'+filename);
 // res.redirect('/rm/openFile/'+batchNumber)
  
  
  }catch(e) {
  
  console.log(e)
  
  
  }
  

  
  }) ()
  
  
  
})
  
  

  
  })

router.get('/openFileRM/:id',isLoggedIn,function(req,res){
var refNumber = req.params.id

var m = moment()
var mformat = m.format('L')
var month = m.format('MMMM')
var year = m.format('YYYY')
const path =`./public/grv/${year}/${month}/grv${refNumber}.pdf`
if (fs.existsSync(path)) {
    res.contentType("application/pdf");
    fs.createReadStream(path).pipe(res)
} else {
    res.status(500)
    console.log('File not found')
    res.send('File not found')
}

})

  router.post('/uploadGRVRM',upload.single('file'),(req,res,nxt)=>{
    var fileId = req.file.id
    console.log(fileId,'fileId')
    var filename = req.file.filename
    console.log(filename,'filename')
  RepoFiles.find({filename:filename},function(err,docs){
  if(docs.length>0){
  
  
  //console.log(docs,'docs')
  let id = docs[0]._id
  RepoFiles.findByIdAndUpdate(id,{$set:{fileId:fileId}},function(err,tocs){
  
  })
  
  }
  res.redirect('/production/fileIdGrvRM/'+filename)
  })
  
  })

  router.get('/fileIdGrvRM/:id',function(req,res){
    console.log(req.params.id)
    var id = req.params.id
    
    res.redirect('/production/openGrvRM/'+id)
    
    })


  router.get('/openGrvRM/:id',(req,res)=>{
    var filename = req.params.id
    console.log(filename,'fileId')
      const bucket = new mongodb.GridFSBucket(conn.db,{ bucketName: 'uploads' });
      gfs.files.find({filename: filename}).toArray((err, files) => {
      console.log(files[0])
    
        const readStream = bucket.openDownloadStream(files[0]._id);
            readStream.pipe(res);
    
      })
     //gfs.openDownloadStream(ObjectId(mongodb.ObjectId(fileId))).pipe(fs.createWriteStream('./outputFile'));
    })






router.get('/packagingBatch',isLoggedIn,function(req,res){
  res.render('production/packagingBatch')
})



router.post('/packagingBatch',isLoggedIn,function(req,res){
  var date = req.body.date
  var shift = req.body.shift
  var product = req.body.product


  let id = req.user._id
  let m = moment()
  var month = m.format('MMMM')
  var year = m.format('YYYY')
  req.check('date','Enter Date').notEmpty();
  //req.check('name','Enter Name').notEmpty();
  req.check('shift','Enter Shift').notEmpty();
  req.check('product','Enter Product').notEmpty();
  

  
  var errors = req.validationErrors();

  if (errors) {
    
    req.session.errors = errors;
    req.session.success = false;
    req.flash('danger', req.session.errors[0].msg);


    res.redirect('/production/packagingBatch');
  
}
else{


let date6 =  moment().format('l');
let dateValue = moment().valueOf()

let date7 =  date6.replace(/\//g, "");


 



    RefNo.find({date:date,type:"packaging"},function(err,docs){
      let size = docs.length + 1
     refNo = date7+'B'+size+'P'
      console.log(refNo,'refNo')
  
      
      var truck = new BatchPackaging()
      truck.date = date
      truck.mformat = date6
      truck.dateValue = dateValue
      truck.shift = shift
      truck.batchNumber = refNo
      truck.product = product
      /*truck.volume = volume
      truck.taste = taste*/
      truck.month = month
      truck.year = year
 
     

     
      
     
  
      truck.save()
          .then(pro =>{
  
            User.findByIdAndUpdate(id,{$set:{product:product,shift:shift,date:date,batchId:pro._id}},function(err,vocs){

            })
            var book = new RefNo();
            book.refNumber = refNo
            book.date = date
            book.type = 'Packaging'
            book.save()
            .then(prod =>{
        
             
              res.redirect('/production/packaging/'+pro._id)
        
            })

          })

        })

     
  //res.redirect('/rm/gingerWash2')
}
})




router.get('/packaging/:id',isLoggedIn,function(req,res){

  var id = req.params.id
  BatchPackaging.findById(id,function(err,doc){
  let date = doc.date
  let shift = doc.shift
  let product = doc.product
 
    res.render('production/packagingMaterial',{product:product,
    shift:shift,date:date,id:id})
  })
  })
  

  router.post('/packagingMat/',isLoggedIn,function(req,res){

    var product = req.body.product
    var batchNumber = req.body.batchNumber
    var volume = req.body.volume
    var taste = req.body.taste
    var label = req.body.label
    var time = req.body.time
    var date = req.body.date
    var batchId = req.body.batchId
    var tank = req.body.tank
    //var refNumber = req.body.refNumber
    var shift = req.body.shift
   // var operator = req.body.operator
    //var teamLeader = req.body.teamLeader
  
  
    console.log(product,'product')
  
  
  var cook = new Packaging()
  cook.product = product
  cook.volume = volume
  cook.batchNumber = batchNumber
  cook.taste = taste
  cook.label = label
  cook.tank = tank
  cook.time = time
  cook.date = date
  cook.shift = shift
  cook.batchId = batchId

  
  cook.save()
        .then(pro =>{
        
          res.send(pro)
        
        })
    
  
  
  
  
  
  })


  router.get('/closePackagingBatch/:id',isLoggedIn,function(req,res){
    var id = req.params.id
    let arrV = []
    let number1 
    var m = moment()
    var month = m.format('MMMM')
    var year = m.format('YYYY')
    var mformat = m.format('L')
    let total

    Packaging.find({batchId:id},function(err,docs){
      
let refNumber = docs[0].batchNumber
      for(var i = 0;i<docs.length; i++){
           
        arrV.push(docs[i].volume)
          }
          //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
         console.log(arrV,'arrV')
        
        //InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
        number1=0;
        for(var z in arrV) { number1 += arrV[z]; }
        total = number1
   
        BatchPackaging.findByIdAndUpdate(id,{$set:{volume:number1,refNumber:refNumber}},function(err,locs){

        })

        for(var i = 0;i<docs.length; i++){
           
      let refNumber = docs[i].batchNumber
      let tank = docs[i].tank
      let litres = docs[i].volume
            
        BlendedItems.find({refNumber:refNumber,blendingTank:tank},function(err,focs){

let nVolume = litres - focs[0].litres
let bId = focs[0]._id

if(nVolume > 0){
BlendedItems.findByIdAndUpdate(bId,{$set:{nLitres:nVolume}},function(err,tocs){

})
}else{
  BlendedItems.findByIdAndUpdate(bId,{$set:{nLitres:0,status:"emptied"}},function(err,tocs){

  })
}
        })

      }






      for(var i = 0;i<docs.length; i++){
           
        let refNumber = docs[i].batchNumber
        let tank = docs[i].tank
        let litres = docs[i].volume
              
          BlendingTanks.find({refNumber:refNumber,tankNumber:tank},function(err,focs){
  
  let nVolume =  focs[0].litres - litres
  let bId = focs[0]._id
  
  if(nVolume > 0){
  BlendingTanks.findByIdAndUpdate(bId,{$set:{litres:nVolume}},function(err,tocs){
  
  })
  }else{
    BlendingTanks.findByIdAndUpdate(bId,{$set:{litres:0,product:"null",refNumber:"null"}},function(err,tocs){
  
    })
  }
          })
  
        }
  


res.redirect('/production/warehouseStock')

    })

  })
  
  
  
  //Autocomplete for Crush
  router.get('/autocompleteBatchNumber/',isLoggedIn, function(req, res, next) {
    var id = req.user._id


      var regex= new RegExp(req.query["term"],'i');
     
      var itemFilter =BlendedItems.find({ refNumber:regex,status:'null'}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
    
      
      itemFilter.exec(function(err,data){
     
   
    console.log('data',data)
    
    var result=[];
    
    if(!err){
       if(data && data.length && data.length>0){
         data.forEach(shop=>{
   

   
       
    
            
           let obj={
             id:shop._id,
             label: shop.refNumber
  
         
       
         
           
            
    
             
           };
          
           result.push(obj);
        
          })
      
    
       }
     
       res.jsonp(result);
  
      }
    
    })
   
    });
  
 
//this route shop
    router.post('/autoBatchNumber',isLoggedIn,function(req,res){
        var code = req.body.code
  

    
        
       
        BlendedItems.find({refNumber:code},function(err,docs){
       if(docs == undefined){
         res.redirect('/')
       }else

          res.send(docs[0])
        })
      
      
      })
 



  
  ////////// folders
  router.get('/folderReg',function(req,res){
    Product.find({}).then(docs=>{
    res.render('production/itemFolder',{listX:docs})

    })
  })

 

  router.get('/selectMonth/:id/',isLoggedIn,function(req,res){
    var pro = req.user
    var product = req.params.id
    var uid = req.user._id
    var arr = []
    var year = 2025
    User.findByIdAndUpdate(uid,{$set:{year:year,product:product}},function(err,locs){
  
    })
  
    BlendedItems.find({product:product}).sort({num:1}).then(docs=>{
       
            res.render('production/itemFilesMonthly',{pro:pro,product:product,listX:docs})
  
    })
    
  })

  

router.get('/folderFiles/:id/:id2',isLoggedIn,function(req,res){
  var arr = []
  
  var errorMsg = req.flash('danger')[0];
  var successMsg = req.flash('success')[0];

   var m = moment()
   var pro = req.user
   
   var year = m.format('YYYY')
   var refNumber = req.params.id
   var product = req.params.id2
   var date = req.user.invoCode
 RepoFiles.find({idNum:refNumber},function(err,docs){
     if(docs){
 
   console.log(docs,'docs')
      let arr=[]
      for(var i = docs.length - 1; i>=0; i--){
  
        arr.push(docs[i])
      }
 
 
 res.render('production/itemFiles',{listX:arr,product:product,refNumber:refNumber,pro:pro,year:year,successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg}) 
 }
 })
    
 })

 /*8888*/
 
 router.get('/updateBIV',function(req,res){
  BlendedItems.find(function(err,docs){
    for(var i = 0;i<docs.length;i++){
     let id = docs[i]._id
     BlendedItems.findByIdAndRemove(id,(err,doc)=>{

     }) 
    }
    res.redirect('/production/updateRMV')
  })
})


router.get('/updateRMV',function(req,res){
  RawMat.find(function(err,docs){
    for(var i = 0;i<docs.length;i++){
     let id = docs[i]._id
    RawMat.findByIdAndUpdate(id,{$set:{massKgs:0,massTonnes:0,uniqueMeasure:0,drums:0,crates:0}},function(err,tocs){

    })
    }
    res.redirect('/production/updateIngredientsV')
  })
})




router.get('/updateIngredientsV',function(req,res){
  Ingredients.find(function(err,docs){
    for(var i = 0;i<docs.length;i++){
     let id = docs[i]._id
    Ingredients.findByIdAndUpdate(id,{$set:{massKgs:0}},function(err,tocs){

    })
    }
    res.redirect('/production/updateCrushedItemsV')
  })
})


router.get('/updateCrushedItemsV',function(req,res){
  CrushedItems.find(function(err,docs){
    for(var i = 0;i<docs.length;i++){
     let id = docs[i]._id
    CrushedItems.findByIdAndUpdate(id,{$set:{massKgs:0,crates:0,uniqueMeasure:0}},function(err,tocs){

    })
    }
    res.redirect('/production/updateBTV')
  })
})



router.get('/updateBTV',function(req,res){
  BlendingTanks.find(function(err,docs){
    for(var i = 0;i<docs.length;i++){
     let id = docs[i]._id
    BlendingTanks.findByIdAndUpdate(id,{$set:{litres:0,product:"null",refNumber:"null"}},function(err,tocs){

    })
    }
    res.redirect('/production/warehouseStock')
  })
})









  
module.exports = router;
  
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  else{
      res.redirect('/')
  }
}
