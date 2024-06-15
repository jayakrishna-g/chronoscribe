import { Pipe, PipeTransform } from '@angular/core';

export interface Interval {
  [key: string]: number;
}

@Pipe({
  name: 'timeConversion',
  standalone: true,
})
export class TimeConversionPipe implements PipeTransform {
  intervals: Interval = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  transform(value: string, ...args: unknown[]): any {
    try {
      let val = parseFloat(value);
      let ret = '';
      let counter;
      // eslint-disable-next-line guard-for-in
      for (const i in this.intervals) {
        counter = Math.floor(val / this.intervals[i]);
        if (counter > 0) {
          val -= counter * this.intervals[i];
          if (counter === 1) {
            ret += counter + ' ' + i + ' '; // singular (1 day ago)
          } else {
            ret += counter + ' ' + i + 's '; // plural (2 days ago)
          }
          if (i === 'year' || i === 'month' || i === 'week' || i === 'day') {
            break;
          }
        }
      }
      return ret;
    } catch (err) {
      return '-';
    }
  }
}
