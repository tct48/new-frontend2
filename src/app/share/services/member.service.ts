import { Injectable } from '@angular/core'
import { AuthenService } from './authen.service'
import { HttpService } from '../http.service'

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  member: Number[]
  constructor(
    private authen:AuthenService,
    private http: HttpService
  ) { }

  loadMember(option:OptionSearch) {
    let url = `member/?sp=${option.sp}&lp=${option.lp}&company=${localStorage.getItem('company')}&role=${localStorage.getItem('role')}`;
    return this.http.requestGet(url, this.authen.getAuthenticated())
      .toPromise() as Promise<any>
  }

  insertMember(model:any){
    let url = `member/`;
    return this.http.requestPost(url, model)
      .toPromise() as Promise<any>
  }

  updateMember(model:any){
    let url = `member/`;
    return this.http.requestPut(url,this.authen.getAuthenticated(),model)
      .toPromise() as Promise<any>
  }

  deleteMember(_id:number){
    let url = "member/" + _id;
    return this.http.requestDelete(url, this.authen.getAuthenticated())
      .toPromise() as Promise<any>
  }
}

export interface ITopPlayer {
  items: any,
  username: string,
  exp: number,
  badge: any
}

export interface OptionSearch{
  sp:Number,
  lp:Number,
  text_search?:string
  company?:number,
  role?:number
}