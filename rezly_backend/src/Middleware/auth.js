import jwt from 'jsonwebtoken';

import userModel from '../../DB/models/user.model.js';

export const roles = {
  Admin: "admin",
  Trainer: "trainer",
  Member: "member",
  Receptionist: "receptionist"
};
export const auth = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const { authorization } = req.headers;
      if (!authorization) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized: Authorization header missing",
          data: null
        });
      }

      if (!authorization.startsWith("Bearer ")) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized: Invalid token format",
          data: null
        });
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

      // ===== جلب بيانات المستخدم =====
      const user = await userModel.findById(decoded.id).select("username role");
      if (!user) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized: User not found",
          data: null
        });
      }

      req.user = user;
      req.userId = decoded.id;

      if (allowedRoles.length && !allowedRoles.includes(user.role.toLowerCase())) {
        return res.status(403).json({
          status: "error",
          message: "Forbidden: You do not have permission",
          data: null
        });
      }

      next();
    } catch (error) {
      // أي خطأ آخر يكون 500
      return res.status(500).json({
        status: "error",
        message: error.message || "Internal server error",
        data: null
      });
    }
  };
};
