// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';

// @Injectable({ providedIn: 'root' })
// export class SessionSyncService {
//   constructor(private router: Router) {}

//   init() {
//     window.addEventListener('storage', this.handleStorageChange.bind(this));
//   }

//   handleStorageChange(event: StorageEvent) {
//     // Only act on role switch or logout events
//     if (event.key === 'role-switch') {
//       const data = JSON.parse(event.newValue || '{}');

//       if (data.role === 'student') {
//         // Switch all tabs to student portal
//         this.router.navigate(['/student/dashboard']);
//       } else if (data.role === 'admin') {
//         // Switch all tabs to admin portal
//         this.router.navigate(['/admin/dashboard']);
//       }
//     }

//     if (event.key === 'logout-event') {
//       // If logged out in one tab, all tabs logout
//       localStorage.clear();
//       sessionStorage.clear();
//       this.router.navigate(['/login']);
//     }
//   }

//   broadcastRoleSwitch(role: 'admin' | 'student', id?: string) {
//     localStorage.setItem('role-switch', JSON.stringify({
//       role,
//       id,
//       timestamp: Date.now()
//     }));
//   }

//   broadcastLogout() {
//     localStorage.setItem('logout-event', Date.now().toString());
//   }
// }


import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { TopgradserviceService } from './topgradservice.service';

@Injectable({
  providedIn: 'root'
})
export class SessionSyncService {
  private socket: Socket;
   SERVER_URL = environment.SERVER_URL;
   userStudent:any ;
  constructor(private router: Router, private ngZone: NgZone, private service: TopgradserviceService) {
    // Connect to Socket.IO backend
     this.socket = io(this.SERVER_URL, {
      transports: ['websocket'],
      auth: {
        token: localStorage.getItem('token') || '',
      },
    });
    this.listen();
    this.registerDisconnect();
  }


    /** 🔌 Initialize socket connection */
  // initializeSocketConnection() {
  //   this.socket = io(this.SERVER_URL, {
  //     transports: ['websocket'],
  //     auth: {
  //       token: localStorage.getItem('token') || '',
  //     },
  //   });

  //   console.log('✅ Socket connected as:', localStorage.getItem('token') ? 'Authenticated user' : 'Guest');

  //   //  this.socket = io(`${this.SERVER_URL}`, {
  //   // transports: ['websocket'], // optional but recommended
  //   // }); // Replace with your backend URL

  //   this.userStudent = JSON.parse(localStorage.getItem('userDetail') || '{}');
  //   this.listen();
  //   this.registerDisconnect();
  // }
  /** Listen to impersonation and logout events */
  private listen() {
    // Admin → Student or Student → Admin
    this.socket.on('impersonation-event', (data: any) => {
        // Run inside Angular zone
        this.ngZone.run(() => {
         console.log("data", data)
            if (data.type === 'admin-to-student') {
                const admin = JSON.parse(localStorage.getItem('userDetail') || '{}');
              this.userStudent = admin;
                // ✅ Only trigger if impersonation matches the logged-in admin
                if (data?.admin_data?._id === admin._id) {
                    const studentData = { ...data.loginData.data, is_admin: true };
                    localStorage.setItem('userSDetail', JSON.stringify(studentData));
                    localStorage.setItem('token', data.loginData.token);

                    this.router
                    .navigateByUrl('/student/dashboard', { skipLocationChange: false })
                    .then(success => {
                        if (!success) console.error('Navigation to student failed');
                    });
                }
                } 
                else if (data.type === 'student-to-admin') {
                const admin = JSON.parse(localStorage.getItem('userDetail') || '{}');

                // ✅ Only trigger if return impersonation belongs to same admin
                if (data.loginData?.data?._id === admin._id) {
                    localStorage.setItem('userDetail', JSON.stringify(data.loginData.data));
                    localStorage.setItem('token', data.loginData.token);

                    // Remove student session info cleanly
                    localStorage.removeItem('userSDetail');

                    this.router
                    .navigateByUrl(`/admin/wil/view-student-profile?id=${data.studentId}`, { skipLocationChange: false })
                    .then(success => {
                        if (!success) console.error('Navigation to admin failed');
                    });
                }
            }

        });

        });


    // logout tabs
    this.socket.on('logout-tab-event', (data: any) => {
        // Run inside Angular zone
        console.log("logout-tab-event", data)
        this.ngZone.run(() => {
             const student = JSON.parse(localStorage.getItem('userSDetail') || '{}');
             this.userStudent = student;
            console.log(data?.userId , student?._id)
             if(data?.userId === student?._id){
                const body = {
                student_id: data.userId,
                type: 'student',
                };

                this.service.autoLogout(body).subscribe({
                next: (res: any) => {
                    if (res?.result === 'success') {
                    localStorage.clear();
                    sessionStorage.clear();
                    this.router.navigate(['/student-login']);
                    } else {
                    console.log('Logout failed:', res);
                    }
                },
                error: (err) => console.error('Logout error:', err),
                });
             }  
       

        });

    });


    // Logout event
    this.socket.on('logout-event', (data: any) => {
        console.log("logout", data)
      this.ngZone.run(() => {
          const user = JSON.parse(localStorage.getItem('userSDetail') || '{}');
           this.userStudent = user;
  console.log("logout user", user)
          if (user && user._id === data.userId && user.role === 'student') {

          // 🧩 Case 1: Student logged in via admin impersonation
          if (user.is_admin) {
              const admin = JSON.parse(localStorage.getItem('userDetail') || '{}');
              if (!admin || !admin.email) {
              console.error('Admin details missing in localStorage.');
              return;
              }

              const body = {
              student_id: user._id,
              email: admin.email,
              type: 'admin',
              };

              this.service.impersonateLogin(body).subscribe({
              next: (res: any) => {
                  if (res?.token) {
                  // Notify admin tabs that student switched back
                  this.broadcastStudentToAdmin(admin.email, user._id);

                  // Update local storage for admin session
                  localStorage.removeItem('userSDetail');
                  localStorage.setItem('userDetail', JSON.stringify(res.data));
                  localStorage.setItem('token', res.token);
                  localStorage.setItem('impersonate', "true");

                  // Navigate admin back to student profile
                  this.router.navigateByUrl(`/admin/wil/view-student-profile?id=${user._id}`, {
                      skipLocationChange: false,
                  });
                  } else {
                  console.error('Impersonate login failed:', res);
                  }
              },
              error: (err) => console.error('Error in impersonateLogin API:', err),
              });
          }

          // 🧩 Case 2: Regular student logout
          else {
              const body = {
              student_id: data.user_id,
              type: 'student',
              };

              this.service.autoLogout(body).subscribe({
              next: (res: any) => {
                  if (res?.result === 'success') {
                  localStorage.clear();
                  sessionStorage.clear();
                  this.router.navigate(['/student-login']);
                  } else {
                  console.log('Logout failed:', res);
                  }
              },
              error: (err) => console.error('Logout error:', err),
              });
          }
          }
      });
    });


  }

  /** Emit Admin → Student impersonation */
  broadcastAdminToStudent(studentId: string) {
    const admin = JSON.parse(localStorage.getItem('userDetail') || '{}');
    this.socket.emit('impersonate-admin-to-student', { email:studentId, admin_data:admin});
  }

  /** Emit Student → Admin return */
  broadcastStudentToAdmin(adminId: string, studentId:any = '') {
    this.socket.emit('impersonate-student-to-admin', {email:adminId , studentId});
  }

  tabclose(userId: string) {
    this.socket.emit('tab-closed', {userId});
  }

  logoutStudent(userId: string) {
    this.socket.emit('logout-student', {userId});
  }

  // /** Emit Student activity (idle tracking) */
  // broadcastStudentActivity(studentId: string, ) {
  //   this.socket.emit('student-activity', { studentId });
  // }

  broadcastStudentActivity(studentId: string, isIdle: boolean = false) {
  // Emit to server with idle flag
  this.socket.emit('student-activity', { 
    studentId,
    isIdle
  });
}

  // private isPageRefresh(): boolean {
  //   const entries = performance.getEntriesByType('navigation');
  //   const navEntry = entries[0] as PerformanceNavigationTiming | undefined;
  //   return navEntry?.type === 'reload';
  // }


  //  /** Disconnect logic handled on server */
  //   private registerDisconnect() {
  //       window.addEventListener('beforeunload', (event) => {
  //        if (this.isPageRefresh()) {
  //         console.log('Page refresh detected — skipping logout');
  //         return;
  //       }
  //        event.preventDefault();
  //       alert("calling");
  //       const user = JSON.parse(localStorage.getItem('userSDetail') || '{}');
  //           if (user?._id) {
  //               this.socket.emit('tab-closed', { userId: user._id });
  //               const body = {
  //                 student_id: user._id,
  //                 type: 'student'
  //               };
  //               //  localStorage.clear();
  //               // sessionStorage.clear();
  //               this.sendBeacon('/auth/auto-logout', body);
  //           }
  //       });
  //   }

  private isPageRefresh(): boolean {
      const entries = performance.getEntriesByType('navigation');
      // console.log("entries", JSON.stringify(entries))
      const navEntry = entries[0] as PerformanceNavigationTiming | undefined;
      // console.log("navEntry", JSON.stringify(navEntry))
      return navEntry?.type === 'reload';
  }

//   private isPageRefresh(): boolean {
//   // If 'refresh' flag exists, it's a refresh
//   const isRefresh = sessionStorage.getItem('isRefresh') === 'true';
//   sessionStorage.setItem('isRefresh', 'true'); // set for next load
//   return isRefresh;
// }

  private registerDisconnect() {
      // window.addEventListener('beforeunload', (event) => {
      //     // Skip logout on page refresh
      //     if (this.isPageRefresh()) {
      //         console.log('Page refresh detected — skipping logout');
      //         return;
      //     }

      //     // console.log("this.userStudent", this.userStudent)
          
      //     // Avoid preventDefault to prevent confirmation dialog
      //     // No return value needed unless you want to prompt the user
      // });
  }

    // private registerDisconnect() {
    //   window.addEventListener('beforeunload', (event) => {
    //     // Detect refresh (optional)
    //     if (this.isPageRefresh()) {
    //       console.log('Page refresh detected — skipping logout');
    //       return;
    //     }

    //     const user = JSON.parse(localStorage.getItem('userSDetail') || '{}');
    //     if (!user?._id) return;

    //     // Show confirmation dialog
    //     const confirmationMessage = 'Are you sure you want to close this tab? You will be logged out.';
    //     (event || window.event).returnValue = confirmationMessage; // For older browsers
    //     event.preventDefault(); // For newer browsers
    //     return confirmationMessage; // This triggers browser's native confirmation dialog
    //   });

    //   // Use `visibilitychange` to detect after confirmation and perform cleanup
    //   window.addEventListener('unload', () => {
    //     const user = JSON.parse(localStorage.getItem('userSDetail') || '{}');
    //     if (!user?._id) return;

    //     // Perform logout cleanup
    //     const body = {
    //       student_id: user._id,
    //       type: 'student'
    //     };

    //     // Notify backend (use sendBeacon for reliability during unload)
    //     navigator.sendBeacon(`${this.SERVER_URL}/auth/auto-logout`, JSON.stringify(body));

    //     // Clear storage
    //     localStorage.clear();
    //     sessionStorage.clear();
    //   });
    // }



  private sendBeacon(url: string, body: any) {
    const data = JSON.stringify(body);
    navigator.sendBeacon(url, data);
  }

  /** Emit logout */
  broadcastLogout(userId: string) {
    this.socket.emit('logout', { userId });
  }
}
