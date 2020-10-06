import { Component, OnInit } from '@angular/core';
import { Label } from 'ng2-charts';
import { ChartType, ChartDataSets, ChartOptions } from 'chart.js';
import { AlertService } from 'src/app/share/shareds/alert.service';
import { AuthenService } from 'src/app/share/services/authen.service';
import { SummaryService } from 'src/app/share/services/summary.service';
import { DatePipe } from '@angular/common';
import { ThaidatePipe } from 'src/app/pipe/thaidate.pipe';

@Component({
  selector: 'app-vat',
  templateUrl: './vat.component.html',
  styleUrls: ['./vat.component.css'],
  providers: [DatePipe, ThaidatePipe]
})
export class VatComponent implements OnInit {

  constructor(
    private alert: AlertService,
    private authen: AuthenService,
    private summary: SummaryService,
    private datePipe: DatePipe,
    public thaidate: ThaidatePipe
  ) {
    this.onLoadGraph();
    this.UserLogin = this.authen.setUserLogin()
  }

  ngOnInit(): void {
  }

  company: any = localStorage.getItem("company");
  date: any = this.thaidate.transform(new Date()+"", "dd MMMM yyyy");
  items: any;
  total_price: number;
  model={
    date:this.datePipe.transform(new Date(),"d"),
    month:this.datePipe.transform(new Date(),"M"),
    year:this.datePipe.transform(new Date(),"yyyy"),
    filter:this.company,
  }
  UserLogin:any;

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };

  public barChartLabels: Label[] = ['ไม่มีข้อมูล'];
  // public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  // public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
    // { data: [32000, 12400, 35000, 32000, 48000, 33000, 17000], label: 'ดีจ้า' },
    // { data: [45000, 18000, 35000, 50000, 64000, 51000, 45000], label: 'ดีจ้า' },
    // { data: [53000, 24000, 93000, 65000, 32000, 49000, 80000], label: 'ดีจ้า' },
  ];

  onLoadGraph() {
    this.total_price = 0;
    this.summary.getVat(this.model).then(result => {
      this.items = result.items;

      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].type == 3) {
          this.total_price += this.items[i].price + 10;
        } else {
          this.total_price += this.items[i].price + 20;
        }
        if(this.items[i].fines!=0){
          if (this.items[i].type == 3) {
            this.total_price -= this.items[i].price + 10;
          } else {
            this.total_price -= this.items[i].price + 20;
          }
          this.total_price+=this.items[i].fines;
        }
      }
    }).catch(err => {
      console.log(err)
    })

    let data = [{
      data: [],
      label: this.company
    }, {
      data: [],
      label: this.company + " (เงินโอน)"
    }]

  }

  onSubmit(){
    this.total_price = 0;
    this.items=[];
    if(Number(this.model.year)>2500){
      this.model.year=(Number(this.model.year) - 543) +""
    }
    this.summary.getVat(this.model).then(result=>{
      this.items = result.items;
      console.log(this.items)

      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].type == 3) {
          this.total_price += this.items[i].price + 10;
        } else {
          this.total_price += this.items[i].price + 20;
        }
        if(this.items[i].fines!=0){
          if (this.items[i].type == 3) {
            this.total_price -= this.items[i].price + 10;
          } else {
            this.total_price -= this.items[i].price + 20;
          }
          this.total_price+=this.items[i].fines;
        }
      }
      this.date = this.thaidate.transform(this.items[0].dor,"dd MMMM yyyy")
    console.log(this.date)
    })

  }

  onPrint(){
    window.print();
  }

  returnCompany(_id:number){
    if(_id==1){
      return "ดีจัง"
    }else if(_id==2){
      return "ดีจ้า"
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


}
