import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TopgradserviceService } from '../../../topgradservice.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { HttpResponseCode } from '../../../shared/enum';
import { MatSort } from '@angular/material/sort';
import { ModalDirective } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-placement-industry-partners',
  templateUrl: './placement-industry-partners.component.html',
  styleUrls: ['./placement-industry-partners.component.scss']
})
export class PlacementIndustryPartnersComponent implements OnInit {
  id: any;
  activeFilter = null;
  searchCriteria = {
    keywords: null,
    placement_id: null
  }
  paginationObj = {
    length: 0,
    pageIndex: 0,
    pageSize: 5,
    previousPageIndex: 0,
    changed:false
  }
  limitOffset = {
    limit: this.paginationObj.pageSize,
    offset: this.paginationObj.pageIndex
  }
  @Input() updatedPlacementDetail;
  // filters = {
  //   LOCATION: 'location',
  //   NO_OF_EMPLOYEES : 'no_of_employees',
  //   NO_OF_VACANCIES : 'no_of_vacancies',
  //   STUDENTS_PLACED : 'student_placed',
  //   PLACEMENT_GROUPS : 'placement_groups',
  // }
  filters = [
    { name: "placementGroups", label: "Placement Group", selected: false, value: "" },
    { name: "post_code", label: "Location", selected: false, value: "" },
    { name: "no_of_employees", label: "No. of Employees", selected: false, value: "" },
    // { name: "lead_source", label: "Lead Source", selected: false, value: ""},
    // { name: "site_status", label: "Site Status", selected: false, value: ""},
    { name: "student_placed", label: "Student Placed", selected: false, value: "" },
    // { name: "conversion_status", label: "Conversion Status", selected: false, value: ""},
    // { name: "whs_check", label: "WHS", selected: false, value: ""},
    // { name: "company_concent_to_use_logo", label: "Site Consent to use Logo", selected: false, value: ""},
  ];
  overAllCount = {
    companies: 0,
    pending_placement: 0,
    placed: 0,
    total_vacancies: 0,
  }
  industryPartnersList: any = []
  isAddNewIndustryPartners: boolean = false;
  isCheck = false;
  selectedRecords = [];
  selectAllCmp = false;
  companyFilters = [];
  company = null;
  companyPlacementGroup = [];
  displayedPlacementColumns: string[] = ['placement_group', 'code', 'start_date', 'end_date', 'status']
  displayedCompanyPlacementColumns: string[] = ['placement_group', 'code', 'start_date', 'end_date', 'status']

  constructor(
    private service: TopgradserviceService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }
//  'contact_01_name', 'contact_01_title', 'contact_01_primary_email', 'contact_01_primary_phone', 'contact_02_name', 'contact_02_title', 'contact_02_primary_email', 'contact_02_primary_phone'

  displayedColumns: string[] = ['company_name', 'company_id', 'contact', 'location', 'abn_acn', 'no_of_employees', 'student_placed', 'placement_groups','vacancies', 'actions']
  dataSource: MatTableDataSource<any>;
  @ViewChild('industryTbSort') industryTbSort = new MatSort();
  ngAfterViewInit() {
    this.activeFilter = { name: 'placementGroups', value: '' };
  }


  refreshData() {
    // Replace with your API call
    this.cleardata();
    this.getIndustryPartners();
    this.companyFilterOptions();
  }
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
      this.getPlacementGroupDetails();
    });
    this.getIndustryPartners();
    this.companyFilterOptions();
  }


  callModel(row){
      const exists = row?.allocated_students?.some(s => s.placement_id ===this.id);
      exists ? this.removeNot.show() : this.removeConfirm.show();
  }
  placementGroupDetails:any

  getPlacementGroupDetails() {
    let payload = { id: this.id };
    this.service.getPlacementGroupDetails(payload).subscribe((response: any) => {
      this.placementGroupDetails = response.result;
      this.imageURL = this.placementGroupDetails.background?this.placementGroupDetails.background:this.imageURL;
      console.log(
        " this.placementGroupDetails",  this.placementGroupDetails
      )
    });
  }


  imageURL: string = '../../../../assets/img/banner_linkedin.svg';
  ngOnChanges(): void {
    console.log(this.updatedPlacementDetail);
    if(this.updatedPlacementDetail){
       this.imageURL = this.updatedPlacementDetail.background?this.updatedPlacementDetail.background:this.imageURL;
    }
  }
  companyFilterOptions() {
    this.service.companyFilterOptions().subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.companyFilters = response.result;
      }
    })
  }
  cleardata(){
this.paginationObj.pageIndex=0;
      this.industryPartnersData= [];
  }

  industryPartnersData:any = [];
  getIndustryPartners() {
    const payload = {
      placement_id: this.id,
      limit: this.paginationObj.pageSize,
      offset: this.paginationObj.pageIndex
    }
    this.service.getIndustryPartners(payload).subscribe((response: any) => {


      if (response.status == HttpResponseCode.SUCCESS) {

        response.result = response.result.map(company => {
          return this.service.transformContactPersonObj(company);
        });
        this.overAllCount.companies = response.companies;
        this.overAllCount.placed = response.placed;
        this.overAllCount.total_vacancies = response.total_vacancies;
        this.overAllCount.pending_placement = response.pending_placement;
        this.paginationObj.length = response.count;
       this.industryPartnersData = [
                   ...new Map(
                     [...this.industryPartnersData, ...response.result]
                       .map(item => [item._id, item])
                   ).values()
                 ];
        this.industryPartnersData.forEach(industry => {
          industry.selected = false
        });
        this.industryPartnersList = new MatTableDataSource(this.industryPartnersData);
        this.industryPartnersList.sort = this.industryTbSort;
      } else {
        if(this.industryPartnersList.data.length>=1){
          this.industryPartnersList = [];
          this.industryPartnersList = new MatTableDataSource(this.industryPartnersList);
        }
        // this.industryPartnersList = [];
        // this.industryPartnersList = new MatTableDataSource(this.industryPartnersList);
      }
    })
  }

  applyFilter(filter) {
    this.activeFilter = filter;
  }

  filterCompanies() {
    const payload = {};
    this.filters.forEach(filter => {
      if (filter.selected || filter.value.length > 0) {
        Object.assign(payload, { [filter.name]: filter.value });
      }
    });
    payload['placement_id'] = [this.id];
    this.service.filterCompanies(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        console.log("cocococococ");
        this.paginationObj.length = response?.result?.length;
        // this.industryPartnersList = response.result;
        this.industryPartnersData = [
            ...new Map(
              [...this.industryPartnersData, ...response.result]
                .map(item => [item._id, item])
            ).values()
          ];
        this.industryPartnersList.forEach(industry => {
          industry.selected = false
        });
        this.industryPartnersList = new MatTableDataSource(this.industryPartnersData);
        this.industryPartnersList.sort = this.industryTbSort;
      } else {
        // this.industryPartnersList = [];
        // this.industryPartnersList = new MatTableDataSource(this.industryPartnersList);
        this.service.showMessage({
          message: "Companies not found for applied filters"
        });
      }
    });
  }

  onChangeSearchKeyword() {
    if (this.searchCriteria.keywords.length >= 3) {
      this.searchCriteria.placement_id = this.id;
      this.paginationObj = {
        length: 0,
        pageIndex: 0,
        pageSize: this.paginationObj.pageSize,
        previousPageIndex: 0,
        changed: true,
    };
     this.cleardata();
      this.searchIndustryPartners()
    } else if (!this.searchCriteria.keywords) {
       this.cleardata();
      this.getIndustryPartners();
    }
  }

  searchIndustryPartners() {
    const payload = {
      ...this.searchCriteria,
      ...this.limitOffset
    }
    this.service.searchCompany(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.paginationObj.length = response.count;
          const newData = response.result || [];
        // Remove duplicates
        const filteredData = newData.filter(
          student => !this.industryPartnersData.some(s => s._id === student._id)
        );
       this.industryPartnersData = [
            ...new Map(
              [...this.industryPartnersData, ...response.result]
                .map(item => [item._id, item])
            ).values()
          ];
        
        this.industryPartnersList.forEach(industry => {
          industry.selected = false
        });
        this.industryPartnersList = new MatTableDataSource(this.industryPartnersData);
        this.industryPartnersList.sort = this.industryTbSort;
      } else {
        // this.industryPartnersList = [];
      }
    })
  }

  addNewIndustryPartners() {
    this.isAddNewIndustryPartners = true;
  }

  getNewIndustryPartners(event) {
    if (event === "back") {
      this.isAddNewIndustryPartners = false;
    } else if (event === "next") {
       this.cleardata();
      this.getIndustryPartners();
    } else {
      this.isAddNewIndustryPartners = false;
       this.cleardata();
      this.getIndustryPartners();
    }
  }

  exportPartnerData(type) {
    const payload = {
      type,
      company_id: this.selectedRecords.length > 0 ? this.selectedRecords.map(company => company._id) : undefined,
      placement_id: this.id
    }
    this.service.exportPartners(payload).subscribe((res: any) => {
      window.open(res.link);
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  updateCompaniesStatus() {
    const selectedCompanies = this.industryPartnersList?.data?.filter(company => company.selected);
    if (selectedCompanies.length === 0) {
      return;
    }
    const payload = {
      comapny_id: selectedCompanies.map(company => company._id),
      placement_id: this.id,
      move_placement: true
    }
    this.service.updateCompaniesStatus(payload).subscribe((res: any) => {
      this.service.showMessage({
        message: "Company detail updated successfully"
      });
       this.cleardata();
      this.getIndustryPartners();
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  selectCompany() {
    this.isCheck = this.industryPartnersList?.data?.some(company => company.selected);
    this.selectedRecords = this.industryPartnersList?.data?.filter(company => company.selected);
    if (this.selectedRecords?.length == this.industryPartnersList?.data?.length) {
      this.selectAllCmp = true;
    } else {
      this.selectAllCmp = false;
    }
  }

  selectAllCompany() {
    for (let company of this.industryPartnersList?.data) {
      if (this.selectAllCmp) {
        company['selected'] = true;
      } else {
        company['selected'] = false;
      }
      this.isCheck = company['selected'];
    }
    this.selectedRecords = this.industryPartnersList?.data.filter(company => company.selected);
  }

  onScrollDown() {
    
    // if (this.loading || this.noMoreData) return;

    // this.loading = true;

    console.log("this.paginationObj.length", this.paginationObj.length)
    console.log("this.eligibleStudentList.data.length", this.industryPartnersList.length)
    if(this.paginationObj.length<10)return;
     if (this.industryPartnersList.length >= this.paginationObj.length) return;
      // alert("calling")
      // Simulate pagination event object
      const nextPageEvent = {
        pageIndex: this.paginationObj?.pageIndex + 1 || 0,
        pageSize: this.paginationObj?.pageSize || 20,
        length: this.paginationObj?.length || 0
      };

      // Call your existing pagination logic
      this.getPaginationData(nextPageEvent);
    // }


    // this.loading = false;
  }


  getPaginationData(event) {
    this.paginationObj = event;
    this.getIndustryPartners();
  }

  goToCompanyProfile(company) {
    this.router.navigate(['/admin/wil/view-company-details'], { queryParams: { company_id: company._id } });
  }

  getCompanyPlacementGroup(company) {
    let payload = {
      company_id: company._id
    }
    this.company = company;
    this.service.getCompanyPlacementGroup(payload).subscribe((res: any) => {
      if (res.status == HttpResponseCode.SUCCESS) {
        this.companyPlacementGroup = res.result;
      } else {
        this.companyPlacementGroup = [];
      }
    })
  }
    displayedCompanyVacanciesColumns: string[] = ['no', 'name', 'vacancy_type', 'allocated', 'placed']

  companyVacancies:any = [];
  getCompanyVacancies(company) {
    this.companyVacancies = [];
    let payload = {
      company_id: company._id
    }
    this.company = company;
    this.service.getCompanyVacancies(payload).subscribe((res: any) => {
      if (res.status == HttpResponseCode.SUCCESS) {
        this.companyVacancies = res.result;
      } else {
        this.companyVacancies = [];
      }
    })
  }

  displayedCompanyPreferredColumns: string[] = ['contact_name', 'department', 'title', 'primary_email', 'primary_phone']
  displayedStudentColumns: string[] = ['Student_Name', 'Student_ID', 'Interview_Status', 'Status']
  companyPreferredContact:any = [];
    getCompanyPreferredContact(company) {
      this.companyPlacementGroup = [];
      let payload = {
        company_id: company._id
      }
      this.company = company;
      this.service.getCompanyPreferredContact(payload).subscribe((res: any) => {
        if (res.code == HttpResponseCode.SUCCESS) {
          console.log("this.companyPreferredContact", this.companyPreferredContact);
          this.companyPreferredContact = res.result;
        } else {
          this.companyPreferredContact = [];
        }
      })
    }

    gotoProfile(data){
       this.router.navigate(['/admin/wil/view-company-details'], { queryParams: { company_id: data._id } });
    }

    studentlist:any;
    @ViewChild('removeConfirm') removeConfirm: ModalDirective;
    @ViewChild('removeNot') removeNot: ModalDirective;
    @ViewChild('removeDone') removeDone: ModalDirective;

    removeVacancy(){
      

       let payload = {
        company_id: this.company._id,
        "placement_id": this.id,
      }
      // this.company = company;
      this.service.removeVacancy(payload).subscribe((res: any) => {
        if (res.status == HttpResponseCode.SUCCESS) {
          this.cleardata();
          this.getIndustryPartners();
          this.removeConfirm.hide();
          this.removeDone.show(); 
          if(this.industryPartnersList.data.length>=1){
          this.industryPartnersList = [];
          this.industryPartnersList = new MatTableDataSource(this.industryPartnersList);
        }
        } else {
           this.service.showMessage({
            message: res.msg ? res.msg : 'Something went Wrong'
          });
        }
      }, (err)=>{
         this.service.showMessage({
          message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
        });
      })
    }


}
