import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

const mongoUri: string = MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalForMongoose = globalThis as typeof globalThis & {
  __mongooseCache?: MongooseCache;
};

const cached: MongooseCache = globalForMongoose.__mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!globalForMongoose.__mongooseCache) {
  globalForMongoose.__mongooseCache = cached;
}

export default async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongoUri).then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
