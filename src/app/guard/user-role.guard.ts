import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenService } from '../share/services/authen.service';
import { AccountService } from '../share/services/account.service';
import { AlertService } from '../share/shareds/alert.service';
import { AppURL } from '../app.url';
import { AuthURL } from '../authentication/authentication.url';

@Injectable({
  providedIn: 'root'
})
export class UserRoleGuard implements CanActivate {
  constructor(
    private authen: AuthenService,
    private account: AccountService,
    private alert: AlertService,
    private router:Router
  ) {

  }


  AppURL = AppURL;
  AuthURL =AuthURL;

  canActivate(
    // next: ActivatedRouteSnapshot,
    // state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // return true;

    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise<boolean>((resolve, reject) => {
      const roles = next.data.roles;
      let data = this.authen.setUserLogin()
      if((roles.filter(item=>item==data.role)).length>0)
        resolve(true);
      else{
        this.alert.notify("คุณไม่มีสิทธิ์ในการเข้าใช้งานหน้าดังกล่าว!");
        this.router.navigate(['/', AppURL.Authen, AuthURL.Bill]);
        resolve(false);
      }
    });
  }

}
