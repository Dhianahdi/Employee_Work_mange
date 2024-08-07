import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';





// Pages Components
import { AdminComponent } from './admin/admin.component';
import { AuthorizationComponent } from './authorization/authorization.component';
import { ProfileComponent } from './profile/profile.component';
import { EmployeesComponent } from './employees/employees.component';
import { AdduserComponent } from './adduser/adduser.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { PiecesComponent } from './pieces/pieces.component';
import { DashboarduserComponent } from './dashboarduser/dashboarduser.component';



const routes: Routes = [
  // Public Routes

  { path: '', component: LoginComponent }, // Include the email parameter
  { path: 'dashboard', component: DashboardComponent }, // Include the email parameter
  { path: 'dashboardusine', component: PiecesComponent }, // Include the email parameter
  { path: 'dashboarduser', component: DashboarduserComponent }, // Include the email parameter

  { path: 'admin', component: AdminComponent }, // Include the email parameter
  { path: 'approval', component: AuthorizationComponent }, // Include the email parameter
  { path: 'profile', component: ProfileComponent }, // Include the email parameter
  { path: 'employees', component: EmployeesComponent }, // Include the email parameter
  { path: 'adduser', component: AdduserComponent }, // Include the email parameter


];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      useHash: false // Use PreloadAllModules strategy
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
