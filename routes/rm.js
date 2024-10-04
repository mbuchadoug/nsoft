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


router.get('/stockRequisition',isLoggedIn,function(req,res){
    var errorMsg = req.flash('danger')[0];
    var successMsg = req.flash('success')[0];
  res.render('rStock/batchRequisition',{successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg})
  
  })
        
  router.post('/stockRequisition',isLoggedIn,function(req,res){
    var item =req.body.rawMaterial
    var stockWeight = req.body.stock
    var stockTonne = req.body.stockT
    var requestedMass = req.body.qty
    var name = req.user.fullname
    var userId  = req.user._id
    var dept = req.user.dept
    var description = req.body.description
    var unit = req.body.unit
    let requestedMassTonnes,requestedMassKgs
  
    if(unit == 'kgs'){
      requestedMassTonnes = requestedMass / 1000
      requestedMassKgs = requestedMass
    }
    else if(unit == 'tonnes'){
      requestedMassKgs = requestedMass * 1000
      requestedMassTonnes = requestedMass 
  
    }
  
    var m = moment()
    var mformat = m.format('L')
    var month = m.format('MMMM')
    var year = m.format('YYYY')
    let dateValue = moment().valueOf()
    let voucherNumber = 333
  
    req.check('rawMaterial','Enter Raw Material').notEmpty();
    req.check('stock','Enter Stock on hand').notEmpty();
    req.check('qty','Enter Mass').notEmpty();
    req.check('unit','Enter Unit').notEmpty();
           
                  
               
                 
    
          
       
    var errors = req.validationErrors();
        if (errors) {
    
        
          req.session.errors = errors;
          req.session.success = false;
          req.flash('danger', req.session.errors[0].msg);
  
  
      res.redirect('/rm/stockRequisition');
          
        
      }
  
      else{
        var user = new StockVoucher();
        user.name = name;
        user.description = description
        user.userId = userId;
        user.dept = dept
        user.item = item
        user.status = "pending";
        user.date = mformat
        user.approver1 = "pending";
        user.date1 = "null";
        user.status1 = "null"
        user.approver2 = "null";
        user.date2 = "null";
        user.status2 = "null";
        user.approver3 = "null";
        user.date3 = "null";
        user.status3 = "null";
        user.approver4 = "null";
        user.date4 = "null";
        user.status4 = "null";
        user.month = month
        user.unit = unit
        user.year = year
        user.dateValue = dateValue
        user.currentMassTonnes = stockTonne
        user.currentMassKgs = stockWeight
        user.requestedMass = requestedMass
        user.voucherNumber = voucherNumber
        user.requestedMassTonnes = requestedMassTonnes
        user.requestedMassKgs = requestedMassKgs
       
  
        
        
       
        
         
    
         
  
        user.save()
          .then(user =>{
  
            req.flash('success', 'Request Sent');
  
  
            res.redirect('/rm/stockRequisition');
            
      })
  
  
  
  
      }
  
  })




  

///view approved requisitions, for receiving stock
router.get('/approvedRequisitions',isLoggedIn,function(req,res){
    var errorMsg = req.flash('danger')[0];
  var successMsg = req.flash('success')[0];
    BatchRR.find({status:'pending'},function(err,docs){
  
      res.render('rStock/vouchers',{listX:docs,successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg})
    })
  })
    
  
  router.get('/grvList',isLoggedIn,function(req,res){
    BatchRR.find({status:"complete"},function(err,docs){
      res.render('rStock/grvList',{listX:docs})
    })
  })
  




//////////////////

router.get('/batchRM/:id',isLoggedIn,function(req,res){
var pro = req.user
var id = req.params.id
BatchRR.findById(id,function(err,doc){
  let voucherNo = doc.voucherNo
  let refNumber = doc.refNumber
  let item = doc.item
  let openingWeightTonnes = doc.openingWeightTonne
  let requestedMassTonnes = doc.requestedMassTonnes
res.render('rStock/rcvBatch',{pro:pro,id:id,refNumber:refNumber,item:item,
openingWeightTonnes:openingWeightTonnes,requestedMassTonnes:requestedMassTonnes,voucherNo:voucherNo})

})
})



router.post('/batchRM/:id',isLoggedIn,function(req,res){

//var refNumber = req.body.referenceNumber
var m = moment()
var mformat = m.format('L')
var month = m.format('MMMM')
var year = m.format('YYYY')
var id = req.params.id
var date = req.body.date
var address = req.body.address
var regNumber = req.body.regNumber
var item = req.body.item
var supplier = req.body.supplier
var mobile = req.body.mobile

let driver = req.body.driver
let idNum = req.body.idNum
let trailer = req.body.trailer
let refNo = req.body.refNo
// var lotNumber = req.body.lotNumber
//var location = req.body.location

BatchRR.findByIdAndUpdate(id,{$set:{supplier:supplier,mobile:mobile,
driver:driver,address:address,regNumber:regNumber,trailer:trailer}},function(err,docs){




let uid = req.user._id
User.findByIdAndUpdate(uid,{$set:{refNumber:refNo,batchId:id }},function(err,docs){

})

  


res.redirect('/rm/receiveMaterialV/'+id)

})


})





router.post('/batchAutoStockRM',function(req,res){
var item = req.body.code
var arr = []
console.log(item,'pro7')
RawMat.find({item:item},function(err,docs){
 
 //console.log(arr,'arr')

  res.send(docs)
})
})





router.get('/receiveMaterialV/:id',function(req,res){
var id = req.params.id

res.redirect('/rm/receiveMaterial/'+id)
})

router.get('/receiveMaterial/:id',isLoggedIn,function(req,res){


var pro = req.user
var id = req.params.id
BatchRR.findById(id,function(err,docs){
       if(docs){
  let supplier = docs.supplier
  let item = docs.item
  let date = docs.date
  let driver = docs.driver
  let regNumber = docs.regNumber
  let refNumber = docs.refNumber
  let mass = docs.requestedMassKgs

 res.render('rStock/addMaterial',{date:date,supplier:supplier,mass:mass,
item:item,refNumber:refNumber,driver:driver,pro:pro,id:id,regNumber:regNumber})
 }
})

})


router.post('/receiveMass',function(req,res){
var m = moment()
var mformat = m.format('L')
var month = m.format('MMMM')
var year = m.format('YYYY')
let dateValue = moment().valueOf()
let arrV = []
let number1

let mass = req.body.code
let massTonne
let refNumber = req.body.refNumber
BatchRR.find({refNumber:refNumber},function(err,docs){
  //console.log(docs,'docs')
  let supplier = docs[0].supplier
  let item = docs[0].item
  let date = docs[0].date
  let driver = docs[0].driver
  let regNumber = docs[0].regNumber
  let mobile = docs[0].mobile
  let trailer = docs[0].trailer
  let address = docs[0].address
  let idNumber = docs[0].idNumber
  let dateValue = docs[0].dateValue
  let openingWeightKg = docs[0].openingWeightKg
  let openingWeightTonne = docs[0].openingWeightTonne
  let batchId = docs[0]._id
let newMassNum = 0



StockRM.find({refNumber:refNumber},function(err,docs){

for(var i = 0;i<docs.length; i++){
 // console.log(docs[i].newMass,'serima')
arrV.push(docs[i].newMass)
  }
  //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
 //console.log(arrV,'arrV')

//InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
number1=0;
for(var z in arrV) { number1 += arrV[z]; }
number1.toFixed(2)
let reg = /\d+\.*\d*/g;
let resultQty = mass.match(reg)
let massNum = Number(resultQty)

let total5 = massNum + number1

massNum.toFixed(2)
let size = docs.length + 1
let weight = 'weight'+size
 
var stock = new StockRM();
stock.weight = weight
stock.date = date
stock.address = address
stock.regNumber = regNumber
stock.item = item
stock.supplier = supplier
stock.driver = driver
stock.idNumber = idNumber
stock.trailer = trailer
stock.refNumber = refNumber
stock.mobile = mobile
stock.month = month
stock.year = year
stock.batchId = batchId
stock.openingWeightKg = openingWeightKg
stock.openingWeightTonne = openingWeightTonne
stock.openingMass = number1
stock.newMass = mass
stock.closingMass = massNum + number1

stock.openingMassTonne = number1 / 1000
stock.newMassTonne = mass /1000
stock.closingMassTonne = total5 / 1000
stock.size = size
stock.dateValue = dateValue

stock.save()
.then(pro =>{

  res.send(pro)

})



})

})
})




router.post('/addMaterial3/:id',isLoggedIn, (req, res) => {
var pro = req.user
var m = moment()
var code = req.params.id
var mformat = m.format("L")


StockRM.find({refNumber:code}).lean().sort({'dateValue':1}).then(docs=>{


  res.send(docs)
          })

}); 



router.get('/closeBatchRM/:id',isLoggedIn,function(req,res){

  let refNumber = req.params.id

 StockRM.find({refNumber:refNumber},function(err,docs){

  let batchId = docs[0].batchId

  BatchRR.findByIdAndUpdate(batchId,{$set:{status:"complete"}},function(err,vocs){

  })



  //req.flash('success', 'Goods received successfully');
  

  //res.redirect('/rm/approvedRequisitions')


  res.redirect('/rm/stockRMFile/'+refNumber)

  })

 
})



/*router.get('/closeBatchRM/:id',isLoggedIn,function(req,res){

    let refNumber = req.params.id
    StockRM.find({refNumber:refNumber},function(err,docs){
  
      let size = docs.length - 1
      let mass = docs[size].closingMass
      let subtotal = mass / 50
      subtotal.toFixed(2)
    for(var i = 0; i<docs.length;i++){
      let id = docs[i]._id
      StockRM.findByIdAndUpdate(id,{$set:{subtotal:subtotal}},function(err,locs){
  
        
      })
    }
  
  
  
    })
  
    res.redirect('/rm/stockRMFile/'+refNumber)
  })*/
  

router.get('/stockRMFile/:id',isLoggedIn,function(req,res){
  var uid = req.user._id
  var id = req.params.id

  StockRM.find({refNumber:id},function(err,docs){
    if(docs.length > 0){
  let size = docs.length - 1

  let supplier = docs[size].supplier
  let item = docs[size].item
  let date = docs[size].date
  let driver = docs[size].driver
  let regNumber = docs[size].regNumber
  let mobile = docs[size].mobile
  let trailer = docs[size].trailer
  let address = docs[size].address
  let idNumber = docs[size].idNumber
  let month = docs[size].month
  let year = docs[size].year
  let batchId = docs[size].batchId
  let openingWeight = docs[size].openingWeight
  let openingWeightTonne = docs[size].openingWeightTonne
  console.log(openingWeightTonne,'openingWeightTonne')
  let weight = docs[size].closingMass
  let weightTonne = docs[size].closingMass / 1000
  let dateValue = docs[size].dateValue
  let closingWeight = docs[size].openingWeightKg + docs[size].closingMass
  let closingWeightTonne = closingWeight / 1000
  console.log(closingWeightTonne,'closingWeightTonne')


User.findByIdAndUpdate(uid,{$set:{batchId:batchId}},function(err,locs){


})

  BatchRR.findByIdAndUpdate(batchId,{$set:{receivedKgs:weight,
  receivedTonnes:weightTonne,receivedKgs:weight, closingWeightTonne:closingWeightTonne,
closingWeightKg:closingWeight}},function(err,vocs){

})

RawMat.find({item:item},function(err,hocs){
  let massKgs = hocs[0].massKgs + weight
  let massTonnes = hocs[0].massTonnes + weightTonne
  let idRaw = hocs[0]._id

  RawMat.findByIdAndUpdate(idRaw,{$set:{massKgs:massKgs,massTonnes:massTonnes}},function(err,nocs){

  })

  
})



req.flash('success', 'Goods received successfully');

res.redirect('/rm/approvedRequisitions')

    }
  })
})




/*router.get('/viewGRV/:id',isLoggedIn,function(req,res){
  var refNumber = req.params.id

  StockRMFile.find(function(err,docs){

   StockRMFile.find({refNumber:refNumber},function(err,locs){


    res.render('kambucha/grv2',{listX:locs,listX2:docs})
  })
  })

})*/


router.get('/viewGRV/:id',isLoggedIn,function(req,res){
  var id = req.params.id

  BatchRR.find(function(err,docs){

   BatchRR.find({_id:id},function(err,locs){
     console.log(locs,'locs')

    res.render('rStock/grv2',{listX:locs,listX2:docs})
  })
  })

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
 
   
  let filename = 'grv'+refNumber+'.pdf'
  await page.pdf({
 
  path:(`./public/grv/${year}/${month}/grv${refNumber}`+'.pdf'),
  format:"A4",

  height: height + 'px',
  printBackground:true
  
  })
  
 
  res.redirect('/rm/viewGRV/'+batchId)



  
  
  
 
/*  
  const file = await fs.readFile(`./public/grv/${year}/${month}/grv${refNumber}`+'.pdf');
  const form = new FormData();
  form.append("file", file,filename);
  
  await Axios({
    method: "POST",
   //url: 'https://portal.steuritinternationalschool.org/clerk/uploadStatement',
     //url: 'https://niyonsoft.org/uploadStatementDispatch',
     //url:'https://niyonsoft.org/uploadGrv',
     url:'localhost:8000/uploadGrv',
    headers: {
      "Content-Type": "multipart/form-data"  
    },
    data: form
  });
  
  
  res.redirect('/fileIdGrv/'+filename);*/
  
  
  }catch(e) {
  
  console.log(e)
  
  
  }
  

  
  }) ()
  
  
  
})
  
  

  
  })

router.get('/openFile/:id',isLoggedIn,function(req,res){
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
  res.redirect('/fileIdGrv/'+filename)
  })
  
  })

  router.get('/fileIdGrv/:id',function(req,res){
    console.log(req.params.id)
    var id = req.params.id
    
    res.redirect('/openGrv/'+id)
    
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



  












module.exports = router;
  
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  else{
      res.redirect('/')
  }
}
