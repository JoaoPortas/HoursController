import { db } from "../config/database";

export async function setupUsers() {
  await db.serialize(() => {
      db.run('CREATE TABLE IF NOT EXISTS users (userId INTEGER PRIMARY KEY AUTOINCREMENT' +
          ',username TEXT' +
          ',password TEXT' +
          ',number TEXT' +
          ',name TEXT' +
          ',category TEXT' +
          ',position TEXT' +
      ')');
  })
}
