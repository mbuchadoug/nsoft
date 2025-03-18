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
var BlendingDays = require('../models/blendingDays');
var Packaging = require('../models/packaging')
var CrushedItems = require('../models/crushedItems');
var Warehouse = require('../models/warehouse');
var SaleStock = require('../models/salesStock');
var Customer = require('../models/customer');
var BatchR = require('../models/batchR');
var BatchRR = require('../models/batchRR');
var BatchPackaging = require('../models/batchPackaging')
var Packaging = require('../models/packaging')
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
var RawMatX = require('../models/rawMatX');
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

router.get('/sms',function(req,res){
 
  var https = require('follow-redirects').https;
  var fs = require('fs');
  
  var options = {
      'method': 'POST',
      'hostname': 'lqvvzd.api.infobip.com',
      'path': '/sms/2/text/advanced',
      'headers': {
          'Authorization': 'App 08a11352afef5e0a42dd9eb5c90f6bd2-8407578d-7fc2-469c-9b90-50a400b88ea8',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
      'maxRedirects': 20
  };
  
  var req = https.request(options, function (res) {
      var chunks = [];
  
      res.on("data", function (chunk) {
          chunks.push(chunk);
      });
  
      res.on("end", function (chunk) {
          var body = Buffer.concat(chunks);
          console.log(body.toString());
      });
  
      res.on("error", function (error) {
          console.error(error);
      });
  });
  
  var postData = JSON.stringify({
      "messages": [
          {
            "destinations": [{"to":"263771446827"},{"to":"263783186772"}],
            "from": "Niyonsoft",
            "text": 'System Test'
          }
      ]
  });
  
  req.write(postData);
  
  req.end();
})


router.get('/whatsapp',function(req,res){
  var https = require('follow-redirects').https;
var fs = require('fs');

var options = {
    'method': 'POST',
    'hostname': 'lqvvzd.api.infobip.com',
    'path': '/whatsapp/1/message/template',
    'headers': {
        'Authorization': 'App 08a11352afef5e0a42dd9eb5c90f6bd2-8407578d-7fc2-469c-9b90-50a400b88ea8',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    'maxRedirects': 20
};

var req = https.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
        chunks.push(chunk);
    });

    res.on("end", function (chunk) {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
    });

    res.on("error", function (error) {
        console.error(error);
    });
});

var postData = JSON.stringify({
    "messages": [
        {
            "from": "447860099299",
            
            "to": "263771446827",
           
            "messageId": "4a4b42d0-1ac9-46a7-99a5-a8df6aa0dad9",
            "content": {
                "templateName": "test_whatsapp_template_en",
                "templateData": {
                    "body": {
                        "placeholders": ["Niyonsoft"],
                        //"text": "Niyonsoft Test"
                    }
                },
                "language": "en"
            }
        }
    ]
});

//7H6UZQJBLV6S2B7T3VP95FHB

req.write(postData);

req.end();
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
  
  
  

  router.post('/dashChartTrail',isLoggedIn,function(req,res){

  
    var stage = req.body.stage
    var code = req.body.code
  //console.log(warehouse,'warehouse')
 
   var date = req.body.date
   var arr = []
   var id = req.user._id
   let num = req.user.num
   num++
   
  
  
   RawMatX.find({stage:stage,code:code},function(err,docs) {
     //console.log(docs,'docs1')
    for(var i = 0;i<docs.length;i++){

    console.log(docs,'docs')
  
        if(arr.length > 0 && arr.find(value => value.stage == docs[i].stage  && value.item == docs[i].item  )){
               console.log('true')
              arr.find(value => value.item == docs[i].item && value.stage == docs[i].stage  ).uniqueMeasure += docs[i].uniqueMeasure;
         }else{
  arr.push(docs[i])
         }
  
       
     }  
     console.log(arr,'arr')
    //console.log(docs,'888')
    res.send(arr)
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
  
  
  



router.get('/voucherNumberUpdate',isLoggedIn,function(req,res){
  var id = req.user._id
 
   VoucherNum.find(function(err,doc){
      let voucherNum = doc[0].num
      let vouId = doc[0]._id
  
  
  User.findByIdAndUpdate(id,{$set:{voucherNumber:voucherNum}},function(err,docs){
  
  })
  voucherNum++
  
  VoucherNum.findByIdAndUpdate(vouId,{$set:{num:voucherNum}},function(err,tocs){
  
  })

  res.redirect('/rm/stockRequisition')
  
    })
  
  })

  
router.get('/stockRequisition',isLoggedIn,function(req,res){
  var errorMsg = req.flash('danger')[0];
  var successMsg = req.flash('success')[0];
  var voucherNumber = req.user.voucherNumber
res.render('rStock/batchRequisition',{successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg,voucherNumber:voucherNumber})

})


  router.post('/stockRequisition',isLoggedIn,function(req,res){
    var item =req.body.rawMaterial
    var stockWeight = req.body.stock
    var stockTonne = req.body.stockT
    var requestedMass = req.body.qty
    var name = req.user.fullname
    var userId  = req.user._id
    var dept = req.user.dept
    var description = req.body.description
    var unit = req.body.unit
    var uid = req.user._id
    var prefix = req.body.prefix
    var year = 2025
    let dateB = req.body.date
    let requestedMassTonnes,requestedMassKgs
    let date6 = moment(dateB).format('l');
    let date7 =  date6.replace(/\//g, "");
  
    if(unit == 'kgs'){
      requestedMassTonnes = requestedMass / 1000
      requestedMassKgs = requestedMass
    }
    else if(unit == 'tonnes'){
      requestedMassKgs = requestedMass * 1000
      requestedMassTonnes = requestedMass 
  
    }
  
    var m = moment()
    var mformat = moment(dateB).format('L')
    var month = moment(dateB).format('MMMM')
    var year = moment(dateB).format('YYYY')
    let dateValue = moment(dateB).valueOf()
    let voucherNumber = req.user.voucherNumber
    
  
    req.check('rawMaterial','Enter Raw Material').notEmpty();
    req.check('stock','Enter Stock on hand').notEmpty();
    req.check('qty','Enter Mass').notEmpty();
    req.check('unit','Enter Unit').notEmpty();
    req.check('date','Enter Date').notEmpty();
           
                  
               
                 
    
          
       
    var errors = req.validationErrors();
        if (errors) {
    
        
          req.session.errors = errors;
          req.session.success = false;
          req.flash('danger', req.session.errors[0].msg);
  
  
      res.redirect('/rm/stockRequisition');
          
        
      }
  
      else{

        StockVoucher.find({year:year},function(err,docs){
          let size = docs.length + 1
          let  purchaseOrder = date7+'P0'+size+'RM'

      
        var user = new StockVoucher();
        user.name = name;
        user.description = description
        user.userId = userId;
        user.dept = dept
        user.item = item
        user.status = "pending";
        user.date = mformat
        user.approver1 = "pending";
        user.date1 = "null";
        user.status1 = "null"
        user.approver2 = "null";
        user.date2 = "null";
        user.status2 = "null";
        user.approver3 = "null";
        user.date3 = "null";
        user.status3 = "null";
        user.approver4 = "null";
        user.date4 = "null";
        user.status4 = "null";
        user.month = month
        user.prefix = prefix
        user.purchaseOrderNum = purchaseOrder
        user.unit = unit
        user.year = year
        user.dateValue = dateValue
        user.currentMassTonnes = stockTonne
        user.currentMassKgs = stockWeight
        user.requestedMass = requestedMass
        user.voucherNumber = voucherNumber
        user.requestedMassTonnes = requestedMassTonnes
        user.requestedMassKgs = requestedMassKgs
       
  
        
        
       
        
         
    
         
  
        user.save()
          .then(user =>{

            User.findByIdAndUpdate(uid,{$set:{date:dateB}},function(err,docs){

            })

           /* const from = "Kambucha"
            const to = "263771446827"
            const text = 'Check Stock Requisition of'+' '+item+' '+requestedMass+'kgs'
            
            async function sendSMS() {
                await vonage.sms.send({to, from, text})
                    .then(resp => { console.log('Message sent successfully'); console.log(resp); })
                    .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
            }
            
            sendSMS();*/

  
            req.flash('success', 'Request Sent');
  
  
            res.redirect('/rm/approval/'+user._id);
            
      })
  
    })
  
  
      }
  
  })




  
router.get('/approval/:id',isLoggedIn,function(req,res){
  var id = req.params.id
  var name = req.user.fullname
  var dateB = req.user.date
 
  let date6 = moment(dateB).format('l');
   let date7 =  date6.replace(/\//g, "");
  StockVoucher.findByIdAndUpdate(id,{$set:{approver3:name,status3:"approved",status:"approved"}},function(err,docs){

      if(!err){
          console.log(docs,'docsV')
          let batchNumber
          let stocKgs = docs.currentMassKgs
          let stockTonnes = docs.currentMassTonnes
          let item = docs.item
          let month = docs.month
          let year = docs.year
          let date = docs.date
          let unit = docs.unit
          let prefix = docs.prefix
          let voucherNo = docs.voucherNumber
          let dateValue = docs.dateValue
          let requestedMassTonnes = docs.requestedMassTonnes
          let requestedMassKgs = docs.requestedMassKgs
          RefNo.find({date:date,item:item,type:"receiving material"},function(err,docs){
              let size = docs.length + 1
             batchNumber = date7+prefix+'B'+size+'RM'
            
          if(item == 'ginger'){
              var truck = new BatchRR()
              truck.date = date
              truck.mformat = date6
              truck.paymentStatus = 'unpaid'
              truck.priceStatus = 'null'
              truck.stage = 'wash'
              truck.prefix = prefix
              truck.dateValue = dateValue
              truck.item = item
              truck.refNumber = voucherNo
              truck.batchNumber = batchNumber
              truck.month = month
              truck.openingWeightKg = stocKgs
              truck.openingWeightTonne = stockTonnes
              truck.month = month
              truck.status = 'pending'
              truck.receivedTonnes = 0
              truck.receivedKgs = 0
              truck.unit = 'kgs'
              truck.requestedMassTonnes = requestedMassTonnes
              truck.requestedMassKgs = requestedMassKgs
              truck.year = year
              truck.voucherNo = voucherNo
              truck.voucherId = id
              
             
          
              truck.save()
                  .then(pro =>{
          
          
  /*var https = require('follow-redirects').https;
  var fs = require('fs');
  
  var options = {
      'method': 'POST',
      'hostname': 'lqvvzd.api.infobip.com',
      'path': '/sms/2/text/advanced',
      'headers': {
          'Authorization': 'App 08a11352afef5e0a42dd9eb5c90f6bd2-8407578d-7fc2-469c-9b90-50a400b88ea8',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
      'maxRedirects': 20
  };
  
  var req = https.request(options, function (res) {
      var chunks = [];
  
      res.on("data", function (chunk) {
          chunks.push(chunk);
      });
  
      res.on("end", function (chunk) {
          var body = Buffer.concat(chunks);
          console.log(body.toString());
      });
  
      res.on("error", function (error) {
          console.error(error);
      });
  });
  
  var postData = JSON.stringify({
      "messages": [
          {
              "destinations": [{"to":"263772219443"},{"to":"263777801742"}, {"to":"263782808922"},{"to":"263783186772"},{"to":"263789155951"}],
              "from": "Niyonsoft",
              "text": 'New Purchase Order '+ ' '+'of'+' '+requestedMassKgs+'kgs'+' '+item+' '+'created' 
          }
      ]
  });
  
  req.write(postData);
  
  req.end();*/
          
              
    /*const from = "Kambucha"
    const to = "263771446827"
    const text = 'Stock Requistion Accepted, Check Your Purchase Order'+' '+requestedMassKgs+' '+item
    
    async function sendSMS() {
        await vonage.sms.send({to, from, text})
            .then(resp => { console.log('Message sent successfully'); console.log(resp); })
            .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
    }
    
    sendSMS();*/

    /*const accountSid = 'AC242271b8616514bb11c25c9513538395';
    const authToken = '95d50bdc50ec268f2213a1a1634c65ea';
    const client = require('twilio')(accountSid, authToken);
    client.messages
        .create({
          body:'A Purchase Order of '+' '+requestedMassKgs+' '+item+' '+'has been created',
          from: '+12194198819',
          to: '+263781165357'
        })
        .then(message => console.log(message.sid));*/

          
          let batchId = pro._id
          
              var book = new RefNo();
              book.refNumber = batchNumber
              book.item = item
            book.date = date
            book.type = 'receiving material'
            book.save()
            .then(pro =>{
          
              console.log('success')
              //res.redirect('/rm/viewPO3/'+id)


              res.redirect('/rm/approvedRequisitions/')

           
             // res.redirect('/accounts3/grvFileV/'+id)
          
          
            })
          })
        }else if(item == 'tea'){
          var truck = new BatchRR()
          truck.date = date
          truck.mformat = date6
          truck.dateValue = dateValue
          truck.item = item
          truck.prefix = prefix
          truck.paymentStatus = 'unpaid'
          truck.priceStatus = 'null'
          truck.stage = 'cooking'
          truck.refNumber = voucherNo
          truck.batchNumber = batchNumber
          truck.month = month
          truck.openingWeightKg = stocKgs
          truck.openingWeightTonne = stockTonnes
          truck.month = month
          truck.unit = 'bags'
          truck.status = 'pending'
          truck.receivedTonnes = 0
          truck.receivedKgs = 0
          truck.requestedMassTonnes = requestedMassTonnes
          truck.requestedMassKgs = requestedMassKgs
          truck.year = year
          truck.voucherNo = voucherNo
          truck.voucherId = id
          
         
      
          truck.save()
              .then(pro =>{
      
              /*  var https = require('follow-redirects').https;
                var fs = require('fs');
                
                var options = {
                    'method': 'POST',
                    'hostname': 'lqvvzd.api.infobip.com',
                    'path': '/sms/2/text/advanced',
                    'headers': {
                        'Authorization': 'App 08a11352afef5e0a42dd9eb5c90f6bd2-8407578d-7fc2-469c-9b90-50a400b88ea8',
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    'maxRedirects': 20
                };
                
                var req = https.request(options, function (res) {
                    var chunks = [];
                
                    res.on("data", function (chunk) {
                        chunks.push(chunk);
                    });
                
                    res.on("end", function (chunk) {
                        var body = Buffer.concat(chunks);
                        console.log(body.toString());
                    });
                
                    res.on("error", function (error) {
                        console.error(error);
                    });
                });
                
                var postData = JSON.stringify({
                    "messages": [
                        {
                          "destinations": [{"to":"263772219443"},{"to":"263777801742"}, {"to":"263782808922"},{"to":"263783186772"},{"to":"263789155951"}],
                            "from": "Niyonsoft",
                            "text": 'New Purchase Order '+ ' '+'of'+' '+requestedMassKgs+'kgs'+' '+item+' '+'created' 
                        }
                    ]
                });
                
                req.write(postData);
                
                req.end();*/
            
              
  /*  const from = "Kambucha"
    const to = "263771446827"
    const text = 'Stock Requistion Accepted, Check Your Purchase Order'+' '+requestedMassKgs+' '+item
    
    async function sendSMS() {
        await vonage.sms.send({to, from, text})
            .then(resp => { console.log('Message sent successfully'); console.log(resp); })
            .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
    }
    
    sendSMS();*/
    
   
    /*const accountSid = 'AC242271b8616514bb11c25c9513538395';
    const authToken = '95d50bdc50ec268f2213a1a1634c65ea';
    const client = require('twilio')(accountSid, authToken);
    client.messages
        .create({
          body:'A Purchase Order of '+' '+requestedMassKgs+' '+item+' '+'has been created',
          from: '+12194198819',
          to: '+263781165357'
        })
        .then(message => console.log(message.sid));*/

        
      
      let batchId = pro._id
      
          var book = new RefNo();
          book.refNumber = batchNumber
          book.item = item
        book.date = date
        book.type = 'receiving material'
        book.save()
        .then(pro =>{
      
          console.log('success')

          //res.redirect('/rm/viewPO3/'+id)
         // res.redirect('/accounts3/grvFileV/'+id)

         res.redirect('/rm/approvedRequisitions/')
      
      
        })
      })

    }
    else if(item == 'garlic'){
      var truck = new BatchRR()
      truck.date = date
      truck.mformat = date6
      truck.prefix = prefix
      truck.dateValue = dateValue
      truck.item = item
      truck.paymentStatus = 'unpaid'
      truck.priceStatus = 'null'
      truck.stage = 'crush'
      truck.refNumber = voucherNo
      truck.batchNumber = batchNumber
      truck.month = month
      truck.openingWeightKg = stocKgs
      truck.openingWeightTonne = stockTonnes
      truck.month = month
      truck.status = 'pending'
      truck.receivedTonnes = 0
      truck.receivedKgs = 0
      truck.requestedMassTonnes = requestedMassTonnes
      truck.requestedMassKgs = requestedMassKgs
      truck.year = year
      truck.voucherNo = voucherNo
      truck.voucherId = id
      
     
  
      truck.save()
          .then(pro =>{
  
           /* var https = require('follow-redirects').https;
            var fs = require('fs');
            
            var options = {
                'method': 'POST',
                'hostname': 'lqvvzd.api.infobip.com',
                'path': '/sms/2/text/advanced',
                'headers': {
                    'Authorization': 'App 08a11352afef5e0a42dd9eb5c90f6bd2-8407578d-7fc2-469c-9b90-50a400b88ea8',
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                'maxRedirects': 20
            };
            
            var req = https.request(options, function (res) {
                var chunks = [];
            
                res.on("data", function (chunk) {
                    chunks.push(chunk);
                });
            
                res.on("end", function (chunk) {
                    var body = Buffer.concat(chunks);
                    console.log(body.toString());
                });
            
                res.on("error", function (error) {
                    console.error(error);
                });
            });
            
            var postData = JSON.stringify({
                "messages": [
                    {
                      "destinations": [{"to":"263772219443"},{"to":"263777801742"}, {"to":"263782808922"},{"to":"263783186772"},{"to":"263789155951"}],
                        "from": "Niyonsoft",
                        "text": 'New Purchase Order '+ ' '+'of'+' '+requestedMassKgs+'kgs'+' '+item+' '+'created' 
                    }
                ]
            });
            
            req.write(postData);
            
            req.end();*/
  
        
              
            /*const from = "Kambucha"
            const to = "263771446827"
            const text = 'Stock Requistion Accepted, Check Your Purchase Order'+' '+requestedMassKgs+' '+item
            
            async function sendSMS() {
                await vonage.sms.send({to, from, text})
                    .then(resp => { console.log('Message sent successfully'); console.log(resp); })
                    .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
            }
            
            sendSMS();*/

            
  
    /*const accountSid = 'AC242271b8616514bb11c25c9513538395';
    const authToken = '95d50bdc50ec268f2213a1a1634c65ea';
    const client = require('twilio')(accountSid, authToken);
    client.messages
        .create({
          body:'A Purchase Order of '+' '+requestedMassKgs+' '+item+' '+'has been created',
          from: '+12194198819',
          to: '+263781165357'
        })
        .then(message => console.log(message.sid));*/
    
  
  let batchId = pro._id
  
      var book = new RefNo();
      book.refNumber = batchNumber
      book.item = item
    book.date = date
    book.type = 'receiving material'
    book.save()
    .then(pro =>{
  
      console.log('success')

      //res.redirect('/accounts3/viewPO3/'+id)
     // res.redirect('/accounts3/grvFileV/'+id)

     res.redirect('/rm/approvedRequisitions/')
  
  
    })
  })





        }

        else if(item == 'sugar'){
          var truck = new BatchRR()
          truck.date = date
          truck.mformat = date6
          truck.dateValue = dateValue
          truck.item = item
          truck.prefix = prefix
          truck.paymentStatus = 'unpaid'
          truck.priceStatus = 'null'
          truck.stage = 'cooking'
          truck.refNumber = voucherNo
          truck.batchNumber = batchNumber
          truck.month = month
          truck.openingWeightKg = stocKgs
          truck.openingWeightTonne = stockTonnes
          truck.month = month
          truck.unit = 'bags'
          truck.status = 'pending'
          truck.receivedTonnes = 0
          truck.receivedKgs = 0
          truck.requestedMassTonnes = requestedMassTonnes
          truck.requestedMassKgs = requestedMassKgs
          truck.year = year
          truck.voucherNo = voucherNo
          truck.voucherId = id
          
         
      
          truck.save()
              .then(pro =>{
      
            /*  var https = require('follow-redirects').https;
                var fs = require('fs');
                
                var options = {
                    'method': 'POST',
                    'hostname': 'lqvvzd.api.infobip.com',
                    'path': '/sms/2/text/advanced',
                    'headers': {
                        'Authorization': 'App 08a11352afef5e0a42dd9eb5c90f6bd2-8407578d-7fc2-469c-9b90-50a400b88ea8',
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    'maxRedirects': 20
                };
                
                var req = https.request(options, function (res) {
                    var chunks = [];
                
                    res.on("data", function (chunk) {
                        chunks.push(chunk);
                    });
                
                    res.on("end", function (chunk) {
                        var body = Buffer.concat(chunks);
                        console.log(body.toString());
                    });
                
                    res.on("error", function (error) {
                        console.error(error);
                    });
                });
                
                var postData = JSON.stringify({
                    "messages": [
                        {
                          "destinations": [{"to":"263772219443"},{"to":"263777801742"}, {"to":"263782808922"},{"to":"263783186772"},{"to":"263789155951"}],
                            "from": "Niyonsoft",
                            "text": 'New Purchase Order '+ ' '+'of'+' '+requestedMassKgs+'kgs'+' '+item+' '+'created' 
                        }
                    ]
                });
                
                req.write(postData);
                
                req.end();*/
            
              
   /*const from = "Kambucha"
    const to = "263771446827"
    const text = 'Stock Requistion Accepted, Check Your Purchase Order'+' '+requestedMassKgs+' '+item
    
    async function sendSMS() {
        await vonage.sms.send({to, from, text})
            .then(resp => { console.log('Message sent successfully'); console.log(resp); })
            .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
    }
    
    sendSMS();
    
   
    const accountSid = 'AC242271b8616514bb11c25c9513538395';
    const authToken = '95d50bdc50ec268f2213a1a1634c65ea';
    const client = require('twilio')(accountSid, authToken);
    client.messages
        .create({
          body:'A Purchase Order of '+' '+requestedMassKgs+' '+item+' '+'has been created',
          from: '+12194198819',
          to: '+263781165357'
        })
        .then(message => console.log(message.sid));*/
        
      
      let batchId = pro._id
      
          var book = new RefNo();
          book.refNumber = batchNumber
          book.item = item
        book.date = date
        book.type = 'receiving material'
        book.save()
        .then(pro =>{
      
          console.log('success')

         // res.redirect('/rm/viewPO3/'+id)

         res.redirect('/rm/approvedRequisitions/')
      
      
        })
      })
    }

        else if(item == 'honey'){
          var truck = new BatchRR()
          truck.date = date
          truck.mformat = date6
          truck.dateValue = dateValue
          truck.item = item
          truck.prefix = prefix
          truck.stage = 'fermentation'
          truck.priceStatus = 'null'
          truck.refNumber = voucherNo
          truck.batchNumber = batchNumber
          truck.month = month
          truck.paymentStatus = 'unpaid'
          truck.openingWeightKg = stocKgs
          truck.openingWeightTonne = stockTonnes
          truck.month = month
          truck.unit = 'buckets'
          truck.status = 'pending'
          truck.receivedTonnes = 0
          truck.receivedKgs = 0
          truck.requestedMassTonnes = requestedMassTonnes
          truck.requestedMassKgs = requestedMassKgs
          truck.year = year
          truck.voucherNo = voucherNo
          truck.voucherId = id
          
         
      
          truck.save()
              .then(pro =>{
      
      
             /* var https = require('follow-redirects').https;
                var fs = require('fs');
                
                var options = {
                    'method': 'POST',
                    'hostname': 'lqvvzd.api.infobip.com',
                    'path': '/sms/2/text/advanced',
                    'headers': {
                        'Authorization': 'App 08a11352afef5e0a42dd9eb5c90f6bd2-8407578d-7fc2-469c-9b90-50a400b88ea8',
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    'maxRedirects': 20
                };
                
                var req = https.request(options, function (res) {
                    var chunks = [];
                
                    res.on("data", function (chunk) {
                        chunks.push(chunk);
                    });
                
                    res.on("end", function (chunk) {
                        var body = Buffer.concat(chunks);
                        console.log(body.toString());
                    });
                
                    res.on("error", function (error) {
                        console.error(error);
                    });
                });
                
                var postData = JSON.stringify({
                    "messages": [
                        {
                          "destinations": [{"to":"263772219443"},{"to":"263777801742"}, {"to":"263782808922"},{"to":"263783186772"},{"to":"263789155951"}],
                            "from": "Niyonsoft",
                            "text": 'New Purchase Order '+ ' '+'of'+' '+requestedMassKgs+'kgs'+' '+item+' '+'created' 
                        }
                    ]
                });
                
                req.write(postData);
                
                req.end();*/
              
              
   /* const from = "Kambucha"
    const to = "263771446827"
    const text = 'Stock Requistion Accepted, Check Your Purchase Order'+' '+requestedMassKgs+' '+item
    
    async function sendSMS() {
        await vonage.sms.send({to, from, text})
            .then(resp => { console.log('Message sent successfully'); console.log(resp); })
            .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
    }
    
    sendSMS();*/

    
   
    /*const accountSid = 'AC242271b8616514bb11c25c9513538395';
    const authToken = '95d50bdc50ec268f2213a1a1634c65ea';
    const client = require('twilio')(accountSid, authToken);
    client.messages
        .create({
          body:'A Purchase Order of '+' '+requestedMassKgs+' '+item+' '+'has been created',
          from: '+12194198819',
          to: '+263781165357'
        })
        .then(message => console.log(message.sid));*/

      
      let batchId = pro._id
      
          var book = new RefNo();
          book.refNumber = batchNumber
          book.item = item
        book.date = date
        book.type = 'receiving material'
        book.save()
        .then(pro =>{
      
          console.log('success')

          //res.redirect('/rm/viewPO3/'+id)
         // res.redirect('/accounts3/grvFileV/'+id)

         res.redirect('/rm/approvedRequisitions/')
      
      
        })
      })

    }
        
        
        
        else if(item == 'rosemary'){
          var truck = new BatchRR()
          truck.date = date
          truck.mformat = date6
          truck.dateValue = dateValue
          truck.item = item
          truck.prefix = prefix
          truck.stage = 'cooking'
          truck.priceStatus = 'null'
          truck.refNumber = voucherNo
          truck.batchNumber = batchNumber
          truck.month = month
          truck.paymentStatus = 'unpaid'
          truck.openingWeightKg = stocKgs
          truck.openingWeightTonne = stockTonnes
          truck.month = month
          truck.status = 'pending'
          truck.receivedTonnes = 0
          truck.receivedKgs = 0
          truck.requestedMassTonnes = requestedMassTonnes
          truck.requestedMassKgs = requestedMassKgs
          truck.year = year
          truck.voucherNo = voucherNo
          truck.voucherId = id
          
         
      
          truck.save()
              .then(pro =>{
      
      
            /* var https = require('follow-redirects').https;
                var fs = require('fs');
                
                var options = {
                    'method': 'POST',
                    'hostname': 'lqvvzd.api.infobip.com',
                    'path': '/sms/2/text/advanced',
                    'headers': {
                        'Authorization': 'App 08a11352afef5e0a42dd9eb5c90f6bd2-8407578d-7fc2-469c-9b90-50a400b88ea8',
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    'maxRedirects': 20
                };
                
                var req = https.request(options, function (res) {
                    var chunks = [];
                
                    res.on("data", function (chunk) {
                        chunks.push(chunk);
                    });
                
                    res.on("end", function (chunk) {
                        var body = Buffer.concat(chunks);
                        console.log(body.toString());
                    });
                
                    res.on("error", function (error) {
                        console.error(error);
                    });
                });
                
                var postData = JSON.stringify({
                    "messages": [
                        {
                          "destinations": [{"to":"263772219443"},{"to":"263777801742"}, {"to":"263782808922"},{"to":"263783186772"},{"to":"263789155951"}],
                            "from": "Niyonsoft",
                            "text": 'New Purchase Order '+ ' '+'of'+' '+requestedMassKgs+'kgs'+' '+item+' '+'created' 
                        }
                    ]
                });
                
                req.write(postData);
                
                req.end();*/
              
              
   /* const from = "Kambucha"
    const to = "263771446827"
    const text = 'Stock Requistion Accepted, Check Your Purchase Order'+' '+requestedMassKgs+' '+item
    
    async function sendSMS() {
        await vonage.sms.send({to, from, text})
            .then(resp => { console.log('Message sent successfully'); console.log(resp); })
            .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
    }
    
    sendSMS();*/

    
   
    /*const accountSid = 'AC242271b8616514bb11c25c9513538395';
    const authToken = '95d50bdc50ec268f2213a1a1634c65ea';
    const client = require('twilio')(accountSid, authToken);
    client.messages
        .create({
          body:'A Purchase Order of '+' '+requestedMassKgs+' '+item+' '+'has been created',
          from: '+12194198819',
          to: '+263781165357'
        })
        .then(message => console.log(message.sid));*/
      
      let batchId = pro._id
      
          var book = new RefNo();
          book.refNumber = batchNumber
          book.item = item
        book.date = date
        book.type = 'receiving material'
        book.save()
        .then(pro =>{
      
          console.log('success')

         // res.redirect('/accounts3/grvFileV/'+id)
         //res.redirect('/rm/viewPO3/'+id)

         res.redirect('/rm/approvedRequisitions/')
      
      
        })
      })
        }

        else if(item == 'black-pepper'){
          var truck = new BatchRR()
          truck.date = date
          truck.mformat = date6
          truck.dateValue = dateValue
          truck.item = item
          truck.prefix = prefix
          truck.stage = 'crush'
          truck.refNumber = voucherNo
          truck.batchNumber = batchNumber
          truck.month = month
          truck.paymentStatus = 'unpaid'
          truck.priceStatus = 'null'
          truck.openingWeightKg = stocKgs
          truck.openingWeightTonne = stockTonnes
          truck.month = month
          truck.status = 'pending'
          truck.receivedTonnes = 0
          truck.receivedKgs = 0
          truck.requestedMassTonnes = requestedMassTonnes
          truck.requestedMassKgs = requestedMassKgs
          truck.year = year
          truck.voucherNo = voucherNo
          truck.voucherId = id
          
         
      
          truck.save()
              .then(pro =>{
      
              /*  var https = require('follow-redirects').https;
                var fs = require('fs');
                
                var options = {
                    'method': 'POST',
                    'hostname': 'lqvvzd.api.infobip.com',
                    'path': '/sms/2/text/advanced',
                    'headers': {
                        'Authorization': 'App 08a11352afef5e0a42dd9eb5c90f6bd2-8407578d-7fc2-469c-9b90-50a400b88ea8',
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    'maxRedirects': 20
                };
                
                var req = https.request(options, function (res) {
                    var chunks = [];
                
                    res.on("data", function (chunk) {
                        chunks.push(chunk);
                    });
                
                    res.on("end", function (chunk) {
                        var body = Buffer.concat(chunks);
                        console.log(body.toString());
                    });
                
                    res.on("error", function (error) {
                        console.error(error);
                    });
                });
                
                var postData = JSON.stringify({
                    "messages": [
                        {
                          "destinations": [{"to":"263772219443"},{"to":"263777801742"}, {"to":"263782808922"},{"to":"263783186772"},{"to":"263789155951"}],
                            "from": "Niyonsoft",
                            "text": 'New Purchase Order '+ ' '+'of'+' '+requestedMassKgs+'kgs'+' '+item+' '+'created' 
                        }
                    ]
                });
                
                req.write(postData);
                
                req.end();*/
            
              
   /* const from = "Kambucha"
    const to = "263771446827"
    const text = 'Stock Requistion Accepted, Check Your Purchase Order'+' '+requestedMassKgs+' '+item
    
    async function sendSMS() {
        await vonage.sms.send({to, from, text})
            .then(resp => { console.log('Message sent successfully'); console.log(resp); })
            .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
    }
    
    sendSMS();*/
    
  
    /*const accountSid = 'AC242271b8616514bb11c25c9513538395';
    const authToken = '95d50bdc50ec268f2213a1a1634c65ea';
    const client = require('twilio')(accountSid, authToken);
    client.messages
        .create({
          body:'A Purchase Order of '+' '+requestedMassKgs+' '+item+' '+'has been created',
          from: '+12194198819',
          to: '+263781165357'
        })
        .then(message => console.log(message.sid));*/
        
      
      let batchId = pro._id
      
          var book = new RefNo();
          book.refNumber = batchNumber
          book.item = item
        book.date = date
        book.type = 'receiving material'
        book.save()
        .then(pro =>{
      
          console.log('success')

          //res.redirect('/rm/viewPO3/'+id)

          res.redirect('/rm/approvedRequisitions/')
      
      
        })
      })

    }

        else if(item == 'lemon'){
          var truck = new BatchRR()
          truck.date = date
          truck.mformat = date6
          truck.dateValue = dateValue
          truck.item = item
          truck.prefix = prefix
          truck.stage = 'crush'
          truck.priceStatus = 'null'
          truck.refNumber = voucherNo
          truck.batchNumber = batchNumber
          truck.month = month
          truck.paymentStatus = 'unpaid'
          truck.openingWeightKg = stocKgs
          truck.openingWeightTonne = stockTonnes
          truck.month = month
          truck.status = 'pending'
          truck.receivedTonnes = 0
          truck.receivedKgs = 0
          truck.requestedMassTonnes = requestedMassTonnes
          truck.requestedMassKgs = requestedMassKgs
          truck.year = year
          truck.voucherNo = voucherNo
          truck.voucherId = id
          
         
      
          truck.save()
              .then(pro =>{
      
              /*  var https = require('follow-redirects').https;
                var fs = require('fs');
                
                var options = {
                    'method': 'POST',
                    'hostname': 'lqvvzd.api.infobip.com',
                    'path': '/sms/2/text/advanced',
                    'headers': {
                        'Authorization': 'App 08a11352afef5e0a42dd9eb5c90f6bd2-8407578d-7fc2-469c-9b90-50a400b88ea8',
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    'maxRedirects': 20
                };
                
                var req = https.request(options, function (res) {
                    var chunks = [];
                
                    res.on("data", function (chunk) {
                        chunks.push(chunk);
                    });
                
                    res.on("end", function (chunk) {
                        var body = Buffer.concat(chunks);
                        console.log(body.toString());
                    });
                
                    res.on("error", function (error) {
                        console.error(error);
                    });
                });
                
                var postData = JSON.stringify({
                    "messages": [
                        {
                          "destinations": [{"to":"263772219443"},{"to":"263777801742"}, {"to":"263782808922"},{"to":"263783186772"},{"to":"263789155951"}],
                            "from": "Niyonsoft",
                            "text": 'New Purchase Order '+ ' '+'of'+' '+requestedMassKgs+'kgs'+' '+item+' '+'created' 
                        }
                    ]
                });
                
                req.write(postData);
                
                req.end();
            */
              
    /*const from = "Kambucha"
    const to = "263771446827"
    const text = 'Stock Requistion Accepted, Check Your Purchase Order'+' '+requestedMassKgs+' '+item
    
    async function sendSMS() {
        await vonage.sms.send({to, from, text})
            .then(resp => { console.log('Message sent successfully'); console.log(resp); })
            .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
    }
    
    sendSMS();*/

    
   
    /*const accountSid = 'AC242271b8616514bb11c25c9513538395';
    const authToken = '95d50bdc50ec268f2213a1a1634c65ea';
    const client = require('twilio')(accountSid, authToken);
    client.messages
        .create({
          body:'A Purchase Order of '+' '+requestedMassKgs+' '+item+' '+'has been created',
          from: '+12194198819',
          to: '+263781165357'
        })
        .then(message => console.log(message.sid));*/
        
      
      let batchId = pro._id
      
          var book = new RefNo();
        book.refNumber = batchNumber
        book.item = item
        book.date = date
        book.type = 'receiving material'
        book.save()
        .then(pro =>{
      
          console.log('success')

          //res.redirect('/rm/viewPO3/'+id)

          res.redirect('/rm/approvedRequisitions/')
      
      
        })
      })


    }  
        
        
        else if(item == 'bananas'){
          var truck = new BatchRR()
          truck.date = date
          truck.mformat = date6
          truck.dateValue = dateValue
          truck.item = item
          truck.prefix = prefix
          truck.paymentStatus = 'unpaid'
          truck.priceStatus = 'null'
          truck.stage = 'crush'
          truck.unit = 'crates'
          truck.refNumber = voucherNo
          truck.batchNumber = batchNumber
          truck.month = month
          truck.openingWeightKg = stocKgs
          truck.openingWeightTonne = stockTonnes
          truck.month = month
          truck.status = 'pending'
          truck.receivedTonnes = 0
          truck.receivedKgs = 0
          truck.requestedMassTonnes = requestedMassTonnes
          truck.requestedMassKgs = requestedMassKgs
          truck.year = year
          truck.voucherNo = voucherNo
          truck.voucherId = id
          
         
      
          truck.save()
              .then(pro =>{
      
             /*  var https = require('follow-redirects').https;
                var fs = require('fs');
                
                var options = {
                    'method': 'POST',
                    'hostname': 'lqvvzd.api.infobip.com',
                    'path': '/sms/2/text/advanced',
                    'headers': {
                        'Authorization': 'App 08a11352afef5e0a42dd9eb5c90f6bd2-8407578d-7fc2-469c-9b90-50a400b88ea8',
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    'maxRedirects': 20
                };
                
                var req = https.request(options, function (res) {
                    var chunks = [];
                
                    res.on("data", function (chunk) {
                        chunks.push(chunk);
                    });
                
                    res.on("end", function (chunk) {
                        var body = Buffer.concat(chunks);
                        console.log(body.toString());
                    });
                
                    res.on("error", function (error) {
                        console.error(error);
                    });
                });
                
                var postData = JSON.stringify({
                    "messages": [
                        {
                          "destinations": [{"to":"263772219443"},{"to":"263777801742"}, {"to":"263782808922"},{"to":"263783186772"},{"to":"263789155951"}],
                            "from": "Niyonsoft",
                            "text": 'New Purchase Order '+ ' '+'of'+' '+requestedMassKgs+'kgs'+' '+item+' '+'created' 
                        }
                    ]
                });
                
                req.write(postData);
                
                req.end();*/
              
    /*const from = "Kambucha"
    const to = "263771446827"
    const text = 'Stock Requistion Accepted, Check Your Purchase Order'+' '+requestedMassKgs+' '+item
    
    async function sendSMS() {
        await vonage.sms.send({to, from, text})
            .then(resp => { console.log('Message sent successfully'); console.log(resp); })
            .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
    }
    
    sendSMS();*/

    
   
    /*const accountSid = 'AC242271b8616514bb11c25c9513538395';
    const authToken = '95d50bdc50ec268f2213a1a1634c65ea';
    const client = require('twilio')(accountSid, authToken);
    client.messages
        .create({
          body:'A Purchase Order of '+' '+requestedMassKgs+' '+item+' '+'has been created',
          from: '+12194198819',
          to: '+263781165357'
        })
        .then(message => console.log(message.sid));*/
      
        
      
      let batchId = pro._id
      
          var book = new RefNo();
        book.refNumber = batchNumber
        book.item = item
        book.date = date
        book.type = 'receiving material'
        book.save()
        .then(pro =>{
      
          console.log('success')

          //res.redirect('/rm/viewPO3/'+id)

          res.redirect('/rm/approvedRequisitions/')
      
      
        })
      })
        }


      })
      }


  })

 
})




router.get('/grvFileV/:id',function(req,res){
var id = req.params.id
res.redirect('/rm/viewGRV/'+id)
})

router.get('/viewGRV/:id',function(req,res){
var id = req.params.id

StockVoucher.find(function(err,docs){

StockVoucher.find({_id:id},function(err,locs){
   console.log(locs,'locs')

  res.render('rStockTest/purchaseOrder',{listX:locs,listX2:docs})
})
})

})










router.get('/viewPO3/:id',isLoggedIn,function(req,res){
var rtnsNumber = req.params.id
StockVoucher.find({status:"approved"},function(err,ocs){

 // console.log(docs,'ok')
  //res.render('kambucha/pdf',{listX:docs})

  res.redirect('/rm2/viewPO/'+rtnsNumber)
})

})




router.get('/viewPO/:id',isLoggedIn,function(req,res){
var voucherId = req.params.id
var id = req.user._id

User.findByIdAndUpdate(id,{$set:{voucherId:voucherId}},function(err,locs){
})


StockVoucher.find({status3:"approved"},function(err,docs){

  StockVoucher.find({_id:voucherId},function(err,locs){

 // console.log(docs,'ok')
  res.render('rStockTest/purchaseOrder',{listX:locs,listX2:docs,id:voucherId})
})
})



})



  

///view approved requisitions, for receiving stock
router.get('/approvedRequisitions',isLoggedIn,function(req,res){
    var errorMsg = req.flash('danger')[0];
  var successMsg = req.flash('success')[0];
    BatchRR.find({status:'pending'},function(err,docs){
  
      res.render('rStock/vouchers',{listX:docs,successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg})
    })
  })
    
  
 
  router.get('/purchaseOrders',isLoggedIn,function(req,res){
    var errorMsg = req.flash('danger')[0];
  var successMsg = req.flash('success')[0];
    BatchRR.find({},function(err,docs){
  
      res.render('rStock/orders',{listX:docs,successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg})
    })
  })
    


//////////////////

router.get('/batchRM/:id',isLoggedIn,function(req,res){
var pro = req.user
var id = req.params.id
BatchRR.findById(id,function(err,doc){
  let voucherNo = doc.voucherNo
  let refNumber = doc.refNumber
  let item = doc.item
  let prefix = doc.prefix
  let openingWeightTonnes = doc.openingWeightTonne
  let requestedMassTonnes = doc.requestedMassTonnes
res.render('rStock/rcvBatch',{pro:pro,id:id,prefix:prefix,refNumber:refNumber,item:item,
openingWeightTonnes:openingWeightTonnes,requestedMassTonnes:requestedMassTonnes,voucherNo:voucherNo})

})
})



router.post('/batchRM/:id',isLoggedIn,function(req,res){

//var refNumber = req.body.referenceNumber
var dateB = req.user.date
var m = moment(dateB)
var mformat = m.format('L')
var month = m.format('MMMM')
var year = m.format('YYYY')
var id = req.params.id
let prefix = req.body.prefix
var date = req.body.date
var address = req.body.address
var regNumber = req.body.regNumber
var item = req.body.item
var supplier = req.body.supplier
var mobile = req.body.mobile

let driver = req.body.driver
let idNum = req.body.idNum
let trailer = req.body.trailer
let refNo = req.body.refNo
let date6 = moment(dateB).format('l');
let date7 =  date6.replace(/\//g, "");


BatchRR.find({year:year},function(err,docs){
  let size = docs.length + 1
  let  grvNumber = date7+prefix+'B'+size+'GRV'



BatchRR.findByIdAndUpdate(id,{$set:{supplier:supplier,mobile:mobile,
driver:driver,address:address,regNumber:regNumber,trailer:trailer,grvNumber:grvNumber,idNumber:idNum}},function(err,docs){




let uid = req.user._id
User.findByIdAndUpdate(uid,{$set:{refNumber:refNo,batchId:id,grvNumber:grvNumber }},function(err,docs){

})

  


})


res.redirect('/rm/receiveMaterialV/'+id)
})


})





router.post('/batchAutoStockRM',function(req,res){
var item = req.body.code
var arr = []
console.log(item,'pro7')
RawMat.find({item:item},function(err,docs){
 
 //console.log(arr,'arr')

  res.send(docs)
})
})





router.get('/receiveMaterialV/:id',function(req,res){
var id = req.params.id
console.log('good')
res.redirect('/rm/receiveMaterial/'+id)
})

router.get('/receiveMaterial/:id',isLoggedIn,function(req,res){


var pro = req.user
var id = req.params.id
console.log(id,'idf')
BatchRR.findById(id,function(err,docs){
    
  let supplier = docs.supplier
  let item = docs.item
  let date = docs.date
  let driver = docs.driver
  let regNumber = docs.regNumber
  let refNumber = docs.refNumber
  let mass = docs.requestedMassKgs
  let batchNumber = docs.batchNumber
  let grvNumber = docs.grvNumber

  if(item == 'honey'){

  console.log(grvNumber,'grvNumber')

 res.render('rStock/addHoney',{date:date,supplier:supplier,mass:mass,
item:item,refNumber:refNumber,batchNumber:batchNumber,driver:driver,pro:pro,id:id,regNumber:regNumber,grvNumber:grvNumber})
 }


 else if(item == 'bananas'){

  res.render('rStock/addBananas',{date:date,supplier:supplier,mass:mass,
    item:item,refNumber:refNumber,batchNumber:batchNumber,driver:driver,pro:pro,id:id,regNumber:regNumber,grvNumber:grvNumber})
 }

 else if(item == 'tea'){

  res.render('rStock/addTea',{date:date,supplier:supplier,mass:mass,
    item:item,refNumber:refNumber,batchNumber:batchNumber,driver:driver,pro:pro,id:id,regNumber:regNumber,grvNumber:grvNumber})
 }

 else if(item == 'sugar'){

  res.render('rStock/addSugar',{date:date,supplier:supplier,mass:mass,
    item:item,refNumber:refNumber,batchNumber:batchNumber,driver:driver,pro:pro,id:id,regNumber:regNumber,grvNumber:grvNumber})
 }
else{
  res.render('rStock/addMaterial',{date:date,supplier:supplier,mass:mass,
    item:item,refNumber:refNumber,batchNumber:batchNumber,driver:driver,pro:pro,id:id,regNumber:regNumber,grvNumber:grvNumber})
}

       
})

})



router.post('/receiveMassHoney',function(req,res){
  let dateB = req.body.date
  var m = moment(dateB)
  var mformat = m.format('L')
  var month = m.format('MMMM')
  var year = m.format('YYYY')
  let dateValue = moment().valueOf()
  let arrV = []
  let number1
  
  let mass = req.body.code
  let massTonne
  /*let buckets = req.body.buckets
  console.log(buckets,'buckets')*/
  let grvNumber = req.body.grvNumber
  console.log(grvNumber,'grvNumber')
  /*let lossMarginX = req.body.lossMargin
  let reg = /\d+\.*\d*///g;
  /*let result = lossMarginX.match(reg)
  let lossMargin = Number(result)*/
  
  BatchRR.find({grvNumber:grvNumber},function(err,docs){
    console.log(docs,'docs','receiveMass')
    let supplier = docs[0].supplier
    let item = docs[0].item
    let date = docs[0].date
    let driver = docs[0].driver
    let regNumber = docs[0].regNumber
    let mobile = docs[0].mobile
    let trailer = docs[0].trailer
    let address = docs[0].address
    let batchNumber = docs[0].batchNumber
    let refNumber = docs[0].refNumber
    let idNumber = docs[0].idNumber
    let voucherNumber = docs[0].voucherNo
    let dateValue = docs[0].dateValue
    let openingWeightKg = docs[0].openingWeightKg
    let openingWeightTonne = docs[0].openingWeightTonne
    let batchId = docs[0]._id
  let newMassNum = 0
  
  console.log(voucherNumber,'voucherNo',docs[0].voucherNo)
  
  
  StockRM.find({grvNumber:grvNumber,item:item},function(err,docs){
  
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
   
  var stock = new StockRM();
  stock.weight = weight
  stock.date = date
  stock.address = address
  stock.regNumber = regNumber
  stock.item = item
  //stock.buckets = buckets
  stock.supplier = supplier
  stock.driver = driver
  stock.voucherNumber = voucherNumber
  stock.batchNumber = batchNumber
  stock.grvNumber = grvNumber
  stock.idNumber = idNumber
  stock.trailer = trailer
  //stock.lossMargin = lossMargin
  stock.voucherNumber = voucherNumber
  stock.refNumber = refNumber
  stock.mobile = mobile
  stock.month = month
  stock.year = year
  stock.batchId = batchId
  stock.openingWeightKg = openingWeightKg
  stock.openingWeightTonne = openingWeightTonne
  stock.openingMass = number1
  stock.newMass = mass
  stock.closingMass = massNum + number1
  stock.openingMassTonne = number1 / 1000
  stock.newMassTonne = mass /1000
  stock.closingMassTonne = total5 / 1000
  stock.size = size
  stock.dateValue = dateValue
  
  stock.save()
  .then(pro =>{
  
    res.send(pro)
  
  })
  
  
  
  })
  
  })
  })





  router.post('/receiveMassSugar',function(req,res){
    let dateB = req.body.date
    var m = moment(dateB)
    var mformat = m.format('L')
    var month = m.format('MMMM')
    var year = m.format('YYYY')
    let dateValue = moment().valueOf()
    let arrV = []
    let number1
    
    let mass = req.body.code
    let massTonne
    let bags = req.body.bags
    //console.log(buckets,'buckets')
    let grvNumber = req.body.grvNumber
    console.log(grvNumber,'grvNumber')
   
    let lossMargin =0
    
    BatchRR.find({grvNumber:grvNumber},function(err,docs){
      console.log(docs,'docs','receiveMass')
      let supplier = docs[0].supplier
      let item = docs[0].item
      let date = docs[0].date
      let driver = docs[0].driver
      let regNumber = docs[0].regNumber
      let mobile = docs[0].mobile
      let trailer = docs[0].trailer
      let address = docs[0].address
      let batchNumber = docs[0].batchNumber
      let refNumber = docs[0].refNumber
      let idNumber = docs[0].idNumber
      let voucherNumber = docs[0].voucherNo
      let dateValue = docs[0].dateValue
      let openingWeightKg = docs[0].openingWeightKg
      let openingWeightTonne = docs[0].openingWeightTonne
      let batchId = docs[0]._id
    let newMassNum = 0
    
    console.log(voucherNumber,'voucherNo',docs[0].voucherNo)
    
    
    StockRM.find({refNumber:refNumber},function(err,docs){
    
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
     
    var stock = new StockRM();
    stock.weight = weight
    stock.date = date
    stock.address = address
    stock.regNumber = regNumber
    stock.item = item
    stock.bags = bags
    stock.supplier = supplier
    stock.driver = driver
    stock.voucherNumber = voucherNumber
    stock.batchNumber = batchNumber
    stock.grvNumber = grvNumber
    stock.idNumber = idNumber
    stock.trailer = trailer
    stock.lossMargin = lossMargin
    stock.voucherNumber = voucherNumber
    stock.refNumber = refNumber
    stock.mobile = mobile
    stock.month = month
    stock.year = year
    stock.batchId = batchId
    stock.openingWeightKg = openingWeightKg
    stock.openingWeightTonne = openingWeightTonne
    stock.openingMass = number1
    stock.newMass = mass
    stock.closingMass = massNum + number1
    stock.openingMassTonne = number1 / 1000
    stock.newMassTonne = mass /1000
    stock.closingMassTonne = total5 / 1000
    stock.size = size
    stock.dateValue = dateValue
    
    stock.save()
    .then(pro =>{
    
      res.send(pro)
    
    })
    
    
    
    })
    
    })
    })
  
  
  
  



router.post('/receiveMass',function(req,res){
var dateB = req.user.date
  var m = moment(dateB)
var mformat = m.format('L')
var month = m.format('MMMM')
var year = m.format('YYYY')
let dateValue = moment().valueOf()
let arrV = []
let number1

let mass = req.body.code
let massTonne
let state = req.body.state
console.log(state,'state777')
let grvNumber = req.body.grvNumber
console.log(grvNumber,'grvNumber')
let lossMarginX = req.body.lossMargin
let reg = /\d+\.*\d*/g;
let result = lossMarginX.match(reg)
let lossMargin = Number(result)

BatchRR.find({grvNumber:grvNumber},function(err,docs){
  console.log(docs,'docs','receiveMass')
  let supplier = docs[0].supplier
  let item = docs[0].item
  let date = docs[0].date
  let driver = docs[0].driver
  let regNumber = docs[0].regNumber
  let mobile = docs[0].mobile
  let trailer = docs[0].trailer
  let address = docs[0].address
  let batchNumber = docs[0].batchNumber
  let refNumber = docs[0].refNumber
  let idNumber = docs[0].idNumber
  let voucherNumber = docs[0].voucherNo
  let dateValue = docs[0].dateValue
  let openingWeightKg = docs[0].openingWeightKg
  let openingWeightTonne = docs[0].openingWeightTonne
  let batchId = docs[0]._id
let newMassNum = 0

console.log(voucherNumber,'voucherNo',docs[0].voucherNo)


StockRM.find({grvNumber:grvNumber},function(err,docs){

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
 
var stock = new StockRM();
stock.weight = weight
stock.date = date
stock.address = address
stock.regNumber = regNumber
stock.item = item
stock.state = state
stock.supplier = supplier
stock.driver = driver
stock.voucherNumber = voucherNumber
stock.batchNumber = batchNumber
stock.grvNumber = grvNumber
stock.idNumber = idNumber
stock.trailer = trailer
stock.lossMargin = lossMargin
stock.voucherNumber = voucherNumber
stock.refNumber = refNumber
stock.mobile = mobile
stock.month = month
stock.year = year
stock.batchId = batchId
stock.openingWeightKg = openingWeightKg
stock.openingWeightTonne = openingWeightTonne
stock.openingMass = number1
stock.newMass = mass
stock.closingMass = massNum + number1
stock.openingMassTonne = number1 / 1000
stock.newMassTonne = mass /1000
stock.closingMassTonne = total5 / 1000
stock.size = size
stock.dateValue = dateValue

stock.save()
.then(pro =>{

  res.send(pro)

})



})

})
})




router.post('/receiveMassTea',function(req,res){
  let dateB = req.body.date
  var m = moment(dateB)
  var mformat = m.format('L')
  var month = m.format('MMMM')
  var year = m.format('YYYY')
  let dateValue = moment().valueOf()
  let arrV = []
  let number1
  
  let mass = req.body.code
  let massTonne
  let grvNumber = req.body.grvNumber
  let bags = req.body.bags
  console.log(grvNumber,'grvNumber')
  /*let lossMarginX = req.body.lossMargin
  let reg = /\d+\.*\d*//*g;
  let result = lossMarginX.match(reg)*/
  let lossMargin = 0
  
  BatchRR.find({grvNumber:grvNumber},function(err,docs){
    console.log(docs,'docs','receiveMass')
    let supplier = docs[0].supplier
    let item = docs[0].item
    let date = docs[0].date
    let driver = docs[0].driver
    let regNumber = docs[0].regNumber
    let mobile = docs[0].mobile
    let trailer = docs[0].trailer
    let address = docs[0].address
    let batchNumber = docs[0].batchNumber
    let refNumber = docs[0].refNumber
    let idNumber = docs[0].idNumber
    let voucherNumber = docs[0].voucherNo
    let dateValue = docs[0].dateValue
    let openingWeightKg = docs[0].openingWeightKg
    let openingWeightTonne = docs[0].openingWeightTonne
    let batchId = docs[0]._id
  let newMassNum = 0
  
  console.log(voucherNumber,'voucherNo',docs[0].voucherNo)
  
  
  StockRM.find({grvNumber:grvNumber,item:item},function(err,docs){
  
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
   
  var stock = new StockRM();
  stock.weight = weight
  stock.date = date
  stock.address = address
  stock.regNumber = regNumber
  stock.item = item
  stock.bags = bags
  stock.supplier = supplier
  stock.driver = driver
  stock.voucherNumber = voucherNumber
  stock.batchNumber = batchNumber
  stock.grvNumber = grvNumber
  stock.idNumber = idNumber
  stock.trailer = trailer
  stock.lossMargin = 0
  stock.voucherNumber = voucherNumber
  stock.refNumber = refNumber
  stock.mobile = mobile
  stock.month = month
  stock.year = year
  stock.batchId = batchId
  stock.openingWeightKg = openingWeightKg
  stock.openingWeightTonne = openingWeightTonne
  stock.openingMass = number1
  stock.newMass = mass
  stock.closingMass = massNum + number1
  stock.openingMassTonne = number1 / 1000
  stock.newMassTonne = mass /1000
  stock.closingMassTonne = total5 / 1000
  stock.size = size
  stock.dateValue = dateValue
  
  stock.save()
  .then(pro =>{
  
    res.send(pro)
  
  })
  
  
  
  })
  
  })
  })
  



router.post('/reloadMat/:id',isLoggedIn, (req, res) => {
var pro = req.user
console.log('reload')
var m = moment()
var code = req.params.id
var mformat = m.format("L")


StockRM.find({grvNumber:code}).lean().sort({'dateValue':1}).then(docs=>{


  res.send(docs)
          })

}); 

router.get('/closeBatchRMHoney/:id',isLoggedIn,function(req,res){
var id = req.params.id
res.render('rStock/update',{id:id})

})

router.post('/closeBatchRMHoney/:id',isLoggedIn,function(req,res){
  var id = req.params.id
  var buckets = req.body.buckets
  req.check('buckets','Enter Buckets').notEmpty();
           
                  
               
                 
    
          
       
    var errors = req.validationErrors();
        if (errors) {
    
        
          req.session.errors = errors;
          req.session.success = false;
          req.flash('danger', req.session.errors[0].msg);
  
  
      res.redirect('/rm/closeBatchRMHoney/'+id);
          
        
      }
  else{
StockRM.find({refNumber:id},function(err,docs){
  if(docs){
  for(var i = 0;i<docs.length;i++){
    let sId = docs[i]._id
    StockRM.findByIdAndUpdate(sId,{$set:{buckets:buckets,lossMargin:buckets,unitMeasure:'buckets'}},function(err,locs){

    })
  }
  let batchId = docs[0].batchId
  BatchRR.findByIdAndUpdate(batchId,{$set:{buckets:buckets,lossMargin:buckets,unitMeasure:"buckets"}},function(err,vocs){

  })
  }

  res.redirect('/rm/closeBatchRM/'+id)
})
  }
})

router.get('/closeBatchRM/:id',isLoggedIn,function(req,res){
  var dateB = req.user.date
  var m = moment(dateB)

var mformat = m.format("L")
var month = m.format('MMMM')
var year = m.format('YYYY')
  let refNumber = req.params.id
  

 StockRM.find({refNumber:refNumber},function(err,nocs){
   if(nocs[0].item == 'honey'){

console.log('honey')
  let batchId = nocs[0].batchId
  let closingMass = nocs[0].closingMass - nocs[0].lossMargin
  let lossMargin = nocs[0].lossMargin
  let buckets = nocs[0].buckets
  let refNumber = nocs[0].refNumber
  let batchNumber = nocs[0].batchNumber

  BatchRR.findByIdAndUpdate(batchId,{$set:{status:"complete",unitMeasure:buckets}},function(err,vocs){

    let batchNumber= vocs.batchNumber
    let item = vocs.item
    let month = vocs.month
    let year = vocs.year
    let prefix = vocs.prefix
    let supplier = vocs.supplier
    let availableMass = vocs.closingWeightKg - lossMargin
    let voucherNo = vocs.voucherNo

    /*StockRM.find({refNumber:refNumber},function(err,locs){
      for(var i = 0;i<locs.length;i++){
        let idR = locs[i]._id
    StockRM.findByIdAndUpdate(idR,{$set:{lossMargin:lossMargin}},function(err,hocs){
      
    })
      }
    })*/


     // User.findByIdAndUpdate(uid,{$set:{item:item,supplier:supplier,date:date,availableMass:availableMass,refNumber:refNumber}},function(err,vocs){

     // })
      


  
      var final = new FinalProduct()
      final.refNumber = batchNumber
      final.quantity = buckets
      final.date = mformat
      final.ingredient = 'honey'
      final.month = month
      final.year = year
      final.status = 'null'

     
      final.save()
          .then(pro =>{
  
           

          })

        
          /*Ingredients.find({item:'honey'},function(err,toc){
            let openingBal = toc[0].massKgs + buckets
           // let openingBal = openingBalC / 5
            let id2 = toc[0]._id
    
          Ingredients.findByIdAndUpdate(id2,{$set:{massKgs:openingBal}},function(err,vocs){
    
          })
    
          })*/

        
          
      
          })
    
        
      
    
  


  res.redirect('/rm/stockRMFile/'+refNumber)
      }else if(nocs[0].item == 'ginger'){
        let loss
        if(nocs[0].state == 'clean'){
           loss = 0

        }else{
          loss = 0.025
          
        }
        let state = nocs[0].state
  let batchId = nocs[0].batchId
  let lossMarginG = nocs[0].closingMass * loss
  //let lossMargin = nocs[0].lossMargin
  let margin = 0.02
  BatchRR.findByIdAndUpdate(batchId,{$set:{status:"complete",state:state,unitMeasure:lossMarginG}},function(err,vocs){

    console.log(vocs,'vocs')
    let batchNumber= vocs.batchNumber
    let item = vocs.item
    let month = vocs.month
    let year = vocs.year
    let prefix = vocs.prefix
    let supplier = vocs.supplier
    //let lossMarginG = vocs.receivedKgs * 0.025
    console.log(lossMarginG,'lossMarginG')
    //let availableMass = vocs.closingWeightKg - lossMargin
    let voucherNo = vocs.voucherNo
  //  console.log(availableMass,'availableMass333')
  

    StockRM.find({refNumber:refNumber},function(err,locs){
      console.log(locs,'locs55')
      for(var i = 0;i<locs.length;i++){
        let idR = locs[i]._id
    StockRM.findByIdAndUpdate(idR,{$set:{lossMargin:lossMarginG}},function(err,hocs){

    })
      }
    })
    
        })
      
    
  



  res.redirect('/rm/stockRMFile/'+refNumber)
      }else if(nocs[0].item == 'bananas'){



          let batchId = nocs[0].batchId
          let closingMass = nocs[0].closingMass - nocs[0].lossMargin
          let lossMargin = nocs[0].lossMargin
        
          BatchRR.findByIdAndUpdate(batchId,{$set:{status:"complete",lossMargin:lossMargin}},function(err,vocs){
        
            let batchNumber= vocs.batchNumber
            let item = vocs.item
            let month = vocs.month
            let year = vocs.year
            let prefix = vocs.prefix
            let supplier = vocs.supplier
            let availableMass = vocs.closingWeightKg - lossMargin
            let voucherNo = vocs.voucherNo
            console.log(availableMass,'availableMass333')
            RawMat.find({item:item},function(err,docs){
              console.log(docs,'letu')
              if(docs[0].item == 'sugar' || docs[0].item == 'bananas'){
                console.log('true')
                let date =  moment().format('l');
          let date6 =  moment().format('l');
          let dateValue = moment().valueOf()
        
          let date7 =  date6.replace(/\//g, "");
          
        
             // User.findByIdAndUpdate(uid,{$set:{item:item,supplier:supplier,date:date,availableMass:availableMass,refNumber:refNumber}},function(err,vocs){
        
             // })
              
        
        
             RefNo.find({date:date,type:"crush",item:item},function(err,docs){
              let size = docs.length + 1
             refNo = date7+prefix+'B'+size+'CRS'
              console.log(refNo,'refNo')
          
              var truck = new BatchGingerCrush()
              truck.date = date
              truck.mformat = date6
              truck.dateValue = dateValue
              truck.item = item
              truck.type ='ingredient'
              truck.voucherNo = voucherNo
              truck.refNumber = batchNumber
             
              truck.batchNumber = refNo
              truck.month = month
              truck.status3 = 'open'
              truck.nxtStage='cooking'
              truck.qtyInMass = closingMass
              truck.qtyOutMass= closingMass
              truck.qtyLeft= closingMass
              truck.month = month
              truck.status = 'null'
              truck.year = year
             
              
             
          
              truck.save()
                  .then(pro =>{
          
                   
        
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
        
         
                  
              }
                  })
            
                })
              
            
          
        
        
          res.redirect('/rm/stockRMFile/'+refNumber)
      }else if(nocs[0].item == 'sugar'){



        let batchId = nocs[0].batchId
        let closingMass = nocs[0].closingMass - nocs[0].lossMargin
        let bags = nocs[0].bags
      
        BatchRR.findByIdAndUpdate(batchId,{$set:{status:"complete",lossMargin:0,unitMeasure:bags}},function(err,vocs){
      
          let batchNumber= vocs.batchNumber
          let item = vocs.item
          let month = vocs.month
          let year = vocs.year
          let prefix = vocs.prefix
          let supplier = vocs.supplier
        //  let availableMass = vocs.closingWeightKg - lossMargin
          let voucherNo = vocs.voucherNo
         // console.log(availableMass,'availableMass333')
          RawMat.find({item:item},function(err,docs){
            console.log(docs,'letu')
            if(docs[0].item == 'sugar' ){
              console.log('true')
              let date =  moment().format('l');
        let date6 =  moment().format('l');
        let dateValue = moment().valueOf()
      
        let date7 =  date6.replace(/\//g, "");
        
      
           // User.findByIdAndUpdate(uid,{$set:{item:item,supplier:supplier,date:date,availableMass:availableMass,refNumber:refNumber}},function(err,vocs){
      
           // })
            
      
      
           RefNo.find({date:date,type:"crush",item:item},function(err,docs){
            let size = docs.length + 1
           refNo = date7+prefix+'B'+size+'CRS'
            console.log(refNo,'refNo')
        
            var truck = new BatchGingerCrush()
            truck.date = date
            truck.mformat = date6
            truck.dateValue = dateValue
            truck.item = item
            truck.type ='ingredient'
            truck.voucherNo = voucherNo
            truck.refNumber = batchNumber
            truck.status3 = 'open'
            truck.batchNumber = refNo
            truck.month = month
            truck.nxtStage='cooking'
            truck.qtyInMass = closingMass
            truck.qtyOutMass= bags
            truck.qtyLeft= bags
            truck.month = month
            truck.status = 'null'
            truck.year = year
           
            
           
        
            truck.save()
                .then(pro =>{
        
                 
      
                  var book = new RefNo();
                  book.refNumber = refNo
                  book.item = item
                  book.date = date
                  book.type = 'crush'
                  book.save()
                  .then(prod =>{
              
                   
              
                  })
      
                })


                
      var final = new FinalProduct()
      final.refNumber = refNo
      final.refNumber2 = batchNumber
      final.quantity = bags
      final.date = mformat
      final.ingredient = 'sugar'
      final.month = month
      final.year = year
      final.status = 'null'

     
      final.save()
          .then(pro =>{
  
           

          })

      
              })
      
       
                
            }
                })
          
              })
            
          
        
      
      
        res.redirect('/rm/stockRMFile/'+refNumber)
    }
      
    else if(nocs[0].item == 'tea'){
  



          let batchId = nocs[0].batchId
          let closingMass = nocs[0].closingMass - 0
          let bags = nocs[0].bags
        
          BatchRR.findByIdAndUpdate(batchId,{$set:{status:"complete",lossMargin:0,unitMeasure:bags}},function(err,vocs){
        
            let batchNumber= vocs.batchNumber
            let item = vocs.item
            let month = vocs.month
            let year = vocs.year
            let prefix = vocs.prefix
            let supplier = vocs.supplier
          //  let availableMass = vocs.closingWeightKg - lossMargin
            let voucherNo = vocs.voucherNo
           // console.log(availableMass,'availableMass333')
            RawMat.find({item:item},function(err,docs){
              console.log(docs,'letu')
              if(docs[0].item == 'tea' ){
                console.log('true')
                let date =  moment().format('l');
          let date6 =  moment().format('l');
          let dateValue = moment().valueOf()
        
          let date7 =  date6.replace(/\//g, "");
          
        
             // User.findByIdAndUpdate(uid,{$set:{item:item,supplier:supplier,date:date,availableMass:availableMass,refNumber:refNumber}},function(err,vocs){
        
             // })
              
        
        
             RefNo.find({date:date,type:"crush",item:item},function(err,docs){
              let size = docs.length + 1
             refNo = date7+prefix+'B'+size+'CRS'
              console.log(refNo,'refNo')
          
              var truck = new BatchGingerCrush()
              truck.date = date
              truck.mformat = date6
              truck.dateValue = dateValue
              truck.item = item
              truck.type ='ingredient'
              truck.voucherNo = voucherNo
              truck.refNumber = batchNumber
             
              truck.batchNumber = refNo
              truck.month = month
              truck.nxtStage='cooking'
              truck.qtyInMass = closingMass
              truck.qtyOutMass= bags
              truck.qtyLeft = bags
              truck.month = month
              truck.status = 'null'
              truck.status3 = 'open'
              truck.year = year
             
              
             
          
              truck.save()
                  .then(pro =>{
          
                   
        
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
        
         
                  
              }
                  })
            
                })
              
            
          
        
        
          res.redirect('/rm/stockRMFile/'+refNumber)
      }
      
      
      
      
      
      else{
        res.redirect('/rm/stockRMFile/'+refNumber)
      }
  })

 
})



/*router.get('/closeBatchRM/:id',isLoggedIn,function(req,res){

    let refNumber = req.params.id
    StockRM.find({refNumber:refNumber},function(err,docs){
  
      let size = docs.length - 1
      let mass = docs[size].closingMass
      let subtotal = mass / 50
      subtotal.toFixed(2)
    for(var i = 0; i<docs.length;i++){
      let id = docs[i]._id
      StockRM.findByIdAndUpdate(id,{$set:{subtotal:subtotal}},function(err,locs){
  
        
      })
    }
  
  
  
    })
  
    res.redirect('/rm/stockRMFile/'+refNumber)
  })*/
  

router.get('/stockRMFile/:id',isLoggedIn,function(req,res){
  var uid = req.user._id
  var id = req.params.id
  console.log(id,'refNumber')

  StockRM.find({refNumber:id},function(err,docs){
    if(docs.length > 0 ){
  let size = docs.length - 1

  let supplier = docs[size].supplier
  let item = docs[size].item
  let date = docs[size].date
  let refNumber = docs[size].refNumber
  let lossMargin = docs[size].lossMargin
  let buckets = docs[size].buckets
  let bags = docs[size].bags
  let driver = docs[size].driver
  let regNumber = docs[size].regNumber
  let mobile = docs[size].mobile
  let trailer = docs[size].trailer
  let address = docs[size].address
  let idNumber = docs[size].idNumber
  let month = docs[size].month
  let year = docs[size].year
  let batchId = docs[size].batchId
  let openingWeight = docs[size].openingWeight
  let openingWeightTonne = docs[size].openingWeightTonne
  console.log(openingWeightTonne,'openingWeightTonne')
  let weight = docs[size].closingMass - docs[size].lossMargin

  console.log(docs[size].closingMass, docs[size].lossMargin,weight,'weight')
  //let weightTonne = docs[size].closingMass / 1000
  let weightTonne = weight / 1000
  let dateValue = docs[size].dateValue
  let closingWeight = docs[size].openingWeightKg + docs[size].closingMass - docs[size].lossMargin
  let closingWeightTonne = closingWeight / 1000
  console.log(closingWeightTonne,'closingWeightTonne')
for(var i =0;i<docs.length;i++){
  let sId = docs[i]._id
  StockRM.findByIdAndUpdate(sId,{$set:{closingMass:weight,closingMassTonne:weightTonne}},function(err,locs){

  })
}

User.findByIdAndUpdate(uid,{$set:{batchId:batchId}},function(err,locs){


})

  BatchRR.findByIdAndUpdate(batchId,{$set:{receivedKgs:weight,remainingKgs:weight,remainingTonnes:weightTonne,
  receivedTonnes:weightTonne,receivedKgs:weight, closingWeightTonne:closingWeightTonne,status:"complete",
closingWeightKg:closingWeight,status2:"open"}},function(err,vocs){

})

RawMat.find({item:item,stage:'raw'},function(err,hocs){
  //if(hocs[0].status == 'wash'){

  
    if(hocs[0].item == 'ginger'){
      let massKgs = hocs[0].massKgs + weight
      let massTonnes = hocs[0].massTonnes + weightTonne
      let idRaw = hocs[0]._id
      /*if(hocs[0].stage == 'raw'){
    BatchGingerWash.find({refNumber2:id},function(err,nocs){
    
      if(nocs.length > 0){
        let idG = nocs[0]._id
    BatchGingerWash.findByIdAndUpdate(idG,{$set:{qtyInMass:massKgs,qtyOutMass:massKgs}},function(err,focs){
    
    })
      }
    })
      }*/
    
      RawMat.findByIdAndUpdate(idRaw,{$set:{massKgs:massKgs,massTonnes:massTonnes,uniqueMeasure:massKgs}},function(err,nocs){
    
      })
    
    }else if(hocs[0].item == 'honey'){
      let massKgs = hocs[0].massKgs + weight
      let uniqueMeasure = hocs[0].uniqueMeasure + buckets
      let massTonnes = hocs[0].massTonnes + weightTonne
      let idRaw = hocs[0]._id
      /*if(hocs[0].stage == 'raw'){
    BatchGingerWash.find({refNumber2:id},function(err,nocs){
    
      if(nocs.length > 0){
        let idG = nocs[0]._id
    BatchGingerWash.findByIdAndUpdate(idG,{$set:{qtyInMass:massKgs,qtyOutMass:massKgs}},function(err,focs){
    
    })
      }
    })
      }*/
    
      RawMat.findByIdAndUpdate(idRaw,{$set:{massKgs:massKgs,massTonnes:massTonnes,uniqueMeasure:uniqueMeasure}},function(err,nocs){
    
      })
    
    }






    else if(hocs[0].item == 'sugar'){
      let massKgs = hocs[0].massKgs + weight
      let uniqueMeasure = hocs[0].uniqueMeasure + bags
      let massTonnes = hocs[0].massTonnes + weightTonne
      let idRaw = hocs[0]._id
      /*if(hocs[0].stage == 'raw'){
    BatchGingerWash.find({refNumber2:id},function(err,nocs){
    
      if(nocs.length > 0){
        let idG = nocs[0]._id
    BatchGingerWash.findByIdAndUpdate(idG,{$set:{qtyInMass:massKgs,qtyOutMass:massKgs}},function(err,focs){
    
    })
      }
    })
      }*/
    
      RawMat.findByIdAndUpdate(idRaw,{$set:{massKgs:massKgs,massTonnes:massTonnes,uniqueMeasure:uniqueMeasure}},function(err,nocs){
    
      })
    
    }



    


    else if(hocs[0].item == 'tea'){
      let massKgs = hocs[0].massKgs + weight
      let uniqueMeasure = hocs[0].uniqueMeasure + bags
      let massTonnes = hocs[0].massTonnes + weightTonne
      let idRaw = hocs[0]._id
      /*if(hocs[0].stage == 'raw'){
    BatchGingerWash.find({refNumber2:id},function(err,nocs){
    
      if(nocs.length > 0){
        let idG = nocs[0]._id
    BatchGingerWash.findByIdAndUpdate(idG,{$set:{qtyInMass:massKgs,qtyOutMass:massKgs}},function(err,focs){
    
    })
      }
    })
      }*/
    
      RawMat.findByIdAndUpdate(idRaw,{$set:{massKgs:massKgs,massTonnes:massTonnes,uniqueMeasure:uniqueMeasure}},function(err,nocs){
    
      })
    
    }
  /*}else{
    
  let date6 =  moment().format('l');
  let dateValue = moment().valueOf()

  let date7 =  date6.replace(/\//g, "");
  
    RefNo.find({date:date,type:"crush"},function(err,docs){
      let size = docs.length + 1
     refNo = date7+'B'+size+item+'crush'
      console.log(refNo,'refNo')
  
      var truck = new BatchGingerCrush()
      truck.date = date
      truck.mformat = date6
      truck.dateValue = dateValue
      truck.item = item
      truck.refNumber = refNo
      truck.refNumber2 = id
      truck.batchNumber = id
      truck.month = month
      truck.qtyInMass = 0
      truck.qtyOutMass= 0
      truck.month = month
      truck.status = 'null'
      truck.year = year
     
      
     
  
      truck.save()
          .then(pro =>{
  
          
            var book = new RefNo();
            book.refNumber = refNo
            book.date = date
            book.type = 'crush'
            book.save()
            .then(prod =>{
        
             
        
            })

          })

        })

  }*/

   /*var https = require('follow-redirects').https;
                var fs = require('fs');
                
                var options = {
                    'method': 'POST',
                    'hostname': 'lqvvzd.api.infobip.com',
                    'path': '/sms/2/text/advanced',
                    'headers': {
                        'Authorization': 'App 08a11352afef5e0a42dd9eb5c90f6bd2-8407578d-7fc2-469c-9b90-50a400b88ea8',
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    'maxRedirects': 20
                };
                
                var req = https.request(options, function (res) {
                    var chunks = [];
                
                    res.on("data", function (chunk) {
                        chunks.push(chunk);
                    });
                
                    res.on("end", function (chunk) {
                        var body = Buffer.concat(chunks);
                        console.log(body.toString());
                    });
                
                    res.on("error", function (error) {
                        console.error(error);
                    });
                });
                
                var postData = JSON.stringify({
                    "messages": [
                        {
                          "destinations": [{"to":"263772219443"},{"to":"263777801742"}, {"to":"263782808922"},{"to":"263783186772"},{"to":"263789155951"}],
                            "from": "Niyonsoft",
                            "text": weight+'kgs'+' '+' '+'of'+' '+item+' '+'Received'+' '+ 'https://niyonsoft.org/rm/grvFile/'+refNumber
                        }
                    ]
                });
                
                req.write(postData);
                
                req.end();*/
              
  
})



//req.flash('success', 'Goods received successfully');

//res.redirect('/rm/send-notification/'+weight+'/'+item)
res.redirect('/rm/approvedRequisitions')

    }
  })
})



const sendNotification = async (token,item,weight) => {
  try {
    
    /*const payload = {
      notification: {
        title:  'Raw Material Received',
        body: weight+'kgs'+''+'of'+''+item+''+'received',
        icon: 'https://joldrillingsolutions.co.zw/kambuchaLogo.jpeg',
        data: 'https://niyonsoft.org',
      },
      token: token,
    };*/
    const notification = {
      title:  'Raw Materials Received',
      body: weight+'kgs'+' '+'of'+' '+item+' '+'received',
      image: 'https://joldrillingsolutions.co.zw/kambuchaLogo.jpeg',
    };
    const payload = {
      notification,
      token: token,
      android: {
        notification: {
          icon: 'https://joldrillingsolutions.co.zw/kambuchaLogo.jpeg',
        },
      },
    };

    const response = await admin.messaging().send(payload);
    console.log('Successfully sent message:', response);
  } catch (error) {
    console.error('Error sending message:', error);
  }
};


router.get('/send-notification/:id/:id2', async (req, res) => {
  //const { userId, message } = req.body;
  const item = req.params.id2
  const weight = req.params.id
  var token = 'cHUNFzfzhMKdaXA9KtHTYU:APA91bG2jc8_nKTcTDXp3RrMK_CXmpz7hCfYBWn0qfqjRQzMJqO4xA1jaTTTJAJja5f7dWZEI1ifTYp5p6mlLeRIqME8ObYQDYu56unzh5I7POHRWZPYH_0'
 // var token = 'dFKOKwR9DtAJcsSgv0CeN0:APA91bEDRHKvE-locy0bAmYPO3SJgHuIGP9U2wrQ2YMI6K4bDBr2DwrKtBxkqs-BOP0DFtTQP6C_BSeoA5p66lrzVjdqy5aVhXAKsSBOYIhhIRcH5wSQ4Tk'
 // var token = 'fwfWuFBmb5nGcCFXCxaYJO:APA91bE0V9xlAE4VY6IucQT26P2vHYnAG-y-vI5ZF2eHeYkcqGnLqoT1DrZPjghxi0n7DFoKd-U5Gzep7-5QzAwQXPeabmjVoDy_22kFwERnrv-IyjZx2iA'
//var token = 'foJ4-Leh2t780BuosVi7_M:APA91bEau8haAbUfLgVLtGoBB3QYWUp-bYBCC1hHlxh1rx4KIZqRZoXcyq5u73vYhy-_Iu9HxQZ2UCrpSzxTmLpov-8gZ8k0TguDi8cDqSIiPLdEyeuW13M'
  try {
    await sendNotification(token,item,weight);
    res.status(200).send('Notification sent successfully.');
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }

  
//res.redirect('/rm/send-notification')
//res.redirect('/rm/approvedRequisitions')
});


/*router.get('/viewGRV/:id',isLoggedIn,function(req,res){
  var refNumber = req.params.id

  StockRMFile.find(function(err,docs){

   StockRMFile.find({refNumber:refNumber},function(err,locs){


    res.render('kambucha/grv2',{listX:locs,listX2:docs})
  })
  })

})*/


/*router.get('/grvList',isLoggedIn,function(req,res){
  BatchRR.find({status:"complete"},function(err,docs){
    res.render('rStock/grvList',{listX:docs})
  })
})*/

router.get('/grvList',isLoggedIn,function(req,res){
  BatchRR.find({status:"complete"},function(err,docs){
  
    let arr=[]
    for(var i = docs.length - 1; i>=0; i--){
  
      arr.push(docs[i])
    }
  
    res.render('rStock/grvList',{listX:arr})
  
  })
  
  
  
  })



router.get('/grvWeights/:id',isLoggedIn,function(req,res){
  var id = req.params.id
  StockRM.find({batchNumber:id},function(err,docs){
    if(docs){
console.log(docs,'docs')
      let supplier = docs[0].supplier
      let item = docs[0].item
      let date = docs[0].date
      let refNumber = docs[0].refNumber
      let driver = docs[0].driver
      let regNumber = docs[0].regNumber
      let orderNumber = docs[0].voucherNo
      let batchNumber = docs[0].batchNumber
      let grvNumber = docs[0].grvNumber
      let requestedMass = docs[0].requestedMassKgs
    
    res.render('rStock/grvWeights',{supplier:supplier,
    item:item,date:date,refNumber:refNumber,driver:driver,regNumber:regNumber,
  orderNumber:orderNumber,batchNumber,grvNumber:grvNumber,
requestedMass:requestedMass})

    }
  })
})



router.get('/viewGRV/:id',isLoggedIn,function(req,res){
  var id = req.params.id

  BatchRR.find(function(err,docs){

   BatchRR.find({_id:id},function(err,locs){
     console.log(locs,'locs')

    res.render('rStock/grv2',{listX:locs,listX2:docs})
  })
  })

})

router.get('/grvFileV/:id',function(req,res){
var id = req.params.id
res.redirect('/rm/grvFile/'+id)
})



router.get('/grvFile/:id',function(req,res){

  var m = moment()
  var mformat = m.format('L')
  var month = m.format('MMMM')
  var year = m.format('YYYY')
  //var date = req.user.date
  var refNumber = req.params.id
  //let batchId = req.user.batchId
  //var batchNumber = req.user.batchNumber

  StockRM.find({grvNumber:refNumber}).lean().then(docs=>{


  let size = docs.length - 1
  let batchNumber = docs[0].batchNumber

var arrG = []
arrG.push(docs[size])
  
  console.log(arrG,'arrG')
  
  const compile = async function (templateName,arrG ){
  const filePath = path.join(process.cwd(),'templates',`${templateName}.hbs`)
  
  const html = await fs.readFile(filePath, 'utf8')
  
  return hbs.compile(html)(arrG)
  
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
  const content = await compile('grv',arrG)
  

  
  await page.setContent(content, { waitUntil: 'networkidle2'});

  await page.emulateMediaType('screen')
  let height = await page.evaluate(() => document.documentElement.offsetHeight);
  await page.evaluate(() => matchMedia('screen').matches);
  await page.setContent(content, { waitUntil: 'networkidle0'});
 
   
  let filename = 'grv'+batchNumber+'.pdf'
  await page.pdf({
 
  path:(`./public/grv/${year}/${month}/grv${batchNumber}`+'.pdf'),
  format:"A4",

  height: height + 'px',
  printBackground:true
  
  })
  
 
  res.redirect('/rm/openFile/'+batchNumber)



  
  
  
 
 
  const file = await fs.readFile(`./public/grv/${year}/${month}/grv${batchNumber}`+'.pdf');
  const form = new FormData();
  form.append("file", file,filename);
  
  await Axios({
    method: "POST",
   //url: 'https://portal.steuritinternationalschool.org/clerk/uploadStatement',
     //url: 'https://niyonsoft.org/uploadStatementDispatch',
     url:'https://niyonsoft.org/rm/uploadGrv',
     //url:'localhost:8000/rm/uploadGrv',
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

router.get('/openFile/:id',function(req,res){
var refNumber = req.params.id
var batchNumber = req.params.id
var m = moment()
var mformat = m.format('L')
var month = m.format('MMMM')
var year = m.format('YYYY')
const path =`./public/grv/${year}/${month}/grv${batchNumber}.pdf`
if (fs.existsSync(path)) {
    res.contentType("application/pdf");
    fs.createReadStream(path).pipe(res)
} else {
    res.status(500)
    console.log('File not found')
    res.send('File not found')
}

})

  router.post('/uploadGRV',upload.single('file'),(req,res,nxt)=>{
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
  res.redirect('/rm/fileIdGrv/'+filename)
  })
  
  })

  router.get('/fileIdGrv/:id',function(req,res){
    console.log(req.params.id)
    var id = req.params.id
    
    res.redirect('/rm/openGrv/'+id)
    
    })


  router.get('/openGrv/:id',(req,res)=>{
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



  







    router.post('/batchAuto',function(req,res){
      var batchNumber = req.body.code
      BatchRR.find({status:"complete",batchNumber:batchNumber},function(err,docs){
        res.send(docs)
      })
    })
    

  router.get('/cancel/:id',function(req,res){
    var voucherNumber = req.params.id
let arrV=[]
let number1, massKgs
    StockRM.find({voucherNumber:voucherNumber},function(err,docs){

      if(docs.length > 0){

      
let item = docs[0].item
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
 
      
      //let total5 = massNum + number1
      massNum =  number1.toFixed(2)

      RawMat.find({item:item,stage:'raw'},function(err,hocs){
     
      if(hocs[0].massKgs > massNum){
        
         massKgs = hocs[0].massKgs - massNum
       
      }else{
         massKg = 0
      }
        let idRaw = hocs[0]._id
       
      
        RawMat.findByIdAndUpdate(idRaw,{$set:{massKgs:massKgs}},function(err,nocs){
      
        })



      })


      StockRM.find({voucherNumber:voucherNumber},function(err,docs){

        for(var i = 0;i<docs.length; i++){
          // console.log(docs[i].newMass,'serima')
        StockRM.findByIdAndRemove(docs[i]._id,function(err,tocs){

        })
           }
      })
    }
    res.redirect('/rm/cancelBatch/'+voucherNumber)

      })


  })

  

  router.get('/cancelBatch/:id',function(req,res){
    var voucherNo = req.params.id

    BatchRR.find({voucherNo:voucherNo},function(err,docs){
      if(docs.length > 0){
        let id = docs[0]._id
        BatchRR.findByIdAndRemove(id,function(err,locs){

        })
      }

      res.redirect('/rm/cancelOrder/'+voucherNo)
    })
  })
  

  router.get('/cancelOrder/:id',function(req,res){
    var voucherNo = req.params.id

    StockVoucher.find({voucherNumber:voucherNo},function(err,docs){
      if(docs.length > 0){
        console.log(docs[0])
        let id = docs[0]._id
        StockVoucher.findByIdAndRemove(id,function(err,locs){

        })
      }

      res.redirect('/rm/approvedRequisitions/')
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
          res.redirect('/rm/updateBP')
        })
      })


      router.get('/updateBP',function(req,res){
        BatchPackaging.find(function(err,docs){
          for(var i = 0;i<docs.length;i++){
           let id = docs[i]._id
           BatchPackaging.findByIdAndRemove(id,(err,doc)=>{
      
           }) 
          }
          res.redirect('/rm/updatePA')
        })
      })


      router.get('/updatePA',function(req,res){
        Packaging.find(function(err,docs){
          for(var i = 0;i<docs.length;i++){
           let id = docs[i]._id
           Packaging.findByIdAndRemove(id,(err,doc)=>{
      
           }) 
          }
          res.redirect('/rm/updateBD')
        })
      })

      router.get('/updateBD',function(req,res){
        BlendingDays.find(function(err,docs){
          for(var i = 0;i<docs.length;i++){
           let id = docs[i]._id
           BlendingDays.findByIdAndRemove(id,(err,doc)=>{
      
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
          res.redirect('/rm/updateF2')
        })
      })

      router.get('/updateF2',function(req,res){
       Fermentation.find(function(err,docs){
          for(var i = 0;i<docs.length;i++){
           let id = docs[i]._id
           Fermentation.findByIdAndRemove(id,(err,doc)=>{
      
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





    



  
module.exports = router;
  
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  else{
      res.redirect('/')
  }
}
