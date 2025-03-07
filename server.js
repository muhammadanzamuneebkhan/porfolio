/** @format */

import { app } from './src/app.js';
import { DBConnect } from './src/config/db.js';
// console.log(process.env.Db_Url);
app.listen(process.env.PORT, async () => {
  try {
    await DBConnect();
    console.log(
      `Now You Live on Local Host Link is Here: http://localhost:${process.env.PORT}`
    );
  } catch (err) {
    console.log(`Error is:${err.message}`);
    process.exit(1);
  }
});
