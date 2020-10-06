import { Injectable } from '@angular/core';
import { AuthenService } from './authen.service';
import { HttpService } from '../http.service';
import { Options } from 'ngx-bootstrap/positioning/models';
import { OptionSearch } from './member.service';

@Injectable({
  providedIn: 'root',
})
export class ReceiptService {
  constructor(private authen: AuthenService, private http: HttpService) { }

  insertReceipt(model: any) {
    let url = `receipt/`;
    return this.http.requestPost(url, model)
      .toPromise() as Promise<any>
  }

  deleteReceiptDetail(_id:string){
    let url = `receipt/update/${_id}`;
    return this.http.requestDelete(url,this.authen.getAuthenticated()).toPromise() as Promise<any>
  }

  insertReceiptDetail(_id: number, model: any) {
    let url = `receipt/detail/` + _id;
    return this.http.requestPost(url, model)
      .toPromise() as Promise<any>
  }

  loadReceipt(option: OptionSearch) {
    let url = `receipt?sp=${option.sp}&lp=${option.lp}`;
    if (option.company && option.role) {
      url = `receipt?sp=${option.sp}&lp=${option.lp}&role=${option.role}&company=${option.company}`;
    }
    return this.http.requestGet(url, this.authen.getAuthenticated()).toPromise() as Promise<any>;
  }

  loadDaily(model?:any){
    var url;
    if(model)
    url=`receipt/daily?company=${model.filter}&date=${model.date}&month=${model.month}&year=${model.year}`;
    else
    url="receipt/daily"
    return this.http.requestGet(url, this.authen.getAuthenticated()).toPromise() as Promise<any>;
  }

  loadDailyDetail(_id:any){
    let url=`receipt/dailyDetail/${_id}`;
    return this.http.requestGet(url, this.authen.getAuthenticated()).toPromise() as Promise<any>;
  }

  loadTrash(){
    let url='receipt/trash';
    return this.http.requestGet(url, this.authen.getAuthenticated()).toPromise() as Promise<any>
  }

  updateTotalReceipt(model:any){
    let url = `receipt/total`;
    return this.http.requestPut(url, this.authen.getAuthenticated(),model).toPromise() as Promise<any>
  }

  updateStatusReceipt(model:any){
    let url = `receipt/status`;
    return this.http.requestPut(url, this.authen.getAuthenticated(), model).toPromise() as Promise<any>
  }

  searchReceipt(option: OptionSearch) {
    if(!option.text_search){
      option.text_search="";
    }
    let url = `receipt/search?sp=${option.sp}&lp=${option.lp}&textSearch=${option.text_search}`;
    if (option.company && option.role) {
      url = `receipt/search?sp=${option.sp}&lp=${option.lp}&role=${option.role}&company=${option.company}&textSearch=${option.text_search}`;
    }

    return this.http.requestGet(url, this.authen.getAuthenticated()).toPromise() as Promise<any>
  }

  loadReceiptByID(_id: number) {
    let url = 'receipt/' + _id;
    return this.http.requestGet(url, this.authen.getAuthenticated()).toPromise() as Promise<any>
  }

  deleteReceipt(_id: number,model:any) {
    let url = `receipt/${_id}`;
    return this.http.requestPatch(url, this.authen.getAuthenticated(),model).toPromise() as Promise<any>
  }

  deleteFromTrash(_id:number){
    let url = `receipt/${_id}`;
    return this.http.requestDelete(url, this.authen.getAuthenticated()).toPromise() as Promise<any>
  }

  //   insertMember(model:any){
  //     let url = `member/`;
  //     return this.http.requestPost(url, model)
  //       .toPromise() as Promise<any>
  //   }
}
