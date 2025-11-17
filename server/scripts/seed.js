const pool = require('../config/database');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  try {
    console.log('Seeding database with sample data...');

    // Create sample citizens
    const hashedPassword = await bcrypt.hash('password123', 10);

    const citizenInsert = await pool.query(
      'INSERT INTO users (email, password, name, phone, user_type) VALUES ($1, $2, $3, $4, $5) RETURNING id, email',
      ['citizen@example.com', hashedPassword, 'John Doe', '9876543210', 'citizen']
    );
    const citizenId = citizenInsert.rows[0].id;
    console.log('Created citizen:', citizenInsert.rows[0].email);

    // Create sample NGO
    const ngoInsert = await pool.query(
      'INSERT INTO users (email, password, name, phone, user_type, organization_name, registration_number, address) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, email',
      ['ngo@example.com', hashedPassword, 'Animal Rescue Team', '9123456789', 'ngo', 'Animal Rescue Foundation', 'ARF-2024-001', 'Mumbai, India']
    );
    const ngoId = ngoInsert.rows[0].id;
    console.log('Created NGO:', ngoInsert.rows[0].email);

    // Create sample reports
    const reports = [
      {
        userId: citizenId,
        location: 'Bandra Beach, Mumbai',
        latitude: 19.0596,
        longitude: 72.8295,
        description: 'A brown stray dog seen near the beach, seems injured',
        contactName: 'John Doe',
        contactPhone: '9876543210',
        contactEmail: 'citizen@example.com',
        status: 'pending'
      },
      {
        userId: citizenId,
        location: 'Marine Drive',
        latitude: 18.9676,
        longitude: 72.8194,
        description: 'Pack of 3 stray dogs blocking traffic',
        contactName: 'John Doe',
        contactPhone: '9876543210',
        contactEmail: 'citizen@example.com',
        status: 'in_progress'
      },
      {
        userId: citizenId,
        location: 'Worli Park',
        latitude: 19.0176,
        longitude: 72.8194,
        description: 'Puppy found alone and crying',
        contactName: 'John Doe',
        contactPhone: '9876543210',
        contactEmail: 'citizen@example.com',
        status: 'resolved'
      }
    ];

    for (const report of reports) {
      await pool.query(
        'INSERT INTO reports (user_id, location, latitude, longitude, description, contact_name, contact_phone, contact_email, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        [report.userId, report.location, report.latitude, report.longitude, report.description, report.contactName, report.contactPhone, report.contactEmail, report.status]
      );
    }
    console.log('Created 3 sample reports');

    console.log('\nSeed data created successfully!');
    console.log('\nTest Credentials:');
    console.log('Citizen Email: citizen@example.com');
    console.log('NGO Email: ngo@example.com');
    console.log('Password: password123');
    
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seedDatabase();
