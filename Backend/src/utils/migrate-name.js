// backend/src/utils/migrate-name.js
// Run once: node src/utils/migrate-name.js
import mongoose from "mongoose";
import userModel from "../models/user.model.js";
import config from "../config/config.js";

const migrate = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("Connected to MongoDB...");

    const result = await userModel.updateMany(
      { name: { $exists: false } },
      { $set: { name: "" } },
    );

    console.log(`Backfilled name for ${result.modifiedCount} users.`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
};

migrate();
