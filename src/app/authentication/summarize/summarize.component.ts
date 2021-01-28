import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { SummaryService } from 'src/app/share/services/summary.service';
import { DatePipe } from '@angular/common';
import { AuthenService } from 'src/app/share/services/authen.service';
import { ThaidatePipe } from 'src/app/pipe/thaidate.pipe';
import { AlertService } from 'src/app/share/shareds/alert.service';

@Component({
  selector: 'app-summarize',
  templateUrl: './summarize.component.html',
  styleUrls: ['./summarize.component.css'],
  providers: [DatePipe, ThaidatePipe]
})
export class SummarizeComponent implements OnInit {
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
    { data: [], label: 'ดีจัง' },
  ];

  constructor(
    private summary: SummaryService,
    public datepipe: DatePipe,
    private authen: AuthenService,
    public thaidate: ThaidatePipe,
    private alert: AlertService
  ) {
    this.type = 1
    this.UserLogin = this.authen.setUserLogin();
    this.onCheckCompany();
    this.onLoadItems(Number(this.UserLogin.company));
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsInlineRangeValue = [this.bsInlineValue, this.maxDate];
  }

  model = {
    date: this.datepipe.transform(new Date(), "d"),
    month: this.datepipe.transform(new Date(), "M"),
    year: this.datepipe.transform(new Date(), "yyyy"),

    to_date: this.datepipe.transform(new Date(), "d"),
    to_month: this.datepipe.transform(new Date(), "M"),
    to_year: this.datepipe.transform(new Date(), "yyyy"),
  }

  bsInlineValue = new Date();
  bsInlineRangeValue: Date[];
  maxDate = new Date();

  ngOnInit() {
  }

  UserLogin: any;
  _id: string;
  total_items: number = 0;
  items: any;
  company: string = "ดีจัง";
  type: any;

  onSubmit() {
    if (this.model.to_year < this.model.year || this.model.to_month < this.model.month || (this.model.to_date < this.model.date && this.model.to_month <= this.model.month)) {
      this.alert.notify("กรุณากรอกข้อมูลวันที่ให้ถูกต้อง")
    }

    this.alert.notify("ค้นหาข้อมูลสำเร็จ")
  }

  onChangeCompany(name: string, company: number) {
   
    if(this.type==1)
    this.onLoadItems(company);
    else
      this.onChangeDate();
  }

  onCheckCompany() {
    if (this.UserLogin.company == 1) {
      this.company = "ดีจัง";
    } else if (this.UserLogin.company == 2) {
      this.company = "ดีจ้า";
    } else if (this.UserLogin.company == 3) {
      this.company = "ดีจ้าออโต้";
    } else if (this.UserLogin.company == 4) {
      this.company = "ดีจังหนองจอก";
    }
  }

  onChangeDate(days?: string) {
    let _id;
    if (this.company == "ดีจัง") {
      _id = 1;
    } else if (this.company == 'ดีจ้า') {
      _id = 2;
    } else if (this.company == 'ดีจ้าออโต้') {
      _id = 3;
    } else {
      _id = 4;
    }

    if (days) {
      this.onChangeCompany(this.company, _id)
      return;
    }

    this.summary.getLast7Month(_id).then(result => {
      this.items = result.items;
      this.total_items = result.items.length;
      console.log(result)

      // ข้อมูลสำหรับการฟแท่ง
      let data = {
        data: [],
        label: this.company
      }

      this.barChartData = [];
      this.barChartLabels = [];

      for (var i = 0; i < result.items.length; i++) {
        data.data.push(result.items[i].cash);
        this.barChartLabels.push(this.datepipe.transform(this.items[i].dor, 'MMMM'));
      }

      this.barChartData.push(data);
    })
  }

  onLoadItems(company?: number) {
    if (!company) {
      company = Number(localStorage.getItem("company"));
    }
    this.summary.getLast15Day(company).then(result => {
      this.items = result.items;
      this.total_items = result.items.length;
      // ข้อมูลสำหรับการฟแท่ง
      let data = [{
        data: [],
        label: this.company + "(เงินสด)"
      }, {
        data: [],
        label: this.company + " (เงินโอน)"
      }]

      this.barChartData = [];
      this.barChartLabels = [];

      for (var i = 0; i < this.items.length; i++) {
        this.barChartLabels.push(this.thaidate.transform(this.items[i].dor, "dd MM yyyy"));
        data[0].data.push(this.items[i].cash);
        data[1].data.push(result.items[i].bank);

        // this.barChartLabels.push(this.thaidate.transform(this.items[i].dor,'dd MM yyyy'))
      }

      this.barChartData.push({ data: data[0].data, label: this.company });
      this.barChartData.push({ data: data[1].data, label: "เงินโอน" });
    })
  }

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
  }

  public randomize(): void {
    // Only Change 3 values
    const data = [
      Math.round(Math.random() * 100),
      59,
      80,
      (Math.random() * 100),
      56,
      (Math.random() * 100),
      40];
    this.barChartData[0].data = data;
  }
}
