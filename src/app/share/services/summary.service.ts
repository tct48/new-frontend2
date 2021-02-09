import { Injectable } from '@angular/core'
import { HttpService } from '../http.service'
import { IAccount } from './account.service'
import { AuthenService } from './authen.service'

@Injectable({
    providedIn: 'root',
})
export class SummaryService {
    constructor(
        private http: HttpService,
        private authen: AuthenService
    ) {}

    getLast15Day(company:number){
        return this.http.requestGet('summary/_get.php?case=company&company='+company,this.authen.getAuthenticated())
            .toPromise() as Promise<any>
    }

    getLast7Month(company:number){
        return this.http.requestGet('summary/_get.php?case=month/company&company='+company, this.authen.getAuthenticated())
            .toPromise() as Promise<any>
    }

    getVat(model:any){
        let url = `receipt/_get_daily.php?date=${model.date}&month=${model.month}&year=${model.year}&company=${model.company}`;
        console.log(url);
      return this.http.requestGet(url,this.authen.getAuthenticated())
        .toPromise() as Promise<any>
    }

    getVat5Days(company:any){
        console.log("D");
      return this.http.requestGet(`summary/vat5days?case=vat5days&company=${company}`,this.authen.getAuthenticated())
        .toPromise() as Promise<any>
    }
}
