import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Db has been connected");
  } catch (error) {
    console.log("DB Connection failed", error.message);
  }
};

export default connectDB;
