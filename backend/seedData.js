const Skill = require('./models/Skill');
const Project = require('./models/Project');
const Asset = require('./models/Asset');
const Attendance = require('./models/Attendance');
const Leave = require('./models/Leave');
const User = require('./models/User');
const Activity = require('./models/Activity');
const Message = require('./models/Message');
const Payroll = require('./models/Payroll');

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

    // 0.5. Seed 10 Sample Users
    const totalUsers = await User.countDocuments();
    if (totalUsers < 13) {
      console.log('Seeding 10 Sample Users...');
      const sampleUsers = [
        { name: 'John Doe', email: 'john@devskills.com', password: 'password123', role: 'developer' },
        { name: 'Jane Smith', email: 'jane@devskills.com', password: 'password123', role: 'designer' },
        { name: 'Michael Brown', email: 'michael@devskills.com', password: 'password123', role: 'tester' },
        { name: 'Emily Davis', email: 'emily@devskills.com', password: 'password123', role: 'employee' },
        { name: 'Daniel Wilson', email: 'daniel@devskills.com', password: 'password123', role: 'developer' },
        { name: 'Olivia Garcia', email: 'olivia@devskills.com', password: 'password123', role: 'hr' },
        { name: 'William Martinez', email: 'william@devskills.com', password: 'password123', role: 'employee' },
        { name: 'Sophia Anderson', email: 'sophia@devskills.com', password: 'password123', role: 'designer' },
        { name: 'James Thomas', email: 'james@devskills.com', password: 'password123', role: 'tester' },
        { name: 'Isabella Taylor', email: 'isabella@devskills.com', password: 'password123', role: 'user' }
      ];
      
      for (const uData of sampleUsers) {
        const exists = await User.findOne({ email: uData.email });
        if (!exists) {
          await User.create(uData);
        }
      }
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

    // 4. Seed Leave if empty
    const leaveCount = await Leave.countDocuments();
    if (leaveCount === 0) {
      console.log('Seeding 10 Leave Applications...');
      const leaveRecords = [];
      for(let i = 1; i <= 10; i++) {
        leaveRecords.push({
          user: userId,
          type: i % 2 === 0 ? 'Paid' : 'Casual',
          startDate: new Date(`2026-0${(i%9)+1}-10`),
          endDate: new Date(`2026-0${(i%9)+1}-12`),
          reason: `Sample Leave Reason ${i}`,
          status: i % 3 === 0 ? 'approved' : 'pending'
        });
      }
      await Leave.insertMany(leaveRecords);
    }

    // 5. Seed Attendance if empty
    const attendanceCount = await Attendance.countDocuments();
    if (attendanceCount === 0) {
      console.log('Seeding 10 Attendance records...');
      const attendanceRecords = [];
      for(let i = 1; i <= 10; i++) {
        attendanceRecords.push({
          user: userId,
          date: `2026-08-${i.toString().padStart(2, '0')}`,
          punchIn: new Date(`2026-08-${i.toString().padStart(2, '0')}T09:00:00Z`),
          punchOut: new Date(`2026-08-${i.toString().padStart(2, '0')}T17:30:00Z`),
          workHours: 8.5,
          overtimeHours: 0.5,
          status: 'completed'
        });
      }
      await Attendance.insertMany(attendanceRecords);
    }

    // 6. Seed Activity if empty
    const activityCount = await Activity.countDocuments();
    if (activityCount === 0) {
      console.log('Seeding 10 Activity records...');
      const activityRecords = [];
      for(let i = 1; i <= 10; i++) {
        activityRecords.push({
          user: userId,
          action: i % 2 === 0 ? 'completed' : 'started',
          skillTitle: `Sample Skill Task ${i}`,
          category: 'Development'
        });
      }
      await Activity.insertMany(activityRecords);
    }

    // 7. Seed Message if empty
    const messageCount = await Message.countDocuments();
    if (messageCount === 0) {
      console.log('Seeding 10 Messages...');
      const msgRecords = [];
      for(let i = 1; i <= 10; i++) {
        msgRecords.push({
          sender: userId,
          receiver: empUser._id, // use the alex user we found/created
          content: `This is a sample message number ${i} discussing the recent updates.`,
          read: i % 3 === 0
        });
      }
      await Message.insertMany(msgRecords);
    }

    // 8. Seed Payroll if empty
    const payrollCount = await Payroll.countDocuments();
    if (payrollCount === 0) {
      console.log('Seeding 10 Payroll records...');
      const payrollRecords = [];
      for(let i = 1; i <= 10; i++) {
        payrollRecords.push({
          user: userId,
          month: `2026-${i.toString().padStart(2, '0')}`,
          baseSalary: 5000,
          overtimePay: 200,
          bonuses: i === 10 ? 1000 : 0,
          deductions: 150,
          netSalary: 5050 + (i === 10 ? 1000 : 0),
          status: i < 8 ? 'paid' : 'pending',
          paymentDate: i < 8 ? new Date(`2026-${i.toString().padStart(2, '0')}-28`) : null
        });
      }
      await Payroll.insertMany(payrollRecords);
    }

    console.log('✅ Sample data seeded successfully! Default Admin: admin@devskills.com / admin123');
  } catch (err) {
    console.error('Error seeding sample data:', err);
  }
};
