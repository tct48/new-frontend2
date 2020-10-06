import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedsModule } from '../share/shareds/shareds.module';
import { FormsModule } from '@angular/forms';
import { BillComponent } from './bill/bill.component';
import { AuthenticationRouting } from './authntication.routing';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { MemberComponent } from './member/member.component';
import { PromotionComponent } from './promotion/promotion.component';
import { SummarizeComponent } from './summarize/summarize.component';
import { DateAgoPipe } from '../share/services/date-ago.pipe';
import { VatComponent } from './vat/vat.component';
import { ReportComponent } from './report/report.component';
import { TrashComponent } from './trash/trash.component';


@NgModule({
  declarations: [BillComponent, MemberComponent, PromotionComponent, SummarizeComponent,DateAgoPipe, VatComponent, ReportComponent, TrashComponent],
  imports: [
    CommonModule,
    FormsModule,
    AuthenticationRouting,
    PaginationModule.forRoot(),
    SharedsModule
  ]
})
export class AuthenticationModule { }
