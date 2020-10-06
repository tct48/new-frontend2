import { Routes, RouterModule } from "@angular/router";
import { AppURL } from '../app.url';
import { AuthURL } from './authentication.url';
import { BillComponent } from './bill/bill.component';
import { MemberComponent } from './member/member.component';
import { PromotionComponent } from './promotion/promotion.component';
import { SummarizeComponent } from './summarize/summarize.component';
import { UserRoleGuard } from '../guard/user-role.guard';
import { VatComponent } from './vat/vat.component';
import { ReportComponent } from './report/report.component';
import { TrashComponent } from './trash/trash.component';

const RouterLists : Routes = [
  { path:'', redirectTo: AuthURL.Bill,pathMatch:'full' },
  { path: AuthURL.Bill, component:BillComponent,canActivate:[UserRoleGuard],data:{roles:[1,2,3]} },
  { path: AuthURL.Member, component: MemberComponent,canActivate:[UserRoleGuard],data:{roles:[1,2,3]} },
  { path: AuthURL.Promotion, component: PromotionComponent,canActivate:[UserRoleGuard],data:{roles:[1,2,3]} },
  { path: AuthURL.Summarize, component: SummarizeComponent,canActivate:[UserRoleGuard],data:{roles:[1,2,3]} },
  { path: AuthURL.Vat, component: VatComponent, canActivate:[UserRoleGuard], data:{roles:[1,2,3]} },
  { path: AuthURL.Report, component: ReportComponent, canActivate:[UserRoleGuard], data:{roles:[1,2,3]} },
  { path: AuthURL.Trash, component: TrashComponent, canActivate:[UserRoleGuard], data:{roles:[1]} }
]

export const AuthenticationRouting = RouterModule.forChild(RouterLists);
