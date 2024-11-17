import { db } from "@main/config/database";
import { BaseExtraHoursRegist } from "@shared/models/hours/extraHoursRegist.model";
import { IExtraHoursResume } from "@shared/models/hours/interfaces/extraHoursResume.interface";
import { IBaseExtraHoursRegist } from "@shared/models/hours/interfaces/hoursRegist.interface";
import { IUsersExtraHoursRow } from "@shared/models/hours/interfaces/usersExtraHoursRow.interface";
import { UserExtraHoursViewModel } from "@shared/viewModels/hoursManagement/userExtraHours.viewmodel";
import { Statement } from "sqlite3";

export async function createExtraHoursRegist(newExtraHours: IBaseExtraHoursRegist): Promise<IBaseExtraHoursRegist | null> {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            const stmt: Statement = db.prepare("INSERT INTO extraHours(date, userID, morningStartTime, morningEndTime, afternoonStartTime, afternoonEndTime, dayTypeID) VALUES(?, ?, ?, ?, ?, ?, ?)")

            stmt.run(newExtraHours.date,
                newExtraHours.userID,
                newExtraHours.morningStartTime,
                newExtraHours.morningEndTime,
                newExtraHours.afternoonStartTime,
                newExtraHours.afternoonEndTime,
                newExtraHours.dayTypeID,
                async (err: Error) => {
                    if (err) {
                        console.error('Failed regist the extra hours for user:', err)
                        stmt.finalize()
                        reject(err)
                    }
                    else {
                        console.info('Extra hours registed for the user:', newExtraHours)
                        stmt.finalize()
                        resolve(newExtraHours)
                    }
                }
            )
        })
    })
}

export async function updateExtraHoursRegist(newExtraHours: IBaseExtraHoursRegist): Promise<IBaseExtraHoursRegist | null> {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            const stmt: Statement = db.prepare("UPDATE extraHours SET morningStartTime = ?, morningEndTime = ?, afternoonStartTime = ?, afternoonEndTime = ?, dayTypeID = ? WHERE date = ? AND userID = ?")

            stmt.run(
                newExtraHours.morningStartTime,
                newExtraHours.morningEndTime,
                newExtraHours.afternoonStartTime,
                newExtraHours.afternoonEndTime,
                newExtraHours.dayTypeID,
                newExtraHours.date,
                newExtraHours.userID,
                async (err: Error) => {
                    if (err) {
                        console.error('Failed updating the extra hours for user:', err)
                        stmt.finalize()
                        reject(err)
                    }
                    else {
                        console.info('Extra hours updated for the user:', newExtraHours)
                        stmt.finalize()
                        resolve(newExtraHours)
                    }
                }
            )
        })
    })
}

export async function getUserAllExtraHours(userID:number): Promise<UserExtraHoursViewModel | null> {
    return new Promise((resolve, reject) => {
        const userHours: IBaseExtraHoursRegist[] = []

        db.serialize(() => {
            const sql: string = `
                SELECT date, userID, morningStartTime, morningEndTime, afternoonStartTime, afternoonEndTime
                FROM extraHours ORDER BY date DESC
            `

            db.all(sql,
                (err: Error, rows: Array<IBaseExtraHoursRegist>) => {
                    if (err) {
                        console.error("Failed to fetching users from database: ", err.message)
                        reject(err)
                        return;
                    }

                    rows.forEach((row: IBaseExtraHoursRegist) => {
                        userHours.push(row)
                    })
            })

            const stmt: Statement = db.prepare('SELECT userId, number, category, position, name FROM users WHERE userId = ?');

            stmt.get(userID, (err: Error | null, row : {userId: number, number: string, category: string, position: string, name: string}) => {
                if (err) {
                    console.error(err.message);
                    reject(err)
                    return
                }

                if (row !== undefined) {
                    const userExtraHoursViewModel: UserExtraHoursViewModel = new UserExtraHoursViewModel(userID, row.number, row.category, row.position, row.name, userHours)
                    resolve(userExtraHoursViewModel)
                }
                else {
                    resolve(null)
                }
            });
        })
    })
}

export async function getUserAllExtraHoursByYearAndMonth(userID:number, year: string, month: string): Promise<UserExtraHoursViewModel | null> {
    return new Promise((resolve, reject) => {
        const userHours: IBaseExtraHoursRegist[] = []

        db.serialize(() => {
            const sql: string = `
                SELECT date, userID, morningStartTime, morningEndTime, afternoonStartTime, afternoonEndTime, strftime('%Y', date) AS 'Year', strftime('%m', date) AS 'Month'
                FROM extraHours
                WHERE userID = ? AND Month = ? AND Year = ? ORDER BY date DESC
            `

            const stmt: Statement = db.prepare(sql);

            stmt.all(userID,
                month,
                year,
                (err: Error | null, rows : Array<IBaseExtraHoursRegist>) => {
                    if (err) {
                        console.error("Failed to fetching extra hours from database: ", err.message)
                        reject(err)
                        return;
                    }

                    rows.forEach((row: IBaseExtraHoursRegist) => {
                        userHours.push(row)
                    })
            });

            const stmtUser: Statement = db.prepare('SELECT userId, number, category, position, name FROM users WHERE userId = ?');

            stmtUser.get(userID, (err: Error | null, row : {userId: number, number: string, category: string, position: string, name: string}) => {
                if (err) {
                    console.error(err.message);
                    reject(err)
                    return
                }

                if (row !== undefined) {
                    const userExtraHoursViewModel: UserExtraHoursViewModel = new UserExtraHoursViewModel(userID, row.number, row.category, row.position, row.name, userHours)
                    resolve(userExtraHoursViewModel)
                }
                else {
                    resolve(null)
                }
            });
        })
    })
}

export async function getUserExtraHoursByDate(userID: number, date: string): Promise<IBaseExtraHoursRegist | null> {
    const stmt: Statement = db.prepare('SELECT date, userID, morningStartTime, morningEndTime, afternoonStartTime, afternoonEndTime FROM extraHours WHERE userID = ? AND date = ?');

    return new Promise<IBaseExtraHoursRegist | null>((resolve, reject) => {
        stmt.get(userID, date, (err: Error | null, row : IBaseExtraHoursRegist) => {
            if (err) {
                console.error(err.message);
                reject(err)
                return
            }

            if (row !== undefined) {
                resolve(row)
            }
            else {
                resolve(null)
            }
        });
    })
}

export async function getUserAllExtraHoursResumeByYearAndMonth(userID:number, year: string, month: string): Promise<IExtraHoursResume[] | null> {
    return new Promise((resolve, reject) => {
        const userHours: IExtraHoursResume[] = []

        db.serialize(() => {
            const sql: string = `
                SELECT extraHourID, userId, dayTypeID, date, strftime('%m', date) AS 'Month', strftime('%Y', date) AS 'Year', extraHours FROM vExtraHoursResume WHERE userID = ? AND Month = ? AND Year = ?
            `

            const stmt: Statement = db.prepare(sql);

            stmt.all(userID,
                month,
                year,
                (err: Error | null, rows : Array<IExtraHoursResume>) => {
                    if (err) {
                        console.error("Failed to fetching extra hours resume from database: ", err.message)
                        reject(err)
                        return;
                    }

                    rows.forEach((row: IExtraHoursResume) => {
                        userHours.push(row)
                    })

                    resolve(userHours)
            });
        })
    })
}

export async function getUserAllExtraHoursResumeByYear(userID:number, year: string): Promise<IExtraHoursResume[] | null> {
    return new Promise((resolve, reject) => {
        const userHours: IExtraHoursResume[] = []

        db.serialize(() => {
            const sql: string = `
                SELECT extraHourID, userId, dayTypeID, date, strftime('%m', date) AS 'Month', strftime('%Y', date) AS 'Year', extraHours FROM vExtraHoursResume WHERE userID = ? AND Year = ?
            `

            const stmt: Statement = db.prepare(sql);

            stmt.all(userID,
                year,
                (err: Error | null, rows : Array<IExtraHoursResume>) => {
                    if (err) {
                        console.error("Failed to fetching extra hours resume from database: ", err.message)
                        reject(err)
                        return;
                    }

                    rows.forEach((row: IExtraHoursResume) => {
                        userHours.push(row)
                    })

                    resolve(userHours)
            });
        })
    })
}

export async function getAllUsersExtraHoursByYearAndMonth(year: string, month: string): Promise<UserExtraHoursViewModel[] | null> {
    return new Promise((resolve, reject) => {
        let currentUserID: number | null = null;
        //Receive the hours for the current user and when finish one user gets cleard and go to another.
        let userHours: IBaseExtraHoursRegist[] = []
        let user: UserExtraHoursViewModel | null = null;

        const allUsers: UserExtraHoursViewModel[] = [];

        let number: string = ""
        let category: string = ""
        let position: string = ""
        let name: string = ""

        db.serialize(() => {
            const sql: string = `
                SELECT date, userID, number, category, position, name, morningStartTime, morningEndTime, afternoonStartTime, afternoonEndTime, strftime('%Y', date) AS 'Year', strftime('%m', date) AS 'Month', dayTypeID, extraHours
                FROM vUsersExtraHoursRows
                WHERE Month = ? AND Year = ? ORDER BY number ASC, date ASC
            `

            const stmt: Statement = db.prepare(sql);

            stmt.all(
                month,
                year,
                (err: Error | null, rows : Array<IUsersExtraHoursRow>) => {
                    if (err) {
                        console.error("Failed to fetching all users extra hours from database: ", err.message)
                        reject(err)
                        return;
                    }

                    rows.forEach((row: IUsersExtraHoursRow) => {
                        if (currentUserID === null || currentUserID !== row.userId) {
                            if (currentUserID === null) {
                                currentUserID = row.userId;

                                number = row.number;
                                category = row.category;
                                position = row.position;
                                name = row.name;

                                userHours.push(new BaseExtraHoursRegist(row.date, row.userId, row.morningStartTime, row.morningEndTime, row.afternoonStartTime, row.afternoonEndTime, row.dayTypeID, row.extraHours))

                                return
                            }

                            user = new UserExtraHoursViewModel(currentUserID, number, category, position, name, userHours);
                            allUsers.push(user);


                            //Restart counters and set the new user info
                            currentUserID = row.userId;
                            userHours = []
                            user = null;

                            number = row.number;
                            category = row.category;
                            position = row.position;
                            name = row.name;
                        }

                        userHours.push(new BaseExtraHoursRegist(row.date, row.userId, row.morningStartTime, row.morningEndTime, row.afternoonStartTime, row.afternoonEndTime, row.dayTypeID, row.extraHours))
                    })

                    user = new UserExtraHoursViewModel(currentUserID ?? -1, number, category, position, name, userHours);
                    allUsers.push(user);

                    resolve(allUsers)
            });


        })
    })
}

export async function getUserTotalHoursExcludingMonthByYear(userID:number, year: string, excludedMonth: string): Promise<number | null> {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            const sql: string = `
                SELECT COALESCE(strftime('%Y', date), ?) AS 'Year', COALESCE(SUM(extraHours), 0) AS 'Total' FROM vExtraHoursResume WHERE userID = ? AND Year = ? AND strftime('%m', date) NOT BETWEEN ? AND '12'
            `

            const stmt: Statement = db.prepare(sql);

            stmt.get(year,
                userID,
                year,
                excludedMonth,
                (err: Error | null, row : { Year: string, Total: number }) => {
                    if (err) {
                        console.error("Failed to fetching total extra hours resume from database: ", err.message)
                        reject(err)
                        return;
                    }

                    //console.log(row);

                    resolve(row.Total)
            });
        })
    })
}

export async function getUserExtraHoursByYearAndMonth(userID: number, year: string, month: string): Promise<IBaseExtraHoursRegist[] | null> {
    return new Promise((resolve, reject) => {
        let userHours: IBaseExtraHoursRegist[] = [];

        db.serialize(() => {
            const sql: string = `
                SELECT date, userId, morningStartTime, morningEndTime, afternoonStartTime, afternoonEndTime, strftime('%Y', date) AS 'Year', strftime('%m', date) AS 'Month', dayTypeID, extraHours
                FROM vUsersExtraHoursRows
                WHERE userId = ? AND Month = ? AND Year = ? ORDER BY number ASC, date ASC
            `

            const stmt: Statement = db.prepare(sql);

            stmt.all(
                userID,
                month,
                year,
                (err: Error | null, rows : Array<IUsersExtraHoursRow>) => {
                    if (err) {
                        console.error("Failed to fetching user extra hours from database: ", err.message)
                        reject(err)
                        return;
                    }

                    rows.forEach((row: IUsersExtraHoursRow) => {
                        userHours.push(new BaseExtraHoursRegist(row.date, row.userId, row.morningStartTime, row.morningEndTime, row.afternoonStartTime, row.afternoonEndTime, row.dayTypeID, row.extraHours))
                    })

                    resolve(userHours)
            });


        })
    })
}

export async function getUsersIDsWithExtraHoursInYearAndMonth(year: string, month: string): Promise<number[]> {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            const sql: string = `
                SELECT DISTINCT(userId) FROM vExtraHoursResume
                WHERE strftime('%Y', date) = ? AND strftime('%m', date) = ?
            `

            const stmt: Statement = db.prepare(sql);

            stmt.all(
                year,
                month,
                (err: Error | null, rows: { userID: number }[]) => {
                    if (err) {
                        console.error("Failed to fetching user IDs with extra hours in month and year from database: ", err.message)
                        reject(err)
                        return;
                    }

                    // Map the userId values from rows
                    const usersIDs = rows.map((row) => row.userID);
                    resolve(usersIDs);
            });


        })
    })
}
