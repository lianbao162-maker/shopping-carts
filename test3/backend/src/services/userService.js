const User = require('../models/User');

async function ensureDefaultAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@shophub.local';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456';

  const existing = await User.findOne({ email: adminEmail.toLowerCase() });
  if (existing) {
    return existing;
  }

  const adminUser = new User({
    name: 'Admin',
    email: adminEmail,
    password: adminPassword,
    role: 'admin'
  });

  await adminUser.save();
  console.log(`Default admin created: ${adminEmail}`);
  return adminUser;
}

module.exports = {
  ensureDefaultAdmin
};
