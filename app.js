const express = require('express');
const app = express();
const morgan = require('morgan')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const productRoutes = require('./ap1/routes/products')
const orderRoutes = require('./ap1/routes/orders')
const userRoutes = require('./ap1/routes/user')


mongoose.connect("mongodb+srv://vibhasuma:mypetjimmy@cluster0-afupk.mongodb.net/test?retryWrites=true&w=majority", {
	useUnifiedTopology: true,
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log("connected to DB")
});
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req,res,next) => {
    res.header('Access-Control-Allow-Origin',"*");
    res.header('Access-Control-Allow-Headers','Origin',"X-Requested-With,Content-Type,Accept,Authorization")
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT','POST','PATCH','GET','DELETE');
        return res.status(200).json({});
    }
    next();
});



app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

app.use((req,res,next) => {
    const error = new Error('Not found')
    error.status=404
    next(error);
})

app.use((error,req,res,next) => {
    res.status(error.status || 500)
    res.json({
        error:{
            message:error.message
        }
    })
})

// app.use((req,res,next) => {
//     res.status(200).json({
//         message: 'It works!'
//     });
// });

module.exports = app;