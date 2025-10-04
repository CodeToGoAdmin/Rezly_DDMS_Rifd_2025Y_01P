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
            default:'Coach',
            enum:['Coach','Admin','Member','Receptionist']
        },
          role: {
    type: String,
    default: "Coach",
  },
  // الحقل الجديد مرجعي إلى Role
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    default: null,
  },

         refreshToken: { 
            type: String 
        },
        slug: { 
            type: String, 
        },
         sendCode:{
        type:String,
        default:null
    },
},
{ timestamps:true,
    });
    const userModel= model('User',userSchema);
    export default userModel;