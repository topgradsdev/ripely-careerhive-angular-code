import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TopgradserviceService } from '../../../topgradservice.service';
import {HttpResponseCode, PlacementGroupStatus} from '../../../shared/enum';
import { Utils } from '../../../shared/utility';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-placement-groups-list',
  templateUrl: './placement-groups-list.component.html',
  styleUrls: ['./placement-groups-list.component.scss']
})

export class PlacementGroupsListComponent implements OnInit {
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],                                   
      ['link']   
    ]
  };
  pass: String = 'password';
  password = null;
  imageURL: string;
  createPlacementGroup: FormGroup;
  confirmPassword: FormGroup;
  placementGroupStatusEnum = PlacementGroupStatus;
  placementGroupStatus: string = this.placementGroupStatusEnum.ACTIVE;
  
  searchCriteria = {
    status: null,
    keywords: null
  }
  
  paginationObj = {
    length: 0,
    pageIndex: 0,
    pageSize: 10,
    previousPageIndex: 0,
    changed:false
  }

  limitOffset = {
    limit: this.paginationObj.pageSize, 
    offset: this.paginationObj.pageIndex
  }
  selectedPlacementGroup: any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('closeCreatePlacemenGroupModal') closeCreatePlacemenGroupModal;
  @ViewChild('successPlacementGroupModal') successPlacementGroupModal: any;
  @ViewChild('closeConfirmPasswordModal') closeConfirmPasswordModal: any;
  @ViewChild('placementGroupTbSort') placementGroupTbSort = new MatSort();

  constructor(private service: TopgradserviceService, public utils: Utils) { }

  btnTabs(status: string) {
    this.placementGroupStatus = status;
     this.placementGroupList = new MatTableDataSource<any>([]);
    this.placementGroupList.data = []; 
    this.placementList = []; 

    this.getPlacementGroups(this.placementGroupStatus);
  }
  placementGroupList:any = [];

  placementArchiveList = [];

  displayedPlacementActiveColumns: string[] = [ 
    'code', 
    'title', 
    'industry', 
    'category_name',
    'updated_at',
    'publish_at',
    // 'archived_at',
    'publish_by',
    'student_count',
    // 'staff',
    'actions'
  ];

  displayedPlacementArchiveColumns: string[] = [ 
    'code', 
    'title', 
    'industry', 
    'category_name',
    'updated_at',
    'publish_at',
    // 'archived_at',
    'publish_by',
    'student_count',
    // 'staff',
    'actions'
  ];

  placementGroup =  {
    title: null,
    description: '',
    code: null,
    background: null,
    start_date: null,
    end_date: null,
    industry_id: null,
    category_id: null,
    staff_id: null,
    created_by_id : null, 
    created_by: null
  }

  placementCategories = [];
  placementIndustries = [];
  staffMembers = [];

  clearFomr(){
     this.createPlacementGroup = new FormGroup({
      background: new FormControl('', []),
      title: new FormControl('', [Validators.required]),
      code: new FormControl('', Validators.required),
      description: new FormControl('', Validators.nullValidator),
      category_id: new FormControl('', Validators.required),
      industry_id: new FormControl('', Validators.required),
      staff_id: new FormControl('', Validators.required),
      show_eligible_criteria:new FormControl(true, Validators.nullValidator),
      // start_date: new FormControl(''),
      // end_date: new FormControl('')
    });
    this.getPlacementCategories();
  }
  ngOnInit(): void {
    this.createPlacementGroup = new FormGroup({
      background: new FormControl('', []),
      title: new FormControl('', [Validators.required]),
      code: new FormControl('', Validators.required),
      description: new FormControl('', Validators.nullValidator),
      category_id: new FormControl('', Validators.required),
      industry_id: new FormControl('', Validators.required),
      staff_id: new FormControl('', Validators.required),
      show_eligible_criteria:new FormControl(true, Validators.nullValidator),
      // start_date: new FormControl(''),
      // end_date: new FormControl('')
    });
    this.confirmPassword = new FormGroup({
      password: new FormControl('', [Validators.required])
    });
    this.getPlacementGroupsCount();
    this.getPlacementGroups(this.placementGroupStatus);
    // this.getPlacementCategories();
    this.getPlacementIndustries();
    this.getStaffMembers();
  }

  countObj:any ={}
  getPlacementGroupsCount(){
   
    this.service.getPlacementGroupsCount({}).subscribe((response: any)=>{
      if (response.status == HttpResponseCode.SUCCESS) {
        this.countObj = response.data;
      } else {
        this.countObj = {};
      }
    })
  }
  pgStatuds:any = 'active';
  filterObj:any = {};
  callApi(data:any){
    console.log("data", data)
    if(data && Object.keys(data).length>0){
      this.filterObj = data;
      this.pgStatuds = 'inactive';
       this.placementGroupList = new MatTableDataSource<any>([]);
          this.placementGroupList.data = []; 
          this.placementList = []; 
        this.paginationObj.pageIndex = 0;
      this.getPlacementGroups('inactive');
    }else{
      this.filterObj = {};
      this.pgStatuds = 'active';
      this.placementGroupList = new MatTableDataSource<any>([]);
      this.placementGroupList.data = []; 
      this.placementList = []; 
      this.paginationObj.pageIndex = 0;
      this.placementGroupStatus = this.placementGroupStatusEnum.ACTIVE;
      this.getPlacementGroups('active');
    }
   
  
  }
  
  applyfilter:boolean = false;
  getPlacementGroups(status:string) {
    const payload = {
      status, 
      limit: this.paginationObj.pageSize, 
      offset: this.paginationObj.pageIndex,
      ...this.filterObj
    }
    this.service.getPlacementGroups(payload).subscribe((response: any)=>{
      if (response.status == HttpResponseCode.SUCCESS) {
        console.log(this.filterObj, "this.filterObj")
        if(this.filterObj && (this.filterObj.archive_placements || this.filterObj.archive_projects)){
          this.applyfilter = true;
        }else{
          this.applyfilter = false;
        }
        this.paginationObj.length = response.count;
        this.placementList = [...this.placementList, ...response.result];
        for (let i = 0; i < this.placementGroupList.length; i++) {
          if (this.placementGroupList[i].updated_at) {
            let convertUpdateDate = new Date(Number(this.placementGroupList[i].updated_at));
            this.placementGroupList[i].updated_at = Utils.convertDate(convertUpdateDate, 'MM/DD/YY hh:mm A');
          }
          if (this.placementGroupList[i].publish_at) {
            let convertPublishDate = new Date(Number(this.placementGroupList[i].publish_at));
            this.placementGroupList[i].publish_at = Utils.convertDate(convertPublishDate, 'MM/DD/YY hh:mm A');
          }
        }
        this.placementGroupList = new MatTableDataSource(this.placementList);
        this.placementGroupList.sort = this.placementGroupTbSort;
      } else {
        if(this.filterObj && (this.filterObj.archive_placements || this.filterObj.archive_projects)){
          this.applyfilter = true;
        }else{
          this.applyfilter = false;
        }
        this.paginationObj.length = 0;
        this.placementGroupList = [];
      }
    })
  }
  
  getPlacementCategories() {
    this.service.getPlacementCategories({}).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.placementCategories = response.result;

        if (this.placementCategories?.length) {
          const lastCategory = this.placementCategories[this.placementCategories.length - 1];

          this.createPlacementGroup.patchValue({
            category_id: lastCategory._id
          });

          // Disable after value is set
          setTimeout(() => {
            this.createPlacementGroup.get('category_id')?.disable();
          });
        }
      }
    });
  }

  getPlacementIndustries() {
    this.service.getPlacementIndustries({}).subscribe((response: any)=>{
      if (response.status == HttpResponseCode.SUCCESS) {
        this.placementIndustries = response.result;
      }
    })
  }

  getStaffMembers() {
    this.service.getStaffMembers({}).subscribe((response: any)=>{
      if (response.status == HttpResponseCode.SUCCESS) {
        this.staffMembers = response.result;
      }
    })
  }
 
  codeExist:boolean = false;
  checkCode() {
    console.log("calling===", this.createPlacementGroup.value.code)
    this.service.checkPGCode({code:this.createPlacementGroup.value.code}).subscribe((response: any)=>{
      console.log("response", response)
      if(response.exist){
        this.codeExist = true;
      }else{
        this.codeExist = false;
      }
    })
  }
 

  onSubmit(){
    console.log("this.createPlacementGroup", this.createPlacementGroup.getRawValue())
    if (this.createPlacementGroup.valid) {
      const userDetail = JSON.parse(localStorage.getItem('userDetail'));
      this.placementGroup = this.createPlacementGroup.getRawValue();
      this.placementGroup.created_by_id =  userDetail?._id;
      this.placementGroup.created_by = `${userDetail.first_name} ${userDetail.last_name}`;
      if(!this.placementGroup.description){
        this.placementGroup.description = '';
      }
      // this.placementGroup.start_date = Utils.convertDate(this.placementGroup.start_date, 'YYYY-MM-DD');
      // this.placementGroup.end_date = Utils.convertDate(this.placementGroup.end_date, 'YYYY-MM-DD');
      this.service.createPlacementGroup(this.placementGroup).subscribe((response: any)=>{
        if (response.status == HttpResponseCode.SUCCESS) {
          this.closeCreatePlacemenGroupModal.ripple.trigger.click();
          this.openModal(this.successPlacementGroupModal);
          this.successPlacementGroupModal.nativeElement.classList.add('show');
          this.service.showMessage({message: response.msg});
          this.placementGroupList = new MatTableDataSource<any>([]);
          this.placementGroupList.data = []; 
          this.placementList = []; 
          this.paginationObj.pageIndex = 0;
          this.getPlacementGroups(this.placementGroupStatus);
        }
      })
    } else {
      this.createPlacementGroup.markAllAsTouched();
    }
  }

  checkFieldInvalid(field) {
    return this.createPlacementGroup.get(field)?.invalid && (this.createPlacementGroup.get(field)?.dirty || this.createPlacementGroup.get(field)?.touched);
  }

  // checkInvalidFieldPassrordForm(field) {
  //   return this.confirmPassword.get(field)?.invalid && (this.confirmPassword.get(field)?.dirty || this.confirmPassword.get(field)?.touched);
  // }

  checkInvalidFieldPassrordForm(field: string): boolean {
    return (
      this.confirmPassword?.get(field)?.invalid &&
      (this.confirmPassword.get(field)?.dirty || this.confirmPassword.get(field)?.touched)
    ) ?? false;
  }

  onCancel() {
    this.createPlacementGroup.reset();
  }

  showPreview(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.createPlacementGroup.get('background').updateValueAndValidity();
    // File Preview
    // const reader = new FileReader();
    // reader.onload = () => {
    //   this.imageURL = reader.result as string;
    //   this.createPlacementGroup.patchValue({
    //     background: this.imageURL
    //   });
    // }
    // reader.readAsDataURL(file);
      const formData = new FormData();
      formData.append('media', file);
      this.service.uploadOthersMedia(formData).subscribe((resp: any) => {
        this.imageURL = resp.url;
        this.createPlacementGroup.patchValue({
          background: this.imageURL
        });
      });
  }

  onChangeSearchKeyword() {
    if (this.searchCriteria.keywords.length >= 3) {
      this.paginationObj = {
        length: 0,
        pageIndex: 0,
        pageSize: this.paginationObj.pageSize,
        previousPageIndex: 0,
        changed: true,
    };
      this.placementGroupList = new MatTableDataSource<any>([]);
          this.placementGroupList.data = []; 
          this.placementList = []; 
      this.searchPlacementGroup();
    } else if(!this.searchCriteria.keywords) {
        this.placementGroupList = new MatTableDataSource<any>([]);
          this.placementGroupList.data = []; 
          this.placementList = []; 
      this.getPlacementGroups(this.placementGroupStatus);
    }
  }

  placementList:any = [];
  searchPlacementGroup() {
    this.searchCriteria.status = this.placementGroupStatus;
    const payload = {
      ...this.searchCriteria,
      ...this.limitOffset
    }
    
    this.service.searchPlacementGroup(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.paginationObj.length =  response.count;
        this.placementList = [...response.result];
        for (let i = 0; i < this.placementGroupList.length; i++) {
          if (this.placementGroupList[i].updated_at) {
            let convertUpdateDate = new Date(Number(this.placementGroupList[i].updated_at));
            this.placementGroupList[i].updated_at = Utils.convertDate(convertUpdateDate, 'MM/DD/YY hh:mm A');
          }
          if (this.placementGroupList[i].publish_at) {
            let convertPublishDate = new Date(Number(this.placementGroupList[i].publish_at));
            this.placementGroupList[i].publish_at = Utils.convertDate(convertPublishDate, 'MM/DD/YY hh:mm A');
          }
        }
        this.placementGroupList = new MatTableDataSource(this.placementList);
        this.placementGroupList.sort = this.placementGroupTbSort;

      } else {
        this.placementGroupList = [];
      }
    })
  }



  getPaginationData(event) {
    this.paginationObj = event;
    if (this.searchCriteria && this.searchCriteria.keywords && this.searchCriteria.keywords.length >= 3) {
      this.searchPlacementGroup();
    }else{
       this.getPlacementGroups(this.placementGroupStatus);
    }
   
  }
    onScrollDown() {
    
    // if (this.loading || this.noMoreData) return;

    // this.loading = true;

    console.log("this.paginationObj.length", this.paginationObj.length)
    console.log("this.eligibleStudentList.data.length", this.placementGroupList.data.length)
    if(this.paginationObj.length<10)return;
     if (this.placementGroupList?.data.length >= this.paginationObj.length) return;
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


  archiveGroup() {
    this.password = null;
    if (this.selectedPlacementGroup?.is_publish) {
      document.getElementById('archivedPopup')?.click();
    } else{
      document.getElementById('confirmPasswordPopup')?.click();
    }
  } 

  checkPassword() {
    const userDetail = JSON.parse(localStorage.getItem('userDetail'));
    const payload = {
      email_id: userDetail?.email,
      password: this.password
    }
    return this.service.confirmPassword(payload).toPromise().catch((error) => {
      this.service.showMessage({message: error?.error?.errors?.msg});
    });
  }

  async archivePlacementGroup() {
    const isPasswordValid = await this.checkPassword();
     if (isPasswordValid?.result !== 'success') {
      return true;
    }
    if (this.confirmPassword.valid) {
      const payload = {
        placement_id: this.selectedPlacementGroup._id,
        status: 'archived'
      }
      this.service.editPlacementGroup(payload).subscribe((response: any) => {
        if (response.status == HttpResponseCode.SUCCESS) {
          this.closeConfirmPasswordModal.ripple.trigger.click();

          this.paginationObj.pageIndex = 0;
          this.getPlacementGroupsCount();
          this.placementGroupList = new MatTableDataSource<any>([]);
          this.placementGroupList.data = []; 
          this.placementList = []; 
          this.getPlacementGroups(this.placementGroupStatus);
          this.service.showMessage({message: "Placement group archived successfully"});
          document.getElementById('archivedDonePopup')?.click();
        }
      });
    } else {
      this.confirmPassword.markAllAsTouched();
    }
  }

  openModal(modal) {
    modal.nativeElement.classList.add('show');
    modal.nativeElement.style.display = 'block';
  }

  closeModal(modal) {
    modal.nativeElement.classList.remove('show');
    modal.nativeElement.style.display = 'none';
  }

  onCloseSuccessPlacementGroupModal() {
    this.closeModal(this.successPlacementGroupModal);
  }

  activatePlacementGroup() {
    const payload = {
      placement_id: this.selectedPlacementGroup._id,
      status: 'active'
    }
    this.service.editPlacementGroup(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.getPlacementGroupsCount();
        this.paginationObj.pageIndex = 0;
              this.placementGroupList = new MatTableDataSource<any>([]);
          this.placementGroupList.data = []; 
          this.placementList = []; 
        this.getPlacementGroups(this.placementGroupStatus);
        this.service.showMessage({message: "Placement group activated successfully"})
      }
    });
  }

  onEyeClick(field: any, type: any) {
    console.log(field)
    if (field == 'pass') {
      this.pass = type
    }
  }

  onActionClick(placementGroup) {
    this.selectedPlacementGroup = placementGroup;
  }

  exportStudentData() {
    const payload = {
      status:this.pgStatuds, 
      limit: this.paginationObj.pageSize, 
      offset: this.paginationObj.pageIndex,
      ...this.filterObj
    }
    this.service.exportPlacementGroup(payload).subscribe((res: any) => {
      console.log("res", res);
      window.open(res.link);
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.split(' ');
    const first = parts[0]?.charAt(0) || '';
    const second = parts[1]?.charAt(0) || '';
    return `${first}${second}`;
  }
  
}
