import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardModule } from 'primeng/card';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AuthContentComponent } from '../auth-content/auth-content.component';
import { AuthNavBarComponent } from '../auth-nav-bar/auth-nav-bar.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ChartsModule } from 'ng2-charts';
import { RouterModule, Routes } from '@angular/router';
import { AlertService } from './alert.service';
import { NgxPrintModule } from 'ngx-print';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateAgoPipe } from '../services/date-ago.pipe';
import { ThaidatePipe } from 'src/app/pipe/thaidate.pipe';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [AuthContentComponent, AuthNavBarComponent],
  imports: [
    CommonModule,
    CardModule,
    RouterModule,
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    ButtonsModule.forRoot(),
    ChartsModule,
    NgxPrintModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    CollapseModule.forRoot(),
  ],
  exports: [
    CardModule,
    AuthContentComponent,
    AuthNavBarComponent,
    TooltipModule,
    ButtonsModule,
    ChartsModule,
    NgxPrintModule,
    CollapseModule
  ],
  providers:[
    AlertService,
    ThaidatePipe
  ]
})
export class SharedsModule {}
