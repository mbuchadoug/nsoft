var express = require('express');
var router = express.Router();
var InvoiceSubFile = require('../models/invoiceSubFile');
var ReturnsSubFile = require('../models/returnsSubFile');
var User = require('../models/user');
var Ware = require('../models/ware');
var BatchFermentationIngredients = require('../models/batchFermentationIngredients');
var BlendingTanks = require('../models/blendingTanks');
var BlendingDays = require('../models/blendingDays');
var FinalProductEvaluation = require('../models/finalProductEvaluation');
var Warehouse = require('../models/warehouse');
var Customer = require('../models/customer');
var BatchR = require('../models/batchR');
var BatchRR = require('../models/batchRR');
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

const { Vonage } = require('@vonage/server-sdk')

const vonage = new Vonage({
  apiKey: "64ff8fb9",
  apiSecret: "F4nr3GVpi9NynJSu"
})

const arr = {}
const arr2 = {}
const arrE ={}
const arrE2 ={}

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

router.get('/warehouseStock',isLoggedIn,function(req,res){
  var pro = req.user
  //res.render('admin/dash6',{pro:pro})
  Product.find({},function(err,docs){
 Warehouse.find({},function(err,hocs){
  res.render('accounts3/dash7',{pro:pro,arr:docs,arr1:hocs})
})
  })
})

router.get('/viewGRV/:id',isLoggedIn,function(req,res){
  var id = req.params.id
console.log('viewItem')
  BatchRR.find({status:"complete"},function(err,docs){

   BatchRR.find({_id:id},function(err,locs){
    // console.log(locs,'locs')

    res.render('accounts3/grv2',{listX:locs,listX2:docs})
  })
  })

})


router.get('/stockRequisitions',isLoggedIn,function(req,res){

    StockVoucher.find({status3:"pending"},function(err,docs){
        if(docs){
            res.render('accounts3/approve3',{listX:docs})
        }
    })
})


router.get('/approve/:id',isLoggedIn,function(req,res){
    var id = req.params.id
    var name = req.user.fullname
   
    let date6 = moment().format('l');
     let date7 =  date6.replace(/\//g, "");
    StockVoucher.findByIdAndUpdate(id,{$set:{approver3:name,status3:"approved",status:"approved"}},function(err,docs){

        if(!err){
            console.log(docs,'docsV')
            let stocKgs = docs.currentMassKgs
            let stockTonnes = docs.currentMassTonnes
            let item = docs.item
            let month = docs.month
            let year = docs.year
            let date = docs.date
            let voucherNo = docs.voucherNumber
            let dateValue = docs.dateValue
            let requestedMassTonnes = docs.requestedMassTonnes
            let requestedMassKgs = docs.requestedMassKgs
            RefNo.find({date:date},function(err,docs){
                let size = docs.length + 1
               refNo = date7+'B'+size+'RM'
                console.log(refNo,'refNo')
            if(item == 'ginger'){
                var truck = new BatchRR()
                truck.date = date
                truck.mformat = date6
                truck.paymentStatus = 'unpaid'
                truck.priceStatus = 'null'
                truck.stage = 'wash'
                truck.dateValue = dateValue
                truck.item = item
                truck.refNumber = refNo
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
            
            
            
                
      /*const from = "Kambucha"
      const to = "263771446827"
      const text = 'Stock Requistion Accepted, Check Your Purchase Order'+' '+requestedMassKgs+' '+item
      
      async function sendSMS() {
          await vonage.sms.send({to, from, text})
              .then(resp => { console.log('Message sent successfully'); console.log(resp); })
              .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
      }
      
      sendSMS();*/

      const accountSid = 'AC242271b8616514bb11c25c9513538395';
      const authToken = '95d50bdc50ec268f2213a1a1634c65ea';
      const client = require('twilio')(accountSid, authToken);
      client.messages
          .create({
            body:'Stock Requistion Accepted, Check Your Purchase Order'+' '+requestedMassKgs+' '+item,
            from: '+12194198819',
            to: '+263781165357'
          })
          .then(message => console.log(message.sid));

            
            let batchId = pro._id
            
                var book = new RefNo();
              book.refNumber = refNo
              book.date = date
              book.type = 'receiving material'
              book.save()
              .then(pro =>{
            
                console.log('success')
                res.redirect('/accounts3/viewPO3/'+id)
               // res.redirect('/accounts3/grvFileV/'+id)
            
            
              })
            })
          }else if(item == 'tea'){
            var truck = new BatchRR()
            truck.date = date
            truck.mformat = date6
            truck.dateValue = dateValue
            truck.item = item
            truck.paymentStatus = 'unpaid'
            truck.priceStatus = 'null'
            truck.stage = 'cooking'
            truck.refNumber = refNo
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
        
        
              
                
    /*  const from = "Kambucha"
      const to = "263771446827"
      const text = 'Stock Requistion Accepted, Check Your Purchase Order'+' '+requestedMassKgs+' '+item
      
      async function sendSMS() {
          await vonage.sms.send({to, from, text})
              .then(resp => { console.log('Message sent successfully'); console.log(resp); })
              .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
      }
      
      sendSMS();*/
      
     
      const accountSid = 'AC242271b8616514bb11c25c9513538395';
      const authToken = '95d50bdc50ec268f2213a1a1634c65ea';
      const client = require('twilio')(accountSid, authToken);
      client.messages
          .create({
            body:'Stock Requistion Accepted, Check Your Purchase Order'+' '+requestedMassKgs+' '+item,
            from: '+12194198819',
            to: '+263781165357'
          })
          .then(message => console.log(message.sid));

          
        
        let batchId = pro._id
        
            var book = new RefNo();
          book.refNumber = refNo
          book.date = date
          book.type = 'receiving material'
          book.save()
          .then(pro =>{
        
            console.log('success')

            res.redirect('/accounts3/viewPO3/'+id)
           // res.redirect('/accounts3/grvFileV/'+id)
        
        
          })
        })

      }
      else if(item == 'garlic'){
        var truck = new BatchRR()
        truck.date = date
        truck.mformat = date6
        truck.dateValue = dateValue
        truck.item = item
        truck.paymentStatus = 'unpaid'
        truck.priceStatus = 'null'
        truck.stage = 'crush'
        truck.refNumber = refNo
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
    
    
          
                
              /*const from = "Kambucha"
              const to = "263771446827"
              const text = 'Stock Requistion Accepted, Check Your Purchase Order'+' '+requestedMassKgs+' '+item
              
              async function sendSMS() {
                  await vonage.sms.send({to, from, text})
                      .then(resp => { console.log('Message sent successfully'); console.log(resp); })
                      .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
              }
              
              sendSMS();*/

              
    
      const accountSid = 'AC242271b8616514bb11c25c9513538395';
      const authToken = '95d50bdc50ec268f2213a1a1634c65ea';
      const client = require('twilio')(accountSid, authToken);
      client.messages
          .create({
            body:'Stock Requistion Accepted, Check Your Purchase Order'+' '+requestedMassKgs+' '+item,
            from: '+12194198819',
            to: '+263781165357'
          })
          .then(message => console.log(message.sid));
      
    
    let batchId = pro._id
    
        var book = new RefNo();
      book.refNumber = refNo
      book.date = date
      book.type = 'receiving material'
      book.save()
      .then(pro =>{
    
        console.log('success')

        res.redirect('/accounts3/viewPO3/'+id)
       // res.redirect('/accounts3/grvFileV/'+id)
    
    
      })
    })

  



          }

          else if(item == 'sugar'){
            var truck = new BatchRR()
            truck.date = date
            truck.mformat = date6
            truck.dateValue = dateValue
            truck.item = item
            truck.paymentStatus = 'unpaid'
            truck.priceStatus = 'null'
            truck.stage = 'cooking'
            truck.refNumber = refNo
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
        
        
              
                
     const from = "Kambucha"
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
            body:'Stock Requistion Accepted, Check Your Purchase Order'+' '+requestedMassKgs+' '+item,
            from: '+12194198819',
            to: '+263781165357'
          })
          .then(message => console.log(message.sid));
          
        
        let batchId = pro._id
        
            var book = new RefNo();
          book.refNumber = refNo
          book.date = date
          book.type = 'receiving material'
          book.save()
          .then(pro =>{
        
            console.log('success')

            res.redirect('/accounts3/viewPO3/'+id)
        
        
          })
        })
      }

          else if(item == 'honey'){
            var truck = new BatchRR()
            truck.date = date
            truck.mformat = date6
            truck.dateValue = dateValue
            truck.item = item
            truck.stage = 'crush'
            truck.priceStatus = 'null'
            truck.refNumber = refNo
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
        
        
        
                
                
     /* const from = "Kambucha"
      const to = "263771446827"
      const text = 'Stock Requistion Accepted, Check Your Purchase Order'+' '+requestedMassKgs+' '+item
      
      async function sendSMS() {
          await vonage.sms.send({to, from, text})
              .then(resp => { console.log('Message sent successfully'); console.log(resp); })
              .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
      }
      
      sendSMS();*/

      
     
      const accountSid = 'AC242271b8616514bb11c25c9513538395';
      const authToken = '95d50bdc50ec268f2213a1a1634c65ea';
      const client = require('twilio')(accountSid, authToken);
      client.messages
          .create({
            body:'Stock Requistion Accepted, Check Your Purchase Order'+' '+requestedMassKgs+' '+item,
            from: '+12194198819',
            to: '+263781165357'
          })
          .then(message => console.log(message.sid));

        
        let batchId = pro._id
        
            var book = new RefNo();
          book.refNumber = refNo
          book.date = date
          book.type = 'receiving material'
          book.save()
          .then(pro =>{
        
            console.log('success')

            res.redirect('/accounts3/viewPO3/'+id)
           // res.redirect('/accounts3/grvFileV/'+id)
        
        
          })
        })

      }
          
          
          
          else if(item == 'rosemary'){
            var truck = new BatchRR()
            truck.date = date
            truck.mformat = date6
            truck.dateValue = dateValue
            truck.item = item
            truck.stage = 'cooking'
            truck.priceStatus = 'null'
            truck.refNumber = refNo
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
        
        
        
                
                
     /* const from = "Kambucha"
      const to = "263771446827"
      const text = 'Stock Requistion Accepted, Check Your Purchase Order'+' '+requestedMassKgs+' '+item
      
      async function sendSMS() {
          await vonage.sms.send({to, from, text})
              .then(resp => { console.log('Message sent successfully'); console.log(resp); })
              .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
      }
      
      sendSMS();*/

      
     
      const accountSid = 'AC242271b8616514bb11c25c9513538395';
      const authToken = '95d50bdc50ec268f2213a1a1634c65ea';
      const client = require('twilio')(accountSid, authToken);
      client.messages
          .create({
            body:'Stock Requistion Accepted, Check Your Purchase Order'+' '+requestedMassKgs+' '+item,
            from: '+12194198819',
            to: '+263781165357'
          })
          .then(message => console.log(message.sid));
        
        let batchId = pro._id
        
            var book = new RefNo();
          book.refNumber = refNo
          book.date = date
          book.type = 'receiving material'
          book.save()
          .then(pro =>{
        
            console.log('success')

           // res.redirect('/accounts3/grvFileV/'+id)
           res.redirect('/accounts3/viewPO3/'+id)
        
        
          })
        })
          }

          else if(item == 'black-pepper'){
            var truck = new BatchRR()
            truck.date = date
            truck.mformat = date6
            truck.dateValue = dateValue
            truck.item = item
            truck.stage = 'crush'
            truck.refNumber = refNo
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
        
        
              
                
     /* const from = "Kambucha"
      const to = "263771446827"
      const text = 'Stock Requistion Accepted, Check Your Purchase Order'+' '+requestedMassKgs+' '+item
      
      async function sendSMS() {
          await vonage.sms.send({to, from, text})
              .then(resp => { console.log('Message sent successfully'); console.log(resp); })
              .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
      }
      
      sendSMS();*/
      
    
      const accountSid = 'AC242271b8616514bb11c25c9513538395';
      const authToken = '95d50bdc50ec268f2213a1a1634c65ea';
      const client = require('twilio')(accountSid, authToken);
      client.messages
          .create({
            body:'Stock Requistion Accepted, Check Your Purchase Order'+' '+requestedMassKgs+' '+item,
            from: '+12194198819',
            to: '+263781165357'
          })
          .then(message => console.log(message.sid));
          
        
        let batchId = pro._id
        
            var book = new RefNo();
          book.refNumber = refNo
          book.date = date
          book.type = 'receiving material'
          book.save()
          .then(pro =>{
        
            console.log('success')

            res.redirect('/accounts3/viewPO3/'+id)
        
        
          })
        })

      }

          else if(item == 'lemon'){
            var truck = new BatchRR()
            truck.date = date
            truck.mformat = date6
            truck.dateValue = dateValue
            truck.item = item
            truck.stage = 'crush'
            truck.priceStatus = 'null'
            truck.refNumber = refNo
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
        
        
              
                
      /*const from = "Kambucha"
      const to = "263771446827"
      const text = 'Stock Requistion Accepted, Check Your Purchase Order'+' '+requestedMassKgs+' '+item
      
      async function sendSMS() {
          await vonage.sms.send({to, from, text})
              .then(resp => { console.log('Message sent successfully'); console.log(resp); })
              .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
      }
      
      sendSMS();*/

      
     
      const accountSid = 'AC242271b8616514bb11c25c9513538395';
      const authToken = '95d50bdc50ec268f2213a1a1634c65ea';
      const client = require('twilio')(accountSid, authToken);
      client.messages
          .create({
            body:'Stock Requistion Accepted, Check Your Purchase Order'+' '+requestedMassKgs+' '+item,
            from: '+12194198819',
            to: '+263781165357'
          })
          .then(message => console.log(message.sid));
          
        
        let batchId = pro._id
        
            var book = new RefNo();
          book.refNumber = refNo
          book.date = date
          book.type = 'receiving material'
          book.save()
          .then(pro =>{
        
            console.log('success')

            res.redirect('/accounts3/viewPO3/'+id)
        
        
          })
        })


      }  
          
          
          else if(item == 'bananas'){
            var truck = new BatchRR()
            truck.date = date
            truck.mformat = date6
            truck.dateValue = dateValue
            truck.item = item
            truck.paymentStatus = 'unpaid'
            truck.priceStatus = 'null'
            truck.stage = 'crush'
            truck.refNumber = refNo
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
        
              
                
      /*const from = "Kambucha"
      const to = "263771446827"
      const text = 'Stock Requistion Accepted, Check Your Purchase Order'+' '+requestedMassKgs+' '+item
      
      async function sendSMS() {
          await vonage.sms.send({to, from, text})
              .then(resp => { console.log('Message sent successfully'); console.log(resp); })
              .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
      }
      
      sendSMS();*/

      
     
      const accountSid = 'AC242271b8616514bb11c25c9513538395';
      const authToken = '95d50bdc50ec268f2213a1a1634c65ea';
      const client = require('twilio')(accountSid, authToken);
      client.messages
          .create({
            body:'Stock Requistion Accepted, Check Your Purchase Order'+' '+requestedMassKgs+' '+item,
            from: '+12194198819',
            to: '+263781165357'
          })
          .then(message => console.log(message.sid));
        
          
        
        let batchId = pro._id
        
            var book = new RefNo();
          book.refNumber = refNo
          book.date = date
          book.type = 'receiving material'
          book.save()
          .then(pro =>{
        
            console.log('success')

            res.redirect('/accounts3/viewPO3/'+id)
        
        
          })
        })
          }


        })
        }


    })

   
})




router.get('/grvFileV/:id',function(req,res){
  var id = req.params.id
  res.redirect('/accounts3/viewGRV/'+id)
  })

router.get('/viewGRV/:id',isLoggedIn,function(req,res){
  var id = req.params.id

  StockVoucher.find(function(err,docs){

  StockVoucher.find({_id:id},function(err,locs){
     console.log(locs,'locs')

    res.render('accounts3/purchaseOrder',{listX:locs,listX2:docs})
  })
  })

})






router.get('/reject/:id',isLoggedIn,function(req,res){
    var id = req.params.id
    var name = req.user.fullname
    StockVoucher.findByIdAndUpdate(id,{$set:{approver3:name,status3:"rejected",status:"rejected"}},function(err,docs){


    })

    res.redirect('/accounts3/stockRequisitions')
})





router.get('/defer/:id',isLoggedIn,function(req,res){
    var id = req.params.id
    var name = req.user.fullname
    StockVoucher.findByIdAndUpdate(id,{$set:{approver3:name,status3:"deferred",status:"deferred"}},function(err,docs){


    })

    res.redirect('/accounts3/stockRequisitions')
})
















router.get('/viewPO3/:id',isLoggedIn,function(req,res){
  var rtnsNumber = req.params.id
  StockVoucher.find({status:"approved"},function(err,ocs){

   // console.log(docs,'ok')
    //res.render('kambucha/pdf',{listX:docs})

    res.redirect('/accounts3/viewPO/'+rtnsNumber)
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
    res.render('accounts3/purchaseOrder',{listX:locs,listX2:docs,id:voucherId})
  })
  })



})


router.get('/blendingExtraDaysApproval',isLoggedIn,function(req,res){
  var errorMsg = req.flash('danger')[0];
var successMsg = req.flash('success')[0];
BlendingDays.find({status:'extra',md:"pending"},function(err,docs){

    res.render('accounts3/extraDays',{listX:docs,successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg})
  })
})



router.get('/blendingExtraDaysApproval/:id',isLoggedIn,function(req,res){
var id = req.params.id


BlendingDays.findByIdAndUpdate(id,{$set:{md:'approved'}},function(err,doc){




/*const from = "Kambucha"
const to = "263771446827"
const text = 'Check Stock Requisition of'+' '+doc.requestedMassKgs+' '+doc.item

async function sendSMS() {
    await vonage.sms.send({to, from, text})
        .then(resp => { console.log('Message sent successfully'); console.log(resp); })
        .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
}

sendSMS();*/

/* const accountSid = 'AC242271b8616514bb11c25c9513538395';
const authToken = '95d50bdc50ec268f2213a1a1634c65ea';
const client = require('twilio')(accountSid, authToken);
client.messages
    .create({
      body:'Check Stock Requisition of'+' '+doc.requestedMassKgs+' '+doc.item,
      from: '+12194198819',
      to: '+263781165357'
    })
    .then(message => console.log(message.sid));*/

})

res.redirect('/accounts3/blendingExtraDaysApproval')
})
  


router.get('/blendingExtraDaysReject/:id',isLoggedIn,function(req,res){
var id = req.params.id


BlendingDays.findByIdAndUpdate(id,{$set:{md:'rejected'}},function(err,doc){




/*const from = "Kambucha"
const to = "263771446827"
const text = 'Check Stock Requisition of'+' '+doc.requestedMassKgs+' '+doc.item

async function sendSMS() {
    await vonage.sms.send({to, from, text})
        .then(resp => { console.log('Message sent successfully'); console.log(resp); })
        .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
}

sendSMS();*/

/* const accountSid = 'AC242271b8616514bb11c25c9513538395';
const authToken = '95d50bdc50ec268f2213a1a1634c65ea';
const client = require('twilio')(accountSid, authToken);
client.messages
    .create({
      body:'Check Stock Requisition of'+' '+doc.requestedMassKgs+' '+doc.item,
      from: '+12194198819',
      to: '+263781165357'
    })
    .then(message => console.log(message.sid));*/

})

res.redirect('/accounts3/blendingExtraDaysApproval')
})
  

router.get('/purchaseOrders/',isLoggedIn,function(req,res){
 

  StockVoucher.find({status:'approved'},function(err,docs){

   

   // console.log(docs,'ok')
    res.render('accounts3/purchaseOrder2',{listX:docs,listX2:docs})
  })
  

})




router.get('/viewPurchaseInvoice/:id',isLoggedIn,function(req,res){

  BatchRR.find({status:'complete'},function(err,locs){

  BatchRR.find({status:'complete'},function(err,docs){

   // console.log(docs,'ok')
    res.render('accounts3/purchaseOrder2',{listX:docs,listX2:locs})
  })
  })

})






router.get('/supplierInvoice/:id',isLoggedIn,function(req,res){
  var id = req.params.id
  
  
  BatchRR.find({priceStatus:"set"},function(err,vocs){
  
  
  BatchRR.find({_id:id},function(err,docs){
    res.render('accounts3/pdfInvoice',{listX:docs,listX2:vocs})
  })
  
  })
  })
  
  
  router.get('/supplierInvoices',isLoggedIn,function(req,res){
   
    
    
    BatchRR.find({priceStatus:"set"},function(err,vocs){
    if(vocs.length > 0){
  
  let id = vocs[0]._id
    
    BatchRR.find({_id:id},function(err,docs){
      res.render('accounts3/pdfInvoice',{listX:docs,listX2:vocs})
    })
  
  }
    
    })
    })
    
  
  

    router.get('/grvList',isLoggedIn,function(req,res){
      BatchRR.find({status:"complete"},function(err,docs){
        res.render('accounts3/grvList',{listX:docs})
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
    res.redirect('/md/grvFile/'+id)
    })
    
    
    
    router.get('/grvFile/:id',isLoggedIn,function(req,res){
    
      var m = moment()
      var mformat = m.format('L')
      var month = m.format('MMMM')
      var year = m.format('YYYY')
      var date = req.user.date
      var refNumber = req.params.id
      let batchId = req.user.batchId
      var batchNumber = req.user.batchNumber
    
      StockRM.find({refNumber:refNumber}).lean().then(docs=>{
    
    
      let size = docs.length - 1
    
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
         url:'https://niyonsoft.org/md/uploadGrv',
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
    
    router.get('/openFile/:id',isLoggedIn,function(req,res){
    var refNumber = req.params.id
    var batchNumber = req.user.batchNumber
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
      res.redirect('/md/fileIdGrv/'+filename)
      })
      
      })
    
      router.get('/fileIdGrv/:id',function(req,res){
        console.log(req.params.id)
        var id = req.params.id
        
        res.redirect('/md/openGrv/'+id)
        
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
    
    
    
      
    
    
    
    
 

    router.get('/gSample',function(req,res){
      res.render('accounts3/grvSample')
    })



    router.get('/statementGen/:id',isLoggedIn,function(req,res){
      //console.log(arrStatementR,'arrSingleUpdate')
      var arrStatemementR=[]
      var m = moment()
      var mformat = m.format('L')
      var month = m.format('MMMM')
      var year = m.format('YYYY')
      var date = req.user.date
      //var receiveDate = req.user.dispatchDate
      //var code ="Tiana Madzima"
      var voucherId = req.params.id
      var arrG = []
      StockVoucher.findById(voucherId).lean().then(docs=>{


      
   
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
      const content = await compile('PO',docs)
      
      //const content = await compile('index',arr[code])
      
      await page.setContent(content, { waitUntil: 'networkidle2'});
      //await page.setContent(content)
      //create a pdf document
      await page.emulateMediaType('screen')
      //let height = await page.evaluate(() => document.documentElement.offsetHeight);
      await page.evaluate(() => matchMedia('screen').matches);
      await page.setContent(content, { waitUntil: 'networkidle0'});
      //console.log(await page.pdf(),'7777')
       
      let filename = 'POR'+seqNum+'.pdf'
      await page.pdf({
      //path:('../gitzoid2/reports/'+year+'/'+month+'/'+uid+'.pdf'),
      path:(`./public/statements/${year}/${month}/POR${seqNum}`+'.pdf'),
      format:"A4",
      width:'30cm',
      height:'21cm',
      //height: height + 'px',
      printBackground:true
      
      })
      
      //res.redirect('/accounts3/openFile/'+filename)
      console.log(seqNum,'seqNum')
      res.redirect('/accounts3/openFilePO/'+seqNum)
      
      var repo = new RepoFiles();
      
      repo.filename = filename;
      repo.fileId = "null";
      repo.status = 'PO'
      repo.date = mformat
      repo.year = year;
      repo.month = month
      
      
      console.log('done')
      
      repo.save().then(poll =>{
      
      })
      
      
      //upload.single('3400_Blessing_Musasa.pdf')
      
      
      
      /*await browser.close()
      
      /*process.exit()*/
      
      const file = await fs.readFile(`./public/statements/${year}/${month}/POR${seqNum}`+'.pdf');
      const form = new FormData();
      form.append("file", file,filename);
      //const headers = form.getHeaders();
      //Axios.defaults.headers.cookie = cookies;
      //console.log(form)
      await Axios({
        method: "POST",
       //url: 'https://portal.steuritinternationalschool.org/clerk/uploadStatement',
     url: 'https://niyonsoft.org/accounts3/uploadStatementPO',
        //url:'http://localhost:8000/accounts3/uploadStatement',
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
      

      
router.get('/openFilePO/:id',isLoggedIn,function(req,res){
  var seqNum =  req.params.id
  var batchNumber = req.user.batchNumber
  var m = moment()
  var mformat = m.format('L')
  var month = m.format('MMMM')
  var year = m.format('YYYY')
  const path =`./public/statements/${year}/${month}/POR${seqNum}`+'.pdf'
  if (fs.existsSync(path)) {
      res.contentType("application/pdf");
      fs.createReadStream(path).pipe(res)
  } else {
      res.status(500)
      console.log('File not found')
      res.send('File not found')
  }
  
  })
  
      
router.post('/uploadStatementPO',upload.single('file'),(req,res,nxt)=>{
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
res.redirect('/accounts3/fileIdPO/'+filename)
})

})


router.get('/fileIdPO/:id',function(req,res){
  console.log(req.params.id)
  var id = req.params.id
  
  res.redirect('/accounts3/openPO/'+id)
  
  })


router.get('/openPO/:id',(req,res)=>{
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










module.exports = router;
  
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  else{
      res.redirect('/')
  }
}
