import { MongoClient } from "mongodb";

async function testMongoDB() {
  const uri = "mongodb://localhost:27017/mindmate";
  console.log("Testing connection to:", uri);
  
  try {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
    await client.connect();
    
    const db = client.db("mindmate");
    
    // Ping the database
    await db.command({ ping: 1 });
    console.log("✅ Ping successful - MongoDB is running!");
    
    // List databases
    const adminDb = client.db().admin();
    const databases = await adminDb.listDatabases();
    console.log("📊 Available databases:");
    databases.databases.forEach(db => {
      console.log(`   - ${db.name} (${db.sizeOnDisk} bytes)`);
    });
    
    // List collections in mindmate database
    const collections = await db.listCollections().toArray();
    console.log("📁 Collections in 'mindmate':");
    if (collections.length === 0) {
      console.log("   No collections yet - will be created when you run the app");
    } else {
      collections.forEach(col => {
        console.log(`   - ${col.name}`);
      });
    }
    
    await client.close();
    console.log("🎉 MongoDB test completed successfully!");
    
  } catch (error) {
    console.error("❌ MongoDB test failed:", error.message);
    console.log("\nTroubleshooting:");
    console.log("1. Make sure MongoDB Compass is open and running");
    console.log("2. Or start MongoDB service: net start MongoDB");
    console.log("3. Check if port 27017 is not blocked by firewall");
  }
}

testMongoDB();
