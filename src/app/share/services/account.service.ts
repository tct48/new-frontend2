import { Injectable } from '@angular/core'
import { Observable, BehaviorSubject } from 'rxjs'
import { HttpService } from '../http.service'
import { AlertService } from '../shareds/alert.service'
import { AuthenService } from './authen.service'

@Injectable({
    providedIn: 'root',
})
export class AccountService {
    currentUser:Observable<IAccount>
    constructor(
        private http: HttpService,
        private alert: AlertService,
        private authen: AuthenService
    ) {
    }

    public UserLogin: IAccount = {} as any
    // Set ข้อมูล User และ Return UserLogin
    public setUserLogin(UserLogin: IAccount) {
        this.UserLogin._id = UserLogin._id
        this.UserLogin.email = UserLogin.email
        this.UserLogin.phone = UserLogin.phone
        this.UserLogin.firstname = UserLogin.firstname
        this.UserLogin.lastname = UserLogin.lastname
        this.UserLogin.username = UserLogin.username
        this.UserLogin.password = UserLogin.password
        if (UserLogin.image) {
            this.UserLogin.image = UserLogin.image
        }
        this.UserLogin.sid = UserLogin.sid
        this.UserLogin.role = UserLogin.role
        this.UserLogin.exp = UserLogin.exp
        this.UserLogin.class = UserLogin.class
        this.UserLogin.guild = UserLogin.guild
        // console.log(this.UserLogin);
        return this.UserLogin
    }

    setUserMenu(){
        this.UserLogin.menu = true;
    }

    // เซตค่า UserLogin
    getUserLogin(accessToken: string) {
        return (this.http
            .requestGet('user/data', accessToken)
            .toPromise() as Promise<IAccount>).then((result) =>
            this.setUserLogin(result)
        )
    }

    // ล๊อกอิน
    onLogin(model: ILogin) {
        return this.http
            .requestPost('member/login', model)
            .toPromise() as Promise<{ accessToken: string,user:any }>
    }

    // ล๊อกเอาท์
    onLogout() {
        // this.alert.notify('ขอบคุณที่ใช้งาน','ขอบคุณ', 'success')
    }

    // สมัครสมาชิก
    onRegister(model: IRegister) {
        return this.http
            .requestPost('user/signup', model)
            .toPromise() as Promise<IRegister>
    }

    // อัพโหลดรูปภาพ
    onUploadImage(model: any) {
        return this.http
            .requestPost('user/uploadImage', model)
            .toPromise() as Promise<any>
    }

    // เปลี่ยนรหัสผ่าน
    onChangePassword(accessToken: string, model: IChangePassword) {
        return this.http
            .requestPatch('user/change_password', accessToken, model)
            .toPromise() as Promise<IAccount>
    }
}

export interface IAccount {
    _id: string
    firstname: string
    lastname: string
    username: string
    password: string
    email: string
    phone: string

    class?:string
    image?: string
    sid?: string

    exp?: number
    guild?:string
    role?: string
    menu?:boolean
}

export interface IRegister {
    _id: string
    firstname: string
    lastname: string
    username: string
    password: string
    email: string
    phone: string
    image?: string
    class?:string
}

export interface ILogin {
    username: string
    password: string
}

export interface IChangePassword {
    old_pass: string
    new_pass: string
}
