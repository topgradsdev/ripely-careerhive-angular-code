import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-time-cell-renderer',
  template: `
    <div class="custom_timepicker_wrapper">
      <input
        class="form-control"
        placeholder="hh:mm"
        matInput
        [ngxTimepicker]="toggleTimepicker"
        [(ngModel)]="value"
        (ngModelChange)="onValueChanged($event)"
      />
      <ngx-material-timepicker-toggle
        class="time_picker_toggle"
        [for]="toggleTimepicker">
        <svg ngxMaterialTimepickerToggleIcon width="17" height="9" viewBox="0 0 17 9"
             fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L8.5 8L16 0.999997" stroke="#2B2A35" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </ngx-material-timepicker-toggle>
      <ngx-material-timepicker #toggleTimepicker></ngx-material-timepicker>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    .custom_timepicker_wrapper {
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

    .time_picker_toggle {
      margin-left: 4px;
      cursor: pointer;
    }
  `]
})
export class TimeCellRendererComponent implements ICellRendererAngularComp {
  value: string | null = null;
  params: any;

  agInit(params: any): void {
    this.params = params;
    const data = params.data;

    // Get initial value from multi-step form fields if applicable
    if (data?.form_fields?.type === 'multi_step') {
      const fields = data.form_fields.fields || [];
      for (const section of fields) {
        if (!Array.isArray(section.component)) continue;
        const match = section.component.find((el: any) => {
          const title = el.elementData?.title?.replace(/<[^>]*>/g, '').trim()?.toLowerCase();
          return title === params.colDef?.headerName?.toLowerCase();
        });
        if (match?.elementData?.value) {
          this.value = match.elementData.value;
          break;
        }
      }
    } else {
      // fallback to direct value
      this.value = params.value ?? null;
    }
  }

  refresh(params: any): boolean {
    this.value = params.value;
    return true;
  }

  onValueChanged(newValue: string): void {
    this.value = newValue;
    const data = this.params?.data;

    // 1️⃣ Update multi-step form fields
    if (data?.form_fields?.type === 'multi_step') {
      const fields = data.form_fields.fields || [];
      for (const section of fields) {
        if (!Array.isArray(section.component)) continue;
        const match = section.component.find((el: any) => {
          const title = el.elementData?.title?.replace(/<[^>]*>/g, '').trim()?.toLowerCase();
          return title === this.params.colDef?.headerName?.toLowerCase();
        });
        if (match?.elementData) {
          match.elementData.value = newValue;
          break;
        }
      }
    }else{
        const fields = data.form_fields.fields || [];
      const match = fields.find((el: any) => {
          const title = el.elementData?.title?.replace(/<[^>]*>/g, '').trim()?.toLowerCase();
          return title === this.params.colDef?.headerName?.toLowerCase();
        });
        if (match?.elementData) {
          match.elementData.value = newValue;
          // break;
        }
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
        type: 'time'
      });
    }
  }
}
