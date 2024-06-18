import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  isLoading = false;
  passwordStrength: number = 0;
  selectedRole: string = 'Reader';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.signupForm = this.fb.group({
      userName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]],
      userFirstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      userLastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      userPassword: ['', [Validators.required, this.passwordValidator.bind(this)]],
      confirmPassword: ['', Validators.required],
      role: ['Reader', Validators.required],
      termsAccepted: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void { }

  passwordValidator(control: any): { [key: string]: any } | null {
    if (!control.value) {
      return { required: true };
    }
    const password = control.value;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-zA-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;
    this.passwordStrength = score;
    return score < 4 ? { weakPassword: true } : null;
  }

  passwordMatchValidator(form: FormGroup): { [key: string]: any } | null {
    const password = form.get('userPassword')!.value;
    const confirmPassword = form.get('confirmPassword')!.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  formSubmit() {
    if (this.signupForm.invalid) {
      this.toastr.error('Please fill out the form correctly.');
      this.logFormControlsStatus();
      return;
    }

    this.isLoading = true;

    setTimeout(() => {
      Promise.all([
        this.userService.isUsernameExists(this.signupForm.value.userName).toPromise(),
        this.userService.isEmailExists(this.signupForm.value.email).toPromise(),
        this.userService.isPhoneExists(this.signupForm.value.phone).toPromise()
      ]).then(([usernameExists, emailExists, phoneExists]) => {
        if (usernameExists) {
          throw new Error('Username already exists');
        }
        if (emailExists) {
          throw new Error('Email already exists');
        }
        if (phoneExists) {
          throw new Error('Phone number already exists');
        }

        const userPayload = {
          ...this.signupForm.value,
          role: { roleName: this.signupForm.value.role }
        };
        delete userPayload.confirmPassword;

        return this.userService.addUser(userPayload).toPromise();
      }).then(() => {
        this.isLoading = false;
        this.toastr.success('Signup successful!');
        this.router.navigate(['/login']);
      }).catch(error => {
        this.isLoading = false;
        this.toastr.error(error.message);
      });
    }, 2000);
  }

  private logFormControlsStatus() {
    Object.keys(this.signupForm.controls).forEach(key => {
      const control = this.signupForm.get(key);
      console.log(`Control: ${key}, Status: ${control!.status}, Errors: ${JSON.stringify(control!.errors)}`);
    });
  }
}
