import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-analytics-company-filtering',
  templateUrl: './analytics-company-filtering.component.html',
  styleUrls: ['./analytics-company-filtering.component.scss']
})
export class AnalyticsCompanyFilteringComponent implements OnInit {
  edit_filter: boolean;
  companiesList = [
    {
      checkbox: '',
    }
  ]
  placementLists = [
    {
      placement_group: '',
      code: '',
      start_date: '',
      end_date: '',
      status: '',
    },
    {
      placement_group: '',
      code: '',
      start_date: '',
      end_date: '',
      status: '',
    },
    {
      placement_group: '',
      code: '',
      start_date: '',
      end_date: '',
      status: '',
    },
    {
      placement_group: '',
      code: '',
      start_date: '',
      end_date: '',
      status: '',
    },
    {
      placement_group: '',
      code: '',
      start_date: '',
      end_date: '',
      status: '',
    },
    {
      placement_group: '',
      code: '',
      start_date: '',
      end_date: '',
      status: '',
    },
    {
      placement_group: '',
      code: '',
      start_date: '',
      end_date: '',
      status: '',
    },
    {
      placement_group: '',
      code: '',
      start_date: '',
      end_date: '',
      status: '',
    },
    {
      placement_group: '',
      code: '',
      start_date: '',
      end_date: '',
      status: '',
    },
    {
      placement_group: '',
      code: '',
      start_date: '',
      end_date: '',
      status: '',
    },
    
  ]
  constructor() { }
  displayedPlacementColumns: string[] = ['placement_group','code','start_date','end_date', 'status' ]
  displayedColumns: string[] = [
    'checkbox',
    'company_name',
    'company_code',
    'location',
    'abn_can',
    'no_of_emp',
    'company_phone',
    // 'vacancies',
    'site_status',
    'web_address',
    'leadSource',
    'conversionStatus',
    'created_by',
    'date_created',
    'last_updated_by',
    'last_updated',
    'last_HCAAF_date',
    'HCAAF_expiry',
    'placed_student',
    'placement_group',
    'contact1FirstName',
    'contact1LastName',
    'contact1Title',
    'contact1PrimaryEmail',
    'contact1SecondaryEmail',
    'contact1PrimaryPhone',
    'contact1SecondaryPhone',
    'contact1CreatedBy',
    'contact1CreatedDate',
    'contact1UpdatedBy',
    'contact1LastUpdated',
    'contact2FirstName',
    'contact2LastName',
    'contact2Title',
    'contact2PrimaryEmail',
    'contact2SecondaryEmail',
    'contact2PrimaryPhone',
    'contact2SecondaryPhone',
    'contact2CreatedBy',
    'contact2CreatedDate',
    'contact2UpdatedBy',
    'contact2LastUpdated',
    'contact3FirstName',
    'contact3LastName',
    'contact3Title',
    'contact3PrimaryEmail',
    'contact3SecondaryEmail',
    'contact3PrimaryPhone',
    'contact3SecondaryPhone',
    'contact3CreatedBy',
    'contact3CreatedDate',
    'contact3UpdatedBy',
    'contact3LastUpdated',
    'WHSCheck',
    'siteConsentLogo',
    'actions'
  ]
  dataSource: MatTableDataSource<any>;
  ngOnInit(): void {
  }
  editFilter(){
    this.edit_filter = !this.edit_filter;
  }

}
