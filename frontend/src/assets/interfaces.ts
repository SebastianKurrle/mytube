
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

export type { User, UserLogin }
