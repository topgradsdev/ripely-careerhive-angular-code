import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'studentprojectfilter'
})
export class StudentProjectFilterPipe implements PipeTransform {
  transform(items: any, searchText: string): any[] {
    console.log("items", items, searchText)
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
        item.student_info.email_id?.toLowerCase().includes(searchText) || 
        item.job_post_info.job_title?.toLowerCase().includes(searchText) || 
        item.company_info.company_name?.toLowerCase().includes(searchText) // Ensure email exists before calling toLowerCase()
      );
    });
  }
}