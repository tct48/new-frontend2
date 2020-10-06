import { Injectable } from '@angular/core';

import 'sweetalert2/src/sweetalert2.scss'
import Swal from 'sweetalert2/dist/sweetalert2.js'

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  confirm_delete(results:string='ข้อมูลถูกลบเรียบร้อยแล้ว.'){
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
        Swal.fire(
          'ลบข้อมูล!',
          results,
          'success'
        )
      }
    })
  }

  success(title:string='บันทึกข้อมูลเรียบร้อยแล้ว'){
    Swal.fire({
      icon: 'success',
      title: title,
      showConfirmButton: false,
      timer: 1500
    })
  }

  notify(title:string='เกิดข้อผิดพลาด'){
    Swal.fire({
      icon: 'error',
      title: title,
      showConfirmButton:true,
    })
  }

}
