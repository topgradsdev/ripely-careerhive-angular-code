import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'studentfilter'
})
export class StudentFilterPipe implements PipeTransform {
  transform(items: any, searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLowerCase();
    return items.filter(item => {
      const fullName = `${item.student_info.first_name} ${item.student_info.last_name}`.toLowerCase();
      return (
        fullName.includes(searchText) || 
        item.student_info.email_id?.toLowerCase().includes(searchText) // Ensure email exists before calling toLowerCase()
      );
    });
  }
}