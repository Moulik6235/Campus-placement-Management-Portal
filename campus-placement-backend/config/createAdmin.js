const User = require("../models/User");
const bcrypt = require("bcryptjs");

const createAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: "admin@gmail.com" });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("123456", 10);

      await User.create({
        name: "Admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        rollNo: "admin001",
        role: "admin",
        status: "approved",
      });

      console.log("✅ Admin created");
    } else {
      console.log("⚡ Admin already exists");
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = createAdmin;