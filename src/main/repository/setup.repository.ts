import { db } from "@main/config/database";

export async function setupDatabase() {
    await setupUsers()
    await setupDayTypes()
    await setupExtraHours()
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

        db.prepare('SELECT COUNT(dayTypeID) AS total FROM dayTypes').get(
                (err: Error | null, row: { total: number }) => {
                    //console.log(row.total)

                    if (row.total == 0) {
                        db.prepare('INSERT INTO dayTypes(name) VALUES ("Dia de Semana")').run()
                        db.prepare('INSERT INTO dayTypes(name) VALUES ("Fim de semana")').run()
                        db.prepare('INSERT INTO dayTypes(name) VALUES ("Feriado")').run()
                    }
            }
        )

        /*db.all('SELECT dayTypeID, name, description FROM dayTypes', (err: Error, rows: { dayTypeID: number, name: string, description: string }[]) => {

            rows.forEach((row: { dayTypeID: number, name: string, description: string }) => {
                console.log(`DayTypeID: ${row.dayTypeID}\nName: ${row.name}\nDesc: ${row.description}`);
            })
        })*/
    })
}

export async function setupExtraHours() {
  await db.serialize(() => {
      db.run('CREATE TABLE IF NOT EXISTS extraHours (date TEXT'
          + ',userID INTEGER'
          + ',morningStartTime TEXT'
          + ',morningEndTime TEXT'
          + ',afternoonStartTime TEXT'
          + ',afternoonEndTime TEXT'
          + ',dayTypeID INTEGER'
          + ',FOREIGN KEY(userID) REFERENCES users(userId)'
          + ',FOREIGN KEY(dayTypeID) REFERENCES dayTypes(dayTypeID)'
          + ',PRIMARY KEY(date, userID)'
      + ')')
  })
}
