import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  passwordFieldType: string = 'password';
  errorMessage: string = '';

  constructor(private router: Router) {}

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  onSubmit(): void {
    if (this.username === 'kuffetath' && this.password === 'kufferathadmin') {
      // Redirect to the dashboard or home page
      this.router.navigate(['/dashboard']);
    } else {
            this.errorMessage = 'Invalid login ID or password';

    }
  }
}
