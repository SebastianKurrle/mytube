
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
    id:string,
    name:string,
    description:string,
    profile_picture:object,
    owner:number
}

interface MyTubeAccountUpdate {
    name:string,
    description:string,
    profile_picture:object,
}

// video

interface Video {
    name:string,
    video:any,
    description:string,
    thumbnail:object,
    mt_account:string
}

export type { User, UserLogin, MyTubeAccount, MyTubeAccountUpdate, Video }
