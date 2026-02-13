import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective  } from 'ng2-charts';
// , Label, MultiDataSet, PluginServiceGlobalRegistrationAndOptions, Color
import { TopgradserviceService } from '../../../topgradservice.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpResponseCode } from '../../../shared/enum';

@Component({
  selector: 'app-analytics-student',
  templateUrl: './analytics-student.component.html',
  styleUrls: ['./analytics-student.component.scss']
})
export class AnalyticsStudentComponent implements OnInit {
displayedPlacementColumns:any = [];
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
  private getLegendCallback = (function (self) {
    function handle(chart) {
      return chart.legend.legendItems; // <-- THIS ... comes out in #5 of my orig post
    }
    return function(chart) {
      return handle(chart);
    };
})(this);
@ViewChild(BaseChartDirective) chartComponent: BaseChartDirective;

  public doughnutChartLabels: string[] = ['Emily Johnson', 'Aisha Khan', 'Carlos Ramirez', 'Alessandro Moretti', 'Benjamin Lee',];
  public doughnutChartData: number[] = [42, 54, 53, 54, 60];
  public doughnutChartType = 'doughnut';
  sortBy: string = "location";
  // private options: any = {
  //   legend: { position: 'bottom' }
    
  // }
  // public options: ChartOptions = {
  //   legend: { position: "bottom" },
  //   legendCallback: this.getLegendCallback,
  // }

  public options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 20,
          padding: 15
        }
      },
      tooltip: {
        enabled: true
      }
    }
  };
  public doughnutChartColors: any[] = [
    {backgroundColor:["#26C296","#FFD569","#F47761", "#F25094", "#464BA8"]},
    {backgroundColor:["#26C296","#FFD569","#F47761", "#F25094", "#464BA8"]},
    {backgroundColor:["#26C296","#FFD569","#F47761", "#F25094", "#464BA8"]},
    {backgroundColor:["#26C296","#FFD569","#F47761", "#F25094", "#464BA8"]},
    {backgroundColor:["#26C296","#FFD569","#F47761", "#F25094", "#464BA8"]},
  ];
  DisplayedColumns: string[] = ['empty', 'NSW', 'VIC', 'QLD', 'GLG',];
  dataSource = this.analyticsList;
  @ViewChild(MatTable) table: MatTable<any>;
  newAnalyticsProcess: MatTableDataSource<any>;
  
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

  createAnalyticsTableForm: FormGroup;

  constructor(
    private service: TopgradserviceService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.createAnalyticsTableForm = new FormGroup({
      table_name : new FormControl(null)
    });
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
    this.service.createStudentAnalyticsTable(payload).subscribe((data) => {
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
    this.service.duplicateStudentTable(payload).subscribe((data) => {
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
    this.service.duplicateStudentRow(payload).subscribe((data) => {
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
    this.service.duplicateStudentColumn(payload).subscribe((data) => {
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
      col: this.selectedColumn.index - 1,
      col_subheading: this.selectedColumn?.subheading
    }
    this.service.renameStudentCol(payload).subscribe((data) => {
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
      row_subheading: this.selectedRow?.subheading
    }
    this.service.renameStudentRow(payload).subscribe((data) => {
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
    this.service.deleteStudentCol(payload).subscribe((data) => {
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
    this.service.deleteStudentRow(payload).subscribe((data) => {
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
    this.service.updateStudentFilter(payload).subscribe((data) => {
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
    this.service.updateStudentFilter(payload).subscribe((data) => {
      if (data.code == HttpResponseCode.SUCCESS) {
        this.getAllTables(this.selectedFilter);
        this.service.showMessage({
          message: "Filter name updated successfully"
        })
      }
    })
  }

  updateTable(payload, table) {
    this.service.updateStudentTableName(payload).subscribe((data) => {
      if (data.code == HttpResponseCode.SUCCESS) {
        this.getAllTables({table: table});
      }
    })
  }

  deleteTable(table) {
    let payload = { 
      _id: table._id
    }
    this.service.deleteStudentTable(payload).subscribe((data) => {
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
    this.service.getStudentTables(payload).subscribe((data) => {
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

  goToCreateFilter(table, rowIndex, colIndex, isEdit) {
    isEdit = (table.filter_details && table.filter_details[rowIndex + '-' + colIndex]?.process_name) ? true : false;
    this.router.navigate(['/admin/analytics/analytics-students/create-new-filter'], {queryParams: {id: table._id, row: rowIndex, col: colIndex, isEdit: isEdit}});
  }

  selectColumn(table, index) {
    this.selectedColumn = {
      index: index,
      name: table.columns[index].value,
      table: table,
      subheading: ""
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
}
