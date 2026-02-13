import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter'
})

export class SearchPipe implements PipeTransform {
    transform(items: any, field?: string, searchText?: any): any {

        if(!items)return null;
        if(!searchText)return items;

        searchText = searchText.toLowerCase();

        if (field === 'nested') {
            return items.filter(item => {
                return item.items.some((it) => {
                    return it.name.toLowerCase().includes(searchText);
                 });
            });
        } else {
            return items.filter(item => {
                return item.name.toLowerCase().includes(searchText);
            });
        }
        
      }
}