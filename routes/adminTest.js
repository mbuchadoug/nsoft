var express = require('express');
var router = express.Router();
var InvoiceSubFile = require('../models/invoiceSubFile');
var ReturnsSubFile = require('../models/returnsSubFile');
var User = require('../models/user');
var Ware = require('../models/ware');
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





router.get('/warehouseUpdate',function(req,res){
    let arr16=[]
    Product.find(function(err,docs){
      for(var i = 0;i<docs.length;i++){
        let product = docs[i].name
        let category = docs[i].category
        let subCategory = docs[i].subCategory
        let usd = docs[i].usd
    
        Ware.find(function(err,locs){
    for(var i = 0;i<locs.length;i++){
      let warehouse = locs[i].name
    
      Warehouse.find({product:product,warehouse:warehouse},function(err,vocs){
    console.log(vocs.length,'size9')
        if(vocs.length == 0){
    
          StockV.find({name:product,warehouse:warehouse,status:'received'},function(err,nocs){
          let cases = nocs.length
     
          var ware = new Warehouse()
    
          ware.warehouse=warehouse
          ware.product = product
          ware.cases = cases
          ware.category = category
          ware.subCategory = subCategory
          ware.subCategory = category
          ware.quantity = 0
          ware.openingQuantity = 0
          ware.rcvdQuantity = 0
          ware.unitCases = 12
          ware.type='goods'
          ware.account = 'sales'
          ware.size = 0
          ware.rate = 0
          ware.zwl = 0
          ware.usd = usd
          ware.rand = 0
          ware.price3 = 0
    
          ware.save()
          .then(user =>{
            
      })
    
        })
    
        }else{
          let id = vocs[0]._id
          StockV.find({name:product,warehouse:warehouse,status:'received'},function(err,nocs){
            let cases = nocs.length
            let quantity = nocs.length * 12
            quantity.toFixed(2)
          Warehouse.findByIdAndUpdate(id,{$set:{cases:cases,quantity:quantity}},function(err,tocs){
    
          })
    
              })
        }
      })
    }
        })
      }
    })
    
    
    
    })
    
    router.get('/add',function(req,res){
    
      var errorMsg = req.flash('danger')[0];
      var successMsg = req.flash('success')[0];
      res.render('kambucha/addUser',{successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg})
    
    
    
    })
    
    router.post('/add', function(req,res){
      var m = moment()
    
      var year = m.format('YYYY')
      var dateValue = m.valueOf()
    
    
    
    var date = m.format('L')
                      
                    var name = req.body.name
                
                  
                    var email = req.body.email
                    var password = req.body.password
                    var role = req.body.role
                    var username = req.body.username
                    var uid = req.body.username
                    var fullname = req.body.fullname
                    req.check('fullname','Enter Name').notEmpty();
                   
                  
                    req.check('email','Enter email').notEmpty().isEmail();
             
                    
                 
                   
                    req.check('password', 'Password do not match').isLength({min: 4}).equals(req.body.confirmPassword);
                        
                    
                          
                       
                    var errors = req.validationErrors();
                        if (errors) {
                    
                        
                          req.session.errors = errors;
                          req.session.success = false;
                          req.flash('danger', req.session.errors[0].msg);
             
              
                      res.redirect('/add');
                          
                        
                      }
                      else
                    
                     {
                        User.findOne({'email':email})
                        .then(user =>{
                            if(user){ 
                          // req.session.errors = errors
                            //req.success.user = false;
                        
                           req.session.message = {
                             type:'errors',
                             message:'user id already in use'
                           }     
                           
                           req.flash('danger', req.session.errors[0].msg);
             
              
                           res.redirect('/add');
                           
                            
                      }
                      
                                    else  {   
                   
    
                      
                      var user = new User();
                      user.fullname = fullname;
                      user.email = email;
                      user.uid = username
                      user.username = username
                      user.mobile = "null";
                      user.photo = 'propic.jpg';
                      user.date = "null";
                      user.shift = "null";
                      user.warehouse = "null";
                      user.product = "null";
                      user.lot = 0;
                      user.refNumber = "null";
                      user.location = "null";
                      user.role = role
                     
    
                      
                      
                      user.password = user.encryptPassword(password)
    
                      
                       
                  
                       
              
                      user.save()
                        .then(user =>{
                          
                    })
                  }
                  req.flash('success', 'User added Successfully');
             
              
                  res.redirect('/add');
                        })
                      }
                  
                     
                    
                        
                        
                    
                     
                      
    
                      
    })
    
    
    
    
    
    
    router.get('/addWarehouse',function(req,res){
    
      var errorMsg = req.flash('danger')[0];
      var successMsg = req.flash('success')[0];
      res.render('kambucha/addW',{successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg})
    
    
    
    })
    
    router.post('/addWarehouse', function(req,res){
      var m = moment()
    
      var year = m.format('YYYY')
      var dateValue = m.valueOf()
    
    
    
    var date = m.format('L')
                      
                    var name = req.body.name
                
                  
                    
                    req.check('name','Enter Name').notEmpty();
                   
                  
                  
                    
                          
                       
                    var errors = req.validationErrors();
                        if (errors) {
                    
                        
                          req.session.errors = errors;
                          req.session.success = false;
                          req.flash('danger', req.session.errors[0].msg);
             
              
                      res.redirect('/addWarehouse');
                          
                        
                      }
                      else
                    
                    
                               
                   
    
                      
                      var user = new Ware();
                      user.name = name;
                   
                     
    
                      
                      
                 
    
                      
                       
                  
                       
              
                      user.save()
                        .then(user =>{
                          
                        
                  
                  req.flash('success', 'User added Successfully');
             
              
                  res.redirect('/addWarehouse');
                        })
                      
                  
                     
                    
                        
                        
                    
                     
                      
    
                      
    })
    
    
    
    //////////add RM
    
    router.get('/addRM',function(req,res){
    
      var errorMsg = req.flash('danger')[0];
      var successMsg = req.flash('success')[0];
      res.render('kambucha/addRM',{successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg})
    
    
    
    })
    
    router.post('/addRM', function(req,res){
      var m = moment()
    
      var year = m.format('YYYY')
      var dateValue = m.valueOf()
    
    
    
    var date = m.format('L')
                      
                    var name = req.body.name
                
                  
                    
                    req.check('name','Enter Name').notEmpty();
                   
                  
                  
                    
                          
                       
                    var errors = req.validationErrors();
                        if (errors) {
                    
                        
                          req.session.errors = errors;
                          req.session.success = false;
                          req.flash('danger', req.session.errors[0].msg);
             
              
                      res.redirect('/addRM');
                          
                        
                      }
                      else
                    
                    
                               
                   
    
                      
                      var user = new RawMat();
                      user.item = name;
                      user.mass = 0;
                   
                     
    
                      
                      
                 
    
                      
                       
                  
                       
              
                      user.save()
                        .then(user =>{
                          
                        
                  
                  req.flash('success', 'RM added Successfully');
             
              
                  res.redirect('/addRM');
                        })
                      
                  
                     
                    
                        
                        
                    
                     
                      
    
                      
    })
    
    
    
    
    
    
    


router.post('/dashChartStockXI',isLoggedIn,function(req,res){

  

    var date = req.body.date
    var arr = []
    var id = req.user._id
    let num = req.user.num
    num++
    
   
   
    Product.find({},function(err,docs) {
     // console.log(docs,'docs')
      for(var i = 0;i<docs.length;i++){
   
   
         if(arr.length > 0 && arr.find(value => value.name == docs[i].name)){
                console.log('true')
               arr.find(value => value.name == docs[i].name).cases += docs[i].cases;
          }else{
   arr.push(docs[i])
          }
   
        
      }
     // console.log(arr,'arr')
     res.send(arr)
    })
   
   })
   
  
  
  
  
  
  
  
  
  
  
   router.post('/dashChartStockX',isLoggedIn,function(req,res){
  
    var warehouse = req.body.warehouse
  console.log(warehouse,'warehouse')
   var date = req.body.date
   var arr = []
   var id = req.user._id
   let num = req.user.num
   num++
   
  
  
   Warehouse.find({warehouse:warehouse},function(err,docs) {
    // console.log(docs,'docs')
     for(var i = 0;i<docs.length;i++){
    let product = docs[i].product
    console.log(docs,'docs')
  
        if(arr.length > 0 && arr.find(value => value.warehouse == docs[i].warehouse  && value.product == docs[i].product )){
               console.log('true')
              arr.find(value => value.product == docs[i].product).cases += docs[i].cases;
         }else{
  arr.push(docs[i])
         }
  
       
     }
    console.log(arr,'arr')
    res.send(arr)
   })
  
  })
  
  
  
  router.post('/dashChartStockSub',isLoggedIn,function(req,res){
  
    
    var warehouse = req.body.warehouse
  console.log(warehouse,'warehouse')
   var date = req.body.date
   var arr = []
   var id = req.user._id
   let num = req.user.num
   num++
   
  
  
   Warehouse.find({warehouse:warehouse},function(err,docs) {
    // console.log(docs,'docs')
     for(var i = 0;i<docs.length;i++){
    let product = docs[i].product
    console.log(docs,'docs')
  
        if(arr.length > 0 && arr.find(value => value.warehouse == docs[i].warehouse  && value.product == docs[i].product )){
               console.log('true')
              arr.find(value => value.product == docs[i].product).cases += docs[i].cases;
         }else{
  arr.push(docs[i])
         }
  
       
     }
    console.log(arr,'arr')
    res.send(arr)
   })
  
  
  })
  
  
  
  router.post('/dashChartStockSales',isLoggedIn,function(req,res){
  
    
    var product = req.body.product
  //console.log(warehouse,'warehouse')
   var date = req.body.date
   var arr = []
   var id = req.user._id
   let num = req.user.num
   num++
   
  
  
   SaleStock.find({product:product},function(err,docs) {
    // console.log(docs,'docs')
     for(var i = 0;i<docs.length;i++){
    let product = docs[i].product
    console.log(docs,'docs')
  
        if(arr.length > 0 && arr.find(value => value.salesPerson == docs[i].salesPerson  && value.product == docs[i].product )){
               console.log('true')
              arr.find(value => value.product == docs[i].product).holdingCases.toFixed(2) += docs[i].holdingCases.toFixed(2);
         }else{
  arr.push(docs[i])
         }
  
       
     }
    console.log(arr,'arr')
    res.send(arr)
   })
  
  
  })
  
  
  
  
  
  router.post('/dashChartStockRtns',isLoggedIn,function(req,res){
  
    
    var product = req.body.product
  //console.log(warehouse,'warehouse')
   var date = req.body.date
   var arr = []
   var id = req.user._id
   let num = req.user.num
   num++
   
  
  console.log(product,'proRtns')
   RtnsSubBatch.find({item:product},function(err,docs) {
    // console.log(docs,'docs')
     for(var i = 0;i<docs.length;i++){
    let product = docs[i].item
    console.log(docs,'docs')
  
        if(arr.length > 0 && arr.find(value => value.item == docs[i].item )){
               console.log('true')
              arr.find(value => value.item == docs[i].item).qty += docs[i].qty;
         }else{
  arr.push(docs[i])
         }
  
       
     }
    console.log(arr,'arr')
    res.send(arr)
   })
  
  
  })
  
  
  
  
  
  
  
  router.post('/dashChartStockWRtns',isLoggedIn,function(req,res){
  
    var reason = req.body.reason
  
   var arr = []
   var id = req.user._id
   let num = req.user.num
   num++
   
  
  
   StockV.find({status:reason},function(err,docs) {
    // console.log(docs,'docs')
     for(var i = 0;i<docs.length;i++){
   
    console.log(docs,'docsWR')
  
        if(arr.length > 0 && arr.find(value => value.name == docs[i].name  )){
               console.log('true')
    arr.find(value => value.name == docs[i].name).casesReceived
    += docs[i].casesReceived
    ;
         }else{
  arr.push(docs[i])
         }
  
       
     }
    console.log(arr,'arrWR')
    res.send(arr)
   })
  
  })
  
  
  
  
  router.get('/warehouseStock',isLoggedIn,function(req,res){
    var pro = req.user
    //res.render('admin/dash6',{pro:pro})
    Product.find({},function(err,docs){
   Warehouse.find({},function(err,hocs){
    res.render('kambucha/dash7',{pro:pro,arr:docs,arr1:hocs})
  })
    })
  })
  
  
  
  
  
  
  
  router.get('/importSales',isLoggedIn,function(req,res){
    var pro = req.user
    var errorMsg = req.flash('danger')[0];
    var successMsg = req.flash('success')[0];
    res.render('imports/sales',{pro:pro,successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg})
  })
  
  
  
  
  
  
  router.post('/importSales',isLoggedIn,uploadX.single('file'),  (req,res)=>{
   
   
  
  /*  if(!req.file){
        req.session.message = {
          type:'errors',
          message:'Select File!'
        }     
          res.render('imports/students', {message:req.session.message,pro:pro}) */
     if (!req.file || req.file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
            req.session.message = {
                type:'errors',
                message:'Upload Excel File'
              }     
                res.render('imports/sales', {message:req.session.message,pro:pro
                     
                 }) 
  
  
  
        }
          
        else{
     
  
        
           const file = req.file.filename;
    
            
                var wb =  xlsx.readFile('./public/uploads/' + file)
  
             
         
                 var sheets = wb.Sheets;
                 var sheetNames = wb.SheetNames;
     
                 var sheetName = wb.SheetNames[0];
     var sheet = wb.Sheets[sheetName ];
     
        for (var i = 0; i < wb.SheetNames.length; ++i) {
         var sheet = wb.Sheets[wb.SheetNames[i]];
     
         console.log(wb.SheetNames.length)
         var data =xlsx.utils.sheet_to_json(sheet)
             
         var newData = data.map(function (record){
     
        
       
      
          
         
        
           
            let salesPerson = record.salesPerson
            let driver = record.driver;
           
  
  req.body.salesPerson = record.salesPerson 
  req.body.driver = record.driver
  
  
  //req.body.photo = record.photo          
  
            
        
            
              req.check('salesPerson','Enter SalesPerson').notEmpty();
              //req.check('name','Enter Name').notEmpty();
          
              
              var errors = req.validationErrors();
  
              if (errors) {
                
                req.session.errors = errors;
                req.session.success = false;
                req.flash('danger', req.session.errors[0].msg);
       
        
                res.redirect('/importSales');
              
          }
  else
  
  
  {
  SalesList.findOne({'salesPerson':salesPerson})
  .then(user =>{
      if(user){ 
    // req.session.errors = errors
      //req.success.user = false;
  
  
  
      req.flash('danger', 'Item already in the system');
  
      res.redirect('/importSales')
  }
  else{
  
  
  
  
          
  var product = new SalesList();
  product.salesPerson = salesPerson;
  product.driver = driver;
  
  product.save()
    .then(user =>{
  
  
    })
  
  }
  
  })
  
  
  
  
  }     
                 
                     
   
                    // .catch(err => console.log(err))
             
                 
                    })
                  
                    req.flash('success', 'File Successfully!');
  
                    res.redirect('/importSales')  
         
                  }
                  
                  
                    
                    
        
                   
        
                    
             
                }
      
        
  
  
  })
  
  
  
  
  
  
  
  
  
  
  
  
  
  router.get('/importTrucks',function(req,res){
    var pro = req.user
    res.render('imports/trucks',{pro:pro})
  })
  
  
  
  router.post('/importTrucks', uploadX.single('file'),  (req,res)=>{
   
    if (!req.file || req.file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
      req.session.message = {
          type:'errors',
          message:'Upload Excel File'
        }     
          res.render('imports/trucks', {message:req.session.message,pro:pro
               
           }) 
  
  
  
  }
    
  else{
  
  
  
     const file = req.file.filename;
  
      
          var wb =  xlsx.readFile('./public/uploads/' + file)
  
       
   
           var sheets = wb.Sheets;
           var sheetNames = wb.SheetNames;
  
           var sheetName = wb.SheetNames[0];
  var sheet = wb.Sheets[sheetName ];
  
  for (var i = 0; i < wb.SheetNames.length; ++i) {
   var sheet = wb.Sheets[wb.SheetNames[i]];
  
   console.log(wb.SheetNames.length)
   var data =xlsx.utils.sheet_to_json(sheet)
       
   var newData = data.map(function (record){
  
  
  
  
    
   
  
     
      let truckNo = record.truckNo
      let driver = record.driver;
      let make = record.make;
      let weight = record.weight
  
  req.body.truckNo = record.truckNo
  req.body.driver = record.driver
  req.body.make = record.make
  req.body.weight = record.weight
  
  
  //req.body.photo = record.photo          
  
      
  
      
        req.check('truckNo','Enter Truck No').notEmpty();
        //req.check('name','Enter Name').notEmpty();
    
        
        var errors = req.validationErrors();
  
        if (errors) {
          
          req.session.errors = errors;
          req.session.success = false;
          req.flash('danger', req.session.errors[0].msg);
  
  
          res.redirect('/importTrucks');
        
    }
  else
  
  
  {
  Truck.findOne({'truckNo':truckNo})
  .then(user =>{
  if(user){ 
  // req.session.errors = errors
  //req.success.user = false;
  
  
  
  req.flash('danger', 'Item already in the system');
  
  res.redirect('/importTrucks')
  }
  else{
  
  
  
  
    
  var product = new Truck();
  product.truckNo = truckNo;
  product.driver = driver;
  product.make = make;
  product.weight = weight;
  
  product.save()
  .then(user =>{
  
  
  })
  
  }
  
  })
  
  
  
  
  }     
           
               
  
              // .catch(err => console.log(err))
       
           
              })
            
              req.flash('success', 'File Successfully!');
  
              res.redirect('/importTrucks')  
   
            }
            
            
              
              
  
             
  
              
       
          }
  
  
  })
  
  

  

router.get('/addRefNum',function(req,res){
  
    res.render('kambucha/invoNum')
  })
  
  router.post('/addRefNum',function(req,res){
  
    var refNumber = req.body.refNumber;
    //var idNumber = req.body.idNumber;
    
   
        req.check('refNumber','Enter Ref Number').notEmpty().isNumeric();
        //req.check('idNumber','Enter ID Number').notEmpty().isNumeric();
  
      
        
        var errors = req.validationErrors();
             
        if (errors) {
        
          req.session.errors = errors;
          req.session.success = false;
          res.render('kambucha/invoNum',{ errors:req.session.errors,})
        
      }
      else{
        
        RefNoSeq.findOne({'num':refNumber})
          .then(dept =>{
              if(dept){ 
    
             req.session.message = {
              type:'errors',
               message:'Number already exists'
             }     
                res.render('kambucha/invoNum', {
                   message:req.session.message ,
                })
              }else{
  
            
      
        var num = new RefNoSeq();
      
        num.num = refNumber;
       
       
     
      
      
        num.save()
          .then(dep =>{
           
            req.session.message = {
              type:'success',
              message:'Number added'
            }  
            res.render('kambucha/invoNum',{message:req.session.message,});
        
      
        })
      
       }
        
        
        })
      }
      
      
  })
  
  
  
  
  
  
  
  
  router.get('/addRefNum2',function(req,res){
    
    res.render('kambucha/invoNum2')
  })
  
  router.post('/addRefNum2',function(req,res){
  
    var refNumber = req.body.refNumber;
    //var idNumber = req.body.idNumber;
    
   
        req.check('refNumber','Enter Ref Number').notEmpty().isNumeric();
        //req.check('idNumber','Enter ID Number').notEmpty().isNumeric();
  
      
        
        var errors = req.validationErrors();
             
        if (errors) {
        
          req.session.errors = errors;
          req.session.success = false;
          res.render('kambucha/invoNum2',{ errors:req.session.errors,})
        
      }
      else{
        
        RefNoSeqDisp.findOne({'num':refNumber})
          .then(dept =>{
              if(dept){ 
    
             req.session.message = {
              type:'errors',
               message:'Number already exists'
             }     
                res.render('kambucha/invoNum2', {
                   message:req.session.message ,
                })
              }else{
  
            
      
        var num = new RefNoSeqDisp();
      
        num.num = refNumber;
       
       
     
      
      
        num.save()
          .then(dep =>{
           
            req.session.message = {
              type:'success',
              message:'Number added'
            }  
            res.render('kambucha/invoNum2',{message:req.session.message,});
        
      
        })
      
       }
        
        
        })
      }
      
      
  })
  
  
  
  
  
router.get('/newItem2',function(req,res){
    res.render('kambucha/newItem')
  })


  
router.get('/newItem',function(req,res){

  var errorMsg = req.flash('danger')[0];
  var successMsg = req.flash('success')[0];
  res.render('kambucha/newItem2',{successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg})


})

  

  router.post('/newItem',upload.single('file'), function(req,res){
  var goods = req.body.goods
  var service = req.body.service
  var name = req.body.name
  //var barcodeNumber = req.body.barcodeNumber
  var upc = req.body.upc
  var usd = req.body.usd
  var category = req.body.category
  var description = req.body.description
  

console.log(goods,service,name,upc,usd,req.file.filename,'var')
 
    var m = moment()
    var year = m.format('YYYY')
    var dateValue = m.valueOf()
    if (!req.file){
      req.flash('danger', 'Select Picture');

      res.redirect('/newItem');



  }
  
      var date = m.format('L')
      req.check('name','Enter Product Name').notEmpty();
      req.check('upc','Enter UPC').notEmpty();
    
      var errors = req.validationErrors();
     
      if (errors) {
    
        req.session.errors = errors;
        req.session.success = false;
        //res.render('hurlings/students/admit',{ errors:req.session.errors, arr1:arr1,pro:pro})

        req.flash('danger', req.session.errors[0].msg);
     
      
        res.redirect('/newItem');

      
    }
    else
  
   {
      Product.findOne({'name':name})
      .then(user =>{
          if(user){ 
        // req.session.errors = errors
          //req.success.user = false;
            
    req.flash('danger', 'Product already exists');

    res.redirect('/newItem');
    }
    
    
      
      else{
  
      var book = new Product();
      book.name = name
      book.barcodeNumber= upc
      book.category = 'drinks'
      book.subCategory = category
      book.quantity = 0
      book.openingQuantity = 0
      book.rcvdQuantity = 0
      book.unitCases = 12
      book.description= description
      book.photo = req.file.filename
      book.type='goods'
      book.account = 'sales'
      book.cases =0
      book.size = 0
      book.rate = 0
      book.zwl = 0
      book.usd = usd
      book.rand = 0
      book.price3 = 0
  
          
           
            book.save()
              .then(pro =>{
    
             
                req.flash('success', 'Product Added Successfully');
   
                res.redirect('/newItem');
             
              
            
            })
          }
          

        })
      
        }
    
    //res.redirect('/newItem')

    
    })
  


    router.get('/customer',function(req,res){

    
        var errorMsg = req.flash('danger')[0];
        var successMsg = req.flash('success')[0];
        res.render('kambucha/addCustomer',{successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg})
      
        })
      
      
        router.post('/customer', function(req,res){
          var salutation= req.body.salutation
          var firstName = req.body.firstName
          var lastName = req.body.lastName
          //var barcodeNumber = req.body.barcodeNumber
          var companyName = req.body.companyName
          var email = req.body.email
          var mobile = req.body.mobile
          var mobile2 = req.body.mobile2
          var address = req.body.address
          var town = req.body.town
          var city = req.body.city
          var country = req.body.country
      
          
        
      
         
            var m = moment()
            var year = m.format('YYYY')
            var dateValue = m.valueOf()
            /*if (!req.file){
              req.flash('danger', 'Select Picture');
        
              res.redirect('/newItem');
        
        
        
          }*/
          
              var date = m.format('L')
              req.check('firstName','Enter FirstName').notEmpty();
              req.check('lastName','Enter LastName ').notEmpty();
              req.check('companyName','Enter Company ').notEmpty();
              req.check('email','Enter Email ').notEmpty();
              req.check('mobile','Enter Work Phone ').notEmpty();
              req.check('mobile2','Enter Mobile Phone ').notEmpty();
              req.check('address','Enter Address').notEmpty();
              req.check('town','Enter Town ').notEmpty();
              req.check('city','Enter City').notEmpty();
              req.check('country','Enter Country').notEmpty();
             
              var errors = req.validationErrors();
             
              if (errors) {
            
                req.session.errors = errors;
                req.session.success = false;
                //res.render('hurlings/students/admit',{ errors:req.session.errors, arr1:arr1,pro:pro})
        
                req.flash('danger', req.session.errors[0].msg);
             
              
                res.redirect('/customer');
        
              
            }
            else
          
           {
              Customer.findOne({'email':email})
              .then(user =>{
                  if(user){ 
                // req.session.errors = errors
                  //req.success.user = false;
                    
            req.flash('danger', 'Customer already exists');
        
            res.redirect('/customer');
            }
            
            
              
              else{
          
              var book = new Customer();
              book.salutation = salutation
              book.firstName= firstName
              book.lastName = lastName
              book.companyName = companyName
              book.email = email
              book.mobile = mobile
              book.mobile2 = mobile2
              book.address = address
              book.town= town
              book.city = city
              book.country=country
            
                  
                   
                    book.save()
                      .then(pro =>{
            
                     
                        req.flash('success', 'Cutomer Added Successfully');
           
                        res.redirect('/customer');
                     
                      
                    
                    })
                  }
                  
        
                })
              
                }
            
            //res.redirect('/newItem')
        
            
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
            