import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry, tap, finalize } from 'rxjs/operators';
import { HttpHeaders, HttpErrorResponse, } from '@angular/common/http';
// import { NgxUiLoaderService } from "ngx-ui-loader";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../environments/environment';
import { LoaderService } from './loaderservice.service';
// import { URLSearchParams } from 'url';
@Injectable({
  providedIn: 'root'
})
export class TopgradserviceService implements HttpInterceptor {

  SERVER_URL = environment.SERVER_URL;
  SERVER = environment.SERVER;

  getToken() {
    return localStorage.getItem("token")
  }

getUserDetail() {
  let data = localStorage.getItem("userSDetail");
  if (!data) {
    data = localStorage.getItem("userDetail");
  }
  return data ? JSON.parse(data) : null;
}

  public updateProfileImageData: EventEmitter<any> = new EventEmitter<any>();
  public placementGroupDetails: EventEmitter<any> = new EventEmitter<any>();
  public evntEmitter: EventEmitter<any> = new EventEmitter<any>();
// private loader: NgxUiLoaderService,
  constructor( private httpClient: HttpClient, private route: ActivatedRoute,
    private router: Router, private http: HttpClient, private _snackBar: MatSnackBar, private loaderService:LoaderService) {
    this.getAdmin();
  }

  getQueryParams(params: any): string {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach(key => searchParams.append(key, params[key]));
    return searchParams.toString();
  }

  public updateProfileImageViaFilter(image: any): void {
    this.updateProfileImageData.emit(image)
  }

  public updateData(data: any) {
    this.evntEmitter.emit(data);
  }

intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  const started = Date.now();

  // ✅ URLs to skip loader
  const skipUrls = [
    'employee/get', 'srch', 'placement-group-exist', 'get-plcmnt-grp-dtl',
    'get-wrkflw-new', 'get-cmpny-allcnts', 'student/me', 'check_deactivated_user',
    'srch-comp', 'get-all-cmpns', 'cmpny-fltr', 'email_category/get',
    'srch-stdnt', 'get-all-stdnt', 'stdnt-fltr', 'skills/get'
  ];

  // ✅ Show loader only for relevant requests
  if (!skipUrls.some(url => request.url.includes(url))) {
    this.loaderService.show();
  }

  let ok: any;
  const user = this.getUserDetail();

  // console.log("user", user)
  // ✅ Always clone request with Authorization + admin_id
  let clonedReq = request.clone({
    setHeaders: {
      Authorization: `Bearer ${this.getToken()}`,
      admin_id: user?._id || ''
    }
  });

  // ✅ Add payload only if user is student AND request method supports body
  const methodsWithBody = ['POST', 'PUT', 'PATCH', 'DELETE'];
  if (
    user?.role === 'student' &&
    methodsWithBody.includes(clonedReq.method.toUpperCase()) &&
    clonedReq.body
  ) {
    // Handle FormData separately
    if (clonedReq.body instanceof FormData) {
      const newFormData = new FormData();
      clonedReq.body.forEach((value, key) => newFormData.append(key, value));

      if (user.admin_data != null) {
        const adminValue = typeof user.admin_data === 'string'
          ? user.admin_data
          : JSON.stringify(user.admin_data);
        newFormData.append('admin_data', adminValue);
      }

      clonedReq = clonedReq.clone({ body: newFormData });
    } else if (typeof clonedReq.body === 'object') {
      // JSON-like body
      clonedReq = clonedReq.clone({
        body: {
          ...clonedReq.body,
          ...(user.admin_data != null ? { admin_data: user.admin_data } : {})
        }
      });
    }
  }

  // ✅ Handle the request
  return next.handle(clonedReq).pipe(
    tap({
      next: event => {
        if (event instanceof HttpResponse) ok = 'succeeded';
      },
      error: err => {
        ok = err;
      }
    }),
    finalize(() => {
      this.loaderService.hide();
      const elapsed = Date.now() - started;

      if (ok === 'succeeded') {
        // console.log(`${request.method} "${request.urlWithParams}" succeeded in ${elapsed} ms.`);
      } else if (ok instanceof HttpErrorResponse) {
        if (ok.status === 503) {
          this.router.navigate(['/maintenance']);
        } else if (ok.status === 401) {
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigate(['/login-initial']);
        } else {
          this.handleError(ok);
        }
      } else {
        console.error('Unexpected Error:', ok);
      }
    })
  );
}


  handleError(error: any): string {
    let errorMessage = 'Something went wrong. Please try again.';
    
    if (error.error && error.error.errors) {
      // Handle client-side or server-side validation errors
      if (Array.isArray(error.error.errors.msg)) { // Validation error messages
        if (error.error.errors.msg.length) {
          const ob = error.error.errors.msg[0];
          if (ob.msg === "IS_EMPTY") {
            errorMessage = `${ob.param} is missing`;
          } else {
            errorMessage = "Parameters are missing";
          }
        }
      } else {
        errorMessage = error.error.errors.msg || "An unknown error occurred";
      }
    } else if (error.status === 401) {
      // Handle unauthorized error
      localStorage.clear();
      sessionStorage.clear();
      this.router.navigate(['/']); // Redirect to login or home page
      errorMessage = "Unauthorized access. Please log in again.";
    } else {
      // General error message
      errorMessage = error.message || "An unknown error occurred";
    }
  
    // Log error to console for debugging
    console.error("Error occurred:", error);
  
    return errorMessage;
  }
  

  confirmPassword(obj: any): Observable<any> {
    let API_URL = `${this.SERVER}auth/confirm_password`;
    return this.httpClient.post(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }),

      )

  }

  getUserByEmail(obj: any): Observable<any> {
    let API_URL = `${this.SERVER}auth/get-user-by-email`;
    return this.httpClient.post(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }),

      )

  }


  login(obj: any): Observable<any> {
    let API_URL = `${this.SERVER}auth/login`;
    return this.httpClient.post(API_URL, obj).pipe(
      map((res: any) => {
        console.log("res", res)
        return res; // You can transform the response if needed here
      }),
      // catchError((error: any) => {
      //   console.error("Login API error:", error); // Log full error details
      //   console.error("Full error response:", error?.error); // Log server's response if present
      //   return throwError(() => error); // Re-throw the error for handling in the component
      // })
    );
  }
  

  error(error: HttpErrorResponse) {
    let errorMessage;
    let obj = {};
    if (error.error instanceof ErrorEvent) {
      obj = {
        message: error.error.message,
        status: error.status,
      }
      errorMessage = obj;
    } else {
      obj = {
        message: error.error.message,
        status: error.status,
      }
      errorMessage = obj;
    }
    return throwError(errorMessage);
  }



  getAdmin() {
    const data = localStorage.getItem('admin_data')
    return data;
  }

  industryList(data: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/industry/list/${data.offset}-${data.limit}?type=${data.type}&search=${data.search}`;

    return this.httpClient.get(API_URL, data)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }
  graduateIndustryList(data: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/industry/list/${data.offset}-${data.limit}?type=graduate`;

    return this.httpClient.get(API_URL, data)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }

  addIndustry(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/add/edit/industry`;

    return this.httpClient.post(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }))
  }


  addEditIndustryDetail(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/industry/details/${obj.industry_id}`;

    return this.httpClient.get(API_URL)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }

  industryDelete(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/delete/industry`;

    return this.httpClient.put(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }

  skillsList(evt:any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/skills/list?limit=${evt.limit}&offset=${evt.offset}&search=${evt.search}`;

    return this.httpClient.get(API_URL)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }
  // 24-aug-2022 starts skill-------
  addSkillData(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/addSkill`;

    return this.httpClient.post(API_URL, obj).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  viewSkillData(obj:any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/skillDetail `;

    return this.httpClient.post(API_URL, obj).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  editSkillData(obj:any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/editSkill`;

    return this.httpClient.post(API_URL, obj).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  deleteSkillData(obj:any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/deleteSkill `;

    return this.httpClient.post(API_URL, obj).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }
  //  24-aug-2022 ends skill----------------


  gradlist(data: any): Observable<any> {
    const query = this.getQueryParams(data)
    let API_URL = `${this.SERVER_URL}/admin/get/user/list/${data.offset}-${data.limit}?${query}`;

    // let API_URL = `${this.SERVER_URL}/admin/get/user/list/${data.offset}-${data.limit}?search=${data.search}&role=${data.role}&work_preference=${data.work_preference}&availability=${data.availability}&work_right=${data.work_right}&location=${data.location}`;
    // if (data.work_preference) {
    //   API_URL = `${this.SERVER_URL}/admin/get/user/list/${data.offset}-${data.limit}?&filter=${data.filter}&search=${data.search}&role=${data.role}&work_preference=${data.work_preference}`;
    // }
    // else if (data.availability) {
    //   API_URL = `${this.SERVER_URL}/admin/get/user/list/${data.offset}-${data.limit}?&filter=${data.filter}&search=${data.search}&role=${data.role}&availability=${data.availability}`;
    // }
    // else if (data.work_right) {
    //   API_URL = `${this.SERVER_URL}/admin/get/user/list/${data.offset}-${data.limit}?&filter=${data.filter}&search=${data.search}&role=${data.role}&work_right=${data.work_right}`;
    // }
    // else if (data.location) {
    //   API_URL = `${this.SERVER_URL}/admin/get/user/list/${data.offset}-${data.limit}?&filter=${data.filter}&search=${data.search}&role=${data.role}&location=${data.location}`;
    // }
    //  if (data.filter == 'lifetime') {
    //   API_URL = `${this.SERVER_URL}/admin/get/user/list/${data.offset}-${data.limit}?search=${data.search}&role=${data.role}`
    // }
    // else if (data.filter) {
    //   API_URL = `${this.SERVER_URL}/admin/get/user/list/${data.offset}-${data.limit}?search=${data.search}&role=${data.role}&filter=${data.filter}`
    // }


    return this.httpClient.get(API_URL, data)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }



  // getQueryParams(obj: any): string {
  //   const searchParams = new URLSearchParams();
  //   const params = obj;
  //   Object.keys(params).forEach(key => searchParams.append(key, params[key]));
  //   return searchParams.toString()
  // } 
  getGradDropDown(): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/dropdown/options/graduate_work_rights`;

    return this.httpClient.get(API_URL)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }

  emplist(data: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/user/list/${data.offset}-${data.limit}?role=${data.role}&search=${data.search}&company_name=${data.company_name}`;
    if (data.filter == 'lifetime') {
      API_URL = `${this.SERVER_URL}/admin/get/user/list/${data.offset}-${data.limit}?search=${data.search}&role=${data.role}`
    }
    else if (data.filter) {
      API_URL = `${this.SERVER_URL}/admin/get/user/list/${data.offset}-${data.limit}?search=${data.search}&role=${data.role}&filter=${data.filter}`
    }
    return this.httpClient.get(API_URL, data)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }

  termslist(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/terms/or/privacy/${obj.offset}-${obj.limit}/${obj.type}`;

    return this.httpClient.get(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }

  termsheading(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/terms/privacy/detail?content_id=${obj.content_id}`;

    return this.httpClient.get(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }

  posttermheading(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/edit/terms/privacy`;

    return this.httpClient.put(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }

  addtermheading(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/add/edit/terms/and/privacy`;

    return this.httpClient.post(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }

  deleteterm(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/delete/heading/terms/privacy`;

    return this.httpClient.put(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }

  getsubheading(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/sub-heading/detail/terms/privacy?content_id=${obj.content_id}&sub_heading_id=${obj.sub_heading_id}`;

    return this.httpClient.get(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }

  addtermsubheading(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/add/sub-heading/terms/privacy `;

    return this.httpClient.put(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }

  deletetermsubheading(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/delete/sub-heading/terms/privacy`;

    return this.httpClient.put(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }

  sendresetmail(obj: any): Observable<any> {
    let API_URL = `${this.SERVER}auth/forgot/password`;

    return this.httpClient.post(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }))
  }

  resetpassword(obj: any): Observable<any> {
    let API_URL = `${this.SERVER}updt-pwd-admin`;

    return this.httpClient.post(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }))
  }


  ResetchangePassword(obj: any): Observable<any> {
    let API_URL = `${this.SERVER}change-password`;

    return this.httpClient.post(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }))
  }

  uploadmedia1(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/upload/homepage/media`;
    return this.httpClient.post(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }))
  }

  headersection(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/edit/homepage/content`;

    return this.httpClient.put(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }))
  }

  homecontent(): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/homepage/content`;

    return this.httpClient.get(API_URL)
      .pipe(
        map(res => {
          return res
        }))
  }


  showMessage(object: any) {
    this._snackBar.open(object.message, object.action ? object.action : "CLOSE", {
      duration: 3000,
      horizontalPosition: "center",
      verticalPosition: "bottom",
    })

  }

  getAboutUsData() {
    let API_URL = `${this.SERVER_URL}/admin/get/about/us/content`;

    return this.httpClient.get(API_URL)
      .pipe(
        map(res => {
          return res
        }))
  }

  postAboutUsdata(data: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/edit/about/us/content`;

    return this.httpClient.put(API_URL, data)
      .pipe(
        map(res => {
          return res
        }))
  }
  postHomePageContent(data: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/edit/homepage/content`;

    return this.httpClient.put(API_URL, data)
      .pipe(
        map(res => {
          return res
        }))
  }

  profile(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/edit/profile`;

    return this.httpClient.put(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }))
  }

  contactList(evt:any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/support/list/${evt.offset}-${evt.limit}?type=${evt.type}&search=${evt.search}`;
    return this.httpClient.get(API_URL)
      .pipe(
        map(res => {
          return res
        }))
  }


  contactDetail(data: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/support/details/${data.support_id}`;

    return this.httpClient.get(API_URL)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }

  contactDelete(data: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/delete/support/query/${data.support_id}`;

    return this.httpClient.delete(API_URL, data)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }

  contactReply(data: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/reply/to/support/query`;

    return this.httpClient.put(API_URL, data)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }

  changepwd(data: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/change/password`;

    return this.httpClient.put(API_URL, data)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }


  faqCategories(data: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/all/faq/categories?user_type=${data.user_type}`;

    return this.httpClient.get(API_URL, data)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }

  faqList(evt:any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/faq/list/${evt.offset}-${evt.limit}?user_type=${evt.user_type}&search=${evt.search}`;

    return this.httpClient.get(API_URL)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }

  faqDetail(data: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/faq/details/${data.faq_id}`;

    return this.httpClient.get(API_URL)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }

  addEditFaq(data: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/add/edit/faq`;

    return this.httpClient.post(API_URL, data)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }
  faqDelete(data: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/delete/faq/${data.faq_id}`;

    return this.httpClient.delete(API_URL, data)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }


  postRecruitmentContent(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/edit/recruitement/solution`;

    return this.httpClient.put(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }))
  }

  recruitmentcontent(): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/recruitment-solutions?content_id=6214a49299814ab6e4f4338e`;

    return this.httpClient.get(API_URL)
      .pipe(
        map(res => {
          return res
        }))
  }

  uploadbenefitmedia(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/upload/media`;

    return this.httpClient.post(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }))
  }

  postResumeBuilderContent(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/update/resume/builder`;

    return this.httpClient.put(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }))
  }


  resumebuildercontent(): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/resume/builders?content_id=621c4bbd6f7babe92ccc9618`;

    return this.httpClient.get(API_URL)
      .pipe(
        map(res => {
          return res
        }))
  }

  graduateVerificationcontent(): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/graduate/endoresement`;

    return this.httpClient.get(API_URL)
      .pipe(
        map(res => {
          return res
        }))
  }

  postGraduateVerificationContent(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/update/graduate/endoresement`;
    return this.httpClient.put(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }))
  }

  poststepsArrayContent(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/update/graduate/endoresement/section-4`;
    return this.httpClient.put(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }
        )
      )
  }

  getEmployerDetail(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/user/detail/${obj.user_id}`;

    return this.httpClient.get(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }

  EditEmployerDetail(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/edit/user/detail`;

    return this.httpClient.put(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }

  getGraduateHowItWorks(data: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/graduate/how-it-works?content_id=621350cc3352bd34948f0634`;

    return this.httpClient.get(API_URL, data)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }
  editGraduateHowItWorks(data: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/edit/graduate/how-it-works`;

    return this.httpClient.put(API_URL, data)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }
  uploadEditGraduateHowItsWorks(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/upload/media`;

    return this.httpClient.post(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }))
  }
  editGraduateHowItWorksDelete(data: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/delete/media/graduateHowItWorks`;

    return this.httpClient.put(API_URL, data)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }

  getEmpHowItWorks(data: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/employer/how-it-works?content_id=62131e0b9a4fb6871a828022`;

    return this.httpClient.get(API_URL, data)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }

  editEmpHowItWorks(data: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/edit/employer/how-it-works`;

    return this.httpClient.put(API_URL, data)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }


  editEmpHowItWorksDelete(data: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/delete/media/employerHowItWorks`;

    return this.httpClient.put(API_URL, data)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }

  deleteuser(data: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/delete/user/${data.role}/${data.user_id}`;

    return this.httpClient.delete(API_URL, data)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }

  videointrocontent(): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/video/intro`;

    return this.httpClient.get(API_URL)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }

  postVideoIntroContent(data: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/edit/video/intro`;

    return this.httpClient.put(API_URL, data)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }

  jobManagementList(evt:any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/employer/job/post/list?limit=${evt.limit}&offset=${evt.offset}&search=${evt.search}&work_type=${evt.work_type}`;
    if (evt.filter == 'lifetime') {
      API_URL = `${this.SERVER_URL}/admin/get/employer/job/post/list?limit=${evt.limit}&offset=${evt.offset}&search=${evt.search}`;
    }
    else if (evt.filter) {
      API_URL = `${this.SERVER_URL}/admin/get/employer/job/post/list?limit=${evt.limit}&offset=${evt.offset}&search=${evt.search}&filter=${evt.filter}`;
    }

    return this.httpClient.get(API_URL)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }

  jobManagementDetail(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/employer/job/detail?employer_job_id=${obj.employer_job_id}`;

    return this.httpClient.get(API_URL)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }
  jobManagementUpdate(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/update/employer/job/post/status`;

    return this.httpClient.patch(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }

  jobManagementDelete(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/delete/employer/job/post`;

    return this.httpClient.put(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }


  addArticleContent(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/add/article`;

    return this.httpClient.post(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }

  getarticleList(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/article/list?limit=${obj.limit}&offset=${obj.offset}&search=${obj.search}&type=article`;

    return this.httpClient.get(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }

  getvideoList(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/article/list?limit=${obj.limit}&offset=${obj.offset}&search=${obj.search}&type=${obj.type}`;

    return this.httpClient.get(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }


  getArticleContent(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/view/article?article_id=${obj.article_id}`;

    return this.httpClient.get(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }

  editArticleContent(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/edit/article`;

    return this.httpClient.put(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }

  delArticle(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/delete/article/${obj.article_id}`;

    return this.httpClient.delete(API_URL)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }

  ApplicationReports(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/report/applications?offset=${obj.offset}&limit=${obj.limit}`;

    return this.httpClient.get(API_URL)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }

  ReportsDetail(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/report/applications?id=${obj.id}`;

    return this.httpClient.get(API_URL)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }

  ReportReply(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/update/report`;

    return this.httpClient.patch(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }

  ReportDelete(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/delete/report/${obj.id}`;

    return this.httpClient.delete(API_URL)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }

  BlockGraduateProfile(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/edit/user/detail`;

    return this.httpClient.put(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }

  // 06-july-2022
  getInterviewListing(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/interviews?limit=${obj.limit}&offset=${obj.offset}&search=${obj.search}&type=${obj.type}&interview_method=${obj.interview_method}`;
    if (obj.filter == 'lifetime') {
      API_URL = `${this.SERVER_URL}/admin/get/interviews?limit=${obj.limit}&offset=${obj.offset}&search=${obj.search}&type=${obj.type}`;
    }
    else if (obj.filter) {
      API_URL = `${this.SERVER_URL}/admin/get/interviews?limit=${obj.limit}&offset=${obj.offset}&search=${obj.search}&type=${obj.type}&filter=${obj.filter}`;
    }
    return this.httpClient.get(API_URL).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )

  }



  detailOfInterview(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/interviews?id=${obj.id}`;

    return this.httpClient.get(API_URL).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )

  }

  // 07-july-2022-- paymenet management---

  getPaymentdata(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/payments?limit=${obj.limit}&offset=${obj.offset}&search=${obj.search}`;

    return this.httpClient.get(API_URL).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )

  }

  detailOfPayment(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/payments?id=${obj.id}`;

    return this.httpClient.get(API_URL).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )

  }


  // 07-july-2022 -- offer submission--

  getOfferSubmissiondata(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/interviews?limit=${obj.limit}&offset=${obj.offset}&search=${obj.search}&type=${obj.type}&offered_status=${obj.offered_status}`;
    if (obj.filter == 'lifetime') {
      API_URL = `${this.SERVER_URL}/admin/get/interviews?limit=${obj.limit}&offset=${obj.offset}&search=${obj.search}&type=${obj.type}`;
    }
    else if (obj.filter) {
      API_URL = `${this.SERVER_URL}/admin/get/interviews?limit=${obj.limit}&offset=${obj.offset}&search=${obj.search}&type=${obj.type}&filter=${obj.filter}`;
    }

    return this.httpClient.get(API_URL).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )

  }

  detailOfOfferSubmission(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/interviews?id=${obj.id}`;

    return this.httpClient.get(API_URL).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )

  }

  // 07-july-2022----sub-admin

  addSubAdmin(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/create/sub/admin`;

    return this.httpClient.post(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }))
  }

  getSubAdminData(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/sub/admins?limit=${obj.limit}&offset=${obj.offset}&search=${obj.search}&sortBy=${obj.sortBy}&sort=${obj.sort}`;

    return this.httpClient.get(API_URL).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )

  }

  detailSubAdmin(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/sub/admin/${obj.id}`;

    return this.httpClient.get(API_URL).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )

  }

  deleteSubAdmin(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/delete/sub/admin/${obj.id}`;

    return this.httpClient.delete(API_URL).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  updateSubAdmin(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/update/sub/admin`;

    return this.httpClient.patch(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }))
  }

  sendCredentialsSubAdmin(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/send/credentials?id=${obj.id}`;

    return this.httpClient.get(API_URL).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )

  }

  getAccessPrivilegeSubAdmin(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/access/privileges/${obj.id}`;

    return this.httpClient.get(API_URL, obj).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )

  }
  updtaeAccessPrivilegeSubAdmin(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/update/access/privileges`;

    return this.httpClient.patch(API_URL, obj).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  // verification submission-----------------

  getVerificationSubmission(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/verification/submissions?limit=${obj.limit}&offset=${obj.offset}&search=${obj.search}`;

    return this.httpClient.get(API_URL).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  deleteVerificationSubmission(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/delete/verification/submissions/${obj.submission_id}`;

    return this.httpClient.delete(API_URL).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )

  }

  detailVerificationSubmission(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/verification_submission/details/${obj.submission_id}`;

    return this.httpClient.get(API_URL).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )

  }

  toggleVerificationSubmission(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/update/verification/status`;

    return this.httpClient.patch(API_URL, obj).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )

  }

  // notifications --- 20-july-2022-----

  getNotification(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/AllNotifications?limit=${obj.limit}&offset=${obj.offset}`;

    return this.httpClient.get(API_URL).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )

  }

  updateNotification(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/update/updateAdminNotification`

    return this.httpClient.post(API_URL, obj).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )

  }

  coutnNotification(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/notification/count`

    return this.httpClient.get(API_URL, obj).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }


  // send email-------------------------

  sendEmailUserManagement(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/send/emails`

    return this.httpClient.post(API_URL, obj).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )

  }
  // 26-july-2022-- job managment status
  statusJobManagement(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/update/employer/job/post/status`;

    return this.httpClient.patch(API_URL, obj).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  // 28-july-2022--- Dashboard---------

  getCountDashboard(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/dashbard`;

    return this.httpClient.get(API_URL, obj).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  loggedInDashboard(obj: any) {
    let API_URL = `${this.SERVER_URL}/admin/get/LoginEmployers?role=${obj.role}`;

    return this.httpClient.get(API_URL, obj).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  getRegistrationByIndustry(obj: any) {
    let API_URL = `${this.SERVER_URL}/admin/get/RegistrationByIndustry?role=${obj.role}&filter=${obj.filter}`;

    return this.httpClient.get(API_URL).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }


  getcountJobPosting(obj: any) {
    let API_URL = `${this.SERVER_URL}/admin/get/jobPostings/Count`;

    return this.httpClient.get(API_URL, obj).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  getTopEmpSpenders(obj: any) {
    let API_URL = `${this.SERVER_URL}/admin/get/TopEmpSpenders?limit=${obj.limit}&offset=${obj.offset}&search=${obj.search}`;

    return this.httpClient.get(API_URL, obj).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }


  getActiveInactiveGraduate(obj: any) {
    let API_URL = `${this.SERVER_URL}/admin/get/ActiveInActiveGraduates`;

    return this.httpClient.get(API_URL, obj).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  getLookingForWorkGraduate(obj: any) {
    let API_URL = `${this.SERVER_URL}/admin/get/LookingWorkGraduatesCount`;

    return this.httpClient.get(API_URL, obj).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  getRegisterByLocationGraduateOrEmp(obj: any) {
    let API_URL = `${this.SERVER_URL}/admin/get/RegistrationByLocation?role=${obj.role}&filter=${obj.filter}&location=${obj.location}`;

    return this.httpClient.get(API_URL, obj).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  getJobsPostedByIndustry(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/JobsPostedByIndustry?filter=${obj.filter}`

    return this.httpClient.get(API_URL, obj).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }
  getIntershipJobPosted(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/InternshipOrJobsPosted?filter=${obj.filter}`;

    return this.httpClient.get(API_URL, obj).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  getQualificationsProfileOfGraduates(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/noOFGraduatesByQualification?filter=${obj.filter}`;

    return this.httpClient.get(API_URL, obj).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }
  getJobsPostedByLocation(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/JobsPostedByLocation?filter=${obj.filter}&location=${obj.location}`;

    return this.httpClient.get(API_URL, obj).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  getScheduleOrCompletedInterviews(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/scheduleOrCompletedInterviews?filter=${obj.filter}`;
    return this.httpClient.get(API_URL, obj).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }
  getJobOrInternshipOffers(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/JobOrInternshipOffers?filter=${obj.filter}`;
    return this.httpClient.get(API_URL, obj).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  getNoOfGraduatesByFieldOfStudy(obj:any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/GradsByFieldOfStudy?industry_id=${obj.industry_id}`;
    return this.httpClient.get(API_URL, obj).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  getGradsIndustriesList(obj:any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/GradsIndustriesList`;
    return this.httpClient.get(API_URL, obj).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  jobMngtEmpApllicantsListById(data: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/graduates/by/employer?id=${data.id}`;
    return this.httpClient.get(API_URL).pipe(
      map((res: any) => {
        return res
      }),
      catchError(this.error)
    )
  }
  graduatesApllicantsList(data: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/getGraduateApplications?limit=${data.limit}&offset=${data.offset}`;
    if (data.filter == 'lifetime') {
      API_URL = `${this.SERVER_URL}/admin/getGraduateApplications?limit=${data.limit}&offset=${data.offset}`;
    }
    else if (data.filter) {
      API_URL = `${this.SERVER_URL}/admin/getGraduateApplications?limit=${data.limit}&offset=${data.offset}&filter=${data.filter}`;
    }
    return this.httpClient.get(API_URL).pipe(
      map((res: any) => {
        return res
      }),
      catchError(this.error)
    )
  }
  detailGraduateApplicantsById(data: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/graduates/by/graduate?id=${data.id}`;
    return this.httpClient.get(API_URL).pipe(
      map((res: any) => {
        return res
      }),
      catchError(this.error)
    )
  }

  recruitmentListAPI(evt: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/recruitments?limit=${evt.limit}&offset=${evt.offset}&search=${evt.search}`;
    return this.httpClient.get(API_URL).pipe(
      map(res => {
        return res
      })
    )
  }
  recruitmentDetailAPI(evt: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/recruitments?id=${evt.id}`;
    return this.httpClient.get(API_URL).pipe(
      map(res => {
        return res
      })
    )
  }
  recruitmentDeleteAPI(evt: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/delete/recruitments`;
    return this.httpClient.post(API_URL, evt).pipe(
      map(res => {
        return res
      })
    )
  }
  recruitmentReplyAPI(evt: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/edit/recruitments `;
    return this.httpClient.post(API_URL, evt).pipe(
      map(res => {
        return res
      })
    )
  }
  internshipInquiryAPI(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/interships?offset=${obj.offset}&limit=${obj.limit}&search=${obj.search}`

    return this.httpClient.post(API_URL, obj).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )

  }
  internshipInquiryDetailsAPI(obj: any): Observable<any> {
    let API_URL = `${this.SERVER_URL}/admin/get/interships?id=${obj.id}`

    return this.httpClient.post(API_URL, obj).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )

  }

  getIndustry(params:any): Observable<any> {
    const API_URL = `${this.SERVER_URL}users/new/industries?${params}`
    return this.http.get(API_URL).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  checkEmailExists(email: string): Observable<any> {
    const API_URL = `${this.SERVER_URL}check/email/exists?email=${email}`
    return this.httpClient.get(API_URL)
      .pipe(
        map(res => {
          return res
        }),
        catchError(this.error)
      )
  }

  createEmployer(employerDetail:any) {
    const API_URL = `${this.SERVER_URL}admin/register/employer`
    return this.http.post(API_URL, employerDetail)
      .pipe(
        map(res => {
          return res;
        }),
        catchError(this.error)
      )
  }

  // job post creation methods

  getSkillDetailsFromArrayOfIds(data: any) {
    const API_URL = `${this.SERVER_URL}users/get/skills/by/ids`
    return this.http.post(API_URL, data)
      .pipe(
        map(res => {
          return res
        })
      )
  }

  gettokenskill(): Observable<any> {
    const API_URL = `${this.SERVER_URL}users/get/skill/api/token`
    return this.http.get(API_URL)
      .pipe(
        map(res => {
          return res;
        }),
      );
  }

  getJobTitleSuggestions(keyword: any): Observable<any> {
    const API_URL = `${this.SERVER_URL}users/get/job/titles?search=${keyword}`
    return this.http.get(API_URL)
      .pipe(
        map(res => {
          return res;
        }),
      );
  }

  getProfile(employerId:any): Observable<any> {
    const API_URL = `${this.SERVER_URL}admin/profile`
    return this.http.post(API_URL, { employer_id: employerId })
      .pipe(
        map(res => {
          return res
        })
      )
  }

  getSkillList(keyword: any): Observable<any> {
    const API_URL = `${this.SERVER_URL}users/get/skills`
    return this.http.post(API_URL, keyword)
      .pipe(
        map(res => {
          return res
        })
      )
  }

  converttoAd(data: any): Observable<any> {
    const API_URL = `${this.SERVER_URL}users/convert/shortlist/to/job?shortlist_id=${data.shortlist_id}`
    return this.http.get(API_URL)
      .pipe(
        map(res => {
          return res;
        }),
      );
  }

  employerJobPost(data: any): Observable<any> {
    const API_URL = `${this.SERVER_URL}admin/employer/job/post`
    return this.http.post(API_URL, data)
      .pipe(
        map(res => {
          return res
        })
      )
  }

  draftdetails(data: any): Observable<any> {
    const API_URL = `${this.SERVER_URL}users/get/employer/job/detail/${data.employer_job_id}`
    return this.http.get(API_URL)
      .pipe(
        map(res => {
          return res;
        }),
      );
  }

  // end of job post creation methods

  getCounselor(obj:any) {
    const API_URL = `${this.SERVER_URL}admin/fetch/counselor`
    return this.http.post(API_URL, obj)
      .pipe(
        map(res => {
          return res
        })
      )
  }

  createCounselor(counselorDetail:any) {
    const API_URL = `${this.SERVER_URL}admin/add/edit/counselor`
    return this.http.post(API_URL, counselorDetail)
      .pipe(
        map(res => {
          return res;
        }),
        catchError(this.error)
      )
  }

  // Begin:: Placement Groups

  getPlacementGroups(data: any): Observable<any> {
    const API_URL = `${this.SERVER}get-plcmnt-grp`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  getPlacementGroupList(data: any): Observable<any> {
    const API_URL = `${this.SERVER}get-plcmnt-grp-list`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

   getPlacementGroupForCompanyList(data: any): Observable<any> {
    const API_URL = `${this.SERVER}get-plcmnt-grp-list-for-company`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }


  getPlacementGroupsCount(data: any): Observable<any> {
    const API_URL = `${this.SERVER}projects/placement-group-count`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }


  getPublishPlacementGroups(data: any): Observable<any> {
    const API_URL = `${this.SERVER}get-published-plcmnt-grp`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  getPublishProjectPlacementGroups(data: any): Observable<any> {
    const API_URL = `${this.SERVER}projects/placement-groups`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }



  getPlacementCategories(data: any): Observable<any> {
    const API_URL = `${this.SERVER}get-plcmnt-ctgry`
    return this.http.get(API_URL).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  getPlacementIndustries(data: any): Observable<any> {
    const API_URL = `${this.SERVER}get-plcmnt-indsty`
    return this.http.get(API_URL).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  getStaffMembers(data: any): Observable<any> {
    const API_URL = `${this.SERVER}get-wrkflw-stff`
    return this.http.get(API_URL, data)
  }


  getStaffMemberByPlacementId(data: any): Observable<any> {
    const API_URL = `${this.SERVER}get-plcmnt-grp-staff`
    return this.http.post(API_URL, data)
  }

  checkPGCode(data: any): Observable<any> {
    const API_URL = `${this.SERVER}placement-group-exist`
    return this.http.post(API_URL, data)
  }

  getPlacementGroupDetails(data: any): Observable<any> {
    const API_URL = `${this.SERVER}get-plcmnt-grp-dtl`
    return this.http.post(API_URL, data)
  }

  getProjectPlacementGroupDetails(data: any): Observable<any> {
    const API_URL = `${this.SERVER}project_allocation/placement-group-detail-project`
    return this.http.post(API_URL, data)
  }

  getPlacementGroupProjectDetails(data: any): Observable<any> {
    const API_URL = `${this.SERVER}projects/pg-projects`
    return this.http.post(API_URL, data)
  }


  createPlacementGroup(data: any): Observable<any> {
    const API_URL = `${this.SERVER}add-plcmnt-grp`
    return this.http.post(API_URL, data)
  }

  editPlacementGroup(data: any): Observable<any> {
    const API_URL = `${this.SERVER}edt-plcmnt-grp`
    return this.http.post(API_URL, data)
  }

  searchPlacementGroup(data: any): Observable<any> {
    const API_URL = `${this.SERVER}srch-plcmnt-grp`
    return this.http.post(API_URL, data)
  }

  searchEligileStudents(data: any): Observable<any> {
    const API_URL = `${this.SERVER}srch-stdnt`
    return this.http.post(API_URL, data)
  }

  studentFilterOptions() {
    const API_URL = `${this.SERVER}stdnt-fltr-optns`
    return this.http.get(API_URL).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  vacancyFilterOptions() {
    const API_URL = `${this.SERVER}vcncy-fltr-optns`
    return this.http.get(API_URL).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  companyFilterOptions() {
    const API_URL = `${this.SERVER}cmpny-fltr-optns`
    return this.http.get(API_URL).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  getEligibleStudents(data: any): Observable<any> {
    const API_URL = `${this.SERVER}get-all-stdnt`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  getProjectEligibleStudents(data: any): Observable<any> {
    const API_URL = `${this.SERVER}project_allocation/get-all-stdnt-for-project`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  editStudent(data: any) {
    let user = this.getUserDetail();
    data['assigned_by_staff_id'] = user._id;
    const API_URL = `${this.SERVER}edt-plcmnt-stdnt`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }


  editStudentCheckBox(data: any) {
    const API_URL = `${this.SERVER}student/update-student-details`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

 editStudentStatus(data: any) {
    const API_URL = `${this.SERVER}updt-stdnt-allctn`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  projectEditStudentStatus(data: any) {
    const API_URL = `${this.SERVER}project_allocation/update-project-allocation`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  exportStudents(data: any) {
    const API_URL = `${this.SERVER}stdnt-exprt`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  exportPlacementGroup(data: any) {
    const API_URL = `${this.SERVER}placement-group-exprt`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  exportPartners(data: any) {
    const API_URL = `${this.SERVER}cmpns-exprt`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  addNewStudentsViaExcel(data: any) {
    const API_URL = `${this.SERVER}upld-stdnt`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  approveUploadedStudents(data: any) {
    const API_URL = `${this.SERVER}apprv-stdnt`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  approveUploadedCompanies(data: any) {
    const API_URL = `${this.SERVER}apprv-cmpns`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }
  
  approveUploadedBloacklistCompanies(data: any) {
    const API_URL = `${this.SERVER}update-blcklist-upld-cmpns`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  

  addNewIndustryPartnersViaExcel(data: any) {
    const API_URL = `${this.SERVER}upld-prtnrs`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }


  uploadblacklistCompnayViaExcel(data: any) {
    const API_URL = `${this.SERVER}upload-blacklisted-companies`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }



  getAllUploadedStudents(data: any): Observable<any> {
    const API_URL = `${this.SERVER}get-stdnt-upld`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  downloadStudentTemplate() {
    window.open(this.SERVER + "Student_Importer.csv");
  }

  downloadPartnerTemplate() {
    window.open(this.SERVER + "Company_Importer.csv");
  }
  downloadBlackListTemplate() {
    window.open(this.SERVER + "Blacklist_Company_Importer.csv");
  }

  getAllUploadedPartners(data: any): Observable<any> {
    const API_URL = `${this.SERVER}get-cmpns-upld`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  getBlcklistUpldCmpns(data: any): Observable<any> {
    const API_URL = `${this.SERVER}get-blcklist-upld-cmpns`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }


 
  updateCompaniesStatus(data: any): Observable<any> {
    const API_URL = `${this.SERVER}mdty-cmpny-plcmnt`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  getIndustryPartners(data: any): Observable<any> {
    const API_URL = `${this.SERVER}get-all-cmpns`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  updateComapniesStatus(data: any): Observable<any> {
    const API_URL = `${this.SERVER}updt-cmpns`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  editEligibleStudent(data: any): Observable<any> {
    let user = this.getUserDetail();
    data['assigned_by_staff_id'] = user._id;
    const API_URL = `${this.SERVER}edt-plcmnt-stdnt`
    return this.http.post(API_URL, data)
  }

  searchIndustryPartners(data: any): Observable<any> {
    const API_URL = `${this.SERVER}srch-indsty`
    return this.http.post(API_URL, data)
  }

  getCompletionCriteria(data: any): Observable<any> {
    const API_URL = `${this.SERVER}get-cmpltn-crtr`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  getUnlockTaskOn(data: any): Observable<any> {
    const API_URL = `${this.SERVER}get-ulck-tsk`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  getAdditionalCriteria(data: any): Observable<any> {
    const API_URL = `${this.SERVER}get-addtnl-crtr`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  getForm(data: any): Observable<any> {
    const API_URL = `${this.SERVER}get-frm`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  getAllTask(data: any): Observable<any> {
    const API_URL = `${this.SERVER}get-al-tsks`
    return this.http.post(API_URL, data)
      .pipe(
        map(res => {
          return res;
        }),
        catchError(this.error)
      )
  }

  getPlacementTypes(data: any): Observable<any> {
    const API_URL = `${this.SERVER}get-wrkflw-typ`
    return this.http.post(API_URL, data)
      .pipe(
        map(res => {
          return res;
        }),
        catchError(this.error)
      )
  }

  getAllWorkflowTypes(data: any): Observable<any> {
  const API_URL = `${this.SERVER}get-all-wrkflw-typ`;
  return this.http.get(API_URL, { params: data })
    .pipe(
      map(res => res),
      catchError(this.error)
    );
}

  createTask(data: any): Observable<any> {
    const API_URL = `${this.SERVER}ad-tsk`
    return this.http.post(API_URL, data);
  }

  editTask(data: any): Observable<any> {
    const API_URL = `${this.SERVER}edt-tsk`
    return this.http.post(API_URL, data);
  }

  duplicateTask(data: any): Observable<any> {
    const API_URL = `${this.SERVER}dplct-tsk`
    return this.http.post(API_URL, data);
  }

  deleteTask(data: any): Observable<any> {
    const API_URL = `${this.SERVER}dlt-tsk`
    return this.http.post(API_URL, data);
  }

  getTaskDetail(data: any): Observable<any> {
    const API_URL = `${this.SERVER}tsk-dtl`
    return this.http.post(API_URL, data)
      .pipe(
        map(res => {
          return res;
        }),
        catchError(this.error)
      )
  }

  getEmailTemplate(data: any): Observable<any> {
    const API_URL = `${this.SERVER}get-eml-tmplts`
    return this.http.post(API_URL, {})
      .pipe(
        map(res => {
          return res;
        }),
        catchError(this.error)
      )
  }

  addPlacementType(data: any): Observable<any> {
    const API_URL = `${this.SERVER}ad-wrkflw-typ`
    return this.http.post(API_URL, data);
  }



  renamePlacementType(data: any): Observable<any> {
    const API_URL = `${this.SERVER}edt-wrkflw-typ`
    return this.http.post(API_URL, data);
  }

  getWorkflowTask(data: any): Observable<any> {
    const API_URL = `${this.SERVER}get-wrkflw-tsk`
    return this.http.post(API_URL, data)
      .pipe(
        map(res => {
          return res;
        }),
        catchError(this.error)
      )
  }

  duplicateWorkFlow(data: any): Observable<any> {
    let API_URL = `${this.SERVER}dplct-wrkflw`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  addNewStep(data: any): Observable<any> {
    const API_URL = `${this.SERVER}ad-stps`
    return this.http.post(API_URL, data);
  }

  filterCompanies(data: any): Observable<any> {
    const API_URL = `${this.SERVER}cmpny-fltr`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(error=>{
        return error
      })
    )
  }

  getCompaniesList(data: any): Observable<any> {
    const API_URL = `${this.SERVER}get-all-cmpns`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(error => 
      {
        return error
      }
      )
      // catchError(this.error)
    )
  }



  getPendingCompaniesList(data: any): Observable<any> {
    const API_URL = `${this.SERVER}get-pending-cmpns`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(error => 
      {
        return error
      }
      )
      // catchError(this.error)
    )
  }


  //End:: Placement Groups

  // email template api methods

  getEmailTemplatePlaceholders(): Observable<any> {
    const API_URL = `${this.SERVER}email_placeholder/get`
    return this.http.post(API_URL, {})
      .pipe(
        map(res => {
          return res;
        }),
        catchError(this.error)
      )
  }

  deleteTemplates(payload:any): Observable<any> {
    const API_URL = `${this.SERVER}email_template/delete`
    return this.http.post(API_URL, payload)
      .pipe(
        map(res => {
          return res;
        }),
        catchError(this.error)
      )
  }

  duplicateTemplates(payload:any): Observable<any> {
    const API_URL = `${this.SERVER}email_template/copy`
    return this.http.post(API_URL, payload)
      .pipe(
        map(res => {
          return res;
        }),
        catchError(this.error)
      )
  }

  getEmailTemplateCategories(): Observable<any> {
    const API_URL = `${this.SERVER}email_category/get`
    return this.http.post(API_URL, {})
      .pipe(
        map(res => {
          return res;
        }),
      );
  }

  getEmailTemplateByCategoryId(data: any) {
    const API_URL = `${this.SERVER}get-eml-tmplts`
    return this.http.post(API_URL, data)
      .pipe(
        map(res => {
          return res;
        }),
      );
  }

  sendEmail(data: any) {
    let API_URL = `${this.SERVER}send-email`;
    if (data && data.type === 'vacancy') {
      API_URL = `${this.SERVER}send-vacancy-email`;
    } else if (data && data.type === 'company_student') {
      API_URL = `${this.SERVER}send-email-placement`;
      delete data.type;
    }
    return this.http.post(API_URL, data)
      .pipe(
        map(res => {
          return res;
        }),
      );
  }

  sendReminderEmail(data: any) {
    const API_URL = `${this.SERVER}snd-tsk-rmdr`
    return this.http.post(API_URL, data)
      .pipe(
        map(res => {
          return res;
        }),
      );
  }

  getAllEmailTemplate(payload:any): Observable<any> {
    const API_URL = `${this.SERVER}email_template/get`
    return this.http.post(API_URL, payload)
      .pipe(
        map(res => {
          return res;
        }),
      );
  }

  getEmailTemplateById(payload:any): Observable<any> {
    const API_URL = `${this.SERVER}email_template/get`
    return this.http.post(API_URL, payload)
      .pipe(
        map(res => {
          return res;
        }),
      );
  }

  createHtmlTemplate(payload:any) {
    let API_URL = '';
    if (payload._id) {
      API_URL = `${this.SERVER}email_template/update`;
    } else {
      API_URL = `${this.SERVER}email_template/add`;
    }
    return this.http.post(API_URL, payload)
      .pipe(
        map(res => {
          return res;
        }),
        catchError(this.error)
      )
  }

  searchEmailTemplates(payload:any): Observable<any> {
    const API_URL = `${this.SERVER}srch-eml`
    return this.http.post(API_URL, payload)
      .pipe(
        map(res => {
          return res;
        }),
      );
  }

  filterEmailTemplates(payload:any): Observable<any> {
    const API_URL = `${this.SERVER}email_template/search`
    return this.http.post(API_URL, payload)
      .pipe(
        map(res => {
          return res;
        }),
      );
  }
  // end of email template api methods

  // form builder api methods

  getAllForms(payload:any): Observable<any> {
    const API_URL = `${this.SERVER}custom_form/get`
    return this.http.post(API_URL, payload)
      .pipe(
        map(res => {
          return res;
        }),
      );
  }

  searchForms(payload:any): Observable<any> {
    const API_URL = `${this.SERVER}srch-frm`
    return this.http.post(API_URL, payload)
      .pipe(
        map(res => {
          return res;
        }),
      );
  }

  filterForms(payload:any): Observable<any> {
    const API_URL = `${this.SERVER}frm-fltr`
    return this.http.post(API_URL, payload)
      .pipe(
        map(res => {
          return res;
        }),
      );
  }

  getFormById(payload:any): Observable<any> {
    const API_URL = `${this.SERVER}custom_form/get`
    return this.http.post(API_URL, payload)
      .pipe(
        map(res => {
          return res;
        }),
      );
  }

  getStudentFormById(payload:any): Observable<any> {
    const API_URL = `${this.SERVER}custom_form/get_by_student`
    return this.http.post(API_URL, payload)
      .pipe(
        map(res => {
          return res;
        }),
      );
  }


  deleteForm(payload:any): Observable<any> {
    const API_URL = `${this.SERVER}custom_form/delete`
    return this.http.post(API_URL, payload)
      .pipe(
        map(res => {
          return res;
        }),
        catchError(this.error)
      )
  }

  duplicateForm(payload:any): Observable<any> {
    const API_URL = `${this.SERVER}custom_form/copy`
    return this.http.post(API_URL, payload)
      .pipe(
        map(res => {
          return res;
        }),
        catchError(this.error)
      )
  }

  createForm(payload:any) {
    let API_URL = '';
    if (payload._id) {
      API_URL = `${this.SERVER}custom_form/update`;
    } else {
      API_URL = `${this.SERVER}custom_form/add`;
    }
    return this.http.post(API_URL, payload)
      .pipe(
        map(res => {
          return res;
        }),
        catchError(this.error)
      )
  }

  updateFormStatus(payload:any) {
    const API_URL = `${this.SERVER}custom_form/status`;
    return this.http.post(API_URL, payload)
      .pipe(
        map(res => {
          return res;
        }),
        catchError(this.error)
      )
  }

  createFormStep(payload:any) {
    const API_URL = `${this.SERVER}form_steps/add`;
    return this.http.post(API_URL, payload)
      .pipe(
        map(res => {
          return res;
        }),
        catchError(this.error)
      )
  }

  getFormSteps() {
    const API_URL = `${this.SERVER}form_steps/get`
    return this.http.post(API_URL, {})
      .pipe(
        map(res => {
          return res;
        }),
      );
  }


  // end of form builder api methods

  uploadMedia(payload:any) {
    const API_URL = `${this.SERVER}upload/image`
    return this.http.post(API_URL, payload)
      .pipe(
        map(res => {
          return res;
        }),
      );
  }


  uploadMediaHcaaf(payload:any) {
    const API_URL = `${this.SERVER}upload/image`
    return this.http.post(API_URL, payload)
      .pipe(
        map(res => {
          return res;
        }),
      );
  }



  uploadResumeMedia(payload:any) {
    const API_URL = `${this.SERVER}upload/resume`
    return this.http.post(API_URL, payload)
      .pipe(
        map(res => {
          return res;
        }),
      );
  }

  uploadVisaMedia(payload:any) {
    const API_URL = `${this.SERVER}upload/visa`
    return this.http.post(API_URL, payload)
      .pipe(
        map(res => {
          return res;
        }),
      );
  }

  uploadOthersMedia(payload:any) {
    const API_URL = `${this.SERVER}upload/other`
    return this.http.post(API_URL, payload)
      .pipe(
        map(res => {
          return res;
        }),
      );
  }

  submitEnquiry(payload:any) {
    const API_URL = `${this.SERVER}support/add`
    return this.http.post(API_URL, payload)
      .pipe(
        map(res => {
          return res;
        }),
      );
  }

  getCompanyList(data:any): Observable<any> {
    const API_URL = `${this.SERVER}employee/get`
    return this.http.post(API_URL, data)
      .pipe(
        map(res => {
          return res
        })
      )
  }

  getindustrylist(data: any): Observable<any> {
    const API_URL = `${this.SERVER}out/university-lists`
    return this.http.post(API_URL, data)
      .pipe(
        map(res => {
          return res
        })
      )
  }

  getSkills(data: any): Observable<any> {
    const API_URL = `${this.SERVER}skills/get`
    return this.http.post(API_URL, data)
      .pipe(
        map(res => {
          return res
        })
      )
  }

  getJobSkills(data: any): Observable<any> {
    const API_URL = `${this.SERVER}ai/job_title_skill`
    return this.http.post(API_URL, data)
      .pipe(
        map(res => {
          return res
        })
      )
  }

  getJobDescription(data: any): Observable<any> {
    const API_URL = `${this.SERVER}ai/job_description`
    return this.http.post(API_URL, data)
      .pipe(
        map(res => {
          return res
        })
      )
  }

  getindustry(data: any): Observable<any> {
    const API_URL = `${this.SERVER}industry/get`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getsubIndustry(data: any): Observable<any> {
    const API_URL = `${this.SERVER}industry/get`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getSkillForVacancy(data: any): Observable<any> {
    const API_URL = `${this.SERVER}skills/get`
    return this.http.post(API_URL, data)
      .pipe(
        map(res => {
          return res
        })
      )
  }

  createVacancy(data: any): Observable<any> {
    let API_URL = null;
    if (data?._id) {
      API_URL = `${this.SERVER}vacancies/update`
    } else {
      API_URL = `${this.SERVER}vacancies/add`
    }
    return this.http.post(API_URL, data)
      .pipe(
        map(res => {
          return res
        })
      )
  }

  addSelfSourcedVacancy(data: any): Observable<any> {
    let API_URL = null;
    if (data?._id) {
      API_URL = `${this.SERVER}vacancies/add_self_sourced`
    } else {
      API_URL = `${this.SERVER}vacancies/add_self_sourced`
    }
    return this.http.post(API_URL, data)
      .pipe(
        map(res => {
          return res
        })
      )
  }


  getAllVacancies(data: any): Observable<any> {
    const API_URL = `${this.SERVER}vacancies/get`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  searchVacancies(data: any): Observable<any> {
    const API_URL = `${this.SERVER}vacancies/keyword_search`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  filterVacancies(data: any): Observable<any> {
    const API_URL = `${this.SERVER}vcncy-fltr`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  sortVacancies(data: any): Observable<any> {
    const API_URL = `${this.SERVER}vacancies/get`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getVacancyById(data: any): Observable<any> {
    const API_URL = `${this.SERVER}vacancies/get`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  updateVacanciesStatus(data: any): Observable<any> {
    const API_URL = `${this.SERVER}vacancies/status`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  deleteVacancy(data: any): Observable<any> {
    const API_URL = `${this.SERVER}vacancies/delete`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  submitPlacementTypeForm(data: any): Observable<any> {
    const API_URL = `${this.SERVER}placement_type/add`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getStudentProfile(data: any): Observable<any> {
    const API_URL = `${this.SERVER}student/me`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }


  getStudentProfileForProject(data: any): Observable<any> {
    const API_URL = `${this.SERVER}project_student_workflow/student_profile`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }



  getStudentProfileById(data: any): Observable<any> {
    const API_URL = `${this.SERVER}student/profile`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  searchMyTask(data: any): Observable<any> {
    const API_URL = `${this.SERVER}srch-tsk`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getMyTasks(data: any): Observable<any> {
    const API_URL = `${this.SERVER}get-my-tsk-new`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }
  getMyTasksCount(data: any): Observable<any> {
    const API_URL = `${this.SERVER}get-task-count`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  

  updateTaskStatus(data: any): Observable<any> {
    const API_URL = `${this.SERVER}updt-tsk-sts`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  updateBulkTaskStatus(data: any): Observable<any> {
    const API_URL = `${this.SERVER}blk-tsk-sts`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  exportTask(data: any) {
    const API_URL = `${this.SERVER}tsk-exprt`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  updateStudentProfile(data: any): Observable<any> {
    const API_URL = `${this.SERVER}student/update_profile`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }


  updateProfileStudent(data: any): Observable<any> {
    const API_URL = `${this.SERVER}student/update_student_profile`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }



  employerRegistration(data: any): Observable<any> {
    const API_URL = `${this.SERVER}employee/create`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getStudentForPlacement(data: any) {
    const API_URL = `${this.SERVER}get-stdnt-placement`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getPendingStudentForPlacement(data: any) {
    const API_URL = `${this.SERVER}get-stdnt-placement-pending`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  

  getCompanyForPlacement(data: any) {
    const API_URL = `${this.SERVER}company/list`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getPlacementCompany(data: any) {
    const API_URL = `${this.SERVER}get-plcmnt-vcncy`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getPlacementCompanyList(data: any) {
    const API_URL = `${this.SERVER}get-cmpny-plcnmt-list`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getStudentByCompany(data: any) {
    const API_URL = `${this.SERVER}company_allocation/get`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getPlacementStudentByCompany(data: any) {
    const API_URL = `${this.SERVER}get-allcntn-stdnt`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getCompanyVaccancy(data: any): Observable<any> {
    const API_URL = `${this.SERVER}vacancies/get`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getWorkFlowTask(data: any) {
    const API_URL = `${this.SERVER}get-wrkflw`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }



  getWorkFlowTaskStudentOngoing(data: any) {
    const API_URL = `${this.SERVER}project_student_workflow/get-ongoing-completed-data`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }



  getEmployerWorkFlowTask(data: any) {
    const API_URL = `${this.SERVER}get-emplyr-wrkflw`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getProjectStudentWorkFlowTask(data: any) {
    const API_URL = `${this.SERVER}project_student_workflow/get-wrkflw-project`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getProjectEmployerWorkFlowTask(data: any) {
    const API_URL = `${this.SERVER}emp_project_workflow/emp-project-workflow-task`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getSubmittedWorkFlowTask(data: any) {
    const API_URL = `${this.SERVER}get-sbmitd-tsk`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getOngoingStudentVacancyDetail(data: any) {
    const API_URL = `${this.SERVER}get-stdnt-vcncy`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  requestWithdrawl(data: any) {
    const API_URL = `${this.SERVER}wthrwl-wrkflw`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  allocateToCompany(data: any): Observable<any> {
    // const API_URL = `${this.SERVER}company_allocation/add`
    const API_URL = `${this.SERVER}ad-cmpny-allcntn`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }



  resendAllocationEmail(data: any): Observable<any> {
    // const API_URL = `${this.SERVER}company_allocation/add`
    const API_URL = `${this.SERVER}resend-allocation-email`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }



  lockCandidate(data: any): Observable<any> {
    const API_URL = `${this.SERVER}student/lock`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  lockCompany(data: any): Observable<any> {
    const API_URL = `${this.SERVER}lck-unlck-cmpny`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  removeStudent(data: any): Observable<any> {
    const API_URL = `${this.SERVER}student/remove`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  removeCompany(data: any): Observable<any> {
    const API_URL = `${this.SERVER}student/remove`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  searchStudent(data: any): Observable<any> {
    const API_URL = `${this.SERVER}srch-stdnt`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  searchCompany(data: any): Observable<any> {
    const API_URL = `${this.SERVER}srch-comp`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  searchCompanyPlacementGroup(data: any): Observable<any> {
    const API_URL = `${this.SERVER}srch-placement-comp`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  submitWorkFlowAttachment(data: any): Observable<any> {
    const API_URL = `${this.SERVER}snd-wrkflw-tsk-attchmnt`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  submitWorkFlowVideo(data: any): Observable<any> {
    const API_URL = `${this.SERVER}project_student_workflow/snd-wrkflw-tsk-video`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

   submitWorkFlowVideoUrl(data: any): Observable<any> {
    const API_URL = `${this.SERVER}project_student_workflow/snd-wrkflw-tsk-video-url`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }
 
  submitWorkFlowReviewDoc(data: any): Observable<any> {
    const API_URL = `${this.SERVER}project_student_workflow/snd-wrkflw-tsk-document`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  submitStaffWorkFlowForm(data: any): Observable<any> {
    const API_URL = `${this.SERVER}sbmt-stff-tsk`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  submitWorkFlowForm(data: any): Observable<any> {
    const API_URL = `${this.SERVER}sbmt-wrkflw-tsk`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }


  submitLastPendingForm(data: any): Observable<any> {
    const API_URL = `${this.SERVER}send-email-on-last-task-submission`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getEmployerProfile(data: any): Observable<any> {
    const API_URL = `${this.SERVER}company/me`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  SubmitEmployerProfile(data: any): Observable<any> {
    const API_URL = `${this.SERVER}company/update_profile`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  updateProfileSelfSourceCompany(data: any): Observable<any> {
    const API_URL = `${this.SERVER}company/update_profile_self_source`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getEmployerStudent(data: any): Observable<any> {
    const API_URL = `${this.SERVER}get-emplyr-stdnt`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getProjectEmployerStudent(data: any): Observable<any> {
    const API_URL = `${this.SERVER}project_student_workflow/get-student-projects`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }


   getProjectEmployerStudentAdmin(data: any): Observable<any> {
    const API_URL = `${this.SERVER}project_student_workflow/get-student-projects-admin`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  


  getEmployerProjectStudent(data: any): Observable<any> {
    const API_URL = `${this.SERVER}emp_project_workflow/get_students_projects`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getEmployerStudentById(data: any): Observable<any> {
    const API_URL = `${this.SERVER}get-emplyr-stdnt-byid`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getEmployerStudentProjectById(data: any): Observable<any> {
    const API_URL = `${this.SERVER}project_student_workflow/get-student-projects-by-id`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }


  getProjectEmployerStudentById(data: any): Observable<any> {
    const API_URL = `${this.SERVER}emp_project_workflow/student-workflow-by-id`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  studentFilter(data: any): Observable<any> {
    const API_URL = `${this.SERVER}stdnt-fltr`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getStudentNotes(data: any): Observable<any> {
    const API_URL = `${this.SERVER}notes/get`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  createStudentNotes(data: any): Observable<any> {
    const API_URL = `${this.SERVER}notes/add`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  updateStudentNotes(data: any): Observable<any> {
    const API_URL = `${this.SERVER}notes/update`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  deleteStudentNotes(data: any): Observable<any> {
    const API_URL = `${this.SERVER}notes/delete`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  publishPlacementGroup(data: any): Observable<any> {
    const API_URL = `${this.SERVER}pblsh-plcmnt-grp`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }
  getWorkingHourForStudent(data: any): Observable<any> {
    const API_URL = `${this.SERVER}get-wrkng-hrs-stdnt`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  emitPlacementGroupDetails(details:any) {
    this.placementGroupDetails.emit(details);
  }

  submitWorkingHourForStudent(data: any): Observable<any> {
    const API_URL = `${this.SERVER}sbmt-wrkng-hrs`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  submitWorkingHourFromAdmin(data: any): Observable<any> {
    const API_URL = `${this.SERVER}add-wrkng-hrs`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  placeStudent(data: any): Observable<any> {
    const API_URL = `${this.SERVER}project_allocation/add-project-allocation`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  deleteWorkflowStep(data: any): Observable<any> {
    const API_URL = `${this.SERVER}dlt-stp`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  deletePlacementType(data: any): Observable<any> {
    const API_URL = `${this.SERVER}dlt-wrkflw-typ`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  // changePassword(data: any): Observable<any> {
  //   let API_URL = `${this.SERVER}auth/change/password`;
  //   return this.http.put(API_URL, data)
  //     .pipe(
  //       map(res => {
  //         return res
  //       }),
  //       catchError(this.error)
  //     )
  // }

   changePassword(obj: any): Observable<any> {
    let API_URL = `${this.SERVER}auth/change/password`;
    return this.httpClient.put(API_URL, obj).pipe(
      map((res: any) => {
        console.log("res", res)
        return res; // You can transform the response if needed here
      }),
      // catchError((error: any) => {
      //   console.error("Login API error:", error); // Log full error details
      //   console.error("Full error response:", error?.error); // Log server's response if present
      //   return throwError(() => error); // Re-throw the error for handling in the component
      // })
    );
  }
  transformContactPersonObj(company:any) {
    if (company.contact_person && company.contact_person.length > 0) {
      company.contact_person = company.contact_person.map((contact:any, i:any) => {
        company['contact_0' + (i + 1) + '_first_name'] = contact.first_name;
        company['contact_0' + (i + 1) + '_last_name'] = contact.last_name;
        company['contact_0' + (i + 1) + '_secondary_phone'] = contact.secondary_phone;
        company['contact_0' + (i + 1) + '_primary_email'] = contact.primary_email;
        company['contact_0' + (i + 1) + '_primary_phone'] = contact.primary_phone;
        company['contact_0' + (i + 1) + '_role'] = contact.role;
        company['contact_0' + (i + 1) + '_secondary_email'] = contact.secondary_email;
        return company.contact_person;
      });
    }
    return company;
  }
  //Begin:: Analytics
  createAnalyticsTable(data: any): Observable<any> {
    let API_URL = `${this.SERVER}company_analytics/create_table`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  updateTableName(data: any): Observable<any> {
    let API_URL = `${this.SERVER}company_analytics/update`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  renameRow(data: any): Observable<any> {
    let API_URL = `${this.SERVER}company_analytics/rename_row`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  renameCol(data: any): Observable<any> {
    let API_URL = `${this.SERVER}company_analytics/rename_col`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  deleteTable(data: any): Observable<any> {
    let API_URL = `${this.SERVER}company_analytics/delete`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  deleteCol(data: any): Observable<any> {
    let API_URL = `${this.SERVER}company_analytics/delete_col`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  deleteRow(data: any): Observable<any> {
    let API_URL = `${this.SERVER}company_analytics/delete_row`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getTables(data: any): Observable<any> {
    let API_URL = `${this.SERVER}company_analytics/get`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  duplicateTable(data: any): Observable<any> {
    let API_URL = `${this.SERVER}company_analytics/duplicate_table`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  duplicateRow(data: any): Observable<any> {
    let API_URL = `${this.SERVER}company_analytics/duplicate_row`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  duplicateColumn(data: any): Observable<any> {
    let API_URL = `${this.SERVER}company_analytics/duplicate_col`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getFilter(data: any): Observable<any> {
    let API_URL = `${this.SERVER}analytics_filter/get`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  updateFilter(data: any): Observable<any> {
    let API_URL = `${this.SERVER}company_analytics/update_filter`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  createStudentAnalyticsTable(data: any): Observable<any> {
    let API_URL = `${this.SERVER}student_analytics/create_table`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  updateStudentTableName(data: any): Observable<any> {
    let API_URL = `${this.SERVER}student_analytics/update`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  renameStudentRow(data: any): Observable<any> {
    let API_URL = `${this.SERVER}student_analytics/rename_row`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  renameStudentCol(data: any): Observable<any> {
    let API_URL = `${this.SERVER}student_analytics/rename_col`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  deleteStudentTable(data: any): Observable<any> {
    let API_URL = `${this.SERVER}student_analytics/delete`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  deleteStudentCol(data: any): Observable<any> {
    let API_URL = `${this.SERVER}student_analytics/delete_col`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  deleteStudentRow(data: any): Observable<any> {
    let API_URL = `${this.SERVER}student_analytics/delete_row`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getStudentTables(data: any): Observable<any> {
    let API_URL = `${this.SERVER}student_analytics/get`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  duplicateStudentTable(data: any): Observable<any> {
    let API_URL = `${this.SERVER}student_analytics/duplicate_table`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  duplicateStudentRow(data: any): Observable<any> {
    let API_URL = `${this.SERVER}student_analytics/duplicate_row`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  duplicateStudentColumn(data: any): Observable<any> {
    let API_URL = `${this.SERVER}student_analytics/duplicate_col`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  updateStudentFilter(data: any): Observable<any> {
    let API_URL = `${this.SERVER}student_analytics/update_filter`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getCompanyPlacementGroup(data: any): Observable<any> {
    let API_URL = `${this.SERVER}get-cmpny-plcmnt-grp`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getCompanyPreferredContact(data: any): Observable<any> {
    let API_URL = `${this.SERVER}company/get-preferred-contact-by-company`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

   getCompanyVacancies(data: any): Observable<any> {
    let API_URL = `${this.SERVER}get-vcncy-company`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getStudentPGs(data: any): Observable<any> {
    let API_URL = `${this.SERVER}get-stdnt-placement-list`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  

  getSubmittedStudentDocuments(data: any): Observable<any> {
    let API_URL = `${this.SERVER}custom/fetch_submit_workflow_task`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getSubmittedStudentDeclinedDocuments(data: any): Observable<any> {
    let API_URL = `${this.SERVER}custom/fetch_declined_forms`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getSubmittedCompanyDocuments(data: any): Observable<any> {
    let API_URL = `${this.SERVER}get-cmpny-tsk`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  updateCompanyPlacement(data: any): Observable<any> {
    let API_URL = `${this.SERVER}updt-compy-plcmnt`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }


  getVacancyByCompany(data: any): Observable<any> {
    let API_URL = `${this.SERVER}vacancy/vacancies-by-company`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }



  getUnplacementStudent(data: any): Observable<any> {
    let API_URL = `${this.SERVER}get-unplcmnt-stdnt`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  updateStudentPlacement(data: any): Observable<any> {
    let API_URL = `${this.SERVER}updt-stdnt-plcmnt`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  updateProjectPlacement(data: any): Observable<any> {
    let API_URL = `${this.SERVER}projects/add-project-in-pg`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

    ProjectApproveDisapprove(data: any): Observable<any> {
    let API_URL = `${this.SERVER}emp_project_workflow/approve-disapprove-projects`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }


  arrangeTask(data: any): Observable<any> {
    let API_URL = `${this.SERVER}arrng-tsks`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }


  update_company(data: any): Observable<any> {
    let API_URL = `${this.SERVER}update-company-profile`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }


  getStudentsApprovalTask(data: any) {
    const API_URL = `${this.SERVER}get-students-approval-tasks`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  searchAdmins(data: any): Observable<any> {
    let API_URL = `${this.SERVER}srch-admn`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getAllAdmin(data: any): Observable<any> {
    let API_URL = `${this.SERVER}get-all-admn`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }
  

  getUserList(data: any): Observable<any> {
    let API_URL = `${this.SERVER}get-stff-by-prmisn`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getAdminById(data: any): Observable<any> {
    let API_URL = `${this.SERVER}get-admn-prfl`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  createAdmin(data: any): Observable<any> {
    let API_URL = `${this.SERVER}add-admn`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  updateAdminStaff(data: any): Observable<any> {
    let API_URL = `${this.SERVER}updt-admn`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getAllStaff(data: any): Observable<any> {
    let API_URL = `${this.SERVER}get-all-stff`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  createStaff(data: any): Observable<any> {
    let API_URL = `${this.SERVER}add-stff`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  editStaff(data: any): Observable<any> {
    let API_URL = `${this.SERVER}edit-stff-prmsn`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  updateAdminProfile(data: any): Observable<any> {
    let API_URL = `${this.SERVER}updt-admn`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getAllPermissionsList(): Observable<any> {
    let API_URL = `${this.SERVER}get-prmsn-mstr`;
    return this.http.get(API_URL).pipe(
      map(res => {
        return res
      })
    )
  }

  getAllPermissionsGroup(): Observable<any> {
    let API_URL = `${this.SERVER}get-prmsn-grp`;
    return this.http.get(API_URL).pipe(
      map(res => {
        return res
      })
    )
  }

  getUserPermissionByGrouId(data: any): Observable<any> {
    let API_URL = `${this.SERVER}get-prmsn-byid`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  createPermissionGroup(data: any): Observable<any> {
    let API_URL = `${this.SERVER}add-prmsn-grp`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  deleteUserGroup(data: any): Observable<any> {
    let API_URL = `${this.SERVER}dlt-usr-grp`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  updatePermissionGroup(data: any): Observable<any> {
    let API_URL = `${this.SERVER}edt-prmsn-grp`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  createCompany(data: any): Observable<any> {
    let API_URL = null;
    // if (data?._id) {
    //   API_URL = `${this.SERVER}company/create-company`
    // } else {
    API_URL = `${this.SERVER}company/create-company`
    // }
    return this.http.post(API_URL, data)
      .pipe(
        map(res => {
          return res
        })
      )
  }



  sendNewHcaaf(obj: any): Observable<any> {
    let API_URL = `${this.SERVER}send-new-hcaaf`;

    return this.httpClient.post(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }))
  }



  getEmployerHcaafTask(data: any) {
    const API_URL = `${this.SERVER}get-employer-hcaaf`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getSubmittedHcaafForm(data: any) {
    const API_URL = `${this.SERVER}get-submitted-hcaaf-form`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getHcaafFormDetailById(payload:any): Observable<any> {
    const API_URL = `${this.SERVER}get-hcaaf-form-details`
    return this.http.post(API_URL, payload)
      .pipe(
        map(res => {
          return res;
        }),
      );
  }


  getSubmittedHcaafFormDetailById(payload:any): Observable<any> {
    const API_URL = `${this.SERVER}get-submitted-hcaaf-form-details-by-staff`
    return this.http.post(API_URL, payload)
      .pipe(
        map(res => {
          return res;
        }),
      );
  }



  submitHcaafForm(data: any): Observable<any> {
    const API_URL = `${this.SERVER}submit-hcaaf-form`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }


  updateHcaafFormData(data: any): Observable<any> {
    const API_URL = `${this.SERVER}update-hcaaf-form-data`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }


  updateHcaafForm(data: any): Observable<any> {
    const API_URL = `${this.SERVER}update-submit-hcaaf-form`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  downloadPDFHcaaf(data: any): Observable<any> {
    const API_URL = `${this.SERVER}download_workflow_pdf`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  downloadPDFHcaafForm(data: any): Observable<any> {
    const API_URL = `${this.SERVER}download_workflow_pdf_without_s3`
    return this.http.post(API_URL, data, {
    responseType: 'blob'
  }).pipe(
      map(res => {
        return res
      })
    )
  }



  getVacanciesDetails(data: any): Observable<any> {
    const API_URL = `${this.SERVER}vacancies/vacancy-details`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }


  getVacanciesStudentsAllocated(data: any): Observable<any> {
    const API_URL = `${this.SERVER}vacancies/students-allocated-to-vacancy`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }


  updateflagStudent(data: any): Observable<any> {
    const API_URL = `${this.SERVER}student/flag-student`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }


  updateflagCompany(data: any): Observable<any> {
    const API_URL = `${this.SERVER}company/flag-company`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }


  getnotifications(data: any): Observable<any> {
    const API_URL = `${this.SERVER}notifications/list`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getVacancyStudent(data: any): Observable<any> {
    const API_URL = `${this.SERVER}get-vcncy-stdnt`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }


  resendOTPEamilCompany(obj: any): Observable<any> {
    let API_URL = `${this.SERVER}company/resend-otp-email-company`;
    return this.httpClient.post(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }))
  }

  resendOTPEamilStudent(obj: any): Observable<any> {
    let API_URL = `${this.SERVER}student/resend-otp-email-student`;
    return this.httpClient.post(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }))
  }

  resendOTPEamilStaff(obj: any): Observable<any> {
    let API_URL = `${this.SERVER}resend-otp-email-staff`;
    return this.httpClient.post(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }))
  }


  taskDetails(obj: any): Observable<any> {
    let API_URL = `${this.SERVER}task-details`;
    return this.httpClient.post(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }))
  }
  



  addCompanyNote(obj: any): Observable<any> {
    let API_URL = `${this.SERVER}company_notes/add`;
    return this.httpClient.post(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }))
  }

  getCompanyNote(obj: any): Observable<any> {
    let API_URL = `${this.SERVER}company_notes/get`;
    return this.httpClient.post(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }))
  }


  updateCompanyNote(obj: any): Observable<any> {
    let API_URL = `${this.SERVER}company_notes/update`;
    return this.httpClient.post(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }))
  }

  deleteCompanyNote(obj: any): Observable<any> {
    let API_URL = `${this.SERVER}company_notes/delete`;
    return this.httpClient.post(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }))
  }


  addStudentNote(obj: any): Observable<any> {
    let API_URL = `${this.SERVER}student_notes/add`;
    return this.httpClient.post(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }))
  }

  // getStudentNote(obj: any): Observable<any> {
  //   let API_URL = `${this.SERVER}student_notes/get`;
  //   return this.httpClient.post(API_URL, obj)
  //     .pipe(
  //       map(res => {
  //         return res
  //       }))
  // }

  getStudentNote(obj: any): Observable<any> {
    const API_URL = `${this.SERVER}student_notes/get`;
    return this.httpClient.post(API_URL, obj).pipe(
      map((res) => {
        return res; // Process the response if needed
      }),
      catchError((error) => {
        console.error('Error occurred:', error);
        // Optionally transform the error before throwing it
        return throwError(() => new Error('Failed to fetch student notes. Please try again later.'));
      })
    );
  }

  updateStudentNote(obj: any): Observable<any> {
    let API_URL = `${this.SERVER}student_notes/update`;
    return this.httpClient.post(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }))
  }

  deleteStudentNote(obj: any): Observable<any> {
    let API_URL = `${this.SERVER}student_notes/delete`;
    return this.httpClient.post(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }))
  }



  reminderAdd(data: any) {
    const API_URL = `${this.SERVER}reminders/add`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }


  getReminders(data: any): Observable<any> {
    const API_URL = `${this.SERVER}reminders/get`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  updateRemindersStatus(data: any): Observable<any> {
    const API_URL = `${this.SERVER}reminders/update-status`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  remindersDetails(obj: any): Observable<any> {
    let API_URL = `${this.SERVER}reminders/reminder-details`;
    return this.httpClient.post(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }))
  }

  getActivityLogs(obj: any): Observable<any> {
    let API_URL = `${this.SERVER}get-actvty-lgs`;
    return this.httpClient.post(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }))
  }

  terminateStudent(obj: any): Observable<any> {
    let API_URL = `${this.SERVER}trmint-stdnt`;
    return this.httpClient.post(API_URL, obj)
      .pipe(
        map(res => {
          return res
        })
      )
  }

  removeStudentFromPlacementGroup(obj: any): Observable<any> {
    // let API_URL = `${this.SERVER}remove-student-from-placement-group-project`;
    let API_URL = `${this.SERVER}remove-student-from-placement-group`;
    return this.httpClient.post(API_URL, obj)
      .pipe(
        map(res => {
          return res
        })
      )
  }

   removeStudentFromProjectPlacementGroup(obj: any): Observable<any> {
    // let API_URL = `${this.SERVER}remove-student-from-placement-group-project`;
    let API_URL = `${this.SERVER}remove-student-from-placement-group-project`;
    return this.httpClient.post(API_URL, obj)
      .pipe(
        map(res => {
          return res
        })
      )
  }
   

  getTerminateStudentDetail(obj: any): Observable<any> {
    let API_URL = `${this.SERVER}chck-stdnt-trmint`;
    return this.httpClient.post(API_URL, obj)
      .pipe(
        map(res => {
          return res
        })
      )
  }

  deleteTerminatedStudentComment(obj: any): Observable<any> {
    let API_URL = `${this.SERVER}dlt-trmint-msg`;
    return this.httpClient.post(API_URL, obj)
      .pipe(
        map(res => {
          return res
        })
      )
  }


  getEmailTemplateKey(data:any): Observable<any> {
    const API_URL = `${this.SERVER}email_template/student-employee-db-columns`
    return this.http.post(API_URL, data)
      .pipe(
        map(res => {
          return res;
        }),
      );
  }

  saveAsFavorite(data: any) {
    const API_URL = `${this.SERVER}fvrt-wrkflw`
    return this.http.post(API_URL, data)
      .pipe(
        map(res => {
          return res;
        }),
      );
  }



  getSentEmails(data: any): Observable<any> {
    let API_URL = `${this.SERVER}get-sent-emails`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  createAutoForm(payload:any) {
    let API_URL = `${this.SERVER}autofill_forms/save-autofill-fields`;
    return this.http.post(API_URL, payload)
      .pipe(
        map(res => {
          return res;
        }),
        catchError(this.error)
      )
  }

  deleteAutoForm(payload:any) {
    let API_URL = `${this.SERVER}autofill_forms/delete-autofill-fields`;
    return this.http.post(API_URL, payload)
      .pipe(
        map(res => {
          return res;
        }),
        catchError(this.error)
      )
  }


  

  getCompanyAllocationForStudent(data: any): Observable<any> {
    let API_URL = `${this.SERVER}get-cmpny-allcnts`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }
  
  getJobTitle(data: any): Observable<any> {
    const API_URL = `${this.SERVER}job_titles/get`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }


  addAdminNote(obj: any): Observable<any> {
    let API_URL = `${this.SERVER}admin_notes/add`;
    return this.httpClient.post(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }))
  }

  getAdminNote(obj: any): Observable<any> {
    let API_URL = `${this.SERVER}admin_notes/get`;
    return this.httpClient.post(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }))
  }


  updateAdminNote(obj: any): Observable<any> {
    let API_URL = `${this.SERVER}admin_notes/update`;
    return this.httpClient.post(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }))
  }

  deleteAdminNote(obj: any): Observable<any> {
    let API_URL = `${this.SERVER}admin_notes/delete`;
    return this.httpClient.post(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }))
  }



  getsubmissionList(payload:any): Observable<any> {
    const API_URL = `${this.SERVER}custom_form/submission-list`
    return this.http.post(API_URL, payload)
      .pipe(
        map(res => {
          return res;
        }),
      );
  }

  getDBColumns(payload:any): Observable<any> {
    const API_URL = `${this.SERVER}custom_form/get-db-columns`
    return this.http.post(API_URL, payload)
      .pipe(
        map(res => {
          return res;
        }),
      );
  }


  getAutofillForms(payload:any): Observable<any> {
    const API_URL = `${this.SERVER}autofill_forms/get-autofill-fields-used-places`
    return this.http.post(API_URL, payload)
      .pipe(
        map(res => {
          return res;
        }),
      );
  }


  deleteHcaaf(data: any): Observable<any> {
    let API_URL = `${this.SERVER}delete-hcaaf`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }



  removeCmpnyAllcntn(data: any): Observable<any> {
    const API_URL = `${this.SERVER}remove-cmpny-allcntn`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }


  getSubmittedTaskByWrkflwTyp(data: any) {
    const API_URL = `${this.SERVER}get-submitted-task-by-wrkflw-typ`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }


  get_company_detail(data: any): Observable<any> {
    let API_URL = `${this.SERVER}emp_dashboard/get_company_detail`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  get_recent_vacancies(data: any): Observable<any> {
    let API_URL = `${this.SERVER}emp_dashboard/get_recent_vacancies`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  get_placements_of_company(data: any): Observable<any> {
    let API_URL = `${this.SERVER}emp_dashboard/get_placements_of_company`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

   InterviewByCompany(data: any): Observable<any> {
    let API_URL = `${this.SERVER}company/upcoming-completed-interviews-by-company`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }



  getAllSubIndudtries(data: any): Observable<any> {
    let API_URL = `${this.SERVER}industry/sub-industries`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }


  updtPwdStud(obj: any): Observable<any> {
    let API_URL = `${this.SERVER}updt-pwd-stud`;

    return this.httpClient.post(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }))
  }


  deleteFileS3(obj: any): Observable<any> {
    let API_URL = `${this.SERVER}delete_uploaded_file`;
    return this.httpClient.post(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }))
  }

  getWorkFlowTaskNew(data: any) {
    const API_URL = `${this.SERVER}get-wrkflw-new`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }


  getProjectWorkFlowTaskNew(data: any) {
    const API_URL = `${this.SERVER}project_student_workflow/get-project-wrkflw-new`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }


  getCompnaystudentList(data: any): Observable<any> {
    const API_URL = `${this.SERVER}company/placed-students-list`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  getCompnaystudentListHQ(data: any): Observable<any> {
    const API_URL = `${this.SERVER}company/placed-students-list-HQ`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }


  getIncidentReportByTypeId(data: any): Observable<any> {
    const API_URL = `${this.SERVER}incident_report/get-incident-report-by-type-id`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }



  companystudentFilterOptions(data:any) {
    const API_URL = `${this.SERVER}company/company-filter-options`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }


  exportCompanyStudents(data: any) {
    const API_URL = `${this.SERVER}company-stdnt-exprt`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  sendCompanyEmail(data: any): Observable<any> {
    const API_URL = `${this.SERVER}open_forms/send-otp-email`
    return this.http.post(API_URL, data)
      .pipe(
        map(res => {
          return res;
        }),
        catchError(this.error)
      )
  }

  sendCompanyEmailVerify(data: any): Observable<any> {
    const API_URL = `${this.SERVER}open_forms/verify-otp`
    return this.http.post(API_URL, data)
      .pipe(
        map(res => {
          return res;
        }),
        catchError(this.error)
      )
  }


  getopenformStudentFormById(payload:any): Observable<any> {
    const API_URL = `${this.SERVER}open_forms/get_by_student`
    return this.http.post(API_URL, payload)
      .pipe(
        map(res => {
          return res;
        }),
      );
  }


  exportVacancyProjectExprt(data: any) {
    const API_URL = `${this.SERVER}vacancy-project-exprt`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  removeProjectForPG(payload:any): Observable<any> {
    const API_URL = `${this.SERVER}projects/remove-project-from-pg`
    return this.http.post(API_URL, payload)
      .pipe(
        map(res => {
          return res;
        }),
      );
  }

  CompanyListUpdateKey(payload:any): Observable<any> {
    const API_URL = `${this.SERVER}company/update-company-details`
    return this.http.post(API_URL, payload)
      .pipe(
        map(res => {
          return res;
        }),
      );
  }


   saveColumnStudent(data: any): Observable<any> {
    const API_URL = `${this.SERVER}student/save-columns-of-student`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

   getColumnStudents(data: any): Observable<any> {
    const API_URL = `${this.SERVER}student/get-columns-of-student`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }


   getdepartments(data: any) {
    const API_URL = `${this.SERVER}company/departments`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  setAsHeadquarter(data: any) {
    const API_URL = `${this.SERVER}company/set-as-headquarter`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getCompanyHeadquarter() {
    const API_URL = `${this.SERVER}company/get-companies-hq`
    return this.http.get(API_URL).pipe(
      map(res => {
        return res
      })
    )
  }

  getContactList(data:any) {
    const API_URL = `${this.SERVER}headquarters/company-contacts`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getCompanyContactList(data:any) {
    const API_URL = `${this.SERVER}headquarters/contacts-of-company`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getonboardingContactList(data:any) {
    const API_URL = `${this.SERVER}headquarters/company-contacts-onboarding`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getChildCompany(data:any) {
    const API_URL = `${this.SERVER}headquarters/child-companies`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getDeprtmentbyCompany(data:any) {
    const API_URL = `${this.SERVER}headquarters/deprtments-by-company`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getDeprtmentbyCompanyContact(data:any) {
    const API_URL = `${this.SERVER}headquarters/company-contacts-by-department`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  removeDepartmentFromCompany(data:any) {
    const API_URL = `${this.SERVER}headquarters/remove-department-from-company`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  removeContactsFromCompany(data:any) {
    const API_URL = `${this.SERVER}headquarters/remove-contacts-from-company`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }
  removeContactUpdate(data:any) {
    const API_URL = `${this.SERVER}headquarters/update-vacancy-application-routing`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  updateContact(data:any) {
    const API_URL = `${this.SERVER}headquarters/update-contact`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }
  cehckEmailExistCompnayLogin(data: any) {
    const API_URL = `${this.SERVER}company/check-company-contact-person`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }
  
  addDepartmentToCompany(data:any) {
    const API_URL = `${this.SERVER}headquarters/add-department-to-company`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }
    
  updateDepartmentToCompany(data:any) {
    const API_URL = `${this.SERVER}headquarters/update-department-of-company`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }
  addContactToCompany(data:any) {
    const API_URL = `${this.SERVER}headquarters/add-contact-to-company-departments`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }
  checkVacancyByContact(data:any) {
    const API_URL = `${this.SERVER}headquarters/check-vacancy-by-contact`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getCommonCompany() {
    const API_URL = `${this.SERVER}company/get-common-companies`
    return this.http.get(API_URL).pipe(
      map(res => {
        return res
      })
    )
  }

  getChildCompanyBYHQ(data:any) {
    const API_URL = `${this.SERVER}company/get-child-company-by-hq`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

 addChildCompanyBYHQ(data:any) {
    const API_URL = `${this.SERVER}company/add-child-at-headquarter`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }
  getContactPersonByCompany(data:any) {
    const API_URL = `${this.SERVER}company/get-contact-person-by-company`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  removeChildCompany(data:any) {
    const API_URL = `${this.SERVER}company/remove-child-from-headquarter`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  checkAbnAcn(data:any) {
    const API_URL = `${this.SERVER}company/check-company-by-abn-acn`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

 getBusinessName(data:any) {
    const API_URL = `${this.SERVER}company/get-abn-details`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getSentEmailCompany(data: any): Observable<any> {
    let API_URL = `${this.SERVER}get-sent-emails-company`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }
  logoutCompany(data: any): Observable<any> {
    let API_URL = `${this.SERVER}company/company-logout`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }
  getStudentOfCompany(data: any): Observable<any> {
    let API_URL = `${this.SERVER}headquarters/assigned-students-of-company`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }
  checkchildCompanyVacancy(data: any): Observable<any> {
    let API_URL = `${this.SERVER}company/check-child-in-headquarter`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }
 
  removeHeadquarter(data: any): Observable<any> {
    let API_URL = `${this.SERVER}company/remove-as-headquarter`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }
 
  
  saveFilter(data: any): Observable<any> {
    const API_URL = `${this.SERVER}company/save-filters`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  updateFilters(data: any): Observable<any> {
    const API_URL = `${this.SERVER}company/update-filters`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }
  


  getSaveFilterList(obj: any): Observable<any> {
    let API_URL = `${this.SERVER}company/get-filters`;
    return this.httpClient.post(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }))
  }
  getRecentDisplayFilters(obj: any): Observable<any> {
    let API_URL = `${this.SERVER}company/get-recent-display-filters`;
    return this.httpClient.post(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }))
  }
 

  validateSelfSourcedCompany(obj: any): Observable<any> {
    let API_URL = `${this.SERVER}company/validate-self-sourced-company`;
    return this.httpClient.post(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }))
  }


   compnayOnboardingSelfSource(data: any): Observable<any> {
      let API_URL = null;
      // if (data?._id) {
      //   API_URL = `${this.SERVER}company/create-company`
      // } else {
      API_URL = `${this.SERVER}company/create-self-source-company`
      // }
      return this.http.post(API_URL, data)
        .pipe(
          map(res => {
            return res
          })
        )
    }

    updateSelfSourceStatus(data: any): Observable<any> {
      let API_URL = null;
      // if (data?._id) {
      //   API_URL = `${this.SERVER}company/create-company`
      // } else {
      API_URL = `${this.SERVER}company/update-self-source-status`
      // }
      return this.http.post(API_URL, data)
        .pipe(
          map(res => {
            return res
          })
        )
    }



   companyApproveRejct(data: any): Observable<any> {
      let API_URL = null;
      // if (data?._id) {
      //   API_URL = `${this.SERVER}company/create-company`
      // } else {
      API_URL = `${this.SERVER}company/company-approve-reject`
      // }
      return this.http.post(API_URL, data)
        .pipe(
          map(res => {
            return res
          })
        )
    }


     companyApprove(data: any): Observable<any> {
      let API_URL = null;
      // if (data?._id) {
      //   API_URL = `${this.SERVER}company/create-company`
      // } else {
      API_URL = `${this.SERVER}company/company-approve-reject`
      // }
      return this.http.post(API_URL, data)
        .pipe(
          map(res => {
            return res
          })
        )
    }



    companyRemove(data: any): Observable<any> {
      let API_URL = null;
      // if (data?._id) {
      //   API_URL = `${this.SERVER}company/create-company`
      // } else {
      API_URL = `${this.SERVER}company/company-remove`
      // }
      return this.http.post(API_URL, data)
        .pipe(
          map(res => {
            return res
          })
        )
    }

  // updateSelfSourceStatus(data): Observable<any> {
  //   let API_URL = `${this.SERVER}company/update-self-source-status`;
  //   return this.http.post(API_URL, data).pipe(
  //     map(res => {
  //       return res
  //     })
  //   )
  // }
    
 
  cronofyAuthUrl(data): Observable<any> {
    let API_URL = `${this.SERVER}cronofy/auth-url`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  cronofyGetElementToken(data): Observable<any> {
    let API_URL = `${this.SERVER}cronofy/get-element-token`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }


 
  createInterview(data): Observable<any> {
    let API_URL = `${this.SERVER}cronofy/create-students-interview-invites`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getInterviewList(data): Observable<any> {
    let API_URL = `${this.SERVER}cronofy/get-interview-invites`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }


  getInterviewByID(data): Observable<any> {
    let API_URL = `${this.SERVER}cronofy/get-interview-invites-by-id`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  BookEvent(data): Observable<any> {
    let API_URL = `${this.SERVER}cronofy/book-event`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  submitWorkingHourFromPendingCompany(data: any): Observable<any> {
    const API_URL = `${this.SERVER}company/self-source-allocation-placed-company`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

checkStudentAlreadyPlaced(data: any): Observable<any> {
    const API_URL = `${this.SERVER}check-student-already-placed`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getVideoInterview(data: any) {
    const API_URL = `${this.SERVER}get-my-tsk-video-resume`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }


  getLatestSubmittedHcaafForm(data: any) {
    const API_URL = `${this.SERVER}get-latest-submitted-hcaaf-form`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  updateHcaafApprovalStatus(data: any) {
    const API_URL = `${this.SERVER}update-hcaaf-approval-status`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }


  getReports() {
    const API_URL = `${this.SERVER}powerbi/getallreport`
    return this.http.post(API_URL, {}).pipe(
      map(res => {
        return res
      })
    )
  }

  getReportEmbed(data) {
    const API_URL = `${this.SERVER}powerbi/getallreport`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }


  getOktaSSO(data) {
    const API_URL = `${this.SERVER}auth/sso-login`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getPlacementGroupSearch(data: any): Observable<any> {
    const API_URL = `${this.SERVER}get-plcmnt-grp-student`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  checkPlacmentExist(data: any): Observable<any> {
    const API_URL = `${this.SERVER}get-student-pt-allocation`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  autoAllocateStudents(data: any): Observable<any> {
    const API_URL = `${this.SERVER}auto-allocate-students`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }
  addAutoAllocateStudents(data: any): Observable<any> {
    const API_URL = `${this.SERVER}ad-cmpny-allcntn_auto`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }


  getFormConditionalLogic(data: any): Observable<any> {
    const API_URL = `${this.SERVER}custom_form/get-form-conditional-logic`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(error => 
      {
        return error
      }
      )
      // catchError(this.error)
    )
  }

  createFormLogic(payload:any) {
    let API_URL = '';
    if (payload._id) {
      API_URL = `${this.SERVER}custom_form/update-form-conditional-logic`;
    } else {
      API_URL = `${this.SERVER}custom_form/create-form-conditional-logic`;
    }
    return this.http.post(API_URL, payload)
      .pipe(
        map(res => {
          return res;
        }),
        catchError(this.error)
      )
  }

  removeFormLogic(data: any): Observable<any> {
      const API_URL = `${this.SERVER}custom_form/delete-form-conditional-logic`
      return this.http.post(API_URL, data).pipe(
        map(res => {
          return res
        }),
        catchError(error => 
        {
          return error
        }
        )
        // catchError(this.error)
      )
    }


    getreportForm(data: any): Observable<any> {
      const API_URL = `${this.SERVER}custom_form/get_by_type`
      return this.http.post(API_URL, data)
        .pipe(
          map(res => {
            return res;
          }),
          catchError(this.error)
        )
    }


    getreportFormAuto(data: any): Observable<any> {
      const API_URL = `${this.SERVER}custom_form/autofill_incident_report_form`
      return this.http.post(API_URL, data)
        .pipe(
          map(res => {
            return res;
          }),
          catchError(this.error)
        )
    }


    submitReportForm(data: any): Observable<any> {
      const API_URL = `${this.SERVER}incident_report/submit-incident-report`
      return this.http.post(API_URL, data).pipe(
        map(res => {
          return res
        })
      )
    }

    updateReportForm(data: any): Observable<any> {
      const API_URL = `${this.SERVER}incident_report/update-incident-report`
      return this.http.post(API_URL, data).pipe(
        map(res => {
          return res
        })
      )
    }

    getPlcnmtVcncyStdnt(data: any): Observable<any> {
      const API_URL = `${this.SERVER}get-plcnmt-vcncy-stdnt`
      return this.http.post(API_URL, data).pipe(
        map(res => {
          return res
        })
      )
    }

    getPlcnmtVcncyCompnay(data: any): Observable<any> {
      const API_URL = `${this.SERVER}get-plcnmt-vcncy-cmpny`
      return this.http.post(API_URL, data).pipe(
        map(res => {
          return res
        })
      )
    }


    getIncidentReport(data: any): Observable<any> {
      const API_URL = `${this.SERVER}incident_report/get-incident-report`
      return this.http.post(API_URL, data).pipe(
        map(res => {
          return res
        })
      )
    }


  updateStudentFlag(data: any): Observable<any> {
    const API_URL = `${this.SERVER}student/update-student-description-flag`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getSentEmailCompanyNew(data: any): Observable<any> {
    let API_URL = `${this.SERVER}get-sent-emails-company-new`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }
  getCompanyEmployers(data: any): Observable<any> {
    let API_URL = `${this.SERVER}get-company-employers`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }



  getPurgePolicy(data: any): Observable<any> {
    let API_URL = `${this.SERVER}purge_policy/get-purge-policy`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

   getPurgePolicyPendingData(data: any): Observable<any> {
    let API_URL = `${this.SERVER}purge_policy/pending-purge-data`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

   deletePurgePolicy(data: any): Observable<any> {
    let API_URL = `${this.SERVER}purge_policy/delete-purge-policy`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

   createPurgePolicy(data: any): Observable<any> {
    let API_URL = `${this.SERVER}purge_policy/create-purge-policy`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getPurgePolicyById(data: any): Observable<any> {
    let API_URL = `${this.SERVER}purge_policy/get-purge-rule-by-id`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }
  updatePurgePolicy(data: any): Observable<any> {
    let API_URL = `${this.SERVER}purge_policy/update-purge-policy`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }


   impersonateLogin(data: any): Observable<any> {
    let API_URL = `${this.SERVER}auth/impersonate-login`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }
  autoLogout(data: any): Observable<any> {
    let API_URL = `${this.SERVER}auth/auto-logout`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  removeVacancy(data: any): Observable<any> {
    let API_URL = `${this.SERVER}vacancy/remove-vacancy`;
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }



  getEmploymentBreakdown(): Observable<any> {
    let API_URL = `${this.SERVER}employment-breakdown`;
    return this.http.get(API_URL).pipe(
      map(res => {
        return res
      })
    )
  }
  getQuarterlyForecast(state:any): Observable<any> {
    let API_URL = `${this.SERVER}quarterly-forecast?state=`;
    return this.http.get(API_URL+state).pipe(
      map(res => {
        return res
      })
    )
  }
   getUpcommingSiteVisit(): Observable<any> {
    let API_URL = `${this.SERVER}upcoming-site-visits`;
    return this.http.get(API_URL).pipe(
      map(res => {
        return res
      })
    )
  }

  getHcaafexpirations(): Observable<any> {
    let API_URL = `${this.SERVER}hcaaft-expirations`;
    return this.http.get(API_URL).pipe(
      map(res => {
        return res
      })
    )
  }

  getInternshipCompletionDashboard(): Observable<any> {
    let API_URL = `${this.SERVER}internship-completion-dashboard`;
    return this.http.get(API_URL).pipe(
      map(res => {
        return res
      })
    )
  }


  getStaffAllocations(data: any): Observable<any> {
    const API_URL = `${this.SERVER}get-staff-allocations`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  updateStaffAllocationStatus(data: any): Observable<any> {
    const API_URL = `${this.SERVER}update-staff-allocation-status`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      })
    )
  }

  getStaffAllocationDetails(obj: any): Observable<any> {
    let API_URL = `${this.SERVER}get-staff-allocation-details`;
    return this.httpClient.post(API_URL, obj)
      .pipe(
        map(res => {
          return res
        }))
  }
  
  studentFilterFormOptions(data) {
    const API_URL = `${this.SERVER}stdnt-fltr-form-optns`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

  getSubmitformList(data: any): Observable<any> {
    const API_URL = `${this.SERVER}submission_tasks/get-forms-list`
    return this.http.post(API_URL, data)
  }

  getSubmitStudentList(data: any): Observable<any> {
    const API_URL = `${this.SERVER}submission_tasks/students-list-by-form`
    return this.http.post(API_URL, data)
  }

  studentpFilterOptions(data) {
    const API_URL = `${this.SERVER}stdnt-plcmnt-fltr-optns`
    return this.http.post(API_URL, data).pipe(
      map(res => {
        return res
      }),
      catchError(this.error)
    )
  }

   updateFormField(data: any): Observable<any> {
    const API_URL = `${this.SERVER}submission_tasks/update-form-fields`
    return this.http.post(API_URL, data)
  }

  approveDeclineTask(data: any): Observable<any> {
    const API_URL = `${this.SERVER}submission_tasks/bulk-approve-decline-tasks`
    return this.http.post(API_URL, data)
  }

}

