import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClubComponent } from './components/club/club.component';
import { CreateeventComponent } from './components/createevent/createevent.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EditViewEventComponent } from './components/editviewevent/editviewevent.component';
import { EventmgmtComponent } from './components/eventmgmt/eventmgmt.component';
import { HomeComponent } from './components/home/home.component';
import { InviteComponent } from './components/invite/invite.component';
import { LogoutComponent } from './components/logout/logout.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { ProfileComponent } from './components/profile/profile.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: SigninComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'club', component: ClubComponent },
  { path: 'salon', component: CreateeventComponent },
  { path: 'invite', component: InviteComponent },
  { path: 'invite/:code', component: InviteComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'manageevent/:id', component: EventmgmtComponent },
  { path: 'editviewevent/:id', component: EditViewEventComponent },
  { path: 'profile', component: ProfileComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
