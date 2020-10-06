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

  constructor(
    private receipt: ReceiptService,
    public datePipe: DatePipe,
    private authen: AuthenService
  ) {
    this.UserLogin = this.authen.setUserLogin();
    this.loadItems();
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

  fileName = "รายงานบัญชีรายวัน " + this.model.date + " - " + this.model.month + " - " + (Number(this.model.year) + 543) + ".xlsx"

  report: IReport = {
    total: 0,
    detuct_cash: 0,
    detuct_bank: 0,
    balance: 0,
    cash: 0,
    bank: 0
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
  }

  loadItems() {
    this.receipt.loadDaily().then(result => {
      this.total_price = 0;
      this.total_items = result.total_items;
      this.items = result.items;

      this.clearReport();
      console.log(this.items[0])

      for (var i = 0; i < this.total_items; i++) {
        this.report.total += this.items[i].total;
        if (this.items[i].status == "เงินสด")
          this.report.detuct_cash += this.items[i].detuct;
        else
          this.report.detuct_bank += this.items[i].detuct;
        if (this.items[i].status == 'เงินสด') {
          this.report.cash += this.items[i].total;
        } else if (this.items[i].status == 'โอนธนาคาร') {
          this.report.bank += this.items[i].total;
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
      console.log("new price");
      for (var i = 0; i < this.total_items; i++) {
        this.report.total += this.items[i].total;
        if (this.items[i].status == "เงินสด")
          this.report.detuct_cash += this.items[i].detuct;
        else
          this.report.detuct_bank += this.items[i].detuct;
        if (this.items[i].status == 'เงินสด') {
          this.report.cash += this.items[i].total;
        } else if (this.items[i].status == 'โอนธนาคาร') {
          this.report.bank += this.items[i].total;
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
  cash: number
}