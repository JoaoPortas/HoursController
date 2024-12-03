import { db } from '@main/config/database';
import { Statement } from 'sqlite3';

import { IUser } from '@shared/models/interfaces/user.interface';
import { User } from '@shared/models/user.model';
import { UserRegist } from '@shared/models/auth.model';
import { IUserAuth } from '@shared/models/interfaces/userAuth.interface';


function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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
                async (err: Error) => {
                    if (err) {
                        console.error('Failed to create the user:', err)
                        stmt.finalize()
                        //await delay(5000)
                        reject(err)
                    }
                    else {
                        console.info('New user created', newUser)
                        stmt.finalize()
                        //await delay(5000)
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
                console.log(`Username: ${row.username}`);
            })

            console.log(`Retrived ${users.length} users`);
            resolve(users)
        })
    })
}

export async function checkUsername(username: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const stmt : Statement = db.prepare('SELECT username FROM users WHERE username = ?')

        stmt.get(
            username,
            (err: Error | null, row: {username: string}) => {
                if (err) {
                    console.error("Failed to fetching users from database: ", err.message)
                    reject(err)
                    return;
                }

                // Check if row is defined
                const alreadyExists = row !== undefined;

                if (alreadyExists) {
                    console.log(row.username);
                }

                resolve(alreadyExists)
        })
    })
}

export async function authenticateUser(userAuth: IUserAuth): Promise<User | null> {
    return new Promise((resolve, reject) => {
        const stmt: Statement = db.prepare('SELECT userId, name FROM users WHERE username = ? AND password = ?')

        stmt.get(
            userAuth.username,
            userAuth.password,
            (err: Error | null, row: { userId: number, name: string }) => {
                if (err) {
                    console.error("Failed to signIn user from database: ", err.message)
                    reject(err)
                    return;
                }

                const loginFound = row !== undefined

                if (loginFound) {
                    resolve(new User(row.userId, "", "", row.name, "", ""))
                }
                else {
                    resolve(null)
                }
            }
        )
    })
}

export async function getUserById(userId:number): Promise<IUser | null> {
    //console.log("Repository: Getting the user by ID" + userId)

    const stmt: Statement = db.prepare('SELECT userId, username, number, name, category, position FROM users WHERE userId = ?');

    return new Promise<IUser | null>((resolve, reject) => {
        stmt.get(userId, (err: Error | null, row : User) => {
            if (err) {
                console.error(err.message);
                reject(err)
                return
            }

            if (row !== undefined) {
                const userFound: IUser | null = new User(row.userId, row.username, row.number, row.name, row.category, row.position)
                resolve(userFound)
            }
            else {
                resolve(null)
            }
        });
    })
}

export async function updateUserDataByUserID(userID: number, userData:IUser): Promise<IUser | null> {
    //console.log("Repository: Getting the user by ID" + userId)

    const stmt: Statement = db.prepare('UPDATE users SET number = ?, name = ?, category = ?, position = ? WHERE userId = ?');

    return new Promise<IUser | null>((resolve, reject) => {
        stmt.run(userData.number,
            userData.name,
            userData.category,
            userData.position,
            userID,
            async (err: Error) => {
                if (err) {
                    console.error('Failed updating the user data: ', err)
                    stmt.finalize()
                    reject(err)
                }
                else {
                    console.info('User data updated: ', userData)
                    stmt.finalize()
                    resolve(userData)
                }
            }
        );
    })
}
