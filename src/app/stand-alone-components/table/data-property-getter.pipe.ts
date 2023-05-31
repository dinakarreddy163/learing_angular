import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataPropertyGetter',
  standalone: true,
})
export class DataPropertyGetterPipe implements PipeTransform {
  transform(object: any, keyName: string, nestedDataKey: any): any {
    if(nestedDataKey) {
      return object[nestedDataKey][keyName];
    }
    return object[keyName];
  }
}
