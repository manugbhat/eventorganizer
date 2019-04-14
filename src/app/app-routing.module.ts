import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateeventComponent } from './components/createevent/createevent.component';
import { HomeComponent } from './components/home/home.component';
import { LogoutComponent } from './components/logout/logout.component';
import { SigninComponent } from './components/signin/signin.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: SigninComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'createevent', component: CreateeventComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
