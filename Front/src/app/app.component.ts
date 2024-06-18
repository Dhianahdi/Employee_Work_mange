import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LoginService } from './service/login.service';
import { SidebarService } from './service/sidebar.service';
import { UserAuthService } from './service/user-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  user: any;
  showHeader: boolean = true;
  showFooter: boolean = true;
  showMainContent: boolean = true;
  isAdmin: boolean = false;
  isReader: boolean = false;
  isEditor: boolean = false;
  isWriter: boolean = false;
  isModerate: boolean = false;

  private excludeUrls = ['signup', 'login', 'forbidden', 'forgot-password', 'reset-password', 'gohome', 'email-code'];

  constructor(
    private router: Router,
    private sidebarService: SidebarService,
    private userAuthService: UserAuthService,
    public login: LoginService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.sidebarService.hideSidebar();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = event.url;
        this.showHeader = !this.excludeUrls.some(excludeUrl => url.includes(excludeUrl));
        this.showFooter = this.showHeader;
        this.showMainContent = !this.showHeader;
        this.cdRef.detectChanges(); // Force change detection on route change
      }
    });

    this.user = this.userAuthService.getUser();
    this.checkUserRole();
  }

  ngOnDestroy() { }

  private checkUserRole() {
    if (this.user && this.user.role) {
      this.isAdmin = this.user.role.roleName === 'Admin';
      this.isReader = this.user.role.roleName === 'Reader';
      this.isEditor = this.user.role.roleName === 'Editor';
      this.isWriter = this.user.role.roleName === 'Writer';
      this.isModerate = this.user.role.roleName === 'Moderate';
    }
  }

  public isLoggedIn() {
    return this.userAuthService.isLoggedIn();
  }

  public logout() {
    this.userAuthService.clear();
    window.location.hash = "#/login"; // Reload the page on logout
  }

  title = 'StoryCraft';
}
