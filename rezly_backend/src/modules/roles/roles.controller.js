import Role from "../../../DB/models/role.model.js";
import Permission from "../../../DB/models/permission.model.js";
import userModel from "../../../DB/models/user.model.js";
import { AppError } from "../../Utils/catchError.js";

export const listRoles = async (req, res, next) => {
  try {
    const roles = await Role.find().populate("permissions").lean();
    return res.status(200).json({ status: "success", data: roles });
  } catch (err) { next(err); }
};

export const createRole = async (req, res, next) => {
  try {
    const { name, description, permissions = [] } = req.body;
    const exists = await Role.findOne({ name });
    if (exists) return next(new AppError("Role name already exists", 409));
    // تحقق من صلاحية الـ permissions
    if (!Array.isArray(permissions)) return next(new AppError("permissions must be array of permission ids", 400));
    const foundPermissions = await Permission.find({ _id: { $in: permissions } }).select("_id").lean();
    if (foundPermissions.length !== permissions.length) return next(new AppError("One or more permission ids are invalid", 400));
    const role = await Role.create({ name, description, permissions });
    return res.status(201).json({ status: "success", data: role });
  } catch (err) { next(err); }
};

export const updateRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, permissions, active } = req.body;
    const role = await Role.findById(id);
    if (!role) return next(new AppError("Role not found", 404));
    if (name && name !== role.name) {
      const exists = await Role.findOne({ name });
      if (exists) return next(new AppError("Another role with this name exists", 409));
    }
    if (permissions) {
      const foundPermissions = await Permission.find({ _id: { $in: permissions } }).select("_id").lean();
      if (foundPermissions.length !== permissions.length) return next(new AppError("One or more permission ids are invalid", 400));
      role.permissions = permissions;
    }
    role.name = name ?? role.name;
    role.description = description ?? role.description;
    if (typeof active === "boolean") role.active = active;
    await role.save();
    // عند تغيير اسم الدور، حدّث الحقل النصي في المستخدمين (ليبقى متوافقًا)
    if (name) {
      await userModel.updateMany({ roleId: role._id }, { $set: { role: name } });
    }
    return res.status(200).json({ status: "success", data: role });
  } catch (err) { next(err); }
};

export const deleteRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    // منع الحذف إذا مرتبط موظف
    const linked = await userModel.findOne({ roleId: id }).lean();
    if (linked) return next(new AppError("Cannot delete role: it is assigned to employees", 400));
    // بدلاً من حذف نهائي يمكن تعيين active=false، لكن هنا نحذف نهائياً
    await Role.findByIdAndDelete(id);
    return res.status(200).json({ status: "success", message: "Role deleted" });
  } catch (err) { next(err); }
};
