import { db } from "@main/config/database"
import { IUser } from "@shared/models/interfaces/user.interface"
import { User } from "@shared/models/user.model"
import { Statement } from "sqlite3"

export async function getAllUsersInfo(): Promise<Array<IUser> | null> {
    return new Promise((resolve, reject) => {
        const users: Array<IUser> = []

        db.all('SELECT userId, username, number, name, category, position FROM users', (err: Error, rows: Array<IUser>) => {
            if (err) {
                console.error("Failed to fetching users from database: ", err.message)
                reject(err)
                return;
            }

            rows.forEach((row: IUser) => {
                users.push(new User(row.userId, row.username, row.number, row.name, row.category, row.position))
                console.log(`Username: ${row.username}`);
            })

            resolve(users)
        })
    })
}

export async function resetUserPassword(userID: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            const stmt: Statement = db.prepare("UPDATE users SET password = '' WHERE userID = ?")

            stmt.run(
                userID,
                async (err: Error) => {
                    if (err) {
                        console.error('Failed resetting password for user:', err)
                        stmt.finalize()
                        reject(err)
                    }
                    else {
                        console.info('Password reseted for user:', userID)
                        stmt.finalize()
                        resolve(true)
                    }
                }
            )
        })
    })
}