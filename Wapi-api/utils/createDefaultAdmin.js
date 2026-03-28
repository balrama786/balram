import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

/**
 * Create default admin user
 * @param {Object} adminData - Admin user data
 */
async function createDefaultAdmin(adminData) {
  try {
    if (!adminData || !adminData.email) {
      console.error('❌ Invalid admin data provided');
      return { success: false, error: 'Invalid admin data' };
    }

    const User = mongoose.model('User');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists');
      return { success: false, message: 'Admin already exists' };
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);

    // Create admin user
    const admin = new User({
      email: adminData.email,
      name: `${adminData.first_name || ''} ${adminData.last_name || ''}`.trim(),
      // firstName: adminData.first_name || '',
      // lastName: adminData.last_name || '',
      password: hashedPassword,
      role: 'super_admin',
      email_verified: true,
      createdAt: new Date()
    });

    await admin.save();
    console.log('✅ Default admin user created successfully');
    console.log(`   Email: ${adminData.email}`);

    return { success: true, user: admin };
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    return { success: false, error: error.message };
  }
}

export default createDefaultAdmin;
