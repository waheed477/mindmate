import mongoose from "mongoose";

// Use IPv4 explicitly
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mindmate?directConnection=true";

// Cache the connection
let cachedConnection: typeof mongoose | null = null;

export async function connectDB() {
  try {
    // If already connected, return cached connection
    if (cachedConnection && cachedConnection.connection.readyState === 1) {
      console.log("✅ Using existing MongoDB connection");
      return cachedConnection;
    }

    console.log(`🔗 Connecting to MongoDB: ${MONGODB_URI}`);
    
    // Close any existing connection
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    
    // Clear any existing models to prevent recompilation
    mongoose.models = {};
    
    // Connect with optimized settings
    const connection = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
      family: 4, // Force IPv4
      directConnection: true, // Direct connection (not through mongos)
    });
    
    cachedConnection = connection;
    
    console.log("✅ MongoDB connected successfully");
    
    // Test with a simple query
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("📁 Collections:", collections.map(c => c.name).join(", ") || "No collections yet");
    
    return connection;
    
  } catch (err: any) {
    console.error("❌ MongoDB connection failed:", err.message);
    
    // Diagnostic info
    console.log("\n=== DIAGNOSTIC INFO ===");
    console.log("1. Testing raw MongoDB connection...");
    
    // Test raw MongoDB driver
    const { MongoClient } = await import("mongodb");
    try {
      const client = new MongoClient("mongodb://127.0.0.1:27017", {
        serverSelectionTimeoutMS: 5000
      });
      await client.connect();
      const dbs = await client.db().admin().listDatabases();
      console.log("✅ Raw MongoDB driver works! Databases:", dbs.databases.map((d: any) => d.name));
      await client.close();
    } catch (mongoErr: any) {
      console.log("❌ Raw MongoDB also fails:", mongoErr.message);
    }
    
    console.log("\n=== POSSIBLE FIXES ===");
    console.log("1. Try: mongosh --eval 'db.adminCommand(\"ping\")'");
    console.log("2. Open MongoDB Compass and connect");
    console.log("3. Restart MongoDB: net stop MongoDB && net start MongoDB (as Admin)");
    console.log("4. Check MongoDB service in Services.msc");
    
    process.exit(1);
  }
}

export function getDB() {
  if (!cachedConnection) {
    throw new Error("Database not connected. Call connectDB() first.");
  }
  return cachedConnection.connection.db;
}
