import { Component, ElementRef, HostListener, Renderer2, ViewChild } from '@angular/core';
import { navItems } from '../../_nav';
import { NavigationEnd, Router, RouterStateSnapshot } from '@angular/router';
import { TopgradserviceService } from '../../topgradservice.service';
import  moment from 'moment';
import { MatMenuTrigger } from '@angular/material/menu';
// import { readSync } from 'fs';
import { NgxPermissionsService } from 'ngx-permissions';
import { HttpResponseCode } from '../../shared/enum';
declare var $

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {

  @ViewChild('menuTrigger') notificationMenu: MatMenuTrigger;

  image: any;
  id: string;
  allData: any = [];
  graduates: any;
  type: any;
  mainType: string;

  public sidebarMinimized = false;
  navItems: any[] = [];
  job_management: any;
  payment_management: any;
  general_management: any;
  date: number;
  nowDate: any;
  nextDay: string;
  count: any;
  notification_id;
  // public navItems = navItems;
  moment: any = moment
  typeClick: any;
  year: Number;
  userDetail = null;


  notifications: any = [

    // {
    //   id: 1,
    //   "title": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    //   "type": 'notification',
    //   "desicription": '',
    //   "name": 'tester',
    //   "image": '',
    //   "created_at": new Date().toISOString()
    // },
    // {
    //   id: 2,
    //   "title": "Marcus Smith has sent you a message which you haven't read yet",
    //   "type": 'message',
    //   "desicription": '',
    //   "name": 'tester',
    //   "image": '',
    //   "created_at": new Date().toISOString()
    // },
    // {
    //   id: 3,
    //   "title": "Task in now available",
    //   "type": 'task',
    //   "desicription": '',
    //   "name": 'tester',
    //   "image": '',
    //   "created_at": new Date().toISOString()
    // },
    // {
    //   id: 4,
    //   "title": "Task in now available two",
    //   "type": 'task',
    //   "desicription": '',
    //   "name": 'tester',
    //   "image": '',
    //   "created_at": new Date().toISOString()
    // },
    // {
    //   id: 5,
    //   "title": "Reminder: You have students to coordinate",
    //   "type": 'reminder',
    //   "desicription": '',
    //   "name": 'tester',
    //   "image": '',
    //   "created_at": new Date().toISOString()
    // },
    // {
    //   id: 6,
    //   "title": "Edgar Garcia has invited you to collaborate on [Placement Group Name]",
    //   "type": 'placementgroup',
    //   "desicription": '',
    //   "name": 'tester',
    //   "image": '',
    //   "created_at": new Date().toISOString()
    // },
    // {
    //   id: 7,
    //   "title": "It is time for you to select a Placement Type",
    //   "type": 'placementtype',
    //   "desicription": '',
    //   "name": 'tester',
    //   "image": '',
    //   "created_at": new Date().toISOString()
    // },
    // {
    //   id: 8,
    //   "title": "It is time for you to select a Placement Type",
    //   "type": 'student',
    //   "desicription": '',
    //   "name": 'tester',
    //   "image": '',
    //   "created_at": new Date().toISOString()
    // },
    // {
    //   id: 9,
    //   "title": "There are pending companies awaiting review",
    //   "type": 'review',
    //   "desicription": '',
    //   "name": 'tester',
    //   "image": '',
    //   "created_at": new Date().toISOString()
    // },
    // {
    //   id: 10,
    //   "title": "System update:",
    //   "type": 'update',
    //   "desicription": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    //   "name": 'tester',
    //   "image": '',
    //   less: false,
    //   "created_at": new Date().toISOString()
    // },
    // {
    //   id: 11,
    //   "title": "System update: one",
    //   "type": 'update',
    //   "desicription": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    //   "name": 'tester',
    //   less: true,
    //   "image": '',
    //   "created_at": new Date().toISOString()
    // }
  ];

  archive_notification: any = '';
  // Are you sure you want to archive this notification?
  sidebarVisible = true;
  sidebarCollapsed = false;

  constructor(private router: Router, private Service: TopgradserviceService,
     private permissionsService: NgxPermissionsService, private renderer: Renderer2, private elRef: ElementRef) {
    this.userDetail = JSON.parse(localStorage.getItem('userDetail'));
    this.mainType = this.userDetail?.type;
    this.id = localStorage.getItem('_id')

    if (this.mainType == "admin") {
      this.navItems = navItems;
    }

     // Auto close on route change if on mobile
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && window.innerWidth < 768) {
        this.sidebarVisible = false;
      }
      if (event instanceof NavigationEnd) {
        this.closeAllDropdowns();
      }
    });
  }
  closeAllDropdowns(): void {
    const openDropdowns = document.querySelectorAll('.c-sidebar-nav-dropdown.c-show');
    openDropdowns.forEach(dropdown => dropdown.classList.remove('c-show'));
  }

  ngAfterViewInit(): void {
  this.renderer.listen(this.elRef.nativeElement, 'click', (event: Event) => {
    const target = event.target as HTMLElement;

    // If the clicked element is a sidebar nav item and inside a dropdown
    const sidebarItem = target.closest('.c-sidebar-nav-item');
    const dropdown = target.closest('.c-sidebar-nav-dropdown');

    if (sidebarItem && dropdown) {
      dropdown.classList.remove('c-show'); // remove open class
      const toggler = dropdown.querySelector('.c-sidebar-nav-dropdown-toggle');
      if (toggler) {
        toggler.classList.remove('c-show');
        toggler.setAttribute('aria-expanded', 'false');
      }

      // Remove show from children
      const subNav = dropdown.querySelector('.c-sidebar-nav-dropdown-items');
      if (subNav) subNav.classList.remove('c-show');
    }
  });
}
  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  permissions = [
    {
      module: "My Tasks",
      is_view: true,
      is_write: true
    },
    {
      module: "Students",
      is_view: true,
      is_write: true
    },
    {
      module: "WIL",
      is_view: true,
      is_write: true
    },
    {
      module: "Job",
      is_view: true,
      is_write: true
    },
    {
      module: "Form Builder",
      is_view: true,
      is_write: true
    },
    {
      module: "Email Templates",
      is_view: true,
      is_write: true
    },
    {
      module: "Analytics",
      is_view: true,
      is_write: true
    },
    {
      module: "System Rule",
      is_view: true,
      is_write: true
    },
     {
      module: "Sandbox Library",
      is_view: true,
      is_write: true
    },
     {
      module: "System",
      is_view: true,
      is_write: true
    },
    {
      module: "Incident & Reporting",
      is_view: true,
      is_write: true
    },
    {
      module: "Users",
      is_view: true,
      is_write: true
    }
  ];
userProfile:any;
  ngOnInit() {
    setTimeout(() => {
      var calendlyElem = document.querySelectorAll("a[href='https://calendly.com/app/login']");
      var eventBrightElem = document.querySelectorAll("a[href='https://www.eventbrite.com/signin']");
      if (calendlyElem.length > 0 || eventBrightElem.length > 0) {
        calendlyElem[0].setAttribute("target", "_blank");
        eventBrightElem[0].setAttribute("target", "_blank");
      }
    }, 3000);
     this.userProfile = JSON.parse(localStorage.getItem('userDetail'));
    if(!this.userProfile?.is_password_set){
      this.router.navigate(['/change-password']);
    }
    // this.getNotificationList();
    this.getAdminDetail();
  }

  getAdminDetail() {
    const payload = {
      admin_id: this.userDetail?._id
    }
    this.Service.getAdminById(payload).subscribe(res => {
      if (res.status == HttpResponseCode.SUCCESS) {
        this.permissionsService.flushPermissions();
        const perm = ['Dashboard', 'Analytics (Beta)', 'Need Support', 'Articles', 'System', 'Sandbox Library'];
        if (res.result?.sub_type === 'admin') {
          this.permissions.forEach(permission => {
            if (permission.is_view) {
              perm.push(permission.module);
            }
            if (permission.is_view) {
              perm.push(permission.module.split(' ').join('_') + '_' + 'View');
            }
            if (permission.is_write) {
              perm.push(permission.module.split(' ').join('_') + '_' + 'Write');
            }
          });
        } else {
            const moduleAccessRights = res.result?.permissions;
            moduleAccessRights.forEach(permission => {
              if (permission.is_view) {
                perm.push(permission.module);
              }
              if (permission.is_view) {
                perm.push(permission.module.split(' ').join('_') + '_' + 'View');
              }
              if (permission.is_write) {
                perm.push(permission.module.split(' ').join('_') + '_' + 'Write');
              }
            });
        }
        this.permissionsService.loadPermissions(perm);
        this.navItems = this.navItems.filter(item => {
          return perm.find(permission => permission === item.name);
        });
      } else {
        this.Service.showMessage({
          message: res.msg
        });
      }
    }, err => {
      this.Service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  // getUserPermissionByGrouId(admin) {
  //   const payload = {
  //     permission_id: admin?.permission_id
  //   }
  //   this.Service.getUserPermissionByGrouId(payload).subscribe(res => {
  //     if (res.status == HttpResponseCode.SUCCESS) {
  //       const moduleAccessRights = res.result[0];
  //       this.permissionsService.flushPermissions();
  //       const perm = ['Dashboard', 'Analytics (Beta)', 'Need Support', 'Articles'];
  //       if (admin.type === 'admin') {
  //         this.permissions.forEach(permission => {
  //           if (permission.is_view || permission.is_write) {
  //             perm.push(permission.module);
  //           }
  //           if (permission.is_view) {
  //             perm.push(permission.module + '_' + 'View');
  //           }
  //           if (permission.is_write) {
  //             perm.push(permission.module + '_' + 'Write');
  //           }
  //         });
  //       } else {
  //           moduleAccessRights.forEach(permission => {
  //             if (permission.is_view || permission.is_write) {
  //               perm.push(permission.module);
  //             }
  //             if (permission.is_view) {
  //               perm.push(permission.module + '_' + 'View');
  //             }
  //             if (permission.is_write) {
  //               perm.push(permission.module + '_' + 'Write');
  //             }
  //           });
  //       }
  //       this.permissionsService.loadPermissions(perm);
  //       this.navItems = this.navItems.filter(item => {
  //         return perm.find(permission => permission === item.name);
  //       });
  //     } else {
  //       this.Service.showMessage({
  //         message: res.msg
  //       });
  //     }
  //   }, err => {
  //     this.Service.showMessage({
  //       message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
  //     });
  //   })
  // }

  getNotificationList(){
    let body = {
      "receiver_id": this.userDetail._id,
      "receiver_type":this.userDetail?.role
  }
    this.Service.getnotifications(body).subscribe(res => {
      if(res.status==200){
        this.notifications = [...this.notifications, ...res.result];
      }
      // this.Service.showMessage({
      //   message: "HCAAF submitted successfully"
      // });
      // this.goBack();
      // this.submithcaafModal.hide();
      // this.gethcaafList();
      // this.getHcaafPendingList();
    }, err => {
      this.Service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  notificationArchive(data){
    // let body =data;
    // this.Service.getnotifications(body).subscribe(res => {
    //   if(res.status==200){
    //     this.Service.showMessage({
    //       message: res.msg
    //     });
    //     this.getNotificationList();
    //     this.archive_notification = '';
    //     this.notificationMenu.closeMenu();
    //   }else{
    //     this.Service.showMessage({
    //       message: res.msg
    //     });
    //   }
    // }, err => {
    //   this.Service.showMessage({
    //     message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
    //   });
    // })
  }
  profileImageByViewProfileComponent() {
    this.Service.updateProfileImageData.subscribe((res: any) => {
      this.image = res.data.image
      if (res.code == 200) {
        localStorage.setItem('first_name', res.data.first_name);
        localStorage.setItem('last_name', res.data.last_name);
        localStorage.setItem('admin_email', res.data.email);
        localStorage.setItem('image', res.data.image);
      }
    }, err => {
      this.Service.showMessage({
        message: err.error.errors.msg ? err.error.errors.msg : 'Something went Wrong'
      })

    }
    );
  }
  logout() {
    localStorage.clear();
    this.router.navigate(['login']);
  }

  getNotificationData() {
    var obj = {
      limit: 5,
      offset: 0
    }
    this.Service.getNotification(obj).subscribe((res: any) => {
      this.allData = res.data
      this.nowDate = moment().subtract(1, 'd').format();
      this.nextDay = moment().format()


    })
  }
  updateNotificationData(_id) {
    this.notification_id = _id
    var obj = {
      id: this.notification_id,
      isSeen: 'true'
    }
    this.Service.updateNotification(obj).subscribe((res: any) => {
      this.ngOnInit()
    })
  }

  countNotificationData() {
    var obj = {
    }
    this.Service.coutnNotification(obj).subscribe((res: any) => {
      this.count = res.count
    })
  }

  clearAll() {
    this.allData = null
  }
  markAsRead() {

  }

  bellClick(event) {
    this.typeClick = event.type

  }
  currentYear() {
    var year = new Date().getFullYear()
    this.year = year

  }



  preventCloseOnClickOut() {
    // this.overlayContainer.getContainerElement().classList.add('disable-backdrop-click');
  }

  allowCloseOnClickOut() {
    // this.overlayContainer.getContainerElement().classList.remove('disable-backdrop-click');
  }


  Done() {
    this.notificationMenu.closeMenu();
  }

// toggleSidebar() {
//   this.sidebarVisible = !this.sidebarVisible;
//     setTimeout(() => {
//     window.dispatchEvent(new Event('resize'));
//   }, 300); 
//   // setTimeout(() => {
//   //   const tables = document.querySelectorAll('.mat-mdc-table');
//   //   tables.forEach((table) => {
//   //     const el = table as HTMLElement;
//   //     el.style.display = 'none';
//   //     void el.offsetHeight; // trigger reflow
//   //     el.style.display = '';
//   //   });
//   // }, 300); 
// }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  onSidebarVisibleChange(visible: boolean) {
    this.sidebarVisible = visible;
  }

  closeSidebarOnMobile() {
    if (window.innerWidth < 768) {
      this.sidebarVisible = false;
    }
  }

  isMobile = window.innerWidth < 768;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth < 768;
  }
   onNavItemClick() {
    if (this.isMobile) {
      this.sidebarVisible = false;
    }
  }

//   closeParentDropdown(event: Event): void {
//   // Traverse up to find the open dropdown and close it
//   const dropdown = (event.target as HTMLElement).closest('.c-sidebar-nav-dropdown');
//   if (dropdown) {
//     dropdown.classList.remove('c-show'); // CoreUI adds this class when open
//   }
// }
closeParentDropdown(event: Event) {
  const target = event.target as HTMLElement;
  // Check if the clicked element is a child menu item
  if (target.closest('.c-sidebar-nav-item') || target.closest('.c-sidebar-nav-link')) {
    // Prevent closing the dropdown if a child item is clicked
    return;
  }
  // Close the dropdown for other clicks
  // Add your logic to close the dropdown here, e.g., setting a flag or calling a method
}
}
