import { Component, OnInit } from '@angular/core';
import { ReceiptService } from 'src/app/share/services/receipt.service';
import { ThaidatePipe } from 'src/app/pipe/thaidate.pipe';
import { AuthenService } from 'src/app/share/services/authen.service';
import { AlertService } from 'src/app/share/shareds/alert.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { IReport } from '../report/report.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.css'],
  providers: [DatePipe, ThaidatePipe]
})
export class TrashComponent implements OnInit {

  constructor(
    private receipt: ReceiptService,
    private authen: AuthenService,
    private alert: AlertService,
    public thaidate: ThaidatePipe,
    public datePipe: DatePipe,

  ) {
    this.UserLogin = this.authen.setUserLogin();
    this.loadItems();
  }

  report: IReport = {
    total: 0,
    detuct_cash: 0,
    detuct_bank: 0,
    balance: 0,
    cash: 0,
    bank: 0,
    // ตรวจสภาพ
    check: 0,
  };
  company = localStorage.getItem("company");
  member = 0;
  model = {
    date: this.datePipe.transform(new Date(), "d"),
    month: this.datePipe.transform(new Date(), "M"),
    year: this.datePipe.transform(new Date(), "yyyy"),
    member: this.member,
    company: this.company,
  }
  UserLogin: any;
  items: any;
  total_items: number;

  ngOnInit(): void {
  }

  loadItems() {
    this.receipt.loadTrash().then(result => {
      this.total_items = result.total_items;
      this.items = result.items;
    })
  }

  recoveryReceipt(_id: any) {
    let model = { user: this.UserLogin._id, view: 1 };
    this.receipt.deleteReceipt(_id, model).then(() => {
      this.alert.success("กู้คืนข้อมูลสำเร็จ!")
      this.loadItems();
    })
  }

  onSubmit() {
    this.receipt.loadTrashSpecific(this.model).then(result =>{
      this.total_items = result.total_items;
      this.items = result.items;
      console.log(result);
    })
  }


  deleteFromTrash(_id: any) {
    Swal.fire({
      title: 'คุณแน่ใจหรือไม่ที่จะลบข้อมูล ?',
      text: 'เมื่อลบข้อมูลแล้วข้อมูลจะสูญหายทันที!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, ฉันต้องการลบข้อมูล!',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.value) {
        let model = {
          user: localStorage.getItem("_id"),
          view: 0
        }
        this.receipt
          .deleteFromTrash(_id)
          .then((result) => {
            Swal.fire('ลบข้อมูล!', 'ข้อมูลถูกลบเรียบร้อยแล้ว', 'success');
            this.loadItems();
          })
          .catch(() => {
            this.alert.notify();
          });
      }
    });
  }
}
