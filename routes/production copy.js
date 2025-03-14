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
  res.render('rStock/dash7',{pro:pro,arr:docs,arr1:hocs})
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
    var uid = req.user._id
    var year = 2025
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

           /* const from = "Kambucha"
            const to = "263771446827"
            const text = 'Check Stock Requisition of'+' '+item+' '+requestedMass+'kgs'
            
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
          body:'Check Stock Requisition of'+' '+item+' '+requestedMass+'kgs',
          from: '+12194198819',
          to: '+263781165357'
        })
        .then(message => console.log(message.sid));

            let nV = req.user.voucherNumber + 1
User.findByIdAndUpdate(uid,{$set:{voucherNumber:nV}},function(err,locs){

})
  
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
console.log('postMass')
let mass = req.body.code
let massTonne
let refNumber = req.body.refNumber
BatchRR.find({refNumber:refNumber},function(err,docs){
  console.log(docs,'docs','receiveMass')
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
  let voucherNumber = docs[0].voucherNo
  let dateValue = docs[0].dateValue
  let openingWeightKg = docs[0].openingWeightKg
  let openingWeightTonne = docs[0].openingWeightTonne
  let batchId = docs[0]._id
let newMassNum = 0

console.log(voucherNumber,'voucherNo',docs[0].voucherNo)


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
  

 StockRM.find({refNumber:refNumber},function(err,nocs){

  let batchId = nocs[0].batchId
  let closingMass = nocs[0].closingMass

  BatchRR.findByIdAndUpdate(batchId,{$set:{status:"complete"}},function(err,vocs){

    let batchNumber= vocs.batchNumber
    let item = vocs.item
    let month = vocs.month
    let year = vocs.year
 
    let supplier = vocs.supplier
    let availableMass = vocs.closingWeightKg
    let refNumber = vocs.refNumber
    console.log(availableMass,'availableMass333')
    RawMat.find({item:item},function(err,docs){
      console.log(docs,'letu')
      if(docs[0].item == 'sugar'){
        console.log('true')
        let date =  moment().format('l');
  let date6 =  moment().format('l');
  let dateValue = moment().valueOf()

  let date7 =  date6.replace(/\//g, "");
  

     // User.findByIdAndUpdate(uid,{$set:{item:item,supplier:supplier,date:date,availableMass:availableMass,refNumber:refNumber}},function(err,vocs){

     // })
      


     RefNo.find({date:date,type:"crush"},function(err,docs){
      let size = docs.length + 1
     refNo = date7+'B'+size+item+'crush'
      console.log(refNo,'refNo')
  
      var truck = new BatchGingerCrush()
      truck.date = date
      truck.mformat = date6
      truck.dateValue = dateValue
      truck.item = item
      truck.type ='ingredient'
      truck.refNumber = refNumber
      truck.refNumber2 = refNo
      truck.batchNumber = batchNumber
      truck.month = month
      truck.nxtStage='cooking'
      truck.qtyInMass = closingMass
      truck.qtyOutMass= closingMass
      truck.month = month
      truck.status = 'null'
      truck.year = year
     
      
     
  
      truck.save()
          .then(pro =>{
  
           

            var book = new RefNo();
            book.refNumber = refNo
            book.date = date
            book.type = 'crush'
            book.save()
            .then(prod =>{
        
             
        
            })

          })

        })

      /*RefNo.find({type:item},function(err,docs){
        let size = docs.length + 1
       refNo = date7+'B'+size+item+'crush'
        console.log(refNo,'refNo')*/
    
        /*var truck = new BatchGingerWash()
        truck.date = date
        truck.mformat = date6
        truck.dateValue = dateValue
        truck.item = item
        truck.refNumber = refNo
        truck.refNumber2 = refNumber
        truck.batchNumber = batchNumber
        truck.month = month
        truck.qtyInMass = availableMass
        truck.qtyOutMass= availableMass
        truck.month = month
        truck.type = 'null'
        truck.status = 'null'
        truck.status2 = 'null'
        truck.year = year
        truck.status = 'qtyOut'*/
       
      
       
    
       /* truck.save()
            .then(pro =>{
    
         
             
            })
            })*/

          
      }
          })
    
        })
      
    
  

     
       /* const from = "Kambucha"
        const to = "263771446827"
        const text =availableMass+'kgs'+' '+' '+'of'+' '+item+' '+'Received'
        
        async function sendSMS() {
            await vonage.sms.send({to, from, text})
                .then(resp => { console.log('Message sent successfully'); console.log(resp); })
                .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
        }
        
        sendSMS();*/

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
  console.log(id,'refNumber')

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

RawMat.find({item:item,stage:'raw'},function(err,hocs){
  //if(hocs[0].status == 'wash'){

  
  let massKgs = hocs[0].massKgs + weight
  let massTonnes = hocs[0].massTonnes + weightTonne
  let idRaw = hocs[0]._id
  /*if(hocs[0].stage == 'raw'){
BatchGingerWash.find({refNumber2:id},function(err,nocs){

  if(nocs.length > 0){
    let idG = nocs[0]._id
BatchGingerWash.findByIdAndUpdate(idG,{$set:{qtyInMass:massKgs,qtyOutMass:massKgs}},function(err,focs){

})
  }
})
  }*/

  RawMat.findByIdAndUpdate(idRaw,{$set:{massKgs:massKgs,massTonnes:massTonnes}},function(err,nocs){

  })
  /*}else{
    
  let date6 =  moment().format('l');
  let dateValue = moment().valueOf()

  let date7 =  date6.replace(/\//g, "");
  
    RefNo.find({date:date,type:"crush"},function(err,docs){
      let size = docs.length + 1
     refNo = date7+'B'+size+item+'crush'
      console.log(refNo,'refNo')
  
      var truck = new BatchGingerCrush()
      truck.date = date
      truck.mformat = date6
      truck.dateValue = dateValue
      truck.item = item
      truck.refNumber = refNo
      truck.refNumber2 = id
      truck.batchNumber = id
      truck.month = month
      truck.qtyInMass = 0
      truck.qtyOutMass= 0
      truck.month = month
      truck.status = 'null'
      truck.year = year
     
      
     
  
      truck.save()
          .then(pro =>{
  
          
            var book = new RefNo();
            book.refNumber = refNo
            book.date = date
            book.type = 'crush'
            book.save()
            .then(prod =>{
        
             
        
            })

          })

        })

  }*/
  
})



//req.flash('success', 'Goods received successfully');

//res.redirect('/rm/send-notification/'+weight+'/'+item)
res.redirect('/rm/approvedRequisitions')

    }
  })
})



const sendNotification = async (token,item,weight) => {
  try {
    
    /*const payload = {
      notification: {
        title:  'Raw Material Received',
        body: weight+'kgs'+''+'of'+''+item+''+'received',
        icon: 'https://joldrillingsolutions.co.zw/kambuchaLogo.jpeg',
        data: 'https://niyonsoft.org',
      },
      token: token,
    };*/
    const notification = {
      title:  'Raw Materials Received',
      body: weight+'kgs'+' '+'of'+' '+item+' '+'received',
      image: 'https://joldrillingsolutions.co.zw/kambuchaLogo.jpeg',
    };
    const payload = {
      notification,
      token: token,
      android: {
        notification: {
          icon: 'https://joldrillingsolutions.co.zw/kambuchaLogo.jpeg',
        },
      },
    };

    const response = await admin.messaging().send(payload);
    console.log('Successfully sent message:', response);
  } catch (error) {
    console.error('Error sending message:', error);
  }
};


router.get('/send-notification/:id/:id2', async (req, res) => {
  //const { userId, message } = req.body;
  const item = req.params.id2
  const weight = req.params.id
  var token = 'cHUNFzfzhMKdaXA9KtHTYU:APA91bG2jc8_nKTcTDXp3RrMK_CXmpz7hCfYBWn0qfqjRQzMJqO4xA1jaTTTJAJja5f7dWZEI1ifTYp5p6mlLeRIqME8ObYQDYu56unzh5I7POHRWZPYH_0'
 // var token = 'dFKOKwR9DtAJcsSgv0CeN0:APA91bEDRHKvE-locy0bAmYPO3SJgHuIGP9U2wrQ2YMI6K4bDBr2DwrKtBxkqs-BOP0DFtTQP6C_BSeoA5p66lrzVjdqy5aVhXAKsSBOYIhhIRcH5wSQ4Tk'
 // var token = 'fwfWuFBmb5nGcCFXCxaYJO:APA91bE0V9xlAE4VY6IucQT26P2vHYnAG-y-vI5ZF2eHeYkcqGnLqoT1DrZPjghxi0n7DFoKd-U5Gzep7-5QzAwQXPeabmjVoDy_22kFwERnrv-IyjZx2iA'
//var token = 'foJ4-Leh2t780BuosVi7_M:APA91bEau8haAbUfLgVLtGoBB3QYWUp-bYBCC1hHlxh1rx4KIZqRZoXcyq5u73vYhy-_Iu9HxQZ2UCrpSzxTmLpov-8gZ8k0TguDi8cDqSIiPLdEyeuW13M'
  try {
    await sendNotification(token,item,weight);
    res.status(200).send('Notification sent successfully.');
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }

  
//res.redirect('/rm/send-notification')
//res.redirect('/rm/approvedRequisitions')
});


/*router.get('/viewGRV/:id',isLoggedIn,function(req,res){
  var refNumber = req.params.id

  StockRMFile.find(function(err,docs){

   StockRMFile.find({refNumber:refNumber},function(err,locs){


    res.render('kambucha/grv2',{listX:locs,listX2:docs})
  })
  })

})*/


router.get('/grvList',isLoggedIn,function(req,res){
  BatchRR.find({status:"complete"},function(err,docs){
    res.render('rStock/grvList',{listX:docs})
  })
})



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
      var batchNumber = req.body.code
      BatchRR.find({status:"complete",batchNumber:batchNumber},function(err,docs){
        res.send(docs)
      })
    })
    

    
  router.get('/batch',isLoggedIn,function(req,res){
    /*var errorMsg = req.flash('danger')[0];
  var successMsg = req.flash('success')[0];*/
  var pro = req.user
  var readonly = 'hidden'
  var read =''

  BatchRR.find({status:'complete',stage:"wash"}).lean().then(docs=>{
  var arr = docs

  res.render('rStock/batch',{arr:arr,pro:pro,user:req.query,readonly:readonly,read:read})
  })

  })


  router.post('/batch',isLoggedIn,function(req,res){
    var date = req.body.date
    var shift = req.body.shift
    var batchNumber = req.body.batchNumber


    console.log(batchNumber,'batchNumber666')
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

    RawMat.find({item:item,stage:'raw'},function(err,noc){

    let avbMass = noc[0].massKgs

      User.findByIdAndUpdate(id,{$set:{item:item,supplier:supplier,date:date,availableMass:avbMass,refNumber:refNumber,batchNumber:batchNumber}},function(err,vocs){

      })

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
        truck.status2 = "null"
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
        let item = docs[0].item
          for(var i = 0;i<docs.length; i++){
           
          arrV.push(docs[i].newMass)
            }
            //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
           console.log(arrV,'arrV')
          
          //InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
          number1=0;
          for(var z in arrV) { number1 += arrV[z]; }

          BatchGingerWash.findByIdAndUpdate(batchId,{$set:{qtyInMass:number1,status:'qtyIn'}},function(err,vocs){

            RawMat.find({item:item,stage:'raw'},function(err,tocs){
              let opBal = tocs[0].massKgs - number1
              let opBalTonnes = opBal / 1000
              let id4 = tocs[0]._id
            RawMat.findByIdAndUpdate(id4,{massKgs:opBal,massTonnes:opBalTonnes},function(err,locs){

            })  

            })

           /* RawMat.find({item:item,stage:'wash'},function(err,focs){
              let opBal2 = focs[0].massKgs + number1
              let id5 = focs[0]._id
              let opBal2Tonnes = opBal2 / 1000

              RawMat.findByIdAndUpdate(id5,{massKgs:opBal2, massTonnes:opBal2Tonnes},function(err,locs){

              }) 
            })*/
          })
          res.redirect('/rm/batchList')
        })
      
       
      })
      

  
      
 
router.get('/batchList',isLoggedIn,function(req,res){
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
      let massTonne, totalMass
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
      stock.totalMass = total5
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
let item = docs[0].item
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
          BatchGingerWash.findByIdAndUpdate(batchId,{$set:{qtyOutMass:number1,status:'qtyOut',variance:variance,nxtStage:"crushing"}},function(err,vocs){


            /*RawMat.find({item:item,stage:'wash'},function(err,tocs){
              let opBal = tocs[0].massKgs - number1
              let opBalTonnes = opBal / 1000
              let id4 = tocs[0]._id
            RawMat.findByIdAndUpdate(id4,{massKgs:opBal,massTonnes:opBalTonnes},function(err,locs){

            })  

            })*/

            RawMat.find({item:item,stage:'wash'},function(err,focs){
              let opBal2 = focs[0].massKgs + number1
              let id5 = focs[0]._id
              let opBal2Tonnes = opBal2 / 1000

              RawMat.findByIdAndUpdate(id5,{massKgs:opBal2, massTonnes:opBal2Tonnes},function(err,locs){

              }) 
            })


            
          })

        })
          res.redirect('/rm/batchList')
        })
      
       
      })
      
      router.get('/crushBatch',isLoggedIn,function(req,res){
        /*var errorMsg = req.flash('danger')[0];
      var successMsg = req.flash('success')[0];*/
      var pro = req.user
      var readonly = 'hidden'
      var read =''
      var arr = []
      

      BatchRR.find({status:'complete',stage:'crush'}).lean().then(ocs=>{

        for(var i = 0;i<ocs.length;i++){
          //console.log(ocs[i],'ocs')
          arr.push(ocs[i])
        }
        
        //arr =ocs
      BatchGingerWash.find({status:'qtyOut',status2:"null"}).lean().then(docs=>{
   // arr.push(docs[0])
    
    for(var i = 0;i<docs.length;i++){
     // console.log(docs[i],'docs')
      arr.push(docs[i])
    }
      //arr=docs
     // console.log(docs[0],'docs')
    console.log(arr,'arr')
      res.render('rStock/batchCrushing',{arr:arr,pro:pro,user:req.query,readonly:readonly,read:read})
      })
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
      if(docs.length > 0){
        let item = docs[0].item
     
        let availableMass = docs[0].qtyOutMass
        let refNumber = docs[0].refNumber

      User.findByIdAndUpdate(id,{$set:{item:item,date:date,availableMass:availableMass,refNumber:refNumber}},function(err,vocs){

      })
      



      RefNo.find({date:date,type:"crush"},function(err,docs){
        let size = docs.length + 1
       refNo = date7+'B'+size+item+'crush'
        console.log(refNo,'refNo')
    
        var truck = new BatchGingerCrush()
        truck.date = date
        truck.mformat = date6
        truck.dateValue = dateValue
        truck.item = item
        truck.refNumber = refNumber
        truck.refNumber2 = refNo
        truck.type ='normal'
        truck.batchNumber = batchNumber
        truck.month = month
        truck.qtyInMass = 0
        truck.qtyOutMass= 0
        truck.month = month
        truck.status = 'null'
        truck.year = year
       
        
       
    
        truck.save()
            .then(pro =>{
    
              User.findByIdAndUpdate(id,{$set:{batchNumber:batchNumber,refNumber:refNo,batchId:pro._id}},function(err,vocs){

              })
              var book = new RefNo();
              book.refNumber = refNo
              book.date = date
              book.type = 'crush'
              book.save()
              .then(prod =>{
          
               
          
              })

            })

          })

        }else{
          BatchRR.find({batchNumber:batchNumber},function(err,docs){
          let item = docs[0].item
     
          let availableMass = docs[0].closingWeightKg
          let refNumber = docs[0].refNumber
  
        User.findByIdAndUpdate(id,{$set:{item:item,date:date,availableMass:availableMass,refNumber:refNumber}},function(err,vocs){
  
        })
        
  
  
  
        RefNo.find({date:date,type:"crush"},function(err,docs){
          let size = docs.length + 1
         refNo = date7+'B'+size+item+'crush'
          console.log(refNo,'refNo')
      
          var truck = new BatchGingerCrush()
          truck.date = date
          truck.mformat = date6
          truck.dateValue = dateValue
          truck.item = item
          truck.refNumber = refNumber
          truck.refNumber2 =refNo
          truck.batchNumber = batchNumber
          truck.month = month
          truck.qtyInMass = 0
          truck.qtyOutMass= 0
          truck.month = month
          truck.type ='normal'
          truck.status = 'null'
          truck.year = year
         
          
         
      
          truck.save()
              .then(pro =>{
      
                User.findByIdAndUpdate(id,{$set:{batchNumber:batchNumber,refNumber:refNo,batchId:pro._id}},function(err,vocs){
  
                })
                var book = new RefNo();
                book.refNumber = refNo
                book.date = date
                book.type = 'crush'
                book.save()
                .then(prod =>{
            
                 
            
                })
  
              })
            })
            })    
        }

        res.redirect('/rm/crush2')
    })
  
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
      var item = req.user.item
      let batchNumber = req.body.batchNumber
      console.log(batchNumber,'batchNumber666')

      if(item == 'ginger'){
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
      stock.totalMass = total5
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
    }else if(item == 'bananas'){

      BatchRR.find({batchNumber:batchNumber},function(err,docs){
        //console.log(docs,'docs')
      
        let item = docs[0].item
        let date = docs[0].date
       // let refNo = docs[0].refNumber
        let batchNumber = docs[0].batchNumber
       
        let dateValue = docs[0].dateValue
        

        
        let openingMass= docs[0].closingWeightKg

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
      stock.totalMass = total5
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



    }


    else if(item == 'lemon'){

      BatchRR.find({batchNumber:batchNumber},function(err,docs){
        //console.log(docs,'docs')
      
        let item = docs[0].item
        let date = docs[0].date
       // let refNo = docs[0].refNumber
        let batchNumber = docs[0].batchNumber
       
        let dateValue = docs[0].dateValue
        

        
        let openingMass= docs[0].closingWeightKg

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
      stock.totalMass = total5
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



    }




    
    else if(item == 'honey'){

      BatchRR.find({batchNumber:batchNumber},function(err,docs){
        //console.log(docs,'docs')
      
        let item = docs[0].item
        let date = docs[0].date
       // let refNo = docs[0].refNumber
        let batchNumber = docs[0].batchNumber
       
        let dateValue = docs[0].dateValue
        

        
        let openingMass= docs[0].closingWeightKg

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
      stock.totalMass = total5
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



    }

    else if(item == 'garlic'){

      BatchRR.find({batchNumber:batchNumber},function(err,docs){
        //console.log(docs,'docs')
      
        let item = docs[0].item
        let date = docs[0].date
       // let refNo = docs[0].refNumber
        let batchNumber = docs[0].batchNumber
       
        let dateValue = docs[0].dateValue
        

        
        let openingMass= docs[0].closingWeightKg

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
      stock.totalMass = total5
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



    }
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

          BatchGingerCrush.findByIdAndUpdate(batchId,{$set:{qtyInMass:number1,status:'qtyIn'}},function(err,doc){
          let item = doc.item

          CrushedItems.find({item:item},function(err,docs){
            let id = docs[0]._id
          CrushedItems.findByIdAndUpdate(id,{$set:{massKgs:number1}},function(err,tocs){

          })
          })

            


          })
          res.redirect('/rm/batchListCrush')
        })
      
       
      })
      

  
      
 
router.get('/batchListCrush',function(req,res){
  BatchGingerCrush.find({type:"normal"},function(err,docs){
  
    let arr=[]
    for(var i = docs.length - 1; i>=0; i--){
  
      arr.push(docs[i])
    }
  
    res.render('rStock/batchListCrush',{listX:arr})
  
  })
  
  
  
  })









  router.get('/gingerCrushQtyOut/:id/',isLoggedIn,function(req,res){
    var id = req.params.id
console.log(id,'id')
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
      stock.totalMass = total5
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
        var m = moment()
        var mformat = m.format("L")
        var month = m.format('MMMM')
      var year = m.format('YYYY')
        let arrV=[]
        let batchId = req.user.batchId
        let variance
        console.log(id,batchId,'id')
        GingerCrush.find({batchId:batchId,refNumber:refNumber,type:'qtyOut'},function(err,docs){
let item = docs[0].item
if(item == 'ginger'){
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
          BatchGingerCrush.findByIdAndUpdate(batchId,{$set:{qtyOutMass:number1,status:'qtyOut',variance:variance,status2:'crushed',nxtStage:'cooking'}},function(err,vocs){
 RawMat.find({item:item,stage:'wash'},function(err,tocs){
              let opBal = tocs[0].massKgs - qtyInMass
              let opBalTonnes = opBal / 1000
              let id4 = tocs[0]._id
            RawMat.findByIdAndUpdate(id4,{massKgs:opBal,massTonnes:opBalTonnes},function(err,locs){

            })  

            })

            RawMat.find({item:item,stage:'crush'},function(err,focs){
              let opBal2 = focs[0].massKgs + number1
              let id5 = focs[0]._id
              let opBal2Tonnes = opBal2 / 1000

              RawMat.findByIdAndUpdate(id5,{massKgs:opBal2, massTonnes:opBal2Tonnes},function(err,locs){

              }) 
            })




          })

        })
        res.redirect('/rm/batchListCrush')

      }else if(item == 'bananas'){
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
          BatchGingerCrush.findByIdAndUpdate(batchId,{$set:{qtyOutMass:number1,status:'qtyOut',variance:variance,status2:'crushed',nxtStage:'fermentation'}},function(err,vocs){
 RawMat.find({item:item,stage:'raw'},function(err,tocs){
              let opBal = tocs[0].massKgs - qtyInMass
              let opBalTonnes = opBal / 1000
              let id4 = tocs[0]._id
            RawMat.findByIdAndUpdate(id4,{massKgs:opBal,massTonnes:opBalTonnes},function(err,locs){

            })  

            })

            RawMat.find({item:item,stage:'crush'},function(err,focs){
              let opBal2 = focs[0].massKgs + number1
              let id5 = focs[0]._id
              let opBal2Tonnes = opBal2 / 1000

              RawMat.findByIdAndUpdate(id5,{massKgs:opBal2, massTonnes:opBal2Tonnes},function(err,locs){

              }) 
            })

            var final = new FinalProduct()
            final.refNumber = refNumber
            final.quantity = number1
            final.date = mformat
            final.ingredient = item
            final.month = month
            final.year = year
            final.status = 'null'
      
            final.save().then(pro =>{
      
              res.redirect('/rm/batchListCrush')
            })


          })

        })
        
      }


      
      else if(item == 'honey'){
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
          BatchGingerCrush.findByIdAndUpdate(batchId,{$set:{qtyOutMass:number1,status:'qtyOut',variance:variance,status2:'crushed',nxtStage:'fermentation'}},function(err,vocs){
 RawMat.find({item:item,stage:'raw'},function(err,tocs){
              let opBal = tocs[0].massKgs - qtyInMass
              let opBalTonnes = opBal / 1000
              let id4 = tocs[0]._id
            RawMat.findByIdAndUpdate(id4,{massKgs:opBal,massTonnes:opBalTonnes},function(err,locs){

            })  

            })

            RawMat.find({item:item,stage:'crush'},function(err,focs){
              let opBal2 = focs[0].massKgs + number1
              let id5 = focs[0]._id
              let opBal2Tonnes = opBal2 / 1000

              RawMat.findByIdAndUpdate(id5,{massKgs:opBal2, massTonnes:opBal2Tonnes},function(err,locs){

              }) 
            })

            var final = new FinalProduct()
            final.refNumber = refNumber
            final.quantity = number1
            final.date = mformat
            final.ingredient = item
            final.month = month
            final.year = year
            final.status = 'null'
      
            final.save().then(pro =>{
      
              res.redirect('/rm/batchListCrush')
            })


          })

        })
        
      }


      else if(item == 'lemon'){
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
          BatchGingerCrush.findByIdAndUpdate(batchId,{$set:{qtyOutMass:number1,status:'qtyOut',variance:variance,status2:'crushed',nxtStage:'fermentation'}},function(err,vocs){
 RawMat.find({item:item,stage:'raw'},function(err,tocs){
              let opBal = tocs[0].massKgs - qtyInMass
              let opBalTonnes = opBal / 1000
              let id4 = tocs[0]._id
            RawMat.findByIdAndUpdate(id4,{massKgs:opBal,massTonnes:opBalTonnes},function(err,locs){

            })  

            })

            RawMat.find({item:item,stage:'crush'},function(err,focs){
              let opBal2 = focs[0].massKgs + number1
              let id5 = focs[0]._id
              let opBal2Tonnes = opBal2 / 1000

              RawMat.findByIdAndUpdate(id5,{massKgs:opBal2, massTonnes:opBal2Tonnes},function(err,locs){

              }) 
            })

            var final = new FinalProduct()
            final.refNumber = refNumber
            final.quantity = number1
            final.date = mformat
            final.ingredient = item
            final.month = month
            final.year = year
            final.status = 'null'
      
            final.save().then(pro =>{
      
              res.redirect('/rm/batchListCrush')
            })


          })

        })
        
      }

      else if(item == 'garlic'){
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
          BatchGingerCrush.findByIdAndUpdate(batchId,{$set:{qtyOutMass:number1,status:'qtyOut',variance:variance,status2:'crushed',nxtStage:'cooking'}},function(err,vocs){
 RawMat.find({item:item,stage:'raw'},function(err,tocs){
              let opBal = tocs[0].massKgs - qtyInMass
              let opBalTonnes = opBal / 1000
              let id4 = tocs[0]._id
            RawMat.findByIdAndUpdate(id4,{massKgs:opBal,massTonnes:opBalTonnes},function(err,locs){

            })  

            })

            RawMat.find({item:item,stage:'crush'},function(err,focs){
              let opBal2 = focs[0].massKgs + number1
              let id5 = focs[0]._id
              let opBal2Tonnes = opBal2 / 1000

              RawMat.findByIdAndUpdate(id5,{massKgs:opBal2, massTonnes:opBal2Tonnes},function(err,locs){

              }) 
            })

            var final = new FinalProduct()
            final.refNumber = refNumber
            final.quantity = number1
            final.date = mformat
            final.ingredient = item
            final.month = month
            final.year = year
            final.status = 'null'
      
            final.save().then(pro =>{
      
              res.redirect('/rm/batchListCrush')
            })


          })

        })
        
      }
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


      var regex= new RegExp(req.query["term"],'i');
     
      var itemFilter =BatchGingerCrush.find({ item:regex,nxtStage:'cooking'},{'item':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
    
      
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
let total

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
    total = number1
    BatchCooking.findByIdAndUpdate(id,{$set:{qauntity:number1}},function(err,locs){

    })

if(docs.length > 1){
  if(docs[0].ingredient == "ginger" && docs[1].ingredient == "tea" ||  docs[0].ingredient == "tea" && docs[1].ingredient == "ginger" ){
    finalProduct = 'gingerTea'
  }
  else if(docs[0].ingredient == "sugar" && docs[1].ingredient == "tea" ||  docs[0].ingredient == "tea" && docs[1].ingredient == "sugar"){
    finalProduct = 'colour'
  }
  else if(docs[0].ingredient == "ginger" && docs[1].ingredient == "garlic" ||  docs[0].ingredient == "garlic" && docs[1].ingredient == "ginger"){
    finalProduct = 'gingerGarlic'
  }
  
  else{
    finalProduct = docs[0].ingredient
  }
}else if(docs.length == 1){
if(docs[0].ingredient == 'sugar'){
  finalProduct = 'colour'
}else if(docs[0].ingredient == 'tea'){
  finalProduct = 'tea'
}
else if(docs[0].ingredient == 'ginger'){
  finalProduct = 'ginger'
}


else{
  finalProduct =docs[0].ingredient 
}
}

    BatchCooking.findByIdAndUpdate(id,{$set:{status:"complete",finalProduct:finalProduct,quantity:number1}},function(err,locs){
      Cooking.find({refNumber:refNumber},function(err,docs){
        for(var i = 0;i<docs.length; i++){

          let cid = docs[i]._id
          Cooking.findByIdAndUpdate(cid,{$set:{finalProduct:finalProduct}},function(err,kocs){
            
          })
          }
        })
      Ingredients.find({item:finalProduct},function(err,toc){
        let openingBal = toc[0].massKgs + number1
        let id2 = toc[0]._id

      Ingredients.findByIdAndUpdate(id2,{$set:{massKgs:openingBal}},function(err,vocs){

      })

      })
  

     RawMat.find({item:finalProduct,stage:'cooking'},function(err,tocs){
        let opBal = tocs[0].massKgs + number1
        let opBalTonnes = opBal / 1000
        let id4 = tocs[0]._id
      RawMat.findByIdAndUpdate(id4,{massKgs:opBal,massTonnes:opBalTonnes},function(err,locs){

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

      Cooking.find({refNumber:refNumber},function(err,docs){

        for(var i = 0;i<docs.length; i++){

          let item = docs[i].ingredient
          let quantity= docs[i].quantity

          if(item == 'sugar'){
            RawMat.find({item:item,stage:'raw'},function(err,tocs){
              if(tocs.length > 0){
              let opBal = tocs[0].massKgs - quantity
              let opBalTonnes = opBal / 1000
              let id4 = tocs[0]._id
            RawMat.findByIdAndUpdate(id4,{massKgs:opBal,massTonnes:opBalTonnes},function(err,locs){
  
            })  
          }
            })
          }
          RawMat.find({item:item,stage:'crush'},function(err,tocs){
            if(tocs.length > 0){
            let opBal = tocs[0].massKgs - quantity
            let opBalTonnes = opBal / 1000
            let id4 = tocs[0]._id
          RawMat.findByIdAndUpdate(id4,{massKgs:opBal,massTonnes:opBalTonnes},function(err,locs){

          })  
        }
          })
        
        }

        })
  

    
    })

})

res.redirect('/rm/batchListIngredients')


})
      })


      
      
 
router.get('/batchListIngredients',function(req,res){
  Ingredients.find(function(err,docs){
  
    let arr=[]
    for(var i = docs.length - 1; i>=0; i--){
  
      arr.push(docs[i])
    }
  
    res.render('rStock/batchListIngredients',{listX:arr})
  
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
  var id = req.user._id
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
  
  User.findByIdAndUpdate(id,{$set:{endDate:endDate}},function(err,rocs){

  })
     
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
      var tanks = req.body.tanks
      var ingredient = req.body.ingredient
      var batchNumber = req.body.batchNumber
      var quantity = req.body.code
      var date = req.body.date
      var refNumber = req.body.refNumber
      var operator = req.body.operator
      var product = req.body.product
      var water = req.body.water
      var endDate = req.user.endDate
  
    
    
    
    
    var cook = new Fermentation()
    cook.ingredient = ingredient
    cook.batchNumber = batchNumber
    cook.quantity = quantity
    cook.date = date
    cook.endDate = endDate
    cook.product = product
    cook.water = water
    cook.refNumber = refNumber
    cook.operator = operator
    
    cook.save()
          .then(pro =>{

            BatchFermentationIngredients.find({refNumber:refNumber,batchNumber:batchNumber,ingredient:ingredient},function(err,docs){
              if(docs.length == 0){
                 var user = new BatchFermentationIngredients();
                  user.ingredient = ingredient;
                  user.quantity = quantity
                  user.tanks = tanks;
                  user.batchNumber = batchNumber
                  user.refNumber = refNumber
                  user.product = product
                  user.status = 'null'
              
                  user.save()
                    .then(user =>{
                    })

                  }else{
            console.log(pro.quantity,'quantity555')
            let idF = docs[0]._id
            let opQ = docs[0].quantity + pro.quantity
            BatchFermentationIngredients.findByIdAndUpdate(idF,{$set:{quantity:opQ}},function(err,pocs){

            })
                  }

                  })

                     if(ingredient == 'ginger'){
                  
                        RawMat.find({item:ingredient,stage:'cooking'},function(err,tocs){
                          let opBal = tocs[0].massKgs - pro.quantity
                          let opBalTonnes = opBal / 1000
                          let id4 = tocs[0]._id
                        RawMat.findByIdAndUpdate(id4,{massKgs:opBal,massTonnes:opBalTonnes},function(err,locs){
              
                        })  
              
                        })
        
        
                        RawMat.find({item:ingredient,stage:'fermentation'},function(err,tocs){
                          let opBal2 = tocs[0].massKgs + pro.quantity
                          let opBalTonnes2 = opBal2 / 1000
                          let id5 = tocs[0]._id
                        RawMat.findByIdAndUpdate(id5,{massKgs:opBal2,massTonnes:opBalTonnes2},function(err,locs){
                  
                        })  
                  
                        })
        
                      }else if(ingredient == 'bananas'){
                        RawMat.find({item:ingredient,stage:'crush'},function(err,tocs){
                          let opBal = tocs[0].massKgs - pro.quantity
                          let opBalTonnes = opBal / 1000
                          let id4 = tocs[0]._id
                        RawMat.findByIdAndUpdate(id4,{massKgs:opBal,massTonnes:opBalTonnes},function(err,locs){
              
                        })  
              
                        })
        
        
                        RawMat.find({item:ingredient,stage:'fermentation'},function(err,tocs){
                          let opBal2 = tocs[0].massKgs + pro.quantity
                          let opBalTonnes2 = opBal2 / 1000
                          let id5 = tocs[0]._id
                        RawMat.findByIdAndUpdate(id5,{massKgs:opBal2,massTonnes:opBalTonnes2},function(err,locs){
                  
                        })  
                  
                        })
        
                      }
                  

                      else if(ingredient == 'colour'){
                        RawMat.find({item:ingredient,stage:'cooking'},function(err,tocs){
                          let opBal = tocs[0].massKgs - pro.quantity
                          let opBalTonnes = opBal / 1000
                          let id4 = tocs[0]._id
                        RawMat.findByIdAndUpdate(id4,{massKgs:opBal,massTonnes:opBalTonnes},function(err,locs){
              
                        })  
              
                        })
        
        
                        RawMat.find({item:ingredient,stage:'fermentation'},function(err,tocs){
                          let opBal2 = tocs[0].massKgs + pro.quantity
                          let opBalTonnes2 = opBal2 / 1000
                          let id5 = tocs[0]._id
                        RawMat.findByIdAndUpdate(id5,{massKgs:opBal2,massTonnes:opBalTonnes2},function(err,locs){
                  
                        })  
                  
                        })
        
                      }

                      else if(ingredient == 'gingerGarlic'){
                        RawMat.find({item:ingredient,stage:'cooking'},function(err,tocs){
                          let opBal = tocs[0].massKgs - pro.quantity
                          let opBalTonnes = opBal / 1000
                          let id4 = tocs[0]._id
                        RawMat.findByIdAndUpdate(id4,{massKgs:opBal,massTonnes:opBalTonnes},function(err,locs){
              
                        })  
              
                        })
        
        
                        RawMat.find({item:ingredient,stage:'fermentation'},function(err,tocs){
                          let opBal2 = tocs[0].massKgs + pro.quantity
                          let opBalTonnes2 = opBal2 / 1000
                          let id5 = tocs[0]._id
                        RawMat.findByIdAndUpdate(id5,{massKgs:opBal2,massTonnes:opBalTonnes2},function(err,locs){
                  
                        })  
                  
                        })
        
                      }
                  
          
          
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
          refNumber = doc.refNumber
          FermentationProduct.find({product:product},function(err,docs){
            let oTanks = docs[0].tanks + tanks
            let id2 = docs[0]._id


            FermentationProduct.findByIdAndUpdate(id2,{$set:{tanks:oTanks}},function(err,tocs){

            })

            console.log(refNumber,'refNumber777')
           

           

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
var litres = availableTanks * 1000
  res.render('rStock/drain',{id:id,product:product,availableTanks:availableTanks,litres:litres})
 })
        





router.post('/draining/',isLoggedIn,function(req,res){
     var releasedBy = req.body.releasedBy
      //var batchNumber = req.body.batchNumber
    var m = moment()
    var month = m.format('MMMM')
      var receivedBy = req.body.receivedBy
      var date = req.body.date
      var refNumber = req.body.refNumber
      var blendingTank = req.body.blendingTank
      var tanks= req.body.tanks
      var product = req.body.product
      //var water = req.body.wat
    
      var m = moment(date)
   
      var year = m.format('YYYY')
    
      var date = m.toString()
      var numDate = m.valueOf()
    var cook = new BlendedItems()
    cook.releasedBy = releasedBy
    //cook.refNumber = refNumber
    cook.receivedBy = receivedBy
    cook.date = date
    cook.month = month
    cook.blendingTank = blendingTank
    cook.year = year
    cook.product = product
    cook.tanks= tanks
    cook.litres = tanks * 1000
    cook.status = 'null'
    cook.refNumber = refNumber
    //cook.operator = operator
    
    cook.save()
          .then(pro =>{
            console.log(pro,'pro')
BlendingTanks.find({tankNumber:blendingTank},function(err,toc){
  if(toc){
  
  let litresDrained = tanks * 1000
  let opLitres = toc[0].litres + litresDrained
  let maseId = toc[0]._id
  BlendingTanks.findByIdAndUpdate(maseId,{$set:{litres:opLitres,product:product,refNumber:refNumber}},function(err,focs){


  })

}

BatchFermentationIngredients.find({refNumber:refNumber},function(err,nocs){
  for(var i = 0;i<nocs.length;i++){
    let quantity = nocs[i].quantity / nocs[i].tanks
    let nQty =  quantity * tanks
    let ingredient = nocs[i].ingredient
  


    Ingredients.find({item:ingredient},function(err,tocs){
  
  
      // RawMat.find({item:item,stage:'fermentation'},function(err,tocs){
         let opBal1 = tocs[0].massKgs - nQty
         let opBalTonnes1 = opBal1 / 1000
         let id4 = tocs[0]._id
       Ingredients.findByIdAndUpdate(id4,{massKgs:opBal1,massTonnes:opBalTonnes1},function(err,locs){
   
       })  
   
       //})
     })
    RawMat.find({item:ingredient,stage:"fermentation"},function(err,tocs){
  
  if(tocs.length>0){
     // RawMat.find({item:item,stage:'fermentation'},function(err,tocs){
        let opBal1 = tocs[0].massKgs - nQty
        let opBalTonnes1 = opBal1 / 1000
        let id4 = tocs[0]._id
      RawMat.findByIdAndUpdate(id4,{massKgs:opBal1,massTonnes:opBalTonnes1},function(err,locs){
  
      })  
    }
      //})
    })
    //arrQ.push(nQty)
    RawMat.find({item:ingredient,stage:'blending'},function(err,tocs){
      if(tocs.length > 0){
      let opBal2 = tocs[0].massKgs + nQty
      let opBalTonnes2 = opBal2 / 1000
      let id5 = tocs[0]._id
    RawMat.findByIdAndUpdate(id5,{massKgs:opBal2,massTonnes:opBalTonnes2},function(err,locs){
  
    })  
      }
    })
  
  }
  })     
BatchFermentation.find({refNumber:refNumber},function(err,docs){
let avTanks = docs[0].tanksDrained + pro.tanks
let remainingTanks = docs[0].tanks - avTanks
let id2 = docs[0]._id

if(remainingTanks == 0){


BatchFermentation.findByIdAndUpdate(id2,{$set:{tanksDrained:avTanks,remainingTanks:remainingTanks,status:"drained"}},function(err,vocs){


})

BatchFermentationIngredients.find({refNumber:refNumber},function(err,socs){
for(var i = 0; i<socs.length;i++){
  let sId = socs[i]._id
  BatchFermentationIngredients.findByIdAndUpdate(sId,{$set:{status:'complete'}},function(err,fox){
    
  })
}

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
}) 


            
            res.send(pro)
          
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
 


      router.get('/blendingTanks',isLoggedIn,function(req,res){
        BlendingTanks.find(function(err,docs){
             res.render('rStock/blendingTanks',{listX:docs})
      
            })
       })
      


       router.get('/trailFermentation/:id',isLoggedIn,function(req,res){
         var id = req.params.id
        Fermentation.find({refNumber:id},function(err,docs){
             res.render('rStock/trackFermentation',{listX:docs,refNumber:id})
      
            })
       })
      


       router.get('/trailOther/:id/:id2/:id3',isLoggedIn,function(req,res){
        var id = req.params.id
        var id3 = req.params.id3
        var ingredient = req.params.id2
        console.log(id3,'id3')
        if(ingredient == 'ginger'){
          Cooking.find({refNumber:id},function(err,docs){
            res.render('rStock/trackCooking2',{listX:docs,idNum:id3})
     
           })
        }else if(ingredient == 'bananas'){
          BatchGingerCrush.find({item:ingredient,refNumber:id},function(err,docs){
            res.render('rStock/trackCrushing',{listX:docs,idNum:id3})
     
           })
        }
      

        else if(ingredient == 'gingerGarlic'){
          Cooking.find({refNumber:id},function(err,docs){
            res.render('rStock/trackCooking2',{listX:docs,idNum:id3})
     
           })
        }

        else if(ingredient == 'colour'){
          Cooking.find({refNumber:id},function(err,docs){
    
            res.render('rStock/trackCooking2',{listX:docs,idNum:id3})
     
           })
        }

        else if(ingredient == 'gingerTea'){
          BatchGingerCrush.find({finalProduct:ingredient,refNumber:id},function(err,docs){
            res.render('rStock/trackCrushing',{listX:docs,idNum:id3})
     
           })
        }

        else if(ingredient == 'honey'){
          BatchGingerCrush.find({item:ingredient,refNumber:id},function(err,docs){
            res.render('rStock/trackCrushing',{listX:docs,idNum:id3})
     
           })
        }

        else if(ingredient == 'garlic'){
          Cooking.find({refNumber:id},function(err,docs){
            res.render('rStock/trackCooking2',{listX:docs,idNum:id3})
     
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
         
        BatchGingerCrush.find({item:item,batchNumber:id},function(err,docs){
          res.render('rStock/trackCrushing',{listX:docs,idNum:id3})
     
           })
        }else if(item == 'bananas'){
          BatchRR.find({item:item,batchNumber:id},function(err,docs){
            res.render('rStock/trackRaw',{listX:docs,idNum:id3})
     
           })
        }

       else if(item == 'garlic'){
         
          BatchGingerCrush.find({item:item,batchNumber:id},function(err,docs){
            res.render('rStock/trackCrushing',{listX:docs,idNum:id3})
       
             })
            }


            else if(item == 'sugar'){
         
              BatchRR.find({item:item,batchNumber:id},function(err,docs){
                res.render('rStock/trackRaw',{listX:docs,idNum:id3})
           
                 })
                }

            else if(item == 'lemon'){
         
              BatchGingerCrush.find({item:item,batchNumber:id},function(err,docs){
                res.render('rStock/trackCrushing',{listX:docs,idNum:id3})
           
                 })
                }
      

                else if(item == 'honey'){
         
                  BatchGingerCrush.find({item:item,batchNumber:id},function(err,docs){
                    res.render('rStock/trackCrushing',{listX:docs,idNum:id3})
               
                     })
                    }
      })
     





      router.get('/trailBatch3/:id/:id2/:id3',isLoggedIn,function(req,res){
        var id = req.params.id
        var item = req.params.id2
        var id3 = req.params.id3
        if(item == 'ginger'){
        BatchGingerWash.find({item:item,batchNumber:id},function(err,docs){
          res.render('rStock/trackWashing',{listX:docs,id:id3})
     
           })
          }else if(item == 'bananas'){
            BatchRR.find({item:item,batchNumber:id},function(err,docs){
              res.render('rStock/trackRaw',{listX:docs})
       
             })
          }

          if(item == 'garlic'){
            BatchGingerWash.find({item:item,batchNumber:id},function(err,docs){
              res.render('rStock/trackWashing',{listX:docs})
         
               })
              }


              if(item == 'honey'){
                BatchGingerWash.find({item:item,batchNumber:id},function(err,docs){
                  res.render('rStock/trackWashing',{listX:docs})
             
                   })
                  }


                  if(item == 'lemon'){
                    BatchGingerWash.find({item:item,batchNumber:id},function(err,docs){
                      res.render('rStock/trackWashing',{listX:docs})
                 
                       })
                      }
      })


      router.get('/trailBatch4/:id/:id2',isLoggedIn,function(req,res){
        var id = req.params.id
        var item = req.params.id2
        BatchRR.find({item:item,batchNumber:id},function(err,docs){
          res.render('rStock/trackRaw',{listX:docs})
   
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
    res.render('rStock/blend3',{tankNumber:tankNumber,product:product,
      litres:litres,refNumber:refNumber,id:id})
  }else{
    res.render('rStock/blend2',{tankNumber:tankNumber,product:product,
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
  res.redirect('/rm/blendingTanks')
})


  router.get('/blendingFile/:id',isLoggedIn,function(req,res){

    var m = moment()
    var mformat = m.format('L')
    var month = m.format('MMMM')
    var year = m.format('YYYY')
    var date = req.user.date
    var refNumber = req.params.id
    let id = req.params.id

  
    BlendingDays.find({batchId:id}).lean().then(docs=>{
  
  
    let size = docs.length - 1
  
  var arrG = []

  for(var i = 0;i<docs.length;i++){

 
  arrG.push(docs[i])
}
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
    const content = await compile('blendTracker',arrG)
    
  
    
    await page.setContent(content, { waitUntil: 'networkidle2'});
    
    await page.emulateMediaType('screen')
    let height = await page.evaluate(() => document.documentElement.offsetHeight);
    await page.evaluate(() => matchMedia('screen').matches);
    await page.setContent(content, { waitUntil: 'networkidle0'});
   
     
    let filename = 'blend'+id+'.pdf'
    await page.pdf({  
    path:(`./public/grv/${year}/${month}/blend${id}`+'.pdf'),
    format:"A4",
    height: height + 'px',
    printBackground:true
    
    })
    
   
     res.redirect('/rm/openFileBlend/'+id)
  
  
  
    
    
    
   
   
   /* const file = await fs.readFile(`./public/grv/${year}/${month}/blend${id}`+'.pdf');
    const form = new FormData();
    form.append("file", file,filename);
    
    await Axios({
      method: "POST",
     //url: 'https://portal.steuritinternationalschool.org/clerk/uploadStatement',
       //url: 'https://niyonsoft.org/uploadStatementDispatch',
       //url:'https://niyonsoft.org/uploadGrv',
       url:'localhost:8000/rm/uploadBlending',
      headers: {
        "Content-Type": "multipart/form-data"  
      },
      data: form
    });
    
    
    res.redirect('/rm/fileIdBlending/'+filename);*/
    
    
    }catch(e) {
    
    console.log(e)
    
    
    }
    
  
    
    }) ()
    
    
    
  })
    
    
  
    
    })
  
  router.get('/openFileBlend/:id',isLoggedIn,function(req,res){
  var refNumber = req.params.id
  var batchNumber = req.user.batchNumber
  var m = moment()
  var mformat = m.format('L')
  var month = m.format('MMMM')
  var year = m.format('YYYY')
  const path =`./public/grv/${year}/${month}/blend${refNumber}.pdf`
  if (fs.existsSync(path)) {
      res.contentType("application/pdf");
      fs.createReadStream(path).pipe(res)
  } else {
      res.status(500)
      console.log('File not found')
      res.send('File not found')
  }
  
  })
  
    router.post('/uploadBlending',upload.single('file'),(req,res,nxt)=>{
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
    res.redirect('/rm/fileIdBlending/'+filename)
    })
    
    })
  
    router.get('/fileIdBlending/:id',function(req,res){
      console.log(req.params.id)
      var id = req.params.id
      
      res.redirect('/rm/openBlending/'+id)
      
      })
  
  
    router.get('/openBlending/:id',(req,res)=>{
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
  
  
  

      router.get('/updateStockBF',function(req,res){
        BatchFermentation.find(function(err,docs){
          for(var i = 0;i<docs.length;i++){
           let id = docs[i]._id
           BatchFermentation.findByIdAndRemove(id,(err,doc)=>{
      
           }) 
          }
          res.redirect('/rm/updateStockBFI')
        })
      })
      
      
      
      
      
      router.get('/updateStockBFI',function(req,res){
        BatchFermentationIngredients.find(function(err,docs){
          for(var i = 0;i<docs.length;i++){
           let id = docs[i]._id
           BatchFermentationIngredients.findByIdAndRemove(id,(err,doc)=>{
      
           }) 
          }
          res.redirect('/rm/updateBBC')
        })
      })


      router.get('/updateBBC',function(req,res){
        BatchCooking.find(function(err,docs){
          for(var i = 0;i<docs.length;i++){
           let id = docs[i]._id
           BatchCooking.findByIdAndRemove(id,(err,doc)=>{
      
           }) 
          }
          res.redirect('/rm/updateBRR')
        })
      })
      
          
  
      router.get('/updateBRR',function(req,res){
        BatchRR.find(function(err,docs){
          for(var i = 0;i<docs.length;i++){
           let id = docs[i]._id
           BatchRR.findByIdAndRemove(id,(err,doc)=>{
      
           }) 
          }
          res.redirect('/rm/updateBGC')
        })
      })


      router.get('/updateBGC',function(req,res){
        BatchGingerCrush.find(function(err,docs){
          for(var i = 0;i<docs.length;i++){
           let id = docs[i]._id
           BatchGingerCrush.findByIdAndRemove(id,(err,doc)=>{
      
           }) 
          }
          res.redirect('/rm/updateBGW')
        })
      })
  
      router.get('/updateBGW',function(req,res){
        BatchGingerWash.find(function(err,docs){
          for(var i = 0;i<docs.length;i++){
           let id = docs[i]._id
           BatchGingerWash.findByIdAndRemove(id,(err,doc)=>{
      
           }) 
          }
          res.redirect('/rm/updateGW')
        })
      })
  
      router.get('/updateGW',function(req,res){
        GingerWash.find(function(err,docs){
          for(var i = 0;i<docs.length;i++){
           let id = docs[i]._id
           GingerWash.findByIdAndRemove(id,(err,doc)=>{
      
           }) 
          }
          res.redirect('/rm/updateGC')
        })
      })


      router.get('/updateGC',function(req,res){
        GingerCrush.find(function(err,docs){
          for(var i = 0;i<docs.length;i++){
           let id = docs[i]._id
           GingerCrush.findByIdAndRemove(id,(err,doc)=>{
      
           }) 
          }
          res.redirect('/rm/updateC')
        })
      })



      router.get('/updateC',function(req,res){
        Cooking.find(function(err,docs){
          for(var i = 0;i<docs.length;i++){
           let id = docs[i]._id
           Cooking.findByIdAndRemove(id,(err,doc)=>{
      
           }) 
          }
          res.redirect('/rm/updateFP')
        })
      })

      router.get('/updateFP',function(req,res){
        FinalProduct.find(function(err,docs){
          for(var i = 0;i<docs.length;i++){
           let id = docs[i]._id
           FinalProduct.findByIdAndRemove(id,(err,doc)=>{
      
           }) 
          }
          res.redirect('/rm/updateBI')
        })
      })



      router.get('/updateBI',function(req,res){
        BlendedItems.find(function(err,docs){
          for(var i = 0;i<docs.length;i++){
           let id = docs[i]._id
           BlendedItems.findByIdAndRemove(id,(err,doc)=>{
      
           }) 
          }
          res.redirect('/rm/updateSV')
        })
      })


      router.get('/updateSV',function(req,res){
        StockVoucher.find(function(err,docs){
          for(var i = 0;i<docs.length;i++){
           let id = docs[i]._id
           StockVoucher.findByIdAndRemove(id,(err,doc)=>{
      
           }) 
          }
          res.redirect('/rm/updateSRM')
        })
      })


      router.get('/updateSRM',function(req,res){
       StockRM.find(function(err,docs){
          for(var i = 0;i<docs.length;i++){
           let id = docs[i]._id
          StockRM.findByIdAndRemove(id,(err,doc)=>{
      
           }) 
          }
          res.redirect('/rm/updateRM')
        })
      })

      router.get('/updateRM',function(req,res){
        RawMat.find(function(err,docs){
          for(var i = 0;i<docs.length;i++){
           let id = docs[i]._id
          RawMat.findByIdAndUpdate(id,{$set:{massKgs:0,massTonnes:0}},function(err,tocs){

          })
          }
          res.redirect('/rm/updateIngredients')
        })
      })




      router.get('/updateIngredients',function(req,res){
        Ingredients.find(function(err,docs){
          for(var i = 0;i<docs.length;i++){
           let id = docs[i]._id
          Ingredients.findByIdAndUpdate(id,{$set:{massKgs:0}},function(err,tocs){

          })
          }
          res.redirect('/rm/updateCrushedItems')
        })
      })


      router.get('/updateCrushedItems',function(req,res){
        CrushedItems.find(function(err,docs){
          for(var i = 0;i<docs.length;i++){
           let id = docs[i]._id
          CrushedItems.findByIdAndUpdate(id,{$set:{massKgs:0}},function(err,tocs){

          })
          }
          res.redirect('/rm/updateBT')
        })
      })



      router.get('/updateBT',function(req,res){
        BlendingTanks.find(function(err,docs){
          for(var i = 0;i<docs.length;i++){
           let id = docs[i]._id
          BlendingTanks.findByIdAndUpdate(id,{$set:{litres:0,product:"null",refNumber:"null"}},function(err,tocs){

          })
          }
          res.redirect('/rm/warehouseStock')
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
        BatchGingerWash.find().lean().then(docs=>{
  
  
        
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
       url: 'https://niyonsoft.org/rm/uploadStatementGW',
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
  res.redirect('/quality/fileIdGW/'+filename)
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
    BatchGingerCrush.find({type:"normal"}).lean().then(docs=>{

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
    res.redirect('/rm/openFileGC/'+seqNum)
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
   url: 'https://niyonsoft.org/rm/uploadStatementGC',
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
res.redirect('/rm/fileIdGC/'+filename)
})

})


router.get('/fileIdGC/:id',function(req,res){
console.log(req.params.id)
var id = req.params.id

res.redirect('/rm/openGC/'+id)

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
    Cooking.find().lean().then(docs=>{

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
    res.redirect('/rm/openFileCN/'+seqNum)
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
   url: 'https://niyonsoft.org/rm/uploadStatementGC',
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
res.redirect('/rm/fileIdCN/'+filename)
})

})


router.get('/fileIdCN/:id',function(req,res){
console.log(req.params.id)
var id = req.params.id

res.redirect('/rm/openCN/'+id)

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
  Fermentation.find().lean().then(docs=>{

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
  res.redirect('/rm/openFileFM/'+seqNum)
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
    url:'https://niyonsoft.org/rm/uploadStatementFM',
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
res.redirect('/rm/fileIdFM/'+filename)
})

})


router.get('/fileIdFM/:id',function(req,res){
console.log(req.params.id)
var id = req.params.id

res.redirect('/rm/openFM/'+id)

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
  
 
  res.redirect('/rm/openFileRM/'+refNumber)


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
     url:'https://niyonsoft.org/rm/uploadGrvRM',
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
  res.redirect('/rm/fileIdGrvRM/'+filename)
  })
  
  })

  router.get('/fileIdGrvRM/:id',function(req,res){
    console.log(req.params.id)
    var id = req.params.id
    
    res.redirect('/rm/openGrvRM/'+id)
    
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



  





router.get('/packagingBatch',isLoggedIn,function(req,res){
  res.render('rStock/packagingBatch')
})



router.post('/packagingBatch',isLoggedIn,function(req,res){
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


    res.redirect('/rm/packagingBatch');
  
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
        
             
              res.redirect('/rm/packaging/'+pro._id)
        
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
 
    res.render('rStock/packagingMaterial',{product:product,
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
  


res.redirect('/rm/warehouseStock')

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
 



  
  ////////// folders
  router.get('/folderReg',function(req,res){
    Product.find({}).then(docs=>{
    res.render('rStock/itemFolder',{listX:docs})

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
  
    BlendedItems.find({product:product}).sort({num:1}).then(docs=>{
       
            res.render('rStock/itemFilesMonthly',{pro:pro,product:product,listX:docs})
  
    })
    
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
 
 
 res.render('rStock/itemFiles',{listX:arr,product:product,refNumber:refNumber,pro:pro,year:year,successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg}) 
 }
 })
    
 })

 /*8888*/
 
 router.get('/selectMonthDispatch/',isLoggedIn,function(req,res){
  var pro = req.user
  var id = req.params.id
  var uid = req.user._id
  var arr = []
  var year = 2024
  User.findByIdAndUpdate(uid,{$set:{year:year}},function(err,locs){

  })

  Month.find({}).sort({num:1}).then(docs=>{
     
          res.render('receiver/itemFilesMonthlyDispatch',{pro:pro,listX:docs,id:id})

  })
  
})



router.get('/folderFilesDispatch/:id',isLoggedIn,function(req,res){
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


res.render('receiver/itemFilesDispatch',{listX:arr,month:month,pro:pro,year:year,successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg}) 
}
})
  
})

 


/*********Dispatch */
router.get('/folderRegDispatch',function(req,res){
res.render('receiver/itemFolderDispatch')
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
 
      res.render('receiver/itemFilesMonthlyDispatchV',{pro:pro,listX:docs,id:id})

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


res.render('receiver/itemFilesDispatchV',{listX:arr,month:month,pro:pro,year:year,successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg}) 
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
