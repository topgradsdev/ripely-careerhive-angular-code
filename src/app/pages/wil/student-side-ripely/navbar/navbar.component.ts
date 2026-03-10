import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  navLinks = [
    { label: 'Dashboard', route: '/student-portal/dashboard', icon: 'fa-th-large' },
    { label: 'Simulations', route: '/student-portal/simulations', icon: 'fa-desktop' },
    { label: 'Career Coaching', route: '/student-portal/career-coaching', icon: 'fa-comments' },
    { label: 'Support', route: '/student-portal/support', icon: 'fa-life-ring' }
  ];

  constructor(public router: Router) {}

  ngOnInit(): void {
    const userSDetail = JSON.parse(localStorage.getItem('userSDetail') || '{}');
    if (userSDetail?.first_name) {
      const first = userSDetail.first_name || '';
      const last = userSDetail.last_name || '';
      this.studentName = `${first} ${last}`.trim();
      this.studentInitials = `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
    }
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
