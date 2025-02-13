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




router.get('/voucherNumberUpdate',isLoggedIn,function(req,res){
  var id = req.user._id
 
   VoucherNum.find(function(err,doc){
      let voucherNum = doc[0].num
      let vouId = doc[0]._id
  
  
  User.findByIdAndUpdate(id,{$set:{voucherNumber:voucherNum}},function(err,docs){
  
  })
  voucherNum++
  
  VoucherNum.findByIdAndUpdate(vouId,{$set:{num:voucherNum}},function(err,tocs){
  
  })

  res.redirect('/rm/stockRequisition')
  
    })
  
  })




router.get('/stockRequisition',isLoggedIn,function(req,res){
    var errorMsg = req.flash('danger')[0];
    var successMsg = req.flash('success')[0];
    var voucherNumber = req.user.voucherNumber
  res.render('rStock/batchRequisition',{successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg,voucherNumber:voucherNumber})
  
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
    var year = 2024
    let requestedMassTonnes,requestedMassKgs
    let date6 = moment().format('l');
    let date7 =  date6.replace(/\//g, "");
  
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
    let voucherNumber = req.user.voucherNumber
    
  
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

        StockVoucher.find({year:year},function(err,docs){
          let size = docs.length + 1
          let  purchaseOrder = date7+'P0'+size+'RM'

      
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
        user.purchaseOrderNum = purchaseOrder
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
let date6 = moment().format('l');
let date7 =  date6.replace(/\//g, "");


BatchRR.find({year:year},function(err,docs){
  let size = docs.length + 1
  let  batchNumber = date7+item+size



BatchRR.findByIdAndUpdate(id,{$set:{supplier:supplier,mobile:mobile,
driver:driver,address:address,regNumber:regNumber,trailer:trailer,batchNumber:batchNumber}},function(err,docs){




let uid = req.user._id
User.findByIdAndUpdate(uid,{$set:{refNumber:refNo,batchId:id,batchNumber:batchNumber }},function(err,docs){

})

  


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
  let batchNumber = docs.batchNumber

 res.render('rStock/addMaterial',{date:date,supplier:supplier,mass:mass,
item:item,refNumber:refNumber,batchNumber:batchNumber,driver:driver,pro:pro,id:id,regNumber:regNumber})
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
  let batchNumber = docs[0].batchNumber
  let idNumber = docs[0].idNumber
  let voucherNumber = docs[0].voucherNumber
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
stock.voucherNumber = voucherNumber
stock.batchNumber = batchNumber
stock.idNumber = idNumber
stock.trailer = trailer
stock.voucherNumber = voucherNumber
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
  
 
  res.redirect('/rm/viewGRV/'+batchId)



  
  
  
 
 
  const file = await fs.readFile(`./public/grv/${year}/${month}/grv${batchNumber}`+'.pdf');
  const form = new FormData();
  form.append("file", file,filename);
  
  await Axios({
    method: "POST",
   //url: 'https://portal.steuritinternationalschool.org/clerk/uploadStatement',
     //url: 'https://niyonsoft.org/uploadStatementDispatch',
     //url:'https://niyonsoft.org/uploadGrv',
     url:'localhost:8000/rm/uploadGrv',
    headers: {
      "Content-Type": "multipart/form-data"  
    },
    data: form
  });
  
  
  res.redirect('/rm/fileIdGrv/'+filename);
  
  
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
  res.redirect('/rm/fileIdGrv/'+filename)
  })
  
  })

  router.get('/fileIdGrv/:id',function(req,res){
    console.log(req.params.id)
    var id = req.params.id
    
    res.redirect('/rm/openGrv/'+id)
    
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



  







    router.post('/batchAuto',function(req,res){
      
      BatchRR.find({status:"complete"},function(err,docs){
        res.send(docs)
      })
    })
    

    
  router.get('/batch',isLoggedIn,function(req,res){
    /*var errorMsg = req.flash('danger')[0];
  var successMsg = req.flash('success')[0];*/
  var pro = req.user
  var readonly = 'hidden'
  var read =''

  BatchRR.find({status:'complete'}).lean().then(docs=>{
  var arr = docs

  res.render('rStock/batch',{arr:arr,pro:pro,user:req.query,readonly:readonly,read:read})
  })

  })


  router.post('/batch',isLoggedIn,function(req,res){
    var date = req.body.date
    var shift = req.body.shift
    var batchNumber = req.body.batchNumber
    let id = req.user._id
    let m = moment()
    var month = m.format('MMMM')
    var year = m.format('YYYY')
    req.check('date','Enter Date').notEmpty();
    //req.check('name','Enter Name').notEmpty();
    req.check('shift','Enter Shift').notEmpty();
    req.check('batchNumber','Enter BatchNumber').notEmpty();
    

    
    var errors = req.validationErrors();

    if (errors) {
      
      req.session.errors = errors;
      req.session.success = false;
      req.flash('danger', req.session.errors[0].msg);


      res.redirect('/rm/batch');
    
}
else{

  
  let date6 =  moment().format('l');
  let dateValue = moment().valueOf()

  let date7 =  date6.replace(/\//g, "");
  
    BatchRR.find({batchNumber:batchNumber},function(err,docs){
      if(docs){
        let item = docs[0].item
        let supplier = docs[0].supplier
        let availableMass = docs[0].closingWeightKg
        let refNumber = docs[0].refNumber

      User.findByIdAndUpdate(id,{$set:{item:item,supplier:supplier,date:date,availableMass:availableMass,refNumber:refNumber}},function(err,vocs){

      })
      



      RefNo.find({date:date,type:"gingerWash"},function(err,docs){
        let size = docs.length + 1
       refNo = date7+'B'+size+'GW'
        console.log(refNo,'refNo')
    
        var truck = new BatchGingerWash()
        truck.date = date
        truck.mformat = date6
        truck.dateValue = dateValue
        truck.item = item
        truck.refNumber = refNo
        truck.refNumber2 = refNumber
        truck.batchNumber = batchNumber
        truck.month = month
        truck.qtyInMass = 0
        truck.qtyOutMass= 0
        truck.month = month
        truck.status = 'null'
        truck.year = year
       
        
       
    
        truck.save()
            .then(pro =>{
    
              User.findByIdAndUpdate(id,{$set:{refNumber:refNo,batchId:pro._id}},function(err,vocs){

              })
              var book = new RefNo();
              book.refNumber = refNo
              book.date = date
              book.type = 'gingerWash'
              book.save()
              .then(prod =>{
          
               
          
              })

            })

          })

        }

      
    })
    res.redirect('/rm/gingerWash2')
  }
  })


  router.get('/gingerWash2',isLoggedIn,function(req,res){
    res.redirect('/rm/gingerWash')
  })


  router.get('/gingerWash/',isLoggedIn,function(req,res){
var supplier = req.user.supplier
var item = req.user.item
var date = req.user.date
var batchNumber = req.user.batchNumber
var refNumber = req.user.refNumber
var availableMass = req.user.availableMass
var batchId = req.user.batchId

res.render('rStock/addMaterial2',{supplier:supplier,batchNumber:batchNumber,
refNumber:refNumber,availableMass:availableMass,item:item,date:date,batchId:batchId})

    
    
    })
    


    router.post('/qtyInGingerWash',function(req,res){
      var m = moment()
      var mformat = m.format('L')
      var month = m.format('MMMM')
      var year = m.format('YYYY')
      let dateValue = moment().valueOf()
      let arrV = []
      let number1
      let refNo = req.user.refNumber
      let batchId = req.user.batchId
      let mass = req.body.code
      let massTonne
      let batchNumber = req.body.batchNumber
      BatchRR.find({batchNumber:batchNumber},function(err,docs){
        //console.log(docs,'docs')
        let supplier = docs[0].supplier
        let item = docs[0].item
        let date = docs[0].date
        let driver = docs[0].driver
        let regNumber = docs[0].regNumber
        let mobile = docs[0].mobile
        let trailer = docs[0].trailer
        let address = docs[0].address
        let batchNumber = docs[0].batchNumber
        let refNumber2 = docs[0].refNumber2
        let idNumber = docs[0].idNumber
        let voucherNumber = docs[0].voucherNumber
        let dateValue = docs[0].dateValue
        let openingWeightKg = docs[0].openingWeightKg
        let openingWeightTonne = docs[0].openingWeightTonne
        let newMassNum = 0
      
      
      
      GingerWash.find({batchNumber:batchNumber},function(err,docs){
      
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
       console.log(batchId,'batchId')
      var stock = new GingerWash();
      stock.weight = weight
      stock.date =mformat
      stock.address = address
      stock.regNumber = regNumber
      stock.item = item
      stock.status = "ready"
      stock.supplier = supplier
      stock.driver = driver
      stock.type = 'qtyIn'
      stock.voucherNumber = voucherNumber
      stock.batchNumber = batchNumber
      stock.trailer = trailer
      stock.voucherNumber = voucherNumber
      stock.refNumber = refNo
      stock.refNumber2 = refNumber2
      stock.mobile = mobile
      stock.month = month
      stock.year = year
      stock.batchId = batchId
      stock.openingBatchWeightKg = openingWeightKg
     
      stock.openingMass = number1
      stock.newMass = mass
      stock.closingMass = massNum + number1
      stock.size = size
      stock.dateValue = dateValue
      
      stock.save()
      .then(pro =>{
      
        res.send(pro)
      
      })
      
      
      
      })
      
      })
      })
      

      router.get('/closeBatch/:id',isLoggedIn,function(req,res){
        let id = req.params.id
        let refNumber = req.user.refNumber
        let number1
        let arrV=[]
        let batchId = req.user.batchId
        console.log(id,batchId,'id')
        GingerWash.find({batchId:batchId,refNumber:refNumber,type:'qtyIn'},function(err,docs){

          for(var i = 0;i<docs.length; i++){
           
          arrV.push(docs[i].newMass)
            }
            //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
           console.log(arrV,'arrV')
          
          //InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
          number1=0;
          for(var z in arrV) { number1 += arrV[z]; }

          BatchGingerWash.findByIdAndUpdate(batchId,{$set:{qtyInMass:number1,status:'qtyIn'}},function(err,vocs){

          })
          res.redirect('/rm/batch')
        })
      
       
      })
      

  
      
 
router.get('/batchList',function(req,res){
  BatchGingerWash.find(function(err,docs){
  
    let arr=[]
    for(var i = docs.length - 1; i>=0; i--){
  
      arr.push(docs[i])
    }
  
    res.render('rStock/batchList',{listX:arr})
  
  })
  
  
  
  })



  
  router.get('/gingerWashQtyOut/:id/',isLoggedIn,function(req,res){
    var id = req.params.id

    GingerWash.find({refNumber:id},function(err,docs){

    
    var supplier = docs[0].supplier
    var item = docs[0].item
    var date = docs[0].date
    var batchNumber = docs[0].batchNumber
    var refNumber = docs[0].refNumber
    var availableMass = docs[0].availableMass
    var batchId = docs[0].batchId

    BatchGingerWash.findById(batchId,function(err,doc){
      let availableMass = doc.qtyInMass
   
    
    res.render('rStock/addMaterial3',{supplier:supplier,batchNumber:batchNumber,
    refNumber:refNumber,availableMass:availableMass,item:item,date:date,batchId:batchId})
    
  })
}) 
        })
        

        

    router.post('/qtyOutGingerWash',function(req,res){
      var m = moment()
      var mformat = m.format('L')
      var month = m.format('MMMM')
      var year = m.format('YYYY')
      let dateValue = moment().valueOf()
      let arrV = []
      let number1
      let refNo = req.body.refNumber
      let batchId = req.body.batchId
      let availableMass = req.body.availableMass
      let mass = req.body.code
      let massTonne
      let batchNumber = req.body.batchNumber
      BatchRR.find({batchNumber:batchNumber},function(err,docs){
        //console.log(docs,'docs')
        let supplier = docs[0].supplier
        let item = docs[0].item
        let date = docs[0].date
        let driver = docs[0].driver
        let regNumber = docs[0].regNumber
        let mobile = docs[0].mobile
        let trailer = docs[0].trailer
        let address = docs[0].address
        let batchNumber = docs[0].batchNumber
        let idNumber = docs[0].idNumber
        let voucherNumber = docs[0].voucherNumber
        let dateValue = docs[0].dateValue
        let openingWeightKg = docs[0].openingWeightKg
        let openingWeightTonne = docs[0].openingWeightTonne
        let newMassNum = 0
      
      let number2
      
      GingerWash.find({batchNumber:batchNumber,type:'qtyOut'},function(err,docs){
      
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

   number2 =availableMass - number1
      let reg = /\d+\.*\d*/g;
      let resultQty = mass.match(reg)
      let massNum = Number(resultQty)
      
      let total5 = massNum + number1
      
      massNum.toFixed(2)
      let size = docs.length + 1
      let weight = 'weight'+size
       console.log(batchId,'batchId')
      var stock = new GingerWash();
      stock.weight = weight
      stock.date =mformat
      stock.address = address
      stock.regNumber = regNumber
      stock.item = item
      stock.status = "ready"
      stock.supplier = supplier
      stock.driver = driver
      stock.type = 'qtyOut'
      stock.voucherNumber = voucherNumber
      stock.batchNumber = batchNumber
      stock.trailer = trailer
      stock.voucherNumber = voucherNumber
      stock.refNumber = refNo
      stock.mobile = mobile
      stock.month = month
      stock.year = year
      stock.batchId = batchId
      stock.openingBatchWeightKg = availableMass
     
      stock.openingMass = number2
      stock.newMass = mass
      stock.closingMass = number2 - massNum
      stock.size = size
      stock.dateValue = dateValue
      
      stock.save()
      .then(pro =>{
      
        res.send(pro)
      
      })
      
      
      
      })
      
      })
      })




      
      router.get('/closeBatchOut/:id',isLoggedIn,function(req,res){
        let id = req.params.id
        let refNumber = req.user.refNumber
        let number1
        let arrV=[]
        let batchId = req.user.batchId
        let variance
        console.log(id,batchId,'id')
        GingerWash.find({batchId:batchId,refNumber:refNumber,type:'qtyOut'},function(err,docs){

          for(var i = 0;i<docs.length; i++){
           
          arrV.push(docs[i].newMass)
            }
            //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
           console.log(arrV,'arrV')
          
          //InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
          number1=0;
          for(var z in arrV) { number1 += arrV[z]; }

          BatchGingerWash.findById(batchId,function(err,doc){
            let qtyInMass= doc.qtyInMass
            variance = number1 - qtyInMass
          BatchGingerWash.findByIdAndUpdate(batchId,{$set:{qtyOutMass:number1,status:'qtyOut',variance:variance}},function(err,vocs){

          })

        })
          res.redirect('/rm/batch')
        })
      
       
      })
      
      router.get('/crushBatch',isLoggedIn,function(req,res){
        /*var errorMsg = req.flash('danger')[0];
      var successMsg = req.flash('success')[0];*/
      var pro = req.user
      var readonly = 'hidden'
      var read =''
    
      BatchGingerWash.find({status:'qtyOut'}).lean().then(docs=>{
      var arr = docs
    
      res.render('rStock/batchCrushing',{arr:arr,pro:pro,user:req.query,readonly:readonly,read:read})
      })
    
      })
      

      

  router.post('/crushBatch',isLoggedIn,function(req,res){
    var date = req.body.date
    var shift = req.body.shift
    var batchNumber = req.body.batchNumber
    let id = req.user._id
    let m = moment()
    var month = m.format('MMMM')
    var year = m.format('YYYY')
    req.check('date','Enter Date').notEmpty();
    //req.check('name','Enter Name').notEmpty();
    req.check('shift','Enter Shift').notEmpty();
    req.check('batchNumber','Enter BatchNumber').notEmpty();
    

    
    var errors = req.validationErrors();

    if (errors) {
      
      req.session.errors = errors;
      req.session.success = false;
      req.flash('danger', req.session.errors[0].msg);


      res.redirect('/rm/crushBatch');
    
}
else{

  
  let date6 =  moment().format('l');
  let dateValue = moment().valueOf()

  let date7 =  date6.replace(/\//g, "");
  
    BatchGingerWash.find({batchNumber:batchNumber},function(err,docs){
      if(docs){
        let item = docs[0].item
     
        let availableMass = docs[0].qtyOutMass
        let refNumber = docs[0].refNumber

      User.findByIdAndUpdate(id,{$set:{item:item,date:date,availableMass:availableMass,refNumber:refNumber}},function(err,vocs){

      })
      



      RefNo.find({date:date,type:"gingerCrush"},function(err,docs){
        let size = docs.length + 1
       refNo = date7+'B'+size+'GC'
        console.log(refNo,'refNo')
    
        var truck = new BatchGingerCrush()
        truck.date = date
        truck.mformat = date6
        truck.dateValue = dateValue
        truck.item = item
        truck.refNumber = refNo
        truck.refNumber2 = batchNumber
        truck.batchNumber = batchNumber
        truck.month = month
        truck.qtyInMass = 0
        truck.qtyOutMass= 0
        truck.month = month
        truck.status = 'null'
        truck.year = year
       
        
       
    
        truck.save()
            .then(pro =>{
    
              User.findByIdAndUpdate(id,{$set:{refNumber:refNo,batchId:pro._id}},function(err,vocs){

              })
              var book = new RefNo();
              book.refNumber = refNo
              book.date = date
              book.type = 'gingerCrush'
              book.save()
              .then(prod =>{
          
               
          
              })

            })

          })

        }

      
    })
    res.redirect('/rm/crush2')
  }
  })



  
  router.get('/crush2',isLoggedIn,function(req,res){
    res.redirect('/rm/crush')
  })


  router.get('/crush/',isLoggedIn,function(req,res){

var item = req.user.item
var date = req.user.date
var batchNumber = req.user.batchNumber
var refNumber = req.user.refNumber
var availableMass = req.user.availableMass
var batchId = req.user.batchId

res.render('rStock/addMaterialCrush',{batchNumber:batchNumber,
refNumber:refNumber,availableMass:availableMass,item:item,date:date,batchId:batchId})

    
    
    })
    


    router.post('/qtyInGingerCrush',function(req,res){
      var m = moment()
      var mformat = m.format('L')
      var month = m.format('MMMM')
      var year = m.format('YYYY')
      let dateValue = moment().valueOf()
      let arrV = []
      let number1
      let refNo = req.user.refNumber
      let batchId = req.user.batchId
      let mass = req.body.code
      let massTonne
      let batchNumber = req.body.batchNumber
      BatchGingerWash.find({batchNumber:batchNumber},function(err,docs){
        //console.log(docs,'docs')
      
        let item = docs[0].item
        let date = docs[0].date
       // let refNo = docs[0].refNumber
        let batchNumber = docs[0].batchNumber
       
        let dateValue = docs[0].dateValue
        let openingMass= docs[0].qtyOutMass

        let newMassNum = 0
      
      
      
      GingerCrush.find({batchNumber:batchNumber},function(err,docs){
      
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
       console.log(batchId,'batchId')
      var stock = new GingerCrush();
      stock.weight = weight
      stock.date =mformat
      stock.item = item
      stock.status = "ready"
      stock.type = 'qtyIn'
      stock.batchNumber = batchNumber
      stock.refNumber = refNo
      stock.month = month
      stock.year = year
      stock.batchId = batchId
     
      stock.openingMass = number1
      stock.newMass = mass
      stock.closingMass = massNum + number1
      stock.size = size
      stock.dateValue = dateValue
      
      stock.save()
      .then(pro =>{
      
        res.send(pro)
      
      })
      
      
      
      })
      
      })
      })
      

      router.get('/closeBatchCrush/:id',isLoggedIn,function(req,res){
        let id = req.params.id
        let refNumber = req.user.refNumber
        let number1
        let arrV=[]
        let batchId = req.user.batchId
        console.log(id,batchId,'id')
        GingerCrush.find({batchId:batchId,refNumber:refNumber,type:'qtyIn'},function(err,docs){

          for(var i = 0;i<docs.length; i++){
           
          arrV.push(docs[i].newMass)
            }
            //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
           console.log(arrV,'arrV')
          
          //InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
          number1=0;
          for(var z in arrV) { number1 += arrV[z]; }

          BatchGingerCrush.findByIdAndUpdate(batchId,{$set:{qtyInMass:number1,status:'qtyIn'}},function(err,vocs){

          })
          res.redirect('/rm/crushBatch')
        })
      
       
      })
      

  
      
 
router.get('/batchListCrush',function(req,res){
  BatchGingerCrush.find(function(err,docs){
  
    let arr=[]
    for(var i = docs.length - 1; i>=0; i--){
  
      arr.push(docs[i])
    }
  
    res.render('rStock/batchListCrush',{listX:arr})
  
  })
  
  
  
  })









  router.get('/gingerCrushQtyOut/:id/',isLoggedIn,function(req,res){
    var id = req.params.id

    GingerCrush.find({refNumber:id},function(err,docs){

    

    var item = docs[0].item
    var date = docs[0].date
    var batchNumber = docs[0].batchNumber
    var refNumber = docs[0].refNumber
    var availableMass = docs[0].availableMass
    var batchId = docs[0].batchId

    BatchGingerCrush.findById(batchId,function(err,doc){
      let availableMass = doc.qtyInMass
   
    
    res.render('rStock/addMaterialCrush2',{batchNumber:batchNumber,
    refNumber:refNumber,availableMass:availableMass,item:item,date:date,batchId:batchId})
    
  })
}) 
        })
        

        

    router.post('/qtyOutGingerCrush',function(req,res){
      var m = moment()
      var mformat = m.format('L')
      var month = m.format('MMMM')
      var year = m.format('YYYY')
      let dateValue = moment().valueOf()
      let arrV = []
      let number1
      let refNo = req.body.refNumber
      let batchId = req.body.batchId
      let availableMass = req.body.availableMass
      let mass = req.body.code
      let massTonne
      let batchNumber = req.body.batchNumber
      BatchRR.find({batchNumber:batchNumber},function(err,docs){
        //console.log(docs,'docs')
        let supplier = docs[0].supplier
        let item = docs[0].item
        let date = docs[0].date
        let driver = docs[0].driver
        let regNumber = docs[0].regNumber
        let mobile = docs[0].mobile
        let trailer = docs[0].trailer
        let address = docs[0].address
        let batchNumber = docs[0].batchNumber
        let idNumber = docs[0].idNumber
        let voucherNumber = docs[0].voucherNumber
        let dateValue = docs[0].dateValue
        let openingWeightKg = docs[0].openingWeightKg
        let openingWeightTonne = docs[0].openingWeightTonne
        let newMassNum = 0
      
      let number2
      
      GingerCrush.find({batchNumber:batchNumber,type:'qtyOut'},function(err,docs){
      
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

   number2 =availableMass - number1
      let reg = /\d+\.*\d*/g;
      let resultQty = mass.match(reg)
      let massNum = Number(resultQty)
      
      let total5 = massNum + number1
      
      massNum.toFixed(2)
      let size = docs.length + 1
      let weight = 'weight'+size
       console.log(batchId,'batchId')
      var stock = new GingerCrush();
      stock.weight = weight
      stock.date =mformat
      stock.address = address
      stock.regNumber = regNumber
      stock.item = item
      stock.status = "ready"
      stock.supplier = supplier
      stock.driver = driver
      stock.type = 'qtyOut'
      stock.voucherNumber = voucherNumber
      stock.batchNumber = batchNumber
      stock.trailer = trailer
      stock.voucherNumber = voucherNumber
      stock.refNumber = refNo
      stock.mobile = mobile
      stock.month = month
      stock.year = year
      stock.batchId = batchId
      stock.openingBatchWeightKg = availableMass
     
      stock.openingMass = number2
      stock.newMass = mass
      stock.closingMass = number2 - massNum
      stock.size = size
      stock.dateValue = dateValue
      
      stock.save()
      .then(pro =>{
      
        res.send(pro)
      
      })
      
      
      
      })
      
      })
      })




      
      router.get('/closeBatchOutCrush/:id',isLoggedIn,function(req,res){
        let id = req.params.id
        let refNumber = req.user.refNumber
        let number1
        let arrV=[]
        let batchId = req.user.batchId
        let variance
        console.log(id,batchId,'id')
        GingerCrush.find({batchId:batchId,refNumber:refNumber,type:'qtyOut'},function(err,docs){

          for(var i = 0;i<docs.length; i++){
           
          arrV.push(docs[i].newMass)
            }
            //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
           console.log(arrV,'arrV')
          
          //InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
          number1=0;
          for(var z in arrV) { number1 += arrV[z]; }

          BatchGingerCrush.findById(batchId,function(err,doc){
            let qtyInMass= doc.qtyInMass
            variance = number1 - qtyInMass
          BatchGingerCrush.findByIdAndUpdate(batchId,{$set:{qtyOutMass:number1,status:'qtyOut',variance:variance}},function(err,vocs){

          })

        })
          res.redirect('/rm/crushBatch')
        })
      
       
      })
      


router.get('/cooking',isLoggedIn,function(req,res){
  res.render('rStock/cookingBatch')
})


router.post('/cooking',isLoggedIn,function(req,res){
var date = req.body.date
var shift = req.body.shift
var operator = req.body.operator
var teamLeader = req.body.teamLeader
var m = moment()
var month = m.format('MMMM')
var year = m.format('YYYY')
var mformat = m.format('L')
let date6 =  moment().format('l');
let dateValue = moment().valueOf()

let date7 =  date6.replace(/\//g, "");

req.check('date','Enter Date').notEmpty();
req.check('operator','Enter Operator').notEmpty();
req.check('shift','Enter Shift').notEmpty();
req.check('teamLeader','Enter Team Leader').notEmpty();



var errors = req.validationErrors();

if (errors) {
  
  req.session.errors = errors;
  req.session.success = false;
  req.flash('danger', req.session.errors[0].msg);


  res.redirect('/rm/cooking');

}
else{


  RefNo.find({date:date,type:"cooking"},function(err,docs){
    let size = docs.length + 1
   refNo = date7+'B'+size+'CK'
    console.log(refNo,'refNo')

  var stock = new BatchCooking();
  stock.operator = operator
  stock.date =mformat
  stock.shift = shift
  stock.teamLeader = teamLeader
  stock.quantity = 0
  stock.refNumber=refNo
  stock.month = month
  stock.year = year
  
  stock.save()
  .then(pro =>{


   
    var book = new RefNo();
    book.refNumber = refNo
    book.date = date
    book.type = 'cooking'
    book.save()
    .then(prod =>{

      res.redirect('/rm/cooking/'+pro._id)
     

    })
  })

  })
}



})





router.get('/cooking/:id',isLoggedIn,function(req,res){

var id = req.params.id
BatchCooking.findById(id,function(err,doc){
let refNumber = doc.refNumber
let shift = doc.shift
let operator = doc.operator
let teamLeader = doc.teamLeader
let date = doc.date
  res.render('rStock/cookingMaterial',{refNumber:refNumber,
  shift:shift,operator:operator,date:date,id:id,teamLeader:teamLeader})
})
})



router.post('/cookingMat/',isLoggedIn,function(req,res){

  var ingredient = req.body.ingredient
  var batchNumber = req.body.batchNumber
  var quantity = req.body.code
  var potNumber = req.body.potNumber
  var startTime = req.body.time
  var finishTime = req.body.finishTime
  var date = req.body.date
  var refNumber = req.body.refNumber
  var shift = req.body.shift
  var operator = req.body.operator
  var teamLeader = req.body.teamLeader




var cook = new Cooking()
cook.ingredient = ingredient
cook.batchNumber = batchNumber
cook.quantity = quantity
cook.potNumber = potNumber
cook.time = startTime
cook.finishTime = finishTime
cook.date = date
cook.refNumber = refNumber
cook.shift = shift
cook.operator = operator
cook.teamLeader = teamLeader

cook.save()
      .then(pro =>{
      
        res.send(pro)
      
      })
  





})




  //Autocomplete for Crush
  router.get('/autocompleteCrush/',isLoggedIn, function(req, res, next) {
    var id = req.user._id
    var customer = req.user.autoCustomer

      var regex= new RegExp(req.query["term"],'i');
     
      var itemFilter =BatchGingerCrush.find({ item:regex},{'item':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
    
      
      itemFilter.exec(function(err,data){
     
   
    console.log('data',data)
    
    var result=[];
    
    if(!err){
       if(data && data.length && data.length>0){
         data.forEach(shop=>{
   

   
       
    
            
           let obj={
             id:shop._id,
             label: shop.item
  
         
       
         
           
            
    
             
           };
          
           result.push(obj);
        
          })
      
    
       }
     
       res.jsonp(result);
  
      }
    
    })
   
    });
  
 
//this route shop
    router.post('/autoCrush',isLoggedIn,function(req,res){
        var code = req.body.code
  

    
        
       
        BatchGingerCrush.find({item:code},function(err,docs){
       if(docs == undefined){
         res.redirect('/')
       }else

          res.send(docs[0])
        })
      
      
      })
 


      router.get('/closeCookingBatch/:id',isLoggedIn,function(req,res){

var id = req.params.id
let arrV = []
let number1 
var m = moment()
var month = m.format('MMMM')
var year = m.format('YYYY')
var mformat = m.format('L')

BatchCooking.findById(id,function(err,doc){
  let refNumber = doc.refNumber
  let finalProduct

Cooking.find({refNumber:refNumber},function(err,docs){

  for(var i = 0;i<docs.length; i++){
           
    arrV.push(docs[i].quantity)
      }
      //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
     console.log(arrV,'arrV')
    
    //InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
    number1=0;
    for(var z in arrV) { number1 += arrV[z]; }

    BatchCooking.findByIdAndUpdate(id,{$set:{qauntity:number1}},function(err,locs){

    })


if(docs.length > 1){
  if(docs[0].ingredient == "ginger" && docs[1].ingredient == "tea leaves" ||  docs[0].ingredient == "tea leaves" && docs[1].ingredient == "ginger" ){
    finalProduct = 'ginger tea'
  }
  else if(docs[0].ingredient == "sugar" && docs[1].ingredient == "tea leaves" ||  docs[0].ingredient == "tea leaves" && docs[1].ingredient == "sugar"){
    finalProduct = 'colour'
  }else{
    finalProduct = docs[0].ingredient
  }
}else if(docs.length == 1){
if(docs[0].ingredient == 'sugar'){
  finalProduct = 'colour'
}else if(docs[0].ingredient == 'tea leaves'){
  finalProduct = 'tea'
}else{
  finalProduct =docs[0].ingredient 
}
}

    BatchCooking.findByIdAndUpdate(id,{$set:{status:"complete",finalProduct:finalProduct}},function(err,locs){

      Ingredients.find({item:finalProduct},function(err,toc){
        let openingBal = toc[0].massKgs + number1
        let id2 = toc[0]._id

      Ingredients.findByIdAndUpdate(id2,{$set:{massKgs:openingBal}},function(err,vocs){

      })

      })

      var final = new FinalProduct()
      final.refNumber = refNumber
      final.quantity = number1
      final.date = mformat
      final.ingredient = finalProduct
      final.month = month
      final.year = year
      final.status = 'null'

      final.save().then(pro =>{

      
      })
  


    })

})




})
      })



router.get('/batchFermentation',isLoggedIn,function(req,res){
  res.render('rStock/batchFermentation')
})


router.post('/batchFermentation',isLoggedIn,function(req,res){
  var date = req.body.date
  var product = req.body.product
  var operator = req.body.operator
  var water = req.body.water
  var endDate = req.body.endDate
  var m = moment()
  var month = m.format('MMMM')
  var year = m.format('YYYY')
  var mformat = m.format('L')
  let date6 =  moment().format('l');
  let dateValue = moment().valueOf()
  
  let date7 =  date6.replace(/\//g, "");
  
  req.check('date','Enter Date').notEmpty();
  req.check('operator','Enter Operator').notEmpty();
  req.check('water','Enter Litres of Water').notEmpty();
  req.check('product','Enter Product').notEmpty();
  req.check('endDate','Enter End Date').notEmpty();
  
  
  
  var errors = req.validationErrors();
  
  if (errors) {
    
    req.session.errors = errors;
    req.session.success = false;
    req.flash('danger', req.session.errors[0].msg);
  
  
    res.redirect('/rm/batchFermentation');
  
  }
  else{
  
  
    RefNo.find({date:date,type:"fermentation"},function(err,docs){
      let size = docs.length + 1
     refNo = date7+'B'+size+'FM'
      console.log(refNo,'refNo')
  
    var stock = new BatchFermentation();
    stock.operator = operator
    stock.date =date
    stock.water = water
    stock.endDate = endDate
    stock.product = product
    stock.tanksDrained = 0
    stock.quantity = 0
    stock.status ='null'
    stock.refNumber=refNo
    stock.month = month
    stock.year = year
    
    stock.save()
    .then(pro =>{
  
  
     
      var book = new RefNo();
      book.refNumber = refNo
      book.date = date
      book.type = 'fermentation'
      book.save()
      .then(prod =>{
  
        res.redirect('/rm/fermentation/'+pro._id)
       
  
      })
    })
  
    })
  }
  
  
  
  })
  


  router.get('/fermentation/:id',isLoggedIn,function(req,res){
    var errorMsg = req.flash('danger')[0];
    var successMsg = req.flash('success')[0];
   
  
    var id = req.params.id
    BatchFermentation.findById(id,function(err,doc){
    let refNumber = doc.refNumber
    let product = doc.product
    let date = doc.date
    let operator = doc.operator
    let water = doc.water
    
    /*let date = doc.date*/
      res.render('rStock/fermentation',{refNumber:refNumber,
      product:product,operator:operator,date:date,id:id,water:water,successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg})
    })
    })
    
router.get('/fermentationPreload/:id',isLoggedIn,function(req,res){
  var id = req.params.id
console.log(id,'fermentationPreload')
   Fermentation.find({refNumber:id},function(err,docs){
     res.send(docs)
   })
})



    router.post('/fermentationMat/',isLoggedIn,function(req,res){

      var ingredient = req.body.ingredient
      var batchNumber = req.body.batchNumber
      var quantity = req.body.code
      var date = req.body.date
      var refNumber = req.body.refNumber
      var operator = req.body.operator
      var product = req.body.product
      var water = req.body.water
  
    
    
    
    
    var cook = new Fermentation()
    cook.ingredient = ingredient
    cook.batchNumber = batchNumber
    cook.quantity = quantity
    cook.date = date
    cook.product = product
    cook.water = water
    cook.refNumber = refNumber
    cook.operator = operator
    
    cook.save()
          .then(pro =>{
          
            res.send(pro)
          
          })
      
    
    
    
    
    
    })
    
    


  //Autocomplete for Crush
  router.get('/autocompleteFerment/',isLoggedIn, function(req, res, next) {
    var id = req.user._id
    var customer = req.user.autoCustomer

      var regex= new RegExp(req.query["term"],'i');
     
      var itemFilter =FinalProduct.find({ ingredient:regex},{'ingredient':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
    
      
      itemFilter.exec(function(err,data){
     
   
    console.log('data',data)
    
    var result=[];
    
    if(!err){
       if(data && data.length && data.length>0){
         data.forEach(shop=>{
   

   
       
    
            
           let obj={
             id:shop._id,
             label: shop.ingredient
  
         
       
         
           
            
    
             
           };
          
           result.push(obj);
        
          })
      
    
       }
     
       res.jsonp(result);
  
      }
    
    })
   
    });
  
 
//this route shop
    router.post('/autoFerment',isLoggedIn,function(req,res){
        var code = req.body.code
  

    
        
       
        FinalProduct.find({ingredient:code},function(err,docs){
       if(docs == undefined){
         res.redirect('/')
       }else

          res.send(docs[0])
        })
      
      
      })
 



      
      router.post('/closeFermentationBatch/:id',isLoggedIn,function(req,res){

        var id = req.params.id
        let arrV = []
        let number1 

        var m = moment()
        var month = m.format('MMMM')
        var year = m.format('YYYY')
        var mformat = m.format('L')
        var tanks = req.body.code
        let product,  litres, refNumber
      
       console.log(tanks,'tanks')
  
        
        if (tanks == undefined || tanks == "") {
          
          /*req.session.errors = errors;
          req.session.success = false;*/
          req.flash('danger', "Enter Tank");
        
        
          res.redirect('/rm/fermentation/'+id);
        
        }
        else{   
        BatchFermentation.findById(id,function(err,doc){
          let product = doc.product

          FermentationProduct.find({product:product},function(err,docs){
            let oTanks = docs[0].tanks + tanks
            let id2 = docs[0]._id


            FermentationProduct.findByIdAndUpdate(id2,{$set:{tanks:oTanks}},function(err,tocs){

            })

       

BatchFermentation.findByIdAndUpdate(id,{$set:{tanks:tanks}},function(err,gocs){


  res.send(gocs)


})
     
   
})
})

//res.redirect('/rm/batchFermentation')




        }


        })
        

router.get('/draining',isLoggedIn,function(req,res){
  BatchFermentation.find({status:"null"},function(err,docs){
       res.render('rStock/draining',{listX:docs})

      })
 })



 router.get('/draining/:id/:id2/:id3',isLoggedIn,function(req,res){
var id = req.params.id
var product = req.params.id2
var availableTanks = req.params.id3
  res.render('rStock/drain',{id:id,product:product,availableTanks:availableTanks})
 })
        





router.post('/draining/',isLoggedIn,function(req,res){
     var releasedBy = req.body.releasedBy
      //var batchNumber = req.body.batchNumber
      var receivedBy = req.body.receivedBy
      var date = req.body.date
      var refNumber = req.body.refNumber
      var tanks= req.body.tanks
      var product = req.body.product
      //var water = req.body.wat
    
    var cook = new DrainedTanks()
    cook.releasedBy = releasedBy
    //cook.refNumber = refNumber
    cook.receivedBy = receivedBy
    cook.date = date
    cook.product = product
    cook.tanks= tanks
    cook.refNumber = refNumber
    //cook.operator = operator
    
    cook.save()
          .then(pro =>{
          
BatchFermentation.find({refNumber:refNumber},function(err,docs){
let avTanks = docs[0].tanksDrained + pro.tanks
let remainingTanks = docs[0].tanks - avTanks
let id2 = docs[0]._id

if(remainingTanks == 0){


BatchFermentation.findByIdAndUpdate(id2,{$set:{tanksDrained:avTanks,remainingTanks:remainingTanks,status:"drained"}},function(err,vocs){


})
}else{
  BatchFermentation.findByIdAndUpdate(id2,{$set:{tanksDrained:avTanks,remainingTanks:remainingTanks,}},function(err,vocs){


  })
}



FermentationProduct.find({product:product},function(err,docs){
  let oTanks = docs[0].tanks - tanks
  let idF = docs[0]._id
FermentationProduct.findByIdAndUpdate(idF,{$set:{tanks:oTanks}},function(err,yocs){
  
})
})

})


            
            res.send(pro)
          
          })
      
})


router.get('/closeDraining/:id',isLoggedIn,function(req,res){

  res.redirect('/rm/draining')
})

 
  //Autocomplete for Crush
  router.get('/autocompleteDrain/',isLoggedIn, function(req, res, next) {
    var id = req.user._id
    var customer = req.user.autoCustomer

      var regex= new RegExp(req.query["term"],'i');
     
      var itemFilter =BatchFermentation.find({ refNumber:regex},{'refNumber':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
    
      
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
    router.post('/autoDrain',isLoggedIn,function(req,res){
        var code = req.body.code
  

    
        
       
        BatchFermentation.find({refNumber:code},function(err,docs){
       if(docs == undefined){
         res.redirect('/')
       }else

          res.send(docs[0])
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
