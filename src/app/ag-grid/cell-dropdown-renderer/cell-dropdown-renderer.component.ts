import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-cell-dropdown-renderer',
  template: `
  <!-- MULTI SELECT (checkbox) -->

  <!-- <ng-select
    *ngIf="isCheckbox; else singleSelect"
    [items]="options"
    bindLabel="item"
    bindValue="item"
    [multiple]="true"
    [searchable]="true"
    [clearable]="false"
    appendTo="body"
    [dropdownPosition]="'auto'"
    placeholder="Select attributes"
    [(ngModel)]="value"
    [ngModelOptions]="{ standalone: true }"
    (ngModelChange)="onValueChanged($event)">
  </ng-select> -->


  <ng-select *ngIf="isCheckbox; else singleSelect" 
    [items]="options" 
    bindLabel="item" 
    bindValue="item" 
    [multiple]="true" 
    [searchable]="true" 
    style="max-height: 80px !important;overflow: scroll !important;" 
    [clearable]="false" 
    [closeOnSelect]="false" 
    appendTo="body" 
    [dropdownPosition]="'auto'" 
    placeholder="Select attributes" 
    [(ngModel)]="value" 
    [ngModelOptions]="{ standalone: true }" 
    (close)="onMultiSelectClose()" 
    (mousedown)="$event.stopPropagation()" 
    (click)="$event.stopPropagation()" > 
  </ng-select>


  <!-- <ng-select
  *ngIf="isCheckbox; else singleSelect"
  [items]="options"
  bindLabel="item"
  bindValue="item"
  [multiple]="true"
  [searchable]="true"
  [clearable]="false"
  [closeOnSelect]="false"
  appendTo="body"
  dropdownPosition="auto"
  placeholder="Select attributes"
  [(ngModel)]="tempValue"
  [ngModelOptions]="{ standalone: true }"

  (close)="onMultiSelectClose()"

  (mousedown)="$event.stopPropagation()"
  (click)="$event.stopPropagation()"
>
</ng-select> -->



  <!-- SINGLE SELECT -->
  <ng-template #singleSelect>
    <select
      class="ag-cell-edit-input dropdown-input"
      [ngModel]="value"
      (ngModelChange)="onValueChanged($event)"
      [ngStyle]="{ width: '100%', height: '100%' }"
    >
      <option
        *ngFor="let opt of options; trackBy: trackByItem"
        [value]="opt.item"
      >
        {{ opt.item }}
      </option>
    </select>
  </ng-template>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
      width: 100%;
    }
    /* allow multi-select chips to wrap */
    .ng-select.ng-select-multiple .ng-value-container {
      white-space: normal !important;
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
    }

    /* allow grid cell to grow */
    .ag-cell {
      overflow: visible !important;
    }


    .ag-grid-angular .ng-dropdown-panel {
      position: fixed !important; /* float above all */
      z-index: 10000 !important;  /* higher than grid */
      min-width: 150px;           /* optional */
    }

    /* optional: make the panel visible even inside clipped container */
    .ag-cell .ng-dropdown-panel {
      overflow: visible !important;
    }

    .ng-dropdown-panel {
      width: auto !important;   /* prevents panel from being too small */
      max-height: 300px;        /* optional scroll */
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }

    .ng-dropdown-panel {
      z-index: 9999 !important;
      position: absolute !important;
    }

    .dropdown-input {
      padding: 4px 8px; /* space for dropdown arrow */
      box-sizing: border-box;
      border: 1px solid #ccc; /* show border so arrow appears */
      border-radius: 4px;
      background-color: white;
      appearance: menulist; /* ensures native dropdown arrow */
      -webkit-appearance: menulist;
      -moz-appearance: menulist;
      font-size: 14px;
    }

    .dropdown-input:focus {
      outline: none;
      border-color: #80bdff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }
  `]
})
export class CellDropdownRendererComponent implements ICellRendererAngularComp {
  params: any;
  value: any;
  options: any[] = [];

  compareFn = (a: any, b: any) => a === b;

  private normalizeTitle(value: string): string {
    return value
      ?.replace(/<[^>]*>/g, '')   // remove HTML
      ?.replace(/\.\.\.$/, '')    // remove trailing ...
      ?.trim()
      ?.toLowerCase();
  }

  isCheckbox: boolean = false; // flag for multi-select


  agInit(params: any): void {
    this.params = params;
    this.value = params.value;



    // Preferred: options from cellRendererParams (cleaner)
    if (params.colDef?.cellRendererParams?.options) {
      this.options = params.colDef.cellRendererParams.options;
    }
    // Fallback: extract from form_fields structure
    if (params.data?.form_fields?.type === 'multi_step') {
      const fields = params.data.form_fields?.fields || [];
      for (const section of fields) {
        if (!Array.isArray(section.component)) continue;
        const match = section.component.find((el: any) => {
          const title = el.elementData?.title?.replace(/<[^>]*>/g, '').trim()?.toLowerCase();
          const fieldTitle = this.normalizeTitle(el.elementData?.title || '');
          return title === (params.colDef?.headerName || '').toLowerCase();
        });
        console.log("match", match, this.params)
        if (match?.id == "checkbox") {
          this.isCheckbox = true;
          this.options = match.elementData.items || [];
          this.value = this.options
            .filter(opt => opt.selected === true)
            .map(opt => opt.item);
          this.value = [...this.value];
          this.previousValue = [...this.value];
          console.log("this.value", this.value, this.options)
        } else {
          if (match?.elementData?.items) {
            this.options = match.elementData.items;
            break;
          }
        }

      }
    } else {
      const fields = params.data.form_fields?.fields || [];
      const match = fields.find((el: any) => {
        const title = el.elementData?.title?.replace(/<[^>]*>/g, '').trim()?.toLowerCase();
        const fieldTitle = this.normalizeTitle(el.elementData?.title || '');
        return title === (params.colDef?.headerName || '').toLowerCase();
      });
      if (match?.id == "checkbox") {
        this.isCheckbox = true;
        this.options = match.elementData.items || [];
        this.value = this.options
          .filter(opt => opt.selected === true)
          .map(opt => opt.item);
        this.value = [...this.value];
        this.previousValue = [...this.value];
        console.log("this.value", this.value, this.options)
      } else {
        this.isCheckbox = false;
        if (match?.elementData?.items) {
          this.options = match.elementData.items;
        }
      }
    }

    // Debug fallback
    if (!this.options?.length) {
      console.warn('No options found for dropdown column:', params.colDef?.headerName);
      this.options = [];
    }
  }

  refresh(params: any): boolean {
    this.value = params.value;
    return true;
  }


  // onMultiSelectClose() {
  //   console.log('Final selected values:', this.value);

  //   // Update actual value only once
  //   this.value = [...this.value];

  //   // Call your existing logic
  //   this.onValueChanged(this.value);
  // }

  private previousValue: any[] = [];


  onMultiSelectClose() {
    const current = Array.isArray(this.value) ? [...this.value] : [];
    const prev = Array.isArray(this.previousValue) ? [...this.previousValue] : [];

    const isChanged =
      current.length !== prev.length ||
      current.some(v => !prev.includes(v));

    if (!isChanged) {
      return; // ❌ nothing changed → do nothing
    }

    console.log('Final selected values:', current);

    this.previousValue = [...current];
    this.onValueChanged(current);
  }


  onValueChanged(newValue: any) {
    console.log("newValue", newValue);
    // this.value = newValue;

    // const data = this.params?.data;

    // // 1️⃣ Update the nested multi_step form_fields
    // if (data?.form_fields?.type === 'multi_step') {
    //     const fields = data.form_fields.fields || [];

    //     for (const section of fields) {
    //         if (!Array.isArray(section.component)) continue;
    //         const match = section.component.find((el: any) => {
    //             const title = el.elementData?.title?.replace(/<[^>]*>/g, '').trim()?.toLowerCase();
    //             return title === (this.params.colDef?.headerName || '').toLowerCase();
    //         });
    //         if (match?.elementData) {
    //            if(match?.id == "checkbox"){
    //               newValue.map(el=>{
    //                   match.elementData.items.map(e=>{
    //                     if(e.item == el){
    //                       e.selected = true;
    //                     }else{
    //                       e.selected = false;
    //                     }
    //                   });
    //               });
    //               break; // Stop after updating
    //           }else{
    //             match.elementData.value = newValue;
    //             break; // Stop after updating
    //           }
    //         }
    //     }
    // }else{
    //    const fields = data.form_fields.fields || [];
    //       const match = fields.find((el: any) => {
    //           const title = el.elementData?.title?.replace(/<[^>]*>/g, '').trim()?.toLowerCase();
    //           return title === (this.params.colDef?.headerName || '').toLowerCase();
    //       });

    //       if (match?.elementData) {

    //           if(match?.id == "checkbox"){
    //             newValue.map(el=>{
    //                 match.elementData.items.map(e=>{
    //                   if(e.item == el){
    //                     e.selected = true;
    //                   }else{
    //                     e.selected = false;
    //                   }
    //                 });
    //             });
    //             // break; // Stop after updating
    //         }else{
    //           match.elementData.value = newValue;
    //           // break; // Stop after updating
    //         }
    //       }
    // }

    // console.log("fields", data.form_fields.fields, newValue);

    console.log('newValue', newValue);
    this.value = newValue;

    const data = this.params?.data;
    if (!data?.form_fields) return;

    const colTitle = (this.params.colDef?.headerName || '')
      .toLowerCase()
      .trim();

    const updateCheckbox = (items: any[], selectedValues: any[]) => {
      items.forEach(item => {
        item.selected = selectedValues.includes(item.item);
      });
    };

    /* =======================
      MULTI STEP FORM
      ======================= */
    if (data.form_fields.type === 'multi_step') {
      const sections = data.form_fields.fields || [];

      for (const section of sections) {
        if (!Array.isArray(section.component)) continue;

        const match = section.component.find((el: any) => {
          const title = el.elementData?.title
            ?.replace(/<[^>]*>/g, '')
            .trim()
            .toLowerCase();
          return title === colTitle;
        });

        if (!match?.elementData) continue;

        if (match.id === 'checkbox') {
          const selectedValues = Array.isArray(newValue) ? newValue : [];

          updateCheckbox(match.elementData.items || [], selectedValues);

          // optional: store value array also
          match.elementData.value = [...selectedValues];
        } else {
          match.elementData.value = newValue;
        }

        break;
      }
    }

    /* =======================
      SINGLE STEP FORM
      ======================= */
    else {
      const fields = data.form_fields.fields || [];

      const match = fields.find((el: any) => {
        const title = el.elementData?.title
          ?.replace(/<[^>]*>/g, '')
          .trim()
          .toLowerCase();
        return title === colTitle;
      });

      if (match?.elementData) {
        if (match.id === 'checkbox') {
          const selectedValues = Array.isArray(newValue) ? newValue : [];

          updateCheckbox(match.elementData.items || [], selectedValues);

          match.elementData.value = [...selectedValues];
        } else {
          match.elementData.value = newValue;
        }
      }
    }

    console.log('Updated fields:', data.form_fields.fields);
    // return false;

    // 2️⃣ Update AG Grid row data so grid shows the change
    if (this.params?.node && this.params.colDef?.field) {
      this.params.node.setDataValue(this.params.colDef.field, newValue);
    }

    // 3️⃣ Call parent handler if exists
    if (this.params?.context?.componentParent?.onCellValueChanged) {
      this.params.context.componentParent.onCellValueChanged({
        colKey: this.params.colDef.field || this.params.colDef.headerName,
        rowData: data,
        newValue: newValue,
        oldValue: this.params.oldValue ?? this.params.value,
        type: this.isCheckbox ? 'checkbox' : 'dropdown'
      });
    }

    // Optional: call per-cell callback from params
    if (typeof this.params?.onValueChange === 'function') {
      this.params.onValueChange(newValue, data);
    }
  }

}