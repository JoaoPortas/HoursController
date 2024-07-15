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

export async function getUserExtraHours(userID:number): Promise<UserExtraHoursViewModel | null> {
    return new Promise((resolve, reject) => {
        const userHours: IBaseExtraHoursRegist[] = []

        db.serialize(() => {
            const sql: string = `
                SELECT date, userID, morningStartTime, morningEndTime, afternoonStartTime, afternoonEndTime
                FROM extraHours
            `

            db.all(sql,
                (err: Error, rows: Array<IBaseExtraHoursRegist>) => {
                    if (err) {
                        console.error("Failed to fetching users from database: ", err.message)
                        reject(err)
                        return;
                    }

                    let formatedDate

                    rows.forEach((row: IBaseExtraHoursRegist) => {
                        userHours.push(row)
                        console.log("Hours:", row);
                    })

                    resolve(null)
            })
        })
    })
}
