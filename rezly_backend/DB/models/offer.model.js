import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"], // نسبة أو مبلغ ثابت
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    appliesTo: {
      type: String,
      enum: ["all", "package"], // الكل أو باكيج معيّن
      default: "all",
    },
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: function () {
        return this.appliesTo === "package";
      },
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Offer = mongoose.model("Offer", offerSchema);
export default Offer;