import { CUSTOM_ELEMENTS_SCHEMA,NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxApexchartsModule } from 'ngx-apexcharts';
import { CountUpModule } from 'ngx-countup';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ToastrModule } from 'ngx-toastr';
import { BrowserModule } from '@angular/platform-browser';
import { AdminComponent } from './admin/admin.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthorizationComponent } from './authorization/authorization.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { EmployeesComponent } from './employees/employees.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginService } from './service/login.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { PiecesComponent } from './pieces/pieces.component';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
// Step 1: Add the following line...
import { register } from 'swiper/element/bundle';

// Step 2: Add the following line...
register();
@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    HeaderComponent,
    FooterComponent,
    AuthorizationComponent,
    ProfileComponent,
    EmployeesComponent,
    DashboardComponent,
    LoginComponent,
      PiecesComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    NgxSkeletonLoaderModule,
    NgxChartsModule,
    NgxApexchartsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 2500,
      positionClass: 'toast-bottom-right',
      progressBar: true,
      extendedTimeOut: 1000,
    }),
    CountUpModule,
    NgxSpinnerModule,
    NgxDatatableModule,
     MatInputModule,
    MatTableModule,
    MatSelectModule,
    MatIconModule,

  ],
  providers: [
    LoginService,
  ], schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
