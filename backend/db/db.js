
const mongosee=require('mongoose')

function connectDb(){
    mongosee.connect(process.env.MONGODB_URI)
    .then(()=>{
            console.log("Mongodb connected successfully");
        }).catch(err=>console.log(err.message))
} 
module.exports=connectDb;