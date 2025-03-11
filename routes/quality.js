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
var BatchPackaging = require('../models/batchPackaging')
var Packaging = require('../models/packaging')
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
    
    
    router.get('/batchPackagingList',isLoggedIn,function(req,res){
      BatchPackaging.find(function(err,docs){
        res.render('qa/packagingList',{listX:docs})
      })
    })

    router.get('/refresh/:id',isLoggedIn,function(req,res){
      let id = req.params.id

      
      BatchPackaging.findById(id,function(err,doc){
        let refNumber = doc.refNumber
        StockV.find({batchNumber:refNumber},function(err,docs){
          let cases = docs.length
          BatchPackaging.findByIdAndUpdate(id,{$set:{totalCases:cases}},function(err,locs){

          })
        })

        res.redirect('/quality/batchPackagingList')
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


   router.get('/batchNumberList',isLoggedIn,function(req,res){
    var pro = req.user
    //var product = req.params.id
    var uid = req.user._id
    var arr = []
    var year = 2025
   /* User.findByIdAndUpdate(uid,{$set:{year:year,product:product}},function(err,locs){
  
    })*/
  



    BlendedItems.find(function(err,docs) {
      // console.log(docs,'docs')
       for(var i = 0;i<docs.length;i++){
     // let product = docs[i].product
      //console.log(docs,'docs')
    
          if(arr.length > 0 && arr.find(value => value.refNumber == docs[i].refNumber  && value.product == docs[i].product )){
                 console.log('true')
                //arr.find(value => value.product == docs[i].product).holdingCases += docs[i].holdingCases
           }else{
    arr.push(docs[i])
           }
    
         
       }
      //console.log(arr,'arr')
      //res.send(arr)
     })
    
    

    //BlendedItems.find({product:product}).sort({num:1}).then(docs=>{
       
            res.render('qa/batchNumberList',{pro:pro,listX:arr})
  
    //})
    
  })




   router.get('/folderReg',function(req,res){
    Product.find({}).then(docs=>{
    res.render('qa/itemFolder',{listX:docs})

    })
  })

 

  router.get('/selectMonth/:id/',isLoggedIn,function(req,res){
    var pro = req.user
    var product = req.params.id
    var uid = req.user._id
    var arr = []
    var year = 2025
    User.findByIdAndUpdate(uid,{$set:{year:year,product:product}},function(err,locs){
  
    })
  



    BlendedItems.find({product:product},function(err,docs) {
      // console.log(docs,'docs')
       for(var i = 0;i<docs.length;i++){
     // let product = docs[i].product
      //console.log(docs,'docs')
    
          if(arr.length > 0 && arr.find(value => value.refNumber == docs[i].refNumber  && value.product == docs[i].product )){
                 console.log('true')
                //arr.find(value => value.product == docs[i].product).holdingCases += docs[i].holdingCases
           }else{
    arr.push(docs[i])
           }
    
         
       }
      //console.log(arr,'arr')
      //res.send(arr)
     })
    
    

    //BlendedItems.find({product:product}).sort({num:1}).then(docs=>{
       
            res.render('qa/itemFilesMonthly',{pro:pro,product:product,listX:arr})
  
    //})
    
  })

  

router.get('/folderFiles/:id/:id2',isLoggedIn,function(req,res){
  var arr = []
  
  var errorMsg = req.flash('danger')[0];
  var successMsg = req.flash('success')[0];

   var m = moment()
   var pro = req.user
   
   var year = m.format('YYYY')
   var refNumber = req.params.id
   var product = req.params.id2
   var date = req.user.invoCode
 RepoFiles.find({idNum:refNumber},function(err,docs){
     if(docs){
 
   console.log(docs,'docs')
      let arr=[]
      for(var i = docs.length - 1; i>=0; i--){
  
        arr.push(docs[i])
      }
 
 
 res.render('qa/itemFiles',{listX:arr,product:product,refNumber:refNumber,pro:pro,year:year,successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg}) 
 }
 })
    
 })


 router.get('/blendingTanks',isLoggedIn,function(req,res){
  BlendingTanks.find(function(err,docs){
       res.render('qa/blendingTanks',{listX:docs})

      })
 })



 router.get('/trailFermentation/:id',isLoggedIn,function(req,res){
   var id = req.params.id
  Fermentation.find({batchNumber:id},function(err,docs){
       res.render('qa/trackFermentation',{listX:docs,refNumber:id})

      })
 })



 router.get('/trailOther/:id/:id2/:id3',isLoggedIn,function(req,res){
  var id = req.params.id
  var id3 = req.params.id3
  var ingredient = req.params.id2
  console.log(id3,'id3')
  if(ingredient == 'ginger'){
    Cooking.find({batchNumber:id3},function(err,docs){
      res.render('qa/trackCooking2',{listX:docs,idNum:id3})

     })
  }else if(ingredient == 'bananas'){
    BatchGingerCrush.find({item:ingredient,batchNumber:id3},function(err,docs){
      res.render('qa/trackCrushing',{listX:docs,idNum:id3})

     })
  }


  else if(ingredient == 'gingerGarlic'){
    Cooking.find({batchNumber:id3},function(err,docs){
      res.render('qa/trackCooking2',{listX:docs,idNum:id3})

     })
  }

  else if(ingredient == 'colour'){
    Cooking.find({batchNumber:id3},function(err,docs){

      res.render('qa/trackCooking2',{listX:docs,idNum:id3})

     })
  }

  else if(ingredient == 'gingerTea'){
    Cooking.find({batchNumber:id3},function(err,docs){
      res.render('qa/trackCooking2',{listX:docs,idNum:id3})

     })
  }

  else if(ingredient == 'honey'){
    BatchRR.find({item:'honey',batchNumber:id3},function(err,docs){
      res.render('qa/trackRaw',{listX:docs,idNum:id3})

     })
  }


   else if(ingredient == 'sugar'){
    BatchGingerCrush.find({item:'sugar',batchNumber:id3},function(err,docs){
      let refNumber = docs[0].refNumber
      let sId = docs[0]._id
    BatchRR.find({batchNumber:refNumber},function(err,tocs){

   
      res.render('qa/trackRaw',{listX:tocs,idNum:id3})

     })

    })
  }

  else if(ingredient == 'garlic'){
    Cooking.find({batchNumber:id3},function(err,docs){
      res.render('qa/trackCooking2',{listX:docs,idNum:id3})

     })
  }
})



/* router.get('/trailBatch2/:id/:id2',isLoggedIn,function(req,res){
  var id = req.params.id
  var item = req.params.id2
  BatchGingerCrush.find({item:item,batchNumber:id},function(err,docs){
    res.render('rStock/trackCrushing',{listX:docs})

     })
})*/


router.get('/trailBatch2/:id/:id2/:id3',isLoggedIn,function(req,res){
  var id = req.params.id
  var item = req.params.id2
  var id3  = req.params.id3
  if(item == 'ginger'){
   
  BatchGingerCrush.find({item:item,batchNumber:id3},function(err,docs){
    res.render('qa/trackCrushing',{listX:docs,idNum:id3})

     })
  }else if(item == 'bananas'){
    BatchRR.find({item:item,batchNumber:id3},function(err,docs){
      res.render('qa/trackRaw',{listX:docs,idNum:id3})

     })
  }

  else if(item == 'tea'){
    BatchGingerCrush.find({item:item,batchNumber:id3},function(err,docs){
      if(docs.length > 0){
        let refNumber = docs[0].refNumber
        BatchRR.find({item:item,batchNumber:refNumber},function(err,locs){


          res.render('qa/trackRaw',{listX:locs,idNum:id3})
        })
      }
      

     })
  }

 else if(item == 'garlic'){
   
    BatchGingerCrush.find({item:item,batchNumber:id3},function(err,docs){
      res.render('qa/trackCrushing',{listX:docs,idNum:id3})
 
       })
      }


      else if(item == 'sugar'){
        BatchGingerCrush.find({item:'sugar',batchNumber:id3},function(err,docs){
          let refNumber = docs[0].refNumber
          let sId = docs[0]._id
        BatchRR.find({batchNumber:refNumber},function(err,tocs){
    
       
          res.render('qa/trackRaw',{listX:tocs,idNum:id3})
    
         })
    
        })
      }

      else if(item == 'lemon'){
   
        BatchGingerCrush.find({item:item,batchNumber:id3},function(err,docs){
          res.render('qa/trackCrushing',{listX:docs,idNum:id3})
     
           })
          }


          else if(item == 'honey'){
            BatchRR.find({item:item,batchNumber:id3},function(err,docs){
              res.render('qa/trackRaw',{listX:docs,idNum:id3})
        
             })
          }
})






router.get('/trailBatch3/:id/:id2/:id3',isLoggedIn,function(req,res){
  var id = req.params.id
  var item = req.params.id2
  var id3 = req.params.id3
  if(item == 'ginger'){
  BatchGingerWash.find({item:item,batchNumber:id3},function(err,docs){
    res.render('qa/trackWashing',{listX:docs,id:id3})

     })
    }else if(item == 'bananas'){
      BatchRR.find({item:item,grvNumber:id3},function(err,docs){
        res.render('qa/trackRaw',{listX:docs})
 
       })
    }

    if(item == 'garlic'){
      BatchRR.find({item:item,grvNumber:id3},function(err,docs){
        res.render('qa/trackWashing',{listX:docs})
   
         })
        }


        if(item == 'honey'){
          BatchRR.find({item:item,grvNumber:id3},function(err,docs){
            res.render('qa/trackWashing',{listX:docs})
       
             })
            }


            if(item == 'lemon'){
              BatchRR.find({item:item,grvNumber:id3},function(err,docs){
                res.render('qa/trackWashing',{listX:docs})
           
                 })
                }
})


router.get('/trailBatch4/:id/:id2',isLoggedIn,function(req,res){
  var id = req.params.id
  var item = req.params.id2
  BatchRR.find({item:item,grvNumber:id},function(err,docs){
    res.render('qa/trackRaw',{listX:docs})

   })
})

router.get('/statementGenGW/:id',isLoggedIn,function(req,res){
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
  BatchGingerWash.find({batchNumber:id}).lean().then(docs=>{


  
let item = docs[0].item
let refNumber = docs[0].refNumber
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
  const content = await compile('gw',docs)
  
  //const content = await compile('index',arr[code])
  
  await page.setContent(content, { waitUntil: 'networkidle2'});
  //await page.setContent(content)
  //create a pdf document
  await page.emulateMediaType('screen')
  //let height = await page.evaluate(() => document.documentElement.offsetHeight);
  await page.evaluate(() => matchMedia('screen').matches);
  await page.setContent(content, { waitUntil: 'networkidle0'});
  //console.log(await page.pdf(),'7777')
   
  let filename = 'GW'+seqNum+'.pdf'
  await page.pdf({
  //path:('../gitzoid2/reports/'+year+'/'+month+'/'+uid+'.pdf'),
  path:(`./public/statements/${year}/${month}/GW${seqNum}`+'.pdf'),
  format:"A4",
  width:'30cm',
  height:'21cm',
  landscape: true,
  //height: height + 'px',
  printBackground:true
  
  })
  
  //res.redirect('/rm/fileIdGW/'+filename)
  res.redirect('/quality/openFileGW/'+seqNum)
  var repo = new RepoFiles();
  
  repo.filename = filename;
  repo.fileId = "null";
  repo.status = 'GW'
  repo.type = 'Washing'
  repo.item = item
  repo.date = mformat
  repo.year = year;
  repo.idNum = id
  repo.refNumber = refNumber
  
  
  console.log('done')
  
  repo.save().then(poll =>{
  
  })
  
  
  //upload.single('3400_Blessing_Musasa.pdf')
  
  
  
  /*await browser.close()
  
  /*process.exit()*/
  
  const file = await fs.readFile(`./public/statements/${year}/${month}/GW${seqNum}`+'.pdf');
  const form = new FormData();
  form.append("file", file,filename);
  //const headers = form.getHeaders();
  //Axios.defaults.headers.cookie = cookies;
  //console.log(form)
  await Axios({
    method: "POST",
   //url: 'https://portal.steuritinternationalschool.org/clerk/uploadStatement',
 url: 'https://niyonsoft.org/quality/uploadStatementGW',
  //url:'http://localhost:8000/rm/uploadStatementGW',
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
  

  router.get('/openFileGW/:id',isLoggedIn,function(req,res){
    var seqNum = req.params.id
   // var batchNumber = req.user.batchNumber
    var m = moment()
    var mformat = m.format('L')
    var month = m.format('MMMM')
    var year = m.format('YYYY')
    const path =`./public/statements/${year}/${month}/GW${seqNum}.pdf`
    if (fs.existsSync(path)) {
        res.contentType("application/pdf");
        fs.createReadStream(path).pipe(res)
    } else {
        res.status(500)
        console.log('File not found')
        res.send('File not found')
    }
    
    })
    


  
router.post('/uploadStatementGW',upload.single('file'),(req,res,nxt)=>{
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
res.redirect('/rm/fileIdGW/'+filename)
})

})


router.get('/fileIdGW/:id',function(req,res){
console.log(req.params.id)
var id = req.params.id

res.redirect('/rm/openGW/'+id)

})


router.get('/openGW/:id',(req,res)=>{
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


///gingerCrushing

router.get('/statementGenGC/:id',isLoggedIn,function(req,res){
//console.log(arrStatementR,'arrSingleUpdate')
var arrStatemementR=[]
var m = moment()
var mformat = m.format('L')
var month = m.format('MMMM')
var year = m.format('YYYY')
var date = req.user.date
var id = req.params.id
//var receiveDate = req.user.dispatchDate
//var code ="Tiana Madzima"

var arrG = []
BatchGingerCrush.find({type:"normal",batchNumber:id}).lean().then(docs=>{

if(docs){
  let refNumber = docs[0].refNumber
  let item = docs[0].item



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
const content = await compile('gc',docs)

//const content = await compile('index',arr[code])

await page.setContent(content, { waitUntil: 'networkidle2'});
//await page.setContent(content)
//create a pdf document
await page.emulateMediaType('screen')
//let height = await page.evaluate(() => document.documentElement.offsetHeight);
await page.evaluate(() => matchMedia('screen').matches);
await page.setContent(content, { waitUntil: 'networkidle0'});
//console.log(await page.pdf(),'7777')

let filename = 'GC'+seqNum+'.pdf'
await page.pdf({
//path:('../gitzoid2/reports/'+year+'/'+month+'/'+uid+'.pdf'),
path:(`./public/statements/${year}/${month}/GC${seqNum}`+'.pdf'),
format:"A4",
width:'30cm',
height:'21cm',
//height: height + 'px',
landscape: true,
printBackground:true

})

//res.redirect('/rm/fileIdGC/'+filename)
res.redirect('/quality/openFileGC/'+seqNum)
var repo = new RepoFiles();

repo.filename = filename;
repo.fileId = "null";
repo.status = 'GC'
repo.type = 'Crushing'
repo.item = item
repo.date = mformat
repo.year = year;
repo.idNum = id
repo.refNumber = refNumber
repo.month = month


console.log('done')

repo.save().then(poll =>{

})


//upload.single('3400_Blessing_Musasa.pdf')



/*await browser.close()

/*process.exit()*/

const file = await fs.readFile(`./public/statements/${year}/${month}/GC${seqNum}`+'.pdf');
const form = new FormData();
form.append("file", file,filename);
//const headers = form.getHeaders();
//Axios.defaults.headers.cookie = cookies;
//console.log(form)
await Axios({
method: "POST",
//url: 'https://portal.steuritinternationalschool.org/clerk/uploadStatement',
url: 'https://niyonsoft.org/quality/uploadStatementGC',
//url:'http://localhost:8000/rm/uploadStatementGC',
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
}
})

//res.redirect('/hostel/discList')

})



router.get('/openFileGC/:id',isLoggedIn,function(req,res){
var seqNum= req.params.id
var batchNumber = req.user.batchNumber
var m = moment()
var mformat = m.format('L')
var month = m.format('MMMM')
var year = m.format('YYYY')
const path =`./public/statements/${year}/${month}/GC${seqNum}`+'.pdf'
if (fs.existsSync(path)) {
res.contentType("application/pdf");
fs.createReadStream(path).pipe(res)
} else {
res.status(500)
console.log('File not found')
res.send('File not found')
}

})


router.post('/uploadStatementGC',upload.single('file'),(req,res,nxt)=>{
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
res.redirect('/quality/fileIdGC/'+filename)
})

})


router.get('/fileIdGC/:id',function(req,res){
console.log(req.params.id)
var id = req.params.id

res.redirect('/quality/openGC/'+id)

})


router.get('/openGC/:id',(req,res)=>{
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

///cooking

router.get('/statementGenCN/:id',isLoggedIn,function(req,res){
//console.log(arrStatementR,'arrSingleUpdate')
var arrStatemementR=[]
var m = moment()
var mformat = m.format('L')
var month = m.format('MMMM')
var year = m.format('YYYY')
var date = req.user.date
var id = req.params.id
//var receiveDate = req.user.dispatchDate
//var code ="Tiana Madzima"

var arrG = []
Cooking.find({batchNumber:id}).lean().then(docs=>{

if(docs){
  let refNumber = docs[0].refNumber
  let item = docs[0].item



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
const content = await compile('gcn',docs)

//const content = await compile('index',arr[code])

await page.setContent(content, { waitUntil: 'networkidle2'});
//await page.setContent(content)
//create a pdf document
await page.emulateMediaType('screen')
//let height = await page.evaluate(() => document.documentElement.offsetHeight);
await page.evaluate(() => matchMedia('screen').matches);
await page.setContent(content, { waitUntil: 'networkidle0'});
//console.log(await page.pdf(),'7777')

let filename = 'CN'+seqNum+'.pdf'
await page.pdf({
//path:('../gitzoid2/reports/'+year+'/'+month+'/'+uid+'.pdf'),
path:(`./public/statements/${year}/${month}/CN${seqNum}`+'.pdf'),
format:"A4",
width:'30cm',
height:'21cm',
//height: height + 'px',
landscape: true,
printBackground:true

})

//res.redirect('/rm/fileIdGC/'+filename)
res.redirect('/quality/openFileCN/'+seqNum)
var repo = new RepoFiles();

repo.filename = filename;
repo.fileId = "null";
repo.status = 'CN'
repo.type = 'Cooking'
repo.item = item
repo.date = mformat
repo.year = year;
repo.refNumber = refNumber
repo.idNum = id
repo.month = month


console.log('done')

repo.save().then(poll =>{

})


//upload.single('3400_Blessing_Musasa.pdf')



/*await browser.close()

/*process.exit()*/

const file = await fs.readFile(`./public/statements/${year}/${month}/CN${seqNum}`+'.pdf');
const form = new FormData();
form.append("file", file,filename);
//const headers = form.getHeaders();
//Axios.defaults.headers.cookie = cookies;
//console.log(form)
await Axios({
method: "POST",
//url: 'https://portal.steuritinternationalschool.org/clerk/uploadStatement',
url: 'https://niyonsoft.org/quality/uploadStatementGC',
//url:'http://localhost:8000/rm/uploadStatementCN',
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
}
})

//res.redirect('/hostel/discList')

})



router.get('/openFileCN/:id',isLoggedIn,function(req,res){
var seqNum= req.params.id
//var batchNumber = req.user.batchNumber
var m = moment()
var mformat = m.format('L')
var month = m.format('MMMM')
var year = m.format('YYYY')
const path =`./public/statements/${year}/${month}/CN${seqNum}`+'.pdf'
if (fs.existsSync(path)) {
res.contentType("application/pdf");
fs.createReadStream(path).pipe(res)
} else {
res.status(500)
console.log('File not found')
res.send('File not found')
}

})


router.post('/uploadStatementCN',upload.single('file'),(req,res,nxt)=>{
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
res.redirect('/quality/fileIdCN/'+filename)
})

})


router.get('/fileIdCN/:id',function(req,res){
console.log(req.params.id)
var id = req.params.id

res.redirect('/quality/openCN/'+id)

})


router.get('/openCN/:id',(req,res)=>{
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

//fermentation
router.get('/statementGenFM/:id',isLoggedIn,function(req,res){
//console.log(arrStatementR,'arrSingleUpdate')
var arrStatemementR=[]
var m = moment()
var mformat = m.format('L')
var month = m.format('MMMM')
var year = m.format('YYYY')
var date = req.user.date
var idNum = req.params.id
console.log(idNum,'idNum')
//var receiveDate = req.user.dispatchDate
//var code ="Tiana Madzima"

var arrG = []
Fermentation.find({batchNumber:idNum}).lean().then(docs=>{

if(docs){
let refNumber = docs[0].refNumber
let item = docs[0].item



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
const content = await compile('fermentation',docs)

//const content = await compile('index',arr[code])

await page.setContent(content, { waitUntil: 'networkidle2'});
//await page.setContent(content)
//create a pdf document
await page.emulateMediaType('screen')
//let height = await page.evaluate(() => document.documentElement.offsetHeight);
await page.evaluate(() => matchMedia('screen').matches);
await page.setContent(content, { waitUntil: 'networkidle0'});
//console.log(await page.pdf(),'7777')

let filename = 'FM'+seqNum+'.pdf'
await page.pdf({
//path:('../gitzoid2/reports/'+year+'/'+month+'/'+uid+'.pdf'),
path:(`./public/statements/${year}/${month}/FM${seqNum}`+'.pdf'),
format:"A4",
width:'30cm',
height:'21cm',
//height: height + 'px',
printBackground:true

})

//res.redirect('/rm/fileIdGC/'+filename)
res.redirect('/quality/openFileFM/'+seqNum)
var repo = new RepoFiles();

repo.filename = filename;
repo.fileId = "null";
repo.status = 'FM'
repo.type = 'Fermentation'
repo.item = item
repo.date = mformat
repo.year = year;
repo.refNumber = refNumber
repo.idNum = idNum
repo.month = month


console.log('done')

repo.save().then(poll =>{

})


//upload.single('3400_Blessing_Musasa.pdf')



/*await browser.close()

/*process.exit()*/

const file = await fs.readFile(`./public/statements/${year}/${month}/FM${seqNum}`+'.pdf');
const form = new FormData();
form.append("file", file,filename);
//const headers = form.getHeaders();
//Axios.defaults.headers.cookie = cookies;
//console.log(form)
await Axios({
method: "POST",
//url: 'https://portal.steuritinternationalschool.org/clerk/uploadStatement',
//url: 'https://niyonsoft.org/rm/uploadStatementGC',
url:'https://niyonsoft.org/quality/uploadStatementFM',
//url:'http://localhost:8000/rm/uploadStatementFM',
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
}
})

//res.redirect('/hostel/discList')

})



router.get('/openFileFM/:id',isLoggedIn,function(req,res){
var seqNum= req.params.id
//var batchNumber = req.user.batchNumber
var m = moment()
var mformat = m.format('L')
var month = m.format('MMMM')
var year = m.format('YYYY')
const path =`./public/statements/${year}/${month}/FM${seqNum}`+'.pdf'
if (fs.existsSync(path)) {
res.contentType("application/pdf");
fs.createReadStream(path).pipe(res)
} else {
res.status(500)
console.log('File not found')
res.send('File not found')
}

})


router.post('/uploadStatementFM',upload.single('file'),(req,res,nxt)=>{
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
res.redirect('/quality/fileIdFM/'+filename)
})

})


router.get('/fileIdFM/:id',function(req,res){
console.log(req.params.id)
var id = req.params.id

res.redirect('/quality/openFM/'+id)

})


router.get('/openFM/:id',(req,res)=>{
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


/////////////////





router.get('/grvFileRM/:id/:id2',isLoggedIn,function(req,res){

var m = moment()
var mformat = m.format('L')
var month = m.format('MMMM')
var year = m.format('YYYY')
var date = req.user.date
var refNumber = req.params.id2
let batchId = req.user.batchId
var idNum = req.params.id

BatchRR.find({refNumber:refNumber}).lean().then(docs=>{






const compile = async function (templateName,docs ){
const filePath = path.join(process.cwd(),'templates',`${templateName}.hbs`)

const html = await fs.readFile(filePath, 'utf8')

return hbs.compile(html)(docs)

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
const content = await compile('grv',docs)



await page.setContent(content, { waitUntil: 'networkidle2'});

await page.emulateMediaType('screen')
let height = await page.evaluate(() => document.documentElement.offsetHeight);
await page.evaluate(() => matchMedia('screen').matches);
await page.setContent(content, { waitUntil: 'networkidle0'});


let filename = 'grv'+refNumber+'.pdf'
await page.pdf({

path:(`./public/grv/${year}/${month}/grv${refNumber}`+'.pdf'),
format:"A4",

height: height + 'px',
printBackground:true

})


res.redirect('/quality/openFileRM/'+refNumber)


var repo = new RepoFiles();

repo.filename = filename;
repo.fileId = "null";
repo.status = 'RM'
repo.type = 'Raw'
repo.date = mformat
repo.year = year;
repo.refNumber = refNumber
repo.idNum = idNum
repo.month = month


console.log('done')

repo.save().then(poll =>{

})





const file = await fs.readFile(`./public/grv/${year}/${month}/grv${refNumber}`+'.pdf');
const form = new FormData();
form.append("file", file,filename);

await Axios({
method: "POST",
//url: 'https://portal.steuritinternationalschool.org/clerk/uploadStatement',
//url: 'https://niyonsoft.org/uploadStatementDispatch',
 url:'https://niyonsoft.org/quality/uploadGrvRM',
//url:'localhost:8000/rm/uploadGrvRM',
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

router.get('/openFileRM/:id',isLoggedIn,function(req,res){
var refNumber = req.params.id

var m = moment()
var mformat = m.format('L')
var month = m.format('MMMM')
var year = m.format('YYYY')
const path =`./public/grv/${year}/${month}/grv${refNumber}.pdf`
if (fs.existsSync(path)) {
res.contentType("application/pdf");
fs.createReadStream(path).pipe(res)
} else {
res.status(500)
console.log('File not found')
res.send('File not found')
}

})

router.post('/uploadGRVRM',upload.single('file'),(req,res,nxt)=>{
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
res.redirect('/quality/fileIdGrvRM/'+filename)
})

})

router.get('/fileIdGrvRM/:id',function(req,res){
console.log(req.params.id)
var id = req.params.id

res.redirect('/quality/openGrvRM/'+id)

})


router.get('/openGrvRM/:id',(req,res)=>{
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










router.get('/packagingBatchList',isLoggedIn,function(req,res){
  res.render('qa/packagingBatch')
})



router.post('/packagingBatchList',isLoggedIn,function(req,res){
  var date = req.body.date
  var shift = req.body.shift
  var product = req.body.product


  let id = req.user._id
  let m = moment()
  var month = m.format('MMMM')
  var year = m.format('YYYY')
  req.check('date','Enter Date').notEmpty();
  //req.check('name','Enter Name').notEmpty();
  req.check('shift','Enter Shift').notEmpty();
  req.check('product','Enter Product').notEmpty();
  

  
  var errors = req.validationErrors();

  if (errors) {
    
    req.session.errors = errors;
    req.session.success = false;
    req.flash('danger', req.session.errors[0].msg);


    res.redirect('/quality/packagingBatchList');
  
}
else{


let date6 =  moment().format('l');
let dateValue = moment().valueOf()

let date7 =  date6.replace(/\//g, "");


 



    RefNo.find({date:date,type:"packaging"},function(err,docs){
      let size = docs.length + 1
     refNo = date7+'B'+size+'P'
      console.log(refNo,'refNo')
  
      
      var truck = new BatchPackaging()
      truck.date = date
      truck.mformat = date6
      truck.dateValue = dateValue
      truck.shift = shift
      truck.batchNumber = refNo
      truck.product = product
      /*truck.volume = volume
      truck.taste = taste*/
      truck.month = month
      truck.year = year
 
     

     
      
     
  
      truck.save()
          .then(pro =>{
  
            User.findByIdAndUpdate(id,{$set:{product:product,shift:shift,date:date,batchId:pro._id}},function(err,vocs){

            })
            var book = new RefNo();
            book.refNumber = refNo
            book.date = date
            book.type = 'Packaging'
            book.save()
            .then(prod =>{
        
             
              res.redirect('/quality/packaging/'+pro._id)
        
            })

          })

        })

     
  //res.redirect('/rm/gingerWash2')
}
})




router.get('/packaging/:id',isLoggedIn,function(req,res){

  var id = req.params.id
  BatchPackaging.findById(id,function(err,doc){
  let date = doc.date
  let shift = doc.shift
  let product = doc.product
 
    res.render('qa/packagingMaterial',{product:product,
    shift:shift,date:date,id:id})
  })
  })
  

  router.post('/packagingMat/',isLoggedIn,function(req,res){

    var product = req.body.product
    var batchNumber = req.body.batchNumber
    var volume = req.body.volume
    var taste = req.body.taste
    var label = req.body.label
    var time = req.body.time
    var date = req.body.date
    var batchId = req.body.batchId
    var tank = req.body.tank
    //var refNumber = req.body.refNumber
    var shift = req.body.shift
   // var operator = req.body.operator
    //var teamLeader = req.body.teamLeader
  
  
    console.log(product,'product')
  
  
  var cook = new Packaging()
  cook.product = product
  cook.volume = volume
  cook.batchNumber = batchNumber
  cook.taste = taste
  cook.label = label
  cook.tank = tank
  cook.time = time
  cook.date = date
  cook.shift = shift
  cook.batchId = batchId

  
  cook.save()
        .then(pro =>{
        
          res.send(pro)
        
        })
    
  
  
  
  
  
  })


  router.get('/closePackagingBatch/:id',isLoggedIn,function(req,res){
    var id = req.params.id
    let arrV = []
    let number1 
    var m = moment()
    var month = m.format('MMMM')
    var year = m.format('YYYY')
    var mformat = m.format('L')
    let total

    Packaging.find({batchId:id},function(err,docs){
      
let refNumber = docs[0].batchNumber
      for(var i = 0;i<docs.length; i++){
           
        arrV.push(docs[i].volume)
          }
          //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
         console.log(arrV,'arrV')
        
        //InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
        number1=0;
        for(var z in arrV) { number1 += arrV[z]; }
        total = number1
   
        BatchPackaging.findByIdAndUpdate(id,{$set:{volume:number1,refNumber:refNumber}},function(err,locs){

        })

        for(var i = 0;i<docs.length; i++){
           
      let refNumber = docs[i].batchNumber
      let tank = docs[i].tank
      let litres = docs[i].volume
            
        BlendedItems.find({refNumber:refNumber,blendingTank:tank},function(err,focs){

let nVolume = litres - focs[0].litres
let bId = focs[0]._id

if(nVolume > 0){
BlendedItems.findByIdAndUpdate(bId,{$set:{nLitres:nVolume}},function(err,tocs){

})
}else{
  BlendedItems.findByIdAndUpdate(bId,{$set:{nLitres:0,status:"emptied"}},function(err,tocs){

  })
}
        })

      }






      for(var i = 0;i<docs.length; i++){
           
        let refNumber = docs[i].batchNumber
        let tank = docs[i].tank
        let litres = docs[i].volume
              
          BlendingTanks.find({refNumber:refNumber,tankNumber:tank},function(err,focs){
  
  let nVolume =  focs[0].litres - litres
  let bId = focs[0]._id
  
  if(nVolume > 0){
  BlendingTanks.findByIdAndUpdate(bId,{$set:{litres:nVolume}},function(err,tocs){
  
  })
  }else{
    BlendingTanks.findByIdAndUpdate(bId,{$set:{litres:0,product:"null",refNumber:"null"}},function(err,tocs){
  
    })
  }
          })
  
        }
  


res.redirect('/quality/warehouseStock')

    })

  })
  
  
  
  //Autocomplete for Crush
  router.get('/autocompleteBatchNumber/',isLoggedIn, function(req, res, next) {
    var id = req.user._id


      var regex= new RegExp(req.query["term"],'i');
     
      var itemFilter =BlendedItems.find({ refNumber:regex,status:'null'}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
    
      
      itemFilter.exec(function(err,data){
     
   
    console.log('data',data)
    
    var result=[];
    
    if(!err){
       if(data && data.length && data.length>0){
         data.forEach(shop=>{
   

   
       
    
            
           let obj={
             id:shop._id,
             label: shop.refNumber
  
         
       
         
           
            
    
             
           };
          
           result.push(obj);
        
          })
      
    
       }
     
       res.jsonp(result);
  
      }
    
    })
   
    });
  
 
//this route shop
    router.post('/autoBatchNumber',isLoggedIn,function(req,res){
        var code = req.body.code
  

    
        
       
        BlendedItems.find({refNumber:code},function(err,docs){
       if(docs == undefined){
         res.redirect('/')
       }else

          res.send(docs[0])
        })
      
      
      })
 




 //Autocomplete for Crush
 router.get('/autocompleteTank/',isLoggedIn, function(req, res, next) {
  var id = req.user._id
  var customer = req.user.autoCustomer

    var regex= new RegExp(req.query["term"],'i');
   
    var itemFilter =BlendingTanks.find({ tankNumber:regex},{'tankNumber':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
  
    
    itemFilter.exec(function(err,data){
   
 
  console.log('data',data)
  
  var result=[];
  
  if(!err){
     if(data && data.length && data.length>0){
       data.forEach(shop=>{
 

 
     
  
          
         let obj={
           id:shop._id,
           label: shop.tankNumber

       
     
       
         
          
  
           
         };
        
         result.push(obj);
      
        })
    
  
     }
   
     res.jsonp(result);

    }
  
  })
 
  });


//this route shop
  router.post('/autoTank',isLoggedIn,function(req,res){
      var code = req.body.code


  
      
     
      BlendingTanks.find({tankNumber:code},function(err,docs){
     if(docs == undefined){
       res.redirect('/')
     }else

        res.send(docs[0])
      })
    
    
    })




    

  

router.get('/blendingDays/:id',isLoggedIn,function(req,res){
  var id = req.params.id
  BlendingTanks.findById(id,function(err,doc){
    var tankNumber = doc.tankNumber
    var product = doc.product
    var litres = doc.litres
    var refNumber = doc.refNumber
BlendingDays.find({batchId:id},function(err,docs){
  if(docs.length >= 2){
    res.render('qa/blend3',{tankNumber:tankNumber,product:product,
      litres:litres,refNumber:refNumber,id:id})
  }else{
    res.render('qa/blend2',{tankNumber:tankNumber,product:product,
    litres:litres,refNumber:refNumber,id:id})
  }
  })

})
})



router.post('/blendingDays/',isLoggedIn,function(req,res){
 console.log('333333')
 var id = req.body.id
   //var batchNumber = req.body.batchNumber


 var m = moment()
 var month = m.format('MMMM')
   var color = req.body.color
   var date = req.body.date
   var odour = req.body.odour
   var refNumber = req.body.refNumber
   var mouthfeel = req.body.mouthfeel
   var taste= req.body.taste
   var product = req.body.product
   var afterTaste = req.body.afterTaste

   var litres = req.body.litres
   var tankNumber = req.body.tankNumber

   console.log(tankNumber,'tankNumber')
 
   var m = moment(date)

   var year = m.format('YYYY')
 
   var date = m.format('L')
   var numDate = m.valueOf()

BlendingDays.find({batchId:id},function(err,docs){
  let size = docs.length + 1

 var cook = new BlendingDays()
 cook.product = product
 cook.afterTaste = afterTaste
 cook.colour = color
 cook.date = date
 cook.odour = odour
 cook.month = month
 cook.tankNumber = tankNumber
 cook.year = year
 cook.batchId = id
 cook.mouthfeel = mouthfeel
 cook.taste= taste
 cook.batchId = id
 cook.pos = size
 cook.litres = litres
 cook.status = 'normal'
 cook.refNumber = refNumber
 //cook.operator = operator
 
 cook.save()
       .then(pro =>{
         console.log(pro,'pro')



         
         res.send(pro)
       
       })

      })
   
})

router.get('/blendingReload/:id',function(req,res){
var id = req.params.id
console.log(id,'id')
BlendingDays.find({batchId:id},function(err,docs){
  res.send(docs)
})
})








router.post('/blendingExtraDays/',isLoggedIn,function(req,res){
  console.log('333333')
  var id = req.body.id
    //var batchNumber = req.body.batchNumber
  var m = moment()
  var month = m.format('MMMM')
    var reason = req.body.reason
    var date = req.body.date
   
    var refNumber = req.body.refNumber
    
    var product = req.body.product

    var litres = req.body.litres
    var tankNumber = req.body.tankNumber
  
    var m = moment(date)
 
    var year = m.format('YYYY')
  
    var date = m.format('L')
    var numDate = m.valueOf()
  var cook = new BlendingDays()
  cook.product = product
  cook.reason = reason
  cook.date = date

  cook.month = month
  cook.tankNumber = tankNumber
  cook.year = year
  cook.qualityAssurance = 'pending'
  cook.supervisor = 'pending'
  cook.md = 'pending'
  cook.batchId = id
  cook.litres = litres
  cook.status = 'extra'
  cook.refNumber = refNumber
  //cook.operator = operator
  
  cook.save()
        .then(pro =>{
          console.log(pro,'pro')
 
 
 
          
          res.send(pro)
        
        })
    
 })



 router.get('/blendingExtraReload/:id',function(req,res){
  var id = req.params.id
  console.log(id,'id')
  BlendingDays.find({batchId:id,status:'extra'},function(err,docs){
    res.send(docs)
  })
  })



router.get('/closeBlending',isLoggedIn,function(req,res){
  res.redirect('/quality/blendingTanks')
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
    