import { Component, Input, OnInit } from '@angular/core';

/**
 * Generated class for the SalaryDetailsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'salary-details',
  templateUrl: 'salary-details.html'
})
export class SalaryDetailsComponent implements OnInit {
  @Input('allempsalarydetails') allempsalarydetails:any;
  @Input('empcode') empcode:any; 
  salDetails: any;

  constructor() {}
  ngOnInit() {
    this.salDetails = this.allempsalarydetails.filter(object => {
      return object['EMPCODE'] == this.empcode;
    });
    console.log(this.salDetails)
  }

}
