import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-date-cell-renderer',
  template: `
    <div class="custom_datepicker_container">
      <input
        class="form-control"
        placeholder="Select Date"
        [matDatepicker]="datePicker"
        [(ngModel)]="value"
        (ngModelChange)="onValueChanged($event)"
      />
      <mat-datepicker-toggle matSuffix [for]="datePicker">
        <svg matDatepickerToggleIcon width="18" height="18" viewBox="0 0 18 18" fill="none"
             xmlns="http://www.w3.org/2000/svg">
          <path d="M14.25 3H3.75C2.92157 3 2.25 3.67157 2.25 4.5V15C2.25 15.8284 2.92157 16.5 3.75 16.5H14.25C15.0784 16.5 15.75 15.8284 15.75 15V4.5C15.75 3.67157 15.0784 3 14.25 3Z"
                stroke="#2B2A35" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 1.5V4.5" stroke="#2B2A35" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M6 1.5V4.5" stroke="#2B2A35" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2.25 7.5H15.75" stroke="#2B2A35" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </mat-datepicker-toggle>
      <mat-datepicker #datePicker></mat-datepicker>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    .custom_datepicker_container {
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
    }

    input.form-control {
      width: 100%;
      height: 100%;
      padding: 4px 8px;
      box-sizing: border-box;
      border-radius: 4px;
      border: 1px solid #ccc;
    }

    input.form-control:focus {
      outline: none;
      border-color: #80bdff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }
  `]
})
export class DateCellRendererComponent implements ICellRendererAngularComp {
  value: Date | null = null;
  params: any;

  agInit(params: any): void {
    this.params = params;
    const data = params.data;

    // Initialize value from multi-step form fields if applicable
    if (data?.form_fields?.type === 'multi_step') {
      const fields = data.form_fields.fields || [];
      for (const section of fields) {
        if (!Array.isArray(section.component)) continue;

        const match = section.component.find((el: any) => {
          const title = el.elementData?.title?.replace(/<[^>]*>/g, '').trim()?.toLowerCase();
          return title === params.colDef.headerName?.toLowerCase();
        });

        if (match?.elementData?.value) {
          this.value = new Date(match.elementData.value);
          break;
        }
      }
    } else {
      // fallback to cell value
      this.value = params.value ? new Date(params.value) : null;
    }
  }

  refresh(params: any): boolean {
    this.value = params.value ? new Date(params.value) : null;
    return true;
  }

  onValueChanged(newValue: Date | null): void {
    this.value = newValue;
    const data = this.params?.data;

    // 1️⃣ Update multi-step form fields
    if (data?.form_fields?.type === 'multi_step') {
      const fields = data.form_fields.fields || [];
      for (const section of fields) {
        if (!Array.isArray(section.component)) continue;
        const match = section.component.find((el: any) => {
          const title = el.elementData?.title?.replace(/<[^>]*>/g, '').trim()?.toLowerCase();
          return title === this.params.colDef.headerName?.toLowerCase();
        });
        if (match?.elementData) {
          match.elementData.value = newValue?.toISOString() ?? null;
          break;
        }
      }
    }else{
       const fields = data.form_fields.fields || [];
      // for (const section of fields) {
        // if (!Array.isArray(section.component)) continue;
        const match = fields.find((el: any) => {
          const title = el.elementData?.title?.replace(/<[^>]*>/g, '').trim()?.toLowerCase();
          return title === this.params.colDef.headerName?.toLowerCase();
        });
        if (match?.elementData) {
          match.elementData.value = newValue?.toISOString() ?? null;
          // break;
        }
      // }
    }

    // 2️⃣ Update AG Grid row data
    if (this.params?.node && this.params.colDef?.field) {
      this.params.node.setDataValue(this.params.colDef.field, newValue);
    }

    // 3️⃣ Call per-cell callback
    if (typeof this.params?.onValueChange === 'function') {
      this.params.onValueChange(newValue, data);
    }

    // 4️⃣ Call parent handler via context if available
    if (this.params?.context?.componentParent?.onCellValueChanged) {
      this.params.context.componentParent.onCellValueChanged({
        colKey: this.params.colDef.field || this.params.colDef.headerName,
        rowData: data,
        newValue: newValue,
        oldValue: this.params.oldValue ?? this.params.value,
        type: 'date'
      });
    }
  }
}
