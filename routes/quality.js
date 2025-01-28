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
var CrushedItems = require('../models/crushedItems');
var Warehouse = require('../models/warehouse');
var SaleStock = require('../models/salesStock');
var Customer = require('../models/customer');
var BatchR = require('../models/batchR');
var BatchRR = require('../models/batchRR');
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


router.get('/warehouseStock',isLoggedIn,function(req,res){
    var pro = req.user
    //res.render('admin/dash6',{pro:pro})
    Product.find({},function(err,docs){
   Warehouse.find({},function(err,hocs){
    res.render('qa/dash7',{pro:pro,arr:docs,arr1:hocs})
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
    
    
    
  
  
  
  ///view approved requisitions, for receiving stock
  router.get('/blendingExtraDaysApproval',isLoggedIn,function(req,res){
      var errorMsg = req.flash('danger')[0];
    var successMsg = req.flash('success')[0];
    BlendingDays.find({status:'extra',qualityAssurance:"pending"},function(err,docs){
    
        res.render('qa/vouchers',{listX:docs,successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg})
      })
    })


    
router.get('/blendingExtraDaysApproval/:id',isLoggedIn,function(req,res){
  var id = req.params.id
 

  BlendingDays.findByIdAndUpdate(id,{$set:{qualityAssurance:'approved'}},function(err,doc){



    
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

  res.redirect('/quality/blendingExtraDaysApproval')
})
      


router.get('/blendingExtraDaysReject/:id',isLoggedIn,function(req,res){
  var id = req.params.id
 

  BlendingDays.findByIdAndUpdate(id,{$set:{qualityAssurance:'rejected'}},function(err,doc){



    
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

  res.redirect('/quality/blendingExtraDaysApproval')
})
      
    
    router.get('/grvList',isLoggedIn,function(req,res){
      BatchRR.find({status:"complete"},function(err,docs){
        res.render('qa/grvList',{listX:docs})
      })
    })
    




    
router.get('/viewGRV/:id',isLoggedIn,function(req,res){
    var id = req.params.id
  
    BatchRR.find(function(err,docs){
  
     BatchRR.find({_id:id},function(err,locs){
       console.log(locs,'locs')
  
      res.render('qa/grv2',{listX:locs,listX2:docs})
    })
    })
  
  })
  
  router.get('/grvFileV/:id',function(req,res){
  var id = req.params.id
  res.redirect('/qa/grvFile/'+id)
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
    res.redirect('/qa/fileIdGrv/'+filename)
    })
    
    })
  
    router.get('/fileIdGrv/:id',function(req,res){
      console.log(req.params.id)
      var id = req.params.id
      
      res.redirect('/qa/openGrv/'+id)
      
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
  
  
  
    
  
  
 
      router.get('/batchList',isLoggedIn,function(req,res){
        BatchGingerWash.find(function(err,docs){
        
          let arr=[]
          for(var i = docs.length - 1; i>=0; i--){
        
            arr.push(docs[i])
          }
        
          res.render('qa/batchList',{listX:arr})
        
        })
        
        
        
        })
        
        






           
 
router.get('/batchListCrush',function(req,res){
    BatchGingerCrush.find({type:"normal"},function(err,docs){
    
      let arr=[]
      for(var i = docs.length - 1; i>=0; i--){
    
        arr.push(docs[i])
      }
    
      res.render('qa/batchListCrush',{listX:arr})
    
    })
    
    
    
    })
  
  
  

    router.get('/batchListIngredients',function(req,res){
        Ingredients.find(function(err,docs){
        
          let arr=[]
          for(var i = docs.length - 1; i>=0; i--){
        
            arr.push(docs[i])
          }
        
          res.render('qa/batchListIngredients',{listX:arr})
        
        })
        
        
        
        })
      

        
        
router.get('/draining',isLoggedIn,function(req,res){
    BatchFermentation.find({status:"null"},function(err,docs){
         res.render('qa/draining',{listX:docs})
  
        })
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
    