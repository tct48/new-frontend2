import { Component, OnInit } from '@angular/core';
import { ReceiptService } from 'src/app/share/services/receipt.service';
import { ThaidatePipe } from 'src/app/pipe/thaidate.pipe';
import { AuthenService } from 'src/app/share/services/authen.service';
import { AlertService } from 'src/app/share/shareds/alert.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.css']
})
export class TrashComponent implements OnInit {

  constructor(
    private receipt:ReceiptService,
    private authen: AuthenService,
    private alert: AlertService,
    public thaidate: ThaidatePipe,

  ) { 
    this.UserLogin = this.authen.setUserLogin();
    this.loadItems();
  }

  UserLogin:any;
  items:any;
  total_items:number;

  ngOnInit(): void {
  }

  loadItems(){
    this.receipt.loadTrash().then(result=>{
      this.total_items = result.total_items;
      this.items = result.items;
    })
  }

  recoveryReceipt(_id:any){
    let model = {user:this.UserLogin._id,view:1};
    this.receipt.deleteReceipt(_id, model).then(()=>{
      this.alert.success("กู้คืนข้อมูลสำเร็จ!")
      this.loadItems();
    })
  }

  deleteFromTrash(_id:any){
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
          user:localStorage.getItem("_id"),
          view:0
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
