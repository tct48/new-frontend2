import { Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { AuthenService, IUserLogin } from '../services/authen.service';
import { Router } from '@angular/router';
import { AppURL } from 'src/app/app.url';
import { AlertService } from '../shareds/alert.service';

@Component({
  selector: 'app-auth-nav-bar',
  templateUrl: './auth-nav-bar.component.html',
  styleUrls: ['./auth-nav-bar.component.css']
})
export class AuthNavBarComponent implements OnInit {

  constructor(
    private account: AccountService,
    private authen: AuthenService,
    private router: Router,
    private alert: AlertService
  ) { 
    this.UserLogin = this.authen.setUserLogin();

  }

  UserLogin:any;

  ngOnInit(): void {
  }

      // ออกจากระบบ
  onLogout() {
    this.authen.clearAuthenticated()
    this.account.UserLogin = {} as any;
    this.alert.success("ขอบคุณที่ใช้บริการ !")

    localStorage.clear();
    this.router.navigate(['/', AppURL.Login])
  }

}
