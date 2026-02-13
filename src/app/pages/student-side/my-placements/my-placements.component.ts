import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TopgradserviceService } from '../../../topgradservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../../loaderservice.service';

@Component({
  selector: 'app-my-placements',
  templateUrl: './my-placements.component.html',
  styleUrls: ['./my-placements.component.scss']
})
export class MyPlacementsComponent implements OnInit, AfterViewInit {

  showDetails: boolean;
  showCollapes: any = '';
  studentProfile = null;
  selectedTab :any = 'nav-pre-placement-tab';
  userProfile = null;
  activeTab: string = 'pre-placement'; // Default active tab
  loadedTabs: Set<string> = new Set(); // Track loaded tabs

  constructor(private service: TopgradserviceService, private activatedRoute: ActivatedRoute, private loaderService:LoaderService, private router: Router) {
    this.loadedTabs.add(this.activeTab);
  }

  async ngAfterViewInit() {
    this.userProfile = JSON.parse(localStorage.getItem('userSDetail'));
    // await this.getStudentProfile();

    setTimeout(()=>{
      this.activatedRoute.queryParams.subscribe(params => {
        console.log(params);
        if (params?.stage) {
          this.selectedTab = params.stage;
          
        }else {
         
        }
      });
    })

    
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;

    // Add tab to the set of loaded tabs if not already loaded
    if (!this.loadedTabs.has(tab)) {
      this.loadedTabs.add(tab);

      // Perform tab-specific API calls if needed
      this.loadTabData(tab);
    }
  }

  loadTabData(tab: string): void {
    switch (tab) {
      case 'pre-placement':
        console.log('Loading Pre Placement Data...');
        break;
      case 'ongoing':
        console.log('Loading Ongoing Data...');
        break;
      case 'post-placement':
        console.log('Loading Post Placement Data...');
        break;
      case 'completed':
        console.log('Loading Completed Data...');
        break;
      default:
        console.log('No data to load for this tab.');
    }
  }

  // getTabEvent(event: any): void {
  //   // Handle events from tabs
  //   console.log('Tab Event:', event);
  // }

  showHide() {
    this.showDetails = !this.showDetails;
  }
  collapsToggle(ids: any) {
    if (this.showCollapes == ids) {
      this.showCollapes = '';
    }
    else {
      this.showCollapes = ids
    }
  }
  ngOnInit(): void {
    this.getStudentProfile();
  }

  getStudentProfile() {
    this.service.getStudentProfile({}).subscribe(async (res: any) => {

      if(res.code == 200){

        console.log("res", res, typeof res.placement_type)
        this.loaderService.show();
        res.record.student_id = res.record?._id;
        // if (res.record?.placement_type_id && res.record?.placementType) {
          // res.placement_type = res.placement_type ? res.placement_type : {};

        
          // res.placement_type.placement_type_id = res.record?.placement_type_id;
         
        if (typeof res.placement_type === 'string') {
          res.placement_type = {
            name: res?.record?.placement_type,
            placementType: res.record?.placementType,
            placement_type_id: res.record?.placement_type_id,
          };
        } else if (typeof res.placement_type === 'object' && res.placement_type !== null) {
          res.placement_type.placement_type_id = res.record?.placement_type_id;
          res.placement_type.placementType = res.record?.placementType;
        }


          // res.placement_type.placementType = res.record?.placementType;
          if(res.record && !res.record.student_profile){
            this.router.navigate(['student/onboarding']);
          }
          
          // if (this.userProfile.placement_type) {
         if (!this.userProfile['placement_type']) {
          this.userProfile['placement_type'] = {}; // initialize as empty object
        }

        this.userProfile['placement_type']['placement_type_id'] = res.record?.placement_type_id;
        this.userProfile['placement_type']['placementType'] = res.record?.placement_type;

        // optional: keep these if needed at the root
        this.userProfile['placement_type_id'] = res.record?.placement_type_id;
        this.userProfile['placementType'] = res.record?.placement_type;
          // }
          if(res.record?.placement_id){
            this.userProfile.placement_id = res.record?.placement_id
          }
        console.log("this.userProfile", this.userProfile)
          const response = await this.getCompanyAllocation();
          this.userProfile.company_allocation = [];
          if (response?.result) {
            this.userProfile.company_allocation.push(response?.result);
          }


        await localStorage.setItem('userSDetail', JSON.stringify(this.userProfile));
        // }
        this.studentProfile = { ...res?.record, ...res?.placement_type, ...res?.placement_group_info };
        console.log("this.=f=d=d=d=d==d=d=",  this.studentProfile)
        if(this.selectedTab.includes("ongoing")){
          this.setActiveTab("ongoing")
        }else if(this.selectedTab.includes("pre-placement")){
          this.setActiveTab("pre-placement")
        }else if(this.selectedTab.includes("post-placement")){
          this.setActiveTab("post-placement")
        }else if(this.selectedTab.includes("completed")){
          this.setActiveTab("completed")
        }
        
        this.loaderService.hide();
      }
    });
  }

  getTabEvent(event) {
    const element = document.getElementById('nav-ongoing-tab');
    element.click();
  }

  goToTab(tab) {
    this.selectedTab = tab;
  }

  async getCompanyAllocation() {
    const payload = {
      student_id: this.userProfile?._id
    }
    return this.service.getCompanyAllocationForStudent(payload).toPromise();
  }
}
