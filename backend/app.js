const dotenv=require('dotenv')
dotenv.config();
const connectDb =require('./db/db')
const cors=require('cors')
const cookieParser=require('cookie-parser')
const express=require('express')
const morgan =require('morgan')

const userRoutes=require('./routes/user.router')
const captainRouter=require('./routes/captain.router')
const mapRouter=require('./routes/map.routes');
const rideRouter=require('./routes/ride.router');

connectDb()

const app=express();

app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser())
app.use(cors({
    origin:'*'
}))
app.use(express.urlencoded({ extended: true }));

app.use('/user',userRoutes);
app.use('/captain',captainRouter);
app.use('/maps',mapRouter);
app.use('/ride',rideRouter);

app.get("/",(req,res)=>{
    res.send("Hello world");
})

module.exports=app