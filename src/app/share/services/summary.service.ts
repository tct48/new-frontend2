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
        return this.http.requestGet('summary/'+company,this.authen.getAuthenticated())
            .toPromise() as Promise<any>
    }

    getLast7Month(company:number){
        return this.http.requestGet('summary/month/' + company, this.authen.getAuthenticated())
            .toPromise() as Promise<any>
    }

    getVat(model:any){
      return this.http.requestGet(`summary/vat?company=${model.filter}&date=${model.date}&month=${model.month}&year=${model.year}`,this.authen.getAuthenticated())
        .toPromise() as Promise<any>
    }

    getVat5Days(company:any){
      return this.http.requestGet(`summary/vat5days?company=${company}`,this.authen.getAuthenticated())
        .toPromise() as Promise<any>
    }
}
