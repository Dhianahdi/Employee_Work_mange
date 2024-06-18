import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxApexchartsModule } from 'ngx-apexcharts';
import { CountUpModule } from 'ngx-countup';
import { MultiSelectModule } from 'primeng/multiselect';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ToastrModule } from 'ngx-toastr';
import { AdminComponent } from './admin/admin.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthorizationComponent } from './authorization/authorization.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginService } from './service/login.service';
import { ProfileComponent } from './profile/profile.component';
import { EmployeesComponent } from './employees/employees.component';






@NgModule({
  declarations: [		
    AppComponent,
    AdminComponent,
    HeaderComponent,
    FooterComponent,
    AuthorizationComponent,
      ProfileComponent,
      EmployeesComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    NgxSkeletonLoaderModule,
    MultiSelectModule,
    NgxChartsModule,
    NgxApexchartsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      progressBar: true,
      extendedTimeOut: 3000,
    }),
    CountUpModule,
  ],
  providers: [

    LoginService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
