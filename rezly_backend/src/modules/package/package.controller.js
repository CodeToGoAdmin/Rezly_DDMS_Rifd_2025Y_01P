import Package from "../../../DB/models/packages.model.js";
import { arabicSlugify } from "../../Utils/ArabicSlug.js";
export const createPackage = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Only admins can create packages" });
    }
    
 const {
      name,
      description,
      price_cents,
      currency,
      price_type,
      duration_value,
      duration_unit,
      auto_renew,
      trial_days,
      active,
    } = req.body;

      // فحص إذا الباكيج موجودة بنفس كل القيم
    const existingPackage = await Package.findOne({
      name,
      description,
      price_cents,
      currency,
      price_type,
      duration_value,
      duration_unit,
      auto_renew,
      trial_days,
      active,
    });

    if (existingPackage) {
      return res.status(400).json({ 
        message: "Package with identical data already exists" 
      });
    }

    
    const newPackage = new Package({
      name,
      slug: arabicSlugify(name), // توليد slug تلقائي
      description,
      price_cents,
      currency,
      price_type,
      duration_value,
      duration_unit,
      auto_renew,
      trial_days,
      active,
    });

    await newPackage.save();

    res.status(201).json({ message: "success", package: newPackage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const listPackages = async (req, res) => {
  try {
    const { active } = req.query;
    let filter = {};

    if (req.user && req.user.role === "Admin") {
      // الادمن: يسمح بالفلترة حسب active أو بدون فلترة
      if (active === "true") filter.active = true;
      else if (active === "false") filter.active = false;
    } else {
      // المستخدم العادي: يشوف فقط الباقات النشطة
      filter.active = true;
      if (active) {
        // تجاهل أي فلترة غير مصرح بها للمستخدم العادي
        return res.status(403).json({
          message: "Only admins can filter packages by active status"
        });
      }
    }

    const packages = await Package.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      message: "success",
      count: packages.length,
      packages,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePackage = async (req, res) => {
  try {
    // التحقق من صلاحية الادمن
    if (!req.user || req.user.role !== "Admin") {
      return res.status(403).json({ message: "Only admins can update packages" });
    }

    const { id } = req.params;
    const updateData = { ...req.body };

    // إذا تم تحديث الاسم، حدث الـ slug
    if (updateData.name) {
      updateData.slug = arabicSlugify(updateData.name);
    }

    // تحديث الباقة
    const updatedPackage = await Package.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedPackage) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.status(200).json({
      message: "success",
      package: updatedPackage,
    });

  } catch (err) {
    // التعامل مع خطأ التكرار في slug
    if (err.code === 11000 && err.keyPattern && err.keyPattern.slug) {
      return res.status(400).json({ message: "Package name already exists" });
    }
    res.status(500).json({ error: err.message });
  }
};

export const disablePackage = async (req, res) => {
  try {
    // تحقق انه المستخدم Admin
    if (!req.user || req.user.role !== "Admin") {
      return res.status(403).json({ message: "Only admins can disable packages" });
    }

    const { id } = req.params;

    // تأكد انه الباكيج موجودة
    const pkg = await Package.findById(id);
    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    // إذا أصلاً معطلة
    if (!pkg.active) {
      return res.status(400).json({ message: "Package is already disabled" });
    }

    pkg.active = false;
    await pkg.save();

    res.status(200).json({ message: "success", package: pkg });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const enablePackage = async (req, res) => {
  try {
    // فقط الـ admin
    if (!req.user || req.user.role !== "Admin") {
      return res.status(403).json({ message: "Only admins can enable packages" });
    }

    const { id } = req.params;

    // تحقق ان الباكيج موجودة
    const pkg = await Package.findById(id);
    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    // اذا الباكيج أصلاً active
    if (pkg.active) {
      return res.status(400).json({ message: "Package is already active" });
    }

    pkg.active = true;
    await pkg.save();

    res.status(200).json({ message: "success", package: pkg });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPackageById = async (req, res) => {
  try {
    const { id } = req.params;

    const pkg = await Package.findById(id);

    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    // المستخدم العادي مش admin ويحاول يشوف باقة معطلة
    if (pkg.active === false && req.user?.role !== "Admin") {
      return res.status(403).json({ message: "You are not authorized to view this package" });
    }

    
    res.status(200).json({ package: pkg });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};