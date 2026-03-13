import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../../../services/theme.service';
import { TopgradserviceService } from '../../../../topgradservice.service';
import { SessionSyncService } from '../../../../session-sync.service';
import OktaAuth from '@okta/okta-auth-js';
import { OKTA_AUTH } from '@okta/okta-angular';

@Component({
  selector: 'app-student-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class StudentNavbarComponent implements OnInit {
  studentName = 'Student';
  studentInitials = 'S';
  showUserMenu = false;
  showMobileMenu = false;
  notificationCount = 0;
  userSDetail: any;

  navLinks = [
    { label: 'Dashboard', route: '/student-portal/dashboard', icon: 'fa-th-large' },
    { label: 'Simulations', route: '/student-portal/simulations', icon: 'fa-desktop' },
    { label: 'Career Coaching', route: '/student-portal/career-coaching', icon: 'fa-comments' },
    { label: 'Support', route: '/student-portal/support', icon: 'fa-life-ring' }
  ];

  constructor(
    public router: Router,
    public themeService: ThemeService,
    private service: TopgradserviceService,
    private sessionSync: SessionSyncService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth
  ) {}

  get isDarkMode(): boolean {
    return this.themeService.isDarkMode;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  ngOnInit(): void {
    this.userSDetail = JSON.parse(localStorage.getItem('userSDetail') || '{}');
    if (this.userSDetail?.first_name) {
      const first = this.userSDetail.first_name || '';
      const last = this.userSDetail.last_name || '';
      this.studentName = `${first} ${last}`.trim();
      this.studentInitials = `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
    }
  }

  goToProfile(): void {
    this.showUserMenu = false;
    this.router.navigate(['/student/my-profile']);
  }

  logout(): void {
    this.showUserMenu = false;
    const body = {
      student_id: this.userSDetail._id,
      type: 'student',
    };
    this.service.autoLogout(body).subscribe((res: any) => {
      if (res.result === 'success') {
        this.sessionSync.broadcastLogout(this.userSDetail.email);
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigate(['/student-login']);
        this.oktaAuth.signOut({ postLogoutRedirectUri: 'https://monash.careerhive.com.au/' });
      }
    });
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
  }

  closeMenus(): void {
    this.showUserMenu = false;
    this.showMobileMenu = false;
  }

  isActive(route: string): boolean {
    return this.router.url.includes(route.split('/').pop()!);
  }
}
