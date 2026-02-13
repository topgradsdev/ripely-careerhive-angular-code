import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-cell-number-renderer',
  templateUrl: './cell-number-renderer.component.html',
  styleUrls: ['./cell-number-renderer.component.scss']
})
export class CellNumberRendererComponent implements ICellRendererAngularComp {
  value: any;
  originalValue: any; // track initial value
  placeholder: string;
  params: any;

  agInit(params: any): void {
    this.params = params;
    this.value = params.value ?? '';
    this.originalValue = this.value; // store the initial value
    // if(this.originalValue != params.value){
    //     this.onBlur();
    // }
    this.placeholder = params.placeholder || '';
  }

  refresh(params: any): boolean {
    this.value = params.value ?? '';
    this.originalValue = this.value; // refresh original value too
    return true;
  }

  // Called on blur
  onBlur() {
    // Only proceed if value changed
    if (this.value === this.originalValue) {
      return; // Do nothing if value is same
    }

    const data = this.params?.data;

    if (data?.form_fields?.type === 'multi_step') {
      const fields = data.form_fields.fields || [];

      for (const section of fields) {
        if (!Array.isArray(section.component)) continue;

        const match = section.component.find((el: any) => {
          const title = el.elementData?.title?.replace(/<[^>]*>/g, '').trim()?.toLowerCase();
          return title === (this.params.colDef?.headerName || '').toLowerCase();
        });

        if (match?.elementData) {
          match.elementData.value = this.value; // update the value
          break; // stop after updating
        }
      }
    } else {
      const fields = data.form_fields.fields || [];
      const match = fields.find((el: any) => {
        const title = el.elementData?.title?.replace(/<[^>]*>/g, '').trim()?.toLowerCase();
        return title === (this.params.colDef?.headerName || '').toLowerCase();
      });

      if (match?.elementData) {
        match.elementData.value = this.value; // update the value
      }
    }

    // Emit callback only if value changed
    if (typeof this.params?.onValueChange === 'function') {
      this.params.onValueChange(this.value, data);
    }

    // Update originalValue so next blur only triggers if value changes again
    this.originalValue = this.value;
  }
}
