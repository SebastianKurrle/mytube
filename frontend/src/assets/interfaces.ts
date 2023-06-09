
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

// Interface for API returned videos
interface VideoCALL {
    id:string,
    name:string,
    video:string,
    thumbnail:string,
    calls: number,
    datetime_posted:string,
    description:string,
    mt_account:string,
    url:string
}

// Comment interface to post a comment video and user type string is the id
interface Comment {
    message:string,
    video:string,
    user:string
}

export type { User, UserLogin, MyTubeAccount, MyTubeAccountUpdate, Video, VideoCALL, Comment }
