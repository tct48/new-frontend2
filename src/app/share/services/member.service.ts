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
    let url = `member/_get.php?sp=${option.sp}&lp=${option.lp}&company=${localStorage.getItem('company')}&role=${localStorage.getItem('role')}`;
    console.log(url);
    return this.http.requestGet(url, this.authen.getAuthenticated())
      .toPromise() as Promise<any>
  }

  insertMember(model:any){
    let url = `member/_post.php`;
    console.log(model)
    return this.http.requestPost(url, model)
      .toPromise() as Promise<any>
  }

  updateMember(model:any){
    let url = `member/_put.php`;
    return this.http.requestPut(url,this.authen.getAuthenticated(),model)
      .toPromise() as Promise<any>
  }

  deleteMember(_id:number){
    let url = "member/_delete.php?_id=" + _id;
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