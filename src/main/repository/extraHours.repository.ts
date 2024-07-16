import { db } from "@main/config/database";
import { IBaseExtraHoursRegist } from "@shared/models/hours/interfaces/hoursRegist.interface";
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

export async function getUserExtraHours(userID:number): Promise<UserExtraHoursViewModel | null> {
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
