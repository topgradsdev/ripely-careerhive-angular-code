import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TopgradserviceService } from '../../../topgradservice.service';
import { HttpResponseCode } from '../../../shared/enum';
import { PlacementEligibleStudentsComponent } from '../placement-eligible-students/placement-eligible-students.component';
import { PlacementsTabComponent } from '../placements-tab/placements-tab.component';

@Component({
  selector: 'app-placement-groups-project',
  templateUrl: './placement-groups-project.component.html',
  styleUrls: ['./placement-groups-project.component.scss']
})
export class PlacementGroupsProjectComponent implements OnInit {
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


  onEligibleStudentsTabClick() {
    if (this.placementEligibleStudents) {
      this.placementEligibleStudents.refreshData();
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
      if (this.redirectTo === 'eligible-students') {
        document.getElementById('eligible-students-tab').click();
      }
    })
  }

  getPlacementDetails(detail) {
    this.placementGroupDetail = detail;
  }
   refreshTabData(e){

  }
}
