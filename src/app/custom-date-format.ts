// import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';

// export class CustomDateAdapter extends NativeDateAdapter {
//   parse(value: any): Date | null {
//     if (typeof value === 'string' && value.includes('/')) {
//       const [day, month, year] = value.split('/');
//       return new Date(Number(year), Number(month) - 1, Number(day));
//     }
//     return super.parse(value);
//   }

//   format(date: Date, displayFormat: string): string {
//     if (displayFormat === 'input') {
//       const day = date.getDate().toString().padStart(2, '0');
//       const month = (date.getMonth() + 1).toString().padStart(2, '0');
//       const year = date.getFullYear();
//       return `${day}/${month}/${year}`;
//     }
//     return super.format(date, displayFormat);
//   }
// }

// export const CUSTOM_DATE_FORMATS: MatDateFormats = {
//   parse: {
//     dateInput: 'DD/MM/YYYY',
//   },
//   display: {
//     dateInput: 'DD/MM/YYYY',
//     monthYearLabel: 'MMMM YYYY',
//     dateA11yLabel: 'LL',
//     monthYearA11yLabel: 'MMMM YYYY',
//   },
// };


import { MatDateFormats, MAT_DATE_FORMATS } from '@angular/material/core';

export const MY_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
