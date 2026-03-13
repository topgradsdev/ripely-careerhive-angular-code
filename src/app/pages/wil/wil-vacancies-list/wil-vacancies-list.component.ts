import { ChangeDetectorRef, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TopgradserviceService } from '../../../topgradservice.service';
import { MatSort } from '@angular/material/sort';
import { HttpResponseCode } from '../../../shared/enum';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LoaderCustomService } from 'src/app/loadercustomservice.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-wil-vacancies-list',
  templateUrl: './wil-vacancies-list.component.html',
  styleUrls: ['./wil-vacancies-list.component.scss']
})
export class WilVacanciesListComponent implements OnInit {
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],                                   
      ['link']   
    ]
  };
  selectedIndex = 1;
  activeFilter = {name: 'company_name', value: ''};
  filters = [
    { name: "company_name", label: "Company Name", selected: false, value: ""},
    { name: "job_location", label: "Location", selected: false, value: ""},
    { name: "vacancy_range", label: "Vacancies", selected: false, value: ""},
    { name: "POST_DATE", label: "Post Date", selected: false, value: ""},
    { name: "job_title", label: "Vacancy Title", selected: false, value: ""},
  ];
  applyFilter(filter) {
    this.activeFilter = filter;
  }
  vacanciesLists = [
    {
      checkbox: '',
      job_title: 'Copywriter',
      ids: '12345',
      company_name: 'Woolworths',
      location: 'Melbourne, VIC',
      vacancies: '5',
      post_date: '24/06/23',
      last_modified: '',
      actions: ''
    },
  ]
  vacanciesArchivedLists = [
    {
      checkbox: '',
      job_title: 'Copywriter',
      ids: '12345',
      company_name: 'Woolworths',
      location: 'Melbourne, VIC',
      job_posted: '24/06/23',
      position_type: 'Full Time',
      end_date: '24/06/23',
      actions: ''
    },
  ]
  displayedColumns: string[] = ['checkbox', 'job_title', '_id', 'company_name', 'location', 'no_of_vacancy', 'createdAt', 'updatedAt', 'actions']
  displayedProjectColumns: string[] = ['checkbox', 'job_title', '_id', 'status', 'company_name', 'location', 'no_of_vacancy', 'createdAt', 'updatedAt', 'actions']
  displayedVacanciesArchivedListsColumns: string[] = ['checkbox', 'job_title', '_id', 'company_name', 'location', 'createdAt', 'position_type', 'end_date', 'actions']
  dataSource: MatTableDataSource<any>;
  @ViewChild('addCompanyPlacement') addCompanyPlacement: ModalDirective;
  
  job_details: any;
  vacanciesList = [];
  activeList: any = [];
  archivedList: any = [];
  selectedRecords = [];
  isSelectedActiveList = false;
  isSelectedArchivedList = false;
  paginationObj = {
    length: 0,
    pageIndex: 0,
    pageSize: 10,
    previousPageIndex: 0,
    changed:false
  }

  searchText: any;
  @ViewChild('activeTbSort') activeTbSort = new MatSort();
  @ViewChild('archivedTbSort') archivedTbSort = new MatSort();
  vacancyFilters = [];
  min_vacancies = null;
  max_vacancies = null;

  constructor(private router: Router, private service: TopgradserviceService, private activeRoute: ActivatedRoute, private loader:LoaderCustomService, private cdr: ChangeDetectorRef, private ngZone: NgZone) { }
  status:any = 'active';
  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe(params => {
      console.log('Tab:', params['tab']);
      if(params['tab']=="project"){
        this.selectedIndex=2;
      }
    });

    this.getAllActiveVacancies();
    this.vacancyFilterOptions();
    this.getPlacementGroups("");
    this.selectAllComp=false;
  }

  vacancyFilterOptions() {
    this.service.vacancyFilterOptions().subscribe((response: any)=>{
      if (response.status == HttpResponseCode.SUCCESS) {
        this.vacancyFilters = response.result;
      }
    })
  }


  exportStudentData(type) {
    let payload = {
       status:this.status?this.status:'active',
      "type": this.selectedIndex === 1? "internship":"project"
    }
     if(this.is_pending){
      payload['is_pending'] = this.is_pending;
      // this.applyStatus = true;
    }
    // if(this.status!="active"){
    //   // this.applyStatus = true;
    // }
    this.service.exportVacancyProjectExprt(payload).subscribe((res: any) => {
      window.open(res.link);
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  getTitle(){
    return 'Selected Parameters: '+this.filterList.join(', ');
  }
  applyStatus:boolean = false;
  archive:boolean = false;
  callApi(status){
    console.log("this.filters", this.filters);
    this.filters.forEach(el=>{
      if(el.selected){
        el.selected =false
      }
      if(el.name && el.name=="vacancy_range"){
        this.min_vacancies = null;
        this.max_vacancies = null;
      }else{
        el.value = "";
      }
        
      
    })
    if(this.activeList.data){
      this.activeList.data.map(el=>{
        el.selected = false;
      })
    }
  
    if(this.archivedList.data){
      this.archivedList.data.map(el=>{
        el.selected = false;
      })
    }
  
    this.isSelectedActiveList = false;
    this.isSelectedArchivedList = false;

    if(status){
      this.status = status;
      this.applyStatus =true;
      this.archive = true;
    }else{
      this.status = this.status? this.status: 'active';
      this.applyStatus =false;
      this.archive = false;
    }
    this.is_pending = false;
    
    // if (this.selectedIndex === 2) {
    //   this.getAllArchivedVacancies();
    // } else {
      this.cleardata();
      this.getAllActiveVacancies();
    // }
      this.selectAllComp=false;
  }

  callApiFilter(){
    console.log("this.filters", this.filters);
    this.filters.forEach(el=>{
      if(el.selected){
        el.selected =false
      }
      if(el.name && el.name=="vacancy_range"){
        this.min_vacancies = null;
        this.max_vacancies = null;
      }else{
        el.value = "";
      }
        
      
    })
    if(this.activeList.data){
      this.activeList.data.map(el=>{
        el.selected = false;
      })
    }
  
    if(this.archivedList.data){
      this.archivedList.data.map(el=>{
        el.selected = false;
      })
    }
  
    this.isSelectedActiveList = false;
    this.isSelectedArchivedList = false;
    this.cleardata();
    this.getAllActiveVacancies();
      this.selectAllComp=false;
  }
  is_pending:any = false;
  applyPending:boolean = false;
  callApi1(status){
   
    if(this.activeList.data){
      this.activeList.data.map(el=>{
        el.selected = false;
      })
    }
  
    if(this.archivedList.data){
      this.archivedList.data.map(el=>{
        el.selected = false;
      })
    }
  
    this.isSelectedActiveList = false;
    this.isSelectedArchivedList = false;

    if(status){

      this.is_pending = true;
      this.applyPending = true;
      this.applyStatus =true;
    }else{
      this.status = 'active';
      this.applyPending = false;
      this.is_pending =false;
    }
    
    // if (this.selectedIndex === 2) {
    //   this.getAllArchivedVacancies();
    // } else {
      this.cleardata();
      this.getAllActiveVacancies();
    // }
      this.selectAllComp=false;
  }

  resetCheckbox(){
    if(this.activeList.data){
      this.activeList.data.map(el=>{
        el.selected = false;
      })
    }
  
    if(this.archivedList.data){
      this.archivedList.data.map(el=>{
        el.selected = false;
      })
    }
    console.log("this.activeList", this.activeList);
    this.isSelectedActiveList = false;
    this.isSelectedArchivedList = false;
      this.selectAllComp=false;
  }


   onCheckboxChange(event: MatCheckboxChange, filter): void {
      console.log('Checkbox changed:', event.checked);
      console.log('this.filters:', this.filters, 'this.filterParameters:', this.filterList, 'filter:', filter, this.activeFilter);
    
      if (event.checked) {
        console.log('Checkbox is selected');
        // Add logic for when the checkbox is selected, if needed.
      } else {
        console.log('Checkbox is deselected');
       
        this.filters.forEach((el:any) => {
          if (filter.name === el.name) {
            filter.value = [];
            // this.activeFilter[filter.name].value = []
            el.value = []; // Corrected 'field' to 'filter.field'
          }
          if (filter.name === "vacancy_range") {
            this.min_vacancies = null;
            this.max_vacancies = null;
        }
        });
      }
    }
    

  isloader:boolean = false;
  
  filterApply:boolean = false;
  filterList:any = [];
  filterCount:any = 0;
  @ViewChild('closeFilterModal') closeFilterModal;
  post_sdate:any="";
  post_edate:any=""

  async filterVacancies() {
      this.selectAllComp=false;
    let previousFilterList = [...this.filterList];
    // this.paginationObj = {
    //   length: 0,
    //   pageIndex: 0,
    //   pageSize: this.paginationObj.pageSize,
    //   previousPageIndex: 0,
    //   changed:true
    // }

    const payload =await {
      limit: this.paginationObj.pageSize, 
      offset: this.paginationObj.pageIndex,
      status: 'active'
    };

    const anySelected =await this.filters.some(filter => filter.selected);

    console.log("anySelected", anySelected, this.filters);
  if (!anySelected) {
    this.service.showMessage({
      message: "Please select the checkbox for filter parameters.",
    });
    // this.closeFilterModal.ripple.trigger.click();
    // this.getAllActiveVacancies();
    return false;
  }


    this.filterList = [];
    let isValid = true; 
    this.filters.forEach(async(filter) => {

      if (filter.selected) {
        this.filterList.push(filter.label);
    
        // Add filter value to the payload unless it's "vacancy_range"
        if (filter.name !== "vacancy_range") {
          Object.assign(payload, {[filter.name]: filter.value});
        }
        if (filter.name === "POST_DATE") {
          payload['post_sdate'] = this.post_sdate;
          payload['post_edate'] = this.post_edate;
        }
    
        // Special case for "vacancy_range"
        if (filter.name === "vacancy_range") {
          if (filter.selected) {
            payload['min_vacancies'] = this.min_vacancies;
            payload['max_vacancies'] = this.max_vacancies;
          }
        }
    
      } else {
        if(this.activeFilter.value.length>0){
          let find = await this.filters.find(el=>el.name==this.activeFilter.name)
          // If the filter value exists but checkbox is not selected, show a message
  
          if(find && !find.selected){
            this.service.showMessage({
              message: "Please select the checkbox for filter parameters.",
            });
           isValid = false;  // Exit early on error
          }
        }
      }
    });
    
    console.log("isValid", isValid,  this.filters);

    // Exit if filters are invalid
    if (!isValid) {
      return;  // Stop further execution and do not call API
    }
  
    if (JSON.stringify(previousFilterList) !== JSON.stringify(this.filterList)) {
        this.paginationObj = {
            length: 0,
            pageIndex: this.paginationObj.pageIndex,
            pageSize: this.paginationObj.pageSize,
            previousPageIndex: 0,
            changed: true,
        };
    } else {
        console.log("Filter list unchanged, skipping pagination reset.");
    }
    

    this.closeFilterModal.ripple.trigger.click();

    payload.status = this.status;
    payload['type'] = this.selectedIndex === 1? "internship":"project"
      this.loader.show();
      this.isloader = true;
    this.service.filterVacancies(payload).subscribe((res: any) => {
      if (res.status == HttpResponseCode.SUCCESS) {
        // if(this.filterList.length>0){
          this.filterApply = true;
        // }
        this.paginationObj.length = res.count?res.count:res.result.length;
        this.filterCount = res.count?res.count:res.result.length;
        // if (this.selectedIndex === 2) {
        //   // this.filterCount = 
        //   this.archivedList = res.result;
        //   if(this.archivedList.length>0){
        //     this.archivedList.forEach(list => {
        //       list.selected = false;
        //       list.company_name = list.company_info[0]?.company_name;
        //       list.location = list.job_location?.name;
        //     });
        //   }
        //   this.archivedList = new MatTableDataSource(this.archivedList);
        //   this.archivedList.sort = this.archivedTbSort;
        //   this.resetCheckbox();
        // } else {
          this.activeData = [...this.activeData, ...res.result];
          
          if(this.activeData.length>0){
            this.activeData.forEach(list => {
              list.selected = false;
              list.company_name = list.company_info[0]?.company_name;
              list.location = list.job_location?.name;
            });
          }
         
          this.activeList = new MatTableDataSource(this.activeData);
          this.activeList.sort = this.activeTbSort;
          this.ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
            this.loader.hide();
          });
          this.isloader = false;
          this.resetCheckbox();
        // }
      } else {
        this.filterApply = true;
        this.filterCount = 0;
        this.archivedList = [];
        this.activeList = []
         this.ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
            this.loader.hide();
          });
          this.isloader = false;
        this.service.showMessage({
          message: "Vacancies not found for applied filters"
        });
      }
    }, (err)=>{
       this.ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
            this.loader.hide();
          });
          this.isloader = false;
    });
  }

  searchVacancies() {
      this.selectAllComp=false;
        if (!this.searchText.trim(' ')) {
          this.btnTabs(this.selectedIndex);
          this.paginationObj = {
              length: 0,
              pageIndex: 0,
              pageSize: this.paginationObj.pageSize,
              previousPageIndex: 0,
              changed: true,
          };
          this.cleardata();
          return;
        }
    
    const payload = {
      search: this.searchText,
      limit: this.paginationObj.pageSize, 
      offset: this.paginationObj.pageIndex,
      status:this.status,
      "type": this.selectedIndex === 1? "internship":"project"
    }
    if(this.is_pending){
      payload['is_pending'] = this.is_pending;
      this.applyStatus = true;
    }
    if(this.status!="active"){
      this.applyStatus = true;
    }
    this.loader.show();
       this.isloader = true;
    this.service.searchVacancies(payload).subscribe((res: any) => {
      // if (this.selectedIndex === 2) {
      //   this.archivedList = res.record;
      //   this.archivedList.forEach(list => {
      //     list.selected = false;
      //     list.company_name = list.company_info[0]?.company_name;
      //     list.location = list.job_location?.name;
      //   });
      //   this.archivedList = new MatTableDataSource(this.archivedList);
      //   this.archivedList.sort = this.archivedTbSort;
      //   this.resetCheckbox();
      // } else {
        // this.activeList = res.record;
        const newData = res.record || [];
        // Remove duplicates
        const filteredData = newData.filter(
          student => !this.activeData.some(s => s._id === student._id)
        );
        this.activeData = [...this.activeData, ...filteredData];
        this.activeData.forEach(list => {
          list.selected = false;
          list.company_name = list.company_info[0]?.company_name;
          list.location = list.job_location?.name;
        });
        this.activeList = new MatTableDataSource(this.activeData);
        this.activeList.sort = this.activeTbSort;
        this.ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
          this.loader.hide();
        });
         this.isloader = false;
        this.resetCheckbox();
      // }
      this.paginationObj.length = res.count;
    }, (err)=>{
      this.ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
          this.loader.hide();
        });
         this.isloader = false;
    });
  }

  countObj:any = {};
  activeData:any = [];
  getAllActiveVacancies() {
    const payload = {
      view_type:"admin",
      limit: this.paginationObj.pageSize, 
      offset: this.paginationObj.pageIndex,
      status: this.status,
      "type": this.selectedIndex === 1? "internship":"project"
    }
    if(this.is_pending){
      payload['is_pending'] = this.is_pending;
      this.applyStatus = true;
    }
    if(this.status!="active"){
      this.applyStatus = true;
    }
    this.loader.show();
     
    this.service.getAllVacancies(payload).subscribe((res: any) => {
      this.countObj = res;
      this.activeData = [...this.activeData, ...res.data];
      this.paginationObj.length = res.count;
      this.filterCount = res.count;
      this.activeData.forEach(list => {
        list.selected = false;
        list.company_name = list.company_info[0]?.company_name;
        list.location = list.job_location?.name;
      });
      this.activeList = new MatTableDataSource(this.activeData);
      this.activeList.sort = this.activeTbSort;

    this.ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
            this.loader.hide();
          });
          this.isloader = false;
      this.resetCheckbox();
    }, (err)=>{
       this.ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
        this.loader.hide();
      });
        this.isloader = false;
    });
  }

  // getAllArchivedVacancies() {
  //   const payload = {
  //     limit: this.paginationObj.pageSize, 
  //     offset: this.paginationObj.pageIndex,
  //     status: 'inactive'
  //   }
  //   this.service.getAllVacancies(payload).subscribe((res: any) => {
  //     this.archivedList = res.data;
  //     this.paginationObj.length = res.count;
  //     this.archivedList.forEach(list => {
  //       list.selected = false;
  //       list.company_name = list.company_info[0]?.company_name;
  //       list.location = list.job_location?.name;
  //     });
  //     this.archivedList = new MatTableDataSource(this.archivedList);
  //     this.archivedList.sort = this.archivedTbSort;
  //     this.resetCheckbox();
  //   });
  // }

  btnTabs(index: number) {
      this.selectAllComp=false;
    // return;
   this.paginationObj = {
      length: 0,
      pageIndex: 0,
      pageSize: 10,
      previousPageIndex: 0,
      changed:true
    }

    console.log("index", index)
    this.searchText = '';
    this.selectedIndex = index;
    this.status = this.status?this.status:'active';
    this.applyStatus = false;
    // if (index === 2) {
    //   this.getAllArchivedVacancies();
    // } else {
      this.cleardata();
      this.getAllActiveVacancies();
    // }
    this.filterApply = false;
    this.filters.forEach(el=>{
      if(el.selected){
        el.selected =false
      }
      if(el.name && el.name=="vacancy_range"){
        this.min_vacancies = null;
        this.max_vacancies = null;
      }else{
        el.value = "";
      }
        
      
    })
    
    this.resetCheckbox();
  }
  editVacancy() {
    this.router.navigate(["/admin/wil/create-vacancy"], {queryParams: {id: this.job_details._id}})
   }
   editProject() {
    this.router.navigate(["/admin/wil/create-project"], {queryParams: {id: this.job_details._id}})
   }

   addPlacementGroup(){

   }
   viewVacancy() {
    console.log("this.job_details", this.job_details);
    if(this.job_details.type=="project"){
      this.router.navigate(["/admin/wil/view-project"], {queryParams: {id: this.job_details._id}})
    }else{
      this.router.navigate(["/admin/wil/view-vacancy"], {queryParams: {id: this.job_details._id}})
    }
    return false;
  
   }
   selectedActiveList:any = [];
   selectVacancy() {
    this.isSelectedActiveList = this.activeList?.data?.some(list => list.selected) || false;
    this.selectedActiveList = this.activeList?.data?.filter(list => list.selected) || [];

    this.isSelectedArchivedList = this.archivedList?.data?.some(list => list.selected) || false;
    // this.selectedArchivedList = this.archivedList?.data?.filter(list => list.selected) || [];


    console.log("this.isSelectedActiveList", this.isSelectedActiveList, this.selectedActiveList, this.isSelectedArchivedList);
   }
  selectAllComp: boolean = false;

  selectAllVacancy() {
    if (this.activeList?.data) {
      for (let company of this.activeList.data) {
        company['selected'] = this.selectAllComp; // bind to checkbox state
      }

      // Update selected list
      this.selectedActiveList = this.activeList.data.filter(list => list.selected) || [];
      this.isSelectedActiveList = this.selectedActiveList.length > 0;
    }
  }

  selectAllProject() {
    if (this.activeList?.data) {
      for (let company of this.activeList.data) {
        company['selected'] = this.selectAllComp; // bind to checkbox state
      }

      // Update selected list
      this.selectedActiveList = this.activeList.data.filter(list => list.selected) || [];
      this.isSelectedActiveList = this.selectedActiveList.length > 0;
    }
  }

   async getName(){
    // let data = this.activeList.data
    // .filter(el => el.selected) // Filter selected items
    // .map(el => el.name) // Extract names
    // .join(", "); // Join names with a comma and space

    // if(data){
    //   return data;
    // }else{
        return this.selectedJob?.job_title;
    // }

   }

  async getName1(){
    // let data = this.archivedList.data
    // .filter(el => el.selected) // Filter selected items
    // .map(el => el.name) // Extract names
    // .join(", "); // Join names with a comma and space

    // if(data){
    //   return data;
    // }else{
        return this.selectedJob?.job_title;
    // }

   }

   selectedJob:any = {};
   getVacancyDetails(vacancy) {
    this.job_details = vacancy;
    const vac = Object.assign({}, this.job_details, this.job_details?.company_info[0]);
    this.selectedRecords = [vac];
   }

   updateVacanciesStatus(status) {
    let selectedVacancies = [];
    // if (this.selectedIndex === 1) {
      selectedVacancies = this.activeList.data.filter(vacancy => vacancy.selected);
    // } else {
    //   selectedVacancies = this.archivedList.data.filter(vacancy => vacancy.selected);
    // }
    const payload = {
      _ids: selectedVacancies.length > 0 ? selectedVacancies.map(vacancy => vacancy._id) : [this.job_details?._id],
      status: status
    }
    this.service.updateVacanciesStatus(payload).subscribe(res => {
      // this.callApi('');
      // this.cleardata();
        this.getAllActiveVacancies();
          this.selectAllComp=false;
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
   }

   onScrollDown() {
    
    // if (this.loading || this.noMoreData) return;

    // this.loading = true;

    console.log("this.paginationObj.length", this.paginationObj.length)
    console.log("this.eligibleStudentList.data.length", this.activeList.data.length)
    if(this.paginationObj.length<10)return;
     if (this.activeList?.data.length >= this.paginationObj.length) return;
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

  cleardata(){
this.paginationObj.pageIndex=0;
    this.paginationObj.pageIndex=0;
    this.activeList = new MatTableDataSource<any>([]);
    this.activeList.data = []; 
    this.activeData = []; 
  }

  async getPaginationData(event) {
    this.paginationObj = event;
    if(this.filters.length>0){
      let find = await this.filters.find(el=>el.selected);
      if(find){
        if(this.searchText){
          this.searchVacancies();
        }else{
          this.filterVacancies();
        }
       
      }else{
        // if (this.selectedIndex === 2) {
        //   this.getAllArchivedVacancies();
        // } else {
          if(this.searchText){
            this.searchVacancies();
          }else{
            this.getAllActiveVacancies();
          }
         
        // }
      }
     
    }else{
      // if (this.selectedIndex === 2) {
      //   this.getAllArchivedVacancies();
      // } else {
        if(this.searchText){
            this.searchVacancies();
          }else{
            this.getAllActiveVacancies();
          }
      // }
    }
    
    this.resetCheckbox();
  }

  handleCancel() {
    // this.resetCheckBox();
    // Handle cancel action
  }

  handleSend() {
    this.selectedRecords = [];
    // Handle send action
  }

  placementGroups = [];
  placemenGroupIds = [];
  selectedStudentsCanAddToPlacementGroup = [];
  selectedPlacementGroupToAdd: any = {};

  getPlacementGroups(event) {
    const keyword = event?.target?.value || '';
    const payload = {
      status: 'active',
      limit: 1000,
      offset: 0,
      keywords: keyword,
      placement_group_type:'intership'
    }
    this.service.getPlacementGroupForCompanyList(payload).subscribe((res: any) => {
      if (res && res.result) {
        this.placementGroups = res.result;
      } else {
        this.placementGroups = []; // Ensure array is reset if no results
      }
    });

  }

@ViewChild('placementAdded', { static: false }) placementAdded: ModalDirective;  
@ViewChild('successAssignPG', { static: false }) successAssignPG: ModalDirective;  


  // validateCanAddToPlacementGroup() {
  //     this.selectedStudentsCanAddToPlacementGroup = this.activeList.data.filter(company => company.selected).map(company => company._id);
  //     this.selectedPlacementGroupToAdd = this.placementGroups.find(placemenGroup => placemenGroup._id == this.placemenGroupIds);
  
  //     if (this.selectedStudentsCanAddToPlacementGroup.length === 0) {
  //       return;
  //     }
  
  //     const payload = {
  //       student_ids: this.selectedStudentsCanAddToPlacementGroup
  //     }
  
  //     this.service.getUnplacementStudent(payload).subscribe((res: any) => {
  //       if (res.status != HttpResponseCode.SUCCESS) {
         
  //         //No students can be added in a Simulation Group
  //         this.noStudentsAddPopUp.ripple.trigger.click();
  //       } else if (res.result.length && res.result.length != this.selectedStudentsCanAddToPlacementGroup.length) {
  //         //Partial students can be added in a Simulation Group
          
  //         this.addStudentList = new MatTableDataSource(res.result);
  //         this.partialStudentAddPopup.ripple.trigger.click();
  //       } else {
  //         //All students can be added in a Simulation Group
  //         this.addStudentList = new MatTableDataSource(res.result);
  //         this.allStudentAddPopUp.ripple.trigger.click();
  //         this.addToPlacementGroup();
  //       }
  //       this.selectedRecords = [];
  //     })
  //   }
  message:any = '';
  filterArray :any = [];
  async addToPlacementGroup() {
    this.filterArray = [];
      let find =await this.placementGroups.find(el=>el._id==this.placemenGroupIds);
      let array = this.activeList.data.filter(el=>el.selected);
this.message = find;
      console.log("find", find,   this.placemenGroupIds, array);
    // return false;
    this.filterArray = array;
      const grouped = Object.values(
         array.reduce((acc: any, curr: any) => {
          if (!acc[curr.company_id]) {
            acc[curr.company_id] = {
              company_id: curr.company_id,
              vacancy_ids: []
            };
          }
          acc[curr.company_id].vacancy_ids.push(curr._id); // using _id as vacancy_id
          return acc;
        }, {})
      );

      // return false;
      const payload = {
        // company_id: this.job_details?.company_id,
        placement_id: this.placemenGroupIds,
        data:grouped
      }

//       {
//   "placement_id": "68a83f9520c53ec1e532a42e",
  // "data": [
  //   {
  //     "company_id": "686e0cc0b03a7f1ea7d472ef",
  //     "vacancy_ids": [
  //       "68a8262720c53ec1e532a027"
  //     ]
  //   }
  // ]
// }
  
      this.service.updateProjectPlacement(payload).subscribe((res: any) => {
        if (res.status === HttpResponseCode.SUCCESS) {
          // this.message = `${this.job_details.job_title} has been added to ${find.title}`;
          this.addCompanyPlacement.hide();
          this.successAssignPG.show();
          this.getAllActiveVacancies();
          this.service.showMessage({ message: res.msg });
        }
      })
    }

    successMessage:any = ''
    @ViewChild('approveProjectSuccess', { static: false }) approveProjectSuccess: ModalDirective;  

    approveProject(status){

      const ids = this.activeList.data
      .filter(item => item.selected)
      .map(item => item._id);


      console.log(ids, this.job_details);

      
      const payload = {
        status: status,
        project_ids:  ids.length >0? ids:[this.job_details._id]
      }
      console.log("payload", payload)
      this.service.ProjectApproveDisapprove(payload).subscribe(async(res: any) => {
        if (res.status === HttpResponseCode.SUCCESS) {
          console.log("ids", ids, this.activeList)
          if(ids.length>0){
              if(ids.length>1){
                this.successMessage = `${ids.length} Project has been approved!`;
              }else{
                let find = await this.activeList.data.find(el=>el._id==ids[0]);
                if(find){
                  this.successMessage = `${find.job_title} Project has been approved!`;
                }
              }
          }else{
            this.successMessage = `${this.job_details.job_title} has been approved!`;
          }

            this.selectAllComp=false;
          // this.successMessage = `${this.job_details.job_title} has been added to ${find.title}`;
          this.approveProjectSuccess.show();
          this.cleardata();
          this.getAllActiveVacancies();
          this.service.showMessage({ message: res.msg });
        }
      })
    }

    comment:any = '';
    @ViewChild('disApproveProjectSuccess', { static: false }) disApproveProjectSuccess: ModalDirective;  

    disApproveProject(status){

      const ids = this.activeList.data
      .filter(item => item.selected)
      .map(item => item._id);


      console.log(ids, this.job_details);

      
      const payload = {
        status: status,
        project_ids:[this.job_details._id],
        comment:this.comment
      }
      console.log("payload", payload)
      this.service.ProjectApproveDisapprove(payload).subscribe(async(res: any) => {
        if (res.status === HttpResponseCode.SUCCESS) {
          if(ids.length>0){
              if(ids.length>1){
                this.successMessage = `${ids.length} Project has been approved!`;
              }else{
                let find = await this.activeList.find(el=>el._id==ids[0]);
                if(find){
                  this.successMessage = `${find.job_title} Project has been approved!`;
                }
              }
          }else{
            this.successMessage = `${this.job_details.job_title} has been approved!`;
          }

            this.selectAllComp=false;
          // this.successMessage = `${this.job_details.job_title} has been added to ${find.title}`;
          this.disApproveProjectSuccess.show();
          this.cleardata();
          this.getAllActiveVacancies();
          this.service.showMessage({ message: res.msg });
        }
      })
    }


    goToCompanyProfile(company) {
      this.router.navigate(['/admin/wil/view-company-details'], { queryParams: { company_id: company.company_id } });
    }


    resetForm(){
      this.selectedRecords = [];
      this.placemenGroupIds = [];
      this.selectAllComp = false;
      this.placementGroups= [];
      this.addCompanyPlacement.hide();
      this.activeList.data.map(company => {
        company.selected=false;
      });
  }
placement:any= "";
  @ViewChild('successAssignPGExist') successAssignPGExist: ModalDirective;
  async checkExist(){
      console.log(":this.placemenGroupIds", this.placemenGroupIds);
      let find = await this.placementGroups.find(el=>el._id ==  this.placemenGroupIds);
        console.log("find", find)

        // return false;
      if(find && find.is_vacancy && find.category_id !="65a21e05fa6a8e4f5b252993"){
        this.placement = find;
        this.addCompanyPlacement.hide();
        this.successAssignPGExist.show();
      }else{
        this.addToPlacementGroup();
      }
      return false;
    }

}

