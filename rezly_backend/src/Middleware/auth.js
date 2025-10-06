import jwt from 'jsonwebtoken';

import userModel from '../../DB/models/user.model.js';

import { Role } from '../../DB/models/role.model.js';
import { Permission } from '../../DB/models/permission.model.js';
export const roles = {
  Admin: "admin",
  Coach: "coach",
  Member: "member",
  Receptionist: "receptionist",
  Accountant:"accountant"
};
export const auth = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const { authorization } = req.headers;
       if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.status(401).json({ 
          status: "error", message: "Unauthorized: Invalid or missing token", 
          data: null });
      }
    
      const token = authorization.split(" ")[1];
      let decoded;

      try {
        decoded = jwt.verify(token, process.env.LOGINTOKEN);
      } catch {
    
        const userId = jwt.decode(token)?.id;
        if (!userId) {
          return res.status(401).json({
            status: "error",
            message: "Unauthorized: Invalid token",
            data: null
          });
        }
        const user = await userModel.findById(userId).lean();
        if (!user?.refreshToken) {
          return res.status(401).json({
            status: "error",
            message: "Unauthorized: No refresh token found",
            data: null
          });
        }

        try {
          jwt.verify(user.refreshToken, process.env.REFRESHTOKEN_SECRET);
          const newAccessToken = jwt.sign(
            { id: user._id, role: user.role },
            process.env.LOGINTOKEN,
            { expiresIn: "15m" }
          );
          res.setHeader("x-access-token", newAccessToken);
          decoded = { id: user._id, role: user.role };
        } catch {
          return res.status(401).json({
            status: "error",
            message: "Unauthorized: Refresh token expired",
            data: null
          });
        }
      }

      const user = await userModel.findById(decoded.id)
        .select("username role roleId")
        .populate({
          path: "roleId",
          populate: { path: "permissions", select: "name" },
          select: "name permissions"
        })
        .lean();


      if (!user) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized: User not found",
          data: null
        });
      }

      req.user = user;
      req.userId = decoded.id;


      // ===== التحقق من الدور =====
         // اشتق اسم الدور (إذا موجود roleId استخدم اسمه، وإلا استخدم الحقل النصي القديم)
      req.user.roleName = (user.roleId?.name || user.role || "").toString().toLowerCase();

      // جهز قائمة أسماء الصلاحيات (إن وجدت)
      req.user.permissions = (user.roleId?.permissions || []).map(p => (p.name || "").toString().toLowerCase());


       // فحص الأدوار المسموح بها (إذا تم تمرير allowedRoles)
      if (allowedRoles.length) {
        const allowed = allowedRoles.map(r => r.toString().toLowerCase());
        if (!allowed.includes(req.user.roleName)) {
          return res.status(403).json({ status: "error", message: "Forbidden: You do not have permission", data: null });
        }
      }

      next();
    } catch (error) {
      return res.status(500).json({ status: "error", message: error.message || "Internal server error", data: null });
   


    }
  };
};

