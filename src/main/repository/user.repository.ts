import { db } from '../config/database';
import { Statement } from 'sqlite3';

import { IUser } from '@shared/models/interfaces/user.interface';
import { User } from '@shared/models/user.model';
//import { User } from '../../shared/models/user.model';
import { UserRegist } from '@shared/models/auth.model';


export async function something(newUser: UserRegist): Promise<UserRegist> {
  console.log(newUser.username)

  return newUser
}

export async function createUser(newUser: UserRegist): Promise<UserRegist | null> {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            const stmt: Statement = db.prepare('INSERT INTO users(username, password, number, name, category, position) VALUES (?, ?, ?, ?, ?, ?)')
            stmt.run(
                newUser.username,
                newUser.password,
                newUser.number,
                newUser.name,
                newUser.category,
                newUser.position,
                (err: Error) => {
                    if (err) {
                        console.error('Failed to create the user:', err)
                        stmt.finalize()
                        reject(err)
                    }
                    else {
                        console.info('New user created', newUser)
                        stmt.finalize()
                        resolve(newUser)
                    }
                }
            )
        })
    })
}

export async function getAllUsers(): Promise<Array<IUser> | null> {
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
            })

            console.log(`Retrived ${users.length} users`);
            resolve(users)
        })
    })
    /*await db.each('SELECT userId, username, number, name, category, position FROM users', (err: Error | null, row: IUser) => {
        if (err) {
            console.log(err.message)
        }

        console.log(`User ID: ${row.userId}, UserName: ${row.username}, Name: ${row.name}`)
    })*/

    return null
}

/*export async function getAllUsers(): Promise<Array<IUser> | null> {
    console.log("Getting all users")

    await db.each('SELECT userId, name FROM users', (err: Error | null, row : {userId: number, name: string}) => {
        if (err) {
            console.error(err.message);
        }
        console.log(`User ID: ${row.userId}, User Name: ${row.name}`)
    })

    return null
    return null
}*/

/*export async function getUserById(userId:number): Promise<IUser | null> {
    /*console.log("Repository: Getting the user by ID" + userId)

    const stmt: Statement = db.prepare('SELECT userId, number, name FROM users WHERE userId = ?');

    return new Promise<IUser | null>((resolve, reject) => {
        stmt.get(userId, (err: Error | null, row : {userId: number, number: string, name: string}) => {
            if (err) {
                console.error(err.message);
                reject(err)
                return
            }

            if (row !== undefined) {
                const userFound: IUser | null = new User(row.userId, row.number, row.name)
                resolve(userFound)
            }
            else {
                resolve(null)
            }
        });
    })
   return null
}*/
