const mongoose =require('mongoose');
const bcrypt =require('bcrypt')
const jwt=require('jsonwebtoken')
const captainSchema=new mongoose.Schema({
    fullname:{
        firstname:{
            type:String,
            required:true,
            minlength:[2,"Minimum length of firstname"]
        },
        lastname:{
            type:String,
            // minlength:[2,"Minimum length of lastname"]
        }
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
         match: [ /^\S+@\S+\.\S+$/, 'Please enter a valid email' ]
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    socketId:{
        type:String
    },
    status:{
        type:String,
        enum:['active','inactive'],
        default:'inactive'
    },
    vehical:{
        color:{
            type:String,
            required:true,
            minlength:[3,'color must be greater than 3 character long']
        },
        plate:{
            type:String,
            required:true,
            unique:true,
            minlength:[3,'Vehical number must be greater than 3 character long']
        },
        capacity:{
            type:Number,
            required:true,
            min:[1,'capacity must be atleast 1']
        },
        vehicalType:{
            type:String,
            required:true,
            enum:['car','bike','auto']
        }
    },
    location:{
        lat:{
            type:Number
        },
        lng:{
            type:Number
        }
    }
})

captainSchema.methods.generateAuthToken=function(){
    const token=jwt.sign({_id:this._id},process.env.JWT_SECRET,{expiresIn:'24h'})
    return token;
}

captainSchema.methods.comparePassword=async function(password){
    return await bcrypt.compare(password,this.password)
}

captainSchema.statics.hashPassword=function(password){
    return bcrypt.hash(password,10);
}

const captainModel=mongoose.model('captain',captainSchema);

module.exports=captainModel;