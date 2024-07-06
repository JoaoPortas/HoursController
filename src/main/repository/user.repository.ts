import { db } from '../config/database';
import { Statement } from 'sqlite3';
import { UserRegist } from '@shared/models/auth.model';


export async function something(newUser: UserRegist): Promise<UserRegist> {
  console.log(newUser.username)

  return newUser
}

export async function createUser(newUser: UserRegist): Promise<void> {
    await db.serialize(() => {
          const stmt: Statement = db.prepare('INSERT INTO users(username, password, number, name, category, position) VALUES (?, ?, ?, ?, ?, ?)')
          stmt.run(newUser.username, newUser.password, newUser.number, newUser.name, newUser.category, newUser.position)
          stmt.finalize()
    })
}
/*
export async function getAllUsers(): Promise<Array<>> {

}*/
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
