/** @format */

import mongoose from 'mongoose';
export const DBConnect = async () => {
  // const dbOptions = {
  //   dbName: process.env.MONGO_DB_NAME,
  // };
  try {
    // await mongoose.connect(process.env.MONGO_URL, dbOptions);
    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB connected Successfully 🆗');
  } catch (error) {
    // console.log(error);
    console.log(`Error is: ${error.message}`);
    process.exit(1);
  }
};
