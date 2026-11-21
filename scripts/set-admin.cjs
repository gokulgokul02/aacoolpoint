/**
 * AA COOL POINT - Admin Provisioning Script
 * 
 * Usage:
 * 1. Download your service account key from Firebase Console:
 *    Project Settings -> Service Accounts -> Generate New Private Key
 * 2. Save it as `serviceAccountKey.json` in the project root.
 * 3. Run: node scripts/set-admin.cjs <admin-email>
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

const serviceAccountPath = path.resolve(__dirname, '../serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('\n❌ Error: serviceAccountKey.json not found in project root.');
  console.error('Please download your Service Account Key from Firebase Console:');
  console.error('Project Settings -> Service Accounts -> Generate New Private Key\n');
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const targetEmail = process.argv[2];

if (!targetEmail) {
  console.error('Usage: node scripts/set-admin.cjs <email@example.com>');
  process.exit(1);
}

async function setAdminClaim() {
  try {
    const user = await admin.auth().getUserByEmail(targetEmail);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log(`\n✅ Success! User "${targetEmail}" (UID: ${user.uid}) now has admin privileges.`);
    console.log('The user can now log in at /admin/login\n');
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.log(`\nUser "${targetEmail}" does not exist yet. Creating user...`);
      const password = process.argv[3] || 'Admin@123456';
      const newUser = await admin.auth().createUser({
        email: targetEmail,
        password: password,
        displayName: 'AA Cool Point Admin',
      });
      await admin.auth().setCustomUserClaims(newUser.uid, { admin: true });
      console.log(`\n✅ Created new admin user: ${targetEmail}`);
      console.log(`Temporary Password: ${password}`);
      console.log('Admin custom claim applied successfully.\n');
    } else {
      console.error('Error assigning admin claims:', error);
    }
  }
}

setAdminClaim();

