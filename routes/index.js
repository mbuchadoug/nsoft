var express = require('express');
var router = express.Router();
var User = require('../models/user');
var RefNo = require('../models/refNo');
var StockV = require('../models/stockV');
var Product = require('../models/product');
const keys = require('../config1/keys')
const stripe = require('stripe')('sk_test_IbxDt5lsOreFtqzmDUFocXIp0051Hd5Jol');
var xlsx = require('xlsx')
var multer = require('multer')
const fs = require('fs')
var path = require('path');
var passport = require('passport');
var moment = require('moment')
var mongoose = require('mongoose')
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const jwt = require('jsonwebtoken');
const JWT_KEY = "jwtactive987";
const JWT_RESET_KEY = "jwtreset987";
var bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');

const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');

const arr = {}
const arr2 = {}
const arrE ={}
const arrE2 ={}


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




//login route
router.get('/', function (req, res, next) {
  var messages = req.flash('error');
  
  res.render('kambucha/login', { messages: messages, hasErrors: messages.length > 0});
});
router.post('/', passport.authenticate('local.signin', {
  failureRedirect: '/',
  failureFlash: true
}), function (req, res, next) {
  if(req.user.role == "receiver"){
    res.redirect("/batch");
  }

  
});








router.get("/logout",(req,res)=>{
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});






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
  
    router.get('/receiveStock2',isLoggedIn,function(req,res){
      var date = req.user.date
      var shift = req.user.shift
      var warehouse = req.user.warehouse
      var product = req.user.product
      var refNumber = req.user.refNumber
      Product.find(function(err,docs){
       res.render('kambucha/addStock2',{listX:docs,date:date,shift:shift,
      product:product,refNumber:refNumber,warehouse:warehouse})
      })
    
     })


  router.get('/receiveStock',isLoggedIn,function(req,res){
   Product.find(function(err,docs){
    res.render('kambucha/addStock',{listX:docs})
   })
 
  })
  


  router.post('/receiveStock',isLoggedIn, function(req,res){
    console.log('receive Stock2')
    var date2 = req.body.date
    var refNo = req.user.refNumber
    var product = req.body.product;
    var m = moment(date2)
    var receiver = 'Tidings'
    var year = m.format('YYYY')
    var dateValue = m.valueOf()
    var date = m.toString()
    var numDate = m.valueOf()
  var month = m.format('MMMM')
  var shift = req.body.shift
  var casesReceived = req.body.casesReceived
  var availableCases = req.body.availableCases
  var warehouse = req.body.warehouse
 
  var mformat = m.format("L")
    //var receiver = req.user.fullname
  
  console.log(product,shift,casesReceived,availableCases,warehouse,'out')
  
 
  
    req.check('warehouse','Enter Warehouse').notEmpty();
    req.check('product','Enter Product Name').notEmpty();
    req.check('casesReceived','Enter Cases Received').notEmpty();
    req.check('availableCases','Enter Available Cases').notEmpty();
    
   
    
  
    
    
    var errors = req.validationErrors();
     
    if (errors) {
  
      req.session.errors = errors;
      req.session.success = false;
     // res.render('product/stock',{ errors:req.session.errors,pro:pro})
     req.flash('success', req.session.errors[0].msg);
         
          
     res.redirect('/receiveStock');
    
    }
    else
  
   {
  
    Product.findOne({'name':product})
    .then(hoc=>{
  
      if(hoc){
    var book = new StockV();

    let unitCases = hoc.unitCases
    let usd= hoc.usd
    let zwl = hoc.zwl
    let rand = hoc.rand
    let rate = hoc.rate
  
    let category = hoc.category
    let subCategory = hoc.subCategory
    book.name = product
    book.mformat = mformat
    //book.code =  code
    book.warehouse = warehouse
    book.status = 'saved'
    book.cases = 0
    book.casesReceived = casesReceived
    book.availableCases = availableCases
    book.shift = shift
    book.year = year
    book.month = month
    book.receiver = receiver
    book.dateValue = dateValue
    book.unitCases = unitCases
    book.zwl = zwl
    book.usd = usd
    book.rand = rand
    book.rate = rate
    book.category = category
    book.subCategory = subCategory
    book.refNo = refNo
  
        
         
          book.save()
            .then(pro =>{
  let stock = pro.casesReceived + pro.availableCases

  StockV.findByIdAndUpdate(pro._id,{$set:{cases:stock}},function(err,vocs){

  })

              Product.find({'name':product},function(err,docs){
                let id = docs[0]._id
                console.log(id,'id')
                let nqty, nqty2
                 let rcvdQty = pro.casesReceived
                 let openingQuantity = docs[0].cases
                //nqty = pro.quantity + docs[0].quantity
                nqty = pro.casesReceived + docs[0].cases
                nqty2 = nqty * docs[0].unitCases
                console.log(nqty,'nqty')
                Product.findByIdAndUpdate(id,{$set:{cases:nqty,openingQuantity:openingQuantity, rcvdQuantity:rcvdQty,quantity:nqty2}},function(err,nocs){
   
                })
   
                
   
               })


              
              StockV.find({mformat:mformat},(err, ocs) => {
                let size = ocs.length - 1
                console.log(ocs[size],'fff')
                res.send(ocs[size])
                        })
          })
         
        
        }
      }) 
  
        }
  })



  

  router.post('/addStock3',isLoggedIn, (req, res) => {
    var pro = req.user
    var m = moment()
    var mformat = m.format("L")
    
    StockV.find({mformat:mfromat},(err, docs) => {
   
      res.send(docs)
              })

    }); 




    router.post('/receiveScan',isLoggedIn, function(req,res){
      console.log('receive scan')
      var date2 = req.user.date
      var product = req.user.product;
      var m = moment(date2)
      var receiver = 'Tidings'
      var year = m.format('YYYY')
      var dateValue = m.valueOf()
      var date = m.toString()
      var numDate = m.valueOf()
      var barcodeNumber = req.body.code
    var month = m.format('MMMM')
    var shift = req.user.shift
    var casesReceived = 1
    var lot = req.user.lot
    var refNumber = req.user.refNumber
    var location = req.user.location
    var warehouse = req.user.warehouse
   var arr = []
    var mformat = m.format("L")
      //var receiver = req.user.fullname
    
    console.log(product,shift,casesReceived,warehouse,'out')
    
   
    
    
      Product.findOne({'name':product})
      .then(hoc=>{
    

        StockV.findOne({'barcodeNumber':barcodeNumber})
        .then(doc=>{
          console.log(doc,'doc',hoc,'hoc')

        if( doc == null){
      var book = new StockV();
  
      let unitCases = hoc.unitCases
      let usd= hoc.usd
      let zwl = hoc.zwl
      let rand = hoc.rand
      let rate = hoc.rate
    
      let category = hoc.category
      let subCategory = hoc.subCategory
      book.name = product
      book.mformat = mformat
      //book.code =  code
      book.warehouse = warehouse
      book.barcodeNumber = barcodeNumber
      book.status = 'saved'
      book.cases = 0
      book.casesReceived = casesReceived
      book.availableCases = hoc.cases
      book.shift = shift
      book.year = year
      book.month = month
      book.receiver = receiver
      book.dateValue = dateValue
      book.unitCases = unitCases
      book.zwl = zwl
      book.usd = usd
      book.rand = rand
      book.rate = rate
      book.category = category
      book.subCategory = subCategory
      book.location = location
      book.refNumber = refNumber
      book.lot = lot
    
          
           
            book.save()
              .then(pro =>{
    let stock = pro.casesReceived + pro.availableCases
  
    StockV.findByIdAndUpdate(pro._id,{$set:{cases:stock}},function(err,vocs){
  
    })
  
                Product.find({'name':product},function(err,docs){
                  let id = docs[0]._id
                  console.log(id,'id')
                  let nqty, nqty2
                   let rcvdQty = pro.casesReceived
                   let openingQuantity = docs[0].cases
                  //nqty = pro.quantity + docs[0].quantity
                  nqty = pro.casesReceived + docs[0].cases
                  nqty2 = nqty * docs[0].unitCases
                  console.log(nqty,'nqty')
                  Product.findByIdAndUpdate(id,{$set:{cases:nqty,openingQuantity:openingQuantity, rcvdQuantity:rcvdQty,quantity:nqty2}},function(err,nocs){
     
                  })
     
                  
     
                 })
  
  
                
                StockV.find({mformat:mformat},(err, ocs) => {
                  let size = ocs.length - 1
                  console.log(ocs[size],'fff')
                  res.send(ocs[size])
                          })
            })
           
          
          }else{

console.log(arr,'doc7')
            res.send(arr)
          }
        })
        }) 
    
          
    })
  
  
  
    



  router.get('/saveBatch/:id',isLoggedIn, function(req,res){
    var pro = req.user
   var receiver = req.user.fullname
   var code = req.params.id
   var uid = req.user._id
  
  var m2 = moment()
  var wformat = m2.format('L')
  var year = m2.format('YYYY')
  var dateValue = m2.valueOf()
  var date = m2.toString()
  var numDate = m2.valueOf()
  var month = m2.format('MMMM')
  
  
  //var mformat = m.format("L")
  
  
  
  StockV.find({code:code,status:'null'},function(err,locs){
  
  for(var i=0;i<locs.length;i++){
  let barcodeNumber = locs[i].barcodeNumber
  let cases = locs[i].cases
  let quantity = locs[i].cases * locs[i].unitCases
  let date3 = locs[i].mformat
  let m = moment(date3)
  let year = m.format('YYYY')
  let dateValue = m.valueOf()
  let date = m.toString()
  let numDate = m.valueOf()
  let month = m.format('MMMM')
  let idN = locs[i]._id
  
  
    StockV.findByIdAndUpdate(idN,{$set:{status:'saved'}},function(err,pocs){
  
    })
    
  
    
  
    Product.findOne({'barcodeNumber':barcodeNumber})
    .then(hoc=>{
  
      if(hoc){
    var book = new Stock();
    book.barcodeNumber = hoc.barcodeNumber
    book.category = hoc.category
    book.subCategory = hoc.subCategory
    book.name = hoc.name
    book.mformat = date3
    book.month = month
    book.year = year 
    book.stockUpdate = 'no'
    book.receiver = receiver;
    book.date  = date
    book.dateValue = dateValue
    book.quantity = 0
    book.unitCases = hoc.unitCases
    book.cases = cases
    book.rate = 0
    book.zwl = 0
    book.price = 0
        
         
          book.save()
            .then(pro =>{
  
              Product.find({barcodeNumber:barcodeNumber},function(err,docs){
               let id = docs[0]._id
                let rcvdQty = pro.cases
                let openingQuantity = docs[0].cases
               //nqty = pro.quantity + docs[0].quantity
               nqty = pro.cases + docs[0].cases
               nqty2 = nqty * docs[0].unitCases
               console.log(nqty,'nqty')
               Product.findByIdAndUpdate(id,{$set:{cases:nqty,openingQuantity:openingQuantity, rcvdQuantity:rcvdQty,quantity:nqty2}},function(err,nocs){
  
               })
  
               
  
              })
  
  console.log(i,'ccc')
                 /*  req.session.message = {
                type:'success',
                message:'Product added'
              }  
              res.render('product/stock',{message:req.session.message,pro:pro});*/
            
          
          })
  
         /* req.flash('success', 'Stock Received Successfully');
          res.redirect('/rec/addStock')*/
        }  /* else{
          req.flash('danger', 'Product Does Not Exist');
        
          res.redirect('/rec/addStock');
        }*/
      }) 
  
       
  }
  
  User.find({role:'admin'},function(err,ocs){
    
    for(var i = 0; i<ocs.length;i++){
    
  
  
  let id = ocs[i]._id
  var not = new Note();
  not.role = 'receiver'
  not.subject = 'Stock Received';
  not.message = code+" "+'Truck Code'+" "+"received"+" "+'on'+" "+wformat
  not.status = 'not viewed';
  not.link = 'http://'+req.headers.host+'/viewStockRcvd/'+code;
  not.status1 = 'new';
  not.user = receiver;
  not.type = 'receiving'
  not.status2 = 'new'
  not.status3 = 'new'
  not.status4 = 'null'
  not.date = m2
  not.dateViewed = 'null'
  not.recId = ocs[i]._id
  not.recRole = 'admin'
  not.senderPhoto = req.user.photo
  not.numDate = numDate
  not.customer = 'null'
  not.shop = 'null'
  
  
   
  
  not.save()
    .then(user =>{
  User.findByIdAndUpdate(uid,{$set:{truckCode:'null'}},function(err,doc){
  
  })
  })
  
  }
  })
  
  
  req.flash('success', 'Stock Received Successfully');
  res.redirect('/rec/stockBatch')
  }) 
  })
  




  router.get('/dispatchStock',function(req,res){
    res.render('kambucha/dispatch')
  })
  
  router.get('/customer',function(req,res){
    res.render('kambucha/addCustomer')
  })
  
  router.get('/quote',function(req,res){
    res.render('kambucha/addQuote')
  })
  
  router.get('/priceList',function(req,res){
    res.render('kambucha/priceList')
  })
  
  router.get('/viewItem',function(req,res){
    res.render('kambucha/viewItem')
  })
  
  router.get('/item',function(req,res){
    res.render('kambucha/items')
  })
  
  router.get('/item2',function(req,res){
    res.render('kambucha/item2')
  })


  router.get('/summary',function(req,res){
    res.render('kambucha/stockSummary')
  })

  router.get('/barcode',function(req,res){
    res.render('kambucha/addStockBarc')
  })

  router.get('/batch',isLoggedIn,function(req,res){
    res.render('kambucha/batch')
  })

  router.post('/batch',isLoggedIn,function(req,res){

    //var refNumber = req.body.referenceNumber
    var date = req.body.date
    var shift = req.body.shift
    var warehouse = req.body.warehouse
    var product = req.body.product
   // var lotNumber = req.body.lotNumber
    //var location = req.body.location
  
    let date6 =  moment(date).format('l');
  let code
  //let shift = req.user.shift
   let date7 =  date6.replace(/\//g, "");
  
    console.log(date6,'date')
  
  
    if( shift == 'day'){
      code = "S1"
    }else{
      code = "S2"
    }
  
    RefNo.find({date:date},function(err,docs){
      let size = docs.length + 1
      let refNo = date7+code+'B'+size
      console.log(refNo,'refNo')



      var id = req.user._id
      User.findByIdAndUpdate(id,{$set:{date:date, shift:shift, warehouse:warehouse,
      product:product,refNumber:refNo  }},function(err,docs){
  
      })



      var book = new RefNo();
    book.refNumber = refNo
    book.date = date
    book.save()
    .then(pro =>{

      console.log('success')

    })
    
  
    })
  
    



    


    res.redirect('/receiveStock2')
  })



 

  router.post('/verifyScan',function(req,res){
  
    var barcodeNumber = req.body.code
     Product.find({barcodeNumber:barcodeNumber},function(err,docs){
    if(docs == undefined){
      res.redirect('/verify')
    }else
    console.log(docs,'docs')
   
       res.send(docs[0])
     })
   })






   router.get('/autocompleteProduct/',function(req, res, next) {

   
    var regex= new RegExp(req.query["term"],'i');
   
    var uidFilter =Product.find({name:regex},{'name':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
  
    
    uidFilter.exec(function(err,data){
   
  
  console.log('data',data)
  
  var result=[];
  
  if(!err){
     if(data && data.length && data.length>0){
       data.forEach(sub=>{
  
        
     
  
          
         let obj={
           id:sub._id,
           label: sub.name,
  
       
         /*  name:name,
           surname:surname,
           batch:batch*/
          
          
       
         
          
  
           
         };
        
         result.push(obj);
         console.log('object',obj.id)
       });
  
     }
   
     res.jsonp(result);
     console.log('Result',result)
    }
  
  })
  
  });
  
  // role admin
  //this routes autopopulates teachers info from the id selected from automplet1
  router.post('/autoProduct',function(req,res){
    var code = req.body.code
  
  
    Product.find({name:code},function(err,docs){
   if(docs == undefined){
     res.redirect('/dash')
   }else
  
      res.send(docs[0])
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

  router.get('/eodRepo/',isLoggedIn,function(req,res){
    //var code = req.user.invoNumber
    //var code = "Tiana Madzima"
    let date  = req.user.date
  var id = req.params.id
  RefNo.find({date:date},function(err,docs){
   for(var i = 0;i<docs.length;i++){
let refNumber = docs[i].refNumber
    arrRefs[refNumber]=[]
   }   
    res.redirect('/arrRefsProcess/')
  })
    })
  
  

  

    router.get('/arrRefsProcess',isLoggedIn,function(req,res){
      console.log(arrRefs,'arrRefs')
        //var code = "Tiana Madzima"
    
        var code = req.params.id
        
        console.log(code,'code')
        //console.log(docs[i].uid,'ccc')
        
        //let uid = "SZ125"
        
        
        //TestX.find({year:year,uid:uid},function(err,vocs) {
        InvoiceFile.find({studentId:code}).lean().sort({dateValue:1}).then(vocs=>{
        console.log(vocs.length,'vocs')
        
        for(var x = 0;x<vocs.length;x++){
        let size = vocs.length - 1
        let studentBalance = vocs[size].studentBalance
        let studentName = vocs[x].studentName
        if( arrStatement[code].length > 0 && arrStatement[code].find(value => value.studentId == code) ){
          arrStatement[code].find(value => value.studentId == code).typeBalance = studentBalance;
          arrStatement[code].push(vocs[x])
        
            }
            
             
            
            
            else{
              arrStatement[code].push(vocs[x])
              arrStatement[code].find(value => value.studentId == code).typeBalance = studentBalance;
              } 
        
        
         
        
             
        
        }  
            })
            
            res.redirect('/clerk/statementGen/'+code)
          
        
        /*})*/
        
        })
        
    

function encryptPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);  
  };
  
    module.exports = router;
  
    function isLoggedIn(req, res, next) {
      if (req.isAuthenticated()) {
          return next();
      }
      else{
          res.redirect('/')
      }
    }
    