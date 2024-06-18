import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/service/login.service';
import { UserAuthService } from 'src/app/service/user-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginData: any = {
    userName: '',
    userPassword: ''
  };

  showErrorAlert = false;
  touchedFields: { [key: string]: boolean } = {};
  maxLoginAttempts = 3;
  failedLoginAttempts = 0;
  blockedUntil: Date | null = null;
  countdownInterval: any;
  remainingTime: number | null = null;
  isLoading = false;

  constructor(
    private loginService: LoginService,
    private userAuthService: UserAuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.setupBlockedUntil();
  }

  setupBlockedUntil(): void {
    const blockedUntilString = localStorage.getItem('blockedUntil');
    if (blockedUntilString) {
      this.blockedUntil = new Date(blockedUntilString);
      if (this.blockedUntil > new Date()) {
        const secondsUntilUnblock = Math.ceil((this.blockedUntil.getTime() - new Date().getTime()) / 1000);
        this.remainingTime = secondsUntilUnblock;
        this.showErrorAlert = true;
        this.startCountdown();
      }
    }
  }

  startCountdown(): void {
    this.countdownInterval = setInterval(() => {
      if (this.remainingTime && this.remainingTime > 0) {
        this.remainingTime--;
        this.updateErrorMessage();
      } else {
        this.clearCountdownInterval();
        this.blockedUntil = null;
        localStorage.removeItem('blockedUntil');
        this.showErrorAlert = false;
        this.failedLoginAttempts = 0;
      }
    }, 1000);
  }

  updateErrorMessage(): void {
    const seconds = this.remainingTime ?? 0;
    this.toastr.error(`Too many failed attempts. Try again after ${seconds} seconds.`);
  }

  clearCountdownInterval(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  isFieldValid(fieldName: string): boolean {
    const fieldValue = this.loginData[fieldName];
    return !!fieldValue && fieldValue.trim().length > 0;
  }

  isFieldTouched(fieldName: string): boolean {
    return this.touchedFields[fieldName];
  }

  setFieldTouched(fieldName: string): void {
    this.touchedFields[fieldName] = true;
  }

  formSubmit(): void {
    if (this.blockedUntil && this.blockedUntil > new Date()) {
      this.updateErrorMessage();
      this.showErrorAlert = true;
      return;
    }

    if (!this.isFieldValid('userName') || !this.isFieldValid('userPassword')) {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.toastr.error('Username and Password are required.');
      }, 1000);
      return;
    }

    this.isLoading = true;
    setTimeout(() => {
      this.login();
    }, 1000);
  }

  login(): void {
    this.loginService.generateToken(this.loginData).subscribe(
      (data: any) => {
        this.isLoading = false;
        if (data && data.jwtToken && data.user && data.user.role && data.user.role.roleName) {
          this.userAuthService.setToken(data.jwtToken);
          this.userAuthService.setRoles([data.user.role.roleName]);
          this.toastr.success('Login successful!');
          this.navigateToDashboard(data.user.role.roleName);
        } else {
          console.error('Invalid user data:', data);
          this.toastr.error('Invalid user data');
        }
      },
      (error) => {
        this.isLoading = false;
        console.error('Error:', error);
        if (error.status === 401) {
          this.toastr.error('Invalid credentials.');
        } else {
          this.toastr.error('An unexpected error occurred. Please try again later.');
        }
        this.failedLoginAttempts++;
        this.checkLoginAttempts();
      }
    );
  }

  toggleShowPassword(event: any): void {
    const inputField = document.querySelector('input[name="userPassword"]');
    if (inputField) {
      inputField.setAttribute('type', event.target.checked ? 'text' : 'password');
    }
  }

  countdownIsActive(): boolean {
    return !!(this.remainingTime && this.remainingTime > 0);
  }

  checkLoginAttempts(): void {
    if (this.failedLoginAttempts >= this.maxLoginAttempts) {
      const blockedTime = new Date();
      blockedTime.setSeconds(blockedTime.getSeconds() + 10);
      this.blockedUntil = blockedTime;
      localStorage.setItem('blockedUntil', blockedTime.toISOString());
      this.remainingTime = 10;
      this.startCountdown();
      this.toastr.error('Too many failed attempts. Try again after 10 seconds.');
      this.showErrorAlert = true;
    }
  }

  navigateToDashboard(role: string): void {
    switch (role) {
      case 'Admin':
        window.location.hash = '#/admin';
        break;
      case 'Reader':
        window.location.hash = '#/reader';
        break;
      case 'Editor':
        window.location.hash = '#/editor';
        break;
      case 'Writer':
        window.location.hash = '#/writer';
        break;
      case 'Moderate':
        window.location.hash = '#/moderate';
        break;
      default:
        console.error('Invalid role:', role);
        this.toastr.error('Invalid role');
        break;
    }
  }

  closeErrorAlert(): void {
    this.showErrorAlert = false;
  }
}
