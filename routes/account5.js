var express = require('express');
var router = express.Router();
var InvoiceSubFile = require('../models/invoiceSubFile');
var ReturnsSubFile = require('../models/returnsSubFile');
var User = require('../models/user');
var InvoPayments = require('../models/invoPayments');
var SalesInvoPayments = require('../models/salesInvoPayments');
var BatchStockUpdate = require('../models/batchStockUpdate');
var SaleStats = require('../models/saleStats');
var BatchCashRemitt = require('../models/batchCashRemitt');
var Ware = require('../models/ware');
var Suspense = require('../models/suspense');
var Warehouse = require('../models/warehouse');
var Customer = require('../models/customer');
var BatchR = require('../models/batchR');
var BatchRR = require('../models/batchRR');
var BatchInvoPayments = require('../models/batchInvoPayments');
var InvoiceSubBatch= require('../models/invoiceSubBatch');
var RtnsSubBatch= require('../models/rtnsSubBatch');
var SaleStock = require('../models/salesStock');
var StockUpdate = require('../models/stockUpdate');
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


router.get('/productStat',function(req,res){
  var max
    var m = moment()
    var year = m.format('YYYY')
    var arr = []
  
    SaleStats.find({year:year}, function(err,locs){
      console.log(locs.length,'length')
      if(locs.length == 0){
  var std = SaleStats();
  std.bestSeller = 0;
  std.bestSellingProduct = 0;
  std.worstSeller = 0;
  std.worstSellingProduct = 0;

  std.bestSellerX = 'null';
  std.bestSellingProductX = 'null';

  std.worstSellerX = 'null';
  std.worstSellingProductX = 'null';
  std.year = year;
  
  
  std.save()
  .then(std=>{
  
    SalesInvoPayments.find({year:year},function(err,docs) {
      // console.log(docs,'docs')
      if(docs.length > 0){
       for(var i = 0;i<docs.length;i++){
   
       
          if(arr.length > 0 && arr.find(value => value.product  == docs[i].product )){
                 console.log('true')
                arr.find(value => value.product  == docs[i].product ).cases += docs[i].cases;
           }else{
   arr.push(docs[i])
           }
   
         }
       
      // console.log(arr,'arr')
      //res.send(arr)
   max = arr[0].cases
   let max2
   for(var i = 0;i< arr.length;i++){
     if(arr[i].cases >= max){
       max = arr[i].cases
       max2 = arr[i].product
     }
   }
   console.log(max,'max')
   console.log(max2,'shop')
   SaleStats.findByIdAndUpdate(std._id,{$set:{bestSellingProduct:max,bestSellingProductX:max2}},function(err,kocs){
  
  
  })
}
     })
  
     
  
  })
      }else{
        SalesInvoPayments.find({year:year},function(err,docs) {
          // console.log(docs,'docs')
          if(docs.length > 0){
           for(var i = 0;i<docs.length;i++){
       
           
              if(arr.length > 0 && arr.find(value => value.product  == docs[i].product )){
                     console.log('true')
                    arr.find(value => value.product  == docs[i].product ).cases += docs[i].cases;
               }else{
       arr.push(docs[i])
               }
       
             }
           
          // console.log(arr,'arr')
          //res.send(arr)
       max = arr[0].cases
       let max2
       for(var i = 0;i< arr.length;i++){
         if(arr[i].cases >= max){
           max = arr[i].cases
           max2 = arr[i].product
         }
       }
       console.log(max,'max')
       console.log(max2,'shop')
       SaleStats.findByIdAndUpdate(locs[0]._id,{$set:{bestSellingProduct:max,bestSellingProductX:max2}},function(err,kocs){
      
      
      })
    }
         })
        
      }
  //res.redirect('/accounts5/dashG')
      })
  
    })

    ////////////sales

    

router.get('/productStatSales',function(req,res){
  var max
    var m = moment()
    var year = m.format('YYYY')
    var arr = []
  
    SaleStats.find({year:year}, function(err,locs){
      console.log(locs.length,'length')
      if(locs.length == 0){
  var std = SaleStats();
  std.bestSeller = 0;
  std.bestSellingProduct = 0;
  std.worstSeller = 0;
  std.worstSellingProduct = 0;

  std.bestSellerX = 'null';
  std.bestSellingProductX = 'null';

  std.worstSellerX = 'null';
  std.worstSellingProductX = 'null';
  std.year = year;
  
  
  std.save()
  .then(std=>{
  
    SalesInvoPayments.find({year:year},function(err,docs) {
      // console.log(docs,'docs')
      if(docs.length > 0){
       for(var i = 0;i<docs.length;i++){
   
       
          if(arr.length > 0 && arr.find(value => value.salesPerson  == docs[i].salesPerson )){
                 console.log('true')
                arr.find(value => value.salesPerson  == docs[i].salesPerson ).cases += docs[i].cases;
           }else{
   arr.push(docs[i])
           }
   
         }
       
      // console.log(arr,'arr')
      //res.send(arr)
   max = arr[0].cases
   let max2
   for(var i = 0;i< arr.length;i++){
     if(arr[i].cases >= max){
       max = arr[i].cases
       max2 = arr[i].salesPerson
     }
   }
   console.log(max,'max')
   console.log(max2,'shop')
   SaleStats.findByIdAndUpdate(std._id,{$set:{bestSeller:max,bestSellerX:max2}},function(err,kocs){
  
  
  })
}
     })
  
     
  
  })
      }else{
        SalesInvoPayments.find({year:year},function(err,docs) {
          // console.log(docs,'docs')
          if(docs.length > 0){
           for(var i = 0;i<docs.length;i++){
       
           
              if(arr.length > 0 && arr.find(value => value.salesPerson == docs[i].salesPerson )){
                     console.log('true')
                    arr.find(value => value.salesPerson  == docs[i].salesPerson ).cases += docs[i].cases;
               }else{
       arr.push(docs[i])
               }
       
             }
           
          // console.log(arr,'arr')
          //res.send(arr)
       max = arr[0].cases
       let max2
       for(var i = 0;i< arr.length;i++){
         if(arr[i].cases >= max){
           max = arr[i].cases
           max2 = arr[i].salesPerson
         }
       }
       console.log(max,'max')
       console.log(max2,'shop')
       SaleStats.findByIdAndUpdate(locs[0]._id,{$set:{bestSeller:max,bestSellerX:max2}},function(err,kocs){
      
      
      })
    }
         })
        
      }
  //res.redirect('/accounts5/dashG')
      })
  
    })


router.post('/dashChart1',isLoggedIn,function(req,res){
  var product = req.body.product
  //var shop = req.body.shop

  var date = req.body.date
  var arr = []
  var id = req.user._id
  let num = req.user.num
  num++
  
  var m = moment(date)
  console.log(date.split('-')[0])
  var startDate = date.split('-')[0]
  var endDate = date.split('-')[1]
   var startValueA = moment(startDate)
   var startValueB=startValueA.subtract(1,"days");
   var startValue = moment(startValueB).valueOf()

   var endValueA = moment(endDate)
   var endValueB = endValueA.add(1,"days");
   var endValue= moment(endValueB).valueOf()
  console.log(startValue,endValue,'output')


  SalesInvoPayments.find({product:product},function(err,docs) {
   // console.log(docs,'docs')
    for(var i = 0;i<docs.length;i++){

      let sdate = docs[i].dateValue
      if(sdate >= startValue && sdate <= endValue){
        //console.log(docs[i],'docs')
       if(arr.length > 0 && arr.find(value => value.salesPerson == docs[i].salesPerson)){
              console.log('true')
             arr.find(value => value.salesPerson == docs[i].salesPerson).cases += docs[i].cases;
        }else{
arr.push(docs[i])
        }

      }
    }
   // console.log(arr,'arr')
   res.send(arr)
  })

})



router.post('/dashChart4',isLoggedIn,function(req,res){
 

 
  var date = req.body.date
  console.log(date,'date4')
  var arr = []
  var id = req.user._id
  let num = req.user.num
  num++
  
  var m = moment(date)
  console.log(date.split('-')[0])
  var startDate = date.split('-')[0]
  var endDate = date.split('-')[1]
   var startValueA = moment(startDate)
   var startValueB=startValueA.subtract(1,"days");
   var startValue = moment(startValueB).valueOf()

   var endValueA = moment(endDate)
   var endValueB = endValueA.add(1,"days");
   var endValue= moment(endValueB).valueOf()
  //console.log(startValue,endValue,'output')


  SalesInvoPayments.find(function(err,docs) {
    for(var i = 0;i<docs.length;i++){

      let sdate = docs[i].dateValue
      if(sdate >= startValue && sdate <= endValue){
        
       if(arr.length > 0 && arr.find(value => value.product == docs[i].product)){
              console.log('true')
             arr.find(value => value.product== docs[i].product).cases += docs[i].cases;
        }else{
arr.push(docs[i])
        }

      }
    }
    //console.log(arr,'arr')
   res.send(arr)
  })

})



router.post('/dashChart5',isLoggedIn,function(req,res){
 

 
  var date = req.body.date
  var arr = []
  var id = req.user._id
  let num = req.user.num
  num++
  
  var m = moment(date)
  console.log(date.split('-')[0])
  var startDate = date.split('-')[0]
  var endDate = date.split('-')[1]
   var startValueA = moment(startDate)
   var startValueB=startValueA.subtract(1,"days");
   var startValue = moment(startValueB).valueOf()

   var endValueA = moment(endDate)
   var endValueB = endValueA.add(1,"days");
   var endValue= moment(endValueB).valueOf()
  console.log(startValue,endValue,'output')


  SalesInvoPayments.find(function(err,docs) {
    for(var i = 0;i<docs.length;i++){

      let sdate = docs[i].dateValue
      if(sdate >= startValue && sdate <= endValue){
        
       if(arr.length > 0 && arr.find(value => value.salesPerson == docs[i].salesPerson)){
              console.log('true')
             arr.find(value => value.salesPerson== docs[i].salesPerson).cases += docs[i].cases;
        }else{
arr.push(docs[i])
        }

      }
    }
    //console.log(arr,'arr')
   res.send(arr)
  })

})



router.post('/dashChartG1',isLoggedIn,function(req,res){

 
  var m = moment()
  var year = m.format('YYYY')
  var arr = []
  var id = req.user._id

  



  SalesInvoPayments.find({year:year},function(err,docs) {
    for(var i = 0;i<docs.length;i++){

   
        
       if(arr.length > 0 && arr.find(value => value.month == docs[i].month)){
              console.log('true')
             arr.find(value => value.month == docs[i].month).cases += docs[i].cases;
        }else{
arr.push(docs[i])
        }

    
    }
    //console.log(arr,'arr')
   res.send(arr)
  })

})



router.post('/dashChartG2',isLoggedIn,function(req,res){

 
  var m = moment()
  var year = m.format('YYYY')
  var arr = []
  var id = req.user._id

  let product = req.body.product



  SalesInvoPayments.find({product:product,year:year},function(err,docs) {
    for(var i = 0;i<docs.length;i++){

   
        
       if(arr.length > 0 && arr.find(value => value.month == docs[i].month)){
              console.log('true')
             arr.find(value => value.month == docs[i].month).cases+= docs[i].cases;
        }else{
arr.push(docs[i])
        }

    
    }
    //console.log(arr,'arr')
   res.send(arr)
  })

})



router.post('/dashGX1',isLoggedIn,function(req,res){
   
  var m = moment()
  var year = m.format('YYYY')

  SaleStats.find({year:year},function(rr,docs){
    if(docs == undefined){
      res.redirect('/dash')
    }else

       res.send(docs)
  })
})


router.get('/grvList',isLoggedIn,function(req,res){
  BatchRR.find({status:"complete",priceStatus:"null"},function(err,docs){
    res.render('accounts5/grvList',{listX:docs})
  })
})



router.get('/invoiceGenNumberUpdate/:id',isLoggedIn,function(req,res){
  var id = req.user._id
  var id2 = req.params.id
console.log(id2,'id2')
    InvoNum.find(function(err,doc){
      let invoNum = doc[0].num
      let invoId = doc[0]._id
  
  
  User.findByIdAndUpdate(id,{$set:{invoiceNumber:invoNum}},function(err,docs){
  
  })
  invoNum++
  
  InvoNum.findByIdAndUpdate(invoId,{$set:{num:invoNum}},function(err,tocs){
  
  })
  res.redirect('/accounts5/price/'+id2)
  
    })
  
  })



router.get('/price/:id',isLoggedIn,function(req,res){
  var pro = req.user
  var id = req.params.id
  console.log(id,'idPrice')
  BatchRR.findById(id,function(err,doc){
    let refNumber = doc.refNumber
    let item = doc.item
    let receivedTonnes = doc.receivedTonnes
    let receivedKgs = doc.receivedKgs
    let requestedMassTonnes = doc.requestedMassTonnes
    let requestedMassKgs = doc.requestedMassKgs
    let supplier = doc.supplier
    let supplierAddress = doc.address
    let closingStock= doc.closingWeightKg
    let mobile = doc.mobile
  res.render('accounts5/price',{pro:pro,mobile:mobile,id:id,refNumber:refNumber,item:item,requestedMassKgs:requestedMassKgs,
  receivedTonnes:receivedTonnes,receivedKgs:receivedKgs,requestedMassTonnes:requestedMassTonnes,supplier:supplier,supplierAddress:supplierAddress,closingStock:closingStock})
  
  })
  })
  



router.post('/price/:id',isLoggedIn,function(req,res){
  var id = req.params.id
  var price = req.body.price
  var receivedKgs = req.body.receivedKgs
  var paymentStatus = req.body.paymentStatus
var invoiceNumber = req.user.invoiceNumber
  
var errors = req.validationErrors();
 
if (errors) {
 
 req.session.errors = errors;
 req.session.success = false;
 console.log( req.session.errors[0].msg)
 req.flash('danger', req.session.errors[0].msg);
      
       
 res.redirect('/accounts5/price/'+id);

}

else{

  let subtotal = price * receivedKgs

  BatchRR.findByIdAndUpdate(id,{$set:{price:price,paymentStatus:paymentStatus,subtotal:subtotal,priceStatus:"set",invoiceNumber:invoiceNumber}},function(err,docs){

  })

  res.redirect('/accounts5/supplierInvoice/'+id)
}
})






router.get('/supplierInvoice/:id',isLoggedIn,function(req,res){
var id = req.params.id
let invoiceNumber = req.user.num

BatchRR.find({priceStatus:"set"},function(err,vocs){


BatchRR.find({_id:id},function(err,docs){
  res.render('accounts5/pdf',{listX:docs,listX2:vocs,invoiceNumber:invoiceNumber})
})

})
})


router.get('/supplierInvoices',isLoggedIn,function(req,res){
 
  
  
  BatchRR.find({priceStatus:"set"},function(err,vocs){
  if(vocs.length > 0){

let id = vocs[0]._id
  
  BatchRR.find({_id:id},function(err,docs){
    res.render('accounts5/all',{listX:docs,listX2:vocs})
  })

}else{
  res.render('accounts5/all')
}
  
  })
  })



  
router.get('/paidInvoices',isLoggedIn,function(req,res){
 
  
  
  BatchRR.find({paymentStatus:"paid"},function(err,vocs){
  if(vocs.length > 0){

let id = vocs[0]._id
  
  BatchRR.find({_id:id},function(err,docs){
    res.render('accounts5/paid',{listX:docs,listX2:vocs})
  })

}else{
  res.render('accounts5/paid')
}
  
  })
  })
  
  


  
router.get('/unpaidInvoices',isLoggedIn,function(req,res){
 
  
  
  BatchRR.find({paymentStatus:"unpaid"},function(err,vocs){
  if(vocs.length > 0){

let id = vocs[0]._id
  
  BatchRR.find({_id:id},function(err,docs){
    res.render('accounts5/unpaid',{listX:docs,listX2:vocs})
  })

}else{
  res.render('accounts5/unpaid')
}
  
  })
  })


  router.get('/batch',isLoggedIn,function(req,res){

  var pro = req.user
 



  res.render('accounts5/batch',{pro:pro,user:req.query})
  

  })

router.post('/batch',isLoggedIn,function(req,res){
  let m = moment()
  var month = m.format('MMMM')
  var year = m.format('YYYY')
  let date6 =  moment().format('l');
  let date7 =  date6.replace(/\//g, "");
  let uid = req.user._id
  var amount = req.body.amount
  RefNo.find({type:'invoicePayments'},function(err,docs){
    let size = docs.length + 1
   refNo = date7+'I'+size+'P'
  


   var invoice = new BatchInvoPayments()
   invoice.date = date6
   invoice.amount = amount
   invoice.remainingAmount = 0
   invoice.month = month
   invoice.year = year

   invoice.save()
   .then(pro =>{

    User.findByIdAndUpdate(uid,{$set:{batchId:pro._id,refNumber:refNo, amount:amount
}},function(err,docs){
  
      })

    var book = new RefNo();
    book.refNumber = refNo
    book.date = date6
    book.type = 'invoicePayments'
    book.save()
    .then(pro =>{

      console.log('success')
      res.redirect('/accounts5/payments/')

    })


   })

  })
})

  
  
router.get('/payments',isLoggedIn,function(req,res){
 
  let batchId = req.user.batchId
  let refNumber = req.user.refNumber
  let amount = req.user.amount
  //paymentStatus:"unpaid"
  BatchRR.find({paymentStatus:"unpaid"},function(err,vocs){
  if(vocs.length > 0){

let id = vocs[0]._id
  
  BatchRR.find({_id:id},function(err,docs){
    res.render('accounts5/all33',{listX:docs,listX2:vocs,batchId:batchId,refNumber:refNumber,amount:amount})
  })

}else{
  res.render('accounts5/all33')
}
  
  })
  })
  
  


  router.post('/select',function(req,res){
    var id = req.body.code

    BatchRR.findById(id,function(err,doc){
      

      res.send(doc)
    })
  })


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
    


 
    router.get('/reloadPayment/:id',isLoggedIn,function(req,res){
      var id = req.params.id
   
       InvoPayments.find({refNumber:id},function(err,docs){
         res.send(docs)
       })
    })


  
/*
  router.get('/grvList',isLoggedIn,function(req,res){
    BatchRR.find({status:"complete"},function(err,docs){
      if(docs.length > 1){

      
      BatchRR.find({_id:id},function(err,locs){
        console.log(locs,'locs')
   
       res.render('accounts5/grv2',{listX:locs,listX2:docs})
     })
    }else{
      res.render('accounts5/grvEmpty')
    }
    
    })
  })

  router.get('/viewGRV/:id',isLoggedIn,function(req,res){
    var id = req.params.id
  
    BatchRR.find({status:"complete"},function(err,docs){
  
     BatchRR.find({_id:id},function(err,locs){
       console.log(locs,'locs')
  
      res.render('accounts5/grv2',{listX:locs,listX2:docs})
    })
    })
  
  })

*/

  
router.get('/purchaseOrders/',isLoggedIn,function(req,res){
 

  StockVoucher.find({status:'approved'},function(err,docs){

   

   // console.log(docs,'ok')
    res.render('accounts5/purchaseOrder2',{listX:docs,listX2:docs})
  })
  

})




router.get('/viewPurchaseOrders/:id',isLoggedIn,function(req,res){

  BatchRR.find({status:'complete'},function(err,locs){

  BatchRR.find({status:'complete'},function(err,docs){

   // console.log(docs,'ok')
    res.render('accounts5/purchaseOrder2',{listX:docs,listX2:locs})
  })
  })

})



/*
router.get('/supplierInvoices',isLoggedIn,function(req,res){
 
  
  
  BatchRR.find({priceStatus:"set"},function(err,vocs){
  if(vocs.length > 0){

let id = vocs[0]._id
  
  BatchRR.find({_id:id},function(err,docs){
    res.render('accounts5/pdf',{listX:docs,listX2:vocs})
  })

}
  
  })
  })


router.get('/invoicePdf',function(req,res){
  res.render('accounts5/pdf2')
})


*/
router.get('/statementGenSales/:id',isLoggedIn,function(req,res){
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
  SalesInvoPayments.find({invoiceNumber:id}).lean().then(docs=>{


  

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
   
  let filename = 'SA'+seqNum+'.pdf'
  await page.pdf({
  //path:('../gitzoid2/reports/'+year+'/'+month+'/'+uid+'.pdf'),
  path:(`./public/statements/${year}/${month}/SA${seqNum}`+'.pdf'),
  format:"A4",
  width: '21cm',
  height : '29.7cm',      
  //height: height + 'px',
  printBackground:true
  
  })
  
  res.redirect('/accounts5/openFile/'+seqNum)
  
  var repo = new RepoFiles();
  
  repo.filename = filename;
  repo.fileId = "null";
  repo.status = 'SAI'
  repo.date = mformat
  repo.year = year;
  repo.month = month
  
  
  console.log('done')
  
  repo.save().then(poll =>{
  
  })
  
  
  //upload.single('3400_Blessing_Musasa.pdf')
  
  
 
  /*await browser.close()
  
  /*process.exit()*/
  
  /*const file = await fs.readFile(`./public/statements/${year}/${month}/SP${seqNum}`+'.pdf');
  const form = new FormData();
  form.append("file", file,filename);
  
  await Axios({
    method: "POST",
    url:'http://localhost:8000/accounts5/uploadSales',
    headers: {
      "Content-Type": "multipart/form-data"  
    },
    data: form
  });
  
  seqNum++
  RefNoSeq.findByIdAndUpdate(seqId,{$set:{num:seqNum}},function(err,tocs){
  
  })*/
    
  
 // res.redirect('/receiver/fileId/'+filename);
 //res.redirect('/accounts5/fileIdSales/'+filename)
  
  
  }catch(e) {
  
  console.log(e)
  
  
  }
  
  
  }) ()
  
  })
})
  
  //res.redirect('/hostel/discList')
  
  })
  

  router.get('/openFile/:id',function(req,res){
    var refNumber = req.params.id
    var batchNumber = req.params.id
    var m = moment()
    var mformat = m.format('L')
    var month = m.format('MMMM')
    var year = m.format('YYYY')
    const path =`./public/statements/${year}/${month}/SA${batchNumber}.pdf`
    if (fs.existsSync(path)) {
        res.contentType("application/pdf");
        fs.createReadStream(path).pipe(res)
    } else {
        res.status(500)
        console.log('File not found')
        res.send('File not found')
    }
    
    })
  


  
router.post('/uploadSales',upload.single('file'),(req,res,nxt)=>{
var fileId = req.file.id
console.log(fileId,'upload')
var filename = req.file.filename
console.log(filename,'filename')
RepoFiles.find({filename:filename},function(err,docs){
if(docs.length>0){

console.log('success')
let id = docs[0]._id
RepoFiles.findByIdAndUpdate(id,{$set:{fileId:fileId}},function(err,tocs){

})

}
//res.redirect('/receiver/fileId/'+filename)
res.redirect('/accounts5/fileIdSales/'+filename)
})

})


router.get('/fileIdSales/:id',function(req,res){
console.log(req.params.id)
var id = req.params.id

res.redirect('/accounts5/openSales/'+id)

})


router.get('/openSales/:id',(req,res)=>{
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
  var id = req.params.id
  var arrG = []
  BatchRR.findById(id).lean().then(docs=>{


  

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
  const content = await compile('supplierInvoice',docs)
  
  //const content = await compile('index',arr[code])
  
  await page.setContent(content, { waitUntil: 'networkidle2'});
  //await page.setContent(content)
  //create a pdf document
  await page.emulateMediaType('screen')
  //let height = await page.evaluate(() => document.documentElement.offsetHeight);
  await page.evaluate(() => matchMedia('screen').matches);
  await page.setContent(content, { waitUntil: 'networkidle0'});
  //console.log(await page.pdf(),'7777')
   
  let filename = 'SP'+seqNum+'.pdf'
  await page.pdf({
  //path:('../gitzoid2/reports/'+year+'/'+month+'/'+uid+'.pdf'),
  path:(`./public/statements/${year}/${month}/SP${seqNum}`+'.pdf'),
  format:"A4",
  width: '21cm',
  height : '29.7cm',      
  //height: height + 'px',
  printBackground:true
  
  })
  
  
  
  var repo = new RepoFiles();
  
  repo.filename = filename;
  repo.fileId = "null";
  repo.status = 'SP'
  repo.date = mformat
  repo.year = year;
  repo.month = month
  
  
  console.log('done')
  
  repo.save().then(poll =>{
  
  })
  
  
  //upload.single('3400_Blessing_Musasa.pdf')
  
  
  
  /*await browser.close()
  
  /*process.exit()*/
  
  const file = await fs.readFile(`./public/statements/${year}/${month}/SP${seqNum}`+'.pdf');
  const form = new FormData();
  form.append("file", file,filename);
  //const headers = form.getHeaders();
  //Axios.defaults.headers.cookie = cookies;
  //console.log(form)
  await Axios({
    method: "POST",
   //url: 'https://portal.steuritinternationalschool.org/clerk/uploadStatement',
 //url: 'https://niyonsoft.org/accounts5/uploadStatement',
    url:'http://localhost:8000/accounts5/uploadStatement',
    headers: {
      "Content-Type": "multipart/form-data"  
    },
    data: form
  });
  
  seqNum++
  RefNoSeq.findByIdAndUpdate(seqId,{$set:{num:seqNum}},function(err,tocs){
  
  })
    
  
 // res.redirect('/receiver/fileId/'+filename);
 res.redirect('/accounts1/fileIdPO/'+filename)
  
  
  }catch(e) {
  
  console.log(e)
  
  
  }
  
  
  }) ()
  
  })
})
  
  //res.redirect('/hostel/discList')
  
  })
  

  


  
router.post('/uploadStatement',upload.single('file'),(req,res,nxt)=>{
var fileId = req.file.id
console.log(fileId,'upload')
var filename = req.file.filename
console.log(filename,'filename')
RepoFiles.find({filename:filename},function(err,docs){
if(docs.length>0){

console.log('success')
let id = docs[0]._id
RepoFiles.findByIdAndUpdate(id,{$set:{fileId:fileId}},function(err,tocs){

})

}
//res.redirect('/receiver/fileId/'+filename)
res.redirect('/accounts1/fileIdPO/'+filename)
})

})


router.get('/fileIdPO/:id',function(req,res){
console.log(req.params.id)
var id = req.params.id

res.redirect('/accounts1/openPO/'+id)

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




router.get('/grvFileV/:id',function(req,res){
  var id = req.params.id
  res.redirect('/rm/grvFile/'+id)
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
    
   
    res.redirect('/accounts5/openFile/'+batchNumber)
  
  
  
    
    
    
   
   
    const file = await fs.readFile(`./public/grv/${year}/${month}/grv${batchNumber}`+'.pdf');
    const form = new FormData();
    form.append("file", file,filename);
    
    await Axios({
      method: "POST",
     //url: 'https://portal.steuritinternationalschool.org/clerk/uploadStatement',
       //url: 'https://niyonsoft.org/uploadStatementDispatch',
      url:'https://niyonsoft.org/rm/uploadGrv',
       //url:'localhost:8000/accounts5/uploadGrv',
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
    res.redirect('/accounts5/fileIdGrv/'+filename)
    })
    
    })
  
    router.get('/fileIdGrv/:id',function(req,res){
      console.log(req.params.id)
      var id = req.params.id
      
      res.redirect('/accounts5/openGrv/'+id)
      
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
  
  
  

      /*router.get('/batchRemitt',isLoggedIn,function(req,res){

        var pro = req.user
       
      
        //SalesList.find(function(err,nocs){
      
        res.render('accounts5/batchRFloat',{pro:pro,user:req.query,arr1:nocs})
       // })
      
        })*/
router.get('/updateSales',isLoggedIn,function(req,res){
  User.find({role:"sales"},function(err,docs){
    for(var i = 0;i<docs.length;i++){
      let id = docs[i]._id
      let salesPerson =docs[i].fullname
     SaleStock.find({salesPerson:salesPerson},function(err,nocs){
       for(n = 0;n<nocs.length;n++){
         sId = nocs[n]._id
         SaleStock.findByIdAndUpdate(sId,{$set:{salesPersonId:id}},function(err,tocs){

         })
       }
     }) 
    }
  })
})

        router.get('/profile',isLoggedIn,function(req,res){
          var pro = req.user
        User.find({role:'sales'},function(err,docs){
        res.render('accounts5/profile',{listX:docs,pro:pro})
        
        })
        })

        
    router.post('/autoClientProfile',function(req,res){
      var code = req.body.code

  
      
  User.findById(code,function(err,doc){
     if(doc == undefined){
       res.redirect('/')
     }else
    
        res.send(doc)
      })
    
    
    })

    router.post('/autoClientInvoices',function(req,res){
      var code = req.body.code

    var arr = []
      
      SalesInvoPayments.find({salesPersonId:code},function(err,docs){
        //BlendedItems.find({product:product},function(err,docs) {
          // console.log(docs,'docs')
           for(var i = 0;i<docs.length;i++){
         // let product = docs[i].product
          //console.log(docs,'docs')
        
              if(arr.length > 0 && arr.find(value => value.invoiceNumber == docs[i].invoiceNumber   )){
                     console.log('true')
                    //arr.find(value => value.product == docs[i].product).holdingCases += docs[i].holdingCases
               }else{
        arr.push(docs[i])
               }
        
             
           }
          //console.log(arr,'arr')
          res.send(arr)
         })
        
        
    
        //BlendedItems.find({product:product}).sort({num:1}).then(docs=>{
           
                //res.render('qa/itemFilesMonthly',{pro:pro,product:product,listX:arr})
      
    
        //res.send(docs)
      })
    
    
   // })





    router.post('/autoInvo',isLoggedIn,function(req,res){
      var code = req.body.code
      var term = req.user.term

  
      
     
   // InvoiceFile.find({term:code,/*code:uid*/datePaid:"now"},function(err,docs){
      InvoiceFile.find({studentId:code,term:term,status:"unpaid"}).lean().sort({code:1}).then(docs=>{
if(docs.length > 0){
  
      let amount =  docs[0].amountDue 
      var c = {type:" ",invoiceNumber:"",_id:"",amountDue:amount} 
        docs.push(c)
}
     if(docs == undefined){
       res.redirect('/')
     }else

        res.send(docs)
      })
    
    
    })

   

    router.post('/autoInvoCode',function(req,res){

      var id = req.body.code

  console.log(id,'code')
      
     
    InvoiceFile.findById(id,function(err,doc){
     if(doc == undefined){
       res.redirect('/')
     }else
    
        res.send(doc)
      })
    
    
    })
        

    
        router.get('/updatedStock',isLoggedIn,function(req,res){
          BatchStockUpdate.find({status:"null"},function(err,docs){
          res.render('accounts5/salesRemittList',{listX:docs})
        })

      })

      router.get('/batchRemitt/:id/:id2',isLoggedIn,function(req,res){

        var pro = req.user
        var id = req.params.id
        var code = req.params.id2
        BatchStockUpdate.findById(id,function(err,doc){
        let salesPerson = doc.salesPerson
        let date = doc.date
       
      
        res.render('accounts5/batchRFloat',{pro:pro,user:req.query,salesPerson:salesPerson,code:code,date:date,id:id})
        })
      
        })
      
      router.post('/batchRemitt/:id/:id2',isLoggedIn,function(req,res){
        let m = moment()
        var month = m.format('MMMM')
        var year = m.format('YYYY')
        let date6 =  moment().format('l');
        let date7 =  date6.replace(/\//g, "");
        let uid = req.user._id
        let batchId = req.params.id
        let batchCode = req.params.id2
        var amount = req.body.amount
        var salesPerson = req.body.salesPerson
        /*RefNo.find({type:'cashRemitt'},function(err,docs){
          let size = docs.length + 1
         refNo = date7+'C'+size+'R'*/
        
         BatchStockUpdate.findByIdAndUpdate(batchId,{$set:{float:amount}},function(err,doc){
      
      
        
          User.findByIdAndUpdate(uid,{$set:{batchId:batchId,refNumber:batchCode, amount:amount,salesPerson:salesPerson,
      }},function(err,docs){
        
            })
      
         
            res.redirect('/accounts5/invoiceNumberUpdateRemitt/'+batchId+'/'+batchCode)
      
          
      
      
        })
      
        //})
      })
      
      

      /*router.post('/batchRemitt/:id/:id2',isLoggedIn,function(req,res){
        let m = moment()
        var month = m.format('MMMM')
        var year = m.format('YYYY')
        let date6 =  moment().format('l');
        let date7 =  date6.replace(/\//g, "");
        let uid = req.user._id
        let batchId = req.params.id
        let batchCode = req.params.id2
        var amount = req.body.amount
        var salesPerson = req.body.salesPerson
        RefNo.find({type:'cashRemitt'},function(err,docs){
          let size = docs.length + 1
         refNo = date7+'C'+size+'R'
        
      
      
         var invoice = new BatchCashRemitt()
         invoice.date = date6
         invoice.amount = amount
         invoice.month = month
         invoice.batchId = batchId
         invoice.code = code
         invoice.year = year
         invoice.batchNumber = refNo
         invoice.salesPerson = salesPerson
      
         invoice.save()
         .then(pro =>{
      
          User.findByIdAndUpdate(uid,{$set:{batchId:pro._id,refNumber:refNo, amount:amount,salesPerson:salesPerson,
      }},function(err,docs){
        
            })
      
          var book = new RefNo();
          book.refNumber = refNo
          book.date = date6
          book.type = 'cashRemitt'
          book.save()
          .then(pro =>{
      
            console.log('success')
            res.redirect('/accounts5/invoiceNumberUpdateRemitt/')
      
          })
      
      
         })
      
        })
      })*/
      
      
      
      router.get('/invoiceNumberUpdateRemitt/:id/:id2',isLoggedIn,function(req,res){
        var id = req.user._id
        var batchId = req.params.id
        var batchCode = req.params.id2
          InvoNum.find(function(err,doc){
            let invoiceNum = doc[0].num
            let invoId = doc[0]._id
        
        
        User.findByIdAndUpdate(id,{$set:{invoiceNumber:invoiceNum}},function(err,docs){
        
        })
        invoiceNum++
        
        InvoNum.findByIdAndUpdate(invoId,{$set:{num:invoiceNum}},function(err,tocs){
        
        })
      
        res.redirect('/accounts5/cashRemitt/'+batchId+'/'+batchCode)
        
          })
        
        })
      
      
      router.get('/cashRemitt/:id/:id2',isLoggedIn,function(req,res){
        var id = req.params.id
        let batchCode = req.params.id2
        let refNumber = req.params.id2
        let amount = req.user.amount
        let invoiceNumber = req.user.invoiceNumber
        BatchStockUpdate.findById(id,function(err,doc){
          let salesPerson = doc.salesPerson
          let salesPersonId = doc.salesPersonId
          let date = doc.date
        
         //var id = req.params.id
       
     
        let sales = doc.sales

        //paymentStatus:"unpaid"
       
          res.render('accounts5/cashR',{invoiceNumber:invoiceNumber,code:batchCode,id:id,batchId:id,refNumber:refNumber,sales:sales,amount:amount,salesPerson:salesPerson,salesPersonId:salesPersonId})
        })

      })
      
        
        
        
        
        
      
      
        /*router.post('/select',function(req,res){
          var id = req.body.code
      
          BatchRR.findById(id,function(err,doc){
            
      
            res.send(doc)
          })
        })*/
      
      
        router.post('/addInvoiceRemitt',isLoggedIn,function(req,res){
          var m = moment()
          var mformat = m.format('L')
          var month = m.format('MMMM')
          var year = m.format('YYYY')
          let dateValue = moment().valueOf()
          let arrV = []
          let arrD={}
          let arrCases= []
          let arrE = []
           let uid = req.user._id
          var code = req.body.code
          let number1, status, amountX, number2
          let salesPerson = req.body.salesPerson
          let salesPersonId = req.body.salesPersonId
          let date = req.body.date
          let invoiceNumber = req.body.invoiceNumber
          let customer = req.body.customer
          let customerAddress = req.body.customerAddress
          let customerMobile = req.body.customerMobile
          let product = req.body.product
          let priceText = req.body.price
          let openingStockText = req.body.openingStock
          let closingStockAfterSalesText = req.body.closingStock
          let casesText = req.body.cases
          let unitsText = req.body.units
          let paymentMethod = req.body.paymentMethod
          let amountText = req.body.amount
          let refNumber = req.body.refNumber
          let expSales = req.body.expSales
          let batchId = req.body.batchId
          let missingBalance
          let invoNum = req.body.invoiceNumber
         
        
         
          let reg = /\d+\.*\d*/g;
      let price1 = priceText.match(reg)
      let price = Number(price1)

       let invo3 = invoNum.match(reg)
      let invo2 = Number(invo3)
      invo2++
      console.log(invo2,'invo2')
      let arrF = [invo2,2]
      
      let op1 = openingStockText.match(reg)
      let openingStock = Number(op1)
      
      let  cs1 = closingStockAfterSalesText.match(reg)
      let closingStockAfterSales = Number(cs1)
      
      let cases1 = casesText.match(reg)
      let cases = Number(cases1)
      
      let units1 = unitsText.match(reg)
      let units = Number(units1)
      
      let amt1 = amountText.match(reg)
      let amount = Number(amt1)
      
      
      let expC = expSales.match(reg)
      let expCases = Number(expC)
      let closingStock2
      let unitsX = cases * 12
      
          let totalUnits = unitsX + units
         // let subtotal = totalUnits * price 
          let totalCases = totalUnits / 12
          let subtotal = totalCases * price
          let closingStock = openingStock - totalCases
          let unitsInSystem = closingStock * 12
          let unitsInSystem2 = closingStockAfterSales * 12
          let missingUnits = unitsInSystem - unitsInSystem2
          console.log(unitsInSystem,unitsInSystem,'vvv')
          if(missingUnits > 0){
           missingBalance = missingUnits * price
           missingCases = missingUnits / 12
          }else{
            missingCases = 0
          }
      
    SalesInvoPayments.find({code:code},function(err,ocs){   
          if(ocs.length > 0){
            let size = ocs.length - 1
        let lastCustomer = ocs[size].customer
        let lastInvoiceNumber = ocs[size].invoiceNumber
        if(customer == lastCustomer || lastInvoiceNumber != invoiceNumber ){

       
         
      SalesInvoPayments.find({invoiceNumber:invoiceNumber},function(err,docs){
      console.log(docs,'docsInvo')
        for(var i = 0;i<docs.length; i++){
         // console.log(docs[i].newMass,'serima')
        arrV.push(docs[i].subtotal)
       // arrCases.push(docs[i].cases)
          }


          for(var n = 0;n<docs.length; n++){
            // console.log(docs[i].newMass,'serima')
         
           arrCases.push(docs[n].cases)
             }

         
          //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
         //console.log(arrV,'arrV')
        
        //InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
        number1=0;
        number2 = 0
        for(var z in arrV) { number1 += arrV[z]; }
        number1.toFixed(2)
      
        for(var x in arrCases) { number2 += arrCases[x]; }
        //console.log(cases,'cases')
       let num = number2 + cases
       
       /*if(docs.length == 0){
        closingStock = openingStock
      }
      else{
        closingStock = openingStock - number2
      }*/

       console.log(num,'num',closingStock,arrCases,cases,'cases',number2)
       if(cases <= expCases){
      
       
        let subtotalX = number1 + subtotal
          
          var stock = new SalesInvoPayments();
          
          stock.date =date
          stock.code =code
          stock.invoiceNumber = invoiceNumber
          stock.customer = customer
          stock.customerAddress = customerAddress
          stock.customerMobile = customerMobile
          stock.product = product
          stock.price = price
          stock.amount = amount
          //stock.openingStock = closingStock 
          //stock.closingStock = openingStock - num
          stock.openingStock = openingStock
          stock.closingStock = closingStock
          stock.closingStockAfterSales = closingStockAfterSales
          stock.cases = cases
          stock.units = units
          stock.paymentMethod = paymentMethod
          //stock.missingCases = openingStock - closingStock
          stock.missingCases = missingCases
          stock.year = year
          stock.month = month
          stock.totalCases = totalCases
          stock.batchId = batchId
          stock.cumulativeTotal = subtotalX
          stock.refNumber = refNumber
          stock.missingUnits = missingUnits
          stock.missingBalance = missingBalance
          stock.subtotal = subtotal
          stock.dateValue = dateValue
          stock.salesPerson = salesPerson
          stock.salesPersonId = salesPersonId
          
          stock.save()
          .then(pro =>{

            StockUpdate.find({product:product,code:code},function(err,docs){
              let sId = docs[0]._id
              let nSales = docs[0].sales - cases
              if(nSales <= 0){
                StockUpdate.findByIdAndUpdate(sId,{$set:{sales:nSales,status:'closed'}},function(err,koc){

                })
              }else{
                StockUpdate.findByIdAndUpdate(sId,{$set:{sales:nSales}},function(err,koc){

                })
              }
            })
          
            SalesInvoPayments.find({invoiceNumber:invoiceNumber},function(err,joc){
              if(joc.length > 0){
              let uId = joc[0]._id
              SalesInvoPayments.findByIdAndUpdate(uId,{$set:{cumulativeTotal:subtotalX}},function(err,joc){

              })
            }
            })
            res.send(pro)
          
          })
          
        }else{

        res.send(arrE)
        }
          
        })
      }else{
        
        InvoNum.find(function(err,doc){
          //let invoiceNum = doc[0].num
          let invoId = doc[0]._id
      
      
      User.findByIdAndUpdate(uid,{$set:{invoiceNumber:invo2}},function(err,docs){
      
      })
     // invoiceNum++
      
      InvoNum.findByIdAndUpdate(invoId,{$set:{num:invo2}},function(err,tocs){
      
      })
        res.send(arrF)

    })
      }
      }else{
        
      SalesInvoPayments.find({invoiceNumber:invoiceNumber},function(err,docs){
        console.log(docs,'docsInvo')
          for(var i = 0;i<docs.length; i++){
           // console.log(docs[i].newMass,'serima')
          arrV.push(docs[i].subtotal)
         // arrCases.push(docs[i].cases)
            }
  
  
            for(var n = 0;n<docs.length; n++){
              // console.log(docs[i].newMass,'serima')
           
             arrCases.push(docs[n].cases)
               }
  
           
            //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
           //console.log(arrV,'arrV')
          
          //InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
          number1=0;
          number2 = 0
          for(var z in arrV) { number1 += arrV[z]; }
          number1.toFixed(2)
        
          for(var x in arrCases) { number2 += arrCases[x]; }
          //console.log(cases,'cases')
         let num = number2 + cases
         
         /*if(docs.length == 0){
          closingStock = openingStock
        }
        else{
          closingStock = openingStock - number2
        }*/
  
         console.log(num,'num',closingStock,arrCases,cases,'cases',number2)
         if(cases <= expCases){
        
         
          let subtotalX = number1 + subtotal
            
            var stock = new SalesInvoPayments();
            
            stock.date =date
            stock.code =code
            stock.invoiceNumber = invoiceNumber
            stock.customer = customer
            stock.customerAddress = customerAddress
            stock.customerMobile = customerMobile
            stock.product = product
            stock.price = price
            stock.amount = amount
            //stock.openingStock = closingStock 
            //stock.closingStock = openingStock - num
            stock.openingStock = openingStock
            stock.closingStock = closingStock
            stock.closingStockAfterSales = closingStockAfterSales
            stock.cases = cases
            stock.units = units
            stock.paymentMethod = paymentMethod
            //stock.missingCases = openingStock - closingStock
            stock.missingCases = missingCases
            stock.year = year
            stock.month = month
            stock.totalCases = totalCases
            stock.batchId = batchId
            stock.cumulativeTotal = subtotalX
            stock.refNumber = refNumber
            stock.missingUnits = missingUnits
            stock.missingBalance = missingBalance
            stock.subtotal = subtotal
            stock.dateValue = dateValue
            stock.salesPerson = salesPerson
            stock.salesPersonId = salesPersonId
            
            stock.save()
            .then(pro =>{
  
              StockUpdate.find({product:product,code:code},function(err,docs){
                let sId = docs[0]._id
                let nSales = docs[0].sales - cases
                if(nSales <= 0){
                  StockUpdate.findByIdAndUpdate(sId,{$set:{sales:nSales,status:'closed'}},function(err,koc){
  
                  })
                }else{
                  StockUpdate.findByIdAndUpdate(sId,{$set:{sales:nSales}},function(err,koc){
  
                  })
                }
              })
            
              SalesInvoPayments.find({invoiceNumber:invoiceNumber},function(err,joc){
                if(joc.length > 0){
                let uId = joc[0]._id
                SalesInvoPayments.findByIdAndUpdate(uId,{$set:{cumulativeTotal:subtotalX}},function(err,joc){
  
                })
              }
              })
              res.send(pro)
            
            })
            
          }else{
          res.send(arrE)
          }
            
          })
      }
      })
          })
          

router.get('/closeBatch/:id/:id2',isLoggedIn,function(req,res){
  var batchId = req.params.id
  var batchCode = req.params.id2
 

  BatchStockUpdate.findById(batchId,function(err,doc){
    let salesPerson = doc.salesPerson
    let date = doc.date
    let month = doc.month
    let year = doc.year

     res.render('accounts5/update',{month:month, year:year,salesPerson:salesPerson,date:date,batchId:batchId,batchCode:batchCode})
  })

 

})


          router.post('/closeBatch/:id/:id2',isLoggedIn,function(req,res){

            let arrV = []
            let number1
            var date = req.body.date
            var totalBeforeExpenses = req.body.totalBeforeExpenses
            var amount = req.body.amount
            var totalAfterExpenses = req.body.totalAfterExpenses
            var code = req.params.id2
            var salesPerson = req.body.salesPerson
            var driver = req.body.driver
            var batchId = req.params.id
            var month = req.body.month
            var year = req.body.year



            req.check('date','Date').notEmpty();
            req.check('totalBeforeExpenses','totalBeforeExpenses').notEmpty();
            req.check('totalAfterExpenses','Enter totalAfterExpenses').notEmpty();
            req.check('driver','Enter driver').notEmpty();
                     
                            
                         
                           
              
                    
                 
            var errors = req.validationErrors();
                if (errors) {
            
                
                  req.session.errors = errors;
                  req.session.success = false;
                  req.flash('danger', req.session.errors[0].msg);
          
          
              res.redirect('/accounts5/closeBatch/'+batchId+'/'+code);
                  
                
              }
          
              else{

            var batch = new Suspense();

  

  batch.date = date
  batch.totalBeforeExpenses = totalBeforeExpenses
  batch.amount = amount
  batch.totalAfterExpenses = totalAfterExpenses
  batch.refNumber = code
  batch.salesPerson = salesPerson
  batch.driver = driver
  batch.month= month
  batch.batchId= batchId
  batch.year= year
  batch.save()
  .then(pro =>{
StockUpdate.find({code:code},function(err,docs){

  

    for(var i = 0;i<docs.length; i++){
      // console.log(docs[i].newMass,'serima')
     arrV.push(docs[i].sales)
    // arrCases.push(docs[i].cases)
       }


     number1=0;
  
     for(var z in arrV) { number1 += arrV[z]; }

     if(number1 <= 0){
BatchStockUpdate.findByIdAndUpdate(batchId,{$set:{status:"closed",totalBeforeExpenses:totalBeforeExpenses,
totalAfterExpenses:totalAfterExpenses,suspenseId:pro._id,suspenseAmount:amount}},function(err,locs){

})
     }else{
      BatchStockUpdate.findByIdAndUpdate(batchId,{$set:{totalBeforeExpenses:totalBeforeExpenses,
      totalAfterExpenses:totalAfterExpenses,suspenseId:pro._id,suspenseAmount:amount}},function(err,locs){
      
      })
     }

    })
    
res.redirect('/accounts5/updatedStock')
   
    })
  }
          })

        
      
      
       
          router.get('/reloadRemitt/:id',isLoggedIn,function(req,res){
            var id = req.params.id
         
             SalesInvoPayments.find({refNumber:id},function(err,docs){
               res.send(docs)
             })
          })
      
      
          router.get('/autocompleteCustomerRemitt/',isLoggedIn, function(req, res, next) {
            var id = req.user._id
        
        
              var regex= new RegExp(req.query["term"],'i');
             
              var itemFilter =Customer.find({ fullname:regex},{'fullname':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
            
              
              itemFilter.exec(function(err,data){
             
           
            console.log('data',data)
            
            var result=[];
            
            if(!err){
               if(data && data.length && data.length>0){
                 data.forEach(shop=>{
           
        
           
               
            
                    
                   let obj={
                     id:shop._id,
                     label: shop.fullname
          
                 
               
                 
                   
                    
            
                     
                   };
                  
                   result.push(obj);
                
                  })
              
            
               }
             
               res.jsonp(result);
          
              }
            
            })
           
            });
          
         
        //this route shop
            router.post('/autoCustomerRemitt',isLoggedIn,function(req,res){
                var code = req.body.code
          
        
            
                
               
                Customer.find({fullname:code},function(err,docs){
               if(docs == undefined){
                 res.redirect('/')
               }else
        
                  res.send(docs[0])
                })
              
              
              })
         
      
      
              router.get('/autocompleteProductRemitt/',isLoggedIn, function(req, res, next) {
                var id = req.user._id
            
                  var code = req.user.refNumber
                  var regex= new RegExp(req.query["term"],'i');
                 
                  var itemFilter =StockUpdate.find({product:regex,code:code,status:'null'},{'product':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
                
                  
                  itemFilter.exec(function(err,data){
                 
               
                console.log('data',data)
                
                var result=[];
                
                if(!err){
                   if(data && data.length && data.length>0){
                     data.forEach(shop=>{
               
            
               
                   
                
                        
                       let obj={
                         id:shop._id,
                         label: shop.product
              
                     
                   
                     
                       
                        
                
                         
                       };
                      
                       result.push(obj);
                    
                      })
                  
                
                   }
                 
                   res.jsonp(result);
              
                  }
                
                })
               
                });
              
             
            //this route shop
                router.post('/autoProductRemitt',isLoggedIn,function(req,res){
                    var product = req.body.code
              
                    var code = req.user.refNumber
                
                    
                   
                    StockUpdate.find({product:product,code:code},function(err,docs){
                   if(docs == undefined){
                     res.redirect('/')
                   }else
            
                      res.send(docs[0])
                    })
                  
                  
                  })
             
          
      
    
router.get('/suspense',isLoggedIn,function(req,res){
  Suspense.find(function(err,docs){
  
    let arr=[]
    for(var i = docs.length - 1; i>=0; i--){
  
      arr.push(docs[i])
    }
  
    res.render('accounts5/suspense',{listX:arr})
  
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
