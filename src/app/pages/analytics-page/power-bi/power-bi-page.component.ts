import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TopgradserviceService } from '../../../topgradservice.service';
import {HttpResponseCode, PlacementGroupStatus} from '../../../shared/enum';
import { Utils } from '../../../shared/utility';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { RulesService } from 'src/app/services/rules.service';
import * as pbi from 'powerbi-client';
import { HttpClient } from '@angular/common/http';

import * as Highcharts from 'highcharts';


@Component({
  selector: 'app-power-bi-page',
  templateUrl: './power-bi-page.component.html',
  styleUrls: ['./power-bi-page.component.scss']
})

export class PowerBIPageComponent implements OnInit {
  
  @ViewChild('removeCompany') removeCompany: ModalDirective;
  @ViewChild('removeCompanySuccess') removeCompanySuccess: ModalDirective;
  search = '';
  selectedRule:any = null;
  @ViewChild('reportContainer', { static: true }) reportContainer!: ElementRef;


  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  chartOptionsQuarterly: Highcharts.Options = {};
  chartOptionsSite: Highcharts.Options = {};
  loading = true;



    overdueData: any[] = [];
    vacancyData: any[] = [];

    
  constructor(private http: HttpClient, private service: TopgradserviceService, public utils: Utils, private rulesService: RulesService) { }

  reports: any= [
  {
    "id": "c1a23b45-6789-4d01-9012-3456abcd7890",
    "name": "Sales Performance",
    "embedUrl": "https://app.powerbi.com/reportEmbed?reportId=c1a23b45-6789-4d01-9012-3456abcd7890&groupId=1234-5678",
    "webUrl": "https://app.powerbi.com/groups/1234-5678/reports/c1a23b45-6789-4d01-9012-3456abcd7890",
    "datasetId": "f12a34b5-678c-9d01-2345-6789efgh1234"
  },
  {
    "id": "d9e87a65-1234-4abc-9012-5678efgh9012",
    "name": "Customer Insights",
    "embedUrl": "https://app.powerbi.com/reportEmbed?reportId=d9e87a65-1234-4abc-9012-5678efgh9012&groupId=1234-5678",
    "webUrl": "https://app.powerbi.com/groups/1234-5678/reports/d9e87a65-1234-4abc-9012-5678efgh9012",
    "datasetId": "ab123456-789c-4def-8901-23456789abcd"
  }
]
;

  ngOnInit(): void {
    // const groupId = "3f9c6f3b-7d2b-4a6c-8e07-d6c8f213a2e1";  
    // const reportId = "8d37c3f6-b8a2-44e3-bf20-6dd6b83a9d57";  

    //   this.http.get<any>(`http://localhost:3000/api/getEmbedToken/${groupId}/${reportId}`)
    //   .subscribe(embedToken => {
    //     const embedConfig: pbi.IEmbedConfiguration = {
    //       type: 'report',
    //       id: reportId,
    //       embedUrl: `https://app.powerbi.com/reportEmbed?reportId=${reportId}&groupId=${groupId}`,
    //       accessToken: embedToken.token,
    //       tokenType: pbi.models.TokenType.Embed,
    //       settings: {
    //         panes: {
    //           filters: { visible: false },
    //           pageNavigation: { visible: true }
    //         }
    //       }
    //     };

    //     const reportContainer = document.getElementById('reportContainer') as HTMLElement;
    //     const powerbiService = new pbi.service.Service(
    //       pbi.factories.hpmFactory,
    //       pbi.factories.wpmpFactory,
    //       pbi.factories.routerFactory
    //     );
    //     powerbiService.embed(reportContainer, embedConfig);
    //   });
    //  this.loadReports();
    this.getEmploymentBreakdown();
    this.getQuarterlyForecast();
    this.getUpcommingSiteVisit();
    this.getHcaafexpirations();
    this.getInterexpirations();
  }
  
  getEmploymentBreakdown() {
    this.service.getEmploymentBreakdown().subscribe((response) => {
      const data = response.workflowTypeBreakdown;

      console.log("data", data)

      // Extract states
      const states = data.map(d => d.state);

      const ownEmployment = data.map(d => {
        // sum all counts where self_source === true
        return d.types
          .filter(t => t.self_source === true)
          .reduce((sum, t) => sum + t.count, 0);
      });

      const providerEmployment = data.map(d => {
        // sum all counts where self_source === false OR undefined
        return d.types
          .filter(t => t.self_source === false || t.self_source === undefined)
          .reduce((sum, t) => sum + t.count, 0);
      });

      console.log("states", states, "ownEmployment", ownEmployment, "providerEmployment", providerEmployment)

      // Highchart Options
      this.chartOptions = {
        chart: { type: 'column' },
        title: { text: 'Employment Type Breakdown by State' },
        xAxis: { categories: states, title: { text: 'States' } },
        yAxis: { min: 0, title: { text: 'Number of Students' } },
        series: [
          { name: 'Own Employment', type: 'column', data: ownEmployment, color: '#28a745' },
          { name: 'Provider-Placed', type: 'column', data: providerEmployment, color: '#007bff' }
        ]
      };


      this.loading = false;
    });
  }


  onStateChange() {
    this.getQuarterlyForecast();
  }
  states: string[] = ['NSW', 'VIC', 'QLD']; // example dropdown
  selectedState: string = '';
  loadingQuarterly:boolean = false;
  getQuarterlyForecast() {
    this.loadingQuarterly = true;

    this.service.getQuarterlyForecast(this.selectedState).subscribe(res => {
      const data = res.data;

      // extract categories like "2025-Q1"
      const categories:any = Array.from(new Set(data.map(d => `${d._id.year}-Q${d._id.quarter}`)));

      // get all states in data
      const statesInData = Array.from(new Set(data.map(d => d._id.state)));

      const series:any = statesInData.map(state => ({
        name: state,
        type: 'column' as const,
        data: categories.map(cat => {
          const match = data.find(d => d._id.state === state && `${d._id.year}-Q${d._id.quarter}` === cat);
          return match ? match.total : 0;
        })
      }));

      this.chartOptionsQuarterly = {
        chart: { type: 'column' },
        title: { text: 'Provider-Placed Internship Forecast (Quarterly)' },
        xAxis: { categories, title: { text: 'Quarter' } },
        yAxis: { min: 0, title: { text: 'Number of Students' } },
        series
      };

      this.loadingQuarterly = false;
    });
  }


  loadingSite:boolean = false;
  getUpcommingSiteVisit() {
    this.loadingSite = true;

    this.service.getUpcommingSiteVisit().subscribe(res => {
      const data = res.data;

      const states = data.map(d => d._id);
      const visitCounts = data.map(d => d.totalVisits);

      this.chartOptionsSite = {
        chart: { type: 'column' },
        title: { text: 'Upcoming Site Visits (Next 3 Weeks)' },
        xAxis: { categories: states, title: { text: 'States' } },
        yAxis: { min: 0, title: { text: 'Number of Visits' } },
        series: [{
          name: 'Visits',
          type: 'column',
          data: visitCounts,
          color: '#ff9800'
        }]
      };

      this.loadingSite = false;
    });
  }

    chartOptionshcaaf: Highcharts.Options = {};

  loadinghcaaf:boolean = false;
  getHcaafexpirations() {
    this.loadinghcaaf = true;

    this.service.getHcaafexpirations().subscribe(res => {
      const data = res.data;

       const states = data.map(d => d._id);
      const totalData = data.map(d => d.hcaaFs.length);
      const urgentData = data.map(d => d.totalExpiring);

      this.chartOptionshcaaf = {
        chart: { type: 'column' },
        title: { text: 'HCAAF Expiration Overview by State' },
        xAxis: { categories: states, title: { text: 'State' } },
        yAxis: { title: { text: 'Number of HCAAF Records' } },
        tooltip: { shared: true },
        series: [
          {
            name: 'Total HCAAF',
            type: 'column',
            data: totalData,
            color: '#2f7ed8'
          },
          {
            name: 'Expiring Soon',
            type: 'column',
            data: urgentData,
            color: '#f45b5b'
          }
        ]
      };

      this.loadinghcaaf = false;
    });
  }

  chartinterOptions:  Highcharts.Options = {};


  loadinginter:boolean = false;
  getInterexpirations() {
    this.loadinginter = true;

    this.service.getInternshipCompletionDashboard().subscribe(res => {
        const monthly = res.data.monthlyCompletions;
        this.overdueData = res.data.overdueInterns;
        this.vacancyData = res.data.vacanciesAvailable;

        const categories = monthly.map(
          d => `${d._id.state} ${d._id.month}/${d._id.year}`
        );

        const counts = monthly.map(d => d.completedCount);

        this.chartinterOptions = {
          chart: { type: 'line' },
          title: { text: 'Monthly Internship Completions (Per State)' },
          xAxis: { categories },
          yAxis: { title: { text: 'Completed Internships' } },
          series: [{
            name: 'Completed',
            type: 'line',
            data: counts
          }]
        };

      // this.chartinterOptions = {
      //   chart: { type: 'column' },
      //   title: { text: 'HCAAF Expiration Overview by State' },
      //   xAxis: { categories: states, title: { text: 'State' } },
      //   yAxis: { title: { text: 'Number of HCAAF Records' } },
      //   tooltip: { shared: true },
      //   series: [
      //     {
      //       name: 'Total HCAAF',
      //       type: 'column',
      //       data: totalData,
      //       color: '#2f7ed8'
      //     },
      //     {
      //       name: 'Expiring Soon',
      //       type: 'column',
      //       data: urgentData,
      //       color: '#f45b5b'
      //     }
      //   ]
      // };

      this.loadinginter = false;
    });
  }


  selectedReportId: string = '';
  loadReports() {
    this.service.getReports().subscribe(res => {
      this.reports = res;
    });
  }

onReportChange(reportId: string) {

  console.log("event", reportId, this.selectedReportId)
    if (!this.selectedReportId) return;

    let find =  this.reports.find(el=>el.id==this.selectedReportId);
  // console.log("find", find);
    this.service.getReportEmbed(this.selectedReportId).subscribe((embedData:any) => {
      const config: pbi.IEmbedConfiguration = {
        type: 'report',
        id: this.selectedReportId,
        embedUrl: find.embedUrl,
        accessToken: find.accessToken,
        tokenType: pbi.models.TokenType.Embed,
        settings: {
          panes: { filters: { visible: false }, pageNavigation: { visible: true } }
        }
      };

      console.log("config",config)

      const powerbi = new pbi.service.Service(
        pbi.factories.hpmFactory,
        pbi.factories.wpmpFactory,
        pbi.factories.routerFactory
      );

      // Clear old report before embedding new one
      powerbi.reset(this.reportContainer.nativeElement);

      powerbi.embed(this.reportContainer.nativeElement, config);
    });
  }


}
