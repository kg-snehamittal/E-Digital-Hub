const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');

const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const { hashPassword } = require('../utils/auth');

const ADMIN = {
  name: 'Sneha Mittal',
  email: 'mittalsneha268@gmail.com',
  password: 'Sneha@123',
  role: 'admin',
};

const DEMO_PASSWORD = 'User@123';

const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`;

const products = [
  { title: 'Apple iPhone 14 (128GB)', price: '64999', category: 'mobile', imageUrl: img('photo-1678685888221-cda773a3dcdb'), description: '6.1-inch Super Retina XDR display, A15 Bionic chip and a dual-camera system with excellent low-light photos.' },
  { title: 'Samsung Galaxy S23', price: '59999', category: 'mobile', imageUrl: img('photo-1610945415295-d9bbf067e59c'), description: 'Flagship Android phone with a 120Hz AMOLED display, 50MP camera and all-day battery life.' },
  { title: 'OnePlus Nord CE 3', price: '24999', category: 'mobile', imageUrl: img('photo-1598327105666-5b89351aff97'), description: 'Smooth 120Hz AMOLED screen with 80W fast charging at a mid-range price.' },
  { title: 'Dell XPS 13 Laptop', price: '99999', category: 'laptop', imageUrl: img('photo-1593642632823-8f785ba67e45'), description: 'Ultra-thin 13.4-inch laptop, Intel Core i7, 16GB RAM, 512GB SSD with an InfinityEdge display.' },
  { title: 'HP Pavilion 15', price: '56990', category: 'laptop', imageUrl: img('photo-1496181133206-80ce9b88a853'), description: '15.6-inch FHD laptop with Ryzen 5 processor, 8GB RAM and 512GB SSD for work and study.' },
  { title: 'MacBook Air M2', price: '114900', category: 'laptop', imageUrl: img('photo-1517336714731-489689fd1ca8'), description: 'Fanless, featherweight laptop with the Apple M2 chip and up to 18 hours of battery life.' },
  { title: 'Sony WH-1000XM5 Headphones', price: '29990', category: 'audio', imageUrl: img('photo-1505740420928-5e560c06d30e'), description: 'Industry-leading noise cancellation with 30-hour battery and crystal-clear calls.' },
  { title: 'boAt Airdopes 141', price: '1299', category: 'audio', imageUrl: img('photo-1590658268037-6bf12165a8df'), description: 'True wireless earbuds with 42-hour playback, ENx noise reduction and low-latency gaming mode.' },
  { title: 'JBL Flip 6 Bluetooth Speaker', price: '9999', category: 'audio', imageUrl: img('photo-1608043152269-423dbba4e7e1'), description: 'Portable waterproof speaker with powerful sound and 12 hours of playtime.' },
  { title: 'Apple Watch Series 9', price: '41900', category: 'watch', imageUrl: img('photo-1546868871-7041f2a55e12'), description: 'Always-on Retina display, advanced health sensors and the fast S9 chip.' },
  { title: 'Noise ColorFit Pro 4', price: '3499', category: 'watch', imageUrl: img('photo-1523275335684-37898b6baf30'), description: '1.72-inch display smartwatch with Bluetooth calling, SpO2 and 100+ sports modes.' },
  { title: 'Canon EOS 1500D DSLR', price: '36990', category: 'camera', imageUrl: img('photo-1516035069371-29a1b244cc32'), description: '24.1MP DSLR with Wi-Fi, full HD video and an 18-55mm kit lens - great for beginners.' },
  { title: 'Logitech MX Master 3S Mouse', price: '9495', category: 'accessories', imageUrl: img('photo-1527864550417-7fd91fc51a46'), description: 'Ergonomic wireless mouse with 8K DPI sensor and quiet clicks.' },
  { title: 'Keychron K2 Mechanical Keyboard', price: '8499', category: 'accessories', imageUrl: img('photo-1587829741301-dc798b83add3'), description: 'Compact 75% wireless mechanical keyboard with hot-swappable switches and RGB backlight.' },
  { title: 'Samsung 27" Curved Monitor', price: '15999', category: 'accessories', imageUrl: img('photo-1527443224154-c4a3942d3acf'), description: '27-inch Full HD curved monitor with 75Hz refresh rate and eye-saver mode.' },
  { title: 'Sony PlayStation 5', price: '49990', category: 'gaming', imageUrl: img('photo-1606144042614-b2417e99c4e3'), description: 'Next-gen console with ultra-fast SSD, ray tracing and 4K gaming.' }
];

const demoUsers = [
  { name: 'Rahul Sharma', email: 'rahul@example.com' },
  { name: 'Priya Singh', email: 'priya@example.com' },
  { name: 'Amit Verma', email: 'amit@example.com' },
  { name: 'Neha Gupta', email: 'neha@example.com' }
];

const formatDate = (d) =>
  d.toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

async function seedData() {
  const mongoUri = process.env.MONGODB_URI ;
  await mongoose.connect(mongoUri);
  console.log(`Connected to MongoDB for full database seed: ${mongoUri}`);

  await Promise.all([Product.deleteMany({}), User.deleteMany({}), Order.deleteMany({})]);

  const insertedProducts = await Product.insertMany(products);

  const adminPasswordHash = await hashPassword(ADMIN.password);
  const admin = await User.create({
    name: ADMIN.name,
    email: ADMIN.email.toLowerCase(),
    passwordHash: adminPasswordHash,
    role: 'admin',
  });

  const demoUserPasswordHash = await hashPassword(DEMO_PASSWORD);
  const users = [];
  for (const u of demoUsers) {
    users.push(await User.create({
      name: u.name,
      email: u.email.toLowerCase(),
      passwordHash: demoUserPasswordHash,
      role: 'user',
    }));
  }

  const addresses = [
    { address: '12 MG Road, Sector 17', pincode: '160017', phoneNumber: '9876543210' },
    { address: '45 Model Town', pincode: '141002', phoneNumber: '9812345678' },
    { address: '78 Phase 5, Mohali', pincode: '160059', phoneNumber: '9898989898' },
    { address: '9 Civil Lines', pincode: '140301', phoneNumber: '9123456780' }
  ];

  // 8 demo orders spread over the last few weeks
  for (let i = 0; i < 8; i++) {
    const user = users[i % users.length];
    const items = [
      insertedProducts[(i * 2) % insertedProducts.length],
      insertedProducts[(i * 2 + 5) % insertedProducts.length]
    ]
      .slice(0, (i % 2) + 1)
      .map((p) => ({
        title: p.title,
        price: p.price,
        category: p.category,
        imageUrl: p.imageUrl,
        description: p.description,
      }));
    const when = new Date(Date.now() - i * 3 * 24 * 60 * 60 * 1000);
    await Order.create({
      cartItems: items,
      addressInfo: { name: user.name, ...addresses[i % addresses.length] },
      email: user.email,
      userid: String(user._id),
      paymentId: `pay_demo${String(1000 + i)}`,
      date: formatDate(when),
      createdAt: when,
    });
  }

  console.log(`\nDatabase successfully seeded:`);
  console.log(`- ${insertedProducts.length} Products`);
  console.log(`- ${users.length + 1} Users (1 Admin + ${users.length} Demo Users)`);
  console.log(`- 8 Sample Orders\n`);
  console.log('Admin Account Credentials:');
  console.log(`  Email    : ${ADMIN.email}`);
  console.log(`  Password : ${ADMIN.password}`);
  console.log(`  Role     : admin`);
  console.log('\nDemo User Credentials:');
  console.log(`  Emails   : ${demoUsers.map((u) => u.email).join(', ')}`);
  console.log(`  Password : ${DEMO_PASSWORD}\n`);

  await mongoose.disconnect();
}

seedData().catch((err) => {
  console.error('Seed error:', err.message);
  process.exit(1);
});
