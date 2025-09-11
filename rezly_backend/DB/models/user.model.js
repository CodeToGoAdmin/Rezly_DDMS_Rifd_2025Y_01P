//import { required } from "joi";
import mongoose, {model,Schema} from "mongoose";
const userSchema= new Schema({
    userName:{
        type: String,
        required: true,
        min: 4,
        max: 20,
    },
        email:{
            type: String,
            unique: true,
        },
        password:{
            type: String,
            required: true,
        },
        image:{
            type:Object,
        },
        phone:{
            type:String,
        },
        confirmEmail:{
            type:Boolean,
            default:false,
        },
        gender:{
            type:String,
            enum:['Male','Female'],
        },
        ///////////////////////////////
        midicalIssue:{
            type:String,

        },
        //////////////////////////
        status:{
            type:String,
            default:'Active',
            enum:['Active','NotActive']
        },
        role:{
            type: String,
            default:'Trainer',
            enum:['Trainer','Admin','Coach','Receptionist']
        },
         refreshToken: { 
            type: String 
        }
},
{ timestamps:true,
    });
    const userModel= model('User',userSchema);
    export default userModel;