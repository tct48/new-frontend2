import { Routes, RouterModule } from '@angular/router'
import { AppURL } from './app.url'
import { SigninComponent } from './signin/signin.component';
import { AuthenticationModule } from './authentication/authentication.module';
import { AuthenticationGuard } from './guard/authentication.guard';

const RouterLists: Routes = [
    { path:'', redirectTo: AppURL.Login,pathMatch:'full' },
    { path:AppURL.Login, component: SigninComponent },
    { path:AppURL.Authen,loadChildren:()=> AuthenticationModule,canActivate:[AuthenticationGuard] }
]

export const AppRouting = RouterModule.forRoot(RouterLists);
