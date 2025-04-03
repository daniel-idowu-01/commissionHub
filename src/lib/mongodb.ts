import mongoose from "mongoose";

const MONGODB_URI = "mongodb://localhost:27017/"// || process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "ecom",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
