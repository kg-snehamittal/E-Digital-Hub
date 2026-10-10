const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const { hashPassword } = require('../utils/auth');

const ADMIN_DETAILS = {
  name: 'Sneha Mittal',
  email: 'mittalsneha268@gmail.com',
  password: 'Sneha@123',
  role: 'admin',
};

async function createAdmin() {
  const mongoUri = process.env.MONGODB_URI;
  console.log(`Connecting to MongoDB at: ${mongoUri}`);

  await mongoose.connect(mongoUri);

  const normalizedEmail = ADMIN_DETAILS.email.toLowerCase().trim();
  const hashedPassword = await hashPassword(ADMIN_DETAILS.password);

  let adminUser = await User.findOne({ email: normalizedEmail });

  if (adminUser) {
    adminUser.name = ADMIN_DETAILS.name;
    adminUser.passwordHash = hashedPassword;
    adminUser.role = 'admin';
    await adminUser.save();
    console.log(`\nExisting user found. Successfully updated to Admin:`);
  } else {
    adminUser = await User.create({
      name: ADMIN_DETAILS.name,
      email: normalizedEmail,
      passwordHash: hashedPassword,
      role: 'admin',
    });
    console.log(`\nAdmin user created successfully:`);
  }

  console.log(`=========================================`);
  console.log(` Email   : ${adminUser.email}`);
  console.log(` Role    : ${adminUser.role}`);
  console.log(` User ID : ${adminUser._id}`);
  console.log(` Status  : Password securely hashed with bcrypt`);
  console.log(`=========================================\n`);

  await mongoose.disconnect();
}

createAdmin()
  .then(() => {
    console.log('Admin provisioning complete.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error creating admin user:', err.message);
    process.exit(1);
  });
