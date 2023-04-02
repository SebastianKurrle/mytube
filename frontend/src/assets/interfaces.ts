
// User
interface User  {
    name:string,
    email:string,
    password:string
}

// For the login
interface UserLogin {
    email:string,
    password:string
}

interface MyTubeAccount {
    name:string,
    description:string,
    profile_picture:object,
    owner:number
}

export type { User, UserLogin, MyTubeAccount }
