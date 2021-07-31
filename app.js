var createError 			 = require('http-errors')
var express 				 = require('express')
var cors 					 = require('cors')
var path 					 = require('path')
var cookieParser 			 = require('cookie-parser')
var logger 					 = require('morgan')
var bodyParser 				 = require('body-parser')
var mongoose 				 = require('mongoose')
var authenticationMiddleware = require('./middlewares/index')
var cron 					 = require('node-cron')
var dotenv 					 = require('dotenv')
// get config vars
dotenv.config()

const jwt 				= require('jsonwebtoken')
const nodemailer		= require('nodemailer')
const cronJobController	= require('./controllers/cronJobController')
 
// Routes
var indexRouter 	= require('./routes/index')
var usersRouter 	= require('./routes/users')
var productsRouter 	= require('./routes/products')
var ordersRouter 	= require('./routes/orders')
var leadsRouter 	= require('./routes/leads')
var websiteRouter 	= require('./routes/website')

// Cron Job 0 * * * *
cron.schedule('0 * * * *', cronJobController.index)

var app = express()
// Enable All CORS Requests
app.use(cors())

//configure bodyparser to hande the post requests
app.use(bodyParser.urlencoded({
    extended: true,
	limit: '50mb'
}))
app.use(bodyParser.json())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});
const mongo = mongoose.connect(process.env.MONGOURI, {
	useNewUrlParser: true, 
	useUnifiedTopology: true,
	useCreateIndex: true	
})
mongo.then(() => {
    console.log('Database Connected')
}, error => {
    console.log(error, 'error')
})

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({
	extended: false
}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

//Routes Binding 
app.use('/api', 	indexRouter)
app.use('/web', websiteRouter)
app.use('/users', 		 usersRouter)
app.use('/products', 	 productsRouter)
app.use('/orders', 		authenticationMiddleware, ordersRouter)
app.use('/leads', 		authenticationMiddleware, leadsRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}

	// render the error page
	res.status(err.status || 500)
	res.render('error')
})

app.listen(5000, console.log(`Server Started On Port 5000`))
module.exports = app
