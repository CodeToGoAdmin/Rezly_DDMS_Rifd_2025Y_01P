// src/seed/seedRolesPermissions.js
import 'dotenv/config';
import connectDB from "../../DB/connection.js"; // عدّل المسار لو لزم
import Permission from "../../DB/models/permission.model.js";
import Role from "../../DB/models/role.model.js";

const run = async () => {
  await connectDB();

  const defaults = [
    { name: "manage_roles", description: "Create/Update/Delete roles" },
    { name: "manage_permissions", description: "Create/Update/Delete permissions" },
    { name: "assign_roles", description: "Assign roles to employees" },
    { name: "view_employees", description: "View employee list" },
  ];

  // أنشئ أو حدّث الصلاحيات
  const permIds = [];
  for (const p of defaults) {
    const found = await Permission.findOneAndUpdate({ name: p.name }, { $set: p }, { upsert: true, new: true });
    permIds.push(found._id);
  }

  // أنشئ دور admin بمجموع الصلاحيات
  const adminRole = await Role.findOneAndUpdate(
    { name: "Admin" },
    { $set: { name: "Admin", description: "Administrator", permissions: permIds } },
    { upsert: true, new: true }
  );

  console.log("Seed finished. Admin role id:", adminRole._id);
  process.exit(0);
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});
