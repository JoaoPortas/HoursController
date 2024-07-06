export interface IBaseUser {
  userId: number,
  username: string
}

export interface IUser extends IBaseUser {
  number: string,
  name: string,
  category: string,
  position: string
}
