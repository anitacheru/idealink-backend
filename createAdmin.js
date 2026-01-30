const bcrypt = require('bcryptjs');
const { User } = require('./models');
const sequelize = require('./config/db');

async function createAdmin() {
  try {
    await sequelize.sync();
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      where: { email: 'admin@idealink.com' } 
    });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('Email: admin@idealink.com');
      process.exit(0);
    }
    
    // Create admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await User.create({
      username: 'Admin',
      email: 'admin@idealink.com',
      password: hashedPassword,
      role: 'admin',
      points: 0
    });

    console.log('✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: admin@idealink.com');
    console.log('🔑 Password: admin123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  IMPORTANT: Change the password after first login!');
    console.log('');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating admin:', err.message);
    process.exit(1);
  }
}

createAdmin();