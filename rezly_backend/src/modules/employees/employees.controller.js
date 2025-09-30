import userModel from "../../../DB/models/user.model.js";
import Role from "../../../DB/models/role.model.js";
import bcrypt from "bcryptjs";
import { AppError } from "../../Utils/catchError.js";

export const listEmployees = async (req, res, next) => {
  try {
    const employees = await userModel
      .find()
      .populate({ path: "roleId", populate: { path: "permissions" } })
      .select("-password -refreshToken")
      .lean();
    return res.status(200).json({ status: "success", data: employees });
  } catch (err) {
    next(err);
  }
};

export const createEmployee = async (req, res, next) => {
  try {
    const { userName, email, password, phone, gender, roleId } = req.body;
    if (!userName || !email || !password)
      return next(
        new AppError("userName, email and password are required", 400)
      );
    const existing = await userModel.findOne({ email }).lean();
    if (existing) return next(new AppError("Email already exists", 409));
    const hashed = await bcrypt.hash(
      password,
      parseInt(process.env.SALTROUND || "10")
    );
    let roleDoc = null;
    if (roleId) {
      roleDoc = await Role.findById(roleId).lean();
      if (!roleDoc) return next(new AppError("Role not found", 400));
    }
    const created = await userModel.create({
      userName,
      email,
      password: hashed,
      phone,
      gender,
      role: roleDoc?.name ?? "Member",
      roleId: roleDoc?._id ?? null,
    });
    return res.status(201).json({ status: "success", data: created });
  } catch (err) {
    next(err);
  }
};

export const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userName, phone, gender, roleId, status } = req.body;
    const user = await userModel.findById(id);
    if (!user) return next(new AppError("Employee not found", 404));
    if (roleId) {
      const role = await Role.findById(roleId).lean();
      if (!role) return next(new AppError("Role not found", 400));
      user.roleId = role._id;
      user.role = role.name; // sync textual role
    }
    user.userName = userName ?? user.userName;
    user.phone = phone ?? user.phone;
    user.gender = gender ?? user.gender;
    if (status) user.status = status;
    await user.save();
    return res.status(200).json({ status: "success", data: user });
  } catch (err) {
    next(err);
  }
};

export const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    // بدل حذف نهائي، هنا نجري تعطيل (soft delete)
    const updated = await userModel
      .findByIdAndUpdate(id, { status: "NotActive" }, { new: true })
      .select("-password -refreshToken")
      .lean();
    if (!updated) return next(new AppError("Employee not found", 404));
    return res.status(200).json({ status: "success", data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteEmployeePerm = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Hard delete the user
    const deleted = await userModel
      .findByIdAndDelete(id)
      .select("-password -refreshToken")
      .lean();

    if (!deleted) return next(new AppError("Employee not found", 404));

    return res.status(200).json({
      status: "success",
      message: "Employee deleted successfully",
      data: deleted,
    });
  } catch (err) {
    next(err);
  }
};
