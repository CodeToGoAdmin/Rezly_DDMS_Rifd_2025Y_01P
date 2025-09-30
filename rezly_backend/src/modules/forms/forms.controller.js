import { Field, Form, MemberFormAssignment } from "../../../DB/models/forms.model.js";
import userModel from "../../../DB/models/user.model.js";
import mongoose from "mongoose";
import { fieldsArraySchema ,fieldSchema, formSchema, formUpdateSchema } from "./forms.validation.js";


export const createForm = async (req, res) => {
  try {
    const { title, description, fields } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "عنوان الفورم مطلوب" });
    }

 const { error } = fieldsArraySchema.validate(fields, { abortEarly: false });
if (error) {
  return res.status(400).json({ message: error.details.map(d => d.message).join(", ") });
}


const preparedFields = fields.map(field => ({
  ...field,
  fieldId: field.fieldId || `field_${Math.random().toString(36).substring(2, 8)}`
}));

const createdFields = await Field.insertMany(preparedFields);
    const newForm = new Form({
      title,
      description,
      fields: createdFields.map(f => f._id),
  createdBy: req.user.id, 
      status: "active",
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newForm.save();

    res.status(201).json({
      message: "Form created successfully ✅",
      form: newForm,
      fields: createdFields
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "حدث خطأ أثناء إنشاء الفورم", error: error.message });
  }
};

export const updateForm = async (req, res) => {
  const { formId } = req.params;
  const updates = req.body;

  try {
    const form = await Form.findById(formId);
    if (!form) return res.status(404).json({ message: "Form غير موجود" });
if (req.user.role !== "Admin" && form.createdBy.toString() !== req.user._id.toString()) {
  return res.status(403).json({ message: "غير مسموح لك بتعديل هذا الفورم" });
}
    if (["inactive", "archived"].includes(form.status))
      return res.status(400).json({ message: `لا يمكن تعديل الفورم حالياً (${form.status})` });

    // Validation بس على الحقول المسموح تعديلها
    const { error } = formUpdateSchema.validate(updates, { abortEarly: false });
    if (error) return res.status(400).json({ message: error.details.map(d => d.message).join(", ") });

    Object.assign(form, updates);
    form.updatedAt = new Date();
    await form.save();

    res.status(200).json({ message: "Form updated ✅", form });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "حدث خطأ أثناء تعديل الفورم", error: err.message });
  }
};

export const updateFields = async (req, res) => {
  const { formId } = req.params;
  const updatesArray = req.body.fields; // مصفوفة من الحقول: { fieldId, ...updates }

  if (!Array.isArray(updatesArray) || updatesArray.length === 0)
    return res.status(400).json({ message: "يرجى إرسال مصفوفة من الحقول للتعديل" });

  try {
    const form = await Form.findById(formId).populate("fields");
    if (!form) return res.status(404).json({ message: "Form غير موجود" });
 if (req.user.role !== "Admin" && form.createdBy.toString() !== req.user._id.toString()) {
  return res.status(403).json({ message: "غير مسموح لك بتعديل هذا الفورم" });
}
    const updatedFields = [];

 for (const upd of updatesArray) {
  const field = form.fields.find(f => f.fieldId === upd.fieldId);
  if (!field) continue;

  // نسخ الحقل بدون الحقول اللي ممنوعة
  const validatedData = {
    ...upd
  };
  delete validatedData.createdAt;
  delete validatedData.updatedAt;

  const { error } = fieldSchema.validate(validatedData, { abortEarly: false });
  if (error) return res.status(400).json({ message: error.details.map(d => d.message).join(", ") });

  Object.assign(field, upd);
  field.updatedAt = new Date();
  await field.save();
  updatedFields.push(field);
}


    res.status(200).json({ message: "Fields updated ✅", fields: updatedFields });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "حدث خطأ أثناء تعديل الحقول", error: err.message });
  }
};

export const getForms = async (req, res) => {
  try {
    const { status, search } = req.query; // فلترة اختياريّة
    const user = req.user; // مفترض انك عامل middleware للتحقق من JWT أو session

    const filter = {};

    if (status && ["active", "inactive", "archived"].includes(status)) {
      filter.status = status;
    }

 if (search) {
  const keywords = search.split(" "); // تقسيم النص لكل كلمة
  filter.$or = keywords.map(word => ({
    $or: [
      { title: { $regex: word, $options: "i" } },
      { description: { $regex: word, $options: "i" } }
    ]
  }));
}

console.log(user);
    if (user.role!== "Admin") {
      filter.createdBy = user._id;
    }

    const forms = await Form.find(filter).populate("fields").sort({ createdAt: -1 });

    res.status(200).json({ message: "Forms fetched ✅", forms });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "حدث خطأ أثناء جلب الفورمات", error: err.message });
  }
};
export const getFormById = async (req, res) => {
  try {
    const { formId } = req.params;
    const user = req.user;

    const form = await Form.findById(formId).populate("fields");
    if (!form) return res.status(404).json({ message: "Form غير موجود" });

    if (user.role !== "Admin" && form.createdBy.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "غير مسموح لك بالوصول لهذا الفورم" });
    }

    res.status(200).json({ message: "Form fetched ✅", form });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "حدث خطأ أثناء جلب الفورم", error: err.message });
  }
};
export const duplicateForm =async (req, res) => {
  const { formId } = req.params;
  const user = req.user; // مفترض middleware يتحقق من الـ JWT

  const form = await Form.findById(formId).populate("fields");
  if (!form) return res.status(404).json({ message: "Form غير موجود" });

  // إذا الـ Coach، لازم يكون هو صاحب الفورم
  if (user.role !== "Admin" && !form.createdBy.equals(user._id)) {
    return res.status(403).json({ message: "ليس لديك صلاحية تكرار هذا الفورم" });
  }

  // Duplicate الحقول أولاً
  const newFields = [];
  for (const f of form.fields) {
    const fieldCopy = new Field({
      fieldId: f.fieldId,
      label: f.label,
      type: f.type,
      required: f.required,
      visibility: f.visibility,
      options: f.options
    });
    await fieldCopy.save();
    newFields.push(fieldCopy._id);
  }

  // Duplicate الفورم
  const newForm = new Form({
    title: `${form.title} - Copy`,
    description: form.description,
    fields: newFields,
    status: "active",
    createdBy: user._id
  });

  await newForm.save();
  const populatedForm = await newForm.populate("fields");

  res.status(201).json({ message: "Form duplicated ✅", form: populatedForm });
};


export const assignFormToMember = async (req, res) => {
  const { formId, memberId } = req.params; // هنا جاي من البارامز
  const user = req.user;

  try {
    const member = await userModel.findById(memberId);
    if (!member) return res.status(404).json({ message: "Member غير موجود" });
else if (member.role !== "Member") {
  return res.status(400).json({ message: "الـ user المختار ليس ميمبر" });
}
    const form = await Form.findById(formId);
    if (!form) return res.status(404).json({ message: "Form غير موجود" });

    if (user.role === "Coach" && form.createdBy.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "لا يمكنك تعيين فورم لم تقم بإنشائه" });
    }
    // تحقق من عدم التكرار
    const existingAssignment = await MemberFormAssignment.findOne({ memberId, formId });
    if (existingAssignment) {
      return res.status(400).json({ message: "تم بالفعل تعيين هذا الفورم لهذا العضو" });
    }

    // إنشاء الـ assignment
    const assignment = await MemberFormAssignment.create({
      memberId,
      formId,
      assignedBy: user._id,
      status: "assigned",
      answers: []
    });

    res.status(201).json({ message: "Form assigned successfully ✅", assignment });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "حدث خطأ أثناء تعيين الفورم", error: err.message });
  }
};

export const getAssignedFormsForMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { status, search } = req.query;
    const user = req.user; 
    const member = await userModel.findById(memberId);
    if (!member || member.role !== "Member") {
      return res.status(404).json({ message: "Member غير موجود أو غير صحيح" });
    }

    const filter = { memberId: memberId };

    if (status && ["assigned", "completed", "archived"].includes(status)) {
      filter.status = status;
    }


    if (user.role === "Coach") {
      filter.assignedBy = user._id;
    } else if (user.role === "Member" && user._id.toString() !== memberId) {
      return res.status(403).json({ message: "غير مصرح لك للوصول لهذه الفورمز" });
    }

    // 5️⃣ جلب البيانات
    const assignedForms = await MemberFormAssignment.find(filter)
      .populate("formId")
      .populate("assignedBy", "name email") // إذا حاب تظهر مين عين الفورم
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "Assigned forms fetched ✅", assignedForms });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "حدث خطأ أثناء جلب الفورمز المعينة", error: err.message });
  }
};
export const updateAssignmentStatus = async (req, res) => {
  try {
    const { assignmentId,status } = req.params;
    const user = req.user;

    const allowedStatuses = ["assigned", "in_progress", "completed", "canceled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "الحالة غير صحيحة" });
    }

    const assignment = await MemberFormAssignment.findById(assignmentId)
      .populate("formId")
      .populate("memberId", "name email role")
      .populate("assignedBy", "name email role");

    if (!assignment) {
      return res.status(404).json({ message: "Assignment غير موجود" });
    }

    // --- صلاحيات ---
    if (user.role === "Coach") {
      if (assignment.assignedBy._id.toString() !== user._id.toString()) {
        return res.status(403).json({ message: "غير مصرح لك لتعديل هذا الإساينمنت" });
      }
    } else if (user.role === "Member") {
      if (assignment.memberId._id.toString() !== user._id.toString()) {
        return res.status(403).json({ message: "غير مصرح لك لتعديل هذا الإساينمنت" });
      }
    }
    // الأدمن → يقدر يعدل أي assignment

    // --- تحديث الحالة ---
    assignment.status = status;
    if (status === "completed") {
      assignment.completedAt = new Date();
    }
    await assignment.save();

    res.status(200).json({
      message: "تم تحديث حالة الإساينمنت ✅",
      assignment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "حدث خطأ أثناء تحديث الحالة",
      error: err.message,
    });
  }
};
export const getAssignments = async (req, res) => {
  try {
    const { id } = req.query; // لو بدك Assignment واحد
    const user = req.user;

    let filter = {};

    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "الـ ID غير صالح" });
      }
      filter._id = id;
    }

    if (user.role === "Coach") {
      filter.assignedBy = user._id;
    } else if (user.role === "Member") {
      filter.memberId = user._id;
    }

    let assignments;
    if (id) {
      assignments = await MemberFormAssignment.findOne(filter);
      if (!assignments) {
        return res.status(404).json({ message: "Assignment غير موجود" });
      }
    } else {
      assignments = await MemberFormAssignment.find(filter);
    }

    res.status(200).json({
      message: id ? "Assignment details ✅" : "Assignments fetched ✅",
      assignments
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "حدث خطأ أثناء جلب الإساينمنتس",
      error: err.message
    });
  }
};
