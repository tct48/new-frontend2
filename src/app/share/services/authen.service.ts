import { Injectable } from '@angular/core'

@Injectable({
    providedIn: 'root',
})
export class AuthenService {
    constructor() {}

    private accessKey = 'accessToken'

    setAuthenticated(accessToken: string,current_user:any): void {
        localStorage.setItem(this.accessKey, accessToken)
        localStorage.setItem("_id",current_user._id)
        localStorage.setItem("name",current_user.name)
        localStorage.setItem("username",current_user.username)
        localStorage.setItem("role",current_user.role)
        localStorage.setItem("company", current_user.company)
    }

    getUserLogin(){
        return {
            _id:localStorage.getItem("_id"),
            name:localStorage.getItem("name"),
            username:localStorage.getItem("username"),
            role:localStorage.getItem("role"),
            company: localStorage.getItem("company")
        }
    }

    setUserLogin(){
        var object = {
            _id: localStorage.getItem("_id"),
            name: localStorage.getItem("name"),
            username: localStorage.getItem("username"),
            role: localStorage.getItem("role"),
            company: localStorage.getItem("company")
        }
        return object;
    }

    getAuthenticated(): string {
        return localStorage.getItem(this.accessKey)
    }

    clearAuthenticated(): void {
        localStorage.removeItem(this.accessKey)
    }
}

export interface IUserLogin{
    _id:number,
    name:string,
    username:string,
    role:number
}
