const Skill = require('./models/Skill');
const Project = require('./models/Project');
const Asset = require('./models/Asset');
const Attendance = require('./models/Attendance');
const Leave = require('./models/Leave');
const User = require('./models/User');

exports.seedSampleData = async () => {
  try {
    // 0. Ensure Default Admin & Demo Users Exist
    let adminUser = await User.findOne({ email: 'admin@devskills.com' });
    if (!adminUser) {
      console.log('Creating default Admin user: admin@devskills.com ...');
      adminUser = await User.create({
        name: 'System Admin',
        email: 'admin@devskills.com',
        password: 'admin123',
        role: 'admin'
      });
    }

    let hrUser = await User.findOne({ email: 'hr@devskills.com' });
    if (!hrUser) {
      console.log('Creating default HR user: hr@devskills.com ...');
      await User.create({
        name: 'HR Manager',
        email: 'hr@devskills.com',
        password: 'hr123456',
        role: 'hr'
      });
    }

    let empUser = await User.findOne({ email: 'alex@devskills.com' });
    if (!empUser) {
      console.log('Creating default Employee user: alex@devskills.com ...');
      await User.create({
        name: 'Alex Rivera',
        email: 'alex@devskills.com',
        password: 'employee123',
        role: 'employee'
      });
    }

    const userId = adminUser._id;

    // 1. Seed 10 Skill Tasks if empty
    const skillCount = await Skill.countDocuments({ user: userId });
    if (skillCount === 0) {
      console.log('Seeding 10 Genuine Skill Tasks...');
      await Skill.insertMany([
        {
          user: userId, category: 'Frontend', task: 'React 19 Server Actions & Concurrent Mode', status: 'completed',
          subTasks: [{ title: 'Setup Server Actions', completed: true }, { title: 'Test Optimistic UI Updates', completed: true }]
        },
        {
          user: userId, category: 'Backend', task: 'Node.js Microservices Architecture & Redis Caching', status: 'in-progress',
          subTasks: [{ title: 'Implement Redis Pub/Sub', completed: true }, { title: 'Configure Cluster Scaling', completed: false }]
        },
        {
          user: userId, category: 'DevOps', task: 'Docker Containerization & Kubernetes Cluster', status: 'in-progress',
          subTasks: [{ title: 'Write Dockerfile', completed: true }, { title: 'Helm Deployment Charts', completed: false }]
        },
        {
          user: userId, category: 'Database', task: 'PostgreSQL Database Indexing & Query Tuning', status: 'completed',
          subTasks: [{ title: 'Add B-Tree Indexes', completed: true }, { title: 'EXPLAIN ANALYZE Optimization', completed: true }]
        },
        {
          user: userId, category: 'Backend', task: 'GraphQL API Gateway & Schema Federation', status: 'pending',
          subTasks: [{ title: 'Define GraphQL Types', completed: false }, { title: 'Apollo Server Federation', completed: false }]
        },
        {
          user: userId, category: 'Frontend', task: 'Next.js 15 App Router & Dynamic Routing', status: 'completed',
          subTasks: [{ title: 'Migrate to App Directory', completed: true }, { title: 'Setup Dynamic Layouts', completed: true }]
        },
        {
          user: userId, category: 'Security', task: 'OAuth2 Social Auth & JWT Refresh Token Rotation', status: 'in-progress',
          subTasks: [{ title: 'Google OAuth Endpoint', completed: true }, { title: 'Token Rotation Store', completed: false }]
        },
        {
          user: userId, category: 'Cloud', task: 'AWS Lambda Serverless Micro-services', status: 'pending',
          subTasks: [{ title: 'Serverless Framework Config', completed: false }, { title: 'API Gateway Integration', completed: false }]
        },
        {
          user: userId, category: 'Frontend', task: 'TypeScript Strict Type System & Utility Types', status: 'completed',
          subTasks: [{ title: 'Enable strictNullChecks', completed: true }, { title: 'Generic Type Constraints', completed: true }]
        },
        {
          user: userId, category: 'Security', task: 'System Security Audit & OWASP Top 10 Vulnerabilities', status: 'in-progress',
          subTasks: [{ title: 'Sanitize Input Vectors', completed: true }, { title: 'CORS Headers Lockdown', completed: false }]
        }
      ]);
    }

    // 2. Seed 10 Sprint Kanban Tasks if empty
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      console.log('Seeding 10 Sprint Kanban Cards...');
      await Project.insertMany([
        { title: 'Build JWT Refresh Token Rotation Endpoint', category: 'Security', priority: 'High', stage: 'in-progress', assignedTo: userId, description: 'Secure auth token renewal with database revocation list' },
        { title: 'Integrate Stripe Billing & Subscription Webhooks', category: 'Development', priority: 'Critical', stage: 'backlog', assignedTo: userId, description: 'Recurring payment processing & invoice generation' },
        { title: 'Real-time WebSockets Chat Engine for Teams', category: 'Development', priority: 'High', stage: 'code-review', assignedTo: userId, description: 'Socket.io encrypted workspace messaging' },
        { title: 'Docker Swarm Production Deployment Script', category: 'DevOps & Cloud', priority: 'Medium', stage: 'backlog', assignedTo: userId, description: 'Automated container cluster deployment pipeline' },
        { title: 'Next.js Server Components SEO Optimization', category: 'UI/UX Design', priority: 'Low', stage: 'completed', assignedTo: userId, description: 'OpenGraph metadata & dynamic sitemap generator' },
        { title: 'User Role Access Control & Permission Middleware', category: 'Security', priority: 'Critical', stage: 'completed', assignedTo: userId, description: 'Role-based authorization for HR, Admin, and Employees' },
        { title: 'Redis Session Caching Layer Integration', category: 'Backend', priority: 'High', stage: 'in-progress', assignedTo: userId, description: 'In-memory caching for fast user session lookups' },
        { title: 'Automated End-to-End Cypress E2E Testing Pipeline', category: 'QA & Testing', priority: 'Medium', stage: 'code-review', assignedTo: userId, description: 'Continuous integration test suite for pull requests' },
        { title: 'Multi-tenant Database Schema Migration', category: 'Database', priority: 'High', stage: 'backlog', assignedTo: userId, description: 'Isolated tenant database connections' },
        { title: 'GraphQL Rate Limiting & Query Depth Guard', category: 'Security', priority: 'Medium', stage: 'backlog', assignedTo: userId, description: 'Prevent malicious nested query DDoS attacks' }
      ]);
    }

    // 3. Seed 10 Company Hardware Assets if empty
    const assetCount = await Asset.countDocuments();
    if (assetCount === 0) {
      console.log('Seeding 10 Company Hardware Assets...');
      await Asset.insertMany([
        { name: 'MacBook Pro 16" M2 Max 32GB', category: 'Laptop', serialNumber: 'C02G4590Q65D', assignedUser: userId, condition: 'Excellent', status: 'Assigned' },
        { name: 'Dell UltraSharp 32" 4K USB-C Monitor', category: 'Monitor', serialNumber: 'DL-4K-99021', assignedUser: userId, condition: 'Excellent', status: 'Assigned' },
        { name: 'YubiKey 5C NFC Security Access Key', category: 'Access Key', serialNumber: 'YUBI-5C-88210', assignedUser: userId, condition: 'Excellent', status: 'Assigned' },
        { name: 'Sony WH-1000XM5 ANC Headset', category: 'Headset', serialNumber: 'SONY-XM5-1029', assignedUser: userId, condition: 'Excellent', status: 'Assigned' },
        { name: 'Apple iPad Pro 12.9" M2 Testing Tablet', category: 'Mobile', serialNumber: 'IPAD-M2-77102', assignedUser: null, condition: 'Excellent', status: 'Available' },
        { name: 'Dell Precision 7780 Workstation', category: 'Laptop', serialNumber: 'DELL-PR-55219', assignedUser: null, condition: 'Good', status: 'Available' },
        { name: 'LG Ergo 34" Ultrawide Curved Display', category: 'Monitor', serialNumber: 'LG-34-88192', assignedUser: userId, condition: 'Excellent', status: 'Assigned' },
        { name: 'Google Pixel 8 Pro Test Phone', category: 'Mobile', serialNumber: 'P8P-TEST-0012', assignedUser: null, condition: 'Excellent', status: 'Available' },
        { name: 'Logitech MX Master 3S Wireless Mouse', category: 'Headset', serialNumber: 'LOGI-MX3S-991', assignedUser: userId, condition: 'Excellent', status: 'Assigned' },
        { name: 'Anker Thunderbolt 4 Docking Station', category: 'Headset', serialNumber: 'ANKER-TB4-441', assignedUser: userId, condition: 'Excellent', status: 'Assigned' }
      ]);
    }

    // 4. Seed Attendance & Leave if empty
    const leaveCount = await Leave.countDocuments();
    if (leaveCount === 0) {
      console.log('Seeding Leave Applications & Attendance...');
      await Leave.insertMany([
        { user: userId, type: 'Paid', startDate: new Date('2026-08-15'), endDate: new Date('2026-08-18'), reason: 'Annual Family Vacation', status: 'approved', hrNote: 'Approved. Enjoy your vacation!' },
        { user: userId, type: 'Casual', startDate: new Date('2026-09-01'), endDate: new Date('2026-09-02'), reason: 'Personal errands', status: 'pending' }
      ]);
    }

    console.log('✅ Sample data seeded successfully! Default Admin: admin@devskills.com / admin123');
  } catch (err) {
    console.error('Error seeding sample data:', err);
  }
};
