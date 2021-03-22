import { Component, OnInit } from '@angular/core';
import { ReceiptService } from 'src/app/share/services/receipt.service';
import { AuthenService } from 'src/app/share/services/authen.service';
import { DatePipe } from '@angular/common';
import { ThaidatePipe } from 'src/app/pipe/thaidate.pipe';
import * as XLSX from "xlsx";

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  providers: [DatePipe, ThaidatePipe]
})
export class ReportComponent implements OnInit {
  public now: Date = new Date();
  constructor(
    private receipt: ReceiptService,
    public datePipe: DatePipe,
    private authen: AuthenService
  ) {
    this.UserLogin = this.authen.setUserLogin();
    this.loadItems();
    this.now = new Date();
  }

  ngOnInit(): void {
  }
  UserLogin: any;
  total_items: number;
  items: any;
  company: any = localStorage.getItem("company");
  model = {
    date: this.datePipe.transform(new Date(), "d"),
    month: this.datePipe.transform(new Date(), "M"),
    year: this.datePipe.transform(new Date(), "yyyy"),
    filter: this.company,
  }
  total_price: Number = 0;
  hidden:boolean = true;

  fileName = "รายงานบัญชีรายวัน " + this.model.date + " - " + this.model.month + " - " + (Number(this.model.year) + 543) + ".xlsx"

  report: IReport = {
    total: 0,
    detuct_cash: 0,
    detuct_bank: 0,
    balance: 0,
    cash: 0,
    bank: 0,
    // ตรวจสภาพ
    check:0,
  };

  exportexcel(): void {
    let element = document.getElementById("excel-table");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    XLSX.writeFile(wb, this.fileName)
  }

  clearReport() {
    this.report.total = 0;
    this.report.detuct_cash = 0;
    this.report.balance = 0;
    this.report.cash = 0;
    this.report.bank = 0;
    this.report.check = 0;
  }

  loadItems() {
    this.receipt.loadDaily().then(result => {
      this.total_price = 0;
      this.total_items = result.total_items;
      this.items = result.items;

      this.clearReport();
      console.log(this.items[0])
      console.log(result)

      for (var i = 0; i < this.total_items; i++) {
        this.report.total = Number(this.report.total) + Number(this.items[i].total);
        // ตรวจสถาพทั้งหมด
        this.report.check = Number(this.report.check) + Number(this.items[i].inspection);
        if (this.items[i].status == "เงินสด"){
          this.report.detuct_cash += Number(this.items[i].detail_detuct);
        }
        else
          this.report.detuct_bank = Number(this.report.detuct_bank) + Number(this.items[i].detail_detuct);
        if (this.items[i].status == 'เงินสด') {
          this.report.cash = Number(this.report.cash) +  Number(this.items[i].total);
        } else if (this.items[i].status == 'โอนธนาคาร') {
          this.report.bank = Number(this.report.bank) + Number(this.items[i].total);
        }
      }

      this.report.balance = this.report.total-this.report.detuct_cash;
    })
  }

  onSubmit() {
    this.clearReport();
    this.receipt.loadDaily(this.model).then(result => {
      this.total_price = 0;
      this.total_items = result.total_items;
      this.items = result.items;
      this.report.detuct_cash = 0;
      for (var i = 0; i < this.total_items; i++) {
        this.report.total = Number(this.report.total) + Number(this.items[i].total);
        this.report.check = Number(this.report.check) + Number(this.items[i].inspection);
        if (this.items[i].status == "เงินสด"){
          this.report.detuct_cash += Number(this.items[i].detail_detuct);
        }
        else
          this.report.detuct_bank = Number(this.report.detuct_bank) + Number(this.items[i].detail_detuct);
        if (this.items[i].status == 'เงินสด') {
          this.report.cash = Number(this.report.cash) +  Number(this.items[i].total);
        } else if (this.items[i].status == 'โอนธนาคาร') {
          this.report.bank = Number(this.report.bank) + Number(this.items[i].total);
        }
      }

      this.report.balance = this.report.total-this.report.detuct_cash;
    })
  }
}

export interface IReport {
  total: number,
  detuct_cash: number,
  detuct_bank: number,
  balance: number,
  bank: number,
  cash: number,
  check: number,
}
