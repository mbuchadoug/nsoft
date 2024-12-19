var express = require('express');
var router = express.Router();
var InvoiceSubFile = require('../models/invoiceSubFile');
var ReturnsSubFile = require('../models/returnsSubFile');
var User = require('../models/user');
var Dispose = require('../models/dispose');
var PreRcvd = require('../models/preRcvd');
var BatchPR = require('../models/batchPR');
var Ware = require('../models/ware');
var Delivery = require('../models/delivery');
var SaleStock = require('../models/salesStock');
var BatchFermentationIngredients = require('../models/batchFermentationIngredients');
var BlendingTanks = require('../models/blendingTanks');
var CrushedItems = require('../models/crushedItems');
var FermentationProduct = require('../models/fermentationProduct');
var DrainedProduct = require('../models/drainedProducts');
var Ingredients = require('../models/ingredients');
var Warehouse = require('../models/warehouse');
var Customer = require('../models/customer');
var BatchR = require('../models/batchR');
var BatchRR = require('../models/batchRR');
var InvoiceSubBatch= require('../models/invoiceSubBatch');
var RtnsSubBatch= require('../models/rtnsSubBatch');
var SaleStock = require('../models/salesStock');
var BatchD = require('../models/batchD');
var InvoNum = require('../models/invoNum');
var VoucherNum = require('../models/vouNum');
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
var Drivers = require('../models/drivers');
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

router.get('/search',function(req,res){
  res.render('kambucha/search')
})

router.get('/updateBatch',function(req,res){
  BatchR.find(function(err,docs){
    let id = docs[0]._id
    BatchR.findByIdAndUpdate(id,{$set:{closingBalX:1960,casesRcvdX:1960}},function(err,locs){

    })
  })
})


router.get('/pallet9',function(req,res){
  
PreRcvd.find({pallet:9},function(err,docs){
  for(var i = 0;i<docs.length;i++){
    let id = docs[i]._id
    PreRcvd.findByIdAndUpdate(id,{$set:{status:"pending"}},function(err,locs){

    })
  }
})
})


router.get('/updateBatchRemaining',function(req,res){
  StockV.find({status2:"remaining",status:"received"},function(err,docs){
    console.log(docs.length,'length')

    for(var i = 0;i<docs.length;i++){
      
      let idV = docs[i]._id
      StockV.findByIdAndUpdate(idV,{$set:{status2:"dispatch"}},function(err,locs){
        
      })
    }

  })
})



/*router.get('/update20',function(req,res){
  StockV.find({pallet:6},function(err,docs){
    for(var i = 0;i<18;i++){
      let id = docs[i]._id
      StockV.findByIdAndRemove(id,function(err,rocs){

      })
    }
  })
})*/
router.get('/fix',function(req,res){
  RefNoSeqDisp.find(function(err,docs){
    for(var i = 0;i<docs.length;i++){
      let id = docs[i]._id
      RefNoSeqDisp.findByIdAndRemove(id,function(err,locs){

      })
    }
  })
})

router.get('/conversai',function(req,res){
  res.render('receiver/index')
})




router.get('/updateUser',isLoggedIn,function(req,res){
User.find({role:"receiver"},function(err,doc){
  let id = doc[0]._id
  User.findByIdAndUpdate(id,{$set:{fullname:"Armstrong"}},function(err,loc){
    
  })
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
      ware.type2 = 'normal'
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
})



})


/////
router.get('/warehouseUpdateRtns',function(req,res){
  let arr16=[]
  let arrV = []
  let number1, number2
  let arrE = []
  Product.find(function(err,docs){
    for(var i = 0;i<docs.length;i++){
      let product = docs[i].name
      let category = docs[i].category
      let subCategory = docs[i].subCategory
      let usd = docs[i].usd
  
 
  
    Warehouse.find({product:product,reason:"breakages"},function(err,vocs){
  console.log(vocs.length,'size9')
      if(vocs.length == 0){
  
       
        var ware = new Warehouse()
  
        
        ware.product = product
        ware.cases = 0
        ware.category = category
        ware.subCategory = subCategory
        ware.subCategory = category
        ware.quantity =0
        ware.openingQuantity = 0
        ware.rcvdQuantity = 0
        ware.unitCases = 12
        ware.reason = "breakages"
        ware.type='goods'
        ware.type2='returns'
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
  
      
  
      }else{
        let id = vocs[0]._id
        

        
        
        console.log(product,'product')
    
        let cases = vocs.length
        let number1 = cases * 12
          number1.toFixed(2)
        Warehouse.findByIdAndUpdate(id,{$set:{cases:0,quantity:0}},function(err,tocs){
  
        })
  
            
          
      }
  })

    }
  })
  
  
  
  })

  ///////2
 


router.get('/wr2',isLoggedIn,function(req,res){
  let arrV = []
  let arrV2 = []
  let arrV3 = []
  let number1,number2,number3
Warehouse.find({reason:"breakages",product:'kambucha lite',type2:'returns'},function(err,tocs){
for(var i = 0; i<tocs.length; i++){
  let product = tocs[i].product
  let id = tocs[i]._id
arrV2=[]
console.log(arrV,i,'i')
BatchR.find({reason:'breakages'},function(err,vocs){


  for(var i = 0;i<vocs.length; i++){
    arrV2=[]

  arrV2.push(vocs[i].cases)
    }
    //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
   console.log(arrV2,'arrV2')
  
  //InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
  number2=0;
  for(var z in arrV2) { number2 += arrV2[z]; }

let cases2 = number2
 let nqty2 = number2 *12 
  

 Dispose.find({type:'breakages'},function(err,ocs){


  for(var i = 0;i<ocs.length; i++){
    arrV3=[]

  arrV3.push(ocs[i].quantity)
    }
    //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
   console.log(arrV3,'arrV3')
  
  //InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
  number3=0;
  for(var z in arrV3) { number3 += arrV3[z]; }

let cases3 = number3 / 12
 let nqty3 = number3
  RtnsSubBatch.find({item:product,reason:"breakages"},function(err,docs){

    console.log(docs.length)
    for(var i = 0;i<docs.length; i++){
      arrV=[]
      console.log(docs[i].qty,'serima')
    arrV.push(docs[i].total)
      }
      //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
     console.log(arrV,'arrV')
    
    //InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
    number1=0;
    for(var z in arrV) { number1 += arrV[z]; }

    let cases = number1 / 12
    
if(cases2 > cases){
console.log('true1')
 let nCases = cases2 - cases - cases3
 let nqty = nqty2 - number1 - number3
 console.log(nCases,nqty,'fffff')
     console.log(cases.toFixed(2),'fixed')
    Warehouse.findByIdAndUpdate(id,{$set:{cases:nCases.toFixed(2),quantity:nqty,totalReturned:number1,totalRepacked:nqty2,totalDisposed:nqty3}},function(err,tocs){

    })
  }   else{
    let nCases = cases - cases2 - cases3
 let nqty = number1 - nqty2 - number3
 console.log(nCases,cases,cases2,nqty,nqty2,number1,'fffff2')
     console.log(cases.toFixed(2),'fixed')
    Warehouse.findByIdAndUpdate(id,{$set:{cases:nCases.toFixed(2),quantity:nqty,totalReturned:number1,totalRepacked:nqty2,totalDisposed:nqty3}},function(err,tocs){

    })
  } 

  })
})
})
}
res.redirect('/wr3')

})

})




router.get('/wr3',isLoggedIn,function(req,res){
  let arrV = []
  let number1
Warehouse.find({reason:"breakages",product:'manyuchi'},function(err,tocs){
for(var i = 0; i<tocs.length; i++){
  let product = tocs[i].product
  let id = tocs[i]._id
arrV=[]
console.log(arrV,i,'i')
  RtnsSubBatch.find({item:product,reason:"breakages"},function(err,docs){

    console.log(docs.length)
    for(var i = 0;i<docs.length; i++){
      arrV=[]
      console.log(docs[i].qty,'serima')
    arrV.push(docs[i].total)
      }
      //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
     console.log(arrV,'arrV')
    
    //InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
    number1=0;
    for(var z in arrV) { number1 += arrV[z]; }

    let cases = number1 / 12
  
    cases.toFixed(0)
    Warehouse.findByIdAndUpdate(id,{$set:{cases:cases,quantity:number1}},function(err,tocs){

    })
    
})

}
res.redirect('/wr4')
})

})


router.get('/wr4',isLoggedIn,function(req,res){
  let arrV = []
  let number1
Warehouse.find({reason:"breakages",product:'kambucha No3'},function(err,tocs){
for(var i = 0; i<tocs.length; i++){
  let product = tocs[i].product
  let id = tocs[i]._id
arrV=[]
console.log(arrV,i,'i')
  RtnsSubBatch.find({item:product,reason:"breakages"},function(err,docs){

    console.log(docs.length)
    for(var i = 0;i<docs.length; i++){
      arrV=[]
      console.log(docs[i].qty,'serima')
    arrV.push(docs[i].total)
      }
      //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
     console.log(arrV,'arrV')
    
    //InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
    number1=0;
    for(var z in arrV) { number1 += arrV[z]; }

    let cases = number1 / 12
  
    cases.toFixed(0)
    Warehouse.findByIdAndUpdate(id,{$set:{cases:cases,quantity:number1}},function(err,tocs){

    })
    
})

}
res.redirect('/')
})

})

//////expired
router.get('/warehouseUpdateRtns2',function(req,res){
  let arr16=[]
  let arrV = []
  let number1, number2
  let arrE = []
  Product.find(function(err,docs){
    for(var i = 0;i<docs.length;i++){
      let product = docs[i].name
      let category = docs[i].category
      let subCategory = docs[i].subCategory
      let usd = docs[i].usd
  
    
  
    Warehouse.find({product:product,reason:"expired"},function(err,vocs){
  console.log(vocs.length,'size9')
      if(vocs.length == 0){
  
       
        var ware = new Warehouse()
  
        ware.warehouse=warehouse
        ware.product = product
        ware.cases = 0
        ware.category = category
        ware.subCategory = subCategory
        ware.subCategory = category
        ware.quantity =0
        ware.openingQuantity = 0
        ware.rcvdQuantity = 0
        ware.unitCases = 12
        ware.reason = "expired"
        ware.type='goods'
        ware.type2='returns'
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
  
      
  
      }else{
        let id = vocs[0]._id
        

        
        
        console.log(product,'product')
    
        let cases = vocs.length
        let number1 = cases * 12
          number1.toFixed(2)
        Warehouse.findByIdAndUpdate(id,{$set:{cases:0,quantity:0}},function(err,tocs){
  
        })
  
            
          
   
  }
      })
    }



    res.redirect('/wre2')
  })
  
  
  
  })


router.get('/wre2',isLoggedIn,function(req,res){
  let arrV = []
  let number1
Warehouse.find({reason:"expired",product:'kambucha lite'},function(err,tocs){
for(var i = 0; i<tocs.length; i++){
  let product = tocs[i].product
  let id = tocs[i]._id
arrV=[]
console.log(arrV,i,'i')
  RtnsSubBatch.find({item:product,reason:"expired"},function(err,docs){

    console.log(docs.length)
    for(var i = 0;i<docs.length; i++){
      arrV=[]
      console.log(docs[i].qty,'serima')
    arrV.push(docs[i].total)
      }
      //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
     console.log(arrV,'arrV')
    
    //InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
    number1=0;
    for(var z in arrV) { number1 += arrV[z]; }

    let cases = number1 / 12
  
    cases.toFixed(2)
    Warehouse.findByIdAndUpdate(id,{$set:{cases:cases,quantity:number1}},function(err,tocs){

    })
    
})

}
res.redirect('/wre3')
})

})




router.get('/wre3',isLoggedIn,function(req,res){
  let arrV = []
  let number1
Warehouse.find({reason:"expired",product:'manyuchi'},function(err,tocs){
for(var i = 0; i<tocs.length; i++){
  let product = tocs[i].product
  let id = tocs[i]._id
arrV=[]
console.log(arrV,i,'i')
  RtnsSubBatch.find({item:product,reason:"expired"},function(err,docs){

    console.log(docs.length)
    for(var i = 0;i<docs.length; i++){
      arrV=[]
      console.log(docs[i].qty,'serima')
    arrV.push(docs[i].total)
      }
      //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
     console.log(arrV,'arrV')
    
    //InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
    number1=0;
    for(var z in arrV) { number1 += arrV[z]; }

    let cases = number1 / 12
  
    cases.toFixed(2)
    Warehouse.findByIdAndUpdate(id,{$set:{cases:cases,quantity:number1}},function(err,tocs){

    })
    
})

}
res.redirect('/wre4')
})

})


router.get('/wre4',isLoggedIn,function(req,res){
  let arrV = []
  let number1
Warehouse.find({reason:"expired",product:'kambucha No3'},function(err,tocs){
for(var i = 0; i<tocs.length; i++){
  let product = tocs[i].product
  let id = tocs[i]._id
arrV=[]
console.log(arrV,i,'i')
  RtnsSubBatch.find({item:product,reason:"expired"},function(err,docs){

    console.log(docs.length)
    for(var i = 0;i<docs.length; i++){
      arrV=[]
      console.log(docs[i].qty,'serima')
    arrV.push(docs[i].total)
      }
      //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
     console.log(arrV,'arrV')
    
    //InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
    number1=0;
    for(var z in arrV) { number1 += arrV[z]; }

    let cases = number1 / 12
  
    cases.toFixed(2)
    Warehouse.findByIdAndUpdate(id,{$set:{cases:cases,quantity:number1}},function(err,tocs){

    })
    
})

}
res.redirect('/')
})

})



router.get('/add',function(req,res){

  var errorMsg = req.flash('danger')[0];
  var successMsg = req.flash('success')[0];
  res.render('kambucha/addUser',{successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg})



})

router.post('/add', function(req,res){
  var m = moment()

  var year = m.format('YYYY')
  var dateValue = m.valueOf()



var date = m.format('L')
                  
                var name = req.body.name
            
              
                var email = req.body.email
                var password = req.body.password
                var role = req.body.role
                var username = req.body.username
                var uid = req.body.username
                var fullname = req.body.fullname
                req.check('fullname','Enter Name').notEmpty();
               
              
                req.check('email','Enter email').notEmpty().isEmail();
         
                
             
               
                req.check('password', 'Password do not match').isLength({min: 4}).equals(req.body.confirmPassword);
                    
                
                      
                   
                var errors = req.validationErrors();
                    if (errors) {
                
                    
                      req.session.errors = errors;
                      req.session.success = false;
                      req.flash('danger', req.session.errors[0].msg);
         
          
                  res.redirect('/add');
                      
                    
                  }
                  else
                
                 {
                    User.findOne({'email':email})
                    .then(user =>{
                        if(user){ 
                      // req.session.errors = errors
                        //req.success.user = false;
                    
                       req.session.message = {
                         type:'errors',
                         message:'user id already in use'
                       }     
                       
                       req.flash('danger', req.session.errors[0].msg);
         
          
                       res.redirect('/add');
                       
                        
                  }
                  
                                else  {   
               

                  
                  var user = new User();
                  user.fullname = fullname;
                  user.email = email;
                  user.uid = username
                  user.username = username
                  user.mobile = "null";
                  user.photo = 'propic.jpg';
                  user.date = "null";
                  user.shift = "null";
                  user.warehouse = "null";
                  user.product = "null";
                  user.lot = 0;
                  user.refNumber = "null";
                  user.location = "null";
                  user.role = role
                 

                  
                  
                  user.password = user.encryptPassword(password)

                  
                   
              
                   
          
                  user.save()
                    .then(user =>{
                      
                })
              }
              req.flash('success', 'User added Successfully');
         
          
              res.redirect('/add');
                    })
                  }
              
                 
                
                    
                    
                
                 
                  

                  
})



router.get('/addUserBranch',function(req,res){

  var errorMsg = req.flash('danger')[0];
  var successMsg = req.flash('success')[0];
  res.render('kambucha/addUserBranch',{successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg})



})

router.post('/addUserBranch', function(req,res){
  var m = moment()

  var year = m.format('YYYY')
  var dateValue = m.valueOf()



var date = m.format('L')
                  
                var name = req.body.name
            
              
                var email = req.body.email
                var password = req.body.password
                var role = req.body.role
                var username = req.body.username
                var uid = req.body.username
                var fullname = req.body.fullname
                var branch = req.body.branch
                req.check('fullname','Enter Name').notEmpty();
               
              
                req.check('email','Enter email').notEmpty().isEmail();
         
                
             
               
                req.check('password', 'Password do not match').isLength({min: 4}).equals(req.body.confirmPassword);
                    
                
                      
                   
                var errors = req.validationErrors();
                    if (errors) {
                
                    
                      req.session.errors = errors;
                      req.session.success = false;
                      req.flash('danger', req.session.errors[0].msg);
         
          
                  res.redirect('/addUserBranch');
                      
                    
                  }
                  else
                
                 {
                    User.findOne({'email':email})
                    .then(user =>{
                        if(user){ 
                      // req.session.errors = errors
                        //req.success.user = false;
                    
                       req.session.message = {
                         type:'errors',
                         message:'user id already in use'
                       }     
                       
                       req.flash('danger', req.session.errors[0].msg);
         
          
                       res.redirect('/addUserBranch');
                       
                        
                  }
                  
                                else  {   
               

                  
                  var user = new User();
                  user.fullname = fullname;
                  user.email = email;
                  user.uid = username
                  user.username = username
                  user.branch = branch
                  user.mobile = "null";
                  user.photo = 'propic.jpg';
                  user.date = "null";
                  user.shift = "null";
                  user.warehouse = "null";
                  user.product = "null";
                  user.lot = 0;
                  user.refNumber = "null";
                  user.location = "null";
                  user.role = role
                 

                  
                  
                  user.password = user.encryptPassword(password)

                  
                   
              
                   
          
                  user.save()
                    .then(user =>{
                      
                })
              }
              req.flash('success', 'User added Successfully');
         
          
              res.redirect('/addUserBranch');
                    })
                  }
              
                 
                
                    
                    
                
                 
                  

                  
})






router.get('/addWarehouse',function(req,res){

  var errorMsg = req.flash('danger')[0];
  var successMsg = req.flash('success')[0];
  res.render('kambucha/addW',{successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg})



})

router.post('/addWarehouse', function(req,res){
  var m = moment()

  var year = m.format('YYYY')
  var dateValue = m.valueOf()



var date = m.format('L')
                  
                var name = req.body.name
            
              
                
                req.check('name','Enter Name').notEmpty();
               
              
              
                
                      
                   
                var errors = req.validationErrors();
                    if (errors) {
                
                    
                      req.session.errors = errors;
                      req.session.success = false;
                      req.flash('danger', req.session.errors[0].msg);
         
          
                  res.redirect('/addWarehouse');
                      
                    
                  }
                  else
                
                
                           
               

                  
                  var user = new Ware();
                  user.name = name;
               
                 

                  
                  
             

                  
                   
              
                   
          
                  user.save()
                    .then(user =>{
                      
                    
              
              req.flash('success', 'User added Successfully');
         
          
              res.redirect('/addWarehouse');
                    })
                  
              
                 
                
                    
                    
                
                 
                  

                  
})








router.get('/addFP',function(req,res){

  var errorMsg = req.flash('danger')[0];
  var successMsg = req.flash('success')[0];
  res.render('kambucha/addFP',{successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg})



})

router.post('/addFP', function(req,res){
  var m = moment()

  var year = m.format('YYYY')
  var dateValue = m.valueOf()



var date = m.format('L')
                  
                var name = req.body.name
            
              
                
                req.check('name','Enter Name').notEmpty();
               
              
              
                
                      
                   
                var errors = req.validationErrors();
                    if (errors) {
                
                    
                      req.session.errors = errors;
                      req.session.success = false;
                      req.flash('danger', req.session.errors[0].msg);
         
          
                  res.redirect('/addFP');
                      
                    
                  }
                  else
                
                
                           
               

                  
                  var user = new FermentationProduct();
                  user.product = name;
                  user.tanks = 0
                  user.litres = 0
               
                 

                  
                  
             

                  
                   
              
                   
          
                  user.save()
                    .then(user =>{
                      
                    
              
              req.flash('success', 'User added Successfully');
         
          
              res.redirect('/addFP');
                    })
                  
              
                 
                
                    
                    
                
                 
                  

                  
})

////

router.get('/addDP',function(req,res){

  var errorMsg = req.flash('danger')[0];
  var successMsg = req.flash('success')[0];
  res.render('kambucha/addDP',{successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg})



})



router.post('/addDP', function(req,res){
  var m = moment()

  var year = m.format('YYYY')
  var dateValue = m.valueOf()



var date = m.format('L')
                  
                var name = req.body.name
            
              
                
                req.check('name','Enter Name').notEmpty();
               
              
              
                
                      
                   
                var errors = req.validationErrors();
                    if (errors) {
                
                    
                      req.session.errors = errors;
                      req.session.success = false;
                      req.flash('danger', req.session.errors[0].msg);
         
          
                  res.redirect('/addDP');
                      
                    
                  }
                  else
                
                
                           
               

                  
                  var user = new DrainedProduct();
                  user.product = name;
                  user.tanks = 0
                  user.litres = 0
               
                 

                  
                  
             

                  
                   
              
                   
          
                  user.save()
                    .then(user =>{
                      
                    
              
              req.flash('success', 'User added Successfully');
         
          
              res.redirect('/addDP');
                    })
                  
              
                 
                
                    
                    
                
                 
                  

                  
})
///add CrushedDB

router.get('/addCB',function(req,res){

  var errorMsg = req.flash('danger')[0];
  var successMsg = req.flash('success')[0];
  res.render('kambucha/addCB',{successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg})



})



router.post('/addCB', function(req,res){
  var m = moment()

  var year = m.format('YYYY')
  var dateValue = m.valueOf()



var date = m.format('L')
                  
                var name = req.body.name
            
              
                
                req.check('name','Enter Name').notEmpty();
               
              
              
                
                      
                   
                var errors = req.validationErrors();
                    if (errors) {
                
                    
                      req.session.errors = errors;
                      req.session.success = false;
                      req.flash('danger', req.session.errors[0].msg);
         
          
                  res.redirect('/addCB');
                      
                    
                  }
                  else
                
                
                           
               

                  
                  var user = new CrushedItems();
                  user.item = name;
                  user.massKgs = 0
                  user.massTonnes = 0
               
                 

                  
                  
             

                  
                   
              
                   
          
                  user.save()
                    .then(user =>{
                      
                    
              
              req.flash('success', 'Item added Successfully');
         
          
              res.redirect('/addCB');
                    })
                  
              
                 
                
                    
                    
                
                 
                  

                  
})




//////////add RM

router.get('/addRM',function(req,res){

  var errorMsg = req.flash('danger')[0];
  var successMsg = req.flash('success')[0];
  res.render('kambucha/addRM',{successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg})



})

router.post('/addRM', function(req,res){
  var m = moment()

  var year = m.format('YYYY')
  var dateValue = m.valueOf()



var date = m.format('L')
                  
                var name = req.body.name
                var stage = req.body.stage
                var type = req.body.type
              
                
                req.check('name','Enter Name').notEmpty();
                req.check('stage','Enter Stage').notEmpty();
                
               
              
              
                
                      
                   
                var errors = req.validationErrors();
                    if (errors) {
                
                    
                      req.session.errors = errors;
                      req.session.success = false;
                      req.flash('danger', req.session.errors[0].msg);
         
          
                  res.redirect('/addRM');
                      
                    
                  }
                  else
                
                
                           
               

                  
                  var user = new RawMat();
                  user.item = name;
                  user.massKgs = 0;
                  user.massTonnes = 0;
                  user.type = type
                  user.stage = stage
                  

               
                 

                  
                  
             

                  
                   
              
                   
          
                  user.save()
                    .then(user =>{
                      
                    
              
              req.flash('success', 'RM added Successfully');
         
          
              res.redirect('/addRM');
                    })
                  
              
                 
                
                    
                    
                
                 
                  

                  
})




//////////add Batch Fermentation Ingredients

router.get('/addBatchFermentationIngredients',function(req,res){

  var errorMsg = req.flash('danger')[0];
  var successMsg = req.flash('success')[0];
  res.render('kambucha/addBFI',{successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg})



})

router.post('/addBatchFermentationIngredients', function(req,res){
  var m = moment()

  var year = m.format('YYYY')
  var dateValue = m.valueOf()



var date = m.format('L')
                  
                var name = req.body.name
                var stage = req.body.stage
                //var type = req.body.type
              
                
                req.check('name','Enter Name').notEmpty();
               
              
              
                
                      
                   
                var errors = req.validationErrors();
                    if (errors) {
                
                    
                      req.session.errors = errors;
                      req.session.success = false;
                      req.flash('danger', req.session.errors[0].msg);
         
          
                  res.redirect('/addBatchFermentationIngredients');
                      
                    
                  }
                  else
                
                
                           
               

                  
                  var user = new BatchFermentationIngredients();
                  user.ingredient = name;
                  user.quantity = 0;
                  user.tanks = 0;
                  user.batchNumber = 'null'
                  user.refNumber = 'null'
                  user.product = 'null'
                  user.status = 'null'
                  

               
                 

                  
                  
             

                  
                   
              
                   
          
                  user.save()
                    .then(user =>{
                      
                    
              
              req.flash('success', 'BFI added Successfully');
         
          
              res.redirect('/addBatchFermentationIngredients');
                    })
                  
              
                 
                
                    
                    
                
                 
                  

                  
})







//add ingredients


router.get('/addIngredient',function(req,res){

  var errorMsg = req.flash('danger')[0];
  var successMsg = req.flash('success')[0];
  res.render('kambucha/addIngredient',{successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg})



})

router.post('/addIngredient', function(req,res){
  var m = moment()

  var year = m.format('YYYY')
  var dateValue = m.valueOf()



var date = m.format('L')
                  
                var name = req.body.name
            
              
                
                req.check('name','Enter Name').notEmpty();
               
              
              
                
                      
                   
                var errors = req.validationErrors();
                    if (errors) {
                
                    
                      req.session.errors = errors;
                      req.session.success = false;
                      req.flash('danger', req.session.errors[0].msg);
         
          
                  res.redirect('/addIngredient');
                      
                    
                  }
                  else
                
                
                           
               

                  
                  var user = new Ingredients();
                  user.item = name;
                  user.massKgs = 0;
               
                 

                  
                  
             

                  
                   
              
                   
          
                  user.save()
                    .then(user =>{
                      
                    
              
              req.flash('success', 'Ingredient added Successfully');
         
          
              res.redirect('/addIngredient');
                    })
                  
              
                 
                
                    
                    
                
                 
                  

                  
})















//login route
router.get('/', function (req, res, next) {
  var messages = req.flash('error');
  
  res.render('kambucha/login', { messages: messages, hasErrors: messages.length > 0});
});
router.post('/', passport.authenticate('local.signin', {
  failureRedirect: '/',
  failureFlash: true
}), function (req, res, next) {
  if(req.user.role == "receiver"){
    res.redirect("/receiver/batch");
  }else if(req.user.role == "receiverTest"){
    res.redirect('/receiverTest/batch')
  }
  else if(req.user.role == "dispatch"){
    res.redirect('/dispatch/fifoUpdate')
  }
  else if(req.user.role == "dispatchTest"){
    res.redirect('/dispatchTest/fifoUpdate')
  }
  else if(req.user.role == "sales"){
    res.redirect('/sales/invoice')
  }else if(req.user.role == "accountant1"){
    res.redirect('/accounts1/stockRequisitions')
  }else if(req.user.role == "accountant2"){
    res.redirect('/accounts2/stockRequisitions')
  }else if(req.user.role == "md"){
    res.redirect('/accounts3/stockRequisitions')
  }else if(req.user.role == "ceo"){
    res.redirect('/accounts4/stockRequisitions')
  }else if(req.user.role == "production-supervisor"){
    res.redirect('/rm/voucherNumberUpdate')
  }else if(req.user.role == "sales-branch"){
    res.redirect('/merch/refDispUpdate/')
  }else if(req.user.role == "admin"){
    res.redirect('/admin/batch')
  }else if(req.user.role == "adminTest"){
    res.redirect('/adminTest/batch')
  }


  
});








router.get("/logout",(req,res)=>{
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});



router.post('/dashChartStockRtns',isLoggedIn,function(req,res){

  
  var reason = req.body.reason
   console.log(reason,'fReason')
   var date = req.body.date
   var arr = []
   var id = req.user._id
   let num = req.user.num
   num++
   
  
  
   Warehouse.find({reason:reason},function(err,docs) {
     console.log(docs,'docs5')
     for(var i = 0;i<docs.length;i++){

    //console.log(docs,'docs')
  
        if(arr.length > 0 && arr.find(value => value.reason == docs[i].reason  && value.product == docs[i].product )){
               console.log('true')
              arr.find(value => value.product == docs[i].product).quantity += docs[i].quantity;
         }else{
  arr.push(docs[i])
         }
  
       
     }
    console.log(arr,'arr')
    res.send(arr)
   })
  
  
  })
  
  

  router.get('/rtnsList',isLoggedIn,function(req,res){

  

     var arr = []
 
     var id = req.user._id
     let num = req.user.num
     num++
     
  
    
    
     Warehouse.find({type2:'returns'},function(err,docs) {
       console.log(docs,'docs5')
       for(var i = 0;i<docs.length;i++){
  
      //console.log(docs,'docs')
    
          if(arr.length > 0 && arr.find(value => value.reason == docs[i].reason  && value.product == docs[i].product )){
                 console.log('true')
                arr.find(value => value.product == docs[i].product).quantity += docs[i].quantity;
                arr.find(value => value.product == docs[i].product).cases += docs[i].cases.toFixed(2);
           }else{
    arr.push(docs[i])
           }
    
         
       }
   
     res.render('dispatcher/rtnsList',{listX:arr})
     })
    
    
    })
    
    
  


router.post('/dashChartStockXI',isLoggedIn,function(req,res){

  

  var date = req.body.date
  var arr = []
  var id = req.user._id
  let num = req.user.num
  num++
  
 
 
  Warehouse.find({type2:'normal'},function(err,docs) {
   // console.log(docs,'docs')
    for(var i = 0;i<docs.length;i++){
 
 
       if(arr.length > 0 && arr.find(value => value.product == docs[i].product)){
              console.log('true')
             arr.find(value => value.product == docs[i].product).cases += docs[i].cases;
        }else{
 arr.push(docs[i])
        }
 
      
    }
   // console.log(arr,'arr')
   res.send(arr)
  })
 
 })
 






 router.post('/dashChartStockRM',isLoggedIn,function(req,res){

  

  var date = req.body.date
  var arr = []
  var id = req.user._id
  let num = req.user.num
  num++
  
 
 
  RawMat.find({},function(err,docs) {
   // console.log(docs,'docs')
    for(var i = 0;i<docs.length;i++){
 
 
       if(arr.length > 0 && arr.find(value => value.item == docs[i].item)){
              console.log('true')
             arr.find(value => value.item == docs[i].item).massTonnes += docs[i].massTonnes;
        }else{
 arr.push(docs[i])
        }
 
      
    }
   // console.log(arr,'arr')
   res.send(arr)
  })
 
 })
 






 router.post('/dashChartStockX',isLoggedIn,function(req,res){

  var warehouse = req.body.warehouse
console.log(warehouse,'warehouse')
 var date = req.body.date
 var arr = []
 var id = req.user._id
 let num = req.user.num
 num++
 


 Warehouse.find({warehouse:warehouse,type2:'normal'},function(err,docs) {
  // console.log(docs,'docs')
   for(var i = 0;i<docs.length;i++){
  let product = docs[i].product
  console.log(docs,'docs')

      if(arr.length > 0 && arr.find(value => value.warehouse == docs[i].warehouse  && value.product == docs[i].product )){
             console.log('true')
            arr.find(value => value.product == docs[i].product).cases += docs[i].cases;
       }else{
arr.push(docs[i])
       }

     
   }
  console.log(arr,'arr')
  res.send(arr)
 })

})



router.post('/dashChartStockSub',isLoggedIn,function(req,res){

  
var warehouse = req.body.warehouse
console.log(warehouse,'warehouse')
 var date = req.body.date
 var arr = []
 var id = req.user._id
 let num = req.user.num
 num++
 


 Warehouse.find({warehouse:warehouse,type2:"normal"},function(err,docs) {
  // console.log(docs,'docs')
   for(var i = 0;i<docs.length;i++){
  let product = docs[i].product
  console.log(docs,'docs')

      if(arr.length > 0 && arr.find(value => value.warehouse == docs[i].warehouse  && value.product == docs[i].product )){
             console.log('true')
            arr.find(value => value.product == docs[i].product).cases += docs[i].cases;
       }else{
arr.push(docs[i])
       }

     
   }
  console.log(arr,'arr')
  res.send(arr)
 })


})



router.post('/dashChartStockSales',isLoggedIn,function(req,res){

  
  var product = req.body.product
//console.log(warehouse,'warehouse')
 var date = req.body.date
 var arr = []
 var id = req.user._id
 let num = req.user.num
 num++
 


 SaleStock.find({product:product},function(err,docs) {
  // console.log(docs,'docs')
   for(var i = 0;i<docs.length;i++){
 // let product = docs[i].product
  //console.log(docs,'docs')

      if(arr.length > 0 && arr.find(value => value.salesPerson == docs[i].salesPerson  && value.product == docs[i].product )){
             console.log('true')
            arr.find(value => value.product == docs[i].product).holdingCases += docs[i].holdingCases
       }else{
arr.push(docs[i])
       }

     
   }
  //console.log(arr,'arr')
  res.send(arr)
 })


})




/////////////////RawMaterials


/*
router.post('/dashChartStockRtns',isLoggedIn,function(req,res){

  
  var reason = req.body.reason
console.log(reason,'warehouse')
 var date = req.body.date
 var arr = []
 var id = req.user._id
 let num = req.user.num
 num++
 

console.log(product,'proRtns')
 RtnsSubBatch.find({item:product},function(err,docs) {

   for(var i = 0;i<docs.length;i++){
  let product = docs[i].item
  console.log(docs,'docs')

      if(arr.length > 0 && arr.find(value => value.item == docs[i].item )){
             console.log('true')
            arr.find(value => value.item == docs[i].item).qty += docs[i].qty;
       }else{
arr.push(docs[i])
       }

     
   }
  console.log(arr,'arr6')
  res.send(arr)
 })


})*/







router.post('/dashChartStockWRtns',isLoggedIn,function(req,res){

  var reason = req.body.reason

 var arr = []
 var id = req.user._id
 let num = req.user.num
 num++
 


 StockV.find({status:reason},function(err,docs) {
  // console.log(docs,'docs')
   for(var i = 0;i<docs.length;i++){
 
  console.log(docs,'docsWR')

      if(arr.length > 0 && arr.find(value => value.name == docs[i].name  )){
             console.log('true')
  arr.find(value => value.name == docs[i].name).casesReceived
  += docs[i].casesReceived
  ;
       }else{
arr.push(docs[i])
       }

     
   }
  console.log(arr,'arrWR')
  res.send(arr)
 })

})




router.get('/warehouseStock',isLoggedIn,function(req,res){
  var pro = req.user
  //res.render('admin/dash6',{pro:pro})
  Product.find({},function(err,docs){
 Warehouse.find({},function(err,hocs){
  res.render('kambucha/dash7',{pro:pro,arr:docs,arr1:hocs})
})
  })
})







router.get('/importSales',isLoggedIn,function(req,res){
  var pro = req.user
  var errorMsg = req.flash('danger')[0];
  var successMsg = req.flash('success')[0];
  res.render('imports/sales',{pro:pro,successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg})
})






router.post('/importSales',isLoggedIn,uploadX.single('file'),  (req,res)=>{
 
 

/*  if(!req.file){
      req.session.message = {
        type:'errors',
        message:'Select File!'
      }     
        res.render('imports/students', {message:req.session.message,pro:pro}) */
   if (!req.file || req.file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
          req.session.message = {
              type:'errors',
              message:'Upload Excel File'
            }     
              res.render('imports/sales', {message:req.session.message,pro:pro
                   
               }) 



      }
        
      else{
   

      
         const file = req.file.filename;
  
          
              var wb =  xlsx.readFile('./public/uploads/' + file)

           
       
               var sheets = wb.Sheets;
               var sheetNames = wb.SheetNames;
   
               var sheetName = wb.SheetNames[0];
   var sheet = wb.Sheets[sheetName ];
   
      for (var i = 0; i < wb.SheetNames.length; ++i) {
       var sheet = wb.Sheets[wb.SheetNames[i]];
   
       console.log(wb.SheetNames.length)
       var data =xlsx.utils.sheet_to_json(sheet)
           
       var newData = data.map(function (record){
   
      
     
    
        
       
      
         
          let salesPerson = record.salesPerson
          let driver = record.driver;
          let type = record.type;
         

req.body.salesPerson = record.salesPerson 
req.body.driver = record.driver
req.body.type = record.type


//req.body.photo = record.photo          

          
      
          
            req.check('salesPerson','Enter SalesPerson').notEmpty();
            //req.check('name','Enter Name').notEmpty();
        
            
            var errors = req.validationErrors();

            if (errors) {
              
              req.session.errors = errors;
              req.session.success = false;
              req.flash('danger', req.session.errors[0].msg);
     
      
              res.redirect('/importSales');
            
        }
else


{
SalesList.findOne({'salesPerson':salesPerson})
.then(user =>{
    if(user){ 
  // req.session.errors = errors
    //req.success.user = false;



    req.flash('danger', 'Item already in the system');

    res.redirect('/importSales')
}
else{




        
var product = new SalesList();
product.salesPerson = salesPerson;
product.driver = driver;
product.type = type

product.save()
  .then(user =>{


  })

}

})




}     
               
                   
 
                  // .catch(err => console.log(err))
           
               
                  })
                
                  req.flash('success', 'File Successfully!');

                  res.redirect('/importSales')  
       
                }
                
                
                  
                  
      
                 
      
                  
           
              }
    
      


})
/////

router.get('/addSales',function(req,res){

  var errorMsg = req.flash('danger')[0];
  var successMsg = req.flash('success')[0];
  res.render('kambucha/addSales',{successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg})



})



router.post('/addSales', function(req,res){
  var m = moment()

  var year = m.format('YYYY')
  var dateValue = m.valueOf()



var date = m.format('L')
                    
          let salesPerson = req.body.salesPerson
          let driver = req.body.driver;
          let type = req.body.type;
         
              
                
                req.check('salesPerson','Enter SalesPerson').notEmpty();
                 
                req.check('driver','Enter Driver').notEmpty();
               
                req.check('type','Enter Type').notEmpty();
              
                
                      
                   
                var errors = req.validationErrors();
                    if (errors) {
                
                    
                      req.session.errors = errors;
                      req.session.success = false;
                      req.flash('danger', req.session.errors[0].msg);
         
          
                  res.redirect('/addSales');
                      
                    
                  }
                  else{
                
                
                           
               
                  SalesList.findOne({'salesPerson':salesPerson})
                  .then(user =>{
                      if(user){ 
                    // req.session.errors = errors
                      //req.success.user = false;
                  
                  
                  
                      req.flash('danger', 'Item already in the system');
                  
                      res.redirect('/addSales')
                  }
                  else{
                  
                  
                  
                  
                          
                  var product = new SalesList();
                  product.salesPerson = salesPerson;
                  product.driver = driver;
                  product.type = type
                  
                  product.save()
                    .then(user =>{
                  
                  

                      req.flash('success', 'Sales Person added Successfully!');

                      res.redirect('/addSales')  

                    })
                  
                  }
                  
                  })
                  
                  
                  
                  
                  }     
                                 
                                     
                   
                                  
                                    
                                    
                        
                                   
                        
                
                 
                  

                  
})


//import drivers

router.get('/importDrivers',isLoggedIn,function(req,res){
  var pro = req.user
  var errorMsg = req.flash('danger')[0];
  var successMsg = req.flash('success')[0];
  res.render('imports/drivers',{pro:pro,successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg})
})






router.post('/importDrivers',isLoggedIn,uploadX.single('file'),  (req,res)=>{
 
 

/*  if(!req.file){
      req.session.message = {
        type:'errors',
        message:'Select File!'
      }     
        res.render('imports/students', {message:req.session.message,pro:pro}) */
   if (!req.file || req.file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
          req.session.message = {
              type:'errors',
              message:'Upload Excel File'
            }     
              res.render('imports/drivers', {message:req.session.message,pro:pro
                   
               }) 



      }
        
      else{
   

      
         const file = req.file.filename;
  
          
              var wb =  xlsx.readFile('./public/uploads/' + file)

           
       
               var sheets = wb.Sheets;
               var sheetNames = wb.SheetNames;
   
               var sheetName = wb.SheetNames[0];
   var sheet = wb.Sheets[sheetName ];
   
      for (var i = 0; i < wb.SheetNames.length; ++i) {
       var sheet = wb.Sheets[wb.SheetNames[i]];
   
       console.log(wb.SheetNames.length)
       var data =xlsx.utils.sheet_to_json(sheet)
           
       var newData = data.map(function (record){
   
      
     
    
        
       
      
         
        
          let driver = record.driver;
         

          req.body.driver = record.driver

//req.body.photo = record.photo          

          
      
          
            req.check('driver','Enter Driver').notEmpty();
            //req.check('name','Enter Name').notEmpty();
        
            
            var errors = req.validationErrors();

            if (errors) {
              
              req.session.errors = errors;
              req.session.success = false;
              req.flash('danger', req.session.errors[0].msg);
     
      
              res.redirect('/importDrivers');
            
        }
else


{
Drivers.findOne({'driver':driver})
.then(user =>{
    if(user){ 
  // req.session.errors = errors
    //req.success.user = false;



    req.flash('danger', 'Item already in the system');

    res.redirect('/importDrivers')
}
else{




        
var product = new Drivers();

product.driver = driver;

product.save()
  .then(user =>{


  })

}

})




}     
               
                   
 
                  // .catch(err => console.log(err))
           
               
                  })
                
                  req.flash('success', 'File Successfully!');

                  res.redirect('/importDrivers')  
       
                }
                
                
                  
                  
      
                 
      
                  
           
              }
    
      


})







router.get('/addDrivers',function(req,res){

  var errorMsg = req.flash('danger')[0];
  var successMsg = req.flash('success')[0];
  res.render('kambucha/addDriver',{successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg})



})



router.post('/addDrivers', function(req,res){
  var m = moment()

  var year = m.format('YYYY')
  var dateValue = m.valueOf()



var date = m.format('L')
                    
     
          let driver = req.body.driver;
       
         
              
          
                 
                req.check('driver','Enter Driver').notEmpty();
               
          
              
                
                      
                   
                var errors = req.validationErrors();
                    if (errors) {
                
                    
                      req.session.errors = errors;
                      req.session.success = false;
                      req.flash('danger', req.session.errors[0].msg);
         
          
                  res.redirect('/addDrivers');
                      
                    
                  }
                  else{
                
                
                           
               
                    Drivers.findOne({'driver':driver})
                  .then(user =>{
                      if(user){ 
                    // req.session.errors = errors
                      //req.success.user = false;
                  
                  
                  
                      req.flash('danger', 'Item already in the system');
                  
                      res.redirect('/addDrivers')
                  }
                  else{
                  
                  
                  
                    var product = new Drivers();

                    product.driver = driver;
                    
                    product.save()
                      .then(user =>{
                    
                        req.flash('success', 'Driver added Successfully!');

                        res.redirect('/addDrivers')  
  
                      })
                  }
                  
                  })
                  
                  
                  
                  
                  }     
                                 
                                     
                   
                                  
                                    
                                    
                        
                                   
                        
                
                 
                  

                  
})







router.get('/importTrucks',function(req,res){
  var pro = req.user
  res.render('imports/trucks',{pro:pro})
})



router.post('/importTrucks', uploadX.single('file'),  (req,res)=>{
 
  if (!req.file || req.file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
    req.session.message = {
        type:'errors',
        message:'Upload Excel File'
      }     
        res.render('imports/trucks', {message:req.session.message,pro:pro
             
         }) 



}
  
else{



   const file = req.file.filename;

    
        var wb =  xlsx.readFile('./public/uploads/' + file)

     
 
         var sheets = wb.Sheets;
         var sheetNames = wb.SheetNames;

         var sheetName = wb.SheetNames[0];
var sheet = wb.Sheets[sheetName ];

for (var i = 0; i < wb.SheetNames.length; ++i) {
 var sheet = wb.Sheets[wb.SheetNames[i]];

 console.log(wb.SheetNames.length)
 var data =xlsx.utils.sheet_to_json(sheet)
     
 var newData = data.map(function (record){




  
 

   
    let truckNo = record.truckNo
    let driver = record.driver;
    let make = record.make;
    let weight = record.weight

req.body.truckNo = record.truckNo
req.body.driver = record.driver
req.body.make = record.make
req.body.weight = record.weight


//req.body.photo = record.photo          

    

    
      req.check('truckNo','Enter Truck No').notEmpty();
      //req.check('name','Enter Name').notEmpty();
  
      
      var errors = req.validationErrors();

      if (errors) {
        
        req.session.errors = errors;
        req.session.success = false;
        req.flash('danger', req.session.errors[0].msg);


        res.redirect('/importTrucks');
      
  }
else


{
Truck.findOne({'truckNo':truckNo})
.then(user =>{
if(user){ 
// req.session.errors = errors
//req.success.user = false;



req.flash('danger', 'Item already in the system');

res.redirect('/importTrucks')
}
else{




  
var product = new Truck();
product.truckNo = truckNo;
product.driver = driver;
product.make = make;
product.weight = weight;

product.save()
.then(user =>{


})

}

})




}     
         
             

            // .catch(err => console.log(err))
     
         
            })
          
            req.flash('success', 'File Successfully!');

            res.redirect('/importTrucks')  
 
          }
          
          
            
            

           

            
     
        }


})


///////////

router.get('/addTrucks',function(req,res){

  var errorMsg = req.flash('danger')[0];
  var successMsg = req.flash('success')[0];
  res.render('kambucha/addTruck',{successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg})



})



router.post('/addTrucks', function(req,res){
  var m = moment()

  var year = m.format('YYYY')
  var dateValue = m.valueOf()



var date = m.format('L')
                    
     
         
    let truckNo = req.body.truckNo
   /* let driver = req.body.driver;
    let make = req.body.make;
    let weight = req.body.weight*/
       
         
              
          
                req.check('truckNo','Enter Truck').notEmpty();
                   
          
              
                
                      
                   
                var errors = req.validationErrors();
                    if (errors) {
                
                    
                      req.session.errors = errors;
                      req.session.success = false;
                      req.flash('danger', req.session.errors[0].msg);
         
          
                  res.redirect('/addTrucks');
                      
                    
                  }
                  else{
                
                
                           
               
                    Truck.findOne({'truckNo':truckNo})
                  .then(user =>{
                      if(user){ 
                    // req.session.errors = errors
                      //req.success.user = false;
                  
                  
                  
                      req.flash('danger', 'Item already in the system');
                  
                      res.redirect('/addTrucks')
                  }
                  else{
                  
                  
                  
                    var product = new Truck();
                    product.truckNo = truckNo;
            
                    
                    product.save()
                    .then(user =>{
                    
                      req.flash('success', 'Truck added Successfully!');

                      res.redirect('/addTrucks')  

                    })
                  }
                  
                  })
                  
                  
                  
                  
                  }     
                                 
                                     
                   
                                  
                                    
                                    
                        
                                   
                        
                
                 
                  

                  
})











router.get('/addInvoNum',function(req,res){
  
  res.render('kambucha/invoNum2')
})

router.post('/addInvoNum',function(req,res){

  var invoiceNumber = req.body.invoiceNumber;
  //var idNumber = req.body.idNumber;
  
 
      req.check('invoiceNumber','Enter Invoice Number').notEmpty().isNumeric();
      //req.check('idNumber','Enter ID Number').notEmpty().isNumeric();

    
      
      var errors = req.validationErrors();
           
      if (errors) {
      
        req.session.errors = errors;
        req.session.success = false;
        res.render('kambucha/invoNum2',{ errors:req.session.errors,})
      
    }
    else{
      
      InvoNum.findOne({'num':invoiceNumber})
        .then(dept =>{
            if(dept){ 
  
           req.session.message = {
            type:'errors',
             message:'Number already exists'
           }     
              res.render('kambucha/invoNum2', {
                 message:req.session.message ,
              })
            }else{

          
    
      var num = new InvoNum();
    
      num.num = invoiceNumber;
     
     
   
    
    
      num.save()
        .then(dep =>{
         
          req.session.message = {
            type:'success',
            message:'Number added'
          }  
          res.render('kambucha/invoNum2',{message:req.session.message,});
      
    
      })
    
     }
      
      
      })
    }
    
    
})










router.get('/addRefNum',function(req,res){
  
  res.render('kambucha/invoNum')
})

router.post('/addRefNum',function(req,res){

  var refNumber = req.body.refNumber;
  //var idNumber = req.body.idNumber;
  
 
      req.check('refNumber','Enter Ref Number').notEmpty().isNumeric();
      //req.check('idNumber','Enter ID Number').notEmpty().isNumeric();

    
      
      var errors = req.validationErrors();
           
      if (errors) {
      
        req.session.errors = errors;
        req.session.success = false;
        res.render('kambucha/invoNum',{ errors:req.session.errors,})
      
    }
    else{
      
      RefNoSeq.findOne({'num':refNumber})
        .then(dept =>{
            if(dept){ 
  
           req.session.message = {
            type:'errors',
             message:'Number already exists'
           }     
              res.render('kambucha/invoNum', {
                 message:req.session.message ,
              })
            }else{

          
    
      var num = new RefNoSeq();
    
      num.num = refNumber;
     
     
   
    
    
      num.save()
        .then(dep =>{
         
          req.session.message = {
            type:'success',
            message:'Number added'
          }  
          res.render('kambucha/invoNum',{message:req.session.message,});
      
    
      })
    
     }
      
      
      })
    }
    
    
})








router.get('/addRefNum2',function(req,res){
  
  res.render('kambucha/invoNum2')
})

router.post('/addRefNum2',function(req,res){

  var num = req.body.invoiceNumber;
  //var idNumber = req.body.idNumber;
  
 
      req.check('invoiceNumber','Enter Ref Number').notEmpty().isNumeric();
      //req.check('idNumber','Enter ID Number').notEmpty().isNumeric();

    
      
      var errors = req.validationErrors();
           
      if (errors) {
      
        req.session.errors = errors;
        req.session.success = false;
        res.render('kambucha/invoNum2',{ errors:req.session.errors,})
      
    }
    else{
      
      RefNoSeqDisp.findOne({'num':num})
        .then(dept =>{
            if(dept){ 
  
           req.session.message = {
            type:'errors',
             message:'Number already exists'
           }     
              res.render('kambucha/invoNum2', {
                 message:req.session.message ,
              })
            }else{

          
    
      var seq = new RefNoSeqDisp();
    
      seq.num = num;
     
     
   
    
    
      seq.save()
        .then(dep =>{
         
          req.session.message = {
            type:'success',
            message:'Number added'
          }  
          res.render('kambucha/invoNum2',{message:req.session.message,});
      
    
      })
    
     }
      
      
      })
    }
    
    
})


router.get('/salesList',isLoggedIn,function(req,res){
  SaleStock.find(function(err,docs){
    res.render('sales/salesList',{listX:docs})
  })
})

router.get('/updateStock/:id',isLoggedIn,function(req,res){
  var id = req.params.id
res.render('sales/update',{id:id})
})


router.post('/updateStock/:id',isLoggedIn,function(req,res){
  var id = req.params.id
  var cases = req.body.cases
  console.log(cases,'cases')
  SaleStock.findByIdAndUpdate(id,{$set:{holdingCases:cases}},function(err,docs){

    res.redirect('/salesList')
  })

})




router.get('/addVouNum',function(req,res){
  
  res.render('kambucha/invoNum3')
})

router.post('/addVouNum',function(req,res){

  var voucherNumber = req.body.voucherNumber;
  //var idNumber = req.body.idNumber;
  
 
      req.check('voucherNumber','Enter Voucher Number').notEmpty().isNumeric();
      //req.check('idNumber','Enter ID Number').notEmpty().isNumeric();

    
      
      var errors = req.validationErrors();
           
      if (errors) {
      
        req.session.errors = errors;
        req.session.success = false;
        res.render('kambucha/invoNum3',{ errors:req.session.errors,})
      
    }
    else{
      
      VoucherNum.findOne({'num':voucherNumber})
        .then(dept =>{
            if(dept){ 
  
           req.session.message = {
            type:'errors',
             message:'Number already exists'
           }     
              res.render('kambucha/invoNum3', {
                 message:req.session.message ,
              })
            }else{

          
    
      var num = new VoucherNum();
    
      num.num = voucherNumber;
     
     
   
    
    
      num.save()
        .then(dep =>{
         
          req.session.message = {
            type:'success',
            message:'Number added'
          }  
          res.render('kambucha/invoNum3',{message:req.session.message,});
      
    
      })
    
     }
      
      
      })
    }
    
    
})














router.get('/info',function(req,res){
  res.render('kambucha/setup')
})


router.get('/newItem2',function(req,res){
    res.render('kambucha/newItem')
  })


  
router.get('/newItem',function(req,res){

  var errorMsg = req.flash('danger')[0];
  var successMsg = req.flash('success')[0];
  res.render('kambucha/newItem2',{successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg})


})

  

  router.post('/newItem',upload.single('file'), function(req,res){
  var goods = req.body.goods
  var service = req.body.service
  var name = req.body.name
  //var barcodeNumber = req.body.barcodeNumber
  var upc = req.body.upc
  var usd = req.body.usd
  var category = req.body.category
  var description = req.body.description
  

console.log(goods,service,name,upc,usd,req.file.filename,'var')
 
    var m = moment()
    var year = m.format('YYYY')
    var dateValue = m.valueOf()
    if (!req.file){
      req.flash('danger', 'Select Picture');

      res.redirect('/newItem');



  }
  
      var date = m.format('L')
      req.check('name','Enter Product Name').notEmpty();
      req.check('upc','Enter UPC').notEmpty();
    
      var errors = req.validationErrors();
     
      if (errors) {
    
        req.session.errors = errors;
        req.session.success = false;
        //res.render('hurlings/students/admit',{ errors:req.session.errors, arr1:arr1,pro:pro})

        req.flash('danger', req.session.errors[0].msg);
     
      
        res.redirect('/newItem');

      
    }
    else
  
   {
      Product.findOne({'name':name})
      .then(user =>{
          if(user){ 
        // req.session.errors = errors
          //req.success.user = false;
            
    req.flash('danger', 'Product already exists');

    res.redirect('/newItem');
    }
    
    
      
      else{
  
      var book = new Product();
      book.name = name
      book.barcodeNumber= upc
      book.category = 'drinks'
      book.subCategory = category
      book.quantity = 0
      book.openingQuantity = 0
      book.rcvdQuantity = 0
      book.unitCases = 12
      book.description= description
      book.photo = req.file.filename
      book.type='goods'
      book.account = 'sales'
      book.cases =0
      book.size = 0
      book.rate = 0
      book.zwl = 0
      book.usd = usd
      book.rand = 0
      book.price3 = 0
  
          
           
            book.save()
              .then(pro =>{
    
             
                req.flash('success', 'Product Added Successfully');
   
                res.redirect('/newItem');
             
              
            
            })
          }
          

        })
      
        }
    
    //res.redirect('/newItem')

    
    })
  
/*    router.get('/receiveStock',isLoggedIn,function(req,res){
      var date = req.user.date
      var shift = req.user.shift
      var warehouse = req.user.warehouse
      var product = req.user.product
      var refNumber = req.user.refNumber
      var pro = req.user
      Product.find(function(err,docs){
       res.render('kambucha/addStock2',{listX:docs,date:date,shift:shift,
      product:product,refNumber:refNumber,warehouse:warehouse,pro:pro})
      })
    
     })*/


  


  router.post('/receiveStock',isLoggedIn, function(req,res){
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
         
          
     res.redirect('/receiveStock');
    
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


  router.get('/customer',function(req,res){

    
  var errorMsg = req.flash('danger')[0];
  var successMsg = req.flash('success')[0];
  res.render('kambucha/addCustomer',{successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg})

  })


  router.post('/customer', function(req,res){
    var salutation= req.body.salutation
    var firstName = req.body.firstName
    var lastName = req.body.lastName
    //var barcodeNumber = req.body.barcodeNumber
    var companyName = req.body.companyName
    var email = req.body.email
    var mobile = req.body.mobile
    var mobile2 = req.body.mobile2
    var address = req.body.address
    var town = req.body.town
    var city = req.body.city
    var country = req.body.country

    
  

   
      var m = moment()
      var year = m.format('YYYY')
      var dateValue = m.valueOf()
      /*if (!req.file){
        req.flash('danger', 'Select Picture');
  
        res.redirect('/newItem');
  
  
  
    }*/
    
        var date = m.format('L')
        req.check('firstName','Enter FirstName').notEmpty();
        req.check('lastName','Enter LastName ').notEmpty();
        req.check('companyName','Enter Company ').notEmpty();
        req.check('email','Enter Email ').notEmpty();
        req.check('mobile','Enter Work Phone ').notEmpty();
        req.check('mobile2','Enter Mobile Phone ').notEmpty();
        req.check('address','Enter Address').notEmpty();
        req.check('town','Enter Town ').notEmpty();
        req.check('city','Enter City').notEmpty();
        req.check('country','Enter Country').notEmpty();
       
        var errors = req.validationErrors();
       
        if (errors) {
      
          req.session.errors = errors;
          req.session.success = false;
          //res.render('hurlings/students/admit',{ errors:req.session.errors, arr1:arr1,pro:pro})
  
          req.flash('danger', req.session.errors[0].msg);
       
        
          res.redirect('/customer');
  
        
      }
      else
    
     {
        Customer.findOne({'email':email})
        .then(user =>{
            if(user){ 
          // req.session.errors = errors
            //req.success.user = false;
              
      req.flash('danger', 'Customer already exists');
  
      res.redirect('/customer');
      }
      
      
        
        else{
    
        var book = new Customer();
        book.salutation = salutation
        book.firstName= firstName
        book.lastName = lastName
        book.companyName = companyName
        book.email = email
        book.mobile = mobile
        book.mobile2 = mobile2
        book.address = address
        book.town= town
        book.city = city
        book.country=country
      
            
             
              book.save()
                .then(pro =>{
      
               
                  req.flash('success', 'Cutomer Added Successfully');
     
                  res.redirect('/customer');
               
                
              
              })
            }
            
  
          })
        
          }
      
      //res.redirect('/newItem')
  
      
      })




      
  router.get('/customerModal',isLoggedIn,function(req,res){

    
    var errorMsg = req.flash('danger')[0];
    var successMsg = req.flash('success')[0];
    res.render('kambucha/invoice',{successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg})
  
    })
  
  
    router.post('/customerModal',isLoggedIn, function(req,res){
      var salutation= "Mr"
      var firstName = req.body.firstName
      var lastName = req.body.lastName
      //var barcodeNumber = req.body.barcodeNumber
      var companyName = req.body.companyName
      var email = req.body.email
      var mobile = req.body.mobile
      var mobile2 = req.body.mobile2
      var address = req.body.address
      var town = req.body.town
      var city = req.body.city
      var country = req.body.country
  
      
    
  
     
        var m = moment()
        var year = m.format('YYYY')
        var dateValue = m.valueOf()
        /*if (!req.file){
          req.flash('danger', 'Select Picture');
    
          res.redirect('/newItem');
    
    
    
      }*/
      
          var date = m.format('L')
          req.check('firstName','Enter FirstName').notEmpty();
          req.check('lastName','Enter LastName ').notEmpty();
          req.check('companyName','Enter Company ').notEmpty();
          req.check('email','Enter Email ').notEmpty();
          req.check('mobile','Enter Work Phone ').notEmpty();
          req.check('mobile2','Enter Mobile Phone ').notEmpty();
          req.check('address','Enter Address').notEmpty();
          req.check('town','Enter Town ').notEmpty();
          req.check('city','Enter City').notEmpty();
          req.check('country','Enter Country').notEmpty();
         
          var errors = req.validationErrors();
         
          if (errors) {
        
            req.session.errors = errors;
            req.session.success = false;
            //res.render('hurlings/students/admit',{ errors:req.session.errors, arr1:arr1,pro:pro})
    
            req.flash('danger', req.session.errors[0].msg);
         
          
            res.redirect('/invoice');
    
          
        }
        else
      
       {
          Customer.findOne({'email':email})
          .then(user =>{
              if(user){ 
            // req.session.errors = errors
              //req.success.user = false;
                
        req.flash('danger', 'Customer already exists');
    
        res.redirect('/invoice');
        }
        
        
          
          else{
      
          var book = new Customer();
          book.salutation = salutation
          book.firstName= firstName
          book.lastName = lastName
          book.companyName = companyName
          book.email = email
          book.mobile = mobile
          book.mobile2 = mobile2
          book.address = address
          book.town= town
          book.city = city
          book.country=country
        
              
               
                book.save()
                  .then(pro =>{
        
                 
                    req.flash('success', 'Cutomer Added Successfully');
       
                    res.redirect('/invoice');
                 
                  
                
                })
              }
              
    
            })
          
            }
        
        //res.redirect('/newItem')
    
        
        })
  


      router.get('/custAuto',function(req,res){
        console.log('dog day')
        Customer.find(function(err,docs){
          res.send(docs)
        })
      })


      router.post('/custAuto2',function(req,res){
      let  code = req.body.code
      console.log(code)
        Customer.find({companyName:code}, function(err,docs){
          console.log(docs,'docs')
          res.send(docs[0])
        })
      })
  


      /*router.get('/proAuto',function(req,res){
        console.log('product day')
       Product.find(function(err,docs){
          res.send(docs)
        })
      })*/

      router.post('/proAuto',function(req,res){
        console.log('product day')
        let salesPerson = req.body.code
       SaleStock.find({salesPerson:salesPerson},function(err,docs){
         console.log(docs,'docsPro')
          res.send(docs)
        })
      })

      router.post('/proAutoV',function(req,res){
        let  code = req.body.code
        console.log(code)
          Product.find({name:code}, function(err,docs){
            console.log(docs,'docs')
            res.send(docs[0])
          })
        })
    
        router.post('/proAuto2',function(req,res){
          let  code = req.body.code
          console.log(code,'codePro')
           Product.find({name:code}, function(err,docs){
              console.log(docs,'docs')
              res.send(docs[0])
            })
          })
      
  router.get('/quote',function(req,res){
    res.render('kambucha/addQuote')
  })
  
  router.get('/priceList',function(req,res){
    res.render('kambucha/priceList')
  })
  
  router.get('/viewItem',function(req,res){
    res.render('kambucha/viewItem')
  })
  
  router.get('/item',function(req,res){
    res.render('kambucha/items')
  })
  
  router.get('/item2',function(req,res){
    res.render('kambucha/item2')
  })




  router.get('/summary',function(req,res){
    res.render('kambucha/stockSummary')
  })

  router.get('/summaryTable',function(req,res){
    res.render('kambucha/stockSummaryT2')
  })



  router.get('/invoiceNumberUpdate',isLoggedIn,function(req,res){
    var id = req.user._id
   
      InvoNum.find(function(err,doc){
        let invoiceNum = doc[0].num
        let invoId = doc[0]._id
    
    
    User.findByIdAndUpdate(id,{$set:{invoiceNumber:invoiceNum}},function(err,docs){
    
    })
    invoiceNum++
    
    InvoNum.findByIdAndUpdate(invoId,{$set:{num:invoiceNum}},function(err,tocs){
    
    })

    res.redirect('/invoice')
    
      })
    
    })


  router.get('/invoice',isLoggedIn,function(req,res){
    var invoiceNumber = req.user.invoiceNumber
    var salesPerson = req.user.fullname
    console.log(invoiceNumber,'invoiceNumber')
    res.render('kambucha/invoice',{invoiceNumber:invoiceNumber,salesPerson:salesPerson})
  })

  router.post('/invoice',isLoggedIn,function(req,res){
    //console.log(req.body)
    //res.render('kambucha/invoice')
    var m = moment()
    let number1
    let subtotal
    let arr16 = []
    let ar1 =[]
    let ar2 = []
    let ar3 = []
    let ar4 = []
    let salesPersonId = req.user.username
    var invoiceNumber = req.user.invoiceNumber
    var month = m.format('MMMM')
    let dateValue = m.valueOf()
    var year = m.format('YYYY')
    var mformat = m.format('L')
var company = req.body.company
var address = req.body.address
var clientName = req.body.clientName
var salesPerson = req.user.fullname
console.log(company,address,clientName,'print')
var salesPerson = req.body.salesPerson


req.check('company','Enter Company Name').notEmpty();
       
var errors = req.validationErrors();

if (errors) {

  req.session.errors = errors;
  req.session.success = false;
  //res.render('hurlings/students/admit',{ errors:req.session.errors, arr1:arr1,pro:pro})

  req.flash('danger', req.session.errors[0].msg);


  res.redirect('/invoice');


}else{


ar1.push(req.body['product[]'])
ar2.push(req.body['quantity[]'])
ar3.push(req.body['price[]'])
ar4.push(req.body['stock[]'])

  


    

ar1 = ar1.filter(v=>v!='')
ar2 = ar2.filter(v=>v!='')
ar3 = ar3.filter(v=>v!='')
ar4 = ar4.filter(v=>v!='')

console.log(ar1,'iwee1')
console.log(ar2,'iwee2')
console.log(ar3,'iwee3')
console.log(ar4,'iwee4')
for(var i = 0; i<ar1.length;i++){
  console.log(ar1[i])
  let code = ar1[i]
  

  console.log(ar3[i],ar4[i],'qty')
if(ar2[i]>ar4[i]){
  console.log('not enough stock')

  req.session.message = {
    type:'errors',
    message:'Stock not enough you are left with'+' '+ar4[i]+' '+'unit(s)'+' '+'of'+' '+ar1[i]
  }
  res.render('kambucha/invoice',{user:req.body, message:req.session.message})



}else{





var book = new InvoiceSubBatch();
  book.item = ar1[i]
  book.itemId = invoiceNumber
  book.clientCompany = company
  book.address = address
  book.clientName = clientName
  book.salesPerson = salesPerson
  book.salesPersonId = salesPersonId
  book.qty = 0
  book.price = 0
  book.total = 0
  book.month = month
  book.year = year
  book.date = mformat
  book.invoiceNumber = invoiceNumber

  book.status = 'not saved'

  book.type = "Invoice"

  book.size = i
  book.subtotal = 0
 


      
       
        book.save()
          .then(title =>{
//let client = title.clientName
let subtotal = 0
let pId = title._id
console.log(pId,"idd")

let size = title.size

console.log(size,'size')
let qty1 = ar2[size]
let price1 = ar3[size]

let reg = /\d+\.*\d*/g;
let resultQty = qty1.match(reg)
let qty = Number(resultQty)


let resultPrice = price1.match(reg)
let price = Number(resultPrice)

console.log(qty,price,'blow minds')
let total = qty * price
subtotal = subtotal + total
InvoiceSubBatch.findByIdAndUpdate(pId,{$set:{qty:qty,price:price,total:total,subtotal:subtotal}},function(err,ocs){
      
      })

     

          })

        }  
              
}


res.redirect('/subtotalUpdateX') 
}


  })

router.get('/subtotalUpdateX',function(req,res){

  res.redirect('/subtotalUpdateXX')
})
  
router.get('/subtotalUpdateXX',isLoggedIn,function(req,res){
  var invoiceNumber = req.user.invoiceNumber
  //console.log(invoiceNumber,'invoooo')
  let number1
  let subtotal
  let arr16 = []
  InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,hods){
  console.log(hods,'hods')
    for(var i = 0;i<hods.length; i++){
        console.log(hods[i].total,'serima')
      arr16.push(hods[i].total)
        }
        //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
       //console.log(arr16,'arr16')
  
   //InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
    number1=0;
    for(var z in arr16) { number1 += arr16[z]; }
  for(var i = 0;i <hods.length;i++){
    let id =  hods[i]._id
    //console.log(number1,'number1')
    InvoiceSubBatch.findByIdAndUpdate(id,{$set:{subtotal:number1}},function(err,focs){
  
    })
  }
  //})
  
  //aggVouchers
  
  //res.redirect('/invoiceSubFile')
  res.redirect('/subtotalUpdate')
       
  })
  
  })  


  
router.get('/subtotalUpdate',isLoggedIn,function(req,res){
  var invoiceNumber = req.user.invoiceNumber
  //console.log(invoiceNumber,'invoooo')
  let number1
  let subtotal
  let arr16 = []
  InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,hods){
  console.log(hods,'hods')
    for(var i = 0;i<hods.length; i++){
       // console.log(hods[i].total,'serima')
      arr16.push(hods[i].total)
        }
        //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
       //console.log(arr16,'arr16')
  
   //InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
    number1=0;
    for(var z in arr16) { number1 += arr16[z]; }
  for(var i = 0;i <hods.length;i++){
    let id =  hods[i]._id
    //console.log(number1,'number1')
    InvoiceSubBatch.findByIdAndUpdate(id,{$set:{subtotal:number1}},function(err,focs){
  
    })
  }
  //})
  
  //aggVouchers
  
  //res.redirect('/invoiceSubFile')
  res.redirect('/updateStockSaleInvo')
       
  })
  
  }) 


  


router.get('/updateStockSaleInvo',isLoggedIn,function(req,res){
  let arrV = []
  var invoiceNumber = req.user.invoiceNumber
let salesPerson = req.user.fullname
  InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){

  for(var i = 0;i<docs.length;i++){

  
let product = docs[i].item
let qtyV = docs[0].qty / 12
let qty = docs[0].qty


    SaleStock.find({salesPerson:salesPerson,product:product},function(err,locs){

      let cases = locs[0].holdingCases - qtyV
      let qty2 = locs[0].qty - qty
      let id = locs[0]._id

      SaleStock.findByIdAndUpdate(id,{$set:{holdingCases:cases,qty:qty2}},function(err,vocs){

      })

    })

  }

  res.redirect('/invoiceSubFile')
  })

})




  router.get('/invoiceSubFile',isLoggedIn,function(req,res){
 let invoiceNumber = req.user.invoiceNumber
  InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
  //console.log(docs,'docv')
    for(var i = 0; i<docs.length;i++){
      let item = docs[i].item
      let code = docs[i].itemId
      let qty = docs[i].qty
      let price = docs[i].price
      let total = docs[i].total
      let clientCompany = docs[i].clientCompany
      let clientAddress = docs[i].clientAddress
      let clientName = docs[i].clientName
      let date = docs[i].date
      let month = docs[i].month
      let year = docs[i].year
      let salesPerson = docs[i].salesPerson
      let salesPersonId = docs[i].salesPersonId
      /*let month = docs[i].month
      let year = docs[i].year
      let date = docs[i].date*/
      let subtotal = docs[i].subtotal
  
     

  
          var invo = new InvoiceSubFile();
       
          invo.invoiceNumber = invoiceNumber
          invo.item =item
          invo.code = code
          invo.qty = qty
          invo.price = price
          invo.total = total
          invo.clientCompany = clientCompany
          invo.clientAddress = clientAddress
          invo.clientName = clientName
          invo.date = date
          invo.month = month
          invo.year = year
          invo.salesPerson = salesPerson
          invo.salesPersonId = salesPersonId
          /*invo.month = month
          invo.year = year
          invo.date = date*/
      
          invo.subtotal = subtotal
          
          invo.save()
    .then(user =>{
     
     
   
  
      })
  
    }
   // res.redirect('/arrInvoiceSubUpdate')
   res.redirect('/viewInvo2')
  })
  
  
  })





  router.get('/viewInvo2',isLoggedIn,function(req,res){
    var invoiceNumber = req.user.invoiceNumber
    InvoiceSubFile.find({invoiceNumber:invoiceNumber},function(err,docs){

     // console.log(docs,'ok')
      //res.render('kambucha/pdf',{listX:docs})

      res.redirect('/viewInvoice/'+invoiceNumber)
    })
 
  })



  router.get('/viewInvoice/:id',isLoggedIn,function(req,res){
    var invoiceNumber = req.params.id
    var salesPersonId = req.user.username
    InvoiceSubFile.find({salesPersonId:salesPersonId},function(err,locs){

    InvoiceSubFile.find({invoiceNumber:invoiceNumber},function(err,docs){

     // console.log(docs,'ok')
      res.render('kambucha/pdf',{listX:docs,listX2:locs})
    })
    })
 
  })


  router.get('/salesPdf',function(req,res){
    res.render('kambucha/salesInvoice')
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
    

    res.redirect('/fifoDateUpdate')
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
  res.redirect('/palletUpdate')
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
    

      res.redirect('/batchDispatch')
  })
  })

  router.get('/batch',isLoggedIn,function(req,res){
    var pro = req.user
    res.render('kambucha/batch',{pro:pro})
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
      res.redirect('/receiveStock/'+refNo)

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
     res.render('kambucha/addStock2',{listX:docs,date:date,shift:shift,
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




    router.post('/receiveScan',isLoggedIn, function(req,res){
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
  
  
  
    


router.get('/closeBatch/:id',function(req,res){
  let id = req.params.id
  console.log(id,'idBatch')

  StockV.find({refNumber:id},function(err,docs){
  //  console.log(docs,'docs')
    var productChunks = [];
    var chunkSize = 10;
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
    res.redirect('/batch')

  })
})



router.get('/replace',function(req,res){
  res.render('kambucha/batchReplace')
})


router.post('/replace',function(req,res){
  var barcodeNumber = req.body.code
  var barcodeNumber1 = req.body.code1
  var reason = req.body.reason
  console.log(reason,'reason5')
  var arr3 = ['1','2','3']
  var arr4 =['1','2','3','4']
  var arr5 =['1','2','3','4','5']
  var arr6 =['1','2','3','4','5','6']
  var arr7 =['1','2','3','4','5','6','7']
  var arr0 =[]
  let id
  var arr1 =['1']
  StockV.find({barcodeNumber:barcodeNumber},function(err,docs){
if(docs.length > 0){
  //console.log(docs,'docs')
  let status = docs[0].status
  if(status == 'dispatched' || status == 'received' ){
    id = docs[0]._id
      
    let refNumber = docs[0].refNumber
    let pallet = docs[0].pallet
  

    StockV.find({barcodeNumber:barcodeNumber1},function(err,locs){
      if(locs.length > 0){
let status2 = locs[0].status
if(status2 == 'received'){

  let id2 = locs[0]._id
 console.log(id,'stooge')
  StockV.findByIdAndUpdate(id,{$set:{status:reason,replacementCase:barcodeNumber1,returnsType:'warehouse',type:'replaced'}},function(err,vocs){

  })
  StockV.findByIdAndUpdate(id2,{$set:{pallet:pallet,refNumber:refNumber,status:'dispatched',type:'replacement',replacedBarcode:barcodeNumber}},function(err,vocs){ 
    if(!err){
      res.send(arr1)
    }

  })
}else{
  res.send(arr3)
}
      }else{
        res.send(arr4)
      }
    })
    

  }
}else{
  res.send(arr0)
}
  })
})


router.get('/warehouseRtns',function(req,res){
  StockV.find({returnsType:"warehouse"},function(err,docs){

    res.render('kambucha/warehouseRtns',{listX:docs})
  })
})
  router.get('/batchDispatch',isLoggedIn,function(req,res){
    /*var errorMsg = req.flash('danger')[0];
  var successMsg = req.flash('success')[0];*/
  var pro = req.user
  var readonly = 'hidden'
  var read =''

  SalesList.find(function(err,nocs){
  Truck.find(function(err,vocs){
  BatchR.find({status:'received'}).lean().sort({fifoPosition:1}).then(docs=>{
  var arr = docs
  var arr1 = nocs
  var arr2 = vocs
  res.render('kambucha/batchDisp',{arr:arr,pro:pro,user:req.query,readonly:readonly,read:read,arr1:arr1,arr2:arr2})
  })
  })
})
   
  })


  ////////////////

  router.post('/batchDispatch',isLoggedIn,function(req,res){

    //var refNumber = req.body.referenceNumber
    var m = moment()
    var year = m.format('YYYY')
    var month = m.format('MMMM')
    var date = req.body.date
    let mformat =  moment(date).format('l');
    let dateValue = moment(date).valueOf()
    var dispatcher = req.user.fullname
    var time = req.body.time
    //var warehouse = req.body.warehouse
    var number1 
  var product = req.body.product
    var salesPerson = req.body.salesPerson
    var truck = req.body.truck
    var casesX = req.body.cases
    
let reg = /\d+\.*\d*/g;
let resultCases = casesX.match(reg)
let cases = Number(resultCases)
    var destination = req.body.destination
    var read = 'readonly'
    var arr16 = []
    //var refNumber = req.body.refNumber
    var reason = req.body.reason
    var readF2 = 'disabled'
    var casesBatch = cases
    console.log(reason,'reason')
   // var lotNumber = req.body.lotNumber
    //var location = req.body.location
  var readonly = ''
  var stock = req.body.stock
  var readF = 'hidden'
    let date6 =  moment(date).format('l');
  let code
  //let shift = req.user.shift
   let date7 =  date6.replace(/\//g, "");
  
    console.log(date6,'date')

    
  
 
    req.check('date','Enter Date').notEmpty();
    req.check('time','Enter Time').notEmpty();
    req.check('truck','Enter Truck').notEmpty();
    req.check('cases','Enter Cases To Be Dispatched').notEmpty();
    req.check('salesPerson','Enter Sales Person').notEmpty();

   
    
  
    
    
    var errors = req.validationErrors();
     
    if (errors) {
  
      req.session.errors = errors;
      req.session.success = false;
     // res.render('product/stock',{ errors:req.session.errors,pro:pro})
     /*req.flash('danger', req.session.errors[0].msg);
     res.redirect('/batchDispatch');*/
     /*BatchR.find({status:'received'}).lean().sort({fifoPosition:1}).then(docs=>{
      var arr = docs*/
  
      res.render('kambucha/batchDisp',{user:req.body, use:req.user,errors:req.session.errors,readonly:readonly})

    // })
    
    }else{


   



         if(stock < cases){
  
         
         /* BatchR.find({status:'received'}).lean().sort({fifoPosition:1}).then(docs=>{
            var arr = docs*/
          req.session.message = {
            type:'errors',
            message:stock+' '+'cases Left for '+' '+product
          }
          res.render('kambucha/batchDisp',{user:req.body, use:req.user,message:req.session.message,readonly:'hidden'})
        //})
        }
        else{

          /*StockV.findOne({'date':date,'salesPerson':salesPerson})
          .then(oc=>{
        
            if(oc && reason =='' ){
              BatchR.find({status:'received'}).lean().sort({fifoPosition:1}).then(docs=>{
                var arr = docs
              console.log(reason,'reason')
              req.session.message = {
                type:'errors',
                message:'Reason for Additional Batch to'+' '+salesPerson
              }
              res.render('kambucha/batchDisp',{user:req.body, use:req.user,message:req.session.message,readonly:readonly,
                read:read,readF:readF,readF2:readF2})

              })
        
            }else{*/
//batch looping
let count = 0
let uid = req.user._id
 BatchR.find({product:product},function(err,hocs){
   for(var i = 0; i<hocs.length;i++){
     casesBatch - hocs[i].cases
     if(cases >=0){
       count++
     }
   }
User.findByIdAndUpdate(uid,{$set:{batchCount:count,currentCount:1}},function(err,tocs){

})
               

BatchR.find({fifoPosition:0},function(err,loc){
  let batchId = loc[0]._id
  let product = loc[0].product
  let warehouse = loc[0].warehouse
  let openingBal, closingBal
  let refNumber = loc[0].refNumber
  console.log(refNumber,'refNumber33')
  let batchdCases 
  if(cases >= loc[0].cases){
     batchdCases =loc[0].cases
  }else{
    batchdCases = cases
  }
  SaleStock.find({product:product,salesPerson:salesPerson},function(err,mocs){
    if(mocs.length > 0){
       openingBal = mocs[0].holdingCases
       closingBal = mocs[0].holdingCases + cases
    }else{
      openingBal = 0
      closingBal = cases
    }
   
    
    RefNoDisp.find({refNumber:refNumber},function(err,docs){
      let size = docs.length + 1
      let refNo = date7+'B'+size+'D'+refNumber
      console.log(refNo,'refNo')

   
 
              var book = new BatchD()
              book.date = date
              book.openingStock = openingBal
              book.closingStock = closingBal
              book.cases = batchdCases
              book.batchTotalCases = cases
              book.truck = truck
              book.salesPerson = salesPerson
              book.time = time
              book.status = 'pending'
              book.destination = destination
              //book.warehouse = warehouse
              book.product = product
              book.refNumber = refNumber
              book.dispatchMformat = mformat
              book.dateValueDispatch = dateValue
              book.dispatcher = dispatcher
              book.year = year
              book.month = month
        
              book.save()   
              .then(pro =>{
                let pallet = batchdCases / 10
                let remainderCases = batchdCases % 10
                 let currentPallet = 0
                 console.log(pallet,remainderCases,'pallet','remainderCases')
      var id = req.user._id
      User.findByIdAndUpdate(id,{$set:{date:date,cases:cases, truck:truck, salesPerson:salesPerson, time:time, 
      product:product,refNumber:refNumber,refNumDispatch:refNo,destination:destination,batchId:pro._id,batchCount:count,currentCount:1,casesBatch:cases,currentCases:0,pallets:pallet,remainderCases:remainderCases,currentPallet:1,currentBatchCount:0 }},function(err,docs){
  
      })

      
    var book = new RefNoDisp();
    book.refNumber = refNumber
    book.refNumber2 = refNo
    book.type = 'dispatch'

    book.save()
    .then(pro =>{

     

    })


     
console.log(refNumber,'refNumber555')
    if(pallet >=1){
      res.redirect('/dispatchStock/'+refNo)
    }
    else{
      res.redirect('/dispatchStockCase2/'+refNo)
    }


      //res.redirect('/dispatchStock/'+refNumber)
    })
  })
})
})

})
   

    
  //})
//})


}
//})
  }
  })




  /*}

  
  })*/



  router.get('/batchDispatch2',function(req,res){
    let product = req.user.product
    let salesPerson = req.user.salesPerson
    let date = req.user.date
    var m = moment()
    var year = m.format('YYYY')
    var month = m.format('MMMM')
    let mformat =  moment(date).format('l');
    let dateValue = moment(date).valueOf()
    let time = req.user.time
    let destination = req.user.destination
    let truck = req.user.truck
    let cases = req.user.casesBatch
    let batchCount = req.user.currentBatchCount
    BatchR.find({fifoPosition:batchCount},function(err,loc){
      let refNumber = loc[0].refNumber

      let batchdCases 
      if(cases >= loc[0].cases){
         batchdCases =loc[0].cases
      }else{
        batchdCases = cases
      }

      let pallet = batchdCases / 10
      let remainderCases = batchdCases % 10
       let currentPallet = 0
    RefNoDisp.find({refNumber:refNumber},function(err,docs){
      let size = docs.length + 1
      let refNo = date7+'B'+size+'D'+refNumber
      console.log(refNo,'refNo')

   
 
              var book = new BatchD()
              book.date = date
              book.openingStock = openingBal
              book.closingStock = closingBal
              book.cases =batchdCases
              book.truck = truck
              book.salesPerson = salesPerson
              book.time = time
              book.pallets = pallet
              book.currentPallet = 0
              book.remainderCases = remainderCases
              book.status = 'pending'
              book.destination = destination
              //book.warehouse = warehouse
              book.product = product
              book.refNumber = refNumber
              book.dispatchMformat = mformat
              book.dateValueDispatch = dateValue
              book.dispatcher = dispatcher
              book.year = year
              book.month = month
        
              book.save()   
              .then(pro =>{

      var id = req.user._id
      User.findByIdAndUpdate(id,{$set:{date:date,cases:cases, truck:truck, salesPerson:salesPerson, time:time, 
      product:product,refNumber:refNumber,refNumDispatch:refNo,destination:destination,batchId:pro._id,pallets:pallet,remainderCases:remainderCases,currentPallet:currentPallet }},function(err,docs){
  
      })

      
    var book = new RefNoDisp();
    book.refNumber = refNumber
    book.refNumber2 = refNo
    book.type = 'dispatch'

    book.save()
    .then(pro =>{

     

    })


    if(pallet >=1){
      res.redirect('/dispatchStock/'+refNo)
    }
    else{
      res.redirect('/dispatchStockCase/'+refNo)
    }
     
       
  })
   
  })
})
  })
  


router.get('/updatePallet',function(req,res){
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

    
    
    
    })
  
})












  router.get('/dispatchStock/:id',isLoggedIn,function(req,res){

    var date = req.user.date
    var time = req.user.time
    var salesPerson = req.user.salesPerson
    var truck = req.user.truck
    var cases = req.user.cases
    var id = req.user._id
    var refNumber = req.user.refNumber
    var product = req.user.product
    var currentPallet = req.user.currentPallet
    var destination = req.user.destination
    var pallets = req.user.pallets
    var remainderCases = req.user.remainderCases
    var refNumberDispatch = req.user.refNumberDispatch
    var batchId = req.user.batchId

    BatchR.find({fifoPosition:0},function(err,loc){
    //let refNumber = loc[0].refNumber
    let warehouse = loc[0].warehouse
    const refNumber2 = JSON.stringify(refNumber)
    User.findByIdAndUpdate(id,{$set:{refNumber:refNumber,warehouse:warehouse}},function(err,bocs){

 
    Product.find(function(err,docs){
     res.render('kambucha/dispStock2',{listX:docs,date:date,time:time,salesPerson:salesPerson, truck:truck,
    product:product,batchId:batchId,cases:cases,refNumber:refNumber,refNumber2:refNumber2,warehouse:warehouse,destination:destination,
  refNumberDispatch:refNumberDispatch,pallets:pallets,remainderCases:remainderCases,currentPallet:currentPallet})
    })
  })

})
  })




  router.get('/dispatchStockCase/:id',isLoggedIn,function(req,res){

    var date = req.user.date
    var time = req.user.time
    var salesPerson = req.user.salesPerson
    var truck = req.user.truck
    var cases = req.user.cases
    var id = req.user._id
    var product = req.user.product
    var destination = req.user.destination
    var remainderCases = req.user.remainderCases
    var refNumberDispatch = req.user.refNumberDispatch
    var batchId = req.user.batchId

    BatchR.find({fifoPosition:0},function(err,loc){
    let refNumber = loc[0].refNumber
    let warehouse = loc[0].warehouse
    const refNumber2 = JSON.stringify(refNumber)
    User.findByIdAndUpdate(id,{$set:{refNumber:refNumber,warehouse:warehouse}},function(err,bocs){

 
    Product.find(function(err,docs){
     res.render('kambucha/dispStockCase',{listX:docs,date:date,time:time,salesPerson:salesPerson, truck:truck,
    product:product,batchId:batchId,cases:cases,refNumber:refNumber,refNumber2:refNumber2,warehouse:warehouse,destination:destination,
  refNumberDispatch:refNumberDispatch,remainderCases:remainderCases})
    })
  })

})
  })



  
  router.get('/dispatchStockCase2/:id',isLoggedIn,function(req,res){

    var date = req.user.date
    var time = req.user.time
    var salesPerson = req.user.salesPerson
    var truck = req.user.truck
    var cases = req.user.cases
    var id = req.user._id
    var product = req.user.product
    var destination = req.user.destination
    var remainderCases = req.user.remainderCases
    var refNumberDispatch = req.user.refNumberDispatch
    var batchId = req.user.batchId

    BatchR.find({fifoPosition:0},function(err,loc){
    let refNumber = loc[0].refNumber
    let warehouse = loc[0].warehouse
    const refNumber2 = JSON.stringify(refNumber)
    User.findByIdAndUpdate(id,{$set:{refNumber:refNumber,warehouse:warehouse}},function(err,bocs){

 
    Product.find(function(err,docs){
     res.render('kambucha/dispCase2',{listX:docs,date:date,time:time,salesPerson:salesPerson, truck:truck,
    product:product,batchId:batchId,cases:cases,refNumber:refNumber,refNumber2:refNumber2,warehouse:warehouse,destination:destination,
  refNumberDispatch:refNumberDispatch,remainderCases:remainderCases})
    })
  })

})
  })




router.get('/closePallet/:id',isLoggedIn,function(req,res){
let currentPallet = req.user.currentPallet
let pallets = req.user.pallets
let currentBatchCount = req.user.currentBatchCount
let batchCount = req.user.batchCount
let casesBatch = req.user.casesBatch
let uid = req.user._id
let currentCases = req.user.currentCases
let id = req.params.id
  BatchD.findById(id,function(err,doc){
    if(doc){
    let refNumber = doc.refNumber
    let cases = doc.cases
    let scannedCases = currentCases 
    casesBatch - scannedCases
    let upCasesBatch =  casesBatch - scannedCases
    User.findByIdAndUpdate(uid,{$set:{casesBatch:upCasesBatch}},function(err,socs){

    })
    if(cases == scannedCases){
      currentBatchCount++
      if(currentBatchCount == batchCount){
BatchD.findByIdAndUpdate(id,{$set:{batchStatus:'closed'}},function(err,locs){

})

User.findByIdAndUpdate(uid,{$set:{casesBatch:casesBatch}},function(err,focs){

})

res.redirect('/fifoUpdate')

      } else{


        User.findByIdAndUpdate(uid,{$set:{casesBatch:casesBatch,currentPallet:currentPallet,currentBatchCount:currentBatchCount}},function(err,focs){

        })
res.redirect('/batchDispatch2')

      }
    }else{
      currentPallet++

      User.findByIdAndUpdate(uid,{$set:{casesBatch:casesBatch,currentPallet:currentPallet}},function(err,focs){

      })
      let palletV = upCasesBatch / 10
      let remainderCases = upCasesBatch % 10

      console.log(palletV,'palletV')


      if(palletV >=1){
        res.redirect('/dispatchStock/'+refNumber)
      }
      else{
      User.findByIdAndUpdate(uid,{$set:{remainderCases:remainderCases}},function(err,docs){

        res.redirect('/dispatchStockCase/'+refNumber)

      })

      
      }
       

    }
  }
  })
})



  router.get('/salesStockUpdate/:id',function(req,res){
    var id = req.params.id
    BatchD.findById(id,function(err,doc){

      let product = doc.product
      let salesPerson = doc.salesPerson
      let casesReceived = doc.cases

      Product.find({name:product},function(err,loc){
        if(loc){

        
        let usd = loc[0].usd
      
      

     

 

      SaleStock.find({salesPerson:salesPerson,product:product},function(err,docs){
  
        if(docs.length == 0)
        {

          var sale =SaleStock();
          sale.product = product
          sale.casesReceived = casesReceived
          sale.openingBal = 0
          sale.holdingCases = casesReceived
          sale.salesPerson = salesPerson
          sale.qty = casesReceived * 12
          sale.price = usd
          
          sale.save()
          .then(pas =>{

            BatchD.findByIdAndUpdate(id,{$set:{openingBalance:0,closingBalance:casesReceived,status:"dispatched",dispatchStatus:"dispatched"}},function(err,vocs){

            })

          })
        }else{
          var  idX  = docs[0]._id
            console.log(idX)
            let openingBal = docs[0].holdingCases
            var closingBal = docs[0].holdingCases + doc.cases
            let caseR = doc.cases
            let qty = docs[0].holdingCases + doc.cases * 12
            
            SaleStock.findByIdAndUpdate(idX,{$set:{casesReceived:caseR,openingBal:openingBal,holdingCases:closingBal,qty:qty}},function(err,locs){

            })
            BatchD.findByIdAndUpdate(id,{$set:{openingBalance:openingBal,closingBalance:closingBal,status:"dispatched",dispatchStatus:"dispatched"}},function(err,vocs){

            })
        }
      
      })
    }
      
    })



res.redirect('/statusUpdate')
    })
  
  })

router.get('/statusUpdate',function(req,res){

StockV.find({status:'dispatched',dispatchStatus:'pending'},function(err,docs){
  for(var i = 0; i<docs.length;i++){
    let id = docs[i]._id
    StockV.findByIdAndUpdate(id,{$set:{dispatchStatus:'dispatched'}},function(err,locs){

    })
  }
  res.redirect('/fifoUpdate')
})

})
 



  router.post('/dispStock3/:id',isLoggedIn, (req, res) => {
    var pro = req.user
    var m = moment()
    var code = req.params.id
    var mformat = m.format("L")
    console.log(code,'chileshe')

    StockV.find({refNumDispatch:code,status:'dispatched'}).lean().sort({'dateValueDispatch':1}).then(docs=>{
    
   
      res.send(docs)
              })

    }); 




  
////////////////////


router.post('/dispatchScan',isLoggedIn, function(req,res){
 
  var date2 = req.user.date
  var product = req.user.product;
  var m = moment(date2)
  var m2 = moment()
  var dispatcher = req.user.fullname
  var year = m.format('YYYY')
  var dateValue = m.valueOf()
  var dateValueDispatch = m2.valueOf()
  var date = m.toString()
  var numDate = m.valueOf()
  var barcodeNumber = req.body.code
var month = m.format('MMMM')
var time = req.user.time
var truck = req.user.truck
var casesDispatched = 1
var casesBatch = req.user.cases
var lot = req.user.lot
var pallet
var refNumber = req.user.refNumber
var refNumDispatch = req.user.refNumDispatch
var salesPerson = req.user.salesPerson
var warehouse = req.user.warehouse
var batchId = req.user.batchId
console.log(batchId,'batchId')
var arr = []
var arr2 = []
var c = {_id:"",statusV:"dispatched",item:"",description:"",invoiceNumber:"",_id:"",amountDue:0} 
arr2.push(c)
var id =req.user._id
var status1 = 'received'
var status2 = 'dispatched'
var mformat = m.format("L")
var currentPallet = req.user.currentPallet
  //var receiver = req.user.fullname

console.log(product,casesDispatched,warehouse,'out')


StockV.find({refNumDispatch:refNumDispatch,refNumber:refNumber,dispatchStatus:'pending',pallet:currentPallet},function(err,focs){
  
    //let size  = focs.length + 1
  
    if(focs.length > casesBatch){ 
      size = casesBatch
    }
    else{
      size = focs.length + 1
    }


 

  


    Warehouse.findOne({'product':product,'warehouse':warehouse})
  .then(hoc=>{



    StockV.findOne({'barcodeNumber':barcodeNumber,'refNumber':refNumber,'pallet':currentPallet})
    .then(doc=>{
      console.log(doc,'doc',hoc,'hoc')

    if(doc){

      if(doc.status == 'dispatched'){
res.send(c)
      }
      else if(doc.status == 'received'){

        if(size > casesBatch){
          User.findByIdAndUpdate(id,{$set:{refNumDispatch:"null"}},function(err,noc){
          
          })
        
            }
            


        
        console.log('true')
        let availableCases = hoc.cases
        let tCases = hoc.cases + 1
        
        let uid = req.user._id
        
            StockV.findByIdAndUpdate(doc._id,{$set:{timeOfDispatch:time,truck:truck,salesPerson:salesPerson,
              dispatcher:dispatcher,casesBatch:casesBatch,refNumDispatch:refNumber,availableCasesDispatch:availableCases,cases:tCases,status:'dispatched',
            mformatDispatch:mformat,dateValueDispatch:dateValueDispatch,size:size,casesDispatched:1,batchId:batchId,statusCheck:"scanned",
          refNumDispatch:refNumDispatch}},function(err,lof){
        
             
        
        
              Product.find({'name':product},function(err,docs){
                let id = docs[0]._id
                console.log(id,'id')
                let nqty, nqty2
                
                 let openingQuantity = docs[0].cases
                //nqty = pro.quantity + docs[0].quantity
                nqty =  docs[0].cases - 1 
                console.log(docs[0].cases, '**',1)
                nqty2 = nqty * docs[0].unitCases
                console.log(nqty,'nqty')
                Product.findByIdAndUpdate(id,{$set:{cases:nqty,openingQuantity:openingQuantity,rcvdQuantity:0, quantity:nqty2}},function(err,nocs){
        
                })
        
                
        
               })



               Warehouse.find({product:product,warehouse:warehouse},function(err,docs){
                let id = docs[0]._id
                console.log(id,'id')
                let nqty, nqty2
                
                 let openingQuantity = docs[0].cases
                //nqty = pro.quantity + docs[0].quantity
                nqty =  docs[0].cases - 1 
                console.log(docs[0].cases, '**',1)
                nqty2 = nqty * docs[0].unitCases
                console.log(nqty,'nqty')
                Warehouse.findByIdAndUpdate(id,{$set:{cases:nqty,openingQuantity:openingQuantity,rcvdQuantity:0, quantity:nqty2}},function(err,nocs){
        
                })
        
                
        
               })

               StockV.find({refNumber:refNumber,status:'dispatched'},function(err,gocs){

                let currentCases = gocs.length
                console.log(currentCases,'currentCases')
                User.findByIdAndUpdate(uid,{$set:{currentCases:currentCases}},function(err,tocs){

                })


              })
              

           

                        StockV.findById(doc._id,function(err,oc){
                          //console.log(oc,'ocs')
                res.send(oc)
                        })

                     
        
                      })
        
      }
    }else{

      res.send(arr)

    }




    })

  

    }) 
  
  })

      
})

/////////////


router.post('/dispatchScanCase',isLoggedIn, function(req,res){
 
  var date2 = req.user.date
  var product = req.user.product;
  var m = moment(date2)
  var m2 = moment()
  var dispatcher = req.user.fullname
  var year = m.format('YYYY')
  var dateValue = m.valueOf()
  var dateValueDispatch = m2.valueOf()
  var date = m.toString()
  var numDate = m.valueOf()
  var barcodeNumber = req.body.code
var month = m.format('MMMM')
var time = req.user.time
var truck = req.user.truck
var casesDispatched = 1
var casesBatch = req.user.cases
var lot = req.user.lot
var pallet
var refNumber = req.user.refNumber
var refNumDispatch = req.user.refNumDispatch
var salesPerson = req.user.salesPerson
var warehouse = req.user.warehouse
var batchId = req.user.batchId
console.log(batchId,'batchId')
var arr = []
var arr2 = []
var c = {_id:"",statusV:"dispatched",item:"",description:"",invoiceNumber:"",_id:"",amountDue:0} 
arr2.push(c)
var id =req.user._id
var status1 = 'received'
var status2 = 'dispatched'
var mformat = m.format("L")
var currentPallet = req.user.currentPallet
  //var receiver = req.user.fullname

console.log(product,casesDispatched,warehouse,'out')


StockV.find({refNumDispatch:refNumDispatch,refNumber:refNumber,dispatchStatus:'pending'},function(err,focs){
  
    //let size  = focs.length + 1
  
    if(focs.length > casesBatch){
      size = casesBatch
    }
    else{
      size = focs.length + 1
    }


 

  


    Warehouse.findOne({'product':product,'warehouse':warehouse})
  .then(hoc=>{



    StockV.findOne({'barcodeNumber':barcodeNumber,'refNumber':refNumber})
    .then(doc=>{
      console.log(doc,'doc',hoc,'hoc')

    if(doc){

      if(doc.status == 'dispatched'){
res.send(c)
      }
      else if(doc.status == 'received'){

        if(size > casesBatch){
          User.findByIdAndUpdate(id,{$set:{refNumDispatch:"null"}},function(err,noc){
          
          })
        
            }
            


        
        console.log('true')
        let availableCases = hoc.cases
        let tCases = hoc.cases + 1
        
        let uid = req.user._id
        
            StockV.findByIdAndUpdate(doc._id,{$set:{timeOfDispatch:time,truck:truck,salesPerson:salesPerson,
              dispatcher:dispatcher,casesBatch:casesBatch,refNumDispatch:refNumber,availableCasesDispatch:availableCases,cases:tCases,status:'dispatched',
            mformatDispatch:mformat,dateValueDispatch:dateValueDispatch,size:size,casesDispatched:1,batchId:batchId,statusCheck:"scanned",
          refNumDispatch:refNumDispatch}},function(err,lof){
        
             
        
        
              Product.find({'name':product},function(err,docs){
                let id = docs[0]._id
                console.log(id,'id')
                let nqty, nqty2
                
                 let openingQuantity = docs[0].cases
                //nqty = pro.quantity + docs[0].quantity
                nqty =  docs[0].cases - 1 
                console.log(docs[0].cases, '**',1)
                nqty2 = nqty * docs[0].unitCases
                console.log(nqty,'nqty')
                Product.findByIdAndUpdate(id,{$set:{cases:nqty,openingQuantity:openingQuantity,rcvdQuantity:0, quantity:nqty2}},function(err,nocs){
        
                })
        
                
        
               })



               Warehouse.find({product:product,warehouse:warehouse},function(err,docs){
                let id = docs[0]._id
                console.log(id,'id')
                let nqty, nqty2
                
                 let openingQuantity = docs[0].cases
                //nqty = pro.quantity + docs[0].quantity
                nqty =  docs[0].cases - 1 
                console.log(docs[0].cases, '**',1)
                nqty2 = nqty * docs[0].unitCases
                console.log(nqty,'nqty')
                Warehouse.findByIdAndUpdate(id,{$set:{cases:nqty,openingQuantity:openingQuantity,rcvdQuantity:0, quantity:nqty2}},function(err,nocs){
        
                })
        
                
        
               })

               StockV.find({refNumber:refNumber,status:'dispatched'},function(err,gocs){

                let currentCases = gocs.length
                console.log(currentCases,'currentCases')
                User.findByIdAndUpdate(uid,{$set:{currentCases:currentCases}},function(err,tocs){

                })


              })
              

           

                        StockV.findById(doc._id,function(err,oc){
                          //console.log(oc,'ocs')
                res.send(oc)
                        })

                     
        
                      })
        
      }
    }else{

      res.send(arr)

    }




    })

  

    }) 
  
  })

      
})













router.post('/dispatchPallet/:id',isLoggedIn,function(req,res){

  
  var date2 = req.user.date
  var product = req.user.product;
  var m = moment(date2)
  var m2 = moment()
  var dispatcher = req.user.fullname
  var year = m.format('YYYY')
  var dateValue = m.valueOf()
  var dateValueDispatch = m2.valueOf()
  var date = m.toString()
  var numDate = m.valueOf()
  var barcodeNumber = req.body.code
var month = m.format('MMMM')
var time = req.user.time
var truck = req.user.truck
var casesDispatched = 1
var casesBatch = req.user.cases
var lot = req.user.lot
var refNumber = req.user.refNumber
var salesPerson = req.user.salesPerson
var warehouse = req.user.warehouse
var batchId = req.user.batchId
console.log(batchId,'batchId')
var arr = []
var arr2 = []
var c = {_id:"",statusV:"dispatched",item:"",description:"",invoiceNumber:"",_id:"",amountDue:0} 
arr2.push(c)
var id =req.user._id
var status1 = 'received'
var status2 = 'dispatched'
var mformat = m.format("L")
let count = 0
var id = req.params.id
let currentCases = req.user.currentCases
var uid = req.user._id
var refNumDispatch = req.user.refNumDispatch
var idU = req.user._id
var currentPallet = req.user.currentPallet

      
      
                        StockV.find({refNumber:id,statusCheck:"scanned",refNumDispatch:refNumDispatch,pallet:currentPallet},function(err,docs){

                          let pallet = docs[0].pallet
                          for(var i = 0;i<docs.length;i++){
                            
        
        
             
        
                            if(docs[i].pallet == pallet){
                              count++
                        
                        
                              if(count == docs.length){
                                Warehouse.findOne({'product':product,'warehouse':warehouse})
                                .then(hoc=>{
                               
                        
                                StockV.find({refNumber:id,status:'received',pallet:pallet},function(err,ocs){
                        for(var n = 0;n<ocs.length;n++){
                         let objId = ocs[n]._id
                         console.log(objId,'objId')
                     
                            let size = n + 4
                            let availableCases = hoc.cases - n

                            console.log(hoc.cases, n,'jack reverse')
                            let tCases = hoc.cases + 1
                            
                          StockV.findByIdAndUpdate(objId,{$set:{timeOfDispatch:time,truck:truck,salesPerson:salesPerson,
                            dispatcher:dispatcher,casesBatch:casesBatch,refNumDispatch:refNumDispatch,availableCasesDispatch:availableCases,cases:tCases,status:'dispatched',
                          mformatDispatch:mformat,size:size,casesDispatched:1,batchId:batchId,statusCheck:"scanned",statusCheck2:'scannedLoop',dateValueDispatch:dateValueDispatch}},function(err,lof){

                          })
              

                     
             
                Product.find({'name':product},function(err,pocs){
                let pId = pocs[0]._id
                 console.log(pId,'pId')
                let nqty, nqty2
                
                 let openingQuantity = pocs[0].cases
                //nqty = pro.quantity + docs[0].quantity
                nqty =  pocs[0].cases - 1 
                console.log(pocs[0].cases, '**',1)
                nqty2 = nqty * pocs[0].unitCases
                console.log(nqty,'nqty')
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
                console.log(kocs[0].cases, '**',1)
                nqty2 = nqty * kocs[0].unitCases
                console.log(nqty,'nqty')
                Warehouse.findByIdAndUpdate(wareId,{$set:{cases:nqty,openingQuantity:openingQuantity,rcvdQuantity:0, quantity:nqty2}},function(err,nocs){
        
                //  console.log(nocs,'updatedWareH')
                })
        })
             currentCases++
             console.log(currentCases,'currentCasesV')
          User.findByIdAndUpdate(uid,{$set:{currentCases:currentCases}},function(err,vocs){

          })

                      
                       
                        }

                        StockV.find({refNumber:id,status:'dispatched',pallet:pallet,statusCheck2:"scannedLoop",refNumDispatch:refNumDispatch},function(err,gocs){

                        
                        StockV.find({refNumber:id,status:'dispatched',pallet:pallet,statusCheck2:"scannedLoop",refNumDispatch:refNumDispatch},function(err,pocs){



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











  router.post('/verifyScan',function(req,res){
  
    var barcodeNumber = req.body.code
     Product.find({barcodeNumber:barcodeNumber},function(err,docs){
    if(docs == undefined){
      res.redirect('/verify')
    }else
    console.log(docs,'docs')
   
       res.send(docs[0])
     })
   })






   router.get('/autocompleteProduct/',function(req, res, next) {

   
    var regex= new RegExp(req.query["term"],'i');
   
    var uidFilter =Product.find({name:regex},{'name':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
  
    
    uidFilter.exec(function(err,data){
   
  
  console.log('data',data)
  
  var result=[];
  
  if(!err){
     if(data && data.length && data.length>0){
       data.forEach(sub=>{
  
        
     
  
          
         let obj={
           id:sub._id,
           label: sub.name,
  
       
         /*  name:name,
           surname:surname,
           batch:batch*/
          
          
       
         
          
  
           
         };
        
         result.push(obj);
         console.log('object',obj.id)
       });
  
     }
   
     res.jsonp(result);
     console.log('Result',result)
    }
  
  })
  
  });
  
  // role admin
  //this routes autopopulates teachers info from the id selected from automplet1
  router.post('/autoProduct',function(req,res){
    var code = req.body.code
  
  
    Product.find({name:code},function(err,docs){
   if(docs == undefined){
     res.redirect('/dash')
   }else
  
      res.send(docs[0])
    })
  
  
  })
  




  /*router.get('/eodRepo/',isLoggedIn,function(req,res){

    let date  = req.user.date
  var id = req.params.id
  RefNo.find({date:date},function(err,docs){
   for(var i = 0;i<docs.length;i++){
let refNumber = docs[i].refNumber
arrStatement[refNumber]=[]
   }   
    res.redirect('/arrRefsProcess/')
  })
    })*/
  
  

  

    router.get('/eodRepo',isLoggedIn,function(req,res){
      console.log(arrStatementR,'arrRefs')
      arrStatementR=[]
        //var code = "Tiana Madzima"
    
  let date = req.user.date
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
            
            res.redirect('/statementGen/')
          
        
        /*})*/
        
        })
        
    
    
router.get('/statementGen/',isLoggedIn,function(req,res){
  console.log(arrStatementR,'arrSingleUpdate')
  var m = moment()
  var mformat = m.format('L')
  var month = m.format('MMMM')
  var year = m.format('YYYY')
  var date = req.user.date

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
  const content = await compile('statement2',arrStatementR)
  
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
//     url: 'http://niyonsoft.org/uploadStatement',
     url:'http://localhost:8000/uploadStatement',
    headers: {
      "Content-Type": "multipart/form-data"  
    },
    data: form
  });
  
  seqNum++
  RefNoSeq.findByIdAndUpdate(seqId,{$set:{num:seqNum}},function(err,tocs){
  
  })
    
  
  res.redirect('/fileId/'+filename);
  
  
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
  res.redirect('/fileId/'+filename)
  })
  
  })


router.get('/fileId/:id',function(req,res){
console.log(req.params.id)
var id = req.params.id

res.redirect('/openStatementName/'+id)

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
      res.render('kambucha/itemFolder')
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
         
              res.render('kambucha/itemFilesMonthly',{pro:pro,listX:docs,id:id})
    
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
   
   
   res.render('kambucha/itemFiles',{listX:arr,month:month,pro:pro,year:year,successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg}) 
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
       
            res.render('kambucha/itemFilesMonthlyDispatch',{pro:pro,listX:docs,id:id})
  
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
 
 
 res.render('kambucha/itemFilesDispatch',{listX:arr,month:month,pro:pro,year:year,successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg}) 
 }
 })
    
 })
 
   


 /*********Dispatch */
 router.get('/folderRegDispatch',function(req,res){
  res.render('kambucha/itemFolderDispatch')
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
   
        res.render('kambucha/itemFilesMonthlyDispatchV',{pro:pro,listX:docs,id:id})

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


res.render('kambucha/itemFilesDispatchV',{listX:arr,month:month,pro:pro,year:year,successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg}) 
}
})

})


  
router.get('/updateStockV',function(req,res){
  StockV.find(function(err,docs){
    for(var i = 0;i<docs.length;i++){
     let id = docs[i]._id
     StockV.findByIdAndRemove(id,(err,doc)=>{

     }) 
    }
    res.redirect('/updateStockD')
  })
})





router.get('/updateStockD',function(req,res){
  StockD.find(function(err,docs){
    for(var i = 0;i<docs.length;i++){
     let id = docs[i]._id
     StockD.findByIdAndRemove(id,(err,doc)=>{

     }) 
    }
    res.redirect('/updateRefN')
  })
})


router.get('/updateRefN',function(req,res){
  RefNo.find(function(err,docs){
    for(var i = 0;i<docs.length;i++){
     let id = docs[i]._id
     RefNo.findByIdAndRemove(id,(err,doc)=>{

     }) 
    }
    res.redirect('/updateProduct')
  })
})


router.get('/updateProduct',function(req,res){
  Product.find(function(err,docs){
    for(var i = 0;i<docs.length;i++){
     let id = docs[i]._id
   Product.findByIdAndUpdate(id,{$set:{qauntity:0,openingQuantity:0,rcvdQuanity:0,cases:0}},function(err,locs){

   })
    }
    res.redirect('/updateBatchD')
  })
})


router.get('/updateBatchD',function(req,res){
  BatchD.find(function(err,docs){
    for(var i = 0;i<docs.length;i++){
     let id = docs[i]._id
     BatchD.findByIdAndRemove(id,(err,doc)=>{

     }) 
    }
    res.redirect('/updateBatchR')
  })
})




router.get('/updateBatchR',function(req,res){
  BatchR.find(function(err,docs){
    for(var i = 0;i<docs.length;i++){
     let id = docs[i]._id
     BatchR.findByIdAndRemove(id,(err,doc)=>{

     }) 
    }
    res.redirect('/updateRepo')
  })
})


router.get('/updateRepo',function(req,res){
  RepoFiles.find(function(err,docs){
    for(var i = 0;i<docs.length;i++){
     let id = docs[i]._id
     RepoFiles.findByIdAndRemove(id,(err,doc)=>{

     }) 
    }
    res.redirect('/updateInvoiceSubBatch')
  })
})


router.get('/updateInvoiceSubBatch',function(req,res){
  InvoiceSubBatch.find(function(err,docs){
    for(var i = 0;i<docs.length;i++){
     let id = docs[i]._id
     InvoiceSubBatch.findByIdAndRemove(id,(err,doc)=>{

     }) 
    }
    res.redirect('/updateRtnsSubBatch')
  })
})





router.get('/updateRtnsSubBatch',function(req,res){
  RtnsSubBatch.find(function(err,docs){
    for(var i = 0;i<docs.length;i++){
     let id = docs[i]._id
    RtnsSubBatch.findByIdAndRemove(id,(err,doc)=>{

     }) 
    }
    res.redirect('/updateInvoiceSubFile')
  })
})



router.get('/updateInvoiceSubFile',function(req,res){
  InvoiceSubFile.find(function(err,docs){
    for(var i = 0;i<docs.length;i++){
     let id = docs[i]._id
    InvoiceSubFile.findByIdAndRemove(id,(err,doc)=>{

     }) 
    }
    res.redirect('/updateReturnsSubFile')
  })
})



router.get('/updateReturnsSubFile',function(req,res){
  ReturnsSubFile.find(function(err,docs){
    for(var i = 0;i<docs.length;i++){
     let id = docs[i]._id
    ReturnsSubFile.findByIdAndRemove(id,(err,doc)=>{

     }) 
    }
    res.redirect('/updateSalesStockUpdate')
  })
})




router.get('/updateSalesStockUpdate',function(req,res){
  SaleStock.find(function(err,docs){
    for(var i = 0;i<docs.length;i++){
     let id = docs[i]._id
  SaleStock.findByIdAndUpdate(id,{$set:{casesReceived:0,openingBal:0,holdingCases:0,qty:0}},function(err,locs){

  })
    }
    res.redirect('/updateDeliveryQty')
  })
})



router.get('/updateDeliveryQty',function(req,res){
 Delivery.find(function(err,docs){
    for(var i = 0;i<docs.length;i++){
     let id = docs[i]._id
   Delivery.findByIdAndRemove(id,(err,doc)=>{

     }) 
    }
    res.redirect('/updateWarehouseQty')
  })
})


router.get('/updateWarehouseQty',function(req,res){
  Warehouse.find(function(err,docs){
    for(var i = 0;i<docs.length;i++){
     let id = docs[i]._id
  Warehouse.findByIdAndUpdate(id,{$set:{quantity:0,openingQuantity:0,rcvdQuantity:0,cases:0}},function(err,locs){

  })
    }
   // res.redirect('/warehouseStock')
   res.redirect('/updatePreBarc')
  })
})
////
router.get('/updatePreBarc',function(req,res){
  PreRcvd.find(function(err,docs){
    for(var i = 0;i<docs.length;i++){
     let id = docs[i]._id
     PreRcvd.findByIdAndRemove(id,(err,doc)=>{

     }) 
    }
    res.redirect('/updateBatchPR')
  })
})
////
router.get('/updateBatchPR',function(req,res){
 BatchPR.find(function(err,docs){
    for(var i = 0;i<docs.length;i++){
     let id = docs[i]._id
     BatchPR.findByIdAndRemove(id,(err,doc)=>{

     }) 
    }
    res.redirect('/warehouseStock')
  })
})


//salesStock

router.get('/updateSalesStock0',isLoggedIn,function(req,res){
  
  SalesList.find(function(err,docs){
    for(var i = 0;i<docs.length;i++){
   let  salesPerson = docs[i].salesPerson

     
  /*SaleStock.find({salesPerson:salesPerson,product:'kambucha lite'},function(err,ocs){
    console.log(ocs.length,'length')
   if(ocs.length == 0){*/

      var sale =SaleStock();
      sale.product = 'kambucha lite'
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
    res.redirect('/updateSalesStock1')
  })
})


router.get('/updateSalesList',function(req,res){
  SalesStock.find(function(err,docs){
    for(var i = 0;i<docs.length;i++){
      let id = docs[i]._id

      SalesStock.findByIdAndUpdate(id,{$set:{qty:0,holdingCases:0,openingBal:0,casesReceived:0}},function(err,vocs){

      })
    }
  })
})
router.get('/updateSalesStock1',isLoggedIn,function(req,res){
  
  SalesList.find(function(err,docs){
    for(var i = 0;i<docs.length;i++){
   let  salesPerson = docs[i].salesPerson

     
  /*SaleStock.find({salesPerson:salesPerson,product:'kambucha lite'},function(err,ocs){
    console.log(ocs.length,'length')
   if(ocs.length == 0){*/

      var sale =SaleStock();
      sale.product = 'kambucha No1'
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
    res.redirect('/updateSalesStock2')
  })
})


router.get('/updateSalesStock2',isLoggedIn,function(req,res){
  
  SalesList.find(function(err,docs){
    for(var i = 0;i<docs.length;i++){
   let  salesPerson = docs[i].salesPerson

     
  /*SaleStock.find({salesPerson:salesPerson,product:'kambucha lite'},function(err,ocs){
    console.log(ocs.length,'length')
   if(ocs.length == 0){*/

      var sale =SaleStock();
      sale.product = 'kambucha No2'
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
    res.redirect('/updateSalesStock3')
  })
})





router.get('/updateSalesStock3',isLoggedIn,function(req,res){
  
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
    res.redirect('/updateSalesStock4')
  })
})



router.get('/updateSalesStock4',isLoggedIn,function(req,res){
  
  SalesList.find(function(err,docs){
    for(var i = 0;i<docs.length;i++){
   let  salesPerson = docs[i].salesPerson

     
  /*SaleStock.find({salesPerson:salesPerson,product:'kambucha lite'},function(err,ocs){
    console.log(ocs.length,'length')
   if(ocs.length == 0){*/

      var sale =SaleStock();
      sale.product = 'manyuchi'
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
    res.redirect('/salesList')
  })
})








router.get('/updateRepoV',function(req,res){
  RepoFiles.find(function(err,docs){
    for(var i = 0;i<docs.length;i++){
     let id = docs[i]._id
     RepoFiles.findByIdAndRemove(id,(err,doc)=>{

     }) 
    }
    res.redirect('/')
  })
})
/*router.get('/eodRepoDispatch/',isLoggedIn,function(req,res){
 
  let date  = req.user.date
var id = req.params.id
RefNo.find({date:date,type:'dispatch'},function(err,docs){
 for(var i = 0;i<docs.length;i++){
let refNumber = docs[i].refNumber
arrStatement[refNumber]=[]
 }   
  res.redirect('/arrRefsProcessDispatch/')
})
  })*/

  
  router.get('/eodRepoDispatch/',isLoggedIn,function(req,res){
    //console.log(arrStatementR,'arrRefs')
    arrStatementR=[]
      //var code = "Tiana Madzima"
  
let date = req.user.date
      //console.log(docs[i].uid,'ccc')
      
      //let uid = "SZ125"
      
      
      //TestX.find({year:year,uid:uid},function(err,vocs) {
      BatchD.find({date:date}).lean().sort({date:1}).then(vocs=>{
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
          
         // res.redirect('/arrRefsProcessDispatch/')
         res.redirect('/statementGenDispatch/')
        
      
      /*})*/
      
      })
      





  /*router.get('/arrRefsProcessDispatch',isLoggedIn,function(req,res){
    console.log(arrStatement,'arrRefs')
      
  
let date = req.user.date
     
      BatchD.find({date:date}).lean().sort({date:1}).then(vocs=>{
      console.log(vocs.length,'vocs')
      
      for(var x = 0;x<vocs.length;x++){
      let size = vocs.length - 1
      let code = vocs[x].refNumber
      if( arrStatement[code].length > 0 && arrStatement[code].find(value => value.refNumber == code) ){
        arrStatement[code].find(value => value.refNumber == code).casesReceived++;
       
      
          }
          
           
          
          
          else{
            arrStatement[code].push(vocs[x])
          
            } 
      
      
       
      
           
      
      }
     
          })
          
          res.redirect('/statementGenDispatch/')
        
      

      
      })*/
      
  
  
router.get('/statementGenDispatch/',isLoggedIn,function(req,res){
console.log(arrStatementR,'arrSingleUpdate')
var m = moment()
var mformat = m.format('L')
var month = m.format('MMMM')
var year = m.format('YYYY')
var date = req.user.date
var refNumber = req.user.refNumber
//var code ="Tiana Madzima"
var code = req.params.id

//var studentName = 'Tiana Madzima'

/*console.log(arr,'iiii')*/


//console.log(docs,'docs')
RefNoSeqDisp.find(function(err,doc){
  let seqNum = doc[0].num
  let seqId = doc[0]._id



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
const content = await compile('statement3',arrStatementR)

//const content = await compile('index',arr[code])

await page.setContent(content, { waitUntil: 'networkidle2'});
//await page.setContent(content)
//create a pdf document
await page.emulateMediaType('screen')
let height = await page.evaluate(() => document.documentElement.offsetHeight);
await page.evaluate(() => matchMedia('screen').matches);
await page.setContent(content, { waitUntil: 'networkidle0'});
//console.log(await page.pdf(),'7777')
 
let filename = 'statementD'+seqNum+'.pdf'
await page.pdf({
//path:('../gitzoid2/reports/'+year+'/'+month+'/'+uid+'.pdf'),
path:(`./public/statements/${year}/${month}/statementD${seqNum}`+'.pdf'),
format:"A4",
/*width:'60cm',
height:'21cm',*/
height: height + 'px',
printBackground:true

})


var repo = new RepoFiles();

repo.filename = filename;
repo.fileId = "null";
repo.status = 'dispatch'
repo.year = year;

repo.month = month


console.log('done')

repo.save().then(poll =>{

})



//upload.single('3400_Blessing_Musasa.pdf')



/*await browser.close()

/*process.exit()*/

const file = await fs.readFile(`./public/statements/${year}/${month}/statementD${seqNum}`+'.pdf');
const form = new FormData();
form.append("file", file,filename);
//const headers = form.getHeaders();
//Axios.defaults.headers.cookie = cookies;
//console.log(form)
await Axios({
  method: "POST",
 //url: 'https://portal.steuritinternationalschool.org/clerk/uploadStatement',
   //url: 'https://niyonsoft.org/uploadStatementDispatch',
   url:'http://localhost:8000/uploadStatementDispatch',
  headers: {
    "Content-Type": "multipart/form-data"  
  },
  data: form
});
seqNum++
  RefNoSeqDisp.findByIdAndUpdate(seqId,{$set:{num:seqNum}},function(err,tocs){
  
  })


res.redirect('/fileIdDispatch/'+filename);


}catch(e) {

console.log(e)


}


}) ()


})

//res.redirect('/hostel/discList')

})




router.post('/uploadStatementDispatch',upload.single('file'),(req,res,nxt)=>{
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
res.redirect('/fileIdDispatch/'+filename)
})

})


router.get('/fileIdDispatch/:id',function(req,res){
console.log(req.params.id)
var id = req.params.id

res.redirect('/openStatementNameDispatch/'+id)

})


router.get('/openStatementNameDispatch/:id',(req,res)=>{
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


    
router.get('/downloadReport/:id',(req,res)=>{
  var fileId = req.params.id
  


//const bucket = new GridFsStorage(db, { bucketName: 'uploads' });
const bucket = new mongodb.GridFSBucket(conn.db,{ bucketName: 'uploads' });
gfs.files.find({_id: mongodb.ObjectId(fileId)}).toArray((err, files) => {

  console.log(files[0].filename,'files9')
let filename = files[0].filename
let contentType = files[0].contentType


    res.set('Content-disposition', `attachment; filename="${filename}"`);
    res.set('Content-Type', contentType);
    bucket.openDownloadStreamByName(filename).pipe(res);
  })
 //gfs.openDownloadStream(ObjectId(mongodb.ObjectId(fileId))).pipe(fs.createWriteStream('./outputFile'));
})




    router.get('/deleteBucket',(req,res)=>{
     
      const bucket = new mongodb.GridFSBucket(conn.db,{ bucketName: 'uploads' });
      bucket.drop();
     
    })

    router.get('/popup',function(req,res){
      res.render('kambucha/pop')
    })


    router.get('/printInvoice',function(req,res){
      res.render('kambucha/pdf')
    })

    router.get('/printPaid',function(req,res){
      res.render('kambucha/paid')
    })



    router.get('/importMonth',isLoggedIn, function(req,res){
      var pro = req.user
    
     
      var errorMsg = req.flash('danger')[0];
      var successMsg = req.flash('success')[0];
    
    
       title = "Import Month"
    
      
    
      
     res.render('imports/month',{pro:pro,title:title,successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg}) 
    
       })
    
    
    
      
     router.post('/importMonth',isLoggedIn, uploadX.single('file'),function(req,res){
       var term = req.user.term;
       var m = moment()
       var year = m.format('YYYY')
       var id =   req.user._id
       var idNumber = req.user.idNumber
       var pro = req.user
    
    
     
       
     /*  if(!req.file){
           req.session.message = {
             type:'errors',
             message:'Select File!'
           }     
             res.render('imports/students', {message:req.session.message,pro:pro}) */
             if (!req.file || req.file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
               req.session.message = {
                   type:'errors',
                   message:'Upload Excel File'
                 }     
                   res.render('imports/month', {message:req.session.message,pro:pro
                        
                    }) 
     
     
     
           }
             
           else{
    
           
               const file = req.file.filename;
       
               
                    var wb =  xlsx.readFile(`./public/uploads/` + file)
            
                    var sheets = wb.Sheets;
                    var sheetNames = wb.SheetNames;
        
                    var sheetName = wb.SheetNames[0];
        var sheet = wb.Sheets[sheetName ];
        
           for (var i = 0; i < wb.SheetNames.length; ++i) {
            var sheet = wb.Sheets[wb.SheetNames[i]];
        
            console.log(wb.SheetNames.length)
            var data =xlsx.utils.sheet_to_json(sheet)
                
            var newData = data.map(async function (record){
        
           
            
         
             
          
          
         
               let month = record.month;
            
               let num = record.num;
    
    
    
    
              req.body.month = record.month 
              req.body.num = record.num   
    
    
           req.check('month','Enter Month').notEmpty();
    
       
    
    var errors = req.validationErrors();
     
    if (errors) {
     
     req.session.errors = errors;
     req.session.success = false;
     console.log( req.session.errors[0].msg)
     req.flash('danger', req.session.errors[0].msg);
          
           
     res.redirect('/importMonth');
    
    }
    
    else
    
    
               {
                 Month.findOne({'month':month})
                 .then(user =>{
                     if(user){ 
                   // req.session.errors = errors
                     //req.success.user = false;
               
               
               
                     req.flash('danger', 'Room already in the system');
    
                     res.redirect('/importMonth') 
     
                     //res.redirect('/records/import')
                   
               }
               else
    
    
    
    
    
               var user = new Month();
               user.month = month
               user.num = num
              
              
              
               user.save()
                 .then(user =>{
                  
                 
                     
                 /*  req.session.message = {
                     type:'success',
                     message:'Account Registered'
                   }  
                   res.render('imports/teacherX',{message:req.session.message});*/
                 })
    
               })
             }
                      
                       // .catch(err => console.log(err))
                     
                   
                       
                     
                     
            
                     
                     
                     
                       
                       
           
                      
           
                      
                
                   })
                   
                   req.flash('success', 'File Imported Successfully!');
     
                   res.redirect('/importMonth') 
         
           }
         }
     
     })
    
    
    
router.get('/batchList',function(req,res){
BatchR.find(function(err,docs){

  let arr=[]
  for(var i = docs.length - 1; i>=0; i--){

    arr.push(docs[i])
  }

  res.render('kambucha/batchList',{listX:arr})

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

  res.render('kambucha/batchPallet',{listX:arr})
 })


})



    
router.get('/receivedCases/:id',function(req,res){
  let refNumber = req.params.id
  StockV.find({refNumber:refNumber},function(err,docs){
  
   
  
    res.render('kambucha/rcvdCases',{listX:docs})
  
  })
  
  
  
  })



  router.get('/dispatchedCases/:id',function(req,res){
    let refNumber = req.params.id
    StockV.find({refNumber:refNumber,status:'dispatched'},function(err,docs){
    
     
    
      res.render('kambucha/dispatchedCases',{listX:docs})
    
    })
    
    
    
    })




    router.get('/remainingCases/:id',function(req,res){
      let refNumber = req.params.id
      StockV.find({refNumber:refNumber,status:'received'},function(err,docs){
      
       
      
        res.render('kambucha/remainingCases',{listX:docs})
      
      })
      
      
      
      })


      /*****pallet cases */

      
router.get('/receivedCasesPallet/:id/:otherId',function(req,res){
  
  let pallet = req.params.otherId
  let refNumber = req.params.id
  StockV.find({refNumber:refNumber,pallet:pallet},function(err,docs){
  
   
  
    res.render('kambucha/rcvdCases',{listX:docs})
  
  })
  
  
  
  })



  
  router.get('/dispatchedCasesPallet/:id/:otherId',function(req,res){
    let refNumber = req.params.id
    let pallet = req.params.otherId
    StockV.find({refNumber:refNumber,status:'dispatched',pallet:pallet},function(err,docs){
    
     
    
      res.render('kambucha/dispatchedCases',{listX:docs})
    
    })
    
    
    
    })





    router.get('/remainingCasesPallet/:id/:otherId',function(req,res){
      let refNumber = req.params.id
      let pallet = req.params.otherId
      StockV.find({refNumber:refNumber,status:'received',pallet:pallet},function(err,docs){
      
       
      
        res.render('kambucha/remainingCases',{listX:docs})
      
      })
      })


      /*************/
   
      router.get('/batchListDispatch',function(req,res){
        BatchR.find(function(err,docs){
        
          let arr=[]
          for(var i = docs.length - 1; i>=0; i--){
        
            arr.push(docs[i])
          }
        
          res.render('kambucha/batchListDisp',{listX:arr})
        
        })
        
        
        
        })
        
        
        
        
            
        router.get('/receivedCasesDispatch/:id',function(req,res){
          let refNumber = req.params.id
          StockV.find({refNumber:refNumber},function(err,docs){
          
           
          
            res.render('kambucha/rcvdCasesDisp',{listX:docs})
          
          })
          
          
          
          })
        
        
        
          router.get('/dispatchedCases2/:id',function(req,res){
            let refNumber = req.params.id
            StockV.find({refNumber:refNumber,status:'dispatched'},function(err,docs){
            
             
            
              res.render('kambucha/dispatchedCasesDisp',{listX:docs})
            
            })
            
            
            
            })
        
        
        
        
            router.get('/remainingCasesDisp/:id',function(req,res){
              let refNumber = req.params.id
              StockV.find({refNumber:refNumber,status:'received'},function(err,docs){
              
               
              
                res.render('kambucha/remainingCasesDisp',{listX:docs})
              
              })
              
              
              
              })
        

















      
  router.get('/rtnsNumberUpdate',isLoggedIn,function(req,res){
    var id = req.user._id
   
      InvoNum.find(function(err,doc){
        let invoiceNum = doc[0].num
        let invoId = doc[0]._id
    
    
    User.findByIdAndUpdate(id,{$set:{rtnsNumber:invoiceNum}},function(err,docs){
    
    })
    invoiceNum++
    
    InvoNum.findByIdAndUpdate(invoId,{$set:{num:invoiceNum}},function(err,tocs){
    
    })

    res.redirect('/rtnsInwards')
    
      })
    
    })




router.get('/rtnsInwards',isLoggedIn,function(req,res){
  var errorMsg = req.flash('danger')[0];
  var successMsg = req.flash('success')[0];
  var invoiceNumber = req.user.rtnsNumber
  res.render('kambucha/inwards',{rtnsNumber:invoiceNumber,successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg})
})
  
router.post('/rtnsInwards',isLoggedIn,function(req,res){
  //console.log(req.body)
  //res.render('kambucha/invoice')
  var m = moment()
  let number1
  let subtotal
  let arr16 = []
  let ar1 =[]
  let ar2 = []
  let ar3 = []
  let ar4 = []
  var rtnsNumber = req.user.rtnsNumber
  var month = m.format('MMMM')
  let dateValue = m.valueOf()
  var year = m.format('YYYY')
  var mformat = m.format('L')
  var salesPerson = req.body.salesPerson



  req.check('salesPerson','Enter Salesperson').notEmpty();
               
  
  var errors = req.validationErrors();
  
  if (errors) {
    
    req.session.errors = errors;
    req.session.success = false;
    req.flash('danger', req.session.errors[0].msg);
  
  
    res.redirect('/rtnsInwards');
  
  }
  else{

  
 

  ar1.push(req.body['product[]'])
  ar2.push(req.body['quantity[]'])
  ar3.push(req.body['price[]'])
  ar4.push(req.body['reason[]'])

console.log(ar1[0].length,'ha')

  
if(ar1[0].length >1){
ar1 = ar1[0].filter(v=>v!='')
ar2 = ar2[0].filter(v=>v!='')
ar3 = ar3[0].filter(v=>v!='')
ar4 = ar4[0].filter(v=>v!='')
}

console.log(ar1,'iwee1')
console.log(ar2,'iwee2')
console.log(ar3,'iwee3')
console.log(ar4,'iwee4')
for(var i = 0; i<ar1.length;i++){
  console.log(i,'ss')
  console.log(ar1.length,'unai')
console.log(ar1[i])
let code = ar1[i]

let qty1 = ar2[i]
let price1 = ar3[i]
let reason = ar4[i]
let reg = /\d+\.*\d*/g;
let resultQty = qty1.match(reg)
let qty = Number(resultQty)


let resultPrice = price1.match(reg)
let price = Number(resultPrice)

let total = qty * price

var book = new RtnsSubBatch();
book.item = ar1[i]

book.rtnsNumber = rtnsNumber

book.salesPerson = salesPerson
book.qty = qty
book.price = price
book.total = total
book.reason = reason
book.month = month
book.year = year
book.date = mformat
//book.invoiceNumber = invoiceNumber

book.status = 'not saved'

book.type = "Rtns Inwards"

book.size = i
book.subtotal = 0



    
     
      book.save()
        .then(title =>{


      
   

        })

       
}
  
res.redirect('/updateStockSale')
  }
})



router.get('/updateStockSale',isLoggedIn,function(req,res){
  let arrV = []
  var rtnsNumber = req.user.rtnsNumber
  RtnsSubBatch.find({rtnsNumber:rtnsNumber},function(err,docs){

console.log(docs.length)
    for(var i = 0;i<docs.length; i++){
      console.log(docs[i].qty,'serima')
    arrV.push(docs[i].qty)
      }
      //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
     console.log(arrV,'arrV')

 //InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
  number1=0;
  for(var z in arrV) { number1 += arrV[z]; }


  RtnsSubBatch.find({rtnsNumber:rtnsNumber},function(err,docs){
    for(var i = 0;i <docs.length;i++){
      let id =  docs[i]._id
      RtnsSubBatch.findByIdAndUpdate(id,{$set:{subtotal:number1}},function(err,focs){
    
      })
    }
    })
  console.log(number1,'number2')

  res.redirect('/updateStockSale0')

  })


})



router.get('/updateStockSale0',isLoggedIn,function(req,res){
  let arrV = []
  var rtnsNumber = req.user.rtnsNumber
  RtnsSubBatch.find({rtnsNumber:rtnsNumber},function(err,docs){

console.log(docs.length)
    for(var i = 0;i<docs.length; i++){
      console.log(docs[i].qty,'serima')
    arrV.push(docs[i].qty)
      }
      //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
     console.log(arrV,'arrV')

 //InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
  number1=0;
  for(var z in arrV) { number1 += arrV[z]; }


  RtnsSubBatch.find({rtnsNumber:rtnsNumber},function(err,docs){
    for(var i = 0;i <docs.length;i++){
      let id =  docs[i]._id
      RtnsSubBatch.findByIdAndUpdate(id,{$set:{subtotal:number1}},function(err,focs){
    
      })
    }
    })
  console.log(number1,'number2')

  res.redirect('/updateStockSale1')

  })
 

})



router.get('/updateStockSale1',isLoggedIn,function(req,res){
  var rtnsNumber = req.user.rtnsNumber
  console.log(rtnsNumber,'returnsNumber33')


    
        RtnsSubBatch.find({rtnsNumber:rtnsNumber},function(err,ocs){
          console.log(ocs,'ocbgs')
  //res.redirect('/updateStockSale2')

  res.redirect('/rtnsSubFile')

        })
})

///////////////////

router.get('/rtnsSubFile',isLoggedIn,function(req,res){
  let rtnsNumber = req.user.rtnsNumber
  RtnsSubBatch.find({rtnsNumber:rtnsNumber},function(err,docs){
   //console.log(docs,'docv')
   if(docs.length > 0){
     for(var i = 0; i<1;i++){
       let item = docs[i].item
       let rtnsNumber = docs[i].rtnsNumber
       let qty = docs[i].qty
       
       let total = docs[i].subtotal
       
      
       let date = docs[i].date
       let month = docs[i].month
       let year = docs[i].year
       let salesPerson = docs[i].salesPerson

       /*let month = docs[i].month
       let year = docs[i].year
       let date = docs[i].date*/
       let subtotal = docs[i].subtotal
   
      
 
   
           var invo = new ReturnsSubFile();
        
           invo.rtnsNumber = rtnsNumber
           invo.item =item
      
           invo.qty = qty
        
           invo.total = subtotal
          
           invo.date = date
           invo.month = month
           invo.year = year
           invo.salesPerson = salesPerson
        
           /*invo.month = month
           invo.year = year
           invo.date = date*/
       
           invo.subtotal = subtotal
           
           invo.save()
     .then(user =>{
      
      
    
   
       })
   
     }
    // res.redirect('/arrInvoiceSubUpdate')
    res.redirect('/updateStockSale2')

   }
   })
   
   
   })
 
 

router.get('/updateStockSale2',isLoggedIn,function(req,res){
  let arrV = []
  var rtnsNumber = req.user.rtnsNumber
  console.log(rtnsNumber,'returnsNumber33')

    //let qty1 = docs[0].qty
   /* let qtyV = docs[i].qty / 12
    let qty = docs[i].qty*/



    
       Product.find(function(err,ocs){
           //console.log(ocs,'ocs')

           for(var i = 0;i<ocs.length;i++){
         let product = ocs[i].name
         console.log(product,'product')
            RtnsSubBatch.find({rtnsNumber:rtnsNumber,item:product},function(err,pocs){
              if(pocs.length > 0){
                let salesPerson = pocs[0].salesPerson
              for(var i = 0;i<pocs.length; i++){
                console.log(pocs[i].qty,'serima')
              arrV.push(pocs[i].qty)
                }
                //adding all incomes from all lots of the same batch number & growerNumber & storing them in variable called total
               console.log(arrV,'arrV')
         
           //InvoiceSubBatch.find({invoiceNumber:invoiceNumber},function(err,docs){
            number1=0;
            for(var z in arrV) { number1 += arrV[z]; }
           /* let cases3 = ocs[i].qty / 12
            let qty = ocs[i].qty
            let salesPerson = ocs[i].salesPerson
            let product = ocs[i].item*/
            let cases3 = number1 / 12

            SaleStock.find({salesPerson:salesPerson,product:product}, function(err,yocs){
            let id = yocs[0]._id
            console.log(i,'i')
            let cases = yocs[0].holdingCases - cases3
            let qty2 = yocs[0].qty - number1
            console.log(yocs[0].qty,'salesStock',number1,'rtnsStock')
            console.log(qty2,'qty2')

            SaleStock.findByIdAndUpdate(id,{$set:{holdingCases:cases,qty:qty2}},function(err,vocs){

              if(!err){
                //console.log(vocs,'roadmap')
              }
      
            })
            })
        
          



          
        


          /*req.flash('success', 'Stock Returned Successfully!');
  
          res.redirect('/rtnsInwards')*/  
          }

        })

      }


     // req.flash('success', 'Stock Returned Successfully!');
  
          res.redirect('/viewRtns2')
    })
        

    
   
  

})




router.get('/viewRtns2',isLoggedIn,function(req,res){
  var rtnsNumber = req.user.rtnsNumber
  RtnsSubBatch.find({rtnsNumber:rtnsNumber},function(err,ocs){

   // console.log(docs,'ok')
    //res.render('kambucha/pdf',{listX:docs})

    res.redirect('/viewRtns3/')
  })

})

router.get('/viewRtns3',isLoggedIn,function(req,res){
  var rtnsNumber = req.user.rtnsNumber
  RtnsSubBatch.find({rtnsNumber:rtnsNumber},function(err,ocs){

   // console.log(docs,'ok')
    //res.render('kambucha/pdf',{listX:docs})

    res.redirect('/viewRtns/'+rtnsNumber)
  })

})




router.get('/viewRtns/:id',isLoggedIn,function(req,res){
  var rtnsNumber = req.params.id

  ReturnsSubFile.find(function(err,docs){

    RtnsSubBatch.find({rtnsNumber:rtnsNumber},function(err,locs){

   // console.log(docs,'ok')
    res.render('kambucha/pdfR',{listX:locs,listX2:docs})
  })
  })

})





















router.get('/salesAuto',function(req,res){
  console.log('dog day')
  SalesList.find(function(err,docs){
    res.send(docs)
  })
})


router.post('/salesAuto2',function(req,res){
let  code = req.body.code
console.log(code)
SalesList.find({salesPerson:code}, function(err,docs){
    console.log(docs,'docs')
    res.send(docs[0])
  })
})

router.get('/salesStockAuto',isLoggedIn,function(req,res){
  console.log('dog day')
  var fullname = req.user.fullname
  SaleStock.find({salesPerson:fullname},function(err,docs){
    console.log(docs,'seat of dragon')
    res.send(docs)
  })
})

router.post('/salesStockAuto2',isLoggedIn,function(req,res){
  let  code = req.body.code
  let salesPerson = req.user.fullname
  console.log(code)
  SaleStock.find({salesPerson:salesPerson,product:code}, function(err,docs){
      console.log(docs,'docs')
      res.send(docs[0])
    })
  })


  

router.post('/batchAuto',function(req,res){
  var product = req.body.code
  console.log(product,'pro7')
  BatchR.find({status:"received",product:product},function(err,docs){
    res.send(docs)
  })
})


router.post('/batchAutoStock',function(req,res){
  var product = req.body.code
  var arr = []
  console.log(product,'pro7')
  Warehouse.find({product:product},function(err,docs){
    for(var i = 0;i<docs.length;i++){
 
 
      if(arr.length > 0 && arr.find(value => value.product == docs[i].product)){
             console.log('true')
            arr.find(value => value.product == docs[i].product).cases += docs[i].cases;
       }else{
arr.push(docs[i])
       }

     
   }
   //console.log(arr,'arr')
  
    res.send(arr)
  })
})




router.post('/batchAutoStockProduct',isLoggedIn,function(req,res){
  var product = req.body.code
  var id= req.user._id
 
  User.findByIdAndUpdate(id,{$set:{product:product}},function(err,docs){

    res.send(docs)
  })
})





router.post('/batchAutoRtns',isLoggedIn,function(req,res){
  var reason = req.body.code
  var product = req.user.product
  var arr = []
  console.log(product,reason,'pro7')
  Warehouse.find({product:product,reason:reason},function(err,docs){
    for(var i = 0;i<docs.length;i++){
 
 
      if(arr.length > 0 && arr.find(value =>value.reason == docs[i].reason   && value.product == docs[i].product)){
             console.log('true')
            arr.find(value => value.product == docs[i].product).quantity += docs[i].quantity;
       }else{
arr.push(docs[i])
       }

     
   }
   //console.log(arr,'arr')
  
    res.send(arr)
  })
})
























router.get('/eodRepoView',isLoggedIn,function(req,res){
  console.log(arrStatementR,'arrRefs')
  arrStatementR=[]
    //var code = "Tiana Madzima"

let date = req.user.date
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
        
        res.redirect('/statementGenView/')
      
    
    /*})*/
    
    })
    

    router.get('/statementGenView',function(req,res){

res.render('kambucha/stockSummaryT2',{listX:arrStatementR})


    })



    router.post('/modal',function(req,res){
let salutation = req.body.salutation
let firstName = req.body.firstName
let lastName = req.body.lastName
let customer = req.body.customer
let email = req.body.email
let mobile = req.body.mobile
let mobile2 = req.body.mobile2
let address = req.body.address
let town = req.body.town
let city = req.body.city
let country = req.body.country
var arrX=[]
let companyName = req.body.companyName


console.log(salutation,firstName,lastName,customer,email,mobile,mobile2,address, town,city,country,'data bho')

Customer.findOne({'companyName':companyName})
.then(user =>{
  if(user){ 

    res.send(user)

  }else{
      var book = new Customer();
          book.salutation = salutation
          book.firstName= firstName
          book.lastName = lastName
          book.companyName = companyName
          book.email = email
          book.mobile = mobile
          book.mobile2 = mobile2
          book.address = address
          book.town= town
          book.city = city
          book.country=country
        
              
               
                book.save()
                  .then(pro =>{
        
                 
                    res.send(arrX)
                 
                  
                
                })

  }
})

    })



///view approved requisitions, for receiving stock
    router.get('/approvedRequisitions',isLoggedIn,function(req,res){
      BatchRR.find({status:'pending'},function(err,docs){
    
        res.render('kambucha/vouchers',{listX:docs})
      })
    })
      
    
    router.get('/grvList',isLoggedIn,function(req,res){
      BatchRR.find({status:"complete"},function(err,docs){
        res.render('kambucha/grvList',{listX:docs})
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
  res.render('kambucha/rcvBatch',{pro:pro,id:id,refNumber:refNumber,item:item,
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

    


res.redirect('/receiveMaterialV/'+id)

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

  res.redirect('/receiveMaterial/'+id)
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
  
   res.render('kambucha/addMaterial',{date:date,supplier:supplier,
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
 
      let size = docs.length - 1
      let mass = docs[size].closingMass
      let subtotal = mass / 50
      subtotal.toFixed(2)
    for(var i = 0; i<docs.length;i++){
      let id = docs[i]._id
      StockRM.findByIdAndUpdate(id,{$set:{subtotal:subtotal}},function(err,locs){

        
      })
    }

    res.redirect('/stockRMFile/'+refNumber)

    })
  })


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

  /*var stock = new StockRMFile();
  stock.weight = weight
  stock.weightTonne = weightTonne
  stock.date = date
  stock.address = address
  stock.regNumber = regNumber
  stock.item = item
  stock.supplier = supplier
  stock.driver = driver
  stock.idNumber = idNumber
  stock.trailer = trailer
  stock.refNumber = id
  stock.mobile = mobile
  stock.month = month
  stock.year = year
  stock.openingWeight = openingWeight
  stock.openingWeightTonne = openingWeightTonne
  stock.closingWeight = closingWeight
  stock.closingWeightTonne = closingWeightTonne
  stock.dateValue = dateValue

  stock.save()
  .then(pro =>{


 
   // res.redirect('/viewGRV/'+id)

  })*/

  res.redirect('/grvFileV/'+id)

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

      res.render('kambucha/grv2',{listX:locs,listX2:docs})
    })
    })
  
  })

router.get('/grvFileV/:id',function(req,res){
  var id = req.params.id
  res.redirect('/grvFile/'+id)
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
    
    
    res.redirect('/viewGRV/'+batchId)
    
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



      router.get('/updateBatchRR',function(req,res){
        BatchRR.find(function(err,docs){
          for(var i = 0;i<docs.length;i++){
           let id = docs[i]._id
           BatchRR.findByIdAndRemove(id,(err,doc)=>{
      
           }) 
          }
          res.redirect('/updateStockRM')
        })
      })

      router.get('/updateStockRM',function(req,res){
        StockRM.find(function(err,docs){
          for(var i = 0;i<docs.length;i++){
           let id = docs[i]._id
           StockRM.findByIdAndRemove(id,(err,doc)=>{
      
           }) 
          }
          //res.redirect('/batchRM')
          res.redirect('/updateRepoF')
        })
      })
      
      router.get('/updateRepoF',function(req,res){
        RepoFiles.find(function(err,docs){
          for(var i = 0;i<docs.length;i++){
           let id = docs[i]._id
           RepoFiles.findByIdAndRemove(id,(err,doc)=>{
      
           }) 
          }
          //res.redirect('/batchRM')
          res.redirect('/batchRM')
        })
      })
      

router.get('/stockRequisition',isLoggedIn,function(req,res){
  var errorMsg = req.flash('danger')[0];
  var successMsg = req.flash('success')[0];
res.render('kambucha/batchRequisition',{successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg})

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


    res.redirect('/stockRequisition');
        
      
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


          res.redirect('/stockRequisition');
          
    })




    }

})






router.get('/importTanks',function(req,res){
  var pro = req.user

 
  var errorMsg = req.flash('danger')[0];
  var successMsg = req.flash('success')[0];


   title = "Import Tanks"

  

  
 res.render('imports/tanks',{pro:pro,title:title,successMsg: successMsg,errorMsg:errorMsg, noMessages: !successMsg,noMessages2:!errorMsg}) 

   })



  
 router.post('/importTanks', uploadX.single('file'),function(req,res){



 
   
 /*  if(!req.file){
       req.session.message = {
         type:'errors',
         message:'Select File!'
       }     
         res.render('imports/students', {message:req.session.message,pro:pro}) */
         if (!req.file || req.file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
           req.session.message = {
               type:'errors',
               message:'Upload Excel File'
             }     
               res.render('imports/tanks', {message:req.session.message,pro:pro
                    
                }) 
 
 
 
       }
         
       else{

       
           const file = req.file.filename;
   
           
                var wb =  xlsx.readFile(`./public/uploads/` + file)
        
                var sheets = wb.Sheets;
                var sheetNames = wb.SheetNames;
    
                var sheetName = wb.SheetNames[0];
    var sheet = wb.Sheets[sheetName ];
    
       for (var i = 0; i < wb.SheetNames.length; ++i) {
        var sheet = wb.Sheets[wb.SheetNames[i]];
    
        console.log(wb.SheetNames.length)
        var data =xlsx.utils.sheet_to_json(sheet)
            
        var newData = data.map(async function (record){
    
       
        
     
         
      
      
     
           let tankNumber = record.tankNumber;
        
           req.body.tankNumber=record.tankNumber


       req.check('tankNumber','Enter Tank Month').notEmpty();

   

var errors = req.validationErrors();
 
if (errors) {
 
 req.session.errors = errors;
 req.session.success = false;
 console.log( req.session.errors[0].msg)
 req.flash('danger', req.session.errors[0].msg);
      
       
 res.redirect('/importTanks');

}

else


           {
             BlendingTanks.findOne({'tankNumber':tankNumber})
             .then(user =>{
                 if(user){ 
               // req.session.errors = errors
                 //req.success.user = false;
           
           
           
                 req.flash('danger', 'Tank already in the system');

                 res.redirect('/importTanks') 
 
                 //res.redirect('/records/import')
               
           }
           else





           var user = new BlendingTanks();
           user.tankNumber = tankNumber
           user.litres = 0
           user.product = 'null'
           user.refNumber = 'null'

          
          
          
           user.save()
             .then(user =>{
              
             
                 
             /*  req.session.message = {
                 type:'success',
                 message:'Account Registered'
               }  
               res.render('imports/teacherX',{message:req.session.message});*/
             })

           })
         }
                  
                   // .catch(err => console.log(err))
                 
               
                   
                 
                 
        
                 
                 
                 
                   
                   
       
                  
       
                  
            
               })
               
               req.flash('success', 'File Imported Successfully!');
 
               res.redirect('/importTanks') 
     
       }
     }
 
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
    