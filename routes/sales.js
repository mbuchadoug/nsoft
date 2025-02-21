var express = require('express');
var router = express.Router();
var InvoiceSubFile = require('../models/invoiceSubFile');
var ReturnsSubFile = require('../models/returnsSubFile');
var User = require('../models/user');
var Ware = require('../models/ware');
var Warehouse = require('../models/warehouse');
var Customer = require('../models/customer');
var BatchR = require('../models/batchR');
var BatchCashRemitt = require('../models/batchCashRemitt');
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



router.get('/batch',isLoggedIn,function(req,res){

  var pro = req.user
 



  res.render('sales/batch',{pro:pro,user:req.query})
  

  })

router.post('/batch',isLoggedIn,function(req,res){
  let m = moment()
  var month = m.format('MMMM')
  var year = m.format('YYYY')
  let date6 =  moment().format('l');
  let date7 =  date6.replace(/\//g, "");
  let uid = req.user._id
  var amount = req.body.amount
  RefNo.find({type:'cashRemitt'},function(err,docs){
    let size = docs.length + 1
   refNo = date7+'C'+size+'R'
  


   var invoice = new BatchCashRemitt()
   invoice.date = date6
   invoice.amount = amount
   invoice.month = month
   invoice.year = year
   invoice.refNumber = refNo

   invoice.save()
   .then(pro =>{

    User.findByIdAndUpdate(uid,{$set:{batchId:pro._id,refNumber:refNo, amount:amount
}},function(err,docs){
  
      })

    var book = new RefNo();
    book.refNumber = refNo
    book.date = date6
    book.type = 'cashRemitt'
    book.save()
    .then(pro =>{

      console.log('success')
      res.redirect('/sales/invoiceNumberUpdate/')

    })


   })

  })
})




router.get('/invoiceNumberUpdate',isLoggedIn,function(req,res){
  var id = req.user._id
 
    InvoNum.find(function(err,doc){
      let invoiceNum = doc[0].num
      let invoId = doc[0]._id
  
  
  User.findByIdAndUpdate(id,{$set:{invoiceNumber:invoiceNum}},function(err,docs){
  
  })
  invoiceNum++
  
  InvoNum.findByIdAndUpdate(invoId,{$set:{num:invoiceNum}},function(err,tocs){
  
  })

  res.redirect('/sales/cashRemitt')
  
    })
  
  })


router.get('/cashRemitt',isLoggedIn,function(req,res){
 
  let batchId = req.user.batchId
  let refNumber = req.user.refNumber
  let amount = req.user.amount
  //paymentStatus:"unpaid"
  BatchRR.find({paymentStatus:"unpaid"},function(err,vocs){
  if(vocs.length > 0){

let id = vocs[0]._id
  
  BatchRR.find({_id:id},function(err,docs){
    res.render('sales/all33',{listX:docs,listX2:vocs,batchId:batchId,refNumber:refNumber,amount:amount})
  })

}else{
  res.render('sales/all33')
}
  
  })
  })
  
  


  /*router.post('/select',function(req,res){
    var id = req.body.code

    BatchRR.findById(id,function(err,doc){
      

      res.send(doc)
    })
  })*/


  router.post('/addInvoice',function(req,res){
    var m = moment()
    var mformat = m.format('L')
    var month = m.format('MMMM')
    var year = m.format('YYYY')
    let dateValue = moment().valueOf()
    let arrV = []
    let number1, status, amountX
    let float = req.body.float
   let id = req.body.code
   let amount = req.body.amount
   let refNumber = req.body.batchNumber
   
   let batchId = req.body.batchId
    BatchRR.findById(id,function(err,docs){

    
      //console.log(docs,'docs')
      let supplier = docs.supplier
      let item = docs.item
      let date = docs.date
      let batchNumber = docs.refNumber
      let invoiceNumber = docs.invoiceNumber
      let voucherNumber = docs.voucherNumber
      let remainingBalance = amount - docs.subtotal
      let remainingFloat = amount - docs.subtotal
      let subtotal = docs.subtotal
      let mass = docs.receivedKgs

      console.log(remainingBalance,'remainingBalance')
      if(remainingBalance <= 0){
        status = 'unpaid'
        amountX = amount
      }else{
        status = 'paid'
        BatchRR.findByIdAndUpdate(id,{$set:{paymentStatus:"paid"}},function(err,docs){

        })
console.log(subtotal,'subtotal')
        amount = subtotal
        amountX = subtotal

      }
      
   
    
    
    var stock = new InvoPayments();
    
    stock.date =date
    stock.item = item
    stock.status = status
    stock.supplier = supplier
    stock.amountPaid = amountX
    stock.float = float
    stock.remainingBalance = remainingBalance
    stock.voucherNumber = voucherNumber
    stock.invoiceNumber = invoiceNumber
    stock.refNumber = refNumber
    stock.month = month
    stock.batchNumber = batchNumber
    stock.year = year
    stock.batchId = batchId
    stock.remainingFloat = remainingFloat
    stock.mass = mass
    stock.dateValue = dateValue
    
    stock.save()
    .then(pro =>{
    
      res.send(pro)
    
    })
    
    
    
    
    
    })
    })
    


 
    router.get('/reloadRemitt/:id',isLoggedIn,function(req,res){
      var id = req.params.id
   
       InvoPayments.find({refNumber:id},function(err,docs){
         res.send(docs)
       })
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
  
  
  
  
        
    router.get('/customerModal',isLoggedIn,function(req,res){
  
      
      var errorMsg = req.flash('danger')[0];
      var successMsg = req.flash('success')[0];
      res.render('kambucha/invoice',{successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg})
    
      })
    
    
      router.post('/customerModal',isLoggedIn, function(req,res){
        var salutation= "Mr"
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
           
            
              res.redirect('/invoice');
      
            
          }
          else
        
         {
            Customer.findOne({'email':email})
            .then(user =>{
                if(user){ 
              // req.session.errors = errors
                //req.success.user = false;
                  
          req.flash('danger', 'Customer already exists');
      
          res.redirect('/invoice');
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
         
                      res.redirect('/invoice');
                   
                    
                  
                  })
                }
                
      
              })
            
              }
          
          //res.redirect('/newItem')
      
          
          })
    
  
  
        router.get('/custAuto',function(req,res){
          console.log('dog day')
          Customer.find(function(err,docs){
            res.send(docs)
          })
        })
  
  
        router.post('/custAuto2',function(req,res){
        let  code = req.body.code
        console.log(code)
          Customer.find({companyName:code}, function(err,docs){
            console.log(docs,'docs')
            res.send(docs[0])
          })
        })
    
  
  
        /*router.get('/proAuto',function(req,res){
          console.log('product day')
         Product.find(function(err,docs){
            res.send(docs)
          })
        })*/
  
        router.post('/proAuto',function(req,res){
          console.log('product day')
          let salesPerson = req.body.code
         SaleStock.find({salesPerson:salesPerson},function(err,docs){
           console.log(docs,'docsPro')
            res.send(docs)
          })
        })
  
        router.post('/proAutoV',function(req,res){
          let  code = req.body.code
          console.log(code)
            Product.find({name:code}, function(err,docs){
              console.log(docs,'docs')
              res.send(docs[0])
            })
          })
      
          router.post('/proAuto2',function(req,res){
            let  code = req.body.code
            console.log(code,'codePro')
             Product.find({name:code}, function(err,docs){
                console.log(docs,'docs')
                res.send(docs[0])
              })
            })






            router.get('/invoiceNumberUpdate',isLoggedIn,function(req,res){
                var id = req.user._id
               
                  InvoNum.find(function(err,doc){
                    let invoiceNum = doc[0].num
                    let invoId = doc[0]._id
                
                
                User.findByIdAndUpdate(id,{$set:{invoiceNumber:invoiceNum}},function(err,docs){
                
                })
                invoiceNum++
                
                InvoNum.findByIdAndUpdate(invoId,{$set:{num:invoiceNum}},function(err,tocs){
                
                })
            
                res.redirect('/sales/invoice')
                
                  })
                
                })
            
            
              router.get('/invoice',isLoggedIn,function(req,res){
                var invoiceNumber = req.user.invoiceNumber
                var salesPerson = req.user.fullname
                 var errorMsg = req.flash('danger')[0];
    var successMsg = req.flash('success')[0];
                console.log(invoiceNumber,'invoiceNumber')
                res.render('sales/test',{invoiceNumber:invoiceNumber,salesPerson:salesPerson,successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg})
              })
            
           


              router.post('/invoice',isLoggedIn,function(req,res){
                console.log(req.body,'body')
                //res.render('kambucha/invoice')
                var m = moment()
                let number1
                let stockV
                let qtyV
                let subtotal
                let arr16 = []
                let ar1=[]
                let ar2 = []
                let ar3 = []
                let ar4=[]
                 ar1 =req.body['product[]']
                 ar2 = req.body['quantity[]']
                 ar3 = req.body['price[]']
                 ar4 = req.body['stock[]']
            console.log(req.body['stock[]'],'stock555')
                let salesPersonId = req.user.username
                var invoiceNumber = req.user.invoiceNumber
                var month = m.format('MMMM')
                let dateValue = m.valueOf()
                var year = m.format('YYYY')
                var mformat = m.format('L')
           var company = req.body.company
            var address = req.body.address
            var clientName = req.body.clientName
            var salesPerson = req.user.fullname
            console.log(company,address,clientName,'print')
            var salesPerson = req.body.salesPerson
            
            
            req.check('company','Enter Company Name').notEmpty();
                   
            var errors = req.validationErrors();
            
            if (errors) {
            
              req.session.errors = errors;
              req.session.success = false;
              //res.render('hurlings/students/admit',{ errors:req.session.errors, arr1:arr1,pro:pro})
            
              req.flash('danger', req.session.errors[0].msg);
            
            
              res.redirect('/sales/invoice');
            
            
            }else{
            console.log(req.body['product[]'],'flag')

            
            console.log(ar1.length,'ha')
            console.log(typeof(ar1),'isaac3')
            
           if(typeof(ar1) === 'object' ){
             console.log('true')
              ar1 = ar1.filter(v=>v!='')
              ar2 = ar2.filter(v=>v!='')
              ar3 = ar3.filter(v=>v!='')
              ar4 = ar4.filter(v=>v!='')
             
            console.log(ar1,'iwee1')
            console.log(ar2,'iwee2')
            console.log(ar3,'iwee3')
            console.log(ar4,'iwee4')
            for(var i = 0; i<ar1.length;i++){
              console.log(ar1[i])
              console.log(ar1.length,'length')
              let code = ar1[i]
              
            
              console.log(ar3[i],ar4[i],'qty')


              if(typeof(ar2[i])=== "string"){
                let reg = /\d+\.*\d*/g;
                let resultQty = ar2[i].match(reg)
                 qtyV = Number(resultQty)

                let stockQty = ar4[i].match(reg)
                 stockV = Number(stockQty)
           
              }
              console.log(qtyV,stockV,'fctwente')
            if(qtyV>stockV){
              console.log(ar2[i],ar4[i],'end')
              
              console.log('not enough stock')
            
              req.flash('danger', 'You dont have enough stock');
            
            
              res.redirect('/sales/invoice');
            
            
            }else{
            
            
            
            
            
            var book = new InvoiceSubBatch();
              book.item = ar1[i]
              book.itemId = invoiceNumber
              book.clientCompany = company
              book.address = address
              book.clientName = clientName
              book.salesPerson = salesPerson
              book.salesPersonId = salesPersonId
              book.qty = 0
              book.price = 0
              book.total = 0
              book.month = month
              book.year = year
              book.date = mformat
              book.invoiceNumber = invoiceNumber
            
              book.status = 'not saved'
            
              book.type = "Invoice"
            
              book.size = i
              book.subtotal = 0
             
            
            
                  
                   
                    book.save()
                      .then(title =>{
            //let client = title.clientName
            let subtotal = 0
            let pId = title._id
            console.log(pId,"idd")
            
            let size = title.size
            
            console.log(size,'size')
            let qty1 = ar2[size]
            let price1 = ar3[size]
            console.log(typeof(ar2[size]),'isaac')
            console.log(typeof(ar3[size]),'isaac2')
            let reg = /\d+\.*\d*/g;
            let resultQty = qty1.match(reg)
            let qty = Number(resultQty)
            
            
            let resultPrice = price1.match(reg)
            let price = Number(resultPrice)
            
            console.log(qty,price,'blow minds')
            let total = qty * price
            subtotal = subtotal + total
            InvoiceSubBatch.findByIdAndUpdate(pId,{$set:{qty:qty,price:price,total:total,subtotal:subtotal}},function(err,ocs){
                  
                  })
            
                 
            
                      })
            
                    }  
                          
            }
           }else{
           console.log(ar1,'ar1else')
              let code = ar1
              
            
              console.log(ar3,ar4,'qty')


              if(typeof(ar2)=== "string"){
                let reg = /\d+\.*\d*/g;
                let resultQty = ar2.match(reg)
                 qtyV = Number(resultQty)

                let stockQty = ar4.match(reg)
                 stockV = Number(stockQty)
           
              }
              console.log(qtyV,stockV,'fctwente')
            if(qtyV>stockV){
              console.log(ar2,ar4,'end')
              
              console.log('not enough stock')
            
              req.flash('danger', 'You dont have enough stock');
            
            
              res.redirect('/sales/invoice');
            
            
            }else{
            
            
            
            
            
            var book = new InvoiceSubBatch();
              book.item = ar1
              book.itemId = invoiceNumber
              book.clientCompany = company
              book.address = address
              book.clientName = clientName
              book.salesPerson = salesPerson
              book.salesPersonId = salesPersonId
              book.qty = 0
              book.price = 0
              book.total = 0
              book.month = month
              book.year = year
              book.date = mformat
              book.invoiceNumber = invoiceNumber
            
              book.status = 'not saved'
            
              book.type = "Invoice"
            
              book.size = 1
              book.subtotal = 0
             
            
            
                  
                   
                    book.save()
                      .then(title =>{
            //let client = title.clientName
            let subtotal = 0
            let pId = title._id
            console.log(pId,"idd")
            
            let size = title.size
            
            console.log(size,'size')
            let qty1 = ar2
            let price1 = ar3
          
            let reg = /\d+\.*\d*/g;
            let resultQty = qty1.match(reg)
            let qty = Number(resultQty)
            
            
            let resultPrice = price1.match(reg)
            let price = Number(resultPrice)
            
            console.log(qty,price,'blow minds')
            let total = qty * price
            subtotal = subtotal + total
            InvoiceSubBatch.findByIdAndUpdate(pId,{$set:{qty:qty,price:price,total:total,subtotal:subtotal}},function(err,ocs){
                  
                  })
            
                 
            
                      })
            
                    }  
                          
            }
           
            
           
            }
            
            res.redirect('/sales/subtotalUpdateX') 
              })






















            
            router.get('/subtotalUpdateX',function(req,res){
            
              res.redirect('/sales/subtotalUpdateXX')
            })
              
            router.get('/subtotalUpdateXX',isLoggedIn,function(req,res){
              var invoiceNumber = req.user.invoiceNumber
              //console.log(invoiceNumber,'invoooo')
              let number1
              let subtotal
              let arr16 = []
              InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,hods){
              console.log(hods,'hods')
                for(var i = 0;i<hods.length; i++){
                    console.log(hods[i].total,'serima')
                  arr16.push(hods[i].total)
                    }
                    //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
                   //console.log(arr16,'arr16')
              
               //InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
                number1=0;
                for(var z in arr16) { number1 += arr16[z]; }
              for(var i = 0;i <hods.length;i++){
                let id =  hods[i]._id
                //console.log(number1,'number1')
                InvoiceSubBatch.findByIdAndUpdate(id,{$set:{subtotal:number1}},function(err,focs){
              
                })
              }
              //})
              
              //aggVouchers
              
              //res.redirect('/invoiceSubFile')
              res.redirect('/sales/subtotalUpdate')
                   
              })
              
              })  
            
            
              
            router.get('/subtotalUpdate',isLoggedIn,function(req,res){
              var invoiceNumber = req.user.invoiceNumber
              //console.log(invoiceNumber,'invoooo')
              let number1
              let subtotal
              let arr16 = []
              InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,hods){
              console.log(hods,'hods')
                for(var i = 0;i<hods.length; i++){
                   // console.log(hods[i].total,'serima')
                  arr16.push(hods[i].total)
                    }
                    //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
                   //console.log(arr16,'arr16')
              
               //InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
                number1=0;
                for(var z in arr16) { number1 += arr16[z]; }
              for(var i = 0;i <hods.length;i++){
                let id =  hods[i]._id
                //console.log(number1,'number1')
                InvoiceSubBatch.findByIdAndUpdate(id,{$set:{subtotal:number1}},function(err,focs){
              
                })
              }
              //})
              
              //aggVouchers
              
              //res.redirect('/invoiceSubFile')
              res.redirect('/sales/updateStockSaleInvo')
                   
              })
              
              }) 
            
            
              
            
            
            router.get('/updateStockSaleInvo',isLoggedIn,function(req,res){
              let arrV = []
              var invoiceNumber = req.user.invoiceNumber
            let salesPerson = req.user.fullname
              InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
            
              for(var i = 0;i<docs.length;i++){
            
              
            let product = docs[i].item
            let qtyV = docs[i].qty / 12
            let qty = docs[i].qty
            
            
                SaleStock.find({salesPerson:salesPerson,product:product},function(err,locs){
            
                  let cases = locs[0].holdingCases - qtyV
                  let qty2 = locs[0].qty - qty
                  let id = locs[0]._id
            
                  SaleStock.findByIdAndUpdate(id,{$set:{holdingCases:cases,qty:qty2}},function(err,vocs){
            
                  })
            
                })
            
              }
            
              res.redirect('/sales/invoiceSubFile')
              })
            
            })
            
            
            
            
              router.get('/invoiceSubFile',isLoggedIn,function(req,res){
             let invoiceNumber = req.user.invoiceNumber
              InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
              //console.log(docs,'docv')
                for(var i = 0; i<docs.length;i++){
                  let item = docs[i].item
                  let code = docs[i].itemId
                  let qty = docs[i].qty
                  let price = docs[i].price
                  let total = docs[i].total
                  let clientCompany = docs[i].clientCompany
                  let clientAddress = docs[i].clientAddress
                  let clientName = docs[i].clientName
                  let date = docs[i].date
                  let month = docs[i].month
                  let year = docs[i].year
                  let salesPerson = docs[i].salesPerson
                  let salesPersonId = docs[i].salesPersonId
                  /*let month = docs[i].month
                  let year = docs[i].year
                  let date = docs[i].date*/
                  let subtotal = docs[i].subtotal
              
                 
            
              
                      var invo = new InvoiceSubFile();
                   
                      invo.invoiceNumber = invoiceNumber
                      invo.item =item
                      invo.code = code
                      invo.qty = qty
                      invo.price = price
                      invo.total = total
                      invo.clientCompany = clientCompany
                      invo.clientAddress = clientAddress
                      invo.clientName = clientName
                      invo.date = date
                      invo.month = month
                      invo.year = year
                      invo.salesPerson = salesPerson
                      invo.salesPersonId = salesPersonId
                      /*invo.month = month
                      invo.year = year
                      invo.date = date*/
                  
                      invo.subtotal = subtotal
                      
                      invo.save()
                .then(user =>{
                 
                 
               
              
                  })
              
                }
               // res.redirect('/arrInvoiceSubUpdate')
               //res.redirect('/sales/viewInvo2')

               res.redirect('/sales/invoiceGen3')
              })
              
              
              })
            

              router.get('/invoiceGen3',isLoggedIn,function(req,res){
                res.redirect('/sales/invoiceGen')
              })
            
               
    
router.get('/invoiceGen/',isLoggedIn,function(req,res){

  var m = moment()
  var mformat = m.format('L')
  var month = m.format('MMMM')
  var year = m.format('YYYY')
  var date = req.user.date

  //var code ="Tiana Madzima"


  var invoiceNumber = req.user.invoiceNumber

  RepoFiles.findOne({'invoiceNumber':invoiceNumber})
  .then(user =>{
      if(!user){ 
  console.log(invoiceNumber,'invoiceNumber666')


  InvoiceSubFile.find({invoiceNumber:invoiceNumber}).lean().then(docs=>{

    console.log(docs,'eastwind')
  
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
  const content = await compile('salesInvoice',docs)
  
  //const content = await compile('index',arr[code])
  
  await page.setContent(content, { waitUntil: 'networkidle2'});
  //await page.setContent(content)
  //create a pdf document
  await page.emulateMediaType('screen')
  //let height = await page.evaluate(() => document.documentElement.offsetHeight);
  await page.evaluate(() => matchMedia('screen').matches);
  await page.setContent(content, { waitUntil: 'networkidle0'});
  //console.log(await page.pdf(),'7777')
   
let filename = 'invoice'+invoiceNumber+'.pdf'
  await page.pdf({
  //path:('../gitzoid2/reports/'+year+'/'+month+'/'+uid+'.pdf'),
  path:(`./public/salesInvoice/${year}/${month}/invoice${invoiceNumber}`+'.pdf'),
  format:"A4",
  width:'30cm',
  height:'21cm',
  //height: height + 'px',
  printBackground:true
  
  })


   
var repo = new RepoFiles();

repo.filename = filename;
repo.invoiceNumber = invoiceNumber
repo.fileId = "null";
repo.status = 'invoice'
repo.status2 = 'unpaid'
repo.year = year;
repo.month = month


console.log('done')

repo.save().then(poll =>{

})


  //upload.single('3400_Blessing_Musasa.pdf')

  
  
  /*await browser.close()
  
  /*process.exit()*/
  
  const file = await fs.readFile(`./public/salesInvoice/${year}/${month}/invoice${invoiceNumber}`+'.pdf');
  const form = new FormData();
  form.append("file", file,filename);
 //const headers = form.getHeaders();
  //Axios.defaults.headers.cookie = cookies;
  //console.log(form)
await Axios({
    method: "POST",
   //url: 'https://portal.steuritinternationalschool.org/clerk/uploadStatement',
//     url: 'http://niyonsoft.org/uploadStatement',
     url:'http://localhost:8000/sales/uploadStatement',
    headers: {
      "Content-Type": "multipart/form-data"  
    },
    data: form
  });
  
 
  
  res.redirect('/sales/viewInvo2');
  
  
  
  }catch(e) {
  
  console.log(e)
  
  
  }
  
  
  }) ()
  

})
}else{
  
  res.redirect('/sales/viewInvo2');
}

}) 
  
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
  res.redirect('/sales/viewInvo2');
  //res.redirect('/sales/statementGen')
  })
  
  })

            
            
              router.get('/viewInvo2',isLoggedIn,function(req,res){
                var invoiceNumber = req.user.invoiceNumber
                let filename = 'invoice'+invoiceNumber+'.pdf'
                InvoiceSubFile.find({invoiceNumber:invoiceNumber},function(err,docs){
                for(var i = 0;i<docs.length;i++){
                  let id = docs[i]._id
                  InvoiceSubFile.findByIdAndUpdate(id,{$set:{filename:filename}},function(err,locs){

                  })
                }
                 // console.log(docs,'ok')
                  //res.render('kambucha/pdf',{listX:docs})
            
                  res.redirect('/sales/viewInvoice/'+invoiceNumber)
                })
             
              })
            
            
            
              router.get('/viewInvoice/:id',isLoggedIn,function(req,res){
                var invoiceNumber = req.params.id
                var salesPersonId = req.user.username
                let filename = 'invoice'+invoiceNumber+'.pdf'
                InvoiceSubFile.find({salesPersonId:salesPersonId},function(err,locs){
            
                InvoiceSubFile.find({invoiceNumber:invoiceNumber},function(err,docs){
            
                 // console.log(docs,'ok')
                  res.render('sales/pdf',{listX:docs,listX2:locs,filename:filename})
                })
                })
             
              })

      
              
  router.get('/openInvoice/:id',(req,res)=>{
    var filename = req.params.id
    console.log(filename,'fileId')
      const bucket = new mongodb.GridFSBucket(conn.db,{ bucketName: 'uploads' });
      gfs.files.find({filename: filename}).toArray((err, files) => {
      console.log(files[0])
    
        const readStream = bucket.openDownloadStream(files[0]._id);
            readStream.pipe(res);
    
      })
     
    })
    
            
    router.get('/statementGenView',function(req,res){

      res.render('kambucha/stockSummaryT2',{listX:arrStatementR})
      
      
          })
      
      
      
          router.post('/modal',function(req,res){
      let salutation = req.body.salutation
      let firstName = req.body.firstName
      let lastName = req.body.lastName
      let customer = req.body.customer
      let email = req.body.email
      let mobile = req.body.mobile
      let mobile2 = req.body.mobile2
      let address = req.body.address
      let town = req.body.town
      let city = req.body.city
      let country = req.body.country
      var arrX=[]
      let companyName = req.body.companyName
      
      
      console.log(salutation,firstName,lastName,customer,email,mobile,mobile2,address, town,city,country,'data bho')
      
      Customer.findOne({'companyName':companyName})
      .then(user =>{
        if(user){ 
      
          res.send(user)
      
        }else{
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
              
                       
                          res.send(arrX)
                       
                        
                      
                      })
      
        }
      })
      
          })
      
            









          
router.get('/salesAuto',function(req,res){
  console.log('dog day')
  SalesList.find(function(err,docs){
    res.send(docs)
  })
})


router.post('/salesAuto2',function(req,res){
let  code = req.body.code
console.log(code)
SalesList.find({salesPerson:code}, function(err,docs){
    console.log(docs,'docs')
    res.send(docs[0])
  })
})

router.get('/salesStockAuto',isLoggedIn,function(req,res){
  console.log('dog day')
  var fullname = req.user.fullname
  SaleStock.find({salesPerson:fullname},function(err,docs){
    console.log(docs,'seat of dragon')
    res.send(docs)
  })
})

router.post('/salesStockAuto2',isLoggedIn,function(req,res){
  let  code = req.body.code
  let salesPerson = req.user.fullname
  console.log(code)
  SaleStock.find({salesPerson:salesPerson,product:code}, function(err,docs){
      console.log(docs,'docs')
      res.send(docs[0])
    })
  })


  
  router.get('/custAuto',function(req,res){
    console.log('dog day')
    Customer.find(function(err,docs){
      res.send(docs)
    })
  })


  router.post('/custAuto2',function(req,res){
  let  code = req.body.code
  console.log(code)
    Customer.find({companyName:code}, function(err,docs){
      console.log(docs,'docs')
      res.send(docs[0])
    })
  })




router.get('/test',isLoggedIn,function(req,res){
  var salesPerson = req.user.salesPerson
res.render('sales/test',{salesPerson:salesPerson})
})



  router.post('/test',isLoggedIn,function(req,res){

    //res.render('kambucha/invoice')
    var m = moment()
    let number1
    let subtotal
    let arr16 = []
    let ar1 =[]
    let ar2 = []
    let ar3 = []
    let ar4 = []
    var rtnsNumber = req.user.rtnsNumber
    var month = m.format('MMMM')
    let dateValue = m.valueOf()
    var year = m.format('YYYY')
    var mformat = m.format('L')
    var salesPerson = req.body.salesPerson
    
    
    
   
  
      console.log(req.body['product[]'],'flag')
    
    
    
    ar1.push(req.body['product[]'])
    ar2.push(req.body['quantity[]'])
    ar3.push(req.body['price[]'])
    ar4.push(req.body['reason[]'])
    
 

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
              


