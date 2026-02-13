import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ColDef, GridApi, GridReadyEvent, ICellRendererParams, RowNode } from 'ag-grid-community';
import { TopgradserviceService } from '../../../topgradservice.service';
import { Utils } from '../../../shared/utility';
import { NgxPermissionsService } from 'ngx-permissions';
import { HttpResponseCode } from '../../../shared/enum';
import { FormBuilder } from '@angular/forms';
import { ActionCellRendererComponent } from 'src/app/ag-grid/action-cell-renderer/action-cell-renderer.component';
import { CellInputRendererComponent } from 'src/app/ag-grid/cell-input-renderer/cell-input-renderer.component';
import { CellNumberRendererComponent } from 'src/app/ag-grid/cell-number-renderer/cell-number-renderer.component';
import { CellDropdownRendererComponent } from 'src/app/ag-grid/cell-dropdown-renderer/cell-dropdown-renderer.component';
import { LinkRendererComponent } from 'src/app/ag-grid/link-renderer/link-renderer.component';
import { DateCellRendererComponent } from 'src/app/ag-grid/date-cell-renderer/date-cell-renderer.component';
import { TimeCellRendererComponent } from 'src/app/ag-grid/time-cell-renderer/time-cell-renderer.component';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AgGridAngular } from 'ag-grid-angular';

@Component({
  selector: 'app-placement-submissions',
  templateUrl: './placement-submissions.component.html',
  styleUrls: ['./placement-submissions.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class PlacementSubmissionsComponent implements OnInit, OnChanges {
  @Input() updatedPlacementDetail: any;

  placementId: string | null = null;
  placementGroupDetails: any = {};
  placementTypes: any[] = [];

  imageURL: string = '../../../../assets/img/banner_linkedin.svg';

  userDetail: any = null;
  isWILWritePermission: boolean = false;

  hideTable: boolean = false;
  showButtonHeaders: boolean = false;

  // AG Grid
  private gridApi!: GridApi;
  //  columnApi!: ColumnApi;
  rowData: any[] = [];
  columnDefs: ColDef[] = [];
  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    wrapText: true,           // Changed to true for better long text handling
    autoHeight: false,         // Important for dynamic content
    // floatingFilter: true,
  };

  // === IMPORTANT: Register all custom renderers here ===
  public frameworkComponents: any = {
    cellInputRenderer: CellInputRendererComponent,
    cellNumberRenderer: CellNumberRendererComponent,
    cellDropdownRenderer: CellDropdownRendererComponent,
    linkRenderer: LinkRendererComponent,
    dateCellRenderer: DateCellRendererComponent,
    timeCellRenderer: TimeCellRendererComponent,
  };

  gridOptions = {
    stopEditingWhenCellsLoseFocus: true,
    frameworkComponents: this.frameworkComponents,
    rowMultiSelectWithClick: true,     // click row toggles selection (without Ctrl)
    suppressRowClickSelection: true,
    singleClickEdit: true,
    theme: 'legacy',
    context: {
        componentParent: this
    }
  };

  private uniqueColumnMap: Map<string, ColDef> = new Map();
  overAllCount = {
    total_approved: 0,
    total_declined: 0,
    total_submissions: 0,
    placed: 0,
  };

  selectAllStdnt = false;
  searchCriteria = { keywords: null as string | null };

  placementType: any = '';
  taskId: any = '';

  // Define fixed columns as class property (shared & always available)
  private fixedColumns: ColDef[] = [
    {
        headerName: '',
        field: 'select',
        minWidth: 40,
        maxWidth: 60,
        checkboxSelection: true,
        headerCheckboxSelection: true,   // ✅ works
        pinned: 'left',
        suppressSizeToFit: true,
        sortable: false,
        filter: false,
        suppressMovable: true,
        resizable: false
    },
    { 
      headerName: 'Student ID', 
      field: 'student_code', 
      colId: 'student_code',      
      filter: 'agTextColumnFilter', 
      pinned: 'left',
      minWidth: 120,
      maxWidth: 150,
    },
    { 
      headerName: 'Student Name', 
      field: 'full_name', 
      colId: 'full_name',      
      filter: 'agTextColumnFilter', 
      pinned: 'left', 
      minWidth: 140,
      maxWidth: 160,
      wrapText:false,
      cellClass: 'hover-underline',  
      onCellClicked: (params) => {
      if (params.data?.student_id) {
        this.viewProfile(params.data);
      }
    }
    },
   
   {
    headerName: 'Actions',
    field: 'actions',
    colId: 'actions', 
    pinned: 'right',
    minWidth: 80,
    width: 80,
    maxWidth: 80,
    sortable: false,
    filter: false,
    cellRenderer: ActionCellRendererComponent,
    cellRendererParams: {
        onApprove: (row) => this.onApprove(row),
        onReject: (row) => this.onReject(row),
        onMenuAction: (action, row) => this.onMenuAction(action, row)
    }
    }
  ];

  sideBar = {
    toolPanels: [
      {
        id: 'columns',
        labelDefault: 'Columns',
        labelKey: 'columns',
        iconKey: 'columns',
        toolPanel: 'agColumnsToolPanel',
      },
      {
        id: 'filters',
        labelDefault: 'Filters',
        labelKey: 'filters',
        iconKey: 'filter',
        toolPanel: 'agFiltersToolPanel',
      }
    ],
    position: 'right',
    defaultToolPanel: 'columns' // open by default
  };

  toggleSidebar() {
    this.gridApi.setSideBarVisible(!this.gridApi.isSideBarVisible());
  }
  constructor(
    private service: TopgradserviceService,
    private activatedRoute: ActivatedRoute,
    private utils: Utils,
    private fb: FormBuilder,
    private router: Router,
    private ngxPermissionService: NgxPermissionsService
  ) {
    // Initialize with fixed columns only
    this.columnDefs = [...this.fixedColumns];
  }

  ngOnInit(): void {
    this.userDetail = JSON.parse(localStorage.getItem("userDetail") || '{}');

    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.placementId = params.get('id');
      if (this.placementId) {
        this.loadData();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['updatedPlacementDetail'] && this.updatedPlacementDetail) {
      this.imageURL = this.updatedPlacementDetail.background || this.imageURL;
      this.loadData();
    }
  }

  private loadData(): void {
    if (!this.placementId) return;

    this.getPlacementGroupDetails();
    this.getPlacementTypes();
  }

  getPlacementGroupDetails(): void {
    if (!this.placementId) return;
    const payload = { id: this.placementId };
    this.service.getPlacementGroupDetails(payload).subscribe((response: any) => {
      if (response?.result) {
        this.placementGroupDetails = response.result;
        this.imageURL = this.placementGroupDetails.background || this.imageURL;
      }
    });
  }

  getPlacementTypes(): void {
    if (!this.placementId) return;
    const payload = { placement_id: this.placementId };
    this.service.getPlacementTypes(payload).subscribe((response: any) => {
      if (response.status === HttpResponseCode.SUCCESS) {
        this.placementTypes = response.result || [];
      }
    });
  }
originalColumnWidths: { [key: string]: number } = {};
originalRowHeight:any = 48;
originalHeaderHeight:any = 52;
originalFontSize:any = 14;
originalCellHorizontalPadding:any = 10;
originalCellVerticalPadding:any = 6;
  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    // console.log('Grid ready! Rows:', this.rowData?.length);
    console.log('Columns:', this.columnDefs?.length);
    console.log("this.gridApi", this.gridApi.getAllGridColumns())
    // Apply current state immediately
    this.gridApi.setGridOption('rowData', this.rowData);
    this.gridApi.setGridOption('columnDefs', this.columnDefs);
    this.gridApi.sizeColumnsToFit();
    const allColumns = this.gridApi.getAllGridColumns() || [];
    allColumns.forEach(col => {
      this.originalColumnWidths[col.getColId()] = col.getActualWidth();
    });

     // Capture original row height
    this.originalRowHeight = 48;

    // Capture original header height
    this.originalHeaderHeight = 52;

    // Capture original font size & padding
    this.originalFontSize = 14;
    this.originalCellHorizontalPadding = 10;
    this.originalCellVerticalPadding = 6;

  }

  onSearch(value: string): void {
    if (this.gridApi) {
      this.gridApi.setGridOption('quickFilterText', value);
    }
  }

  exportCSV(): void {
    if (this.gridApi) this.gridApi.exportDataAsCsv();
  }

  exportExcel(): void {
    if (this.gridApi) this.gridApi.exportDataAsExcel(); // requires Enterprise
  }

  importCSV(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      this.rowData = this.parseCSV(text);
      if (this.gridApi) {
        this.gridApi.setGridOption('rowData', this.rowData);
      }
    };
    reader.readAsText(file);
  }

  private parseCSV(csv: string): any[] {
    const lines = csv.split(/\r?\n/);
    if (lines.length < 1) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    return lines.slice(1)
      .filter(line => line.trim())
      .map(line => {
        const values = line.split(',');
        const obj: any = {};
        headers.forEach((header, i) => {
          obj[header] = values[i]?.trim() ?? '';
        });
        return obj;
      });
  }

  // ────────────────────────────────────────────────
  // Custom cell renderers (unchanged)
  // ────────────────────────────────────────────────
//   private textRenderer(params: any): string {
//     return params.value
//       ? `<div style="padding:6px 10px; background:#f5f5f5; border-radius:6px; border:1px solid #ddd;">${params.value}</div>`
//       : '-';
//   }

//   private numberRenderer(params: any): string {
//     return params.value != null
//       ? `<div style="text-align:right; font-weight:500; padding:6px;">${Number(params.value).toLocaleString()}</div>`
//       : '-';
//   }

//   private radioRenderer(params: any): string {
//     return params.value
//       ? `<div style="padding:6px 12px; background:#e3f2fd; color:#1976d2; border-radius:20px; display:inline-block; font-weight:500;">${params.value}</div>`
//       : '-';
//   }

//   private checkboxRenderer(params: any): string {
//     if (!params.value) return '-';
//     const items = Array.isArray(params.value) ? params.value : [params.value];
//     return items
//       .map(item => 
//         `<span style="padding:5px 10px; margin:0 6px 6px 0; background:#e8f5e9; color:#2e7d32; border-radius:16px; display:inline-block; font-size:0.9em;">
//            ✓ ${item}
//          </span>`
//       )
//       .join('');
//   }

  private getFieldType(rowData: any, colKey: string): string | null {
    const data = rowData?.form_fields || rowData || {};
    if (!data.fields) return null;

    for (const section of data.fields) {
      for (const comp of section.component || []) {
        const title = comp.elementData?.title?.replace(/<[^>]*>/g, '').trim();
        if (title === colKey) {
          return comp.id || comp.elementData?.type || null;
        }
      }
    }
    return null;
  }


  // private getFieldTypeS(rowData: any, colKey: string): string | null {
  //   const data = rowData?.form_fields || rowData || {};
  //   if (!data.fields) return null;

  //   console.log("data", data)
  //   for (const section of data.fields) {
  //     for (const comp of section.component || []) {
  //       const title = comp.elementData?.title?.replace(/<[^>]*>/g, '').trim();
  //       if (title === colKey) {
  //         return comp.id || comp.elementData?.type || null;
  //       }
  //     }
  //   }
  //   return null;
  // }

  private getFieldTypeS(rowData: any, colKey: string): string | null {
  const data = rowData?.form_fields || rowData || {};

  // Early return if no fields array exists
  if (!Array.isArray(data.fields)) {
    // console.warn("No 'fields' array found in data", data);
    return null;
  }

  // Clean colKey (remove HTML tags and trim) – same as you did for title
  const cleanColKey = colKey.replace(/<[^>]*>/g, '').trim().toLowerCase();

  for (const field of data.fields) {
    // Get title from elementData, strip HTML tags, trim
    const title = (field.elementData?.title || '')
      .replace(/<[^>]*>/g, '')
      .trim();

    // Compare case-insensitively (safer for user-entered titles)
    if (title.toLowerCase() === cleanColKey) {
      // Return the most reliable identifier
      // Prefer id if available, fallback to type
      return field.id || field.elementData?.type || null;
    }

    // Optional: also check against the field's "name" property if title doesn't match
    if (field.name?.replace(/<[^>]*>/g, '').trim().toLowerCase() === cleanColKey) {
      return field.id || field.elementData?.type || null;
    }
  }

  // console.log(`Field type not found for colKey: "${colKey}" (cleaned: "${cleanColKey}")`);
  return null;
}


 private generateDynamicColumnsAsync(): Promise<ColDef[]> {
  return new Promise((resolve) => {
    this.uniqueColumnMap.clear();

    if (!this.rowData?.length) return resolve([]);

    this.rowData.forEach(row => {
      const nested = row.form_fields || {};
      // console.log("nested", nested);
      if (nested.type === "multi_step") {
        if (!nested.fields || !Array.isArray(nested.fields)) return;

        nested.fields.forEach((section: any) => {
          if (!section.component || !Array.isArray(section.component)) return;

          section.component.forEach((comp: any) => {
            if (comp.id === "description") return;

            const elem = comp?.elementData;
            if (!elem?.title) return;

            const rawTitle = elem.title.replace(/<[^>]*>/g, '').trim();
            // console.log("colKey", colKey)
            const colKey = rawTitle.replace(/\s+/g, ' ');
            // console.log("colKey", colKey)

            if (this.uniqueColumnMap.has(colKey)) return;
            // console.log("this.uniqueColumnMap", this.uniqueColumnMap, "colKey", colKey)
            this.uniqueColumnMap.set(colKey, {
              headerName: colKey,
              colId:colKey,
              tooltipValueGetter: () => elem.title,
              filter: ['number', 'likert-scale'].includes(elem.type)
                ? 'agNumberColumnFilter'
                : 'agTextColumnFilter',
              sortable: true,
              resizable: true,

              cellEditorSelector: (params) => {
                const type = this.getFieldType(params.data, colKey);

                if (type === 'single' || type === 'multi') {
                  return {
                    component: 'agLargeTextCellEditor',
                    popup: true,
                    params: { rows: type === 'multi' ? 15 : 5, cols: 50 }
                  };
                }
                // else if (type === 'number') {
                //   return 'agNumberCellEditor';        // or your custom one
                // }

                return undefined;
              },

             suppressKeyboardEvent: (params) => {
              if (!params.editing && (params.event.key === 'Enter' || params.event.key === 'F2')) {
                params.api.startEditingCell({
                  rowIndex: params.node.rowIndex,
                  colKey: params.column.getId()
                });
                return true;
              }
              return false;
            },

            editable: (params) => {
              const type = this.getFieldType(params.data, colKey);
              return type === 'single' || type === 'multi' || type === 'number';
            },

              valueSetter: (params) => {
                console.log("params.data, colKey, params.newValue", params.data, colKey, params.newValue)
                // this.setValueToFormFields(params.data, colKey, params.newValue);
                 this.updateEditor(params, colKey, params.newValue)
                return true;
              },
              cellRendererSelector: (params: ICellRendererParams) => {
                    const type = this.getFieldType(params.data, colKey);

                    // console.log("getFieldType returned:", type); // ← debug what it really returns!

                    //  if (['radio', 'dropdown', 'checkbox', 'likert'].includes(type)) {
                    //   return {
                    //     component: CellDropdownRendererComponent,
                    //     params: {
                    //       fieldType: type,
                    //       colKey,
                    //       onValueChange: (value: any, rowData: any) => {
                    //         this.updateEditor({ data: rowData }, colKey, value);
                    //         this.updateRow(rowData);
                    //       }
                    //     }
                    //   };
                    // }

                    if (['radio', 'dropdown', 'checkbox', 'likert'].includes(type)) {
                    return {
                      component: CellDropdownRendererComponent,
                      params: {
                        fieldType: type,
                        colKey,
                        // onValueChange: (value: any, rowData: any) => {
                        //   this.updateEditor({ data: rowData }, colKey, value);
                        //   this.updateRow(rowData);

                        //   const rowNode = this.gridApi.getRowNode(rowData.id);
                        //   if (rowNode) {
                        //     rowNode.setData({ ...rowData });
                        //   }
                        // }
                      }
                    };
                  }
                    
                    switch (type) {
                        case 'single':
                        case 'multi':
                          //  return {
                          //   cellRenderer: CellInputRendererComponent,
                          //   editable: true,
                          //   cellEditor: 'agLargeTextCellEditor',
                          //   cellEditorPopup: true,
                          //   cellEditorParams: {
                          //     rows: 15,
                          //     cols: 50
                          //   }
                          // };
                        return { component: CellInputRendererComponent};

                        case 'number':
                        return { component: CellNumberRendererComponent };

                        // case 'radio':
                        // case 'dropdown':
                        // case 'checkbox':
                        // case 'likert':
                        // return { component: CellDropdownRendererComponent };

                        case 'attachment':
                        case 'image':
                        case 'downloadable':
                        return { component: LinkRendererComponent };

                        case 'date':
                        return { component: DateCellRendererComponent };

                        case 'time':
                        return { component: TimeCellRendererComponent };

                        default:
                        return undefined; // ← default text renderer (no custom component)
                    }
                    },
            cellRendererParams: {
                placeholder: 'Enter value',
                onValueChange: (newValue: any, rowData: any) => {
                  // 
                 console.log('Updated value:', newValue, rowData);

                  this.updateRow(rowData);

                  const rowNode = this.gridApi.getRowNode(rowData.id);
                  if (rowNode) {
                    rowNode.setData({ ...rowData }); // refresh that row
                  }
                // Call API or update parent component here
                }
            },
              valueGetter: (params) => {
                const data = params.data?.form_fields || params.data || {};
                if (!data.fields) return null;
                for (const sec of data.fields) {
                  for (const c of sec.component || []) {
                    const t = c.elementData?.title?.replace(/<[^>]*>/g, '').trim();
                    if (t === colKey) {
                      let val = c.elementData.value;
                      if(c.id =="checkbox"){
                        let find = c.elementData.items.find(el=>el.selected);
                        if(find){
                            return find.item;
                        }
                      }else{
                        if (Array.isArray(val)) return val;
                        if (typeof val === 'boolean') return val ? 'Yes' : 'No';
                      }
                    
                      return val ?? null;
                    }
                  }
                }
                return null;
              },
              minWidth:150,
              cellStyle: {
                    padding: '0px !important',  
                },
            //   cellStyle: { 'white-space': 'normal', 'line-height': '1.6em', 'padding': '8px' },
              autoHeight: false,
              wrapText:false

            });
          });
        });
      }else{

        // console.log("nested", nested)
        if (!nested.fields || !Array.isArray(nested.fields)) return;

        nested.fields.forEach((comp: any) => {
          // if (!section.component || !Array.isArray(section.component)) return;

          // section.component.forEach((comp: any) => {
            if (comp.id === "description") return;

            const elem = comp?.elementData;
            if (!elem?.title) return;

            const rawTitle = elem.title.replace(/<[^>]*>/g, '').trim();
            const colKey = rawTitle.replace(/\s+/g, ' ');

            if (this.uniqueColumnMap.has(colKey)) return;
            // console.log("this.uniqueColumnMap", this.uniqueColumnMap, "colKey", colKey)
            this.uniqueColumnMap.set(colKey, {
              headerName: colKey,
              tooltipValueGetter: () => elem.title,
              filter: ['number', 'likert-scale'].includes(elem.type)
                ? 'agNumberColumnFilter'
                : 'agTextColumnFilter',
              sortable: true,
              resizable: true,

               cellEditorSelector: (params) => {
                const type = this.getFieldType(params.data, colKey);

                if (type === 'single' || type === 'multi') {
                  return {
                    component: 'agLargeTextCellEditor',
                    popup: true,
                    params: {
                      rows: 15,
                      cols: 50
                    }
                  };
                }
                // else if (type === 'number') {
                //   return 'agNumberCellEditor';        // or your custom one
                // }

                return undefined;
              },

              editable: (params) => {
  const type = this.getFieldType(params.data, colKey);
  return type === 'single' || type === 'multi' || type === 'number';
},

             suppressKeyboardEvent: (params) => {
              if (!params.editing && (params.event.key === 'Enter' || params.event.key === 'F2')) {
                params.api.startEditingCell({
                  rowIndex: params.node.rowIndex,
                  colKey: params.column.getId()
                });
                return true;
              }
              return false;
            },

             valueSetter: (params) => {
                console.log("params.data, colKey, params.newValue", params.data, colKey, params.newValue)
                // this.setValueToFormFields(params.data, colKey, params.newValue);
                this.updateEditor(params, colKey, params.newValue)
                return true;
              },
              cellRendererSelector: (params: ICellRendererParams) => {
                    const type = this.getFieldTypeS(params.data, colKey);

                    // console.log("getFieldTypeS returned:", type); // ← debug what it really returns!

                    if (['radio', 'dropdown', 'checkbox', 'likert'].includes(type)) {
                    return {
                      component: CellDropdownRendererComponent,
                      params: {
                        autoHeight: true,
                        wrapText: true,
                        fieldType: type,
                        colKey,
                        // onValueChange: (value: any, rowData: any) => {
                        //   this.updateEditor({ data: rowData }, colKey, value);
                        //   this.updateRow(rowData);

                        //   const rowNode = this.gridApi.getRowNode(rowData.id);
                        //   if (rowNode) {
                        //     rowNode.setData({ ...rowData });
                        //   }
                        // }
                      }
                    };
                  }
                    switch (type) {
                        case 'single':
                        case 'multi':
                        return { component: CellInputRendererComponent};

                        case 'number':
                        return { component: CellNumberRendererComponent };

                        // case 'radio':
                        // case 'dropdown':
                        // case 'checkbox':
                        // case 'likert':
                        // return { component: CellDropdownRendererComponent };

                        case 'attachment':
                        case 'image':
                        case 'downloadable':
                        return { component: LinkRendererComponent };

                        case 'date':
                        return { component: DateCellRendererComponent };

                        case 'time':
                        return { component: TimeCellRendererComponent };

                        default:
                        return undefined; // ← default text renderer (no custom component)
                    }
                    },
            cellRendererParams: {
                placeholder: 'Enter value',
                onValueChange: (newValue: any, rowData: any) => {
                console.log('Updated value:', newValue, rowData);
                this.updateRow(rowData);
                const rowNode = this.gridApi.getRowNode(rowData.id);
                if (rowNode) {
                  rowNode.setData({ ...rowData }); // refresh that row
                }
                // Call API or update parent component here
                }
            },
              valueGetter: (params) => {
                const data = params.data?.form_fields || params.data || {};
                if (!data.fields) return null;
                for (const c of data.fields) {
                  // for (const c of sec.component || []) {
                    const t = c.elementData?.title?.replace(/<[^>]*>/g, '').trim();
                    if (t === colKey) {
                      let val = c.elementData.value;
                      if(c.id =="checkbox"){
                        let find = c.elementData.items.find(el=>el.selected);
                        if(find){
                            return find.item;
                        }
                      }else{
                        if (Array.isArray(val)) return val;
                        if (typeof val === 'boolean') return val ? 'Yes' : 'No';
                      }
                    
                      return val ?? null;
                    }
                  // }
                }
                return null;
              },
              minWidth:150,
              cellStyle: {
                    padding: '0px !important',  
                },
            //   cellStyle: { 'white-space': 'normal', 'line-height': '1.6em', 'padding': '8px' },
              autoHeight: false,
              wrapText:true

            });
          // });
        });
      
      }
    });

    resolve(Array.from(this.uniqueColumnMap.values()));
  });
}


updateEditor(params: any, colKey: string, value: any) {
  if (!params || !params.data) return;

  const data = params.data;
  const normalizedColKey = (colKey || params.colDef?.headerName || '').trim().toLowerCase();

  // Helper to check and update a single element
  const updateElement = (element: any) => {
    if (
      element?.elementData?.title
        ?.replace(/<[^>]*>/g, '')
        .trim()
        .toLowerCase() === normalizedColKey
    ) {
      element.elementData.value = value;
      return true;
    }
    return false;
  };

  // If multi_step type
  if (data?.form_fields?.type === 'multi_step') {
    for (const section of data.form_fields.fields || []) {
      if (!Array.isArray(section.component)) continue;

      const found = section.component.find(updateElement);
      if (found) break; // stop after first match
    }
  } else {
    // single step
    data.form_fields.fields?.find(updateElement);
  }

  // Call onValueChange callback if provided
  if (typeof params?.onValueChange === 'function') {
    params.onValueChange(value, data);
  }

  // Update row in the grid
  this.updateRow(data);

  console.log('Updated data:', data);
}



  getTaskName(id: any): string {
    if (!id || !Array.isArray(this.formList)) {
      return '';
    }

    const form = this.formList.find(el => el.form_id === id);
    return form?.form_title ?? '';
  }

 status: string[] = ['all'];  // start with "All" selected by default

// private readonly ALL_VALUE = 'all';
// private readonly ALL_OPTIONS = ['to_do', 'approve', 'declined'];

onStatusChange(newValues: string[]): void {
//   // Create a copy to avoid mutating during event
//   let updated = [...newValues];

//   console.log("updated", updated)
//   // Case 1: "All" is now selected → force select everything
//   if (updated.includes(this.ALL_VALUE)) {
//     updated = [this.ALL_VALUE, ...this.ALL_OPTIONS];
//   }
//   // Case 2: "All" is NOT selected in the new values
//   // else {
//   //   // If previously "All" was selected, but now it's not → user unchecked "All"
//   //   // Just keep whatever is left (individual selections)
//   //   // No need to do anything special here
//   // }

//   // Case 3: All individual options are now selected → auto-check "All"
//   const selectedWithoutAll = updated.filter(v => v !== this.ALL_VALUE);
//   if (
//     selectedWithoutAll.length === this.ALL_OPTIONS.length &&
//     selectedWithoutAll.every(v => this.ALL_OPTIONS.includes(v))
//   ) {
//     if (!updated.includes(this.ALL_VALUE)) {
//       updated.push(this.ALL_VALUE);
//     }
//   }

//   // Remove duplicates (rare, but safe)
//   updated = [...new Set(updated)];

//   // Important: assign back once at the end
//   this.status = updated;

//   // Your other logic
//   this.search = '';
  this.selectTaskId(this.taskId);

//   console.log('Updated status:', this.status);
}


  search:any = '';
 selectTaskId(event: any) {
  this.taskId = event;

  // Reset when no task selected
  if (!this.taskId) {
    this.rowData = [];
    this.columnDefs = [...this.fixedColumns];
    if (this.gridApi) {
      this.gridApi.setGridOption('columnDefs', this.columnDefs); 
      this.gridApi.setGridOption('rowData', this.rowData);
      this.gridApi.sizeColumnsToFit();
    }
    return;
  }

  let payload = { 
    placement_id: this.placementId, 
    workflow_type_id: this.placementType,
    form_id: this.taskId,
    status:this.status.includes('all')?undefined:this.status
  };

  if(this.search){
    payload['search'] = this.search;
  }

  this.service.getSubmitStudentList(payload).subscribe({
    next: async (response: any) => {
      if (response?.data?.length) {
        this.rowData = response.data;
        this.overAllCount = response;
       
        // 🔹 Wrap dynamic column generation in a Promise
        const dynamicCols = await this.generateDynamicColumnsAsync();

        this.columnDefs = [...this.fixedColumns, ...dynamicCols];

        if (this.gridApi) {
          this.gridApi.setGridOption('columnDefs', this.columnDefs); 
          this.gridApi.setGridOption('rowData', this.rowData);
          this.gridApi.sizeColumnsToFit();
        }
      } else {
        this.rowData = [];
        // this.search = '';
        this.columnDefs = [...this.fixedColumns];
        if (this.gridApi) {
          this.gridApi.setGridOption('columnDefs', this.columnDefs); 
          this.gridApi.setGridOption('rowData', this.rowData);
          this.gridApi.sizeColumnsToFit();
        }
      }
    },
    error: (err) => {
      // this.search = '';
      console.error('Error loading student list:', err);
      this.rowData = [];
      if (this.gridApi) {
        // this.gridApi.setRowData(this.rowData);
        //   this.gridApi.setGridOption('columnDefs', this.columnDefs); 
          this.gridApi.setGridOption('rowData', this.rowData);
      }
    }
  });
}


  formList: any = [];
  getPlacemnetType(event: any) {
    this.placementType = event;  // ← important: store the value
    console.log('Workflow changed:', event);

    // Reset dependent fields
    this.taskId = '';
    this.rowData = [];
    this.columnDefs = [...this.fixedColumns];
    if (this.gridApi) {
      this.gridApi.setGridOption('columnDefs', this.columnDefs);
      this.gridApi.setGridOption('rowData', this.rowData);
    }

    const payload = { placement_id: this.placementId, "workflow_type_id": this.placementType };
    this.service.getSubmitformList(payload).subscribe((response: any) => {
      if (response?.data) {
        this.formList = response.data;
      }
    });
  }

  refreshData(): void {
    this.loadData();
  }

  callApiFilter(value: any): void {
    console.log('Filter applied:', value);
  }


    @ViewChild('approveTask') approveTask: ModalDirective;

    @ViewChild('approveTaskSuccess') approveTaskSuccess: ModalDirective;

    @ViewChild('disapproveTask') disapproveTask: ModalDirective;

    @ViewChild('disapproveTaskSuccess') disapproveTaskSuccess: ModalDirective;



    approveAll(){
      this.approveTask.show()
    }
    disapproveAll(){
      this.disapproveTask.show()
    }
    onApprove(row: any) {
        this.selectedList = [row];
        console.log('Approved from parent:', row);
        this.approveTask.show()
    }

    onReject(row: any) {
        this.selectedList = [row];
        console.log('Rejected from parent:', row);
        this.disapproveTask.show()
    }


  @ViewChild('mailOpen') mailOpen;
    selectedList:any = [];
    onMenuAction(action: string, row: any) {
        console.log('Menu action:', action, row);
        if(action=="disapprove"){
          this.selectedList = [row];
          this.disapproveTask.show()
        }
        if(action=="approve"){
           this.selectedList = [row];
             this.approveTask.show()
        }
        if(action=="viewProfile"){
          this.viewProfile(row);
        }
        if(action=="email"){
          this.selectedList = [row];
           this.mailOpen.ripple.trigger.click();
          // this.approveTask.show()
        }
        
    }

  viewProfile(student) {
    // this.router.navigate(['/admin/wil/view-student-profile'], {queryParams: {id: student.student_id}});
    const url = this.router.serializeUrl(
    this.router.createUrlTree(['/admin/wil/view-student-profile'], {
      queryParams: { id: student.student_id }
    })
  );

  // Open in a new tab
  window.open(url, '_blank');
  }

  selectAllRows() {
    if (this.gridApi) {
      this.gridApi.selectAll();           // selects everything
      console.log("Selected all rows");
    }
  }

  deselectAllRows() {
    if (this.gridApi) {
      this.gridApi.deselectAll();
      console.log("Deselected all rows");
    }
  }

  getSelectedRows() {
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      console.log("Selected rows:", selectedRows);
      this.selectedList = selectedRows;
      
      // or: this.gridApi.getSelectedNodes() if you need nodes
    }
  }

  onSelectionChanged(event) {
    console.log("Selection changed → ", this.gridApi.getSelectedRows());
    this.selectedList = this.gridApi.getSelectedRows();
    if(this.gridApi.getSelectedRows().length>0){
        this.showButtonHeaders = true;
    }else{
        this.showButtonHeaders = false;
    }
  }

  selectStudent(){
    
  }

// exportToCsv() {
//   if (!this.gridApi) return;

//   const fileName =
//   (this.placementGroupDetails?.title || 'export')
//     .trim()
//     .replace(/\s+/g, '_')
//     .replace(/[^a-zA-Z0-9_-]/g, '') +
//   '_export.csv';

//   this.gridApi.exportDataAsCsv({
//     fileName: fileName,
//     allColumns: true,

//     processCellCallback: (params) => {

//       console.log(
//         "params", params
//       )
//       const value = params.value;

      
//     // ❌ Skip select & action columns
//       if (params.column.getColId() === 'select' || params.column.getColId() === 'actions') {
//         return '';
//       }

      
//       // ✅ Handle attachment ARRAY
//       if (params.column.getColId() === 'attachment' || params.column.getColId() ===  'downloadable') {
//         console.log("value", value)
//         if (Array.isArray(value) && value.length > 0) {
//           // Export attachment names (comma separated)
//           return value.map(v => v.name).join(', ');
//         }
//         return '';
//       }
//       if (params.column.getColId() === 'date') {
//         return this.formatDate(value);
//       }

//       // ✅ Handle generic object safely
//       if (typeof value === 'object' && value !== null) {
//         return JSON.stringify(value);
//       }

//       return value ?? '';
//     }
//   });
// }

// exportToCsv(onlySelected: boolean = false) {
//   if (!this.gridApi) return;

//   const fileName =
//     (this.placementGroupDetails?.title || 'export')
//       .trim()
//       .replace(/\s+/g, '_')
//       .replace(/[^a-zA-Z0-9_-]/g, '') +
//     '_export.csv';

//   this.gridApi.exportDataAsCsv({
//     fileName,
//     allColumns: true,
//     onlySelected, // ✅ export selected rows if true

//     processCellCallback: (params) => {
//       const value = params.value;

//       consol.log("params.column.getColId() ",)
//       // ✅ Handle attachment ARRAY
//       if (params.column.getColId() === 'attachment' ) {
//         return Array.isArray(value)
//           ? value.map(v => v.name).join(', ')
//           : '';
//       }

//       // ✅ Format date → dd/MM/yyyy
//       if (value instanceof Date) {
//         return this.formatDate(value);
//       }

//       // ISO date string support
//       if (typeof value === 'string' && !isNaN(Date.parse(value))) {
//         return this.formatDate(new Date(value));
//       }

//       // ✅ Handle generic object safely
//       if (typeof value === 'object' && value !== null) {
//         return '';
//       }

//       return value ?? '';
//     }
//   });
// }


exportToCsv() {
  if (!this.gridApi) return;

  const fileName =
    (this.placementGroupDetails?.title || 'export')
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_-]/g, '') + '_export.csv';

  // 1. Get all column IDs
  //    Use getAllColumns() if you want hidden columns too,
  //    or getAllDisplayedColumns() for only visible ones
 const allColumnIds = this.gridApi
    .getAllDisplayedColumns?.()   // or .getColumns() / .getAllGridColumns() depending on needs
    ?.map(col => col.getColId()) ?? [];

  // 2. Exclude the columns you don't want
  const excluded = ['select', 'actions'];
  const columnKeys = allColumnIds.filter(id => !excluded.includes(id));

  console.log("columnKeys", columnKeys)

  this.gridApi.exportDataAsCsv({
    fileName,
    columnKeys,             // ← only these columns will be exported
    allColumns: false,      // ← important when using columnKeys

    processCellCallback: (params) => {

      console.log("params", params)
      const value = params.value;
      const colId = params.column.getColId();

      // No need to skip 'select'/'actions' here anymore — already excluded

      // Handle attachment / downloadable arrays
      if (colId.toLowerCase().includes('attachment') || colId.toLowerCase().includes('downloadable') || colId.toLowerCase().includes('image')) {
        if (Array.isArray(value) && value.length > 0) {
          return value.map(v => v.url ?? '').join(', ');
        }
        return '';
      }

      // Date formatting — make sure formatDate returns string
      if (colId.toLowerCase().includes('date')) {
        const formatted = this.formatDate(value);
        // Optional: log to debug
        // console.log('Date export:', { raw: value, formatted });
        return formatted ?? '';
      }

      // Safe object handling
      if (value != null && typeof value === 'object') {
        return JSON.stringify(value);
      }

      if(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{1,3})?([Z]|[+-]\d{2}:\d{2})?)?$/.test(value)){
        console.log("value", value);
        const formatted = this.formatDate(value);
        // Optional: log to debug
        // console.log('Date export:', { raw: value, formatted });
        return formatted ?? '';
      }
      // Default: string/number/boolean/null → ''
      return value ?? '';
    },

    // Optional: uncomment if you want no headers
    // skipColumnHeaders: true,
  });
}
formatDate(value: any): string {
  // Handle null / undefined / empty
  if (!value) {
    return '';
  }

  let date: Date;

  // If it's already a Date → use it directly
  if (value instanceof Date) {
    date = value;
  }
  // If it's a string (most common case from backend/API)
  else if (typeof value === 'string') {
    date = new Date(value);
  }
  // If it's a number (timestamp in ms)
  else if (typeof value === 'number') {
    date = new Date(value);
  }
  // Anything else → fallback
  else {
    return String(value) || '';
  }

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    // Invalid date string → return original or empty
    return typeof value === 'string' ? value : '';
  }

  // Now it's safe to use Date methods
  const day   = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year  = date.getFullYear();

  return `${day}/${month}/${year}`;
}


  // Enterprise only – requires ag-grid-enterprise import & license
  exportToExcel() {
    if (!this.gridApi) return;

    const params = {
      fileName: 'grid-data-export.xlsx',
      sheetName: 'My Sheet',                     // name of the sheet
      // columnWidth: 100,                       // fixed width or 'auto'
      // onlySelected: true,
      // exportAsExcelTable: true,               // export as filterable Excel Table
      // customHeader: [['My Report Title']],    // add header rows
    };

    this.gridApi.exportDataAsExcel(params);
    // Downloads .xlsx file
  }

  Submitapprove(){
    let userDetail = JSON.parse(localStorage.getItem('userDetail'));
      const payload = {
        task_ids: this.selectedList.map(el=>el.submit_workflow_task_id),
        status: "approve",
        staff_name: userDetail?.first_name + ' ' + userDetail?.last_name,
        staff_submitted_at: new Date().toISOString(),
        move_back_user_name: '',
        move_back_date: new Date().toISOString()
      };

      this.service.approveDeclineTask(payload).subscribe({
        next: (response: any) => {
          if (response?.status == 200) {
            // this.formList = response.data;
            this.approveTask.hide();
            this.approveTaskSuccess.show();
            // this.selectTaskId(this.taskId);
            console.log('Row updated successfully.');
          } else {
            console.warn('No data returned from updateFormField:', response);
          }
        },
        error: (err: any) => {
          console.error('Failed to update row:', err);
          // Optionally, show user-friendly message
          // this.toastr.error('Failed to update row. Please try again.');
        },
        complete: () => {
          console.log('updateRow request completed.');
        }
      });
  }


  comment:any = '';
  copyfile:boolean = false;
  SubmitDisapprove(){
      let userDetail = JSON.parse(localStorage.getItem('userDetail'));
      const payload = {
        task_ids: this.selectedList.map(el=>el.submit_workflow_task_id),
        status: "declined",
        comment:  this.comment,
        copyfile:this.copyfile?this.copyfile:false,
        declined_by_id:  userDetail._id,
        declined_by_type: userDetail.type,
        // task_type: event.task_type,
          staff_name: userDetail?.first_name + ' ' + userDetail?.last_name,
          staff_submitted_at: new Date().toISOString(),
          move_back_user_name: '',
          move_back_date: new Date().toISOString()
      };

      this.service.approveDeclineTask(payload).subscribe({
        next: (response: any) => {
          if (response?.status == 200) {
            // this.formList = response.data;
            this.disapproveTask.hide();
            this.comment = '';
            this.copyfile = false;
            this.disapproveTaskSuccess.show();
            // this.selectTaskId(this.taskId);
            console.log('Row updated successfully.');
          } else {
            console.warn('No data returned from updateFormField:', response);
          }
        },
        error: (err: any) => {
          console.error('Failed to update row:', err);
        },
        complete: () => {
          console.log('updateRow request completed.');
        }
      });
  }


  updateRow(data: any): void {
    const payload = {
      _id: data.submit_workflow_task_id,
      form_fields: data.form_fields
    };

    this.service.updateFormField(payload).subscribe({
      next: (response: any) => {
        if (response?.status == 200) {
          // this.formList = response.data;
          this.selectTaskId(this.taskId);

          this.gridApi.refreshCells({
            force: true
          });
          console.log('Row updated successfully.');
        } else {
          console.warn('No data returned from updateFormField:', response);
        }
      },
      error: (err: any) => {
        console.error('Failed to update row:', err);
        // Optionally, show user-friendly message
        // this.toastr.error('Failed to update row. Please try again.');
      },
      complete: () => {
        console.log('updateRow request completed.');
      }
    });
  }


  hideAllColumns() {
    const nonPinned = this.gridApi
      .getColumns()
      ?.filter(c => !c.isPinned())
      .map(c => c.getColId()) ?? [];

    // this.gridApi.setColumnsVisible(nonPinned, false);

    const allColumns = this.gridApi.getColumns() || [];

    // Keep pinned columns visible
    const pinnedColumnIds = allColumns
      .filter(c => c.isPinned())
      .map(c => c.getColId());

    // Get non-pinned columns
    const nonPinnedColumnIds = allColumns
      .filter(c => !c.isPinned())
      .map(c => c.getColId());

    // Hide all non-pinned
    this.gridApi.setColumnsVisible(nonPinnedColumnIds, false);

    // Show only first 5 non-pinned + all pinned
    const columnsToShow = [
      ...pinnedColumnIds,
      ...nonPinnedColumnIds.slice(0, )
    ];

    this.gridApi.setColumnsVisible(columnsToShow, true);
  }

  showAllColumns() {
    // const allCols = this.columnApi.getAllColumns();
    // this.columnApi.setColumnsVisible(
    //   allCols.map(c => c.getColId()),
    //   true
    // );
    const cols = this.gridApi.getColumns()?.map(c => c.getColId()) || [];
    this.gridApi.setColumnsVisible(cols, true);
  }

   zoomLevel = 1.0;
  minZoom = 0.5;
  maxZoom = 2.0;
  zoomStep = 0.2;
  
  zoomIn() {
    this.zoomLevel = Math.min(this.maxZoom, this.zoomLevel + this.zoomStep);
    this.applyZoom();
  }

  zoomOut() {
    this.zoomLevel = Math.max(this.minZoom, this.zoomLevel - this.zoomStep);
    this.applyZoom();
  }

  resetZoom() {
    this.zoomLevel = 1.0;
    this.applyZoom();
  }
  @ViewChild('gridContainer') grid!: AgGridAngular;


applyZoom() {
  if (!this.gridApi) return;

  // --- 1️⃣ Scale rows ---
  this.gridApi.forEachNode((rowNode) => {
    rowNode.setRowHeight(this.originalRowHeight * this.zoomLevel);
  });
  this.gridApi.onRowHeightChanged();

  // --- 2️⃣ Scale header height ---
  document.documentElement.style.setProperty(
    '--ag-header-height',
    `${this.originalHeaderHeight * this.zoomLevel}px`
  );

  // --- 3️⃣ Scale fonts & cell padding ---
  const root = document.documentElement;
  root.style.setProperty('--ag-font-size', `${this.originalFontSize * this.zoomLevel}px`);
  root.style.setProperty('--ag-cell-horizontal-padding', `${this.originalCellHorizontalPadding * this.zoomLevel}px`);
  root.style.setProperty('--ag-cell-vertical-padding', `${this.originalCellVerticalPadding * this.zoomLevel}px`);

  // --- 4️⃣ Scale column widths ---
  const allColumns = this.gridApi.getColumns() || [];
  const widthChanges = allColumns.map(col => ({
    key: col.getColId(),
    newWidth: Math.max(
      60,
      Math.min(600, (this.originalColumnWidths[col.getColId()] || col.getActualWidth()) * this.zoomLevel)
    )
  }));
  if (widthChanges.length > 0) {
    this.gridApi.setColumnWidths(widthChanges);
  }

  // --- 5️⃣ Redraw ---
  this.gridApi.refreshHeader();
  this.gridApi.redrawRows();
  this.gridApi.refreshCells({ force: true });
}

}