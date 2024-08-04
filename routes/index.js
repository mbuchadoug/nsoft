var express = require('express');
var router = express.Router();
var User = require('../models/user');
var BatchR = require('../models/batchR');
var BatchD = require('../models/batchD');
var RefNo = require('../models/refNo');
var RepoFiles = require('../models/repoFiles');
var StockV = require('../models/stockV');
var StockD = require('../models/stockD');
var Product = require('../models/product');
const keys = require('../config1/keys')
const stripe = require('stripe')('sk_test_IbxDt5lsOreFtqzmDUFocXIp0051Hd5Jol');
var xlsx = require('xlsx')
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
  }else if(req.user.role == "dispatcher"){
    res.redirect('/batchDispatcher')
  }


  
});








router.get("/logout",(req,res)=>{
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});



router.get('/info',function(req,res){
  res.render('kambucha/setup')
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
  
/*    router.get('/receiveStock',isLoggedIn,function(req,res){
      var date = req.user.date
      var shift = req.user.shift
      var warehouse = req.user.warehouse
      var product = req.user.product
      var refNumber = req.user.refNumber
      var pro = req.user
      Product.find(function(err,docs){
       res.render('kambucha/addStock2',{listX:docs,date:date,shift:shift,
      product:product,refNumber:refNumber,warehouse:warehouse,pro:pro})
      })
    
     })*/


  


  router.post('/receiveStock',isLoggedIn, function(req,res){
    console.log('receive Stock2')
    var date4 = req.body.date
    console.log(date4,'date4')
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
    book.date = date4
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
    var pro = req.user
    res.render('kambucha/batch',{pro:pro})
  })



  router.post('/batch',isLoggedIn,function(req,res){

    //var refNumber = req.body.referenceNumber
    var date = req.body.date
    var shift = req.body.shift
    var warehouse = req.body.warehouse
    var product = req.body.product
    let refNo
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
     refNo = date7+code+'B'+size+'R'
      console.log(refNo,'refNo')

      var truck = new BatchR()
      truck.date = date
      truck.shift = shift
      truck.warehouse = warehouse
      truck.product = product
      truck.refNumber = refNo
      truck.cases = 0
      truck.receiver = req.user.fullname
     

      truck.save()
          .then(pro =>{



      var id = req.user._id
      User.findByIdAndUpdate(id,{$set:{date:date, shift:shift, warehouse:warehouse,
      product:product,refNumber:refNo,batchId:pro._id  }},function(err,docs){
  
      })



      var book = new RefNo();
    book.refNumber = refNo
    book.date = date
    book.type = 'receiving'
    book.save()
    .then(pro =>{

      console.log('success')
      res.redirect('/receiveStock/'+refNo)

    })
  })
  
    })
  
    



    


    
  })




  router.get('/receiveStock/:id',isLoggedIn,function(req,res){
    var date = req.user.date
    var shift = req.user.shift
    var warehouse = req.user.warehouse
    var product = req.user.product
    var refNumber = req.user.refNumber
    var pro = req.user
    var id = req.params.id
    Product.find(function(err,docs){
     res.render('kambucha/addStock2',{listX:docs,date:date,shift:shift,
    product:product,refNumber:refNumber,warehouse:warehouse,pro:pro,id:id})
    })
  
   })




   

  router.post('/addStock3',isLoggedIn, (req, res) => {
    var pro = req.user
    var m = moment()
    var code = req.user.refNumber
    var mformat = m.format("L")
    
    StockV.find({refNumber:code},(err, docs) => {
   
      res.send(docs)
              })

    }); 




    router.post('/receiveScan',isLoggedIn, function(req,res){
      console.log('receive scan')
      var date2 = req.user.date
      var product = req.user.product;
      var m = moment(date2)
      var receiver = req.user.fullname
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
   var batchId = req.user.batchId
    var mformat = m.format("L")
      //var receiver = req.user.fullname
    
    console.log(product,shift,casesReceived,warehouse,'out')
    
   
    
    
      Product.findOne({'name':product})
      .then(hoc=>{
    

        StockV.findOne({'barcodeNumber':barcodeNumber})
        .then(doc=>{
          console.log(doc,'doc',hoc,'hoc')

        if( doc == null){
          
  StockD.find({refNumber:refNumber},function(err,focs){
    let size  = focs.length + 1
    BatchR.findByIdAndUpdate(batchId,{$set:{cases:size}},function(err,noc){

    })
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
      book.date = date2
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

          })
           
          
          }else{

console.log(arr,'doc7')
            res.send(arr)
          }
        })
        }) 
    
          
    })
  
  
  
    









  router.get('/batchDispatch',isLoggedIn,function(req,res){
    var errorMsg = req.flash('danger')[0];
  var successMsg = req.flash('success')[0];
  var pro = req.user
  var readonly = 'hidden'
  var read =''
  
  res.render('kambucha/batchDisp',{successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg,pro:pro,user:req.query,readonly:readonly,read:read})


   
  })


  ////////////////

  router.post('/batchDispatch',isLoggedIn,function(req,res){

    //var refNumber = req.body.referenceNumber
    var date = req.body.date
    var time = req.body.time
    var warehouse = req.body.warehouse
    var product = req.body.product
    var salesPerson = req.body.salesPerson
    var truck = req.body.truck
    var cases = req.body.cases
    var destination = req.body.destination
    var read = 'readonly'
    var reason = req.body.reason
    var readF2 = 'disabled'
    console.log(reason,'reason')
   // var lotNumber = req.body.lotNumber
    //var location = req.body.location
  var readonly = ''
  var readF = 'hidden'
    let date6 =  moment(date).format('l');
  let code
  //let shift = req.user.shift
   let date7 =  date6.replace(/\//g, "");
  
    console.log(date6,'date')

    
  
    req.check('warehouse','Enter Warehouse').notEmpty();
    req.check('product','Enter Product Name').notEmpty();
    req.check('date','Enter Date').notEmpty();
    req.check('time','Enter Time').notEmpty();
    req.check('truck','Enter Truck').notEmpty();
    req.check('cases','Enter Cases To Be Dispatched').notEmpty();
    req.check('salesPerson','Enter Sales Person').notEmpty();
   
    
  
    
    
    var errors = req.validationErrors();
     
    if (errors) {
  
      req.session.errors = errors;
      req.session.success = false;
     // res.render('product/stock',{ errors:req.session.errors,pro:pro})
     req.flash('danger', req.session.errors[0].msg);
         
          
     res.redirect('/batchDispatch');
    
    }else{


      Product.findOne({'name':product})
      .then(hoc=>{
  
        if(hoc.cases < cases){
  
          req.flash('danger', 'Stock Unavailable');
           
            
          res.redirect('/batchDispatch');
  
        }else{

          StockD.findOne({'date':date,'salesPerson':salesPerson})
          .then(oc=>{
        
            if(oc && reason =='' ){
        
              console.log(reason,'reason')
              req.session.message = {
                type:'errors',
                message:'Reason for Additional Batch to'+' '+salesPerson
              }
              res.render('kambucha/batchDisp',{user:req.body, use:req.user,message:req.session.message,readonly:readonly,
                read:read,readF:readF,readF2:readF2})
        
            }else{

            


      
  
    RefNo.find({date:date},function(err,docs){
      let size = docs.length + 1
      let refNo = date7+'B'+size+'D'
      console.log(refNo,'refNo')

      var book = new BatchD()
      book.date = date
      book.cases = 0
      book.truck = truck
      book.salesPerson = salesPerson
      book.time = time
      book.destination = destination
      book.warehouse = warehouse
      book.product = product
      book.refNumber = refNo
      book.dispatcher = req.user.fullname

      book.save()
      .then(pro =>{

      var id = req.user._id
      User.findByIdAndUpdate(id,{$set:{date:date,cases:cases, truck:truck, salesPerson:salesPerson, time:time, warehouse:warehouse,
      product:product,refNumber:refNo,destination:destination,batchId:pro._id  }},function(err,docs){
  
      })



      var book = new RefNo();
    book.refNumber = refNo
    book.date = date
    book.type = 'dispatch'
    book.reason = reason
    book.save()
    .then(pro =>{

      console.log('success')
      res.redirect('/dispatchStock/'+refNo)

    })
    
    
  })
    })
}
    })
  }
  })




  }

  
    


 
  })


  router.get('/dispatchStock/:id',isLoggedIn,function(req,res){

    var date = req.user.date
    var time = req.user.time
    var salesPerson = req.user.salesPerson
    var truck = req.user.truck
    var cases = req.user.cases
    var warehouse = req.user.warehouse
    var product = req.user.product
    var destination = req.user.destination
    var refNumber = req.user.refNumber
    
    Product.find(function(err,docs){
     res.render('kambucha/dispStock2',{listX:docs,date:date,time:time,salesPerson:salesPerson, truck:truck,
    product:product,cases:cases,refNumber:refNumber,warehouse:warehouse,destination:destination})
    })
  
  })

 



  router.post('/dispStock3',isLoggedIn, (req, res) => {
    var pro = req.user
    var m = moment()
    var code = req.user.refNumber
    var mformat = m.format("L")
    
    StockD.find({refNumber:code},(err, docs) => {
   
      res.send(docs)
              })

    }); 



  router.post('/dispatchScan',isLoggedIn, function(req,res){
 
    var date2 = req.user.date
    var product = req.user.product;
    var m = moment(date2)
    var dispatcher = req.user.fullname
    var year = m.format('YYYY')
    var dateValue = m.valueOf()
    var date = m.toString()
    var numDate = m.valueOf()
    var barcodeNumber = req.body.code
  var month = m.format('MMMM')
  var time = req.user.time
  var truck = req.user.truck
  var casesDispatched = 1
  var casesBatch = req.user.cases
  var lot = req.user.lot
  var refNumber = req.user.refNumber
  var salesPerson = req.user.salesPerson
  var warehouse = req.user.warehouse
  var batchId = req.user.batchId
 console.log(batchId,'batchId')
 var arr = []
  var mformat = m.format("L")
    //var receiver = req.user.fullname
  
  console.log(product,casesDispatched,warehouse,'out')
  
 
  StockD.find({refNumber:refNumber},function(err,focs){
    let size  = focs.length + 1

    if(size > casesBatch){
User.findByIdAndUpdate(id,{$set:{refNumber:"null"}},function(err,noc){

})
/*req.flash('success', 'Batch Complete');
         
          

res.redirect('/batchDispatch')*/
    }
    

    

  
    Product.findOne({'name':product})
    .then(hoc=>{
  

      StockD.findOne({'barcodeNumber':barcodeNumber})
      .then(doc=>{
        console.log(doc,'doc',hoc,'hoc')

      if( doc == null){
    var book = new StockD();

    BatchD.findByIdAndUpdate(batchId,{$set:{cases:size}},function(err,noc){

    })
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
    book.date = date2
    book.casesDispatched = casesDispatched
    book.availableCases = hoc.cases
    book.time = time
    book.year = year
    book.month = month
    book.truck = truck
    book.salesPerson = salesPerson
    book.dispatcher = dispatcher
    book.casesBatch = casesBatch
    book.dateValue = dateValue
    book.unitCases = unitCases
    book.size = size
    book.zwl = zwl
    book.usd = usd
    book.rand = rand
    book.rate = rate
    book.category = category
    book.subCategory = subCategory
    book.refNumber = refNumber
    book.lot = lot
  
        
         
          book.save()
            .then(pro =>{
  let stock = pro.casesDispatched + pro.availableCases

  StockD.findByIdAndUpdate(pro._id,{$set:{cases:stock}},function(err,vocs){

  })

              Product.find({'name':product},function(err,docs){
                let id = docs[0]._id
                console.log(id,'id')
                let nqty, nqty2
                 let dispatchedQty = pro.casesDispatched
                 let openingQuantity = docs[0].cases
                //nqty = pro.quantity + docs[0].quantity
                nqty =  docs[0].cases - pro.casesDispatched
                console.log(docs[0].cases, '**',pro.casesDispatched)
                nqty2 = nqty * docs[0].unitCases
                console.log(nqty,'nqty')
                Product.findByIdAndUpdate(id,{$set:{cases:nqty,openingQuantity:openingQuantity,rcvdQuantity:0, quantity:nqty2}},function(err,nocs){
   
                })
   
                
   
               })


              
              StockD.find({refNumber:refNumber},(err, ocs) => {
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
  




  router.get('/eodRepo/',isLoggedIn,function(req,res){
    //var code = req.user.invoNumber
    //var code = "Tiana Madzima"
    let date  = req.user.date
  var id = req.params.id
  RefNo.find({date:date},function(err,docs){
   for(var i = 0;i<docs.length;i++){
let refNumber = docs[i].refNumber
arrStatement[refNumber]=[]
   }   
    res.redirect('/arrRefsProcess/')
  })
    })
  
  

  

    router.get('/arrRefsProcess',isLoggedIn,function(req,res){
      console.log(arrStatement,'arrRefs')
        //var code = "Tiana Madzima"
    
  let date = req.user.date
        //console.log(docs[i].uid,'ccc')
        
        //let uid = "SZ125"
        
        
        //TestX.find({year:year,uid:uid},function(err,vocs) {
        StockV.find({date:date}).lean().sort({date:1}).then(vocs=>{
        console.log(vocs.length,'vocs')
        
        for(var x = 0;x<vocs.length;x++){
        let size = vocs.length - 1
        let code = vocs[x].refNumber
        if( arrStatement[code].length > 0 && arrStatement[code].find(value => value.refNumber == code) ){
          arrStatement[code].find(value => value.refNumber == code).casesReceived++;
          //arrStatement[code].find(value => value.uid == uid).size++;
          //arrStatement[code].push(vocs[x])
        
            }
            
             
            
            
            else{
              arrStatement[code].push(vocs[x])
              //arrStatement[code].find(value => value.refNumber == code).typeBalance = studentBalance;
              } 
        
        
         
        
             
        
        }
       
            })
            
            res.redirect('/statementGen/')
          
        
        /*})*/
        
        })
        
    
    
router.get('/statementGen/',isLoggedIn,function(req,res){
  console.log(arrStatement,'arrSingleUpdate')
  var m = moment()
  var mformat = m.format('L')
  var month = m.format('MMMM')
  var year = m.format('YYYY')
  var date = req.user.date
  var refNumber = req.user.refNumber
  //var code ="Tiana Madzima"
  var code = req.params.id

  //var studentName = 'Tiana Madzima'
 
  /*console.log(arr,'iiii')*/
  
  
  //console.log(docs,'docs')
  
  const compile = async function (templateName, arrStatement){
  const filePath = path.join(process.cwd(),'templates',`${templateName}.hbs`)
  
  const html = await fs.readFile(filePath, 'utf8')
  
  return hbs.compile(html)(arrStatement)
  
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
  const content = await compile('statement2',arrStatement)
  
  //const content = await compile('index',arr[code])
  
  await page.setContent(content, { waitUntil: 'networkidle2'});
  //await page.setContent(content)
  //create a pdf document
  await page.emulateMediaType('screen')
  //let height = await page.evaluate(() => document.documentElement.offsetHeight);
  await page.evaluate(() => matchMedia('screen').matches);
  await page.setContent(content, { waitUntil: 'networkidle0'});
  //console.log(await page.pdf(),'7777')
   
let filename = 'statement'+'_'+date+'.pdf'
  await page.pdf({
  //path:('../gitzoid2/reports/'+year+'/'+month+'/'+uid+'.pdf'),
  path:(`./public/statements/${year}/${month}/statement_${date}`+'.pdf'),
  format:"A4",
  width:'30cm',
  height:'21cm',
  //height: height + 'px',
  printBackground:true
  
  })

  
var repo = new RepoFiles();

repo.filename = filename;
repo.fileId = "null";
repo.year = year;
repo.month = month
repo.refNumber = refNumber

console.log('done')

repo.save().then(poll =>{

})

  
  
  //upload.single('3400_Blessing_Musasa.pdf')

  
  
  /*await browser.close()
  
  /*process.exit()*/
  
  const file = await fs.readFile(`./public/statements/${year}/${month}/statement_${date}`+'.pdf');
  const form = new FormData();
  form.append("file", file,filename);
 //const headers = form.getHeaders();
  //Axios.defaults.headers.cookie = cookies;
  //console.log(form)
await Axios({
    method: "POST",
   //url: 'https://portal.steuritinternationalschool.org/clerk/uploadStatement',
     //url: 'http://niyonsoft.org/uploadStatement',
     url:'http://localhost:8000/uploadStatement',
    headers: {
      "Content-Type": "multipart/form-data"  
    },
    data: form
  });
  

  
  res.redirect('/fileId/'+filename);
  
  
  }catch(e) {
  
  console.log(e)
  
  
  }
  
  
  }) ()
  
  
  
  
  //res.redirect('/hostel/discList')
  
  })
  
  


  router.post('/uploadStatement',upload.single('file'),(req,res,nxt)=>{
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
  res.redirect('/fileId/'+filename)
})
  
  })


router.get('/fileId/:id',function(req,res){
console.log(req.params.id)
var id = req.params.id

res.redirect('/openStatementName/'+id)

})


  router.get('/openStatementName/:id',(req,res)=>{
    var filename = req.params.id
    console.log(filename,'fileId')
      const bucket = new mongodb.GridFSBucket(conn.db,{ bucketName: 'uploads' });
      gfs.files.find({filename: filename}).toArray((err, files) => {
      console.log(files[0])
    
        const readStream = bucket.openDownloadStream(files[0]._id);
            readStream.pipe(res);
    
      })
     
    })

    router.get('/openStatement/:id',(req,res)=>{
      var fileId = req.params.id
        const bucket = new mongodb.GridFSBucket(conn.db,{ bucketName: 'uploads' });
        gfs.files.find({_id: mongodb.ObjectId(fileId)}).toArray((err, files) => {
        
      
          const readStream = bucket.openDownloadStream(files[0]._id);
              readStream.pipe(res);
      
        })
       //gfs.openDownloadStream(ObjectId(mongodb.ObjectId(fileId))).pipe(fs.createWriteStream('./outputFile'));
      })
 

    router.get('/folderReg',function(req,res){
      res.render('kambucha/itemFolder')
    })
  
   
  


    
  
  router.get('/folderFiles/',isLoggedIn,function(req,res){
    var arr = []
    
    var errorMsg = req.flash('danger')[0];
    var successMsg = req.flash('success')[0];
     var term = req.user.term
     var m = moment()
     var pro = req.user
     
     var year = m.format('YYYY')
     var month = m.format('MMMM')
  
     var date = req.user.invoCode
   RepoFiles.find({year:year,month:month},function(err,docs){
       if(docs){
   
     console.log(docs,'docs')
        let arr=[]
        for(var i = docs.length - 1; i>=0; i--){
    
          arr.push(docs[i])
        }
   
   
   res.render('kambucha/itemFiles',{listX:arr,month:month,pro:pro,year:year,successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg}) 
   }
   })
      
   })
   
  
router.get('/updateStockV',function(req,res){
  StockV.find(function(err,docs){
    for(var i = 0;i<docs.length;i++){
     let id = docs[i]._id
     StockV.findByIdAndRemove(id,(err,doc)=>{

     }) 
    }
    res.redirect('/updateStockD')
  })
})





router.get('/updateStockD',function(req,res){
  StockD.find(function(err,docs){
    for(var i = 0;i<docs.length;i++){
     let id = docs[i]._id
     StockD.findByIdAndRemove(id,(err,doc)=>{

     }) 
    }
    res.redirect('/updateRefN')
  })
})


router.get('/updateRefN',function(req,res){
  RefNo.find(function(err,docs){
    for(var i = 0;i<docs.length;i++){
     let id = docs[i]._id
     RefNo.findByIdAndRemove(id,(err,doc)=>{

     }) 
    }
    res.redirect('/updateProduct')
  })
})


router.get('/updateProduct',function(req,res){
  Product.find(function(err,docs){
    for(var i = 0;i<docs.length;i++){
     let id = docs[i]._id
   Product.findByIdAndUpdate(id,{$set:{qauntity:0,openingQuantity:0,rcvdQuanity:0,cases:0}},function(err,locs){

   })
    }
    res.redirect('/batch')
  })
})





router.get('/eodRepoDispatch/',isLoggedIn,function(req,res){
  //var code = req.user.invoNumber
  //var code = "Tiana Madzima"
  let date  = req.user.date
var id = req.params.id
RefNo.find({date:date,type:'dispatch'},function(err,docs){
 for(var i = 0;i<docs.length;i++){
let refNumber = docs[i].refNumber
arrStatement[refNumber]=[]
 }   
  res.redirect('/arrRefsProcessDispatch/')
})
  })





  router.get('/arrRefsProcessDispatch',isLoggedIn,function(req,res){
    console.log(arrStatement,'arrRefs')
      //var code = "Tiana Madzima"
  
let date = req.user.date
      //console.log(docs[i].uid,'ccc')
      
      //let uid = "SZ125"
      
      
      //TestX.find({year:year,uid:uid},function(err,vocs) {
      BatchD.find({date:date}).lean().sort({date:1}).then(vocs=>{
      console.log(vocs.length,'vocs')
      
      for(var x = 0;x<vocs.length;x++){
      let size = vocs.length - 1
      let code = vocs[x].refNumber
      if( arrStatement[code].length > 0 && arrStatement[code].find(value => value.refNumber == code) ){
        arrStatement[code].find(value => value.refNumber == code).casesReceived++;
        //arrStatement[code].find(value => value.uid == uid).size++;
        //arrStatement[code].push(vocs[x])
      
          }
          
           
          
          
          else{
            arrStatement[code].push(vocs[x])
            //arrStatement[code].find(value => value.refNumber == code).typeBalance = studentBalance;
            } 
      
      
       
      
           
      
      }
     
          })
          
          res.redirect('/statementGenDispatch/')
        
      
      /*})*/
      
      })
      
  
  
router.get('/statementGenDispatch/',isLoggedIn,function(req,res){
console.log(arrStatement,'arrSingleUpdate')
var m = moment()
var mformat = m.format('L')
var month = m.format('MMMM')
var year = m.format('YYYY')
var date = req.user.date
var refNumber = req.user.refNumber
//var code ="Tiana Madzima"
var code = req.params.id

//var studentName = 'Tiana Madzima'

/*console.log(arr,'iiii')*/


//console.log(docs,'docs')

const compile = async function (templateName, arrStatement){
const filePath = path.join(process.cwd(),'templates',`${templateName}.hbs`)

const html = await fs.readFile(filePath, 'utf8')

return hbs.compile(html)(arrStatement)

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
const content = await compile('statement3',arrStatement)

//const content = await compile('index',arr[code])

await page.setContent(content, { waitUntil: 'networkidle2'});
//await page.setContent(content)
//create a pdf document
await page.emulateMediaType('screen')
//let height = await page.evaluate(() => document.documentElement.offsetHeight);
await page.evaluate(() => matchMedia('screen').matches);
await page.setContent(content, { waitUntil: 'networkidle0'});
//console.log(await page.pdf(),'7777')
 
let filename = 'statement'+'_'+date+'.pdf'
await page.pdf({
//path:('../gitzoid2/reports/'+year+'/'+month+'/'+uid+'.pdf'),
path:(`./public/statements/${year}/${month}/statement_${date}`+'.pdf'),
format:"A4",
width:'30cm',
height:'21cm',
//height: height + 'px',
printBackground:true

})


var repo = new RepoFiles();

repo.filename = filename;
repo.fileId = "null";
repo.year = year;
repo.type = 'dispatch'
repo.month = month


console.log('done')

repo.save().then(poll =>{

})



//upload.single('3400_Blessing_Musasa.pdf')



/*await browser.close()

/*process.exit()*/

const file = await fs.readFile(`./public/statements/${year}/${month}/statement_${date}`+'.pdf');
const form = new FormData();
form.append("file", file,filename);
//const headers = form.getHeaders();
//Axios.defaults.headers.cookie = cookies;
//console.log(form)
await Axios({
  method: "POST",
 //url: 'https://portal.steuritinternationalschool.org/clerk/uploadStatement',
   //url: 'http://niyonsoft.org/uploadStatement',
   url:'http://localhost:8000/uploadStatementDispatch',
  headers: {
    "Content-Type": "multipart/form-data"  
  },
  data: form
});



res.redirect('/fileIdDispatch/'+filename);


}catch(e) {

console.log(e)


}


}) ()




//res.redirect('/hostel/discList')

})




router.post('/uploadStatementDispatch',upload.single('file'),(req,res,nxt)=>{
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
res.redirect('/fileIdDispatch/'+filename)
})

})


router.get('/fileIdDispatch/:id',function(req,res){
console.log(req.params.id)
var id = req.params.id

res.redirect('/openStatementNameDispatch/'+id)

})


router.get('/openStatementNameDispatch/:id',(req,res)=>{
  var filename = req.params.id
  console.log(filename,'fileId')
    const bucket = new mongodb.GridFSBucket(conn.db,{ bucketName: 'uploads' });
    gfs.files.find({filename: filename}).toArray((err, files) => {
    console.log(files[0])
  
      const readStream = bucket.openDownloadStream(files[0]._id);
          readStream.pipe(res);
  
    })
   
  })

  router.get('/openStatement/:id',(req,res)=>{
    var fileId = req.params.id
      const bucket = new mongodb.GridFSBucket(conn.db,{ bucketName: 'uploads' });
      gfs.files.find({_id: mongodb.ObjectId(fileId)}).toArray((err, files) => {
      
    
        const readStream = bucket.openDownloadStream(files[0]._id);
            readStream.pipe(res);
    
      })
     //gfs.openDownloadStream(ObjectId(mongodb.ObjectId(fileId))).pipe(fs.createWriteStream('./outputFile'));
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
    