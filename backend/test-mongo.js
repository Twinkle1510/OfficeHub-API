const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs');
const path = require('path');

async function test() {
  const dbPath = path.join(__dirname, 'mongo-data');
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath);
    console.log('Created dbPath');
  }

  const mongoServer = await MongoMemoryServer.create({
    instance: {
      dbPath: dbPath,
      storageEngine: 'wiredTiger'
    }
  });

  console.log('URI:', mongoServer.getUri());
  setTimeout(async () => {
    await mongoServer.stop({ doCleanup: false });
    console.log('Stopped and persisted.');
  }, 3000);
}

test();
