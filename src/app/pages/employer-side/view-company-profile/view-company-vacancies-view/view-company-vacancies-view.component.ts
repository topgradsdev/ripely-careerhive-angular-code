import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';
import { TopgradserviceService } from 'src/app/topgradservice.service';

@Component({
  selector: 'app-view-company-vacancies-view',
  templateUrl: './view-company-vacancies-view.component.html',
  styleUrls: ['./view-company-vacancies-view.component.scss']
})
export class ViewCompanyVacanciesViewComponent implements OnInit {
  @Input() employerProfile: any;
  searchCriteria = {
    keywords: null
  }
    loadedTabs: Set<string> = new Set(); // Track loaded tabs
vacancies:any= [];
  activeTab: string = 'Vacancies';
  selectedTab :any = 'Vacancies';
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private service: TopgradserviceService,
    private sanitizer: DomSanitizer,
    private ngxPermissionService: NgxPermissionsService, private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {

      if(params.tab=='internship' || params.tab=='Vacancies'){
        this.setActiveTab('Vacancies');
        this.selectedTab = "Vacancies";
      }
      if(params.tab=='project'  || params.tab=='Projects'){
        this.setActiveTab('Projects');
        this.selectedTab = "Projects";
      }
     
    });
    sessionStorage.removeItem("redirect");
    console.log("this.updatedPlacementDetail", this.employerProfile);
   this.callApi();
    this.callApiP();
  }

  toggleDescription(index: number) {
    this.vacancies[index].showFull = !this.vacancies[index].showFull;
  }
   toggleDescriptionp(index: number) {
    this.vacanciesp[index].showFull = !this.vacanciesp[index].showFull;
  }

  getShortText(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html || '';
    const plain = div.textContent || div.innerText || '';
    return plain.substring(0, 300); // Truncate to 180 characters
  }


  vacancypage:any = 0;
  vacancylimit:any = 5;
  totalvacancies:any = 0
  totalvacancyList:any = 0
  searchText:any = "";
  searchVacancies(){
    if(this.searchText){
      this.vacancypage = 0;
      this.vacancylimit = 5;
      this.vacancypagep = 0;
      this.vacancylimitp = 5;
      this.getAllVacancies(this.vacancypage);
    }else{
      this.vacancypage = 0;
      this.vacancylimit = 5;
      this.vacancypagep = 0;
      this.vacancylimitp = 5;
      this.getAllVacancies(this.vacancypage);
    }
  }
  getAllVacancies(page: number) {
    this.vacancypage = page;
     this.vacancypagep = page;
    console.log("this.activeTab", this.activeTab)
    // this.activeTab = this.activeTab=='Vacancies' || this.activeTab=='internship' ? 'internship' : 'project';
    // console.log("this.activeTab", this.activeTab)
    if(this.activeTab=='internship' || this.activeTab=='Vacancies'){
      this.callApi();
    }
    if(this.activeTab=='project' || this.activeTab=='Projects'){
      this.callApiP();
    }
   
    // let payload = {
    //   view_type:"admin",
    //   company_id: this.employerProfile._id,
    //   type: this.activeTab === 'Vacancies' ? 'internship' : 'project',
    //   offset: this.vacancypage,
    //   limit: this.vacancylimit
    // };
    // if(this.searchText){
    //   payload['search_keyword'] =this.searchText;
    // }
    // this.service.getAllVacancies(payload).subscribe((res: any) => {
    //   if(res.data.length>0){
    //    this.vacancies = res.data || [];
    //   if (res.count <= this.vacancylimit) {
    //       this.vacancylimit = res.count;
    //     }
    //     this.totalvacancyList = res.count;
    //     this.totalvacancies = Math.ceil(this.totalvacancyList / this.vacancylimit);
    //     this.vacancies.forEach(vacancy => {
    //       vacancy.showFull = false;
    //       vacancy.license_certification = vacancy.license_certification?.split(',') || [];
    //     });
    //   }else{
    //     this.vacancies = [];
    //   }
      
    // }, (err)=>{
    //    this.vacancies = [];
    // });
  }



  callApi(){
    let payload = {
      view_type:"employer",
      company_id: this.employerProfile._id,
      type:  'internship',
      offset: this.vacancypage,
      limit: this.vacancylimit,
      is_posted_vacancy:true,
      // status:"active"
    };
    if(this.searchText){
      payload['search_keyword'] =this.searchText;
    }
    console.log("coccoc")
    this.service.getAllVacancies(payload).subscribe((res: any) => {
      if(res.data.length>0){
       this.vacancies = res.data || [];
      if (res.count <= this.vacancylimit) {
          this.vacancylimit = res.count;
        }
        this.totalvacancyList = res.count;
        this.totalvacancies = Math.ceil(this.totalvacancyList / this.vacancylimit);
        this.vacancies.forEach(vacancy => {
          vacancy.showFull = false;
          vacancy.license_certification = vacancy.license_certification?.split(',') || [];
        });
      }else{
        this.vacancies = [];
      }
      
    }, (err)=>{
       this.vacancies = [];
    });

  }
    vacancypagep:any = 0;
  vacancylimitp:any = 5;
  totalvacanciesp:any = 0
  totalvacancyListp:any = 0
  searchTextp:any = "";
  vacanciesp:any = [];
   callApiP(){
    let payload = {
      view_type:"admin",
      company_id: this.employerProfile._id,
      type: 'project',
      offset: this.vacancypagep,
      limit: this.vacancylimitp,
      status:"active",
      is_posted_vacancy:true,
    };
    if(this.searchText){
      payload['search_keyword'] =this.searchText;
    }
    this.service.getAllVacancies(payload).subscribe((res: any) => {
      if(res.data.length>0){
       this.vacanciesp = res.data || [];
      if (res.count <= this.vacancylimitp) {
          this.vacancylimitp = res.count;
        }
        this.totalvacancyListp = res.count;
        this.totalvacanciesp = Math.ceil(this.totalvacancyListp / this.vacancylimitp);
        this.vacanciesp.forEach(vacancy => {
          vacancy.showFull = false;
          vacancy.license_certification = vacancy.license_certification?.split(',') || [];
        });
      }else{
        this.vacanciesp = [];
      }
      
    }, (err)=>{
       this.vacanciesp = [];
    });

  }

  get startNoteIndex(): number {
    return this.totalvacancyList === 0 ? 0 : this.vacancypage * this.vacancylimit + 1;
  }
  
  get endNoteIndex(): number {
    return Math.min((this.vacancypage + 1) * this.vacancylimit, this.totalvacancyList);
  }
  

  onNextPage() {
    if (this.vacancypage < this.totalvacancies - 1) {
      this.getAllVacancies(this.vacancypage + 1);
    }
  }
  
  onPrevPage() {
    if (this.vacancypage > 0) {
      this.getAllVacancies(this.vacancypage - 1);
    }
  }


   get startNoteIndexp(): number {
    return this.totalvacancyListp === 0 ? 0 : this.vacancypagep * this.vacancylimitp + 1;
  }
  
  get endNoteIndexp(): number {
    return Math.min((this.vacancypagep + 1) * this.vacancylimitp, this.totalvacancyListp);
  }
  

  onNextPagep() {
    if (this.vacancypagep < this.totalvacanciesp - 1) {
      this.getAllVacancies(this.vacancypagep + 1);
    }
  }
  
  onPrevPagep() {
    if (this.vacancypagep > 0) {
      this.getAllVacancies(this.vacancypagep - 1);
    }
  }
  
  


   onChangeSearchKeyword() {
    // if (this.searchCriteria.keywords.length >= 3) {
    //   this.paginationObj = {
    //     length: 0,
    //     pageIndex: 0,
    //     pageSize: this.paginationObj.pageSize,
    //     previousPageIndex: 0,
    //     changed: true,
    // };
    //   this.searchCompany();
    // } else if(!this.searchCriteria.keywords){
    //   this.getCompaniesList();
    // }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
 this.vacancylimit = 5;
    // Add tab to the set of loaded tabs if not already loaded
    if (!this.loadedTabs.has(tab)) {
      this.loadedTabs.add(tab);

      // Perform tab-specific API calls if needed
      this.loadTabData(tab);
    }
    // this.getAllVacancies();
  }

  loadTabData(tab: string): void {
    switch (tab) {
      case 'Vacancies':
        console.log('Loading Pre Vacancies...');
        break;
      case 'Projects':
        console.log('Loading Projects...');
        break;
      default:
        console.log('No data to load for this tab.');
    }
  }


  goToTab(tab) {
    this.selectedTab = tab;
    this.vacancypage = 0;
     this.vacancylimit = 5;
    this.getAllVacancies(this.vacancypage);
  }

  getApplication(item){
    if(item && item.application_receivers_info){
      return item?.application_receivers_info?.map(user => user.full_name).join(', ')
    }else{
      return '';
    }
    
  }

  job_details:any = {};
  selectedJob:any= {};
   updateVacanciesStatus(status) {
    let selectedVacancies = [];
    const payload = {
      _ids: [this.job_details?._id],
      status: status
    }
    this.service.updateVacanciesStatus(payload).subscribe(res => {
        this.getAllVacancies(this.vacancypage);
        this.job_details = {};
        this.selectedJob = {};
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
   }

  resetCheckbox(){
    if(this.vacancies){
      this.vacancies.map(el=>{
        el.selected = false;
      })
    }
     this.job_details = {};
        this.selectedJob = {};
  }

  editVacancy() {
    sessionStorage.setItem("redirect", JSON.stringify({tab:this.activeTab, company_id:this.employerProfile._id, type:'view'}));
    this.router.navigate(["/employer/vacancies/create-vacancies"], {queryParams: {id: this.job_details._id}})
   }
  editProject() {
    sessionStorage.setItem("redirect", JSON.stringify({tab:this.activeTab, company_id:this.employerProfile._id, type:'view'}));
         this.router.navigate(["/employer/vacancies/create-project"], {queryParams: {id: this.job_details._id}})
    }

  viewVacancy() {
    console.log("this.job_details", this.job_details)
  sessionStorage.setItem("redirect", JSON.stringify({tab:this.activeTab, company_id:this.employerProfile._id, type:'view'}));
  if(this.job_details.type=="project"){
    this.router.navigate(["/admin/wil/view-project"], {queryParams: {id: this.job_details._id}})
  }else{
    this.router.navigate(["/admin/wil/view-vacancy"], {queryParams: {id: this.job_details._id}})
  }
  return false;
}

}
