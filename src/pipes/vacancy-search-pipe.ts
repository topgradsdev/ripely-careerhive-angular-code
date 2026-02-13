import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'vacancyfilter'
})
export class VacancyFilterPipe implements PipeTransform {
  transform(items: any, searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLowerCase();
    return items.filter(item => item.job_title.toLowerCase().includes(searchText));
  }
}