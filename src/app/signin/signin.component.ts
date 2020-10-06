import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../share/shareds/alert.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppURL } from '../app.url';
import { AuthURL } from '../authentication/authentication.url';
import { AccountService } from '../share/services/account.service';
import { MemberService } from '../share/services/member.service';
import { AuthenService } from '../share/services/authen.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  providers: [MemberService]
})
export class SigninComponent implements OnInit {

  constructor(
    private builder : FormBuilder,
    private router : Router,
    private alert: AlertService,
    private account:AccountService,
    private authen:AuthenService
  ) {
    this.createFormData();
  }

  ngOnInit(): void {
  }

  form:FormGroup;
  AppURL=AppURL;
  AuthURL=AuthURL;

  returnURL:string = '/authentication/bill';

  createFormData(){
    this.form = this.builder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  onSubmit(){
    if(this.form.invalid){
      return this.alert.success("กรุณากรอกข้อมูลให้ครบถ้วน!")
    }

    this.account.onLogin(this.form.value).then(result=>{
      // เก็บ AccessToken
      this.authen.setAuthenticated(result.accessToken,result.user)
      this.alert.success('ยินดีต้อนรับเข้าสู่ระบบ')
      this.router.navigateByUrl(this.returnURL)
    }).catch(err=>{
      this.alert.notify("Username หรือ Password ไม่ถูกต้อง!")
    })
  }

}
