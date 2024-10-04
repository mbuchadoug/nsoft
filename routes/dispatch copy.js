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







router.get('/fifoUpdate',isLoggedIn,function(req,res){
  
    BatchR.find(function(err,docs){
      for(var i = 0;i<docs.length;i++){
        let id = docs[i]._id
        let refNumber = docs[i].refNumber
        StockV.find({refNumber:refNumber},function(err,locs){
          let total = locs.length
        StockV.find({refNumber:refNumber,status:"dispatched"},function(err,vocs){
          let totalDispatched = vocs.length
          let remainingBal = locs.length - vocs.length
  
          if(total == totalDispatched){
            BatchR.findByIdAndUpdate(id,{$set:{status:"dispatched",statsTotalCases:total,
          statsCasesDispatched:totalDispatched,statsRemainingCases:remainingBal}},function(err,nocs){

            })
          }
          else{
          BatchR.findByIdAndUpdate(id,{$set:{statsTotalCases:total,
          statsCasesDispatched:totalDispatched,statsRemainingCases:remainingBal}},function(err,nocs){

            })
          }
        })
        })
      }
    

    res.redirect('/dispatch/fifoDateUpdate')
  })
  })

  router.get('/fifoDateUpdate',isLoggedIn,function(req,res){

  Product.find(function(err,yocs){

    for(var z = 0; z<yocs.length;z++){
  let product = yocs[z].name

  BatchR.find({status:'received',product:product}).lean().sort({"dateValue":1}).then(docs=>{
  for(var i = 0;i<docs.length;i++){
  let id = docs[i]._id
  let fifoPosition = i
  let refNumber = docs[i].refNumber
  console.log(i,'i')
  BatchR.findByIdAndUpdate(id,{$set:{fifoPosition:fifoPosition}},function(err,nocs){

 

})
  }

  })

}
  
  //res.redirect('/batchDispatch')
  res.redirect('/dispatch/palletUpdate')
  })


  })




  ////////////////
  
  router.get('/palletUpdate',isLoggedIn,function(req,res){
  
    BatchR.find(function(err,docs){
      for(var i = 0;i<docs.length;i++){
        let id = docs[i]._id
        let refNumber = docs[i].refNumber
        StockV.find({refNumber:refNumber},function(err,locs){
          if(locs){
          let total = locs.length - 1

          //let idV =locs[total]._id
          let pallets = locs[total].pallet
        BatchR.findByIdAndUpdate(id,{$set:{pallet:pallets}},function(err,hocs){


        })
      }
        })
      }
    

      //res.redirect('/dispatch/batchDispatch')
      res.redirect('/dispatch/updatePalletPos')
  })
  })



  
router.get('/updatePalletPos',function(req,res){
  BatchR.find({},function(err,focs){
    let size = focs.length - 1

    let pallet = focs[size].pallet
    let refNumber = focs[size].refNumber

    StockV.find({pallet:pallet,refNumber:refNumber},function(err,docs){
      for(var i = 0;i<docs.length;i++){
        let id = docs[i]._id
        StockV.findByIdAndUpdate(id,{$set:{position:'last'}},function(err,mocs){

        })
      }
    })

    //res.redirect('/dispatch/batchDispatch')
    res.redirect('/dispatch/batchNumberUpdate')
  })

})
  
router.get('/replace',function(req,res){
    res.render('dispatcher/batchReplace')
  })
  
  
  router.post('/replace',function(req,res){
    var barcodeNumber = req.body.code
    var barcodeNumber1 = req.body.code1
    var reason = req.body.reason
    console.log(reason,'reason5')
    var arr3 = ['1','2','3']
    var arr4 =['1','2','3','4']
    var arr5 =['1','2','3','4','5']
    var arr6 =['1','2','3','4','5','6']
    var arr7 =['1','2','3','4','5','6','7']
    var arr0 =[]
    let id
    var arr1 =['1']
    StockV.find({barcodeNumber:barcodeNumber},function(err,docs){
  if(docs.length > 0){
    //console.log(docs,'docs')
    let status = docs[0].status
    if(status == 'dispatched' || status == 'received' ){
      id = docs[0]._id
        
      let refNumber = docs[0].refNumber
      let pallet = docs[0].pallet
    
  
      StockV.find({barcodeNumber:barcodeNumber1},function(err,locs){
        if(locs.length > 0){
  let status2 = locs[0].status
  if(status2 == 'received'){
  
    let id2 = locs[0]._id
   console.log(id,'stooge')
    StockV.findByIdAndUpdate(id,{$set:{status:reason,replacementCase:barcodeNumber1,returnsType:'warehouse',type:'replaced'}},function(err,vocs){
  
    })
    StockV.findByIdAndUpdate(id2,{$set:{pallet:pallet,refNumber:refNumber,status:'dispatched',type:'replacement',replacedBarcode:barcodeNumber}},function(err,vocs){ 
      if(!err){
        res.send(arr1)
      }
  
    })
  }else{
    res.send(arr3)
  }
        }else{
          res.send(arr4)
        }
      })
      
  
    }
  }else{
    res.send(arr0)
  }
    })
  })
  
  
  router.get('/warehouseRtns',function(req,res){
    StockV.find({returnsType:"warehouse"},function(err,docs){
  
      res.render('dispatcher/warehouseRtns',{listX:docs})
    })
  })

  

  router.get('/batchNumberUpdate',isLoggedIn,function(req,res){
    var id = req.user._id
   
      InvoNum.find(function(err,doc){
        let invoiceNum = doc[0].num
        let invoId = doc[0]._id
    
    
    User.findByIdAndUpdate(id,{$set:{invoiceNumber:invoiceNum}},function(err,docs){
    
    })
    invoiceNum++
    
    InvoNum.findByIdAndUpdate(invoId,{$set:{num:invoiceNum}},function(err,tocs){
    
    })

    res.redirect('/dispatch/batchDispatch')
    
      })
    
    })

    router.get('/batchDispatch',isLoggedIn,function(req,res){
      /*var errorMsg = req.flash('danger')[0];
    var successMsg = req.flash('success')[0];*/
    var batchNumber = req.user.invoiceNumber
    var pro = req.user
    var readonly = 'hidden'
    var read =''
  
    SalesList.find(function(err,nocs){
    Truck.find(function(err,vocs){
    BatchR.find({status:'received'}).lean().sort({fifoPosition:1}).then(docs=>{
    var arr = docs
    var arr1 = nocs
    var arr2 = vocs
    res.render('dispatcher/batchDisp',{arr:arr,batchNumber:batchNumber,pro:pro,user:req.query,readonly:readonly,read:read,arr1:arr1,arr2:arr2})
    })
    })
  })
     
    })
  
  
    ////////////////
  
    router.post('/batchDispatch',isLoggedIn,function(req,res){
  
      //var refNumber = req.body.referenceNumber
      var m = moment()
      var year = m.format('YYYY')
      var month = m.format('MMMM')
      var date = req.body.date
      let mformat =  moment(date).format('l');
      let dateValue = moment(date).valueOf()
      var dispatcher = req.user.fullname
      var time = req.body.time
      //var warehouse = req.body.warehouse
      var number1 
    var product = req.body.product
      var salesPerson = req.body.salesPerson
      var truck = req.body.truck
      var casesX = req.body.cases
      var batchNumber = req.body.batchNumber
      
  let reg = /\d+\.*\d*/g;
  let resultCases = casesX.match(reg)
  let cases = Number(resultCases)
      var destination = req.body.destination
      var read = 'readonly'
      var arr16 = []
      //var refNumber = req.body.refNumber
      var reason = req.body.reason
      var readF2 = 'disabled'
      var casesBatch = cases
      console.log(reason,'reason')
     // var lotNumber = req.body.lotNumber
      //var location = req.body.location
    var readonly = ''
    var stock = req.body.stock
    var readF = 'hidden'
      let date6 =  moment(date).format('l');
    let code
    //let shift = req.user.shift
     let date7 =  date6.replace(/\//g, "");
    
      console.log(date6,'date')
  
      
    
   
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
       /*req.flash('danger', req.session.errors[0].msg);
       res.redirect('/batchDispatch');*/
       /*BatchR.find({status:'received'}).lean().sort({fifoPosition:1}).then(docs=>{
        var arr = docs*/
    
        res.render('dispatcher/batchDisp',{user:req.body, use:req.user,errors:req.session.errors,readonly:readonly})
  
      // })
      
      }else{
  
  
     
  
  
  
           if(stock < cases){
    
           
           /* BatchR.find({status:'received'}).lean().sort({fifoPosition:1}).then(docs=>{
              var arr = docs*/
            req.session.message = {
              type:'errors',
              message:stock+' '+'cases Left for '+' '+product
            }
            res.render('dispatcher/batchDisp',{user:req.body, use:req.user,message:req.session.message,readonly:'hidden'})
          //})
          }
          else{
  
            /*StockV.findOne({'date':date,'salesPerson':salesPerson})
            .then(oc=>{
          
              if(oc && reason =='' ){
                BatchR.find({status:'received'}).lean().sort({fifoPosition:1}).then(docs=>{
                  var arr = docs
                console.log(reason,'reason')
                req.session.message = {
                  type:'errors',
                  message:'Reason for Additional Batch to'+' '+salesPerson
                }
                res.render('kambucha/batchDisp',{user:req.body, use:req.user,message:req.session.message,readonly:readonly,
                  read:read,readF:readF,readF2:readF2})
  
                })
          
              }else{*/
  //batch looping
  let count = 0
  let uid = req.user._id
   BatchR.find({product:product},function(err,hocs){
     for(var i = 0; i<hocs.length;i++){
       casesBatch - hocs[i].cases
       if(cases >=0){
         count++
       }
     }
  User.findByIdAndUpdate(uid,{$set:{batchCount:count,currentCount:1}},function(err,tocs){
  
  })
                 
  
  BatchR.find({fifoPosition:0},function(err,loc){
    let batchId = loc[0]._id
    let product = loc[0].product
    let warehouse = loc[0].warehouse
    let openingBal, closingBal
    let refNumber = loc[0].refNumber
    console.log(refNumber,'refNumber33')
    let batchdCases 

    
    if(cases >= loc[0].cases){
       batchdCases =loc[0].cases
    }else{
      batchdCases = cases
    }
    let dispatchedPallets
    let dispatchedPalletsR
    let totalPallets = cases / 10
    let nextPallet
   
    StockV.find({refNumber:refNumber,status:"dispatched"},function(err,mocs){
      dispatchedPallets = mocs.length / 10
      dispatchedPalletsR = mocs.length % 10

console.log(dispatchedPallets,dispatchedPalletsR,'WR')
if(dispatchedPallets == 0 && dispatchedPalletsR == 0){
  nextPallet = 1
  console.log(0,'flint')
}

if(dispatchedPallets > 0 && dispatchedPalletsR == 0){
  nextPallet = dispatchedPallets++
  console.log(dispatchedPallets,'myWorld')
  nextPallet = dispatchedPallets++
  console.log(nextPallet,'flint44')
}
      else if(dispatchedPallets == 0 && dispatchedPalletsR > 0 ){
        nextPallet = 1
        console.log(1,'1')
      }else if(dispatchedPallets > 0 && dispatchedPalletsR == 0 && totalPallets > dispatchedPallets ){
              nextPallet = dispatchedPallets++
           
              console.log(dispatchedPallets,'myWorld2')
              nextPallet = dispatchedPallets++
      }
      else if(dispatchedPallets > 0 && dispatchedPalletsR > 0){
            nextPallet = dispatchedPallets
            console.log(1,'3')
      }else if(dispatchedPallets > 0 && dispatchedPalletsR > 0 && totalPallets > dispatchedPallets ){
        nextPallet = dispatchedPallets
        console.log(1,'4')
      }else if(dispatchedPallets == 0 && dispatchedPalletsR == 0 ){
        nextPallet = 1
        console.log(1,'5')
      }
  

   
    SaleStock.find({product:product,salesPerson:salesPerson},function(err,mocs){
      if(mocs.length > 0){
         openingBal = mocs[0].holdingCases
         closingBal = mocs[0].holdingCases + cases
      }else{
        openingBal = 0
        closingBal = cases
      }
     
      
      RefNoDisp.find({refNumber:refNumber},function(err,docs){
        let size = docs.length + 1
        let refNo = date7+'B'+size+'D'+refNumber
        console.log(refNo,'refNo')
  
     
   
                var book = new BatchD()
                book.date = date
                book.openingStock = openingBal
                book.closingStock = closingBal
                book.cases = batchdCases
                book.batchTotalCases = cases
                book.truck = truck
                book.salesPerson = salesPerson
                book.time = time
                book.status = 'pending'
                book.destination = destination
                //book.warehouse = warehouse
                book.product = product
                book.refNumber = refNumber
                book.dispatchMformat = mformat
                book.dateValueDispatch = dateValue
                book.dispatcher = dispatcher
                book.year = year
                book.month = month
          
                book.save()   
                .then(pro =>{
                  let pallet = batchdCases / 10
                  let remainderCases = batchdCases % 10
                   let currentPallet = 0
                   let palletCasesBatch
                   console.log(nextPallet,remainderCases,'pallet','remainderCases')

                   StockV.find({pallet:nextPallet,refNumber:refNumber},function(err,jocs){
                   
                     palletCasesBatch = jocs.length
                  
                 
        var id = req.user._id
        User.findByIdAndUpdate(id,{$set:{date:date,cases:cases, truck:truck, salesPerson:salesPerson, time:time, openingStock:openingBal,
        product:product,refNumber:refNumber,refNumDispatch:refNo,destination:destination,batchId:pro._id,batchCount:count,currentCount:1,
        casesBatch:cases,currentCases:0,pallets:pallet,remainderCases:remainderCases,currentPallet:nextPallet,currentBatchCount:0,palletCasesBatch:palletCasesBatch }},function(err,docs){
    
        })
      })
  
        
      var book = new RefNoDisp();
      book.refNumber = refNumber
      book.refNumber2 = refNo
      book.type = 'dispatch'
  
      book.save()
      .then(pro =>{
  
       
  
      })
  
  
       
  console.log(refNumber,'refNumber555')
      if(pallet >=1){
        res.redirect('/dispatch/dispatchStock/'+refNo)
      }
      else{

        User.findByIdAndUpdate(id,{$set:{pallets:1,currentPallet:1}},function(err,focs){

      
        res.redirect('/dispatch/dispatchStockCase2/'+refNo)

      })
      }
  
  
        //res.redirect('/dispatchStock/'+refNumber)
      })
    })

  })
  })
  })
  
  })
     
  
      
    //})
  //})
  
  
  }
  //})
    }
    })
  
  
  
  
    /*}
  
    
    })*/
  
  
  
    router.get('/batchDispatch2',function(req,res){
      let product = req.user.product
      let salesPerson = req.user.salesPerson
      let date = req.user.date
      var m = moment()
      var year = m.format('YYYY')
      var month = m.format('MMMM')
      let mformat =  moment(date).format('l');
      let dateValue = moment(date).valueOf()
      let time = req.user.time
      let destination = req.user.destination
      let truck = req.user.truck
      
      let cases = req.user.casesBatch
      let batchCount = req.user.currentBatchCount
      BatchR.find({fifoPosition:batchCount},function(err,loc){
        let refNumber = loc[0].refNumber
  
        let batchdCases 
        if(cases >= loc[0].cases){
           batchdCases =loc[0].cases
        }else{
          batchdCases = cases
        }
  
        let pallet = batchdCases / 10
        let remainderCases = batchdCases % 10
         let currentPallet = 0
      RefNoDisp.find({refNumber:refNumber},function(err,docs){
        let size = docs.length + 1
        let refNo = date7+'B'+size+'D'+refNumber
        console.log(refNo,'refNo')
  
     
   
                var book = new BatchD()
                book.date = date
                book.openingStock = openingBal
                book.closingStock = closingBal
                book.cases =batchdCases
                book.truck = truck
                book.salesPerson = salesPerson
                book.time = time
                book.pallets = pallet
                book.currentPallet = 0
                book.remainderCases = remainderCases
                book.status = 'pending'
                book.destination = destination
                //book.warehouse = warehouse
                book.product = product
                book.refNumber = refNumber
                book.dispatchMformat = mformat
                book.dateValueDispatch = dateValue
                book.dispatcher = dispatcher
                book.year = year
                book.month = month
          
                book.save()   
                .then(pro =>{
  
        var id = req.user._id
        User.findByIdAndUpdate(id,{$set:{date:date,cases:cases, truck:truck, salesPerson:salesPerson, time:time, 
        product:product,refNumber:refNumber,refNumDispatch:refNo,destination:destination,batchId:pro._id,pallets:pallet,remainderCases:remainderCases,currentPallet:currentPallet }},function(err,docs){
    
        })
  
        
      var book = new RefNoDisp();
      book.refNumber = refNumber
      book.refNumber2 = refNo
      book.type = 'dispatch'
  
      book.save()
      .then(pro =>{
  
       
  
      })
  
  
      if(pallet >=1){
        res.redirect('/dispatch/dispatchStock/'+refNo)
      }
      else{
        res.redirect('/dispatch/dispatchStockCase/'+refNo)
      }
       
         
    })
     
    })
  })
    })
    
  
  
  router.get('/updatePallet',function(req,res){
    BatchR.find({},function(err,focs){
      let size = focs.length - 1
  
      let pallet = focs[size].pallet
      let refNumber = focs[size].refNumber
  
      StockV.find({pallet:pallet,refNumber:refNumber},function(err,docs){
        for(var i = 0;i<docs.length;i++){
          let id = docs[i]._id
          StockV.findByIdAndUpdate(id,{$set:{position:'last'}},function(err,mocs){
  
          })
        }
      })
  
      
      
      
      })
    
  })
  
  
  
  
  
  
  
  
  
  
  
  
    router.get('/dispatchStock/:id',isLoggedIn,function(req,res){
  
      var date = req.user.date
      var time = req.user.time
      var salesPerson = req.user.salesPerson
      var truck = req.user.truck
      var cases = req.user.cases
      var id = req.user._id
      var openingStock = req.user.openingBal
      var refNumber = req.user.refNumber
      var product = req.user.product
      var currentPallet = req.user.currentPallet
      var destination = req.user.destination
      var pallets = req.user.pallets
      var remainderCases = req.user.remainderCases
      var refNumberDispatch = req.user.refNumberDispatch
      var batchId = req.user.batchId
      var openingStock 
  
      BatchR.find({fifoPosition:0},function(err,loc){
      //let refNumber = loc[0].refNumber
      let warehouse = loc[0].warehouse
      const refNumber2 = JSON.stringify(refNumber)
      User.findByIdAndUpdate(id,{$set:{refNumber:refNumber,warehouse:warehouse}},function(err,bocs){
  
   
      Product.find(function(err,docs){
       res.render('dispatcher/dispStock2',{listX:docs,date:date,time:time,salesPerson:salesPerson, truck:truck,
      product:product,batchId:batchId,cases:cases,refNumber:refNumber,refNumber2:refNumber2,warehouse:warehouse,destination:destination,
    refNumberDispatch:refNumberDispatch,pallets:pallets,remainderCases:remainderCases,currentPallet:currentPallet})
      })
    })
  
  })
    })
  
  
  
  
    router.get('/dispatchStockCase/:id',isLoggedIn,function(req,res){
  
      var date = req.user.date
      var time = req.user.time
      var salesPerson = req.user.salesPerson
      var truck = req.user.truck
      var cases = req.user.cases
      var id = req.user._id
      var product = req.user.product
      var destination = req.user.destination
      var remainderCases = req.user.remainderCases
      var refNumberDispatch = req.user.refNumberDispatch
      var batchId = req.user.batchId
  
      BatchR.find({fifoPosition:0},function(err,loc){
      let refNumber = loc[0].refNumber
      let warehouse = loc[0].warehouse
      const refNumber2 = JSON.stringify(refNumber)
      User.findByIdAndUpdate(id,{$set:{refNumber:refNumber,warehouse:warehouse}},function(err,bocs){
  
   
      Product.find(function(err,docs){
       res.render('dispatcher/dispStockCase',{listX:docs,date:date,time:time,salesPerson:salesPerson, truck:truck,
      product:product,batchId:batchId,cases:cases,refNumber:refNumber,refNumber2:refNumber2,warehouse:warehouse,destination:destination,
    refNumberDispatch:refNumberDispatch,remainderCases:remainderCases})
      })
    })
  
  })
    })
  
  
  
    
    router.get('/dispatchStockCase2/:id',isLoggedIn,function(req,res){
  
      var date = req.user.date
      var time = req.user.time
      var salesPerson = req.user.salesPerson
      var truck = req.user.truck
      var cases = req.user.cases
      var pallet = req.user.pallets
      var id = req.user._id
      var product = req.user.product
      var destination = req.user.destination
      var remainderCases = req.user.remainderCases
      var refNumberDispatch = req.user.refNumberDispatch
      var batchId = req.user.batchId
  
      BatchR.find({fifoPosition:0},function(err,loc){
      let refNumber = loc[0].refNumber
      let warehouse = loc[0].warehouse
      const refNumber2 = JSON.stringify(refNumber)
      User.findByIdAndUpdate(id,{$set:{refNumber:refNumber,warehouse:warehouse}},function(err,bocs){
  
   
      Product.find(function(err,docs){
       res.render('dispatcher/dispCase2',{listX:docs,date:date,time:time,salesPerson:salesPerson, truck:truck,pallet:pallet,
      product:product,batchId:batchId,cases:cases,refNumber:refNumber,refNumber2:refNumber2,warehouse:warehouse,destination:destination,
    refNumberDispatch:refNumberDispatch,remainderCases:remainderCases})
      })
    })
  
  })
    })
  
  
  
  
  router.get('/closePallet/:id',isLoggedIn,function(req,res){
  let currentPallet = req.user.currentPallet
  let pallets = req.user.pallets
  let palletCasesBatch
  let currentBatchCount = req.user.currentBatchCount
  let batchCount = req.user.batchCount
  let casesBatch = req.user.casesBatch
  console.log(casesBatch,'casesBatch')
  let uid = req.user._id
  let currentCases = req.user.currentCases
  let id = req.params.id
    BatchD.findById(id,function(err,doc){
      if(doc){
      let refNumber = doc.refNumber
      let casesBatch2 = doc.cases - 10
      
      let casesBatch3 = doc.cases
      let cases = doc.cases
      let scannedCases = currentCases 
      casesBatch - scannedCases
      let upCasesBatch =  casesBatch - scannedCases
      let upCasesBatch2 = casesBatch3 - scannedCases
      User.findByIdAndUpdate(uid,{$set:{casesBatch:upCasesBatch}},function(err,socs){
  
      })
      if(cases == scannedCases){
        currentBatchCount++
        if(currentBatchCount == batchCount){
  BatchD.findByIdAndUpdate(id,{$set:{batchStatus:'closed'}},function(err,locs){
  
  })
  
  User.findByIdAndUpdate(uid,{$set:{casesBatch:casesBatch}},function(err,focs){
  
  })
  
  res.redirect('/dispatch/fifoUpdate')
  
        } else{
  
  StockV.find({pallet:currentPallet,refNumber:refNumber},function(err,socs){

    palletCasesBatch = socs.length

          User.findByIdAndUpdate(uid,{$set:{casesBatch:casesBatch,palletCasesBatch:palletCasesBatch,currentPallet:currentPallet,currentBatchCount:currentBatchCount}},function(err,focs){
  
          })
  res.redirect('/dispatch/batchDispatch2')

})
  
        }
      }else{
        currentPallet++
        StockV.find({pallet:currentPallet,refNumber:refNumber},function(err,socs){

          palletCasesBatch = socs.length
        User.findByIdAndUpdate(uid,{$set:{casesBatch:casesBatch2,palletCasesBatch:palletCasesBatch,cases:casesBatch2,currentPallet:currentPallet}},function(err,focs){
  
        })

      })
        let palletV = upCasesBatch / 10
        let remainderCases = upCasesBatch2 % 10
  
        console.log(palletV,'palletV')
  
  
        if(palletV >=1){

          StockV.find({refNumber:refNumber,status:"received"},function(err,cocs){
            for(var i = 0; i<cocs.length;i++){
              let stockId = cocs[i]._id
              console.log(casesBatch2,'casesBatch2',stockId)
              StockV.findByIdAndUpdate(stockId,{$set:{casesBatch:casesBatch2}},function(err,focs){

              })
            }

            res.redirect('/dispatch/dispatchStock/'+refNumber)

          })

        }
        else{
          let upNew = remainderCases * 2
          let rem2 = upNew - remainderCases
          console.log(rem2,'rem2')
        User.findByIdAndUpdate(uid,{$set:{remainderCases:remainderCases,casesBatch:remainderCases,cases:remainderCases}},function(err,docs){
  
          res.redirect('/dispatch/dispatchStockCase/'+refNumber)
  
        })
  
        
        }
         
  
      }
    }
    })
  })
  
  
  router.get('/salesStockUpdate/:id',function(req,res){
    var id = req.params.id
    BatchD.findById(id,function(err,doc){

      let product = doc.product
      let salesPerson = doc.salesPerson
      let casesReceived = doc.cases

      Product.find({name:product},function(err,loc){
        if(loc){

        
        let usd = loc[0].usd
      
      

     

 

      SaleStock.find({salesPerson:salesPerson,product:product},function(err,docs){
  
        if(docs.length == 0)
        {

          var sale =SaleStock();
          sale.product = product
          sale.casesReceived = casesReceived
          sale.openingBal = 0
          sale.holdingCases = casesReceived
          sale.salesPerson = salesPerson
          sale.qty = casesReceived * 12
          sale.price = usd
          
          sale.save()
          .then(pas =>{

            BatchD.findByIdAndUpdate(id,{$set:{openingBalance:0,closingBalance:casesReceived,status:"dispatched",dispatchStatus:"dispatched"}},function(err,vocs){

            })

          })
        }else{
          var  idX  = docs[0]._id
            console.log(idX)
            let openingBal = docs[0].holdingCases
            var closingBal = docs[0].holdingCases + doc.cases
            let caseR = doc.cases
            let qty = docs[0].holdingCases + doc.cases * 12
            
            SaleStock.findByIdAndUpdate(idX,{$set:{casesReceived:caseR,openingBal:openingBal,holdingCases:closingBal,qty:qty}},function(err,locs){

            })
            BatchD.findByIdAndUpdate(id,{$set:{openingBalance:openingBal,closingBalance:closingBal,status:"dispatched",dispatchStatus:"dispatched"}},function(err,vocs){

            })
        }
      
      })
    }
      
    })



res.redirect('/dispatch/statusUpdate')
    })
  
  })

router.get('/statusUpdate',function(req,res){

StockV.find({status:'dispatched',dispatchStatus:'pending'},function(err,docs){
  for(var i = 0; i<docs.length;i++){
    let id = docs[i]._id
    StockV.findByIdAndUpdate(id,{$set:{dispatchStatus:'dispatched'}},function(err,locs){

    })
  }
  res.redirect('/dispatch/fifoUpdate')
})

})
 



  router.post('/dispStock3/:id',isLoggedIn, (req, res) => {
    var pro = req.user
    var m = moment()
    var code = req.params.id
    var mformat = m.format("L")
    console.log(code,'chileshe')

    StockV.find({refNumDispatch:code,status:'dispatched'}).lean().sort({'dateValueDispatch':1}).then(docs=>{
    
   
      res.send(docs)
              })

    }); 




  
////////////////////


router.post('/dispatchScan',isLoggedIn, function(req,res){
 
  var date2 = req.user.date
  var product = req.user.product;
  var m = moment(date2)
  var m2 = moment()
  var dispatcher = req.user.fullname
  var year = m.format('YYYY')
  var dateValue = m.valueOf()
  var dateValueDispatch = m2.valueOf()
  var date = m.toString()
  var numDate = m.valueOf()
  var barcodeNumber = req.body.code
var month = m.format('MMMM')
var time = req.user.time
var truck = req.user.truck
var casesDispatched = 1
var casesBatch = req.user.cases
var lot = req.user.lot
var pallet
var refNumber = req.user.refNumber
var casesBatchNumber = req.user.invoiceNumber
var refNumDispatch = req.user.refNumDispatch
var salesPerson = req.user.salesPerson
var warehouse = req.user.warehouse
var batchId = req.user.batchId
console.log(batchId,'batchId')
var arr = []
var arr2 = []
var c = {_id:"",statusV:"dispatched",item:"",description:"",invoiceNumber:"",_id:"",amountDue:0} 
arr2.push(c)
var id =req.user._id
var status1 = 'received'
var status2 = 'dispatched'
var mformat = m.format("L")
var currentPallet = req.user.currentPallet
  //var receiver = req.user.fullname

console.log(product,casesDispatched,warehouse,'out')


StockV.find({refNumDispatch:refNumDispatch,refNumber:refNumber,dispatchStatus:'pending',pallet:currentPallet,casesBatchNumber:casesBatchNumber},function(err,focs){
  
    //let size  = focs.length + 1
  
    if(focs.length > casesBatch){ 
      size = casesBatch
    }
    else{
      size = focs.length + 1
    }


 

  


    Warehouse.findOne({'product':product,'warehouse':warehouse})
  .then(hoc=>{



    StockV.findOne({'barcodeNumber':barcodeNumber,'refNumber':refNumber,'pallet':currentPallet})
    .then(doc=>{
      console.log(doc,'doc',hoc,'hocVVV')

    if(doc){

      if(doc.status == 'dispatched'){
res.send(c)
      }
      else if(doc.status == 'received'){

        if(size > casesBatch){
          User.findByIdAndUpdate(id,{$set:{refNumDispatch:"null"}},function(err,noc){
          
          })
        
            }
            


        
        console.log('true')
        let availableCases = hoc.cases
        let tCases = hoc.cases + 1
        
        let uid = req.user._id
        
            StockV.findByIdAndUpdate(doc._id,{$set:{timeOfDispatch:time,truck:truck,salesPerson:salesPerson,
              dispatcher:dispatcher,casesBatch:casesBatch,refNumDispatch:refNumber,availableCasesDispatch:availableCases,cases:tCases,status:'dispatched',
            mformatDispatch:mformat,dateValueDispatch:dateValueDispatch,size:size,casesDispatched:1,batchId:batchId,statusCheck:"scanned",
          refNumDispatch:refNumDispatch,casesBatchNumber:casesBatchNumber}},function(err,lof){
        
             
        
        
              Product.find({'name':product},function(err,docs){
                let id = docs[0]._id
                console.log(id,'id')
                let nqty, nqty2
                
                 let openingQuantity = docs[0].cases
                //nqty = pro.quantity + docs[0].quantity
                nqty =  docs[0].cases - 1 
                console.log(docs[0].cases, '**',1)
                nqty2 = nqty * docs[0].unitCases
                console.log(nqty,'nqty')
                Product.findByIdAndUpdate(id,{$set:{cases:nqty,openingQuantity:openingQuantity,rcvdQuantity:0, quantity:nqty2}},function(err,nocs){
        
                })
        
                
        
               })



               Warehouse.find({product:product,warehouse:warehouse},function(err,docs){
                let id = docs[0]._id
                console.log(id,'id')
                let nqty, nqty2
                
                 let openingQuantity = docs[0].cases
                //nqty = pro.quantity + docs[0].quantity
                nqty =  docs[0].cases - 1 
                console.log(docs[0].cases, '**',1)
                nqty2 = nqty * docs[0].unitCases
                console.log(nqty,'nqty')
                Warehouse.findByIdAndUpdate(id,{$set:{cases:nqty,openingQuantity:openingQuantity,rcvdQuantity:0, quantity:nqty2}},function(err,nocs){
        
                })
        
                
        
               })

               StockV.find({refNumber:refNumber,casesBatchNumber:casesBatchNumber,status:'dispatched'},function(err,gocs){

                let currentCases = gocs.length
                console.log(currentCases,'currentCases')
                User.findByIdAndUpdate(uid,{$set:{currentCases:currentCases}},function(err,tocs){

                })


              })
              

           

                        StockV.findById(doc._id,function(err,oc){
                          //console.log(oc,'ocs')
                res.send(oc)
                        })

                     
        
                      })
        
      }
    }else{

      res.send(arr)

    }




    })

  

    }) 
  
  })

      
})

/////////////


router.post('/dispatchScanCase',isLoggedIn, function(req,res){
 
  var date2 = req.user.date
  var product = req.user.product;
  var m = moment(date2)
  var m2 = moment()
  var dispatcher = req.user.fullname
  var casesBatchNumber = req.user.invoiceNumber
  var year = m.format('YYYY')
  var dateValue = m.valueOf()
  var dateValueDispatch = m2.valueOf()
  var date = m.toString()
  var numDate = m.valueOf()
  var barcodeNumber = req.body.code
var month = m.format('MMMM')
var time = req.user.time
var truck = req.user.truck
var casesDispatched = 1
var casesBatch = req.user.cases
var lot = req.user.lot
var pallet = req.user.pallets
var refNumber = req.user.refNumber
var refNumDispatch = req.user.refNumDispatch
var salesPerson = req.user.salesPerson
var warehouse = req.user.warehouse
var batchId = req.user.batchId
console.log(batchId,'batchId')
var arr = []
var arr2 = []
var c = {_id:"",statusV:"dispatched",item:"",description:"",invoiceNumber:"",_id:"",amountDue:0} 
arr2.push(c)
var id =req.user._id
var status1 = 'received'
var status2 = 'dispatched'
var mformat = m.format("L")
var currentPallet = req.user.currentPallet
  //var receiver = req.user.fullname

console.log(product,casesDispatched,warehouse,'out')


StockV.find({refNumDispatch:refNumDispatch,refNumber:refNumber,dispatchStatus:'pending',pallet:currentPallet,casesBatchNumber:casesBatchNumber},function(err,focs){
  
    //let size  = focs.length + 1
  
    if(focs.length > casesBatch){
      size = casesBatch
    }
    else{
      size = focs.length + 1
    }


 

  


    Warehouse.findOne({'product':product,'warehouse':warehouse})
  .then(hoc=>{



    StockV.findOne({'barcodeNumber':barcodeNumber,'refNumber':refNumber,'pallet':currentPallet})
    .then(doc=>{
      console.log(doc,'doc',hoc,'hoc')

    if(doc){

      if(doc.status == 'dispatched'){
res.send(c)
      }
      else if(doc.status == 'received'){

        if(size > casesBatch){
          User.findByIdAndUpdate(id,{$set:{refNumDispatch:"null"}},function(err,noc){
          
          })
        
            }
            


        
        console.log('true')
        let availableCases = hoc.cases
        let tCases = hoc.cases + 1
        
        let uid = req.user._id
        
            StockV.findByIdAndUpdate(doc._id,{$set:{timeOfDispatch:time,truck:truck,salesPerson:salesPerson,
              dispatcher:dispatcher,casesBatch:casesBatch,refNumDispatch:refNumber,availableCasesDispatch:availableCases,cases:tCases,status:'dispatched',
            mformatDispatch:mformat,dateValueDispatch:dateValueDispatch,size:size,casesDispatched:1,batchId:batchId,statusCheck:"scanned",
          refNumDispatch:refNumDispatch,casesBatchNumber:casesBatchNumber}},function(err,lof){
        
             
        
        
              Product.find({'name':product},function(err,docs){
                let id = docs[0]._id
                console.log(id,'id')
                let nqty, nqty2
                
                 let openingQuantity = docs[0].cases
                //nqty = pro.quantity + docs[0].quantity
                nqty =  docs[0].cases - 1 
                console.log(docs[0].cases, '**',1)
                nqty2 = nqty * docs[0].unitCases
                console.log(nqty,'nqty')
                Product.findByIdAndUpdate(id,{$set:{cases:nqty,openingQuantity:openingQuantity,rcvdQuantity:0, quantity:nqty2}},function(err,nocs){
        
                })
        
                
        
               })



               Warehouse.find({product:product,warehouse:warehouse},function(err,docs){
                let id = docs[0]._id
                console.log(id,'id')
                let nqty, nqty2
                
                 let openingQuantity = docs[0].cases
                //nqty = pro.quantity + docs[0].quantity
                nqty =  docs[0].cases - 1 
                console.log(docs[0].cases, '**',1)
                nqty2 = nqty * docs[0].unitCases
                console.log(nqty,'nqty')
                Warehouse.findByIdAndUpdate(id,{$set:{cases:nqty,openingQuantity:openingQuantity,rcvdQuantity:0, quantity:nqty2}},function(err,nocs){
        
                })
        
                
        
               })

               StockV.find({refNumber:refNumber,status:'dispatched'},function(err,gocs){

                let currentCases = gocs.length
                console.log(currentCases,'currentCases')
                User.findByIdAndUpdate(uid,{$set:{currentCases:currentCases}},function(err,tocs){

                })


              })
              

           

                        StockV.findById(doc._id,function(err,oc){
                          //console.log(oc,'ocs')
                res.send(oc)
                        })

                     
        
                      })
        
      }
    }else{

      res.send(arr)

    }




    })

  

    }) 
  
  })

      
})













router.post('/dispatchPallet/:id',isLoggedIn,function(req,res){

  
  var date2 = req.user.date
  var product = req.user.product;
  var m = moment(date2)
  var m2 = moment()
  var dispatcher = req.user.fullname
  var year = m.format('YYYY')
  var dateValue = m.valueOf()
  var dateValueDispatch = m2.valueOf()
  var date = m.toString()
  var numDate = m.valueOf()
  var barcodeNumber = req.body.code
var month = m.format('MMMM')
var time = req.user.time
var truck = req.user.truck
var casesDispatched = 1
var casesBatch = req.user.cases
let casesBatchNumber = req.user.invoiceNumber
var lot = req.user.lot
var refNumber = req.user.refNumber
var salesPerson = req.user.salesPerson
var warehouse = req.user.warehouse
var batchId = req.user.batchId
console.log(batchId,'batchId')
var arr = []
var arr2 = []
var c = {_id:"",statusV:"dispatched",item:"",description:"",invoiceNumber:"",_id:"",amountDue:0} 
arr2.push(c)
var id =req.user._id
var status1 = 'received'
var status2 = 'dispatched'
var mformat = m.format("L")
let count = 0
var id = req.params.id
let currentCases = req.user.currentCases
var uid = req.user._id
var refNumDispatch = req.user.refNumDispatch
var idU = req.user._id
var currentPallet = req.user.currentPallet
console.log(casesBatchNumber,'batchNumber')
      
      
                        StockV.find({refNumber:id,statusCheck:"scanned",casesBatchNumber:casesBatchNumber,refNumDispatch:refNumDispatch,pallet:currentPallet},function(err,docs){

                          let pallet = docs[0].pallet
                          for(var i = 0;i<docs.length;i++){
                            
        
        
             
        
                            if(docs[i].pallet == pallet){
                              count++
                        
                        
                              if(count == docs.length){
                                Warehouse.findOne({'product':product,'warehouse':warehouse})
                                .then(hoc=>{
                               
                        
                                StockV.find({refNumber:id,status:'received',pallet:pallet},function(err,ocs){
                        for(var n = 0;n<ocs.length;n++){
                         let objId = ocs[n]._id
                         console.log(objId,'objId')
                     
                            let size = n + 4
                            let availableCases = hoc.cases - n

                            console.log(hoc.cases, n,'jack reverse')
                            let tCases = hoc.cases + 1
                            
                          StockV.findByIdAndUpdate(objId,{$set:{timeOfDispatch:time,truck:truck,salesPerson:salesPerson,
                            dispatcher:dispatcher,casesBatch:casesBatch,refNumDispatch:refNumDispatch,availableCasesDispatch:availableCases,cases:tCases,status:'dispatched',
                          mformatDispatch:mformat,size:size,casesDispatched:1,batchId:batchId,statusCheck:"scanned",statusCheck2:'scannedLoop',dateValueDispatch:dateValueDispatch,casesBatchNumber:casesBatchNumber}},function(err,lof){

                          })
              

                     
             
                Product.find({'name':product},function(err,pocs){
                let pId = pocs[0]._id
                 console.log(pId,'pId')
                let nqty, nqty2
                
                 let openingQuantity = pocs[0].cases
                //nqty = pro.quantity + docs[0].quantity
                nqty =  pocs[0].cases - 1 
                console.log(pocs[0].cases, '**',1)
                nqty2 = nqty * pocs[0].unitCases
                console.log(nqty,'nqty')
                Product.findByIdAndUpdate(pId,{$set:{cases:nqty,openingQuantity:openingQuantity,rcvdQuantity:0, quantity:nqty2}},function(err,nocs){
                 // console.log(nocs,'updatedProduct')
                })
        
              })
        
              


               
                Warehouse.find({product:product,warehouse:warehouse},function(err,kocs){
                let wareId = kocs[0]._id
                console.log(wareId,'wareId')
                let nqty, nqty2
                
                 let openingQuantity = kocs[0].cases
                //nqty = pro.quantity + docs[0].quantity
                nqty =  kocs[0].cases - 1 
                console.log(kocs[0].cases, '**',1)
                nqty2 = nqty * kocs[0].unitCases
                console.log(nqty,'nqty')
                Warehouse.findByIdAndUpdate(wareId,{$set:{cases:nqty,openingQuantity:openingQuantity,rcvdQuantity:0, quantity:nqty2}},function(err,nocs){
        
                //  console.log(nocs,'updatedWareH')
                })
        })
             currentCases++
             console.log(currentCases,'currentCasesV')
          User.findByIdAndUpdate(uid,{$set:{currentCases:currentCases}},function(err,vocs){

          })

                      
                       
                        }

                        StockV.find({refNumber:id,status:'dispatched',pallet:pallet,statusCheck2:"scannedLoop",refNumDispatch:refNumDispatch,casesBatchNumber:casesBatchNumber},function(err,gocs){

                        
                        StockV.find({refNumber:id,status:'dispatched',pallet:pallet,statusCheck2:"scannedLoop",refNumDispatch:refNumDispatch,casesBatchNumber:casesBatchNumber},function(err,pocs){



                         //console.log(pocs,'ocsV')
                          res.send(pocs)

                        })
                      })
                    })
                    })
                        
                                
                        
                              }
                            }
                          
                          }
                        
                        
                     
                        })
        
                      

                    
                 
          
  
})



router.get('/folderRegDispatch',function(req,res){
    res.render('dispatcher/itemFolderDispatch')
  })
  
  
  /*8888*/
  
  router.get('/selectMonthDispatchV/',isLoggedIn,function(req,res){
  var pro = req.user
  var id = req.params.id
  var uid = req.user._id
  var arr = []
  var year = 2024
  User.findByIdAndUpdate(uid,{$set:{year:year}},function(err,locs){
  
  })
  
  Month.find({}).sort({num:1}).then(docs=>{
     
          res.render('dispatcher/itemFilesMonthlyDispatchV',{pro:pro,listX:docs,id:id})
  
  })
  
  })
  
  
  
  router.get('/folderFilesDispatchV/:id',isLoggedIn,function(req,res){
  var arr = []
  
  var errorMsg = req.flash('danger')[0];
  var successMsg = req.flash('success')[0];
  var term = req.user.term
  var m = moment()
  var pro = req.user
  
  var year = m.format('YYYY')
  var month = req.params.id
  
  var date = req.user.invoCode
  RepoFiles.find({year:year,month:month,status:'dispatch'},function(err,docs){
   if(docs){
  
  console.log(docs,'docs')
    let arr=[]
    for(var i = docs.length - 1; i>=0; i--){
  
      arr.push(docs[i])
    }
  
  
  res.render('dispatcher/itemFilesDispatchV',{listX:arr,month:month,pro:pro,year:year,successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg}) 
  }
  })
  
  })



  router.get('/batchListDispatch',function(req,res){
    BatchR.find(function(err,docs){
    
      let arr=[]
      for(var i = docs.length - 1; i>=0; i--){
    
        arr.push(docs[i])
      }
    
      res.render('dispatcher/batchListDisp',{listX:arr})
    
    })
    
    
    
    })
    
    
    
    
        
    router.get('/receivedCasesDispatch/:id',function(req,res){
      let refNumber = req.params.id
      StockV.find({refNumber:refNumber},function(err,docs){
      
       
      
        res.render('dispatcher/rcvdCasesDisp',{listX:docs})
      
      })
      
      
      
      })
    
    
    
      router.get('/dispatchedCases2/:id',function(req,res){
        let refNumber = req.params.id
        StockV.find({refNumber:refNumber,status:'dispatched'},function(err,docs){
        
         
        
          res.render('dispatcher/dispatchedCasesDisp',{listX:docs})
        
        })
        
        
        
        })
    
    
    
    
        router.get('/remainingCasesDisp/:id',function(req,res){
          let refNumber = req.params.id
          StockV.find({refNumber:refNumber,status:'received'},function(err,docs){
          
           
          
            res.render('dispatcher/remainingCasesDispatch',{listX:docs})
          
          })
          
          
          
          })
    

















  
router.get('/rtnsNumberUpdate',isLoggedIn,function(req,res){
var id = req.user._id

  InvoNum.find(function(err,doc){
    let invoiceNum = doc[0].num
    let invoId = doc[0]._id


User.findByIdAndUpdate(id,{$set:{rtnsNumber:invoiceNum}},function(err,docs){

})
invoiceNum++

InvoNum.findByIdAndUpdate(invoId,{$set:{num:invoiceNum}},function(err,tocs){

})

res.redirect('/dispatch/rtnsInwards')

  })

})




router.get('/rtnsInwards',isLoggedIn,function(req,res){
var errorMsg = req.flash('danger')[0];
var successMsg = req.flash('success')[0];
var invoiceNumber = req.user.rtnsNumber
res.render('dispatcher/inwards',{rtnsNumber:invoiceNumber,successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg})
})

router.post('/rtnsInwards',isLoggedIn,function(req,res){

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



req.check('salesPerson','Enter Salesperson').notEmpty();
           

var errors = req.validationErrors();

if (errors) {

req.session.errors = errors;
req.session.success = false;
req.flash('danger', req.session.errors[0].msg);


res.redirect('/dispatch/rtnsInwards');

}
else{
  console.log(req.body['product[]'],'flag')



ar1.push(req.body['product[]'])
ar2.push(req.body['quantity[]'])
ar3.push(req.body['price[]'])
ar4.push(req.body['reason[]'])

console.log(ar1[0].length,'ha')


if(ar1[0].length >1){
ar1 = ar1[0].filter(v=>v!='')
ar2 = ar2[0].filter(v=>v!='')
ar3 = ar3[0].filter(v=>v!='')
ar4 = ar4[0].filter(v=>v!='')
}

console.log(ar1,'iwee1')
console.log(ar2,'iwee2')
console.log(ar3,'iwee3')
console.log(ar4,'iwee4')
for(var i = 0; i<ar1.length;i++){
console.log(i,'ss')
console.log(ar1.length,'unai')
console.log(ar1[i])
let code = ar1[i]

let qty1 = ar2[i]
let price1 = ar3[i]
let reason = ar4[i]
let reg = /\d+\.*\d*/g;
let resultQty = qty1.match(reg)
let qty = Number(resultQty)


let resultPrice = price1.match(reg)
let price = Number(resultPrice)

let total = qty * price

var book = new RtnsSubBatch();
book.item = ar1[i]

book.rtnsNumber = rtnsNumber

book.salesPerson = salesPerson
book.qty = qty
book.price = price
book.total = total
book.reason = reason
book.month = month
book.year = year
book.date = mformat
//book.invoiceNumber = invoiceNumber

book.status = 'not saved'

book.type = "Rtns Inwards"

book.size = i
book.subtotal = 0




 
  book.save()
    .then(title =>{


  


    })

   
}

res.redirect('/dispatch/updateStockSale')
}
})



router.get('/updateStockSale',isLoggedIn,function(req,res){
let arrV = []
var rtnsNumber = req.user.rtnsNumber
RtnsSubBatch.find({rtnsNumber:rtnsNumber},function(err,docs){

console.log(docs.length)
for(var i = 0;i<docs.length; i++){
  console.log(docs[i].qty,'serima')
arrV.push(docs[i].qty)
  }
  //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
 console.log(arrV,'arrV')

//InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
number1=0;
for(var z in arrV) { number1 += arrV[z]; }


RtnsSubBatch.find({rtnsNumber:rtnsNumber},function(err,docs){
for(var i = 0;i <docs.length;i++){
  let id =  docs[i]._id
  RtnsSubBatch.findByIdAndUpdate(id,{$set:{subtotal:number1}},function(err,focs){

  })
}
})
console.log(number1,'number2')

res.redirect('/dispatch/updateStockSale0')

})


})



router.get('/updateStockSale0',isLoggedIn,function(req,res){
let arrV = []
var rtnsNumber = req.user.rtnsNumber
RtnsSubBatch.find({rtnsNumber:rtnsNumber},function(err,docs){

console.log(docs.length)
for(var i = 0;i<docs.length; i++){
  console.log(docs[i].qty,'serima')
arrV.push(docs[i].qty)
  }
  //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
 console.log(arrV,'arrV')

//InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
number1=0;
for(var z in arrV) { number1 += arrV[z]; }


RtnsSubBatch.find({rtnsNumber:rtnsNumber},function(err,docs){
for(var i = 0;i <docs.length;i++){
  let id =  docs[i]._id
  RtnsSubBatch.findByIdAndUpdate(id,{$set:{subtotal:number1}},function(err,focs){

  })
}
})
console.log(number1,'number2')

res.redirect('/dispatch/updateStockSale1')

})


})



router.get('/updateStockSale1',isLoggedIn,function(req,res){
var rtnsNumber = req.user.rtnsNumber
console.log(rtnsNumber,'returnsNumber33')



    RtnsSubBatch.find({rtnsNumber:rtnsNumber},function(err,ocs){
      console.log(ocs,'ocbgs')
//res.redirect('/updateStockSale2')

res.redirect('/dispatch/rtnsSubFile')

    })
})

///////////////////

router.get('/rtnsSubFile',isLoggedIn,function(req,res){
let rtnsNumber = req.user.rtnsNumber
RtnsSubBatch.find({rtnsNumber:rtnsNumber},function(err,docs){
//console.log(docs,'docv')
if(docs.length > 0){
 for(var i = 0; i<1;i++){
   let item = docs[i].item
   let rtnsNumber = docs[i].rtnsNumber
   let qty = docs[i].qty
   
   let total = docs[i].subtotal
   
  
   let date = docs[i].date
   let month = docs[i].month
   let year = docs[i].year
   let salesPerson = docs[i].salesPerson

   /*let month = docs[i].month
   let year = docs[i].year
   let date = docs[i].date*/
   let subtotal = docs[i].subtotal

  


       var invo = new ReturnsSubFile();
    
       invo.rtnsNumber = rtnsNumber
       invo.item =item
  
       invo.qty = qty
    
       invo.total = subtotal
      
       invo.date = date
       invo.month = month
       invo.year = year
       invo.salesPerson = salesPerson
    
       /*invo.month = month
       invo.year = year
       invo.date = date*/
   
       invo.subtotal = subtotal
       
       invo.save()
 .then(user =>{
  
  


   })

 }
// res.redirect('/arrInvoiceSubUpdate')
res.redirect('/dispatch/updateStockSale2')

}
})


})



router.get('/updateStockSale2',isLoggedIn,function(req,res){
let arrV = []
var rtnsNumber = req.user.rtnsNumber
console.log(rtnsNumber,'returnsNumber33')

//let qty1 = docs[0].qty
/* let qtyV = docs[i].qty / 12
let qty = docs[i].qty*/




   Product.find(function(err,ocs){
       //console.log(ocs,'ocs')

       for(var i = 0;i<ocs.length;i++){
     let product = ocs[i].name
     console.log(product,'product')
        RtnsSubBatch.find({rtnsNumber:rtnsNumber,item:product},function(err,pocs){
          if(pocs.length > 0){
            let salesPerson = pocs[0].salesPerson
          for(var i = 0;i<pocs.length; i++){
            console.log(pocs[i].qty,'serima')
          arrV.push(pocs[i].qty)
            }
            //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
           console.log(arrV,'arrV')
     
       //InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
        number1=0;
        for(var z in arrV) { number1 += arrV[z]; }
       /* let cases3 = ocs[i].qty / 12
        let qty = ocs[i].qty
        let salesPerson = ocs[i].salesPerson
        let product = ocs[i].item*/
        let cases3 = number1 / 12

        SaleStock.find({salesPerson:salesPerson,product:product}, function(err,yocs){
        let id = yocs[0]._id
        console.log(i,'i')
        let cases = yocs[0].holdingCases - cases3
        let qty2 = yocs[0].qty - number1
        console.log(yocs[0].qty,'salesStock',number1,'rtnsStock')
        console.log(qty2,'qty2')

        SaleStock.findByIdAndUpdate(id,{$set:{holdingCases:cases,qty:qty2}},function(err,vocs){

          if(!err){
            //console.log(vocs,'roadmap')
          }
  
        })
        })
    
      



      
    


      /*req.flash('success', 'Stock Returned Successfully!');

      res.redirect('/rtnsInwards')*/  
      }

    })

  }


 // req.flash('success', 'Stock Returned Successfully!');

      res.redirect('/dispatch/viewRtns2')
})
    





})




router.get('/viewRtns2',isLoggedIn,function(req,res){
var rtnsNumber = req.user.rtnsNumber
RtnsSubBatch.find({rtnsNumber:rtnsNumber},function(err,ocs){

// console.log(docs,'ok')
//res.render('kambucha/pdf',{listX:docs})

res.redirect('/dispatch/viewRtns3/')
})

})

router.get('/viewRtns3',isLoggedIn,function(req,res){
var rtnsNumber = req.user.rtnsNumber
RtnsSubBatch.find({rtnsNumber:rtnsNumber},function(err,ocs){

// console.log(docs,'ok')
//res.render('kambucha/pdf',{listX:docs})

res.redirect('/dispatch/viewRtns/'+rtnsNumber)
})

})




router.get('/viewRtns/:id',isLoggedIn,function(req,res){
var rtnsNumber = req.params.id

ReturnsSubFile.find(function(err,docs){

RtnsSubBatch.find({rtnsNumber:rtnsNumber},function(err,locs){

// console.log(docs,'ok')
res.render('dispatcher/pdfR',{listX:locs,listX2:docs})
})
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




router.post('/batchAuto',function(req,res){
var product = req.body.code
console.log(product,'pro7')
BatchR.find({status:"received",product:product},function(err,docs){
res.send(docs)
})
})


router.post('/batchAutoStock',function(req,res){
var product = req.body.code
var arr = []
console.log(product,'pro7')
Warehouse.find({product:product},function(err,docs){
for(var i = 0;i<docs.length;i++){


  if(arr.length > 0 && arr.find(value => value.product == docs[i].product)){
         console.log('true')
        arr.find(value => value.product == docs[i].product).cases += docs[i].cases;
   }else{
arr.push(docs[i])
   }

 
}
//console.log(arr,'arr')

res.send(arr)
})
})



router.get('/eodRepoView',isLoggedIn,function(req,res){
    console.log(arrStatementR,'arrRefs')
    arrStatementR=[]
      //var code = "Tiana Madzima"
  
  let date = req.user.date
      //console.log(docs[i].uid,'ccc')
      
      //let uid = "SZ125"
      
      
      //TestX.find({year:year,uid:uid},function(err,vocs) {
      BatchR.find({date:date}).lean().sort({date:1}).then(vocs=>{
      console.log(vocs.length,'vocs')
      
      for(var x = 0;x<vocs.length;x++){
      let size = vocs.length - 1
  
      let code = vocs[x].refNumber
     /* if( arrStatement[code].length > 0 && arrStatement[code].find(value => value.refNumber == code) ){
        //arrStatement[code].find(value => value.refNumber == code).casesReceived++;
        //arrStatement[code].find(value => value.uid == uid).size++;
        //arrStatement[code].push(vocs[x])
      
          }*/
          
          arrStatementR.push(vocs[x])
          
          
         /* else{
            arrStatement[code].push(vocs[x])
            //arrStatement[code].find(value => value.refNumber == code).typeBalance = studentBalance;
            } */
      
      
       
      
           
      
      }
     
          })
          
          res.redirect('/dispatch/statementGenView/')
        
      
      /*})*/
      
      })
      
  
      router.get('/statementGenView',function(req,res){
  
  res.render('dispatcher/stockSummaryT2',{listX:arrStatementR})
  
  
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
  





































      module.exports = router;
  
      function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        else{
            res.redirect('/')
        }
      }
      