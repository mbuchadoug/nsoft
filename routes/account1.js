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
const { Vonage } = require('@vonage/server-sdk')

const vonage = new Vonage({
  apiKey: "64ff8fb9",
  apiSecret: "F4nr3GVpi9NynJSu"
})

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

    StockVoucher.find({status1:"null"},function(err,docs){
        if(docs){
            res.render('accounts1/approve1',{listX:docs})
        }
    })
})


router.get('/approve/:id',isLoggedIn,function(req,res){
    var id = req.params.id
    var name = req.user.fullname

    StockVoucher.findByIdAndUpdate(id,{$set:{approver1:name,status2:"pending",status1:"approved"}},function(err,doc){



      
      /*const from = "Kambucha"
      const to = "263771446827"
      const text = 'Check Stock Requisition of'+' '+doc.requestedMassKgs+' '+doc.item
      
      async function sendSMS() {
          await vonage.sms.send({to, from, text})
              .then(resp => { console.log('Message sent successfully'); console.log(resp); })
              .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
      }
      
      sendSMS();*/

      const accountSid = 'AC242271b8616514bb11c25c9513538395';
      const authToken = '95d50bdc50ec268f2213a1a1634c65ea';
      const client = require('twilio')(accountSid, authToken);
      client.messages
          .create({
            body:'Check Stock Requisition of'+' '+doc.requestedMassKgs+' '+doc.item,
            from: '+12194198819',
            to: '+263781165357'
          })
          .then(message => console.log(message.sid));

    })

    res.redirect('/accounts1/stockRequisitions')
})




router.get('/reject/:id',isLoggedIn,function(req,res){
    var id = req.params.id
    var name = req.user.fullname
    StockVoucher.findByIdAndUpdate(id,{$set:{approver1:name,status1:"rejected"}},function(err,docs){


    })

    res.redirect('/accounts1/stockRequisitions')
})





router.get('/defer/:id',isLoggedIn,function(req,res){
    var id = req.params.id
    var name = req.user.fullname
    StockVoucher.findByIdAndUpdate(id,{$set:{approver1:name,status1:"deferred"}},function(err,docs){


    })

    res.redirect('/accounts1/stockRequisitions')
})




router.get('/grvListView',isLoggedIn,function(req,res){
  BatchRR.find({status:"complete"},function(err,docs){
    res.render('accounts1/grvList',{listX:docs})
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
  res.redirect('/accounts1/price/'+id2)
  
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
  res.render('accounts1/price',{pro:pro,mobile:mobile,id:id,refNumber:refNumber,item:item,requestedMassKgs:requestedMassKgs,
  receivedTonnes:receivedTonnes,receivedKgs:receivedKgs,requestedMassTonnes:requestedMassTonnes,supplier:supplier,supplierAddress:supplierAddress,closingStock:closingStock})
  
  })
  })
  



router.post('/price/:id',isLoggedIn,function(req,res){
  var id = req.params.id
  var price = req.body.price
  var receivedKgs = req.body.receivedKgs

var invoiceNumber = req.user.invoiceNumber
  
var errors = req.validationErrors();
 
if (errors) {
 
 req.session.errors = errors;
 req.session.success = false;
 console.log( req.session.errors[0].msg)
 req.flash('danger', req.session.errors[0].msg);
      
       
 res.redirect('/accounts1/price/'+id);

}

else{

  let subtotal = price * receivedKgs

  BatchRR.findByIdAndUpdate(id,{$set:{price:price,subtotal:subtotal,priceStatus:"set",invoiceNumber:invoiceNumber}},function(err,docs){

  })

  res.redirect('/accounts1/supplierInvoice/'+id)
}
})






router.get('/supplierInvoice/:id',isLoggedIn,function(req,res){
var id = req.params.id
let invoiceNumber = req.user.num

BatchRR.find({priceStatus:"set"},function(err,vocs){


BatchRR.find({_id:id},function(err,docs){
  res.render('accounts1/pdf',{listX:docs,listX2:vocs,invoiceNumber:invoiceNumber})
})

})
})


router.get('/supplierInvoices',isLoggedIn,function(req,res){
 
  
  
  BatchRR.find({priceStatus:"set"},function(err,vocs){
  if(vocs.length > 0){

let id = vocs[0]._id
  
  BatchRR.find({_id:id},function(err,docs){
    res.render('accounts1/pdf',{listX:docs,listX2:vocs})
  })

}
  
  })
  })
  


  router.get('/grvList',isLoggedIn,function(req,res){
    BatchRR.find({status:"complete"},function(err,docs){
      if(docs.length > 1){

      
      BatchRR.find({_id:id},function(err,locs){
        console.log(locs,'locs')
   
       res.render('accounts1/grv2',{listX:locs,listX2:docs})
     })
    }else{
      res.render('accounts1/grvEmpty')
    }
    
    })
  })

  router.get('/viewGRV/:id',isLoggedIn,function(req,res){
    var id = req.params.id
  
    BatchRR.find({status:"complete"},function(err,docs){
  
     BatchRR.find({_id:id},function(err,locs){
       console.log(locs,'locs')
  
      res.render('accounts1/grv2',{listX:locs,listX2:docs})
    })
    })
  
  })



  
router.get('/purchaseOrders/',isLoggedIn,function(req,res){
 

  StockVoucher.find({status:'approved'},function(err,docs){

   

   // console.log(docs,'ok')
    res.render('accounts1/purchaseOrder2',{listX:docs,listX2:docs})
  })
  

})




router.get('/viewPurchaseOrders/:id',isLoggedIn,function(req,res){

  BatchRR.find({status:'complete'},function(err,locs){

  BatchRR.find({status:'complete'},function(err,docs){

   // console.log(docs,'ok')
    res.render('accounts1/purchaseOrder2',{listX:docs,listX2:locs})
  })
  })

})






router.get('/invoicePdf',function(req,res){
  res.render('accounts1/pdf2')
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
 url: 'https://niyonsoft.org/accounts3/uploadStatement',
    //url:'http://localhost:8000/accounts1/uploadStatement',
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









module.exports = router;
  
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  else{
      res.redirect('/')
  }
}
