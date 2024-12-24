import { db } from "@main/config/database";

export async function setupDatabase() {
    await setupUsers()
    await setupDayTypes()
    await setupExtraHours()
    //await populate()
    await setupExtraHoursReportConfigTable();

    await createViews()
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
  });

  db.prepare('SELECT COUNT(userId) AS total FROM users').get(
    (_err: Error | null, row: { total: number }) => {
        //console.log(row.total)

        if (row.total == 0) {
            db.prepare('INSERT INTO users(username, password, number, name, category, position) VALUES ("admin", "admin", "admin", "admin", "admin", "admin")').run()
        }
    }
    )
}

export async function setupDayTypes() {
    await db.serialize(() => {
        db.run('CREATE TABLE IF NOT EXISTS dayTypes (dayTypeID INTEGER PRIMARY KEY AUTOINCREMENT'
            + ',name TEXT'
            + ',description TEXT'
        + ')')

        db.prepare('SELECT COUNT(dayTypeID) AS total FROM dayTypes').get(
                (_err: Error | null, row: { total: number }) => {
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
      db.run('CREATE TABLE IF NOT EXISTS extraHours (extraHourID INTEGER PRIMARY KEY AUTOINCREMENT'
          + ',date TEXT'
          + ',userID INTEGER'
          + ',morningStartTime TEXT'
          + ',morningEndTime TEXT'
          + ',afternoonStartTime TEXT'
          + ',afternoonEndTime TEXT'
          + ',dayTypeID INTEGER'
          + ',FOREIGN KEY(userID) REFERENCES users(userId)'
          + ',FOREIGN KEY(dayTypeID) REFERENCES dayTypes(dayTypeID)'
          + ',UNIQUE(date, userID)'
      + ')')
  })
}

export async function createViews() {
    db.run(`CREATE VIEW IF NOT EXISTS vExtraHoursResume
            AS
            SELECT
                extraHourID,
                date,
                userID,
                morningStartTime,
                morningEndTime,
                afternoonStartTime,
                afternoonEndTime,
                dayTypeID,
                (
                    CASE
                        WHEN morningStartTime IS NOT NULL AND morningEndTime IS NOT NULL THEN
                            ((strftime('%H', morningEndTime) * 60 + strftime('%M', morningEndTime)) -
                            (strftime('%H', morningStartTime) * 60 + strftime('%M', morningStartTime))) / 60.0
                        ELSE 0
                    END
                ) +
                (
                    CASE
                        WHEN afternoonStartTime IS NOT NULL AND afternoonEndTime IS NOT NULL THEN
                            ((strftime('%H', afternoonEndTime) * 60 + strftime('%M', afternoonEndTime)) -
                            (strftime('%H', afternoonStartTime) * 60 + strftime('%M', afternoonStartTime))) / 60.0
                        ELSE 0
                    END
                ) AS extraHours
            FROM
                extraHours;`
    )

    db.run(`CREATE VIEW IF NOT EXISTS vUsersExtraHoursRows
        AS
        SELECT date,
        u.userID,
        u.number,
        u.category,
        u.position,
        u.name,
        morningStartTime,
        morningEndTime,
        afternoonStartTime,
        afternoonEndTime,
        strftime('%Y', date) AS 'Year', strftime('%m', date) AS 'Month', dayTypeID,
                (
                    CASE
                        WHEN morningStartTime IS NOT NULL AND morningEndTime IS NOT NULL THEN
                            ((strftime('%H', morningEndTime) * 60 + strftime('%M', morningEndTime)) -
                            (strftime('%H', morningStartTime) * 60 + strftime('%M', morningStartTime))) / 60.0
                        ELSE 0
                    END
                ) +
                (
                    CASE
                        WHEN afternoonStartTime IS NOT NULL AND afternoonEndTime IS NOT NULL THEN
                            ((strftime('%H', afternoonEndTime) * 60 + strftime('%M', afternoonEndTime)) -
                            (strftime('%H', afternoonStartTime) * 60 + strftime('%M', afternoonStartTime))) / 60.0
                        ELSE 0
                    END
                ) AS extraHours
				FROM extraHours e
				INNER JOIN users AS u ON u.userId = e.userID;`
)
}

export async function setupExtraHoursReportConfigTable() {
    await db.serialize(() => {
        db.run('CREATE TABLE IF NOT EXISTS reportConfiguration (configID INTEGER PRIMARY KEY AUTOINCREMENT' +
            ',patent TEXT' +
            ',commanderName TEXT' +
            ',commanderGender number' +
            ',commanderEspeciality TEXT' +
        ')');

        db.prepare('SELECT COUNT(patent) AS total FROM reportConfiguration').get(
            (_err: Error | null, row: { total: number }) => {
                //console.log(row.total)

                if (row.total == 0) {
                    db.prepare('INSERT INTO reportConfiguration(patent, commanderName, commanderGender, commanderEspeciality) VALUES ("N/A", "N/A", 1, "N/A")').run()
                }
            }
        )
    })
}

export async function populate() {
    db.prepare('INSERT INTO users(username, password, number, name, category, position) VALUES ("admin", "123", "XXXXXX-X", "Test Adm User", "XXXXXXXX", "XXXXXXXX")').run()
}
