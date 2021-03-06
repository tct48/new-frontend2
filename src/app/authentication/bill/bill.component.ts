import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/share/shareds/alert.service';
import { delay, min, windowWhen } from 'rxjs/operators';

import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ReceiptService } from 'src/app/share/services/receipt.service';
import { OptionSearch } from 'src/app/share/services/member.service';
import { AuthenService } from 'src/app/share/services/authen.service';

import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import { Header } from 'primeng/api';
import { DatePipe, formatCurrency, CurrencyPipe } from '@angular/common';
import { ThaidatePipe } from 'src/app/pipe/thaidate.pipe';
pdfMake.vfs = pdfFonts.pdfMake.vfs

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.css'],
  providers: [DatePipe, CurrencyPipe, ThaidatePipe]
})
export class BillComponent implements OnInit {
  constructor(
    private alert: AlertService,
    private receipt_service: ReceiptService,
    private authen: AuthenService,
    public datepipe: DatePipe,
    public currency: CurrencyPipe,
    public thaidate: ThaidatePipe
  ) {
    this.onLoadReceipt();
    this.UserLogin = this.authen.setUserLogin();
  }

  UserLogin: any;
  filter: number;
  receipt: any = {
    _id: 0, // A
    receipt_no: null, // A,
    address: null,
    customer: null,
    dor: new Date(), // A
    title: null,
    type: null,
    company: localStorage.getItem('company'),
    cc: null,
    year: null,
    weight: null,
    member: localStorage.getItem('_id'),
    total: 0,
  };

  detail: any = [];
  lp: number = 10;
  items: any;
  total_items: number;
  view: boolean = false;

  option: OptionSearch = {
    sp: 0,
    lp: this.lp,
    company: Number(localStorage.getItem('company')),
    role: Number(localStorage.getItem('role')),
  };

  ngOnInit(): void { }

  onPushDetail(data: string) {
    if (!this.receipt.customer) {
      return this.alert.notify("กรุณากรอกข้อมูลหัวใบเสร็จก่อน !")
    }

    let price: number = null;
    let a: number = null, b: number = null, c: number = null;;
    // ตรวจสภาพรถกระบะ กับตู้ 200 มอไซ 60
    if (data == "ตรวจสภาพรถ") {
      if (this.receipt.type != "มอเตอร์ไซค์")
        price = 200;
      else if (this.receipt.type == "มอเตอร์ไซค์")
        price = 60
    } else if (data == "พรบ") { //ถ้าพรบกะบะ 960 ตู้ 1180 เก๋ง 500
      if (this.receipt.type == "กระบะบรรทุก")
        price = 960;
      else if (this.receipt.type == "ตู้บรรทุก")
        price = 1180;
      else if (this.receipt.type == "รถยนต์ 4 ประตู")
        price = 645;
      else
        price = 330;
    } else if (data == "CNG" || data == "LPG" || data == "NGV") {
      price = 500;
      if (this.receipt.company == 1) {
        price = 600;
      }
    }
    else if (data == "ฝากต่อ")
      price = 50;

    if (data == "ค่าปรับ") {
      let check: boolean = false;
      for (var i = 0; i < this.detail.length; i++) {
        if (this.detail[i].name == 'ภาษี') {
          check = true;
        }
      }
      if (check == false)
        return this.alert.notify("กรุณาเพิ่มค่าภาษีก่อน !")
    }



    if (data == "ภาษี") {
      if (this.receipt.type == "รถยนต์ 4 ประตู") {
        if (this.receipt.cc >= 600) {
          a = 300;
        } else {
          price = Number(this.receipt.cc) * 0.5;
          a = price;
        }

        if (this.receipt.cc >= 1800) {
          b = 1800
        } else {
          price = (Number(this.receipt.cc) - 600) * 1.5;
          b = price;
        }


        if (this.receipt.cc >= 1801) {
          price = (Number(this.receipt.cc) - 1800) * 4;
          c = price;
        }

        price = Math.round(a + b + c);

        if (this.receipt.year == 6) {
          price *= 0.9;
        } else if (this.receipt.year == 7) {
          price *= 0.8;
        } else if (this.receipt.year == 8) {
          price *= 0.7;
        } else if (this.receipt.year == 9) {
          price *= 0.6;
        } else if (this.receipt.year >= 10) {
          price *= 0.5;
        }
      }

      if (this.receipt.type == "กระบะบรรทุก" || this.receipt.type == "ตู้บรรทุก") {
        if (this.receipt.weight > 500 && this.receipt.weight <= 750) {
          price = 450;
        } else if (this.receipt.weight > 750 && this.receipt.weight <= 1000) {
          price = 600;
        } else if (this.receipt.weight > 1001 && this.receipt.weight <= 1250)
          price = 750;
        else if (this.receipt.weight > 1250 && this.receipt.weight <= 1500)
          price = 900;
        else if (this.receipt.weight > 1500 && this.receipt.weight <= 1750)
          price = 1050;
        else if (this.receipt.weight > 1750 && this.receipt.weight <= 2000)
          price = 1350;
        else if (this.receipt.weight > 2000 && this.receipt.weight <= 2500)
          price = 1650;
      } else if (this.receipt.type == "รถตู้ส่วนบุคคล") {
        if (this.receipt.weight <= 500) {
          price = 150;
        } else if (this.receipt.weight > 500 && this.receipt.weight <= 750) {
          price = 300;
        } else if (this.receipt.weight > 750 && this.receipt.weight <= 1000) {
          price = 450;
        } else if (this.receipt.weight > 1001 && this.receipt.weight <= 1250)
          price = 800;
        else if (this.receipt.weight > 1250 && this.receipt.weight <= 1500)
          price = 1000;
        else if (this.receipt.weight > 1500 && this.receipt.weight <= 1750)
          price = 1300;
        else if (this.receipt.weight > 1750 && this.receipt.weight <= 2000)
          price = 1600;
        else if (this.receipt.weight > 2000 && this.receipt.weight <= 2500)
          price = 1900;
        else if (this.receipt.weight > 2500 && this.receipt.weight <= 3000)
          price = 2200;
      }

      if (this.receipt.type == "มอเตอร์ไซค์") {
        price = 100;
      }
    }

    if (data == 'กำหนดเอง') {
      Swal.mixin({
        input: 'text',
        confirmButtonText: 'ถัดไป',
        showCancelButton: true,
        progressSteps: ['1', '2'],
      })
        .queue([
          {
            title: 'ชื่อรายการ',
            // text: 'Chaining swal2 modals is easy'
          },
          {
            title: 'ราคา',
            input: 'number'
          },
        ])
        .then((result) => {
          if (result.value) {
            const answers = result.value;

            this.detail.push({
              name: answers[0],
              price: Number(answers[1]),
            });
            this.receipt.total += Number(answers[1]);
          }
        });
      return;
    }
    Swal.fire({
      title: data,
      input: 'number',
      inputValue: price,
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonText: 'Push',
    }).then((result) => {
      if (result.value) {
        let obj = {
          name: data,
          price: Number(result.value),
        };
        this.detail.push(obj);
        let x = Number(this.receipt.total) + Number(obj.price);
        this.receipt.total = x;
      }
    });
  }

  onPopDetail() {
    if (this.detail.length > 0) {
      this.receipt.total -= this.detail[this.detail.length - 1].price;
      this.detail.pop();
    }
  }

  pageChanged(event: any): void {
    // this.items=null;
    this.option.sp = event.page - 1;
    if (this.option.text_search == "") {
      this.onSearch();
      return;
    } else {
      this.onLoadReceipt();
    }
  }

  onDelete(_id?: number) {
    Swal.fire({
      title: 'คุณแน่ใจหรือไม่ที่จะลบข้อมูล ?',
      text: 'เมื่อลบข้อมูลแล้วข้อมูลจะสูญหายทันที!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, ฉันต้องการลบข้อมูล!',
      cancelButtonText: 'ยกเลิก',
    }).then(result => {
      if (result.value) {
        let model = {
          user: localStorage.getItem("_id"),
          view: 0
        }
        this.receipt_service
          .deleteReceipt(_id, model)
          .then(result => {
            Swal.fire('ลบข้อมูล!', 'ข้อมูลถูกลบเรียบร้อยแล้ว', 'success');
            this.option.sp = 0;
            this.onLoadReceipt();
          })
          .catch(error => {
            this.alert.notify();
            console.log(error);
          });
      }
    });
  }

  onLoadReceipt() {
    this.receipt_service.loadReceipt(this.option).then((result) => {
      this.total_items = result.total_items;
      this.items = result.items;
    });
  }

  onView(_id: number) {
    if (_id == this.receipt._id) {
      document.querySelector('#billing').scrollIntoView({
        behavior: 'smooth'
      });
      return;
    }

    this.receipt_service.loadReceiptByID(_id).then(result => {
      this.view = true;

      this.receipt._id = result.receipt[0]._id;
      this.receipt.receipt_no = result.receipt[0].receipt_no; // A
      this.receipt.customer = result.receipt[0].customer;
      this.receipt.dor = result.receipt[0].dor;
      this.receipt.title = result.receipt[0].title;
      this.receipt.type = result.receipt[0].type;
      this.receipt.company = result.receipt[0].company;
      this.receipt.cc = result.receipt[0].cc;
      this.receipt.weight = result.receipt[0].weight;
      this.receipt.year = result.receipt[0].year;
      this.receipt.member = result.receipt[0].member;
      this.receipt.total = result.receipt[0].total;
      this.receipt.address = result.receipt[0].address;

      this.detail = result.detail;
      this.receipt.type = this.returnCategory(this.receipt.type);

      document.querySelector('#billing').scrollIntoView({
        behavior: 'smooth'
      });
    }).catch(err => {
      this.alert.notify("เกิดข้อผิดพลาดไม่สามารถเปิดดูข้อมูลได้!")
    })
  }

  onPrint(_id: number) {
    console.log(_id);
    this.receipt_service.loadReceiptByID(_id).then(result => {
      let receipt = result.receipt[0];
      console.log(result)
      let detail = result.detail;

      receipt.type = this.returnCategory(receipt.type);
      this.generatePdf(receipt, detail)
    })
  }


  onSubmit() {
    if (this.receipt.type == null || this.detail.length == 0 || this.receipt.name) {
      return this.alert.notify("กรุณากรอกข้อมูลให้ครบถ้วน")
    }

    if (this.receipt.type == 'กระบะบรรทุก') {
      this.receipt.type = 1;
    } else if (this.receipt.type == 'ตู้บรรทุก') {
      this.receipt.type = 2;
    } else if (this.receipt.type == 'มอเตอร์ไซค์') {
      this.receipt.type = 3;
    } else if (this.receipt.type == "รถยนต์ 4 ประตู") {
      this.receipt.type = 4;
    } else if (this.receipt.type == "รถตู้ส่วนบุคคล") {
      this.receipt.type = 5;
    }
    this.receipt.company = localStorage.getItem("company");

    this.receipt_service.insertReceipt(this.receipt).then((result) => {
      console.log(result);
      this.receipt_service
        .insertReceiptDetail(result._id, this.detail)
        .then((result) => {
          this.onLoadReceipt();
          this.clearModel();
          this.alert.success('เพิ่มใบเสร็จสำเร็จ!');
        });
    });
  }

  onUpdate() {
    if (!this.detail || !this.receipt) {
      return this.alert.notify("เกิดข้อผิดพลาดไม่สามารถแก้ไขได้")
    }
    this.receipt_service.deleteReceiptDetail(this.receipt._id)
      .then(result => {
        this.receipt_service.updateTotalReceipt({ _id: this.receipt._id, total: this.receipt.total })
          .then(sub_result => {
            this.receipt_service.insertReceiptDetail(this.receipt._id, this.detail)
              .then(result => {
                this.onLoadReceipt();
                this.clearModel();
                this.view = false;
                this.alert.success("แก้ไขข้อมูลสำเร็จ!");
              })
          })
      })
  }

  onCancel() {
    this.clearModel();
    this.view = false;
  }

  returnCompany(_id: number) {
    if (_id == 1) {
      return "ดีจัง";
    } else if (_id == 2) {
      return "ดีจ้า";
    } else if (_id == 3) {
      return "ดีจ้าออโต้"
    } else if (_id == 4) {
      return "ดีจังหนองจอก"
    }
  }

  returnCategory(_id: number) {
    if (_id == 1) {
      return "กระบะบรรทุก";
    } else if (_id == 2) {
      return "ตู้บรรทุก";
    } else if (_id == 3) {
      return "มอเตอร์ไซค์"
    } else if (_id == 4) {
      return "รถยนต์ 4 ประตู"
    } else if (_id == 5) {
      return "รถตู้ส่วนบุคคล"
    }
  }

  search:boolean = false

  onSearch() {
    if (!this.filter) {
      this.alert.notify("กรุณาระบุบริษัท")
      return;
    }
    this.search=true;
    if (this.UserLogin.role == 1)
      this.option.company = Number(this.filter);
    this.receipt_service.searchReceipt(this.option).then(result => {
      this.total_items = result.total_items;
      this.items = result.items;
    })
  }

  header_company: any = {
    name: null,
    address: null,
    telphone: null,
  };

  returnAddressCompany(_id: number) {
    if (_id == 1) {
      this.header_company.name = "ดีจัง"
      this.header_company.address = "12/2 หมู่ที่ 5 ต.คลองสาม อ.คลองหลวง จ.ปทุมธานี 12120"
      this.header_company.telephone = "โทร. 096-494-4691, 099-391-9226"
    } else if (_id == 2) {
      this.header_company.name = "ดีจ้า"
      this.header_company.address = "12/2 หมู่ที่ 5 ต.คลองสี่ อ.คลองหลวง จ.ปทุมธานี 12120"
      this.header_company.telephone = "โทร. 062-939-4666, 099-391-9226"
    } else if (_id == 3) {
      this.header_company.name = "ดีจ้าออโต้"
      this.header_company.address = "1626/28 se 3 ct Deerfeld Beach, Fl, 33441"
      this.header_company.telephone = "091-115-7859"
    } else if (_id == 4) {
      this.header_company.name = "ดีจังหนองจอก"
      this.header_company.address = "1626/28 se 3 ct Deerfeld Beach, Fl, 33441"
      this.header_company.telephone = "091-115-7859"
    }
  }
  // ทำ export document to pdf
  generatePdf(model?: any, detail?: any) {
    this.returnAddressCompany(this.receipt.company);
    if (model && detail) {
      var documentDefinition = this.getDocumentDefinition(model, detail)
    } else {
      var documentDefinition = this.getDocumentDefinition()
    }

    pdfMake.fonts = {
      THSarabunNew: {
        normal: 'THSarabunNew.ttf',
        bold: 'THSarabunNew Bold.ttf',
        italics: 'THSarabunNew Italic.ttf',
        bolditalics: 'THSarabunNew BoldItalic.ttf',
      },
      Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-MediumItalic.ttf',
      },
    }
    pdfMake.createPdf(documentDefinition).open()
  }

  //  get document
  getDocumentDefinition(models?: any, details?: any) {
    sessionStorage.setItem('resume', JSON.stringify('test1'))
    // [{text:'รายการ :', bold:true}, {text:'จำนวนเงิน', bold:true,alignment:'right'}],
    var dumb: any = [[{ text: 'รายการ :', bold: true }, { text: 'จำนวนเงิน', bold: true, alignment: 'right' }]];
    let detail;
    if (details) {
      detail = details;
    } else {
      detail = this.detail
    }


    let model = {
      _id: null,
      dor: null,
      customer: null,
      title: null,
      type: null,
      address: null,
      total: null
    }
    if (!models) {
      model._id = this.receipt._id
      model.dor = this.receipt.dor
      model.customer = this.receipt.customer
      model.title = this.receipt.title
      model.type = this.receipt.type
      model.address = this.receipt.address
      model.total = this.receipt.total
    } else {
      model._id = models._id
      model.dor = models.dor
      model.customer = models.customer
      model.title = models.title
      model.type = models.type
      model.address = models.address
      model.total = models.total
    }


    for (var i = 0; i < detail.length; i++) {
      // [{text:'2. ค่าไฟ'}, {text:'฿ 5,000.00', alignment:'right'}],
      dumb.push([{ text: i + 1 + ". " + detail[i].name }, { text: this.currency.transform(detail[i].price, '฿ '), alignment: 'right' }]);
    }
    dumb.push([{ text: "รวมทั้งสิ้น", alignment: 'right', bold: true }, { text: this.currency.transform(model.total, '฿ '), alignment: 'right', bold: true }])

    let point = 14;
    if (this.detail.length > 6) {
      point = 12;
    }


    return {
      header: {
        margin: [40, 37, 40, 40],
        columns: [
          {
            image: "data:image/jpeg;base64,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",
            fit: [65, 65]
          },
        ]
      },
      content: [
        // image logo
        {
          text: "สถานตรวจสภาพรถ " + this.header_company.name,
          bold: true,
          fontSize: 24,
          margin: [80, 0, 0, 0],
        },
        {
          text: this.header_company.address,
          margin: [80, 0, 0, 0]
        },
        {
          text: this.header_company.telephone,
          margin: [80, 0, 0, 0],
          color: "blue"
        },
        // หัวใบเสร็จ
        {
          text: [{ text: "เลขที่ใบเสร็จ : ", bold: true, color: 'blue' }, { text: model._id }],
          alignment: 'right',
          fontSize: 14,
        },
        // this.datepipe.transform(this.items[i].dor, 'MMMM')
        {
          text: [{ text: "วันที่ : ", bold: true, color: 'blue' }, { text: this.thaidate.transform(model.dor, "") }],
          alignment: 'right',
          fontSize: 14,
        },
        {
          layout: 'noBorders',
          table: {
            headerRows: 1,
            widths: ['auto', '*'],
            body: [
              [{ text: 'ชื่อลูกค้า/เบอร์โทร :', bold: true, color: 'blue' }, { text: model.customer }],
              [{ text: 'เลขทะเบียน :', bold: true, color: 'blue' }, [{ text: model.title + " (" + model.type + ")" }]],
              [{ text: 'ที่อยู่ :', bold: true, color: 'blue' }, { text: model.address }]
            ]
          },
          fontSize: point,
        },
        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: ['70%', '*'],
            body: dumb
          },
          fontSize: point,
          margin: [0, 5, 0, 0]
        },
        {
          text: { text: "___________________________" },
          alignment: 'center',
          fontSize: point,
          margin: [0, 10, 0, 0],
          bold: true
        },
        {
          text: { text: "ผู้รับเงิน" },
          alignment: 'center',
          fontSize: point,
          bold: true
        }
      ],
      pageSize: 'A4',
      // pageOrientation: 'portrait',
      info: {
        title: 'ใบเสร็จรับเงิน (' + "71-1112 นฐ" + ")",
        author: 'Phd.Ratchapol',
        subject: 'RESUME',
        keywords: 'RESUME, ONLINE RESUME',
      },
      defaultStyle: {
        font: 'THSarabunNew',
      },
      styles: {
        header: {
          fontSize: 20,
          bold: true,
          margin: [0, 20, 0, 10],
          decoration: 'underline',
        },
        name: {
          fontSize: 16,
          bold: true,
        },
        jobTitle: {
          fontSize: 14,
          bold: true,
          italics: true,
        },
        sign: {
          margin: [0, 50, 0, 10],
          alignment: 'right',
          italics: true,
        },
        tableHeader: {
          bold: true,
        },
      },
      startPosition: {
        left: 60, // the left position
        right: 60, // the right position
      },
      permissions: {
        printing: 'highResolution', //'lowResolution'
        modifying: false,
        copying: false,
        annotating: true,
        fillingForms: true,
        contentAccessibility: true,
        documentAssembly: true
      },
    }
  }

  statusBill(_id: number, status: number) {
    let dumb = 2;
    if (status == 2) {
      dumb = 1;
    }

    this.items = null;
    // return;
    this.receipt_service.updateStatusReceipt({ _id: _id, status: dumb }).then(result => {
      this.onLoadReceipt()
    }).catch(err => {
      this.onLoadReceipt()
    })
  }

  getLength(data: string) {
    return data.length;
  }

  clearModel() {
    this.receipt._id = 0; // A
    this.receipt.receipt_no = null; // A
    this.receipt.customer = null;
    this.receipt.dor = new Date(); // A
    this.receipt.title = null;
    this.receipt.type = null;
    this.receipt.company = localStorage.getItem('company');
    this.receipt.cc = null;
    this.receipt.weight = null;
    this.receipt.year = null;
    this.receipt.member = localStorage.getItem('_id');
    this.receipt.total = 0;
    this.receipt.address = null;

    this.detail = [];
  }

}
