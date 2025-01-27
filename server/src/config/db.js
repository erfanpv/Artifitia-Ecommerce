import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoUrl = process.env.MONGODB_URL;

const connectDb = async () => {
  try {
    const { connection } = await mongoose.connect(mongoUrl, {
      dbName: "ecommerce",
    });
    console.log(`MongoDB running on host ${connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDb;
