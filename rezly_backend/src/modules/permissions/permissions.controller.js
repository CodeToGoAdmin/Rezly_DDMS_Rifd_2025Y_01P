import Permission from "../../../DB/models/permission.model.js";
import Role from "../../../DB/models/role.model.js";
import { AppError } from "../../Utils/catchError.js";

export const listPermissions = async (req, res, next) => {
  try {
    const permissions = await Permission.find().lean();
    return res.status(200).json({ status: "success", data: permissions });
  } catch (err) { next(err); }
};

export const createPermission = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const existing = await Permission.findOne({ name });
    if (existing) return next(new AppError("Permission name already exists", 409));
    const p = await Permission.create({ name, description });
    return res.status(201).json({ status: "success", data: p });
  } catch (err) { next(err); }
};

export const updatePermission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, active } = req.body;
    const permission = await Permission.findById(id);
    if (!permission) return next(new AppError("Permission not found", 404));
    if (name && name !== permission.name) {
      const exists = await Permission.findOne({ name });
      if (exists) return next(new AppError("Another permission with this name exists", 409));
    }
    permission.name = name ?? permission.name;
    permission.description = description ?? permission.description;
    if (typeof active === "boolean") permission.active = active;
    await permission.save();
    return res.status(200).json({ status: "success", data: permission });
  } catch (err) { next(err); }
};

export const deletePermission = async (req, res, next) => {
  try {
    const { id } = req.params;
    // تحقق من عدم وجود role يستخدم هذه الصلاحية
    const used = await Role.findOne({ permissions: id }).lean();
    if (used) return next(new AppError("Cannot delete permission used by roles", 400));
    await Permission.findByIdAndDelete(id);
    return res.status(200).json({ status: "success", message: "Permission deleted" });
  } catch (err) { next(err); }
};
