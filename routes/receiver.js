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

const cors = require('cors');

const app = express();

// Use CORS middleware
router.use(cors());


const corsOptions = {
  origin: 'https://niyonsoft.org/',//(https://your-client-app.com)
  optionsSuccessStatus: 200,
};

router.use(cors(corsOptions));




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
    res.redirect('/receiver/batch')
  })
  
  
  
  })
  

router.post('/receiveStock',isLoggedIn,cors(corsOptions), function(req,res){
    console.log('receive Stock2')
    var date4 = req.body.date
    console.log(date4,'date4')
    var date2 = req.body.date
    var refNo = req.user.refNumber
    var product = req.body.product;
    var m = moment(date2)
    var receiver = 'Tidings'
    var year = m.format('YYYY')
    var dateValue = m.valueOf()
    var date = m.toString()
    var numDate = m.valueOf()
  var month = m.format('MMMM')
  var shift = req.body.shift
  var casesReceived = req.body.casesReceived
  var availableCases = req.body.availableCases
  var warehouse = req.body.warehouse
 
  var mformat = m.format("L")
    //var receiver = req.user.fullname
  
  console.log(product,shift,casesReceived,availableCases,warehouse,'out')
  
 
  
    req.check('warehouse','Enter Warehouse').notEmpty();
    req.check('product','Enter Product Name').notEmpty();
    req.check('casesReceived','Enter Cases Received').notEmpty();
    req.check('availableCases','Enter Available Cases').notEmpty();
    
   
    
  
    
    
    var errors = req.validationErrors();
     
    if (errors) {
  
      req.session.errors = errors;
      req.session.success = false;
     // res.render('product/stock',{ errors:req.session.errors,pro:pro})
     req.flash('success', req.session.errors[0].msg);
         
          
     res.redirect('/receiver/receiveStock');
    
    }
    else
  
   {
  
    Product.findOne({'name':product})
    .then(hoc=>{
  
      if(hoc){
    var book = new StockV();

    let unitCases = hoc.unitCases
    let usd= hoc.usd
    let zwl = hoc.zwl
    let rand = hoc.rand
    let rate = hoc.rate
  
    let category = hoc.category
    let subCategory = hoc.subCategory
    book.name = product
    book.mformat = mformat
    //book.code =  code
    book.warehouse = warehouse
    book.status = 'saved'
    book.cases = 0
    book.casesReceived = casesReceived
    book.availableCases = availableCases
    book.shift = shift
    book.year = year
    book.month = month
    book.receiver = receiver
    book.dateValue = dateValue
    book.unitCases = unitCases
    book.zwl = zwl
    book.date = date4
    book.usd = usd
    book.rand = rand
    book.rate = rate
    book.category = category
    book.subCategory = subCategory
    book.refNo = refNo
  
        
         
          book.save()
            .then(pro =>{
  let stock = pro.casesReceived + pro.availableCases

  StockV.findByIdAndUpdate(pro._id,{$set:{cases:stock}},function(err,vocs){

  })

              Product.find({'name':product},function(err,docs){
                let id = docs[0]._id
                console.log(id,'id')
                let nqty, nqty2
                 let rcvdQty = pro.casesReceived
                 let openingQuantity = docs[0].cases
                //nqty = pro.quantity + docs[0].quantity
                nqty = pro.casesReceived + docs[0].cases
                nqty2 = nqty * docs[0].unitCases
                console.log(nqty,'nqty')
                Product.findByIdAndUpdate(id,{$set:{cases:nqty,openingQuantity:openingQuantity, rcvdQuantity:rcvdQty,quantity:nqty2}},function(err,nocs){
   
                })
   
                
   
               })


              
              StockV.find({mformat:mformat},(err, ocs) => {
                let size = ocs.length - 1
                console.log(ocs[size],'fff')
                res.send(ocs[size])
                        })
          })
         
        
        }
      }) 
  
        }
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
    

    res.redirect('/receiver/fifoDateUpdate')
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
  res.redirect('/receiver/palletUpdate')
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
          console.log(pallets,'pallets')
        BatchR.findByIdAndUpdate(id,{$set:{pallet:pallets}},function(err,hocs){


        })
      }
        })
      }
    

      res.redirect('/receiver/batch')
  })
  })

  router.get('/batch',isLoggedIn,cors(corsOptions),function(req,res){
    var pro = req.user
    res.render('receiver/batch',{pro:pro})
  })



  router.post('/batch',isLoggedIn,cors(corsOptions),function(req,res){

    //var refNumber = req.body.referenceNumber
    var date = req.body.date
    var shift = req.body.shift
    var warehouse = req.body.warehouse
    var product = req.body.product
    var expiryDate = req.body.expiryDate
    let refNo
   // var lotNumber = req.body.lotNumber
    //var location = req.body.location
  
    let date6 =  moment().format('l');
    let dateValue = moment().valueOf()
    let expiryDateValue = moment(expiryDate).valueOf()
    let expiryDate2 = moment(expiryDate)
    let expiryMformat = moment(expiryDate).format('l');
  let code
  //let shift = req.user.shift
   let date7 =  date6.replace(/\//g, "");
  
    console.log(date6,'date')
  
  
    if( shift == 'day'){
      code = "S1"
    }else{
      code = "S2"
    }
  
    RefNo.find({date:date},function(err,docs){
      let size = docs.length + 1
     refNo = date7+code+'B'+size+'R'
      console.log(refNo,'refNo')

      var truck = new BatchR()
      truck.date = date
      truck.mformat = date6
      truck.dateValue = dateValue
      truck.expiryDateValue = expiryDateValue
      truck.expiryMformat = expiryDate2
      truck.shift = shift
      truck.warehouse = warehouse
      truck.product = product
      truck.refNumber = refNo
      truck.expiryDate = expiryDate
      truck.cases = 0
      truck.status = 'received'
      truck.receiver = req.user.fullname
     

      truck.save()
          .then(pro =>{



      var id = req.user._id
      User.findByIdAndUpdate(id,{$set:{date:date, shift:shift, warehouse:warehouse,
      product:product,refNumber:refNo,batchId:pro._id,mformat:date6,dateValue:dateValue, expiryDate:expiryDate,
      expiryDateValue:expiryDateValue,expiryMformat:expiryMformat}},function(err,docs){
  
      })



      var book = new RefNo();
    book.refNumber = refNo
    book.date = date
    book.type = 'receiving'
    book.save()
    .then(pro =>{

      console.log('success')
      res.redirect('/receiver/receiveStock/'+refNo)

    })
  })
  
    })
  
    



    


    
  })




  router.get('/receiveStock/:id',isLoggedIn,cors(corsOptions),function(req,res){
    var date = req.user.date
    var shift = req.user.shift
    var warehouse = req.user.warehouse
    var product = req.user.product
    var refNumber = req.user.refNumber
    var pro = req.user
    var date = req.user.date
    var id = req.params.id
    Product.find(function(err,docs){
     res.render('receiver/addStock2',{listX:docs,date:date,shift:shift,
    product:product,refNumber:refNumber,warehouse:warehouse,pro:pro,id:id,date:date})
    })
  
   })




   

  router.post('/addStock3/:id', (req, res) => {
    var pro = req.user
    var m = moment()
    var id = req.params.id
  
    var mformat = m.format("L")
    
    StockV.find({refNumber:id},(err, docs) => {
   console.log(docs,'docs')
      res.send(docs)
              })

    }); 




    router.post('/receiveScan',isLoggedIn,cors(corsOptions), function(req,res){
      console.log('receive scan')
      var date2 = req.user.date
      var product = req.user.product;
      var m = moment(date2)
      var receiver = req.user.fullname
      var year = m.format('YYYY')
      var dateValue = m.valueOf()
      var date = m.toString()
      var numDate = m.valueOf()
      var barcodeNumber = req.body.code
    var month = m.format('MMMM')
    var shift = req.user.shift
    var casesReceived = 1
    var lot = req.user.lot
    var refNumber = req.user.refNumber
    var location = req.user.location
    var warehouse = req.user.warehouse
   var arr = []
   var batchId = req.user.batchId
    //var mformat = m.format("L")
      //var receiver = req.user.fullname
    var mformat = req.user.mformat
    var dateValue = req.user.dateValue
    var expiryDate = req.user.expiryDate
    var expiryDateValue = expiryDateValue
    var expiryMformat = expiryMformat

    console.log(product,shift,casesReceived,warehouse,'out')
    
   
    
    
      Warehouse.findOne({'product':product,'warehouse':warehouse})
      .then(hoc=>{
    

        StockV.findOne({'barcodeNumber':barcodeNumber})
        .then(doc=>{
          console.log(doc,'doc',hoc,'hoc')

        if( doc == null){
          
  StockV.find({refNumber:refNumber},function(err,focs){
    let size  = focs.length + 1
    if(focs.length == 0){

      let openingBalance = hoc.cases
      //let casesRcvdX =  focs.length + 1
      let closingBalance = hoc.cases + 1
      BatchR.findByIdAndUpdate(batchId,{$set:{cases:size,openingBal:openingBalance,closingBal:closingBalance}},function(err,noc){
  
      })

    }
    if(focs.length >0){

      console.log(size,'size')
   
    let openingBalance = focs[0].availableCases
    //let casesRcvdX =  focs.length + 1
    let closingBalance = focs[0].availableCases + focs.length + 1
    BatchR.findByIdAndUpdate(batchId,{$set:{cases:size,openingBal:openingBalance,closingBal:closingBalance}},function(err,noc){

    })

    StockV.find({date:date2},function(err,jocs){
      if(jocs.length >0){
 
      let openingBalanceX = jocs[0].availableCases
      let totalCases = jocs.length + 1
      let closingBalanceX = jocs[0].availableCases + jocs.length + 1
      
      BatchR.find({date:date2},function(err,tocs){
        for(var i = 0;i< tocs.length;i++){
          BatchR.findByIdAndUpdate(tocs[i]._id,{$set:{casesRcvdX:totalCases,openingBalX:openingBalanceX,closingBalX:closingBalanceX}},function(err,noc){

          })

        }
      })
    
    }

    })
  }
      var book = new StockV();
  
      let unitCases = hoc.unitCases
      let usd= hoc.usd
      let zwl = hoc.zwl
      let rand = hoc.rand
      let rate = hoc.rate
    
      let category = hoc.category
      let subCategory = hoc.subCategory
      book.name = product
      book.mformat = mformat
      //book.code =  code
      book.warehouse = warehouse
      book.barcodeNumber = barcodeNumber
      book.status = 'received'
      book.cases = 0
      book.date = date2
      book.casesReceived = casesReceived
      book.availableCases = hoc.cases
      book.shift = shift
      book.year = year
      book.month = month
      book.receiver = receiver
      book.dateValue = dateValue
      book.unitCases = unitCases
      book.dispatchStatus ='pending'
      book.zwl = zwl
      book.usd = usd
      book.rand = rand
      book.rate = rate
      book.category = category
      book.subCategory = subCategory
      book.location = location
      book.refNumber = refNumber
      book.lot = lot
      book.expiryDate = expiryDate
      book.dateValue = dateValue
      book.expiryDateValue = expiryDateValue
      book.expiryMformat = expiryMformat
    
          
           
            book.save()
              .then(pro =>{
    let stock = pro.casesReceived + pro.availableCases
  
    StockV.findByIdAndUpdate(pro._id,{$set:{cases:stock}},function(err,vocs){
  
    })
  






    Warehouse.find({product:product,warehouse:warehouse},function(err,docs){
      let id = docs[0]._id
      console.log(id,'id')
      let nqty, nqty2
       let rcvdQty = pro.casesReceived
       let openingQuantity = docs[0].cases
      //nqty = pro.quantity + docs[0].quantity
      nqty = pro.casesReceived + docs[0].cases
      nqty2 = nqty * docs[0].unitCases
      console.log(nqty,'nqty')
      Warehouse.findByIdAndUpdate(id,{$set:{cases:nqty,openingQuantity:openingQuantity, rcvdQuantity:rcvdQty,quantity:nqty2}},function(err,nocs){

      })

      

     })


                Product.find({'name':product},function(err,docs){
                  let id = docs[0]._id
                  console.log(id,'id')
                  let nqty, nqty2
                   let rcvdQty = pro.casesReceived
                   let openingQuantity = docs[0].cases
                  //nqty = pro.quantity + docs[0].quantity
                  nqty = pro.casesReceived + docs[0].cases
                  nqty2 = nqty * docs[0].unitCases
                  console.log(nqty,'nqty')
                  Product.findByIdAndUpdate(id,{$set:{cases:nqty,openingQuantity:openingQuantity, rcvdQuantity:rcvdQty,quantity:nqty2}},function(err,nocs){
     
                  })
     
                  
     
                 })
  
  
                
                StockV.find({mformat:mformat},(err, ocs) => {
                  let size = ocs.length - 1
                  console.log(ocs[size],'fff')
                  res.send(ocs[size])
                          })
            })
            

          })
        
        
          
          }else{

console.log(arr,'doc7')
            res.send(arr)
          }
        })
        }) 
    
          
    })
  
  
  
    


router.get('/closeBatch/:id',cors(corsOptions),function(req,res){
  let id = req.params.id
  console.log(id,'idBatch')

  StockV.find({refNumber:id},function(err,docs){
  //  console.log(docs,'docs')
    var productChunks = [];
    var chunkSize = 140;
    for (var i = 0; i < docs.length; i += chunkSize) {
        productChunks.push(docs.slice(i, i + chunkSize));
    }

    console.log(productChunks.length,'chunks')

    for(var i =0 ; i< productChunks.length;i++){
   let arr = []
   arr.push(productChunks[i])
      for(var x = 0;x<arr.length;x++){
      
        for(var n =0;n <arr[x].length;n++){
          //console.log(arr[x][n],'sufferer')

          let idN = arr[x][n]._id
          let refNumber = id

          let pallet = i + 1
          StockV.find({pallet:pallet,refNumber:refNumber},function(err,tocs){
            let received = tocs.length
            StockV.find({pallet:pallet,refNumber:refNumber,status:'dispatched'},function(err,ocs){
            let dispatched = ocs.length
         
            StockV.find({pallet:pallet,refNumber:refNumber,status:'received'},function(err,mocs){ 
              let remaining = mocs.length
          StockV.findByIdAndUpdate(idN,{$set:{pallet:pallet,palletRcvd:received,palletDispatched:dispatched,palletRemaining:remaining}},function(err,vocs){

          })
        })
      })
        })
        }

//console.log(arr[x][0],'arrx')



      }
    }
  
    res.redirect('/receiver/palletUpdate')

  })
})




/*router.get('/updatePallet',function(req,res){
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
  
      
      
      //res.redirect('/receiver/batch')
      res.redirect('/receiver/warehouseUpdate')
      })
    
  })*/
  
  
  
router.get('/repo',isLoggedIn,function(req,res){
  var errorMsg = req.flash('danger')[0];
  var successMsg = req.flash('success')[0];
  res.render('receiver/report',({successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg}))
})

router.post('/repo',isLoggedIn,function(req,res){
  let status = 'received'
  var m = moment()
  var year = m.format('YYYY')
  var month = m.format('MMMM')
  var dateV = req.body.date
  var date = dateV.slice(0,10).replace(/-/g,'/'); 
  let mformat =  moment(date).format('l');
  var uid = req.user._id
  console.log(mformat,date,'date')
  let total, breakages
  req.check('date','Enter Date').notEmpty();
  
     
      
    
      
      
  var errors = req.validationErrors();
   
  if (errors) {

    req.session.errors = errors;
    req.session.success = false;

    
    req.flash('danger', req.session.errors[0].msg);
 
    res.redirect('/receiver/repo');
  
  }else{
    RepoFiles.findOne({'date':date,'status':status})
    .then(file =>{
    if(file){

      req.flash('danger', 'Report Exists');
 
      res.redirect('/receiver/repo');
    }else{

StockV.find({date:date},function(err,docs){
  total = docs.length

StockV.find({date:date,status:"breakage"},function(err,vocs){
  breakages = vocs.length

  BatchD.find({date:date},function(err,locs){
    //console.log(locs,'locs')
    for(var i = 0;i<locs.length;i++){
      let id = locs[i]._id
  BatchD.findByIdAndUpdate(id,{$set:{total:total,breakages:breakages}},function(err,focs){

  })
    }

    User.findByIdAndUpdate(uid,{$set:{dispatchDate:date}},function(err,kocs){

    })
  })

})
})

res.redirect('/receiver/eodRepo/')

    }
  })
  }
})




  router.get('/eodRepo',isLoggedIn,function(req,res){
    console.log(arrStatementR,'arrRefs')
    arrStatementR=[]
      //var code = "Tiana Madzima"
  
let date = req.user.dispatchDate
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
          
          res.redirect('/receiver/statementGen/')
        
      
      /*})*/
      
      })
      
  
  
router.get('/statementGen/',isLoggedIn,function(req,res){
console.log(arrStatementR,'arrSingleUpdate')
var m = moment()
var mformat = m.format('L')
var month = m.format('MMMM')
var year = m.format('YYYY')
var date = req.user.date
var receiveDate = req.user.dispatchDate
//var code ="Tiana Madzima"
var code = req.params.id

//var studentName = 'Tiana Madzima'

/*console.log(arr,'iiii')*/

RefNoSeq.find(function(err,doc){
  let seqNum = doc[0].num
  let seqId = doc[0]._id
//console.log(docs,'docs')

const compile = async function (templateName, arrStatementR){
const filePath = path.join(process.cwd(),'templates',`${templateName}.hbs`)

const html = await fs.readFile(filePath, 'utf8')

return hbs.compile(html)(arrStatementR)

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
const content = await compile('receiving',arrStatementR)

//const content = await compile('index',arr[code])

await page.setContent(content, { waitUntil: 'networkidle2'});
//await page.setContent(content)
//create a pdf document
await page.emulateMediaType('screen')
//let height = await page.evaluate(() => document.documentElement.offsetHeight);
await page.evaluate(() => matchMedia('screen').matches);
await page.setContent(content, { waitUntil: 'networkidle0'});
//console.log(await page.pdf(),'7777')
 
let filename = 'statementR'+seqNum+'.pdf'
await page.pdf({
//path:('../gitzoid2/reports/'+year+'/'+month+'/'+uid+'.pdf'),
path:(`./public/statements/${year}/${month}/statementR${seqNum}`+'.pdf'),
format:"A4",
width:'30cm',
height:'21cm',
//height: height + 'px',
printBackground:true

})


var repo = new RepoFiles();

repo.filename = filename;
repo.fileId = "null";
repo.status = 'receive'
repo.date = receiveDate
repo.year = year;
repo.month = month


console.log('done')

repo.save().then(poll =>{

})


//upload.single('3400_Blessing_Musasa.pdf')



/*await browser.close()

/*process.exit()*/

const file = await fs.readFile(`./public/statements/${year}/${month}/statementR${seqNum}`+'.pdf');
const form = new FormData();
form.append("file", file,filename);
//const headers = form.getHeaders();
//Axios.defaults.headers.cookie = cookies;
//console.log(form)
await Axios({
  method: "POST",
 //url: 'https://portal.steuritinternationalschool.org/clerk/uploadStatement',
url: 'http://niyonsoft.org/receiver/uploadStatement',
   //url:'http://localhost:8000/receiver/uploadStatement',
  headers: {
    "Content-Type": "multipart/form-data"  
  },
  data: form
});

seqNum++
RefNoSeq.findByIdAndUpdate(seqId,{$set:{num:seqNum}},function(err,tocs){

})
  

res.redirect('/receiver/fileId/'+filename);


}catch(e) {

console.log(e)


}


}) ()

})


//res.redirect('/hostel/discList')

})




router.post('/uploadStatement',upload.single('file'),(req,res,nxt)=>{
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
res.redirect('/receiver/fileId/'+filename)
})

})


router.get('/fileId/:id',function(req,res){
console.log(req.params.id)
var id = req.params.id

res.redirect('/receiver/openStatementName/'+id)

})


router.get('/openStatementName/:id',(req,res)=>{
  var filename = req.params.id
  console.log(filename,'fileId')
    const bucket = new mongodb.GridFSBucket(conn.db,{ bucketName: 'uploads' });
    gfs.files.find({filename: filename}).toArray((err, files) => {
    console.log(files[0])
  
      const readStream = bucket.openDownloadStream(files[0]._id);
          readStream.pipe(res);
  
    })
   
  })
  
 
  router.get('/openStatement/:id',(req,res)=>{
    var fileId = req.params.id
      const bucket = new mongodb.GridFSBucket(conn.db,{ bucketName: 'uploads' });
      gfs.files.find({_id: mongodb.ObjectId(fileId)}).toArray((err, files) => {
      
    
        const readStream = bucket.openDownloadStream(files[0]._id);
            readStream.pipe(res);
    
      })
     //gfs.openDownloadStream(ObjectId(mongodb.ObjectId(fileId))).pipe(fs.createWriteStream('./outputFile'));
    })
  
  
  router.get('/folderReg',function(req,res){
    res.render('receiver/itemFolder')
  })

 

  router.get('/selectMonth/',isLoggedIn,function(req,res){
    var pro = req.user
    var id = req.params.id
    var uid = req.user._id
    var arr = []
    var year = 2024
    User.findByIdAndUpdate(uid,{$set:{year:year}},function(err,locs){
  
    })
  
    Month.find({}).sort({num:1}).then(docs=>{
       
            res.render('receiver/itemFilesMonthly',{pro:pro,listX:docs,id:id})
  
    })
    
  })

  

router.get('/folderFiles/:id',isLoggedIn,function(req,res){
  var arr = []
  
  var errorMsg = req.flash('danger')[0];
  var successMsg = req.flash('success')[0];
   var term = req.user.term
   var m = moment()
   var pro = req.user
   
   var year = m.format('YYYY')
   var month = req.params.id

   var date = req.user.invoCode
 RepoFiles.find({year:year,month:month,status:'receive'},function(err,docs){
     if(docs){
 
   console.log(docs,'docs')
      let arr=[]
      for(var i = docs.length - 1; i>=0; i--){
  
        arr.push(docs[i])
      }
 
 
 res.render('receiver/itemFiles',{listX:arr,month:month,pro:pro,year:year,successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg}) 
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





 
router.get('/batchList',function(req,res){
    BatchR.find(function(err,docs){
    
      let arr=[]
      for(var i = docs.length - 1; i>=0; i--){
    
        arr.push(docs[i])
      }
    
      res.render('receiver/batchList',{listX:arr})
    
    })
    
    
    
    })
    
    
    /*cases */
    router.get('/pallets/:id',isLoggedIn,function(req,res){
    
      
     
     var date = req.body.date
     var arr = []
     var id = req.params.id
    
     
    
    //console.log(product,'proRtns')
     StockV.find({refNumber:id},function(err,docs) {
      // console.log(docs,'docs')
       for(var i = 0;i<docs.length;i++){
     
    
          if(arr.length > 0 && arr.find(value => value.name == docs[i].name && value.pallet == docs[i].pallet )){
                 console.log('true')
                arr.find(value => value.pallet == docs[i].pallet).casesReceived += docs[i].casesReceived;
                arr.find(value => value.pallet == docs[i].pallet).casesDispatched += docs[i].casesDispatched;
                arr.find(value => value.pallet == docs[i].pallet).casesRemaining =docs[i].casesReceived - docs[i].casesDispatched;
           }else{
    arr.push(docs[i])
           }
    
         
       }
      console.log(arr,'arr')
      //res.send(arr)
    
      res.render('receiver/batchPallet',{listX:arr})
     })
    
    
    })
    
    
    
        
    router.get('/receivedCases/:id',function(req,res){
      let refNumber = req.params.id
      StockV.find({refNumber:refNumber},function(err,docs){
      
       
      
        res.render('receiver/rcvdCases',{listX:docs})
      
      })
      
      
      
      })
    
    
    
      router.get('/dispatchedCases/:id',function(req,res){
        let refNumber = req.params.id
        StockV.find({refNumber:refNumber,status:'dispatched'},function(err,docs){
        
         
        
          res.render('receiver/dispatchedCases',{listX:docs})
        
        })
        
        
        
        })
    
    
    
    
        router.get('/remainingCases/:id',function(req,res){
          let refNumber = req.params.id
          StockV.find({refNumber:refNumber,status:'received'},function(err,docs){
          
           
          
            res.render('receiver/remainingCases',{listX:docs})
          
          })
          
          
          
          })
    
    
          /*****pallet cases */
    
          
    router.get('/receivedCasesPallet/:id/:otherId',function(req,res){
      
      let pallet = req.params.otherId
      let refNumber = req.params.id
      StockV.find({refNumber:refNumber,pallet:pallet},function(err,docs){
      
       
      
        res.render('receiver/rcvdCases',{listX:docs})
      
      })
      
      
      
      })
    
    
    
      
      router.get('/dispatchedCasesPallet/:id/:otherId',function(req,res){
        let refNumber = req.params.id
        let pallet = req.params.otherId
        StockV.find({refNumber:refNumber,status:'dispatched',pallet:pallet},function(err,docs){
        
         
        
          res.render('receiver/dispatchedCases',{listX:docs})
        
        })
        
        
        
        })
    
    
    
    
    
        router.get('/remainingCasesPallet/:id/:otherId',function(req,res){
          let refNumber = req.params.id
          let pallet = req.params.otherId
          StockV.find({refNumber:refNumber,status:'received',pallet:pallet},function(err,docs){
          
           
          
            res.render('receiver/remainingCases',{listX:docs})
          
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
          
  
  
  








