import { Observable } from 'rxjs'
import { Injectable } from '@angular/core'
import { catchError } from 'rxjs/operators'

import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
} from '@angular/common/http'

@Injectable({
    providedIn: 'root',
})
export class HttpService {
    constructor(private http: HttpClient) {}

    // private address: string = 'https://deejung.herokuapp.com/'
    private address : string = "http://www.dee-jung.com/api/"
    // private address:string = "http://localhost/NewBackend/api/"
 
    //Request GET method
    requestGet(url: string, accessToken?: string) {
        return this.http
            .get(`${this.address}${url}`, {
                headers: this.appendHeaders(accessToken),
            })
            .pipe(catchError((err) => this.handelError(err)))
    }

    // ส่งข้อมูลแบบ Post method
    requestPost(url: string, body: any) {
        return this.http
            .post(`${this.address}${url}`, body)
            .pipe(catchError((err) => this.handelError(err)))
    }

    //Request Patch method
    requestPatch(url: string, accessToken?: string, model?: any) {
        return this.http
            .patch(`${this.address}${url}`, model, {
                headers: this.appendHeaders(accessToken),
            })
            .pipe(catchError((err) => this.handelError(err)))
    }

    requestPut(url: string, accessToken?: string, model?: any) {
        return this.http
            .put(`${this.address}${url}`, model, {
                headers: this.appendHeaders(accessToken),
            })
            .pipe(catchError((err) => this.handelError(err)))
    }

    //Request Delete method
    requestDelete(url: string, accessToken?: string) {
        console.log(url);
        return this.http
            .delete(`${this.address}${url}`, {
                headers: this.appendHeaders(accessToken),
            })
            .pipe(catchError((err) => this.handelError(err)))
    }

    // ปรับแต่ง Error ใหม่
    private handelError(errResponse: HttpErrorResponse): Observable<any> {
        errResponse['Message'] = errResponse.message
        if (errResponse.error && errResponse.error.message)
            errResponse['Message'] = errResponse.error.message
        throw errResponse
    }

    // เพิ่ม header
    appendHeaders(accessToken) {
        const headers = {}
        if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`
        return new HttpHeaders(headers)
    }
}
