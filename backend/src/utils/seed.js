require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Category = require('./models/Category');
const Subcategory = require('./models/Subcategory');
const SubscriptionPlan = require('./models/SubscriptionPlan');
const CMSPage = require('./models/CMSPage');
const Banner = require('./models/Banner');
const { createSlug } = require('./utils/slugify');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected for seeding...');

  await User.deleteMany({ role: 'super_admin' });
  await Category.deleteMany({});
  await Subcategory.deleteMany({});
  await SubscriptionPlan.deleteMany({});
  await CMSPage.deleteMany({});
  await Banner.deleteMany({});

  await User.create({
    name: 'Super Admin',
    email: process.env.ADMIN_EMAIL || 'admin@b2bmarketplace.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@123456',
    role: 'super_admin',
    isEmailVerified: true,
  });

  const categories = [
    { name: 'Industrial Machinery', icon: 'PrecisionManufacturing' },
    { name: 'Electronics & Electrical', icon: 'ElectricalServices' },
    { name: 'Textiles & Fabrics', icon: 'Checkroom' },
    { name: 'Construction Materials', icon: 'Construction' },
    { name: 'Agriculture & Farming', icon: 'Agriculture' },
    { name: 'Chemicals & Plastics', icon: 'Science' },
    { name: 'Packaging & Printing', icon: 'Inventory' },
    { name: 'Automobile & Spare Parts', icon: 'DirectionsCar' },
  ];

  for (const [i, cat] of categories.entries()) {
    const category = await Category.create({
      ...cat,
      slug: createSlug(cat.name),
      order: i,
      description: `Browse ${cat.name} products from verified suppliers`,
    });

    await Subcategory.create({
      name: `${cat.name} - General`,
      slug: createSlug(`${cat.name}-general`),
      category: category._id,
      order: 0,
    });
  }

  await SubscriptionPlan.create([
    {
      name: 'Basic',
      slug: 'basic',
      price: 0,
      duration: 1,
      durationUnit: 'months',
      features: ['Up to 10 products', 'Basic listing', 'Email support'],
      maxProducts: 10,
      maxInquiries: 20,
      order: 0,
    },
    {
      name: 'Professional',
      slug: 'professional',
      price: 4999,
      duration: 1,
      durationUnit: 'months',
      features: ['Up to 100 products', 'Priority listing', 'Analytics dashboard', 'Chat support'],
      maxProducts: 100,
      maxInquiries: 200,
      order: 1,
    },
    {
      name: 'Enterprise',
      slug: 'enterprise',
      price: 14999,
      duration: 1,
      durationUnit: 'months',
      features: ['Unlimited products', 'Premium badge', 'Featured listing', 'Dedicated manager', 'API access'],
      maxProducts: 9999,
      maxInquiries: 9999,
      isPremium: true,
      order: 2,
    },
  ]);

  const cmsPages = [
    { title: 'About Us', slug: 'about-us', pageType: 'about', content: '<h1>About B2B Marketplace Portal</h1><p>India\'s leading B2B marketplace connecting buyers with verified suppliers.</p>' },
    { title: 'Contact Us', slug: 'contact-us', pageType: 'contact', content: '<h1>Contact Us</h1><p>Email: support@b2bmarketplace.com</p>' },
    { title: 'FAQ', slug: 'faq', pageType: 'faq', content: '<h1>Frequently Asked Questions</h1><p>Find answers to common questions about our platform.</p>' },
    { title: 'Privacy Policy', slug: 'privacy-policy', pageType: 'privacy', content: '<h1>Privacy Policy</h1><p>Your privacy is important to us.</p>' },
    { title: 'Terms & Conditions', slug: 'terms-conditions', pageType: 'terms', content: '<h1>Terms & Conditions</h1><p>Please read these terms carefully.</p>' },
  ];

  await CMSPage.insertMany(cmsPages);

  await Banner.create({
    title: 'Connect with Verified B2B Suppliers',
    subtitle: 'Find manufacturers, traders & distributors across India',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200',
    link: '/products',
    linkText: 'Browse Products',
    position: 'hero',
    order: 0,
  });

  console.log('Database seeded successfully!');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
