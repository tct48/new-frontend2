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
    let url = `receipt/_post.php`;
    console.log(model);
    return this.http.requestPost(url, model)
      .toPromise() as Promise<any>
  }

  deleteReceiptDetail(_id:string){
    let url = `receipt/_delete.php?detail=del`;
    return this.http.requestPost(url,{_id: _id}).toPromise() as Promise<any>
  }

  insertReceiptDetail(_id: number, model: any) {
    let url = `receipt/_post_detail.php?_id=` + _id;
    console.log(model);
    console.log(url);
    return this.http.requestPost(url, model)
      .toPromise() as Promise<any>
  }

  loadReceipt(option: OptionSearch) {
    let url = `receipt/_search.php?sp=${option.sp}&lp=${option.lp}`;
    if (option.company && option.role) {
      url = `receipt/_search.php?sp=${option.sp}&lp=${option.lp}&role=${option.role}&company=${option.company}`;
    }
    return this.http.requestGet(url, this.authen.getAuthenticated()).toPromise() as Promise<any>;
  }

  loadDaily(model?:any){
    var url;
    if(model)
    url=`receipt/_get_daily.php?company=${model.filter}&date=${model.date}&month=${model.month}&year=${model.year}`;
    else
    url="receipt/_get_daily"
    return this.http.requestGet(url, this.authen.getAuthenticated()).toPromise() as Promise<any>;
  }

  loadDailyDetail(_id:any){
    let url=`receipt/dailyDetail/${_id}`;
    return this.http.requestGet(url, this.authen.getAuthenticated()).toPromise() as Promise<any>;
  }

  loadTrash(){
    let url='receipt/_trash.php';
    return this.http.requestGet(url, this.authen.getAuthenticated()).toPromise() as Promise<any>
  }

  updateTotalReceipt(model:any){
    let url = `receipt/_put.php?CASE=update`;
    return this.http.requestPut(url, this.authen.getAuthenticated(),model).toPromise() as Promise<any>
  }

  updateStatusReceipt(model:any){
    let url = `receipt/_put.php?CASE=status`;
    return this.http.requestPut(url, this.authen.getAuthenticated(), model).toPromise() as Promise<any>
  }

  searchReceipt(option: OptionSearch) {
    if(!option.text_search){
      option.text_search="";
    }
    let url = `receipt/_search.php?sp=${option.sp}&lp=${option.lp}&textSearch=${option.text_search}`;
    if (option.company && option.role) {
      url = `receipt/_search.php?sp=${option.sp}&lp=${option.lp}&role=${option.role}&company=${option.company}&textSearch=${option.text_search}`;
    }
    console.log(url);
    return this.http.requestGet(url, this.authen.getAuthenticated()).toPromise() as Promise<any>
  }

  loadReceiptByID(_id: number) {
    let url = 'receipt/_get.php?_id=' + _id;
    return this.http.requestGet(url, this.authen.getAuthenticated()).toPromise() as Promise<any>
  }

  deleteReceipt(_id: number,model:any) {
    var url = `receipt/_delete.php?view=0&user=${model.user}&_id=${_id}`;
    var obj = {
      _id:_id
    }
    console.log(url);
    return this.http.requestDelete(url, this.authen.getAuthenticated()).toPromise() as Promise<any>
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
