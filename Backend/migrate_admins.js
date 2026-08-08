import mongoose from 'mongoose';
import User from './src/models/user.js';
import Admin from './src/models/admin.js';

mongoose.connect('mongodb+srv://Dev_Login:DevLoginPassword@cluster0.fjcbpvx.mongodb.net/Cash-Book')
  .then(async () => {
    console.log("Connected to MongoDB.");
    
    // Find all users who are admins
    const adminUsers = await User.find({ 
      $or: [
        { user_role: 'admin' },
        { is_admin: true }
      ]
    });

    console.log(`Found ${adminUsers.length} admins in the User collection.`);

    for (const user of adminUsers) {
      console.log(`Migrating: ${user.email_id}`);
      
      // Check if already in Admin collection
      const existing = await Admin.findOne({ email_id: user.email_id });
      if (!existing) {
        const newAdmin = new Admin({
          username: user.username,
          email_id: user.email_id,
          password: user.password,
          user_role: 'admin',
          is_admin: true,
          account_status: user.account_status,
          phone_number: user.phone_number,
          security_pin: user.security_pin || '1234',
          avatar: user.avatar
        });
        await newAdmin.save();
        console.log(` -> Successfully added to Admin collection.`);
      } else {
        console.log(` -> Already exists in Admin collection.`);
      }

      // Delete from User collection to prevent duplicates
      await User.findByIdAndDelete(user._id);
      console.log(` -> Deleted from User collection.`);
    }

    console.log("Migration complete.");
    process.exit(0);
  })
  .catch(err => {
    console.error("Error:", err);
    process.exit(1);
  });
