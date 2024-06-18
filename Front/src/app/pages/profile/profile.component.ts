import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserAuthService } from 'src/app/service/user-auth.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isLoading = false;
  currentUser: any;
  followerCount = 0;
  followingCount = 0;
  socialLinks: any = {};
  preferredGenres: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private authService: UserAuthService,
    private toastr: ToastrService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {
    this.profileForm = this.formBuilder.group({
      userFirstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      userLastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      website: ['', [Validators.required, Validators.pattern(/^(http|https):\/\/[^ "]+$/)]],
      location: ['', Validators.required],
      bio: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getCurrentUser();
  }

  getCurrentUser(): void {
    this.currentUser = this.authService.getUser();
    if (this.currentUser) {
      this.populateForm();
      this.followerCount = this.currentUser.followerCount;
      this.followingCount = this.currentUser.followingCount;
      this.socialLinks = JSON.parse(this.currentUser.socialLinks || '{}');
      this.preferredGenres = this.currentUser.preferredGenres || [];
    }
  }

  populateForm(): void {
    if (this.currentUser) {
      this.profileForm.patchValue({
        userFirstName: this.currentUser.userFirstName,
        userLastName: this.currentUser.userLastName,
        email: this.currentUser.email,
        phone: this.currentUser.phone,
        website: this.currentUser.website,
        location: this.currentUser.location,
        bio: this.currentUser.bio
      });
      this.cdr.detectChanges();
    }
  }

  getBorderColor(): string {
    if (!this.currentUser || !this.currentUser.role) {
      return 'border-purple';
    }
    switch (this.currentUser.role.roleName) {
      case 'Admin':
        return 'border-danger';
      case 'Reader':
        return 'border-primary';
      case 'Editor':
        return 'border-success';
      case 'Writer':
        return 'border-warning';
      case 'Moderate':
        return 'border-info';
      default:
        return 'border-purple';
    }
  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      this.isLoading = true;
      const updatedUser = {
        ...this.currentUser,
        ...this.profileForm.value
      };
      this.userService.updateUser(updatedUser).subscribe(
        (updatedUser) => {
          this.currentUser = updatedUser;
          this.authService.setUser(updatedUser);
          this.preferredGenres = this.currentUser.preferredGenres || [];
          this.cdr.detectChanges();  // Force change detection
          this.isLoading = false;
          this.toastr.success('Profile updated successfully', 'Success');
        },
        (error) => {
          this.isLoading = false;
          this.toastr.error('Error updating profile', 'Error');
          console.error('Error updating profile:', error);
        }
      );
    }
  }
}
