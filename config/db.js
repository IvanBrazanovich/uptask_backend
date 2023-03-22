import mongoose from "mongoose";
import dotenv from "dotenv";

const conectarDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.log(`error: ${error.message}`);
    process.exit(1);
  }
};

export default conectarDB;
