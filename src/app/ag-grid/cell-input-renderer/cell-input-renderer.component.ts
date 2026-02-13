import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-cell-input-renderer',
  templateUrl: './cell-input-renderer.component.html',
  styleUrls: ['./cell-input-renderer.component.scss']
})
// export class CellInputRendererComponent implements ICellRendererAngularComp, AfterViewInit {
//   value: any;
//   originalValue: any;
//   placeholder: string;
//   params: any;

//   constructor(private elRef: ElementRef) {}

//   agInit(params: any): void {
//     this.params = params;
//     this.value = params.value ?? '';
//     this.originalValue = this.value; // store original value
//     this.placeholder = params.placeholder || '';
//     // if(this.originalValue != params.value){
//     //     this.onBlur();
//     // }
//   }

//   refresh(params: any): boolean {
//     this.value = params.value ?? '';
//     this.originalValue = this.value; // refresh original value too
//     return true;
//   }


//   ngAfterViewInit() {
//     // Subscribe to column resize event
//     if (this.params?.api) {
//       this.params.api.addEventListener('columnResized', () => {
//         this.resizeInput();
//       });
//     }
//   }

//   resizeInput() {
//     const container = this.elRef.nativeElement.querySelector('input');
//     if (container) {
//       // Force input width to match parent cell width
//       container.style.width = '100%';
//     }
//   }


//   onBlur() {
//     // Only proceed if value changed
//     if (this.value === this.originalValue) {
//       return; // Do nothing
//     }

//     const data = this.params?.data;

//     if (data?.form_fields?.type === 'multi_step') {
//       const fields = data.form_fields.fields || [];

//       for (const section of fields) {
//         if (!Array.isArray(section.component)) continue;

//         const match = section.component.find((el: any) => {
//           const title = el.elementData?.title?.replace(/<[^>]*>/g, '').trim()?.toLowerCase();
//           return title === (this.params.colDef?.headerName || '').toLowerCase();
//         });

//         if (match?.elementData) {
//           match.elementData.value = this.value;
//           break;
//         }
//       }
//     } else {
//       const fields = data.form_fields.fields || [];
//       const match = fields.find((el: any) => {
//         const title = el.elementData?.title?.replace(/<[^>]*>/g, '').trim()?.toLowerCase();
//         return title === (this.params.colDef?.headerName || '').toLowerCase();
//       });

//       if (match?.elementData) {
//         match.elementData.value = this.value;
//       }
//     }

//     // Call the parent callback only if value changed
//     if (typeof this.params?.onValueChange === 'function') {
//       this.params.onValueChange(this.value, data);
//     }

//     // Update originalValue for next blur
//     this.originalValue = this.value;
//   }
// }


export class CellInputRendererComponent implements ICellRendererAngularComp {
  params!: any;
  value!: any;
  placeholder!: string;

  agInit(params: any): void {
    this.params = params;
    this.value = params.value;
    this.placeholder = params.placeholder || 'Enter value';
  }

  refresh(params: any): boolean {
    this.value = params.value;
    return true;
  }

  startEdit() {
    this.params.api.startEditingCell({
      rowIndex: this.params.node.rowIndex,
      colKey: this.params.column.getId()
    });
  }
}

// export class CellInputRendererComponent
//   implements ICellRendererAngularComp, AfterViewInit {

//   value: any;
//   originalValue: any;
//   isDirty = false;
// placeholder: string;
//   params: any;

//   constructor(private elRef: ElementRef) {}

//   agInit(params: any): void {
//     this.params = params;
//     this.value = params.value ?? '';
//     this.originalValue = this.value;
//     this.placeholder = params.placeholder || '';
//   }

//   refresh(params: any): boolean {
//     this.value = params.value ?? '';
//     this.originalValue = this.value;
//     this.isDirty = false;
//     return true;
//   }

//   onInput() {
//     this.isDirty = true;
//   }

//   onFocusOut() {
//     // 🔑 GUARANTEED save when clicking another column
//     if (!this.isDirty || this.value === this.originalValue) {
//       return;
//     }

//     const data = this.params?.data;

//     if (data?.form_fields?.type === 'multi_step') {
//       for (const section of data.form_fields.fields || []) {
//         if (!Array.isArray(section.component)) continue;

//         const match = section.component.find((el: any) =>
//           el.elementData?.title
//             ?.replace(/<[^>]*>/g, '')
//             .trim()
//             .toLowerCase() ===
//           (this.params.colDef?.headerName || '').toLowerCase()
//         );

//         if (match?.elementData) {
//           match.elementData.value = this.value;
//           break;
//         }
//       }
//     } else {
//       const match = data.form_fields.fields?.find((el: any) =>
//         el.elementData?.title
//           ?.replace(/<[^>]*>/g, '')
//           .trim()
//           .toLowerCase() ===
//         (this.params.colDef?.headerName || '').toLowerCase()
//       );

//       if (match?.elementData) {
//         match.elementData.value = this.value;
//       }
//     }

//     if (typeof this.params?.onValueChange === 'function') {
//       this.params.onValueChange(this.value, data);
//     }

//     this.originalValue = this.value;
//     this.isDirty = false;
//   }

//   ngAfterViewInit() {
//     const input = this.elRef.nativeElement.querySelector('input');
//     if (input) {
//       input.style.width = '100%';
//     }
//   }
// }
