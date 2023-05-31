import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status',
  standalone: true
})
export class StatusPipe implements PipeTransform {
  transform(value: number | undefined, ...args: unknown[]): string {
    if (value === 1) {
      return 'active';
    } else if (value === 0) {
      return 'inactive';
    } else {
      return 'pending';
    }
  }
}
