require('dotenv').config();
const mongoose = require('mongoose');
const Expert = require('./src/models/Expert');

const experts = [
  {
    name: 'Sarah Johnson',
    category: 'Career Coaching',
    experience: 10,
    rating: 4.8
  },
  {
    name: 'Michael Chen',
    category: 'Software Engineering',
    experience: 12,
    rating: 4.9
  },
  {
    name: 'Elena Rodriguez',
    category: 'Design Thinking',
    experience: 8,
    rating: 4.7
  },
  {
    name: 'David Smith',
    category: 'Financial Planning',
    experience: 15,
    rating: 4.6
  },
  {
    name: 'Dr. Anita Gupta',
    category: 'Mental Health',
    experience: 20,
    rating: 5.0
  },
  {
    name: 'Kevin Park',
    category: 'Marketing Strategy',
    experience: 7,
    rating: 4.5
  }
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Optional: Clear existing experts if you want a clean slate
    // await Expert.deleteMany({});
    // console.log('🗑️ Existing experts cleared');

    await Expert.insertMany(experts);
    console.log('🚀 6 Dummy Experts added successfully!');
    
    mongoose.connection.close();
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
}

seedDB();
