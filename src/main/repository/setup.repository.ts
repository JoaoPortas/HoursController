import { db } from "@main/config/database";

export async function setupDatabase() {
    await setupUsers()
    await setupDayTypes()
}

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

export async function setupDayTypes() {
  await db.serialize(() => {
      db.run('CREATE TABLE IF NOT EXISTS dayTypes (dayTypeID INTEGER PRIMARY KEY AUTOINCREMENT'
          + ',name TEXT'
          + ',description TEXT'
      + ')')
  })
}
