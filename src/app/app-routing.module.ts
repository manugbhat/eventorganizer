import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateeventComponent } from './components/createevent/createevent.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EventmgmtComponent } from './components/eventmgmt/eventmgmt.component';
import { HomeComponent } from './components/home/home.component';
import { LogoutComponent } from './components/logout/logout.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { InviteComponent } from './components/invite/invite.component';
import { ClubComponent } from './components/club/club.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: SigninComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'club', component: ClubComponent },
  { path: 'createevent', component: CreateeventComponent },
  { path: 'invite', component: InviteComponent },
  { path: 'invite/:code', component: InviteComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'manageevent/:id', component: EventmgmtComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
