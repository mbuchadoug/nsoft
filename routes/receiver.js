var express = require('express');
var router = express.Router();
var InvoiceSubFile = require('../models/invoiceSubFile');
var ReturnsSubFile = require('../models/returnsSubFile');
var User = require('../models/user');
var Ware = require('../models/ware');
var PreRcvd = require('../models/preRcvd');
var Warehouse = require('../models/warehouse');
var Customer = require('../models/customer');
var BatchR = require('../models/batchR');
var BatchD = require('../models/batchD');
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
router.get('/upChange',function(req,res){
  PreRcvd.find({refNumber:"12202024CS1R"},function(err,docs){
    for(var i = 0;i<docs.length;i++){
      let id = docs[i]._id
      PreRcvd.findByIdAndUpdate(id,{$set:{status:"pending"}},function(err,locs){

      })
    }
  })
})

router.get('/countF',isLoggedIn,function(req,res){
  StockV.find(function(err,docs){
    let size = docs.length - 1
    let id = docs[size]
  let uCount = req.user.countSize
    var uid = req.user._id
StockV.findByIdAndRemove(id,function(err,locs){

})
if(uCount > 0){
  let count = req.user.countSize - 1
User.findByIdAndUpdate(uid,{$set:{countSize:count}},function(err,hocs){

})
}


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
  //res.redirect('/receiver/fifoUpdate')
})



  })
})


router.get('/updateAll',isLoggedIn,function(req,res){
  PreRcvd.find(function(err,docs){
    for(var i = 0;i<docs.length;i++){
      let id = docs[i]._id
  PreRcvd.findByIdAndUpdate(id,{$set:{status:"pending",refNumReceive:"null",statusCheck:"null",statusCheck2:"null"}},function(err,locs){

  })
    }
  })
})
router.get('/countUpdateSize',isLoggedIn,function(req,res){
  var id = req.user._id
  var refNumber = req.user.refNumber
  var countSize = req.user.countSize - 1
  StockV.find({refNumber:refNumber},function(err,locs){
    if(locs){
    let size = locs.length - 1
    let idF=locs[size]._id
  StockV.findByIdAndRemove(idF,function(err,focs){

  })
 
  User.findByIdAndUpdate(id,{$set:{countSize:countSize}},function(err,docs){
  
  })
res.redirect('/receiver/receiveStock/'+refNumber)
    }
})
  

})

router.get('/warehouseStock',isLoggedIn,function(req,res){
  var pro = req.user
  //res.render('admin/dash6',{pro:pro})
  Product.find({},function(err,docs){
 Warehouse.find({},function(err,hocs){
  res.render('receiver/dash7',{pro:pro,arr:docs,arr1:hocs})
})
  })
})

router.get('/countUpdate',isLoggedIn,function(req,res){
var id = req.user._id
User.findByIdAndUpdate(id,{$set:{countSize:0}},function(err,docs){

})


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
  //res.redirect('/receiver/fifoUpdate')
})



})



router.get('/dispatchUpdate',isLoggedIn,function(req,res){
  StockV.find(function(err,docs){
for(var i = 0;i<docs.length;i++){

let idF = docs[i]._id

  StockV.findByIdAndUpdate(idF,{$set:{timeOfDispatch:"null",truck:"null",salesPerson:"null",
    dispatcher:"null",casesBatch:0,refNumDispatch:"null",availableCasesDispatch:0,cases:0,status:'received',
  mformatDispatch:"null",dispatchStatus:"pending",size:0,casesDispatched:0,batchId:"null",statusCheck:"null",
refNumDispatch:"null",casesBatchNumber:0,palletCasesBatch:0,type:"null"}},function(err,lof){

})
}


//res.redirect('/receiver/updateSalesStock0')
})


})

router.get('/batchdUpdate',isLoggedIn,function(req,res){
  BatchD.find(function(err,ocs){
    for(var n = 0;n<ocs.length;n++){
  let id = ocs[n]._id
  BatchD.findByIdAndRemove(id,function(err,locs){
  
  })
    }

    BatchR.find(function(err,docs){
      for(var i=0;i<docs.length;i++){
        let idF = docs[i]._id
    BatchR.findByIdAndUpdate(idF,{$set:{status:"received"}},function(err,tocs){

    })
      }
    })
  })
})



router.get('/batchrUpdate',isLoggedIn,function(req,res){
  BatchR.find(function(err,ocs){
    for(var n = 0;n<ocs.length;n++){
  let id = ocs[n]._id
  BatchR.findByIdAndRemove(id,function(err,locs){
  
  })
    }

  res.redirect('/receiver/stockUpdate')
  })

})


router.get('/stockUpdate',isLoggedIn,function(req,res){
  StockV.find(function(err,ocs){
    for(var n = 0;n<ocs.length;n++){
  let id = ocs[n]._id
  StockV.findByIdAndRemove(id,function(err,locs){
  
  })
    }

  
  })
  
})
router.get('/updateSalesStock0',isLoggedIn,function(req,res){
  
  SalesList.find(function(err,docs){
    for(var i = 0;i<docs.length;i++){
   let  salesPerson = docs[i].salesPerson

     
  /*SaleStock.find({salesPerson:salesPerson,product:'kambucha lite'},function(err,ocs){
    console.log(ocs.length,'length')
   if(ocs.length == 0){*/

      var sale =SaleStock();
      sale.product = 'kambucha No3'
      sale.casesReceived = 0
      sale.openingBal = 0
      sale.holdingCases = 0
      sale.salesPerson = salesPerson
      sale.qty = 0
      sale.price = 1
      
      sale.save()
      .then(pas =>{

     

      })
    

    }

/*})
    }*/
    res.redirect('/')
  })
})


router.get('/warehouseUpdate2',function(req,res){
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
    res.redirect('/receiver/fifoUpdate')
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

  router.get('/batch',isLoggedIn,function(req,res){
    var pro = req.user
    res.render('receiver/batch',{pro:pro})
  })



  router.post('/batch',isLoggedIn,function(req,res){

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
  
    RefNo.find({date:date,type:'receiving'},function(err,docs){
      let size = docs.length + 1
     refNo = date7+code+'B'+size+'R'
     let refNumReceive = size+'R'+'C'
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
      User.findByIdAndUpdate(id,{$set:{date:date, shift:shift, warehouse:warehouse,currentPallet:1,
      product:product,refNumReceive:refNumReceive,refNumber:refNo,batchId:pro._id,mformat:date6,dateValue:dateValue, expiryDate:expiryDate,
      expiryDateValue:expiryDateValue,expiryMformat:expiryMformat,countSize:0}},function(err,docs){
  
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




  router.get('/receiveStock/:id',isLoggedIn,function(req,res){
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




   

  router.post('/autoLoad/:id',isLoggedIn, (req, res) => {
    var pro = req.user
    var m = moment()
    var id = req.params.id
  
    var mformat = m.format("L")
    
    StockV.find({refNumber:id,status:"received"},(err, docs) => {
   console.log(docs,'docsAutoLoad')
      res.send(docs)
              })

    }); 




    router.post('/receiveScan',isLoggedIn, function(req,res){
      console.log('receive scan')
      var date2 = req.user.date
      var product = req.user.product;
      var m = moment(date2)
      var uid = req.user._id
      let refNumReceive = req.user.refNumReceive
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
    var countSizeV = req.user.countSize
    var refNumber = req.user.refNumber
    var location = req.user.location
    var warehouse = req.user.warehouse
   var arr = []
   var arr2 =[4,5,6]
   var batchId = req.user.batchId
    //var mformat = m.format("L")
      //var receiver = req.user.fullname
    var mformat = req.user.mformat
    let status = 'pending'
    var dateValue = req.user.dateValue
    var expiryDate = req.user.expiryDate
    var expiryDateValue = expiryDateValue
    var expiryMformat = expiryMformat
   
    console.log(product,shift,casesReceived,warehouse,'out')
    

  


   
    
    PreRcvd.findOne({'barcodeNumber':barcodeNumber})
    .then(joc=>{

    if(joc){

      let preId = joc._id
      let prPallet = joc.pallet
      let prRefNum = joc.refNumber
     console.log()
      if(countSizeV==0){
        User.findByIdAndUpdate(uid,{$set:{prPallet:prPallet,prRefNum:prRefNum}},function(err,tocs){

        })
      }else{
        User.findByIdAndUpdate(uid,{$set:{countPallet:prPallet,prRefNum:prRefNum}},function(err,tocs){

        })
      }

      if(req.user.prPallet == joc.pallet && req.user.prRefNum == joc.refNumber ){

      
      Warehouse.findOne({'product':product,'warehouse':warehouse})
      .then(hoc=>{
    

        StockV.findOne({'barcodeNumber':barcodeNumber})
        .then(doc=>{
          console.log(doc,'doc',hoc,'hoc')

        if( doc == null){
         StockV.find({refNumReceive:refNumReceive,preRefNumber:prRefNum},function(err,rocs){
           let nSize = rocs.length
  
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
      let countPallet = req.user.prPallet
      let category = hoc.category
      let subCategory = hoc.subCategory
      book.name = product
      book.mformat = mformat
      //book.code =  code
      book.warehouse = warehouse
      book.barcodeNumber = barcodeNumber
      book.status = 'received'
      book.status2 = 'dispatch'
      book.statusCheck = 'scanned'
      book.cases = 0
      book.prPallet = prPallet
      book.countPallet = prPallet
      book.refCases=nSize
      book.date = date2
      book.casesReceived = casesReceived
      book.availableCases = hoc.cases
      book.shift = shift
      book.year = year
      book.month = month
      book.preRefNumber = joc.refNumber
      book.receiver = receiver
      book.dateValue = dateValue
      book.unitCases = unitCases
      book.dispatchStatus ='pending'
      book.zwl = zwl
      book.usd = usd
      book.rand = rand
      book.rate = rate
      book.refNumReceive = refNumReceive
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
    let countSize = req.user.countSize + 1
    console.log(countSize)
    StockV.findByIdAndUpdate(pro._id,{$set:{cases:stock,countSize:countSize}},function(err,vocs){
  
    })
  
    
   PreRcvd.findByIdAndUpdate(preId,{$set:{statusCheck:'scanned',status:"received",refNumReceive:refNumReceive}},function(err,kocs){

   })

   User.findByIdAndUpdate(uid,{$set:{countSize:countSize}},function(err,kdc){

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
        
         })
          
          }else{

console.log(arr,'doc7')
            res.send(arr)
          }
        })
      
      }) 
    }else{
res.send(arr2)
    }
    }
    
    })  
    
    })
  
  


router.post('/receivePallet/:id',isLoggedIn,function(req,res){

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
var prPallet = req.user.prPallet
var casesReceived = 1
var lot = req.user.lot
var refNumber = req.user.refNumber
var refNumReceive = req.user.refNumReceive
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

var arr3=[]
var arr = []
var arr2 = []
var c = {_id:"",statusV:"dispatched",item:"",description:"",invoiceNumber:"",_id:"",amountDue:0} 


var d = {_id:"",statusV:"dispatched",item:"",description:"",invoiceNumber:"",_id:"",amountDue:0} 
var e = {_id:"",statusV:"dispatched",item:"",description:"",invoiceNumber:"",_id:"",amountDue:0} 
arr2.push(c)
arr3.push(d,c)
var id6 =req.user._id


let count = 0
var id = req.params.id
let currentCases = req.user.currentCases

var idU = req.user._id

      
     // console.log('tapinda')
                        PreRcvd.find({refNumber:id,pallet:prPallet,statusCheck:"scanned",refNumReceive:refNumReceive},function(err,docs){

                          let pallet = docs[0].pallet
                          console.log(pallet,'pallet33')
                          for(var i = 0;i<docs.length;i++){
                            
                           console.log(docs.length,'length')
        
             
        
                            if(docs[i].pallet == pallet){
                              count++
                        
                        console.log(count,'count')
                              if(count == docs.length){
                              //  console.log('true55')
                                Warehouse.findOne({'product':product,'warehouse':warehouse})
                                .then(hoc=>{
                              // console.log(hoc,'hoc')
                       // console.log(id,'ref',pallet,'pallet')
                                PreRcvd.find({refNumber:id,status:'pending',pallet:pallet},function(err,ocs){
                        for(var n = 0;n<ocs.length;n++){
                         let objId = ocs[n]._id
                        // console.log(objId,'objId')
                     
                            let size = n + 4
                            let availableCases = hoc.cases + n
                            let barc = ocs[n].barcodeNumber

                            let openingBalance = docs[0].availableCases
                            //let casesRcvdX =  focs.length + 1
                            let closingBalance = docs[0].availableCases + docs.length + 1
                            BatchR.findByIdAndUpdate(batchId,{$set:{cases:size,openingBal:openingBalance,closingBal:closingBalance}},function(err,noc){
                        
                            })
                            
                            //console.log(hoc.cases, n,'jack reverse')
                            let tCases = hoc.cases + 1
                            
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
                            book.barcodeNumber = barc
                            book.status = 'received'
                            book.status2 = 'dispatch'
                            book.statusCheck2 = 'scannedLoop'
                            book.cases = 0
                            book.refCases= size
                            book.date = date2
                            book.casesReceived = casesReceived
                            book.availableCases = availableCases
                            book.shift = shift
                            book.year = year
                            book.month = month
                            book.refNumReceive = refNumReceive
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
                            book.preRefNumber = id
                            book.lot = lot
                            book.expiryDate = expiryDate
                            book.dateValue = dateValue
                            book.expiryDateValue = expiryDateValue
                            book.expiryMformat = expiryMformat
                          
                                
                                 
                                  book.save()
                                    .then(pro =>{
                                      let stock = pro.casesReceived + pro.availableCases
  
                                      StockV.findByIdAndUpdate(pro._id,{$set:{cases:stock,statusCheck2:"scannedLoop"}},function(err,vocs){
                                    
                                      })


                                      User.findByIAndUpdate(id6,{$set:{refNumReceive:refNumReceive}},function(err,tocs){

                                      })
                                      
   PreRcvd.findByIdAndUpdate(objId ,{$set:{status:"received",statusCheck2:"scannedLoop"}},function(err,kocs){

  })


  StockV.find({date:date2},function(err,jocs){
    if(jocs.length >0){

    let openingBalanceX = jocs[0].availableCases
    let totalCases = jocs.length 
    let closingBalanceX = jocs[0].availableCases + jocs.length 
    
    BatchR.find({date:date2},function(err,tocs){
      for(var i = 0;i< tocs.length;i++){
        BatchR.findByIdAndUpdate(tocs[i]._id,{$set:{casesRcvdX:totalCases,openingBalX:openingBalanceX,closingBalX:closingBalanceX}},function(err,noc){

        })

      }
    })

  }
})
                                    })

                     
             
                Product.find({'name':product},function(err,pocs){
                let pId = pocs[0]._id
                // console.log(pId,'pId')
                let nqty, nqty2
                
                 let openingQuantity = pocs[0].cases
                //nqty = pro.quantity + docs[0].quantity
                nqty =  pocs[0].cases - 1 
                //console.log(pocs[0].cases, '**',1)
                nqty2 = nqty * pocs[0].unitCases
               // console.log(nqty,'nqty')
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
                //console.log(kocs[0].cases, '**',1)
                nqty2 = nqty * kocs[0].unitCases
               // console.log(nqty,'nqty')
                Warehouse.findByIdAndUpdate(wareId,{$set:{cases:nqty,openingQuantity:openingQuantity,rcvdQuantity:0, quantity:nqty2}},function(err,nocs){
        
                //  console.log(nocs,'updatedWareH')
                })
        })
         

                      
                       
                        }

                        StockV.find({refNumber:refNumber,status:'received',statusCheck2:"scannedLoop",refNumReceive:refNumReceive},function(err,gocs){

                        
                        StockV.find({refNumber:refNumber,status:'received',statusCheck2:"scannedLoop",refNumReceive:refNumReceive},function(err,pocs){



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
  
    


router.get('/closeBatch/:id',function(req,res){
  let id = req.params.id
  var batchId = req.user.batchId
  console.log(id,'idBatch')

  StockV.find({refNumber:id},function(err,docs){
  //  console.log(docs,'docs')
let cases = docs.length
  BatchR.findById(batchId,function(err,doc){
    let openingBal = doc.openingBal
    let closingBalance = doc.openingBal + docs.length

    BatchR.findByIdAndUpdate(batchId,{$set:{cases:cases,closingBal:closingBalance}},function(err,tocs){

    })
  })
   
    var productChunks = [];
    var chunkSize = 140;
    for (var i = 0; i < docs.length; i += chunkSize) {
        productChunks.push(docs.slice(i, i + chunkSize));
    }

    //console.log(productChunks.length,'chunks')

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
  
    res.redirect('/receiver/warehouseUpdate2')

  })
})

router.get('/closePallet/:id',isLoggedIn,function(req,res){
  let arr16=[]
  let refNumber  =req.params.id
  let uid = req.user._id
  User.findByIdAndUpdate(uid,{$set:{countSize:0}},function(err,tocs){
      console.log('success')

    
  })
  res.redirect('/receiver/receiveStock/'+refNumber)
 
})


/*
  
router.get('/closePallet/:id',isLoggedIn,function(req,res){
  var id = req.params.id
  var uid = req.user._id
  var batchId = req.user.batchId
  console.log(id,'idBatch')

  StockV.find({refNumber:id},function(err,docs){

let cases = docs.length
  BatchR.findById(batchId,function(err,doc){
    let openingBal = doc.openingBal
    let closingBalance = doc.openingBal + docs.length

    BatchR.findByIdAndUpdate(batchId,{$set:{cases:cases,closingBal:closingBalance}},function(err,tocs){
      
    })
  })
   
 
  User.findByIdAndUpdate(uid,{$set:{countSize:0}},function(err,tocs){
      
  })
    var productChunks = [];
    var chunkSize = 140;
    for (var i = 0; i < docs.length; i += chunkSize) {
        productChunks.push(docs.slice(i, i + chunkSize));
    }

  


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
  
    res.redirect('/receiver/fifoPalletUpdate')

  })

  

})
*/





/*router.get('/closePallet/:id',isLoggedIn,function(req,res){
  let arr16=[]
  let refNumber  =req.user.refNumber
  let uid = req.user._id
  User.findByIdAndUpdate(uid,{$set:{countSize:0}},function(err,tocs){
      console.log('success')

    res.redirect('/receiver/receiveStock/'+refNumber)
  })
 
})*/

/*\\
router.get('/closePallet/:id',function(req,res){
  let arr16=[]
  let uid = req.user._id
  User.findByIdAndUpdate(uid,{$set:{countSize:0}},function(err,tocs){
      
  })
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
    res.redirect('/receiver/fifoPalletUpdate')
  })
  
  
  
  })


  */

  router.get('/fifoPalletUpdate',isLoggedIn,function(req,res){
    var refNumber = req.user.refNumber
    BatchR.find({refNumber:refNumber},function(err,docs){
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
    

    res.redirect('/receiver/palletUpdate2')
  })
  })

  




  ////////////////
  
  router.get('/palletUpdate2',isLoggedIn,function(req,res){
  var refNumber = req.user.refNumber
  var uid = req.user._id
  StockV.find({refNumber:refNumber},function(err,ocs){
    let size = ocs.length 
  
   let refNumReceive = size+'RP'+'C'
   User.findByIdAndUpdate(uid,{$set:{refNumReceive:refNumReceive}},function(err,kocs){

   })
   
    BatchR.find({refNumber:refNumber}, function(err,docs){
     
      
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
    

      res.redirect('/receiver/receiveStock/'+refNumber)
  })
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
    /*BatchR.find({date:date},function(err,pocs){
     if(pocs.length > 0){
      for(var q = 0;q<hocs.length; q++){
    
        arr16.push(hocs[q].cases)
          }
          //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
           number1=0;
          for(var z in arr16) { number1 += arr16[z]; }
          let rId = BatchR.findByIdAndUpdate(rId,{$set:{casesRcvdX:cases}},function(err,tocs){

          })
        }
  
        })
*/



        StockV.find({date:date},function(err,jocs){
          if(jocs.length >0){
      
          let openingBalanceX = jocs[0].availableCases
          let totalCases = jocs.length 
          let closingBalanceX = jocs[0].availableCases + jocs.length 
          
          BatchR.find({date:date},function(err,tocs){
            for(var i = 0;i< tocs.length;i++){
              BatchR.findByIdAndUpdate(tocs[i]._id,{$set:{casesRcvdX:totalCases,openingBalX:openingBalanceX,closingBalX:closingBalanceX}},function(err,noc){
      
              })
      
            }
          })
      
        }
      })
                          

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
url: 'https://niyonsoft.org/receiver/uploadStatement',
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
          
  
  
  








