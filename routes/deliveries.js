var express = require('express');
var router = express.Router();
var InvoiceSubFile = require('../models/invoiceSubFile');
var ReturnsSubFile = require('../models/returnsSubFile');
var User = require('../models/user');
var Ware = require('../models/ware');
var Drivers = require('../models/drivers');
var Delivery = require('../models/delivery');
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

router.get('/refDispUpdate',isLoggedIn,function(req,res){
  BatchD.find(function(err,docs){
    for(var i = 0;i<docs.length;i++){
let refNumDispatch = docs[i].refNumDispatch
BatchD.find({refNumDispatch:refNumDispatch},function(err,locs){
  console.log(locs.length,'locs')
  for(var n = 0;n<locs.length;n++){
    let id = locs[n]._id
    let size = n + 1
    console.log(size,'size5')
    BatchD.findByIdAndUpdate(id,{$set:{dSize:size}},function(err,kocs){

    })
  }
})
    }
    res.redirect('/merch/refDispPositionUpdate')
  })
})



router.get('/refDispPositionUpdate',isLoggedIn,function(req,res){
  BatchD.find(function(err,docs){
    for(var i = 0;i<docs.length;i++){
let refNumDispatch = docs[i].refNumDispatch
BatchD.find({refNumDispatch:refNumDispatch},function(err,locs){
  console.log(locs.length,'locs')
  for(var n = 0;n<locs.length;n++){
    let id = locs[n]._id
    let size = n + 1
    console.log(size,'size5')
    BatchD.findByIdAndUpdate(id,{$set:{position:n}},function(err,kocs){

    })
  }
})
    }
    res.redirect('/merch')
  })
})



router.get('/',isLoggedIn,function(req,res){
   var branch = req.user.branch
    Delivery.find({delivery:"pending",branch:branch},function(err,docs){
        if (!err) {
            res.render("dispatchDelivery/incoming", {
               listX:docs,
              
            });
        }
    })
})




router.get('/track',isLoggedIn,function(req,res){
  var branch = req.user.branch
   Delivery.find(function(err,docs){
       if (!err) {
           res.render("dispatchDelivery/track", {
              listX:docs,
             
           });
       }
   })
})


router.get('/approve/:id',isLoggedIn,function(req,res){
  var id = req.params.id
  Delivery.findById(id,function(err,doc){
 let product = doc.product
 let truck = doc.truck
 let cases = doc.cases
 let destination = doc.destination

 
  res.render('dispatchDelivery/delivery',{product:product,
  truck:truck,cases:cases,destination:destination,id:id})

})
})



router.post('/approve/:id',isLoggedIn,function(req,res){

    let openingBal
    let closingBal =0
    let idP = req.params.id
    let url1 = req.user.url
    let refNo = req.user.refNo
    let url = url1+refNo
    let size,rSize
    let number1
    var arr16=[]
    let op 
    let holdingCases
    var casesReceivedS = req.body.casesReceived
    var casesDispatchedS = req.body.cases
   
    let reg = /\d+\.*\d*/g;
    let csr = casesReceivedS.match(reg)
    let casesReceived = Number(csr)
    
    
    let cds= casesDispatchedS.match(reg)
    let casesDispatched = Number(cds)

    let variance = casesReceived - casesDispatched
    console.log(variance,'variance5555')
    if(variance == 0){

    

    Delivery.findById(idP,function(err,doc){

        var product = doc.product
      
        var refNumDispatch =doc.refNumDispatch
        var branch = doc.branch


        BatchD.find({refNumDispatch:refNumDispatch},function(err,ocs){
          console.log(ocs,'docsgg')
          for(var i = 0;i<ocs.length;i++){
          let id3 = ocs[i]._id
          BatchD.findByIdAndUpdate(id3,{$set:{position:i,casesReceived:casesReceived,variance:0,delivery:"delivered"}},function(err,locs){
          
          
          })
          }
          
      
        Warehouse.find({product:product,warehouse:branch},function(err,docs){
          let id = docs[0]._id
          console.log(id,'id')
          let nqty, nqty2
           let rcvdQty = casesReceived
           let openingQuantity = docs[0].cases
          //nqty = pro.quantity + docs[0].quantity
          nqty = casesReceived + docs[0].cases
          nqty2 = nqty * docs[0].unitCases
          console.log(nqty,'nqty')
          Warehouse.findByIdAndUpdate(id,{$set:{cases:nqty,openingQuantity:openingQuantity, rcvdQuantity:rcvdQty,quantity:nqty2}},function(err,nocs){
    
          })
    
          Delivery.findByIdAndUpdate(idP,{$set:{delivery:"delivered",status:"delivered",casesReceived:casesReceived,variance:0,}},function(err,mocs){

          })

         
  
         })
        })
        res.redirect('/merch/track')
})
//

    }else{

      Delivery.findById(idP,function(err,doc){

        var product = doc.product
      
        var refNumDispatch =doc.refNumDispatch
        var branch = doc.branch

        BatchD.find({refNumDispatch:refNumDispatch},function(err,ocs){
          console.log(ocs,'docsgg')
          for(var i = 0;i<ocs.length;i++){
          let id3 = ocs[i]._id
          BatchD.findByIdAndUpdate(id3,{$set:{position:i,casesReceived:casesReceived,variance:variance,delivery:"flagged"}},function(err,locs){
          
          
          })
          }
          
  
        Warehouse.find({product:product,warehouse:branch},function(err,docs){
          let id = docs[0]._id
          console.log(id,'id')
          let nqty, nqty2
           let rcvdQty = casesReceived
           let openingQuantity = docs[0].cases
          //nqty = pro.quantity + docs[0].quantity
          nqty = casesReceived + docs[0].cases
          nqty2 = nqty * docs[0].unitCases
          console.log(nqty,'nqty')
          Warehouse.findByIdAndUpdate(id,{$set:{cases:nqty,openingQuantity:openingQuantity, rcvdQuantity:rcvdQty,quantity:nqty2}},function(err,nocs){
    
          })
    
          Delivery.findByIdAndUpdate(idP,{$set:{delivery:"flagged",status:"flagged",variance:variance,casesReceived:casesReceived}},function(err,mocs){

          })

         
         
  })
         })
         res.redirect('/merch/track')    
})

    }
  
  })
  
  
  
  
  router.get('/statusUpdate',function(req,res){

    StockV.find({status:'dispatched',dispatchStatus:'pending'},function(err,docs){
      for(var i = 0; i<docs.length;i++){
        let id = docs[i]._id
        StockV.findByIdAndUpdate(id,{$set:{dispatchStatus:'dispatched'}},function(err,locs){
    
        })
      }
      res.redirect('/merch/fifoUpdate')
    })
    
    })
     
  
  








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
        
    
        res.redirect('/merch/fifoDateUpdate')
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
      res.redirect('/merch/palletUpdate')
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
          res.redirect('/merch/updatePalletPos')
      })
      })
    
    
    
      
    router.get('/updatePalletPos',function(req,res){
      BatchR.find({},function(err,focs){
        if(focs.length > 0){
    
        
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
        res.redirect('/merch/warehouseUpdate')
      }else{
        res.redirect('/merch/warehouseUpdate')
      }
      })
    
    })
    
    
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
        res.redirect('/merch/')
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

