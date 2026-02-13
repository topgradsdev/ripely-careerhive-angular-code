import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { HttpResponseCode } from 'src/app/shared/enum';
import { FileIconService } from 'src/app/shared/file-icon.service';
import { TopgradserviceService } from 'src/app/topgradservice.service';

@Component({
  selector: 'app-subsidiaries-list',
  templateUrl: './subsidiaries-list.component.html',
  styleUrls: ['./subsidiaries-list.component.scss']
})
export class SubsidiariesListComponent implements OnInit {
    projectPendingTask:any = [
      {toggle:false}
    ];
    @Input() employerProfile: any;
    addCompanyForm: FormGroup;
    @ViewChild('addChildCompany') addChildCompany: ModalDirective;
    @ViewChild('addChildCompanySuccess') addChildCompanySuccess: ModalDirective;
    @ViewChild('removeChildCompanyConfirm') removeChildCompanyConfirm: ModalDirective;
     
    companyList:any = [
    {
      id: 1513,
      name: 'Qantas',
      location: 'Mascot, NSW',
      logoUrl: 'assets/logos/qantas.png'
    },
    {
      id: 1514,
      name: 'Marriott',
      location: 'Melbourne, VIC',
      logoUrl: 'assets/logos/marriott.png'
    }
  ];
    constructor(private service: TopgradserviceService,
      private activatedRoute: ActivatedRoute,
      private fb: FormBuilder,
      private location: Location,
      private router: Router, 
      private sanitizer: DomSanitizer, 
      private http: HttpClient, 
      private fileIconService: FileIconService) { }

    ngOnInit(): void {
      this.addCompanyForm = this.fb.group({
        company_id: [this.employerProfile._id, Validators.nullValidator],
        parent_company_id: [null, Validators.required],
      });
      this.getChildCompany();
      this.getContactList();
    }
    contactList: any = [];
    getContactList() {
      this.service.getCommonCompany().subscribe((res:any) => {
        if (res.code == 200) {
          this.contactList = res.result;
        } else {
            this.contactList = [];
        }
      }, err => {
        this.service.showMessage({
          message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
        });
      })
    }
    companies:any = []
    getChildCompany() {
      this.service.getChildCompanyBYHQ({parent_id: this.employerProfile._id}).subscribe((res:any) => {
          if (res.code == 200) {
          this.companies = res.result;
         
        } else {
            this.companies = [];
        }
      }, err => {
        this.service.showMessage({
          message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
        });
      })
    }

    
    selectedCompnay:any;
    addCompany(){
      console.log("this.addCompanyForm", this.addCompanyForm);
      let body ={ company_id:this.addCompanyForm.value.parent_company_id, parent_id:this.employerProfile._id, is_child:true }
      this.service.addChildCompanyBYHQ(body).subscribe((res:any) => {
          if (res.code == 200) {
          this.addChildCompany.hide();
          this.addChildCompanySuccess.show();
          this.ngOnInit();
        } else {
        }
      }, err => {
        this.service.showMessage({
          message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
        });
      })
    }
    removeChildCompany(){

      this.service.removeChildCompany({company_id:this.selectedCompnay._id}).subscribe((res:any) => {
          if (res.code == 200) {
          this.selectedCompnay = null;
          this.service.showMessage({ message: res.msg?res.msg:'Successfully remove child company' });
          this.removeChildCompanyConfirm.hide()
          this.getChildCompany();
        } else {
          this.service.showMessage({ message: res.msg });
        }
      }, err => {
        this.service.showMessage({
          message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
        });
      })
      ;
    }

    isSelected(item: any): boolean {
      const selected = this.addCompanyForm.get('parent_company_id')?.value || [];
      return selected.includes(item.id);
    }
    
    gotoProfile(data){
      console.log("data", data)
        this.router.navigate(["/admin/wil/view-company-details"], {queryParams: {company_id: data._id, tab:'overview'}});
    }
}
