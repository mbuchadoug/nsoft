//require('./seed/product-seeder');

var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
var mongoose = require('mongoose');
var session = require('express-session');
var validator = require('express-validator');
var flash = require('connect-flash');
var passport = require('passport');

const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');


var indexRoute= require('./routes/index')
var indexRoute1= require('./routes/account1')
var indexRoute2= require('./routes/account2')
var indexRoute3= require('./routes/account3')
var indexRoute4= require('./routes/account4')

var indexRoute5= require('./routes/receiver')
var indexRoute6= require('./routes/dispatch')
var indexRoute7= require('./routes/rm')
var indexRoute8= require('./routes/admin')
var indexRoute9= require('./routes/sales')
var indexRouteX= require('./routes/deliveries')
var indexRouteX2= require('./routes/preRcv')
/* var recordsRoute = require('./routes/records')
 var studentRoute= require('./r./routes/preRcv
 var teacherRoute= require('./r./routes/receiver
 var clerkRoute = require('./r./routes/dispatchf
 var parentRoute = require('./routes/parent')
 var packageRoute = require('./routes/payment')
 var hurlingRoute = require('./routes/hurlings')
 var hostelRoute = require('./routes/hostel')
 var hostelTeacherRoute = require('./routes/hostelTeacher')
 var hostelStudentRoute = require('./routes/studentHostel')*/



var app = express();
const mongoURI =process.env.MONGO_URL|| 'mongodb://0.0.0.0:27017/kambuchaDB'
const conn = mongoose.createConnection(mongoURI);

// Init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);  
  gfs.collection('uploads');
});
mongoose.connect(process.env.MONGO_URL ||'mongodb://0.0.0.0:27017/kambuchaDB',{
  useUnifiedTopology: true ,
  
} )

mongoose.connection.on('connected',()=>{
    console.log('Mongoose is connected!!!')
})




require('./config/passport');
//app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'mainLayout',handlebars: allowInsecurePrototypeAccess(Handlebars) }));

app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());

app.use(cookieParser());
app.use(session({secret: 'mysupersecret', resave: false, saveUninitialized: false}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    res.locals.oldUrl = req.url;
    res.locals.message = req.session.message;
    req.session.message = null;
    next();
});

app.use('/', indexRoute);
app.use('/accounts1', indexRoute1);
app.use('/accounts2', indexRoute2);
app.use('/accounts3', indexRoute3);
app.use('/accounts4', indexRoute4);
app.use('/receiver', indexRoute5);
app.use('/dispatch', indexRoute6);
app.use('/rm', indexRoute7);
app.use('/admin', indexRoute8);
app.use('/sales', indexRoute9);
app.use('/merch', indexRouteX);
app.use('/admin', indexRouteX2);






const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
