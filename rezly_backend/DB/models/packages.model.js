//import { required } from "joi";
import mongoose, {model,Schema} from "mongoose";
//import { arabicSlugify } from "../../src/Utils/ArabicSlug";

const packageSchema= new Schema({
    name:{
        type: String,
        required: true,
        trim:true,
      
    },slug: { 
        type: String,
        unique: true,
    },

    description:{
        type: String,
    },
    price_cents:{// عشان تخزين القيمة لو كان عندي كسور 
        type: Number,
        required: true,
        min: 1
    },
    currency:{ // عشان يحدد نوع العملة شيكل او دينار او يورو او دولار ..الخ
        type: String,
        required: true,
        minlength:3,
        maxlength:3,
        uppercase:true,
    },
    price_type:{// عشان الدفع لو يومي مرة وحد ة وخلص ولو اشتراك بصير في تكرار 
        type: String,
        required: true,
        enum:['OneTime','Recurring'],
    },
    duration_value:{// عدد الاشهر او الايام او الاسابيع اللي بدو يشترك فها
        type: Number,
        required: true,
        min:1,
    },
    duration_unit:{// انواع الاشتراك الزمنية }
        type: String,
        required: true,
        enum:['Days','Weeks','Months','Years'],
    },
    auto_renew:{
        type: Boolean,
        default:false,
    },
    trial_days:{// فترة تجريبية مجانية 
        type: Number,
        default:0,
        min:0,
    },
    active:{
        type: Boolean,
        default:true,
    },
    },
    { 
        timestamps:true,

});
/*packageSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = arabicSlugify(this.name);
  }
  next();
});*/

const Package= model('Package',packageSchema);
export default Package;