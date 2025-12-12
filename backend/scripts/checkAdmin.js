import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const checkAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin user exists
    const adminUser = await User.findOne({ email: 'admin@classiccarrry.com' });
    
    if (adminUser) {
      console.log('✅ Admin user found:');
      console.log(`   Name: ${adminUser.name}`);
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Role: ${adminUser.role}`);
      console.log(`   Active: ${adminUser.isActive}`);
      console.log(`   Created: ${adminUser.createdAt}`);
      
      // Reset admin password to ensure it works
      console.log('\n🔧 Resetting admin password to ensure it works...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.findByIdAndUpdate(adminUser._id, { 
        password: hashedPassword,
        isActive: true 
      });
      console.log('✅ Admin password reset successfully');
      console.log('✅ Admin credentials: admin@classiccarrry.com / admin123');
    } else {
      console.log('❌ Admin user not found. Creating admin user...');
      
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const newAdmin = await User.create({
        name: 'Admin User',
        email: 'admin@classiccarrry.com',
        password: hashedPassword,
        role: 'admin',
        phone: '+92-300-1234567',
        address: {
          street: '123 Admin Street',
          city: 'Karachi',
          state: 'Sindh',
          province: 'Sindh',
          postalCode: '75500',
          country: 'Pakistan'
        },
        isActive: true
      });
      
      console.log('✅ Admin user created successfully');
      console.log(`   ID: ${newAdmin._id}`);
      console.log(`   Email: ${newAdmin.email}`);
    }

    // Check all admin users
    const allAdmins = await User.find({ role: 'admin' });
    console.log(`\n📊 Total admin users: ${allAdmins.length}`);
    
    allAdmins.forEach((admin, index) => {
      console.log(`   ${index + 1}. ${admin.name} (${admin.email}) - Active: ${admin.isActive}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
};

checkAdmin();