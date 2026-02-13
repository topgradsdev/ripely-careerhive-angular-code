import { Injectable, EventEmitter } from '@angular/core';
import  moment from 'moment';

@Injectable({
  providedIn: 'root'
})

export class Utils {
    static numbers(arg0: { count: number; min: number; max: number; }) {
      throw new Error('Method not implemented.');
    }
    static CHART_COLORS: any;
    static transparentize(red: any, arg1: number) {
      throw new Error('Method not implemented.');
    }
    static convertDate(date: string | Object, format: string) {
        return moment(date).format(format);
    }

    public extractCharacter(data: string, charAt: number) {
        return data.charAt(charAt);
    }

    static convertIntoDateObject(date: string) {
        return new Date(date);
    }

}