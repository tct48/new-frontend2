import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { AlertService } from 'src/app/share/shareds/alert.service';
import { MemberService, OptionSearch } from 'src/app/share/services/member.service';
import { LOCALE_ID } from '@angular/core';

import 'sweetalert2/src/sweetalert2.scss'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import { AuthenService } from 'src/app/share/services/authen.service';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css'],
  providers: [
    MemberService,
    { provide: LOCALE_ID, useValue: "en-US" },
  ]
})
export class MemberComponent implements OnInit {
  constructor(
    private alert:AlertService,
    private member:MemberService,
    private authen:AuthenService
  ) {
    this.onLoadMember()
    this.UserLogin = this.authen.setUserLogin();
  }

  ngOnInit(): void {}

  role:string;
  company:string;
  select_role: Role;
  x:any = new Date;
  UserLogin:any;

  items:any;
  total_items:number;
  lp:number=10;

  IMember:any={
    _id:0,
    username:null,
    password:null,
    name:null,
    role:null,
    company:null,
    status:1
  }

  option:OptionSearch={
    sp:0,
    lp:this.lp,
    text_search:null
  };

  onSubmit(){
    let obj = this.IMember;
    if(this.IMember.role=="ผู้ดูแลสาขา"){
      obj.role = 2;
    }else if(this.IMember.role=="พนักงาน"){
      obj.role = 3;
    }else if(this.IMember.role=="ผู้ดูแลระบบ"){
      obj.role = 1;
    }

    if(this.IMember.company=="ดีจัง"){
      obj.company = 1;
    }else if(this.IMember.company=="ดีจ้า"){
      obj.company = 2;
    }else if(this.IMember.company=="ดีจ้าออโต้"){
      obj.company = 3;
    }else if(this.IMember.company=="ดีจังหนองจอก"){
      obj.company = 4;
    }
    if(!obj.username || !obj.password || !obj.name || !obj.role || !obj.company){
      return this.alert.notify("กรุณากรอกข้อมูลให้ครบถ้วน!")
    }

    this.member.insertMember(obj).then(result=>{
      this.onLoadMember();
      this.alert.success("เพิ่มพนักงานสำเร็จ");
      this.clearIMember();
    }).catch(err=>{
      this.alert.notify(err)
    })
  }

  onUpdate(){
    let obj = this.IMember;
    if(this.IMember.role=="ผู้ดูแลสาขา"){
      obj.role = 2;
    }else if(this.IMember.role=="พนักงาน"){
      obj.role = 3;
    }else if(this.IMember.role=="ผู้ดูแลระบบ"){
      obj.role = 1;
    }

    if(this.IMember.company=="ดีจัง"){
      obj.company = 1;
    }else if(this.IMember.company=="ดีจ้า"){
      obj.company = 2;
    }else if(this.IMember.company=="ดีจ้าออโต้"){
      obj.company = 3;
    }else if(this.IMember.company=="ดีจังหนองจอก"){
      obj.company = 4;
    }

    if(!obj.username || !obj.password || !obj.name || !obj.role || !obj.company){
      return this.alert.notify("กรุณากรอกข้อมูลให้ครบถ้วน!")
    }

    obj.status=1;

    this.member.updateMember(obj).then(result=>{
      this.onLoadMember();
      this.alert.success("แก้ไขข้อมูลพนักงานสำเร็จ");
      this.clearIMember();
    }).catch(err=>{
      this.alert.notify(err)
    })
  }

  onLoadUpdate(items:any){
    this.setIMember(items);
  }

  pageChanged(event: any):void{
    // this.items=null;
    this.option.sp = event.page-1;
    this.onLoadMember();
  }

  onLoadMember(){
    console.log(this.option);
    this.member.loadMember(this.option).then(result=>{
      this.total_items = result.total_items;
      this.items = result.items;
    })
  }

  onDeleteMember(_id?:any){
    Swal.fire({
      title: 'คุณแน่ใจหรือไม่ที่จะลบข้อมูล ?',
      text: "เมื่อลบข้อมูลแล้วข้อมูลจะสูญหายทันที!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, ฉันต้องการลบข้อมูล!',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.value) {
        this.member.deleteMember(_id).then(result=>{
          Swal.fire(
            'ลบข้อมูล!',
            'ข้อมูลถูกลบเรียบร้อยแล้ว',
            'success'
          );
          this.onLoadMember();
        })
        .catch(()=>{
          this.alert.notify();
        })

      }
    })
  }

  setIMember(data:any){
    if(data.role==2){
      this.IMember.role = "ผู้ดูแลสาขา";
    }else if(data.role==3){
      this.IMember.role = "พนักงาน";
    }else if(data.role==1){
      this.IMember.role = "ผู้ดูแลระบบ";
    }

    this.IMember._id=data._id
    this.IMember.username=data.username;
    this.IMember.name=data.name;
    this.IMember.company = data.company;
  }

  clearIMember(){
    this.IMember._id=null;
    this.IMember.username=null;
    this.IMember.password=null;
    this.IMember.name=null;
    this.IMember.role=null;
    this.IMember.company=null;
  }
}


interface Role {
  name: string;
  _id: number;
}
