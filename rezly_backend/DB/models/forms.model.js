import mongoose from "mongoose";

const FieldSchema = new mongoose.Schema({
  fieldId: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, enum: ["text", "number", "radio", "checkbox", "dropdown"], required: true },
  required: { type: Boolean, default: false },
  options: { type: [String], default: [] },
  visibility: { type: Boolean, default: true }, // true = visible, false = hidden
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const FormSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  fields: [{ type: mongoose.Schema.Types.ObjectId, ref: "Field" }],
  status: { type: String, enum: ["active", "inactive", "archived"], default: "active" },
  version: { type: Number, default: 1 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const SubmissionSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: "Form", required: true },
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: "Member", required: true },
  answers: [
    {
      fieldId: { type: mongoose.Schema.Types.ObjectId, required: true },
      answer: mongoose.Schema.Types.Mixed
    }
  ],
  submittedAt: { type: Date, default: Date.now }
});

const MemberFormAssignmentSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  formId: { type: mongoose.Schema.Types.ObjectId, ref: "Form", required: true },
  status: { type: String, enum: ["assigned", "in_progress", "completed","canceled"], default: "assigned" },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // مين اللي عين
  assignedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  answers: [
    {
      fieldId: { type: String, required: true },
      value: { type: mongoose.Schema.Types.Mixed } // نص، رقم، خيارات، ... حسب نوع الحقل
    }
  ]
});

export const Field = mongoose.model("Field", FieldSchema);
export const Form = mongoose.model("Form", FormSchema);
export const Submission = mongoose.model("Submission", SubmissionSchema);
export const MemberFormAssignment = mongoose.model("MemberFormAssignment", MemberFormAssignmentSchema);