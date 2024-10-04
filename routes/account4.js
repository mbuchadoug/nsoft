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


router.get('/stockRequisitions',isLoggedIn,function(req,res){

    StockVoucher.find({status4:"pending"},function(err,docs){
        if(docs){
            res.render('kambucha/approve4',{listX:docs})
        }
    })
})


router.get('/approve/:id',isLoggedIn,function(req,res){
    var id = req.params.id
    var name = req.user.fullname
   
    let date6 = moment().format('l');
     let date7 =  date6.replace(/\//g, "");
    StockVoucher.findByIdAndUpdate(id,{$set:{approver4:name,status4:"approved",status:"approved"}},function(err,docs){

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
            
                var truck = new BatchRR()
                truck.date = date
                truck.mformat = date6
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
                
               
            
                truck.save()
                    .then(pro =>{
            
            
            
              
            
            
            
                var book = new RefNo();
              book.refNumber = refNo
              book.date = date
              book.type = 'receiving material'
              book.save()
              .then(pro =>{
            
                console.log('success')

                res.redirect('/accounts4/stockRequisitions')
            
            
              })
            })
        })
        }


    })

   
})




router.get('/reject/:id',isLoggedIn,function(req,res){
    var id = req.params.id
    var name = req.user.fullname
    StockVoucher.findByIdAndUpdate(id,{$set:{approver4:name,status4:"rejected",status:"rejected"}},function(err,docs){


    })

    res.redirect('/accounts4/stockRequisitions')
})





router.get('/defer/:id',isLoggedIn,function(req,res){
    var id = req.params.id
    var name = req.user.fullname
    StockVoucher.findByIdAndUpdate(id,{$set:{approver4:name,status4:"deferred",status:"deferred"}},function(err,docs){


    })

    res.redirect('/accounts4/stockRequisitions')
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
