import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
// Color, Label
import { TopgradserviceService } from '../../../topgradservice.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {HttpResponseCode} from '../../../shared/enum';
import { MatTableDataSource } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';


@Component({
  selector: 'app-analytics-company',
  templateUrl: './analytics-company.component.html',
  styleUrls: ['./analytics-company.component.scss']
})
export class AnalyticsCompanyComponent implements OnInit {
  dataSource1 = [
    { column1: 'Data 11', column2: 'Data 12', column3: 'Data 13' },
    { column1: 'Data 21', column2: 'Data 22', column3: 'Data 23' },
    { column1: 'Data 31', column2: 'Data 32', column3: 'Data 33' },
    // Add more data as needed
  ];
  headers = [{name: 'Header 1', cIndex: 1}, {name: 'Header 2', cIndex: 2}, { name: 'Header 3', cIndex: 3}];
  rows = [
    [{name: 'Row 1 Col 1', cIndex: 1}, {name: 'Row 1 Col 2', cIndex: 2}, {name: 'Row 1 Col 3', cIndex: 3}],
    [{name: 'Row 2 Col 1', cIndex: 1},  {name: 'Row 2 Col 2', cIndex: 2},  {name: 'Row 2 Col 3', cIndex: 3}],
    // Add more rows as needed
  ];
  timePeriods = [
    'Bronze age',
    'Iron age',
    'Middle ages',
    'Early modern period',
    'Long nineteenth century',
  ];
 

  editAnalyticsList = [
    {
      empty: '',
      NSW: '',
      newColumn: '',
      newColumn1: ''
    },
    {
      empty: '',
      NSW: '',
      newColumn: '',
      newColumn1: ''
    },
    {
      empty: '',
      NSW: '',
      newColumn: '',
      newColumn1: ''
    },
  ];
  analyticsList = [
    {
      empty: '',
      NSW: '',
      VIC: '',
      QLD: '',
      GLG: '',
    },
    {
      empty: '',
      NSW: '',
      VIC: '',
      QLD: '',
      GLG: '',
    },
    {
      empty: '',
      NSW: '',
      VIC: '',
      QLD: '',
      GLG: '',
    },
    {
      empty: '',
      NSW: '',
      VIC: '',
      QLD: '',
      GLG: '',
    },
    {
      empty: '',
      NSW: '',
      VIC: '',
      QLD: '',
      GLG: '',
    },
    {
      empty: '',
      NSW: '',
      VIC: '',
      QLD: '',
      GLG: '',
    },
    {
      empty: '',
      NSW: '',
      VIC: '',
      QLD: '',
      GLG: '',
    },
    {
      empty: '',
      NSW: '',
      VIC: '',
      QLD: '',
      GLG: '',
    },
    {
      empty: '',
      NSW: '',
      VIC: '',
      QLD: '',
      GLG: '',
    },
  ]
  legendData: any;
  sortBy: string = "location";
  viewBy: string = "all_status";
  private getLegendCallback = (function (self) {
    function handle(chart) {
      return chart.legend.legendItems; // <-- THIS ... comes out in #5 of my orig post
    }
    return function (chart) {
      return handle(chart);
    };
  })(this);
  @ViewChild(BaseChartDirective) chartComponent: BaseChartDirective;
  // New Chart
  public overviewLineChartType = 'line';
  public overviewLineChartData: any = [
    {
      label: 'Total Leads',
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
      label: 'Converted',
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
  ];

  public overviewLineChartLegend = false
  public overviewLineChartLabels: any[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
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
          borderDash: [6, 6],
          lineWidth: 2,
          color: "#ECEDFF",
        },
      }]

    },
  };
  // conversion
  public conversionDoughnutChartLabels: string[] = ['Converted', 'Dormant', 'In Progress', 'Dead Lead',];
  public conversionDoughnutChartData: number[] = [18, 18, 69, 15];
  public conversionDoughnutChartType = 'doughnut';

  // Leads
  public leadsDoughnutChartLabels: string[] = ['Self-Sourced', 'Employment Based', 'BNI', 'Website', 'Own Network', 'Host Network', 'Cold Calling'];
  public leadsDoughnutChartData: number[] = [50, 21, 8, 7, 11, 8, 1];
  public leadsDoughnutChartType = 'doughnut';

  // Converted Leads
  public convertedLeadsDoughnutChartLabels: string[] = ['Self-Sourced', 'Employment Based', 'BNI', 'Website', 'Own Network', 'Host Network',];
  public convertedLeadsDoughnutChartData: number[] = [34, 33, 1, 9, 13, 10,];
  public convertedLeadsDoughnutChartType = 'doughnut';
createAnalyticsProcess:any;
  createAnalyticsTableForm: FormGroup;
  newAnalyticsProcess: MatTableDataSource<any>;
  newAnalyticsProcessColumnsName:string[] = [];
public conversionDoughnutOptions: ChartOptions = {
  plugins: {
    legend: { 
      position: 'bottom' 
    }
  },
  // Custom legend callback function (optional)
  // legendCallback: this.getLegendCallback
};


  private options: any = {
    legend: { position: 'bottom' }

  }
  // conversion
  public conversionDoughnutChartColors: any[] = [
    { backgroundColor: ["#464BA8", "#FFD569", "#FF76AF", "#26C296",] },
    { backgroundColor: ["#464BA8", "#FFD569", "#FF76AF", "#26C296",] },
    { backgroundColor: ["#464BA8", "#FFD569", "#FF76AF", "#26C296",] },
    { backgroundColor: ["#464BA8", "#FFD569", "#FF76AF", "#26C296",] },
  ];
  // leads
  public leadsDoughnutChartColors: any[] = [
    { backgroundColor: ["#464BA8", "#FFD569", "#FF76AF", "#26C296", "#F47761", "#F25094", "#9747FF"] },
    { backgroundColor: ["#464BA8", "#FFD569", "#FF76AF", "#26C296", "#F47761", "#F25094", "#9747FF"] },
    { backgroundColor: ["#464BA8", "#FFD569", "#FF76AF", "#26C296", "#F47761", "#F25094", "#9747FF"] },
    { backgroundColor: ["#464BA8", "#FFD569", "#FF76AF", "#26C296", "#F47761", "#F25094", "#9747FF"] },
    { backgroundColor: ["#464BA8", "#FFD569", "#FF76AF", "#26C296", "#F47761", "#F25094", "#9747FF"] },
    { backgroundColor: ["#464BA8", "#FFD569", "#FF76AF", "#26C296", "#F47761", "#F25094", "#9747FF"] },
    { backgroundColor: ["#464BA8", "#FFD569", "#FF76AF", "#26C296", "#F47761", "#F25094", "#9747FF"] },
  ];
  // Converted Leads
  public convertedLeadsDoughnutChartColors: any[] = [
    { backgroundColor: ["#464BA8", "#FFD569", "#FF76AF", "#26C296", "#F47761", "#F25094", "#9747FF"] },
    { backgroundColor: ["#464BA8", "#FFD569", "#FF76AF", "#26C296", "#F47761", "#F25094", "#9747FF"] },
    { backgroundColor: ["#464BA8", "#FFD569", "#FF76AF", "#26C296", "#F47761", "#F25094", "#9747FF"] },
    { backgroundColor: ["#464BA8", "#FFD569", "#FF76AF", "#26C296", "#F47761", "#F25094", "#9747FF"] },
    { backgroundColor: ["#464BA8", "#FFD569", "#FF76AF", "#26C296", "#F47761", "#F25094", "#9747FF"] },
    { backgroundColor: ["#464BA8", "#FFD569", "#FF76AF", "#26C296", "#F47761", "#F25094", "#9747FF"] },
  ];

  DisplayedColumns: string[] = ['empty', 'NSW', 'VIC', 'QLD', 'GLG',];
  EditDisplayedColumns: string[] = ['empty', 'NSW', 'newColumn', 'newColumn1'];
  dataSource = this.analyticsList;
  dataEditView = this.editAnalyticsList;
  @ViewChild(MatTable) table: MatTable<any>;
  allTableList = [];
  selectedColumn = {
    index: 0,
    name: "",
    table: null,
    subheading: ""
  };
  selectedTable = null;
  selectedRow = {
    index: 0,
    name: "",
    table: null,
    subheading: ""
  };
  selectedFilter = {
    row: 0,
    column: 0,
    name: '',
    table: null
  }

  duplicateTable = "";
  duplicateRow = "";
  duplicateColumn = "";

  constructor(
    private service: TopgradserviceService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.createAnalyticsTableForm = new FormGroup({
      table_name : new FormControl(null)
    });
    this.getColumnName();
    const initialData = [
      {
        empty: '',
        NSW: '',
        newColumn: '',
        newColumn1: ''
      },
      {
        empty: '',
        NSW: '',
        newColumn: '',
        newColumn1: ''
      },
      {
        empty: '',
        NSW: '',
        newColumn: '',
        newColumn1: ''
      }
    ]
    this.newAnalyticsProcess = new MatTableDataSource(initialData);
    this.getAllTables();
  }
  // events
  // events
  public chartClicked(e: any): void {
  }

  public chartHovered(e: any): void {
  }
  ngAfterViewInit() {
    // this.legendData = this.chartComponent.chart.generateLegend();
    // console.log(this.legendData);
  }

  onCreateTable() {
    let payload = { table_name: this.createAnalyticsTableForm.value.table_name}
    this.service.createAnalyticsTable(payload).subscribe((data) => {
      if (data.code == HttpResponseCode.SUCCESS) {
        this.getAllTables();
      }
    })
  }

  selectTable(table) {
    this.selectedTable = table;
  }

  createDuplicateTable() {
    let payload = { _id: this.selectedTable?._id, table_name: this.duplicateTable}
    this.service.duplicateTable(payload).subscribe((data) => {
      if (data.code == HttpResponseCode.SUCCESS) {
        this.getAllTables();
        this.service.showMessage({
          message: "Table duplicated successfully"
        })
      }
    })
  }

  createDuplicateRow() {
    let payload = { 
      _id: this.selectedRow?.table?._id,
      row: this.selectedRow?.index
    }
    this.service.duplicateRow(payload).subscribe((data) => {
      if (data.code == HttpResponseCode.SUCCESS) {
        this.getAllTables(this.selectedRow);
        this.service.showMessage({
          message: "Table row duplicated successfully"
        })
      }
    })
  }

  createDuplicateColumn() {
    let payload = { 
      _id: this.selectedColumn?.table?._id,
      col: this.selectedColumn?.index
    }
    this.service.duplicateColumn(payload).subscribe((data) => {
      if (data.code == HttpResponseCode.SUCCESS) {
        this.getAllTables(this.selectedColumn);
        this.service.showMessage({
          message: "Table column duplicated successfully"
        })
      }
    })
  }

  updateTableName(table) {
    let payload = { 
      table_name: table.table_name,
      _id: table._id,
    }
    this.updateTable(payload, table);
  }

  addTableColumn(table) {
    let payload = { 
      table_name: table.table_name,
      _id: table._id,
      total_row: table.total_row,
      total_col: table.total_col + 1
    }
    this.updateTable(payload, table);
  }

  addTableRow(table) {
    let payload = { 
      table_name: table.table_name,
      _id: table._id,
      total_row: table.total_row + 1,
      total_col: table.total_col
    }
    this.updateTable(payload, table);
  }

  renameColumn() {
    let payload = { 
      _id: this.selectedColumn?.table?._id,
      col_name: this.selectedColumn?.name,
      col_subheading: this.selectedColumn?.subheading,
      col: this.selectedColumn.index - 1
    }
    this.service.renameCol(payload).subscribe((data) => {
      if (data.code == HttpResponseCode.SUCCESS) {
        this.getAllTables(this.selectedColumn);
        this.service.showMessage({
          message: "Table column renamed successfully"
        })
      }
    })
  }

  renameRow() {
    let payload = { 
      _id: this.selectedRow?.table?._id,
      row: this.selectedRow?.index,
      row_name: this.selectedRow?.name,
      row_subheading: this.selectedRow?.subheading,
    }
    this.service.renameRow(payload).subscribe((data) => {
      if (data.code == HttpResponseCode.SUCCESS) {
        this.getAllTables(this.selectedRow);
        this.service.showMessage({
          message: "Table row renamed successfully"
        })
      }
    })
  }

  deleteColumn() {
    let payload = { 
      _id: this.selectedColumn?.table?._id,
      col: this.selectedColumn?.index,
    }
    this.service.deleteCol(payload).subscribe((data) => {
      if (data.code == HttpResponseCode.SUCCESS) {
        this.getAllTables(this.selectedRow);
        this.service.showMessage({
          message: "Table column deleted successfully"
        })
      }
    })
  }

  deleteRow() {
    let payload = { 
      _id: this.selectedRow?.table?._id,
      row: this.selectedRow?.index
    }
    this.service.deleteRow(payload).subscribe((data) => {
      if (data.code == HttpResponseCode.SUCCESS) {
        this.getAllTables(this.selectedRow);
        this.service.showMessage({
          message: "Table row deleted successfully"
        })
      }
    })
  }

  renameFilter() {
    let payload = { 
      _id: this.selectedFilter?.table?._id,
      filter_details: {
        row: this.selectedFilter?.row,
        col: this.selectedFilter?.column,
        process_name: this.selectedFilter?.name,
        filters: this.selectedFilter?.table?.filter_details,
        saved: true
      }
    }
    this.service.updateFilter(payload).subscribe((data) => {
      if (data.code == HttpResponseCode.SUCCESS) {
        this.getAllTables(this.selectedFilter);
        this.service.showMessage({
          message: "Filter name updated successfully"
        })
      }
    })
  }

  deleteFilter() {
    let payload = { 
      _id: this.selectedFilter?.table?._id,
      filter_details: {
        row: this.selectedFilter?.row,
        col: this.selectedFilter?.column,
        process_name: "",
        filters: [],
        saved: true
      }
    }
    this.service.updateFilter(payload).subscribe((data) => {
      if (data.code == HttpResponseCode.SUCCESS) {
        this.getAllTables(this.selectedFilter);
        this.service.showMessage({
          message: "Filter name updated successfully"
        })
      }
    })
  }

  updateTable(payload, table) {
    this.service.updateTableName(payload).subscribe((data) => {
      if (data.code == HttpResponseCode.SUCCESS) {
        this.getAllTables({table: table});
      }
    })
  }

  deleteTable(table) {
    let payload = { 
      _id: table._id
    }
    this.service.deleteTable(payload).subscribe((data) => {
      if (data.code == HttpResponseCode.SUCCESS) {
        this.service.showMessage({
          message: "Table deleted successfully"
        })
        this.getAllTables();
      }
    })
  }

  getAllTables(selectedTable?) {
    let payload = { };
    this.service.getTables(payload).subscribe((data) => {
      this.allTableList = data.data;
      this.allTableList.forEach(table => {
        if (selectedTable?.table?._id === table._id) {
          table.isEdit = true;
        } else {
          table.isEdit = false;
        }
        table.isEditTableName = false;
        table.tRows = [];
        for (let j = 0; j < table.total_row; j++) {
          table.columns = [];
          table.colIndexing = [('c' + 0)];
          table.columns.unshift({index: 'c0', value: 'empty'});
          const obj = {};
          obj['c0'] = table.rows[j];
          table.tRows[j] = obj;
          for (let i = 0; i < table.total_col; i++) {
            table.colIndexing.push('c' + (i + 1));
            table.columns.push({index: 'c' + (i+1), value: table.cols[i]});
            obj[('c' + (i+1)).toString()] = null;
            Object.assign(table.tRows[j], obj);
          }
        }
        
        for (const key of Object.keys(table?.filter_details)) {
          const keyIndex = key.split('-');
          table.tRows[keyIndex[0]]['c' + keyIndex[1]] = table?.filter_details[key]?.process_name;
        }
      });
    });
  }

  addNewRow() {
    let newData = {
      empty: '',
      NSW: '',
      newColumn: '',
      newColumn1: ''
    };
    let currentData = this.newAnalyticsProcess.data.slice();
    currentData.push(newData); 
    this.newAnalyticsProcess.data = currentData;
  }

  getColumnName() {
    /* this.newAnalyticsProcess.analytics.forEach((obj => {
      console.log('obj===>', obj);
      obj.forEach((key) => {
        this.newAnalyticsProcessColumnsName.push(key.columnName);
      });
    })) */
    console.log('keys===>', this.newAnalyticsProcessColumnsName);
  }

  goToCreateFilter(table, rowIndex, colIndex, isEdit) {
    isEdit = (table.filter_details && table.filter_details[rowIndex + '-' + colIndex]?.process_name) ? true : false;
    this.router.navigate(['/admin/analytics/analytics-companies/create-new-filter'], {queryParams: {id: table._id, row: rowIndex, col: colIndex, isEdit: isEdit}});
  }

  selectColumn(table, index) {
    this.selectedColumn = {
      index: index,
      name: table.columns[index].value,
      subheading: '',
      table: table
    }
  }

  selectFilter(table, row, column) {
    this.selectedFilter = {
      row: row,
      column: column,
      name: table?.filter_details[row + '-' + column]?.process_name,
      table: table
    }
  }

  selectRow(table, index) {
    this.selectedRow = {
      index: index,
      name: table.rows[index]?.row_name,
      table: table,
      subheading: table.rows[index]?.row_subheading
    }
  }

  onDrop(event: any) {
    console.log('Item dropped:', event);
  }

  onDrag(event: any, index) {
    console.log('Item dragged:', event, index);
  }
}
