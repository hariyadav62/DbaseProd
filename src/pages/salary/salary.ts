import { Component } from '@angular/core';
import { NavController, NavParams, DateTime } from 'ionic-angular';
import { RestcallsProvider } from '../../providers/restcalls/restcalls';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'page-salary',
  templateUrl: 'salary.html',
})
export class SalaryPage {
  empcode: string;
  my: any;
  MonthSalDetails: any;
  paySlip: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public restCall: RestcallsProvider,private datePipe: DatePipe) {
  }
  ionViewWillEnter() {
    if(this.restCall.currentuser.UserType == 'ADMIN'){
      this.empcode='All'
    }else{
      this.empcode = this.restCall.currentuser.EmpCode;
    }
    this.my = new Date();
    this.my.setMonth(this.my.getMonth() - 1);
    this.my=this.datePipe.transform(this.my, 'yyyy-MM-dd');
    console.log(this.my);
    this.SearchByEmpCodeAndMonth();
  }
  SearchByEmpCodeAndMonth(){
    let date = this.datePipe.transform(this.my, 'MMM-yyyy');
    this.restCall.MonthSalDetails(date,this.empcode).then(data=>{
      this.MonthSalDetails = this.restCall.monthSalDetails;
        console.log(this.MonthSalDetails);
      });
      this.restCall.SalaryPaySlip(date).then(()=>{
        if(this.restCall.currentuser.UserType == 'ADMIN'){
          this.paySlip = this.restCall.salPaySlip;
        }else{
          this.paySlip = this.restCall.salPaySlip.filter(x => {return x['EMPCODE'] == this.empcode});
        }
        console.log(this.paySlip);
      });
  }
  // GetSalDetails(empcode){
  //   let date = this.datePipe.transform(this.my, 'MMM-yyyy');
  //   this.restCall.MonthSalDetails(date,this.empcode).then(()=>{
  //     this.MonthSalDetails = this.restCall.monthSalDetails.filter(object => {
  //       return object['EMPCODE'] == empcode;
  //     });
  //   });
  // }
  // GetPaySlip(){
  //   let date = this.datePipe.transform(this.my, 'MMM-yyyy');
  //   this.restCall.SalaryPaySlip(date).then(()=>{
  //     this.paySlip = this.restCall.salPaySlip;
  //   });
  // }
}
