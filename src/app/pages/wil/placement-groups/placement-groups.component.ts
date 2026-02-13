import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TopgradserviceService } from '../../../topgradservice.service';
import { HttpResponseCode } from '../../../shared/enum';
import { PlacementEligibleStudentsComponent } from '../placement-eligible-students/placement-eligible-students.component';
import { PlacementsTabComponent } from '../placements-tab/placements-tab.component';
import { PlacementIndustryPartnersComponent } from '../placement-industry-partners/placement-industry-partners.component';
import { PlacementSubmissionsComponent } from '../placement-submissions/placement-submissions.component';

@Component({
  selector: 'app-placement-groups',
  templateUrl: './placement-groups.component.html',
  styleUrls: ['./placement-groups.component.scss']
})
export class PlacementGroupsComponent implements OnInit {
  id: any;
  selectedIndex = 1;
  actionType: string;
  placementGroupDetail: any;
  placementGroupDetails:any;
  redirectTo: string;
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private service: TopgradserviceService) {
    this.actionType = this.router.getCurrentNavigation()?.extras?.state?.type;
  }

  btnTabs(index: number) {
    this.selectedIndex = index;
  }


  @ViewChild('placementEligibleStudents') placementEligibleStudents!: PlacementEligibleStudentsComponent;
  @ViewChild('placementTab') placementTab!: PlacementsTabComponent;
  @ViewChild('companyPlacementTab') companyPlacementTab!: PlacementIndustryPartnersComponent;
  @ViewChild('placementSubmissions') placementSubmissions!: PlacementSubmissionsComponent;

    


  onEligibleStudentsTabClick() {
    if (this.placementEligibleStudents) {
      this.placementEligibleStudents.refreshData();
    }
  }

  onSubmissionsTabClick() {
    if (this.placementSubmissions) {
      this.placementSubmissions.refreshData();
    }
  }

  onCompanyPlacementsTabClick(){
     if (this.companyPlacementTab) {
      this.companyPlacementTab.refreshData();
    }
  }

  onPlacementsTabClick(){
    if (this.placementTab) {
      this.placementTab.refreshData();
    }
  }
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
    });
    this.activatedRoute.queryParamMap.subscribe((params: ParamMap) => {
      this.redirectTo = params.get('redirectTo');
      if (this.redirectTo === 'worfkflow') {
        document.getElementById('workflow-tab').click();
      }
      if (this.redirectTo === 'placements') {
        document.getElementById('placements-tab').click();
      }
      if (this.redirectTo === 'eligible-students') {
        document.getElementById('eligible-students-tab').click();
      }
       if (this.redirectTo === 'industry-partners') {
        document.getElementById('industry-partners-tab').click();
      }
    })
  }

  getPlacementDetails(detail) {
    this.placementGroupDetail = detail;
  }
  refreshTabData(e){

  }
}
