import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';





// Pages Components
import { AdminComponent } from './admin/admin.component';
import { AuthorizationComponent } from './authorization/authorization.component';
import { ProfileComponent } from './profile/profile.component';
import { EmployeesComponent } from './employees/employees.component';
import { AdduserComponent } from './adduser/adduser.component';



const routes: Routes = [
  // Public Routes


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
