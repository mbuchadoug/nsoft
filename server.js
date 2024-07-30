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

/* var recordsRoute = require('./routes/records')
 var studentRoute= require('./routes/student')
 var teacherRoute= require('./routes/teacher')
 var clerkRoute = require('./routes/clerk')
 var parentRoute = require('./routes/parent')
 var packageRoute = require('./routes/payment')
 var hurlingRoute = require('./routes/hurlings')
 var hostelRoute = require('./routes/hostel')
 var hostelTeacherRoute = require('./routes/hostelTeacher')
 var hostelStudentRoute = require('./routes/studentHostel')*/



var app = express();
const mongoURI =process.env.MONGO_URL|| 'mongodb://0.0.0.0:27017/smsDB'
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






const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
