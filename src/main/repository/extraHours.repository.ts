import { db } from "@main/config/database";
import { IBaseExtraHoursRegist } from "@shared/models/hours/interfaces/hoursRegist.interface";
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
