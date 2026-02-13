import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
// import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { SelectionModel } from '@angular/cdk/collections';
import { TopgradserviceService } from '../../topgradservice.service';
// import { ChartDataSets, ChartOptions, ChartScales, PointStyle } from 'chart.js';
// import { Label, Color } from 'ng2-charts';
import { ChartDataset, ChartOptions, ScriptableContext } from 'chart.js'; // adjust as needed

export function hexToRgba(hex: string, opacity: number = 1): string {
  let c: any;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + `,${opacity})`;
  }
  throw new Error('Bad Hex');
}

export function getStyle(property: string, element: HTMLElement = document.documentElement): string | null {
  return window.getComputedStyle(element).getPropertyValue(property).trim();
}


export interface UserData {
  id: string;
  email: string;
  name: string;
  comp: string;
  industry: string;
  spend: string;
}

/** Constants used to fill up our data base. */
const NAMES: string[] = [
  'Micheal Smith', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack', 'Charlotte', 'Theodore', 'Isla', 'Oliver',
  'Isabella', 'Jasper', 'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'
];
const EMAIL: string[] = [
  'micheal@framestacks.com.au', 'asher@gmail.com', 'olivia@gmail.com', 'atticus@gmail.com', 'amelia@gmail.com', 'jack@gmail.com', 'charlotte@gmail.com', 'theodore@gmail.com', 'isla@gmail.com', 'oliver@gmail.com',
  'isabella@gmail.com', 'jasper@gmail.com', 'cora@gmail.com', 'levi@gmail.com', 'violet@gmail.com', 'arthur@gmail.com', 'mia@gmail.com', 'thomas@gmail.com', 'elizabeth@gmail.com'
];
const COMPANY: string[] = [
  'Framestacks Inc',
];
const INDUSTRY: string[] = [
  'Information Technology', 'Accounting', 'Agriculture'
];
const SPEND: string[] = [
  '300', '500'
];


@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  companyList: any = [
    {
      company: '',
      jobTitle: '',
      placed: '',
      inProcess: '',
      vacancies: '',
      action: ''
    },
    {
      company: '',
      jobTitle: '',
      placed: '',
      inProcess: '',
      vacancies: '',
      action: ''
    },
    {
      company: '',
      jobTitle: '',
      placed: '',
      inProcess: '',
      vacancies: '',
      action: ''
    },
    {
      company: '',
      jobTitle: '',
      placed: '',
      inProcess: '',
      vacancies: '',
      action: ''
    },
    {
      company: '',
      jobTitle: '',
      placed: '',
      inProcess: '',
      vacancies: '',
      action: ''
    },
    {
      company: '',
      jobTitle: '',
      placed: '',
      inProcess: '',
      vacancies: '',
      action: ''
    },
    {
      company: '',
      jobTitle: '',
      placed: '',
      inProcess: '',
      vacancies: '',
      action: ''
    },
    {
      company: '',
      jobTitle: '',
      placed: '',
      inProcess: '',
      vacancies: '',
      action: ''
    },
    {
      company: '',
      jobTitle: '',
      placed: '',
      inProcess: '',
      vacancies: '',
      action: ''
    },
    {
      company: '',
      jobTitle: '',
      placed: '',
      inProcess: '',
      vacancies: '',
      action: ''
    },
    {
      company: '',
      jobTitle: '',
      placed: '',
      inProcess: '',
      vacancies: '',
      action: ''
    },
    {
      company: '',
      jobTitle: '',
      placed: '',
      inProcess: '',
      vacancies: '',
      action: ''
    },
  ];
  studentsList: any = [
    {
      id: '',
      name: '',
      major: '',
      status: '',
      action: ''
    },
    {
      id: '',
      name: '',
      major: '',
      status: '',
      action: ''
    },
    {
      id: '',
      name: '',
      major: '',
      status: '',
      action: ''
    },
    {
      id: '',
      name: '',
      major: '',
      status: '',
      action: ''
    },
    {
      id: '',
      name: '',
      major: '',
      status: '',
      action: ''
    },
    {
      id: '',
      name: '',
      major: '',
      status: '',
      action: ''
    },
    {
      id: '',
      name: '',
      major: '',
      status: '',
      action: ''
    },
  ];

  displayedCompanyColumns: string[] = [
    'company',
    'jobTitle',
    'placed',
    'inProcess',
    'vacancies',
    'actions'
  ];
  displayedStudentColumns: string[] = [
    'id',
    'name',
    'major',
    'status',
    'actions'
  ];

  @ViewChild(MatTable) table: MatTable<any>;
  // dataSource1 = ;
  displayedColumns: string[] = ['id', 'name', 'email', 'comp', 'industry', 'spend'];
  dataSource: MatTableDataSource<UserData>

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  totalEmployer: number;
  totaljobs: number;
  totalGraduate: number;
  monthLogin: number;
  weekLogin: number;
  todayLogin: number;
  notFromlastMonth: number;
  percentTodayLogin: number;
  percentWeekLogin: number;
  percentMonthLogin: number;
  percentFromLastMonthLogin: number;
  graduateMonthLogin: any;
  graduateWeekLogin: any;
  graduateNotFromlastMonth: any;
  graduatePercentTodayLogin: number;
  graduatePercentMonthLogin: number;
  graduatePercentFromLastMonthLogin: number;
  graduatePercentWeekLogin: number;
  graduateTodayLogin: any;
  nameList: any;
  countList: any;
  countArray: any;
  jForLoop: any;
  employerCount: any = [];
  employerIndustryName: any = [];
  graduateCount: any = [];
  graduateIndustryName: any = [];
  count: any = [];
  employersPostedJobs: any = [];
  employersNotPostedJobs: any = [];
  empRegIndfilter: any;
  gradRegIndfilter: any;
  spendersAlldata: any;
  search: any = ''
  matObj = {
    offset: 0,
    limit: 5
  }
  event: any;
  topEmpSpendersCount: any;
  active_inactive_graduate: any = [];
  looking_work_graduate: any = [];

  jobIntershipFilter: any;
  jobPostedByFilter: any;
  openInterShip: any;
  closedInterShip: any;
  openJob: any;
  closedJob: any;
  close: any;
  open: any;
  job_intership_count: any = [];
  filterRegByLocEmp: any;
  filterRegByLocGrad: any;
  filterRegByLoc1: any;
  EmpAllData: any = [];
  GradAllData: any = [];
  qualificationsAllData: any = [];
  jobPostedAllData: any = [];
  selectQualifications: any;
  jobFiltering: any;
  jobLocFiltering: any;
  schComInterview: any;
  completed: any = [];
  scheduled: any = [];
  jobInternOffer: any;
  intership: any = [];
  jobOffered: any = [];
  countStudyField: any = [];
  monthStudyField: any = [];
  industryName: any;
  stdyFilter: any;
  address: any;
  latitude: any;
  longitude: any;
  locationName: any;
  jobLocationName: any;
  viewBy: string = "graph";
  // jobPostByIndCount: any = [];
  // jobPostByIndName: any = [];
  newArrayData: any = []

  privous_month: any


  quickNotes = "";

  constructor(private Service: TopgradserviceService) {


    // Create 100 users
    const users = Array.from({ length: 100 }, (_, k) => createNewUser(k + 1));

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(users);
  }



  radioModel: string = 'Month';
  // New Chart
  public overviewLineChartType = 'line';
  public overviewLineChartData : any = [
    {
      label: 'Total Students',
      data: [20, 30, 12, 4, 20, 6, 15, 25, 10, 43, 18, 5],
      tension: 0,
      fill: false,
      borderColor: '#ECEDFF',
      borderWidth: 3,
      pointBackgroundColor: '#464BA8',
      pointHoverBorderColor: '#464BA8',
      pointHoverBackgroundColor: '#464BA8',
      pointStyle: 'circle',
      pointRadius: 10,
      pointHoverRadius: 12,
    },
    {
      label: 'Currently Placed',
      data: [5, 15, 17, 10, 24, 30, 43, 10, 27, 9, 3, 15],
      tension: 0,
      fill: false,
      borderColor: '#FF76AF40',
      borderWidth: 3,
      pointBackgroundColor: '#F25094',
      pointHoverBorderColor: '#F25094',
      pointHoverBackgroundColor: '#F25094',
      pointStyle: 'circle',
      pointRadius: 10,
      pointHoverRadius: 12
    },
    {
      label: 'Pending Placements',
      data: [7, 6, 9, 30, 12,20, 25, 4, 39, 15 , 13, 19],
      tension: 0,
      fill: false,
      borderColor: '#F4776140',
      borderWidth: 3,
      pointBackgroundColor: '#F47761',
      pointHoverBorderColor: '#F47761',
      pointHoverBackgroundColor: '#F47761',
      pointStyle: 'circle',
      pointRadius: 10,
      pointHoverRadius: 12
    },
  ];
  editNotes:boolean = false;
  public overviewLineChartLegend = false
  public overviewLineChartLabels: any = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  public overviewLineChartOptions: any = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: (ctx) => 'Point Style: ' + ctx.chart.data.datasets[0].pointStyle,
      }
    },
    scales: {
    
      xAxes: [{
        display: false,
      },
     
      {
        gridLines: {
          color: "#fff",
        },
        ticks: {
          padding: 0,
        },
        
      }

      ],
      yAxes: [{
        gridLines: {
          borderDash: [6,6],
          lineWidth: 2,
          color: "#ECEDFF",
        },
      }]

    },
  };
  // lineChart1
  public lineChart1Data: Array<any> = [
    {
      data: [65, 59, 84, 84, 51, 55, 40],
      label: 'Series A'
    }
  ];
  public lineChart1Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChart1Options: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent'
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent',
        }

      }],
      yAxes: [{
        display: false,
        ticks: {
          display: false,
          min: 40 - 5,
          max: 84 + 5,
        }
      }],
    },
    elements: {
      line: {
        borderWidth: 1
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
    legend: {
      display: false
    }
  };
  public lineChart1Colours: Array<any> = [
    {
      backgroundColor: getStyle('--primary'),
      borderColor: 'rgba(255,255,255,.55)'
    }
  ];
  public lineChart1Legend = false;
  public lineChart1Type = 'line';

  // lineChart2
  public lineChart2Data: Array<any> = [
    {
      data: [1, 18, 9, 17, 34, 22, 11],
      label: 'Series A'
    }
  ];
  public lineChart2Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChart2Options: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent'
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent',
        }

      }],
      yAxes: [{
        display: false,
        ticks: {
          display: false,
          min: 1 - 5,
          max: 34 + 5,
        }
      }],
    },
    elements: {
      line: {
        tension: 0.00001,
        borderWidth: 1
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
    legend: {
      display: false
    }
  };
  public lineChart2Colours: Array<any> = [
    { // grey
      backgroundColor: getStyle('--info'),
      borderColor: 'rgba(255,255,255,.55)'
    }
  ];
  public lineChart2Legend = false;
  public lineChart2Type = 'line';


  // lineChart3
  public lineChart3Data: Array<any> = [
    {
      data: [78, 81, 80, 45, 34, 12, 40],
      label: 'Series A'
    }
  ];
  public lineChart3Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChart3Options: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false
      }],
      yAxes: [{
        display: false
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
    legend: {
      display: false
    }
  };
  public lineChart3Colours: Array<any> = [
    {
      backgroundColor: 'rgba(255,255,255,.2)',
      borderColor: 'rgba(255,255,255,.55)',
    }
  ];
  public lineChart3Legend = false;
  public lineChart3Type = 'line';


  // barChart1
  public barChart1Data: Array<any> = [
    {
      data: [78, 81, 80, 45, 34, 12, 40, 78, 81, 80, 45, 34, 12, 40, 12, 40],
      label: 'Series A',
      barPercentage: 0.6,
    }
  ];
  public barChart1Labels: Array<any> = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'];
  public barChart1Options: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false,
      }],
      yAxes: [{
        display: false
      }]
    },
    legend: {
      display: false
    }
  };
  public barChart1Colours: Array<any> = [
    {
      backgroundColor: 'rgba(255,255,255,.3)',
      borderWidth: 0
    }
  ];
  public barChart1Legend = false;
  public barChart1Type = 'bar';

  // mainChart

  public mainChartElements = 27;
  public mainChartData1: Array<number> = [];
  public mainChartData2: Array<number> = [];
  public mainChartData3: Array<number> = [];

  public mainChartData: Array<any> = [
    {
      data: this.mainChartData1,
      label: 'Current'
    },
    {
      data: this.mainChartData2,
      label: 'Previous'
    },
    {
      data: this.mainChartData3,
      label: 'BEP'
    }
  ];
  /* tslint:disable:max-line-length */
  public mainChartLabels: Array<any> = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Thursday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  /* tslint:enable:max-line-length */
  public mainChartOptions: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips,
      intersect: true,
      mode: 'index',
      position: 'nearest',
      callbacks: {
        labelColor: function (tooltipItem: { datasetIndex: string | number; }, chart: { data: { datasets: { [x: string]: { borderColor: any; }; }; }; }) {
          return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor };
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function (value: any) {
            return value.charAt(0);
          }
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 5,
          stepSize: Math.ceil(250 / 5),
          max: 250
        }
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      }
    },
    legend: {
      display: false
    }
  };
  public mainChartColours: Array<any> = [
    { // brandInfo
      backgroundColor: hexToRgba(getStyle('--info'), 10),
      borderColor: getStyle('--info'),
      pointHoverBackgroundColor: '#fff'
    },
    { // brandSuccess
      backgroundColor: '#ff0000',
      borderColor: getStyle('--success'),
      pointHoverBackgroundColor: '#fff'
    },
    { // brandDanger
      backgroundColor: '#ff0000',
      borderColor: getStyle('--danger'),
      pointHoverBackgroundColor: '#fff',
      borderWidth: 1,
      borderDash: [8, 5]
    }
  ];
  public mainChartLegend = false;
  public mainChartType = 'line';

  // social box charts

  public brandBoxChartData1: Array<any> = [
    {
      data: [65, 59, 84, 84, 51, 55, 40],
      label: 'Facebook'
    }
  ];
  public brandBoxChartData2: Array<any> = [
    {
      data: [1, 13, 9, 17, 34, 41, 38],
      label: 'Twitter'
    }
  ];
  public brandBoxChartData3: Array<any> = [
    {
      data: [78, 81, 80, 45, 34, 12, 40],
      label: 'LinkedIn'
    }
  ];
  public brandBoxChartData4: Array<any> = [
    {
      data: [35, 23, 56, 22, 97, 23, 64],
      label: 'Google+'
    }
  ];

  public brandBoxChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public brandBoxChartOptions: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false,
      }],
      yAxes: [{
        display: false,
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      }
    },
    legend: {
      display: false
    }
  };
  public brandBoxChartColours: Array<any> = [
    {
      backgroundColor: 'rgba(255,255,255,.1)',
      borderColor: 'rgba(255,255,255,.55)',
      pointHoverBackgroundColor: '#fff'
    }
  ];
  public brandBoxChartLegend = false;
  public brandBoxChartType = 'line';

  public random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }


  ngOnInit(): void {
    // this.getAllCount()
    // this.employerLoggedUser()
    // this.getEmployerRegisterId()
    // this.getGraduateRegisterId()
    // this.graduateLoggedUser()
    // this.getEmployerjobPosting()
    // this.search = ''
    // this.listTopEmpSpenders()
    // this.getActiveInactiveUserGraduate()
    // this.getLookingWorkGraduate()
    // this.getRegisterLocationEmployer()
    // this.getRegisterLocationGraduate()
    // this.getJobPostedByInds()
    // this.getIntershipOrJob()
    // this.getQualificationsProfileOfGraduatesList()
    // this.getJobsPostedByLocationList()
    // this.getScheduleOrCompletedInterviewsList()
    // this.getJobOrInternshipOffersList()
    // this.stdyFilter = ''
    // this.getNoOfGraduatesByFieldOfStudyList()
    // this.getGradsIndustriesListData()

    // // generate random values for mainChart
    // for (let i = 0; i <= this.mainChartElements; i++) {
    //   this.mainChartData1.push(this.random(50, 200));
    //   this.mainChartData2.push(this.random(80, 100));
    //   this.mainChartData3.push(65);
    // }
    // this.previousMonth()
  }
  previousMonth() {
    this.privous_month = new Date();
    var newMonth = this.privous_month.getMonth() - 1;
    if (newMonth < 0) {
      newMonth += 12;
      this.privous_month.setYear(this.privous_month.getFullYear() - 1); // use getFullYear instead of getYear !
    }
    this.privous_month.setMonth(newMonth);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // lineChart
  public lineChartData: Array<any> = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
    { data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C' }
  ];
  public lineChartLabels: Array<any> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  public lineChartOptions: any = {
    animation: false,
    responsive: true
  };
  public lineChartColours: Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';


  // for employer------
  // barChart
  public barChartOptionsEmp: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabelsEmp: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  public barChartLabelsEmp1: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  public barChartTypeEmp = 'bar';
  public barChartLegendEmp = true;
  public barChartDataEmp: any[] = [
    { data: [65, 59, 80, 81, 56, 55, 48], label: 'Registrations' }
  ];

  // for graduate---
  // barChart
  public barChartOptionsGrad: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabelsGrad: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  public barChartLabelsGrad1: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  public barChartTypeGrad = 'bar';
  public barChartLegendGrad = true;

  public barChartDataGrad: any[] = [
    { data: [65, 59, 80, 81, 56, 55, 48], label: 'Registrations' }
  ];

  //  for -------
  // barChart
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  public barChartType = 'bar';
  public barChartLegend = true;

  public barChartData: any[] = [
    { data: [], label: 'Registrations' }
  ];



  public barChartLabels1: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  public barChartData1: any[] = [
    { data: [65, 59, 80, 81, 56, 55, 48], label: 'No. of Graduates' }
  ];

  public barChartLabelsqg: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  public barChartDataqg: any[] = [
    { data: [65, 59, 80, 81, 56, 55, 48], label: 'No. of Graduates' }
  ];


  public barChartLabelsint: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  public barChartLabelsint1: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  public barChartDataint: any[] = [
    { data: [65, 59, 80, 81, 56, 55, 48], label: 'Scheduled Interviews' },
    { data: [40, 32, 50, 60, 86, 35, 58], label: 'Completed Interviews' }
  ];

  public barChartLabelsji: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  public barChartLabelsji1: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  public barChartDataji: any[] = [
    { data: [65, 59, 80, 81, 56, 55, 48], label: 'Job Offers' },
    { data: [40, 32, 50, 60, 86, 35, 58], label: 'Internship Offers' }
  ];

  // Doughnut
  public doughnutChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  public doughnutChartData: number[] = [350, 450, 100];
  public doughnutChartType = 'doughnut';

  // Radar
  public radarChartLabels: string[] = ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'];

  public radarChartData: any = [
    { data: [65, 59, 90, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 96, 27, 100], label: 'Series B' }
  ];
  public radarChartType = 'radar';

  // Pie
  public pieChartLabels: string[] = ['IT', 'Health', 'Agriculture', 'Accounting', 'Engineering', 'Government', 'sarvesh'];
  public pieChartData: number[] = [300, 200, 400, 500, 100, 450, 200, 300, 200, 400, 500, 100, 450, 200, 300, 200, 400, 500, 100, 450, 200];
  public pieChartType = 'pie';

  public pieChartLabels1: string[] = ['IT', 'Health', 'Agriculture', 'Accounting', 'Engineering', 'Government', 'sarvesh'];
  public pieChartData1: number[] = [300, 200, 400, 500, 100, 450, 200, 300, 200, 400, 500, 100, 450, 200, 300, 200, 400, 500, 100, 450, 200];
  public pieChartType1 = 'pie';

  public jobPostByIndName: string[] = ['IT', 'Health', 'Agriculture', 'Accounting', 'Engineering', 'Government', 'sarvesh'];
  public jobPostByIndCount: number[] = [300, 200, 400, 500, 100, 450, 200, 300, 200, 400, 500, 100, 450, 200, 300, 200, 400, 500, 100, 450, 200];
  public jobPostByIndPieChartType = 'pie';

  // this.jobPostByIndPieChartType='pie'
topPage:any = 0;

  // Pie2
  public pieChartLabels2: string[] = ['Employers Posting Jobs', 'Employers Not Posting Jobs'];
  public pieChartData2: number[] = [300, 200,]
  public pieChartType2 = 'pie';

  // Pie actv-inactv 
  public pieChartLabels3: string[] = ['Active Users', 'Inactive Users'];
  public pieChartData3: number[] = [700, 500];

  // Pie looking for work
  public pieChartLabels4: string[] = ['Open to Work', 'Not Actively Looking'];
  public pieChartData4: number[] = [800, 200];

  // Pie qualifuaction
  public pieChartLabelsq: string[] = ['Certificate', 'Diploma', 'Masters', 'Bachelors', 'PhD'];
  public pieChartDataq: number[] = [100, 300, 200, 50, 40];

  // Pie field of study
  public pieChartLabelsfs: string[] = ['Nursing', 'Marketing', 'Software Development', 'Cookery', 'Aerospace Eng'];
  public pieChartDatafs: number[] = [100, 300, 200, 50, 40];

  // Pie intern or job vacancy
  public pieChartLabelsij: string[] = ['Open', 'Closed'];
  public pieChartDataij: number[] = [650, 300];



  // PolarArea
  public polarAreaChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales', 'Telesales', 'Corporate Sales'];
  public polarAreaChartData: number[] = [300, 500, 100, 40, 120];
  public polarAreaLegend = true;

  public polarAreaChartType = 'polarArea';

  // events
  public chartClicked(e: any): void {
  }

  public chartHovered(e: any): void {
  }

  getAllCount() {
    var obj = {
    }
    this.Service.getCountDashboard(obj).subscribe((res: any) => {
      this.totalEmployer = res.totalEmployer.toLocaleString()   // <---- toLocalString() for comma in number.
      this.totalGraduate = res.totalGraduate.toLocaleString()
      this.totaljobs = res.totaljobs.toLocaleString()
    })
  }

  employerLoggedUser() {
    var obj = {
      role: 'Employer'
    }
    this.Service.loggedInDashboard(obj).subscribe((res: any) => {
      this.monthLogin = res.data.thisMonthLogin
      this.weekLogin = res.data.thisWeekLogin
      this.todayLogin = res.data.todayLogin
      this.notFromlastMonth = Math.abs(res.data.notFromlastMonth)
      this.percentTodayLogin = Math.round(res.data.todayLogin * 100 / this.totalEmployer)
      this.percentWeekLogin = Math.round(res.data.thisWeekLogin * 100 / this.totalEmployer)
      this.percentMonthLogin = Math.round(res.data.thisMonthLogin * 100 / this.totalEmployer)
      this.percentFromLastMonthLogin = Math.round(Math.abs(res.data.notFromlastMonth * 100 / this.totalEmployer))
    })
  }

  filterChangeEmpRegInd(event) {
    this.empRegIndfilter = event.target.value
    this.getEmployerRegisterId()

  }

  getEmployerRegisterId() {
    var obj: any = {
      role: 'Employer',
      filter: this.empRegIndfilter ? this.empRegIndfilter : ''
    }
    this.Service.getRegistrationByIndustry(obj).subscribe((res: any) => {
      this.employerCount = res.data.ByIndustry.map((res) => {
        return res.count
      })
      this.pieChartData = this.employerCount

      this.employerIndustryName = res.data.ByIndustry.map((res) => {
        return res.industry_detail[0]?.name
      })
      this.pieChartLabels = this.employerIndustryName
    })
  }





  graduateLoggedUser() {
    var obj = {
      role: 'Graduate'
    }
    this.Service.loggedInDashboard(obj).subscribe((res: any) => {
      this.graduateMonthLogin = res.data.thisMonthLogin
      this.graduateWeekLogin = res.data.thisWeekLogin
      this.graduateTodayLogin = res.data.todayLogin
      this.graduateNotFromlastMonth = Math.abs(res.data.notFromlastMonth)
      this.graduatePercentTodayLogin = Math.round(res.data.todayLogin * 100 / this.totalGraduate)
      this.graduatePercentWeekLogin = Math.round(res.data.thisWeekLogin * 100 / this.totalGraduate)
      this.graduatePercentMonthLogin = Math.round(res.data.thisMonthLogin * 100 / this.totalGraduate)
      this.graduatePercentFromLastMonthLogin = Math.round(Math.abs(res.data.notFromlastMonth * 100 / this.totalGraduate))
    })
  }


  filterChangeGradRegInd(event) {
    this.gradRegIndfilter = event.target.value
    this.getGraduateRegisterId()
  }
  csvDownload() {

  }
  getGraduateRegisterId() {
    var obj = {
      role: 'Graduate',
      filter: this.gradRegIndfilter ? this.gradRegIndfilter : ''
    }
    this.Service.getRegistrationByIndustry(obj).subscribe((res: any) => {

      this.graduateCount = res.data.ByIndustry.map((res: any) => {
        return res.count
      })
      this.pieChartData1 = this.graduateCount

      this.graduateIndustryName = res.data.ByIndustry.map((res) => {
        return res.industry_detail?.name
      })
      this.pieChartLabels1 = this.graduateIndustryName
    })
  }
  download1() {
    var obj = {
      role: 'Graduate',
      filter: this.gradRegIndfilter ? this.gradRegIndfilter : ''
    }
    this.Service.getRegistrationByIndustry(obj).subscribe((response: any) => {
      console.log("responseresponse>>>>", response);

      this.graduateIndustryName = response.data.ByIndustry.map((res) => {
        return res.industry_detail?.name
      })
      this.graduateCount = response.data.ByIndustry.map((res: any) => {
        return res.count += Object.entries(this.graduateIndustryName)
      })

      const a = document.createElement("a");
      a.href = "data:text/csv," + this.graduateCount
      let filename = "sampleCSVDownload";
      a.setAttribute("download", filename + ".csv");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    })
  }

  getEmployerjobPosting() {
    var obj = {
    }
    this.Service.getcountJobPosting(obj).subscribe((res: any) => {
      parseInt(res.EmployersPostedJobs)
      parseInt(res.EmployersNotPostedJobs)
      this.employersPostedJobs.push(res.EmployersPostedJobs)
      this.employersPostedJobs.push(res.EmployersNotPostedJobs)
      this.pieChartData2 = this.employersPostedJobs
    })
  }
  downloadFile() {
    var obj = {
    }
    this.Service.getcountJobPosting(obj).subscribe((response: any) => {
      const a = document.createElement("a");

      a.href = "data:text/csv," + Object.entries(response)
      let filename = "sampleCSVDownload";
      a.setAttribute("download", filename + ".csv");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    })
  }

  applyFilterTopEmpSpenders(filterValue) {

    this.search = filterValue.target.value

    if (this.event) {

      this.paginatorOfTopEmpSpenders(this.event)
    }
    else {
      this.listTopEmpSpenders()

    }

  }

  listTopEmpSpenders() {
    var obj: any = {
      limit: this.matObj.limit,
      offset: this.matObj.offset,
      search: this.search,
    }
    if (this.search) {
      obj.search = this.search
    }
    this.Service.getTopEmpSpenders(obj).subscribe((res: any) => {
      this.spendersAlldata = res.data.data
      this.topEmpSpendersCount = res.data.count
    })
  }
  paginatorOfTopEmpSpenders(event) {
    this.matObj.offset = event.pageIndex * event.pageSize;
    this.matObj.limit = event.pageSize
    this.listTopEmpSpenders();
  }

  getPageSizeOfTopEmpSpendersOptions() {
    return [5, 10, 50, 100];
  }

  selectflterRegByLocEmp(event) {
    this.filterRegByLocEmp = event.target.value
    this.getRegisterLocationEmployer()
  }
  getRegisterLocationEmployer() {
    var obj = {
      role: 'Employer',
      filter: this.filterRegByLocEmp ? this.filterRegByLocEmp : '',
      location: ''
    }
    this.Service.getRegisterByLocationGraduateOrEmp(obj).subscribe((res: any) => {
      console.log("employer location registor>>>>", res);

      this.EmpAllData = res.data.result.map(res => {
        return parseInt(res.count)
      })
      console.log("EmpAllData>>>>", this.EmpAllData);

      this.barChartDataEmp[0].data = this.EmpAllData

    })
  }



  selectflterRegByLocGrad(event) {
    this.filterRegByLocGrad = event.target.value
    this.getRegisterLocationGraduate()
  }
  googlePlaceOptions: any = {
    componentRestrictions: { country: ["au", "nz"] },
    fields: ["address_components", "geometry", "name", "formatted_address", "adr_address"],
    strictBounds: false,
    // types: ["establishment"],
    types: ['(regions)']
  }

  handleAddressChange(event: any) {
    this.locationName = event.name
    let latitude, longitude, location = '';
    if (event.geometry && event.name && event.formatted_address) {
      latitude = JSON.parse(JSON.stringify(event.geometry.location)).lat;
      longitude = JSON.parse(JSON.stringify(event.geometry.location)).lng;
      this.address = event.formatted_address
    }
    this.latitude = latitude,
      this.longitude = longitude
    this.getRegisterLocationGraduate()
  }
  clearLocation() { //this function is called on location field keyup to avoid invalid location
    this.latitude = "",
      this.longitude = ""
  }

  getRegisterLocationGraduate() {
    var obj = {
      role: 'Graduate',
      filter: this.filterRegByLocGrad,
      location: this.locationName
    }
    this.Service.getRegisterByLocationGraduateOrEmp(obj).subscribe((res: any) => {
      this.GradAllData = res.data.result.map(res => {
        return parseInt(res.count)
      })
      this.barChartDataGrad[0].data = this.GradAllData
    })
  }

  getActiveInactiveUserGraduate() {
    var obj = {
    }
    this.Service.getActiveInactiveGraduate(obj).subscribe((res: any) => {
      parseInt(res.data.ActiveGraduates)
      parseInt(res.data.InactiveGraduates)
      this.active_inactive_graduate.push(res.data.ActiveGraduates)
      this.active_inactive_graduate.push(res.data.InactiveGraduates)
      this.pieChartData3 = this.active_inactive_graduate
    })
  }

  getLookingWorkGraduate() {
    var obj = {
    }
    this.Service.getLookingForWorkGraduate(obj).subscribe((res: any) => {
      console.log("looking for works res>>", res);

      parseInt(res.data.NotOpenToWorkGraduates)
      parseInt(res.data.OpenToWorkGraduates)
      this.looking_work_graduate.push(res.data.OpenToWorkGraduates)
      this.looking_work_graduate.push(res.data.NotOpenToWorkGraduates)
      this.pieChartData4 = this.looking_work_graduate
    })
  }



  jobPostedByIndFilter(event) {
    this.jobPostedByFilter = event.target.value
    this.getJobPostedByInds()

  }
  getJobPostedByInds() {
    var obj: any = {
      filter: this.jobPostedByFilter
    }
    this.Service.getJobsPostedByIndustry(obj).subscribe((res: any) => {
      this.jobPostByIndCount = res.data.ByIndustry.map((res) => {
        return res.count
      })
      this.jobPostByIndName = res.data.ByIndustry.map((res) => {
        return res.industry_detail?.name
      })
    })
  }


  jobPostedFilter(event) {
    this.jobIntershipFilter = event.target.value
    this.getIntershipOrJob()

  }

  getIntershipOrJob() {
    var obj: any = {
      filter: this.jobIntershipFilter
    }

    this.Service.getIntershipJobPosted(obj).subscribe((res: any) => {
      console.log("job posted vacaney inter res>>>>", res);

      this.openInterShip = res.data[0][0]?.count
      this.closedInterShip = res.data[1][0]?.count
      this.openJob = res.data[2][0]?.count
      this.closedJob = res.data[3][0]?.count

      this.open = this.closedInterShip + this.closedJob
      this.close = this.openInterShip + this.openJob

      parseInt(this.close)
      parseInt(this.open)
      this.job_intership_count = []
      this.job_intership_count.push(this.close)
      this.job_intership_count.push(this.open)
      // this.pieChartDataij = [];
      this.pieChartDataij = this.job_intership_count


    })
  }

  qualificationsSelect(event) {
    this.selectQualifications = event.target.value

    this.getQualificationsProfileOfGraduatesList()
  }
  getQualificationsProfileOfGraduatesList() {
    var obj: any = {
      qualification: this.selectQualifications,
    }
    this.Service.getQualificationsProfileOfGraduates(obj).subscribe((res: any) => {
      this.qualificationsAllData = res.result.result.map(res => {
        return res.count
      })
      this.barChartDataqg[0].data = this.qualificationsAllData

    })
  }


  jobFilterSelect(event) {
    this.jobFiltering = event.target.value
    this.getJobsPostedByLocationList()
  }
  // jobFilterLocSelect(event) {
  //   this.jobLocFiltering = event.target.value
  //   this.getJobsPostedByLocationList()
  // }
  googlePlaceOptions1: any = {
    componentRestrictions: { country: ["au", "nz"] },
    fields: ["address_components", "geometry", "name", "formatted_address", "adr_address"],
    strictBounds: false,
    // types: ["establishment"],
    types: ['(regions)']
  }

  handleAddressChange1(event: any) {
    this.jobLocationName = event.name
    let latitude, longitude, location = '';
    if (event.geometry && event.name && event.formatted_address) {
      latitude = JSON.parse(JSON.stringify(event.geometry.location)).lat;
      longitude = JSON.parse(JSON.stringify(event.geometry.location)).lng;
      this.address = event.formatted_address
    }
    this.latitude = latitude,
      this.longitude = longitude
    this.getJobsPostedByLocationList()
  }
  clearLocation1() { //this function is called on location field keyup to avoid invalid location
    this.latitude = "",
      this.longitude = ""
  }
  getJobsPostedByLocationList() {
    var obj: any = {
      filter: this.jobFiltering,
      location: this.jobLocationName
    }
    this.Service.getJobsPostedByLocation(obj).subscribe((res: any) => {
      console.log("job posted by location res>>>>>", res);

      this.jobPostedAllData = res.result.result.map(res => {
        return res.count
      })
      this.barChartData[0].data = this.jobPostedAllData
    })
  }


  filterSCInterview(event) {
    this.schComInterview = event.target.value
    this.getScheduleOrCompletedInterviewsList()
  }
  compNewArrayData: any
  scheNewArrayData: any
  getScheduleOrCompletedInterviewsList() {
    var obj = {
      filter: this.schComInterview
    }
    this.Service.getScheduleOrCompletedInterviews(obj).subscribe((res: any) => {
      console.log("schedule and interview ews>>>>", res);

      this.scheNewArrayData = res.result.completed_result
      if (this.schComInterview == 'weekly') {
        for (let i = 1; i <= 7; i++) {
          const found = this.scheNewArrayData.some(el => el._id === i);
          if (!found) {
            this.scheNewArrayData.push({ _id: i, count: 0 });
          }
        }
        this.scheNewArrayData.sort((a: any, b: any) => a._id - b._id)
      } else if (this.schComInterview == 'monthly') {
        for (let i = 1; i <= 12; i++) {
          const found = this.scheNewArrayData.some(el => el._id === i);
          if (!found) {
            this.scheNewArrayData.push({ _id: i, count: 0 });
          }
        }
        this.scheNewArrayData.sort((a: any, b: any) => a._id - b._id)
      } else {
        for (let i = 1; i <= 7; i++) {
          const found = this.scheNewArrayData.some(el => el._id === i);
          if (!found) {
            this.scheNewArrayData.push({ _id: i, count: 0 });
          }
        }
        this.scheNewArrayData.sort((a: any, b: any) => a._id - b._id)
      }

      this.compNewArrayData = res.result.scheduled_result
      if (this.schComInterview == 'weekly') {
        for (let i = 1; i <= 7; i++) {
          const found = this.compNewArrayData.some(el => el._id === i);
          if (!found) {
            this.compNewArrayData.push({ _id: i, count: 0 });
          }
        }
        this.compNewArrayData.sort((a: any, b: any) => a._id - b._id)
      } else if (this.schComInterview == 'monthly') {
        for (let i = 1; i <= 12; i++) {
          const found = this.compNewArrayData.some(el => el._id === i);
          if (!found) {
            this.compNewArrayData.push({ _id: i, count: 0 });
          }
        }
        this.compNewArrayData.sort((a: any, b: any) => a._id - b._id)
      } else {
        for (let i = 1; i <= 7; i++) {
          const found = this.compNewArrayData.some(el => el._id === i);
          if (!found) {
            this.compNewArrayData.push({ _id: i, count: 0 });
          }
        }
        this.compNewArrayData.sort((a: any, b: any) => a._id - b._id)
      }



      this.completed = res.result.completed_result.map(res => {
        return res.count
      })
      this.scheduled = res.result.scheduled_result.map(res => {
        return res.count
      })
      this.barChartDataint[0].data = this.scheduled
      this.barChartDataint[1].data = this.completed


    })
  }


  filterJobInternOffer(event) {
    this.jobInternOffer = event.target.value
    this.getJobOrInternshipOffersList()
  }
  getJobOrInternshipOffersList() {
    var obj = {
      filter: this.jobInternOffer ? this.jobInternOffer : ''
    }
    this.Service.getJobOrInternshipOffers(obj).subscribe((res: any) => {
      console.log("get job offer internship offer res>>>", res);

      this.newArrayData = res.result.job_offered

      if (this.jobInternOffer == 'weekly') {
        for (let i = 1; i <= 7; i++) { // add new object in array
          const found = this.newArrayData.some(el => el._id === i);
          if (!found) {
            this.newArrayData.push({ _id: i, count: 0 });
          }
        }
        this.newArrayData.sort((a: any, b: any) => a._id - b._id) // sorrting
      } else if (this.jobInternOffer == 'monthly') {
        for (let i = 1; i <= 12; i++) { // add new object in array
          const found = this.newArrayData.some(el => el._id === i);
          if (!found) {
            this.newArrayData.push({ _id: i, count: 0 });
          }
        }
        this.newArrayData.sort((a: any, b: any) => a._id - b._id) // sorrting
      } else {
        for (let i = 1; i <= 7; i++) { // add new object in array
          const found = this.newArrayData.some(el => el._id === i);
          if (!found) {
            this.newArrayData.push({ _id: i, count: 0 });
          }
        }
        this.newArrayData.sort((a: any, b: any) => a._id - b._id) // sorrting
      }



      this.intership = res.result.intership_offered.map(res => {
        return res.count
      })
      this.jobOffered = this.newArrayData.map(res => {
        return res.count
      })
      this.barChartDataji[0].data = this.jobOffered
      this.barChartDataji[1].data = this.intership
    })
  }

  getGradsIndustriesListData() {
    var obj = {

    }
    this.Service.getGradsIndustriesList(obj).subscribe((res: any) => {

      this.industryName = res.data

    })
  }
  studyFilter(event) {
    this.stdyFilter = event.target.value

    this.getNoOfGraduatesByFieldOfStudyList()
  }
  getNoOfGraduatesByFieldOfStudyList() {
    var obj = {
      industry_id: this.stdyFilter
    }
    this.Service.getNoOfGraduatesByFieldOfStudy(obj).subscribe((res: any) => {
      this.countStudyField = res.data.result.map(res => {
        return res.monthsAndCount.count
      })

      this.monthStudyField = res.data.result.map(res => {
        return res.monthsAndCount.month
      })


      this.barChartData1[0].data = this.countStudyField
    })
  }




  addNotes() {
    console.log(this.quickNotes);
  }


}


function createNewUser(id: number): UserData {
  const name = NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ';
  const email = EMAIL[Math.round(Math.random() * (EMAIL.length - 1))] + ' ';
  const comp = COMPANY[Math.round(Math.random() * (COMPANY.length - 1))] + ' ';
  const industry = INDUSTRY[Math.round(Math.random() * (INDUSTRY.length - 1))] + ' ';
  const spend = SPEND[Math.round(Math.random() * (SPEND.length - 1))] + ' ';

  return {
    id: id.toString() + '.',
    email: email,
    name: name,
    comp: comp,
    industry: industry,
    spend: spend,
  };
}