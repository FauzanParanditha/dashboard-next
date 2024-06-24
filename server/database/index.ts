import { Db, MongoClient } from "mongodb";

const dbURI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/dashboard-next";
// init db
let db: Db | null = null;

if (!dbURI) {
  throw new Error("MONGODB_URI environment variable is not defined");
}

const connectDB = async () => {
  if (db === null) {
    // @ts-ignore
    if (process.env.NODE_ENV !== "production" && global._mongoDB) {
      // @ts-ignore
      db = global._mongoDB;
    } else {
      const connect = await MongoClient.connect(dbURI, {
        connectTimeoutMS: 10000,
        socketTimeoutMS: 10000,
        serverSelectionTimeoutMS: 10000,
      });
      db = connect.db();
      if (process.env.NODE_ENV !== "production") {
        // @ts-ignore
        global._mongoDB = db;
      }
    }
  }
  return db as Db;
};

export default connectDB;
