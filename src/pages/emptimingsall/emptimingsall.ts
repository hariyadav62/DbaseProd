import { RestcallsProvider } from './../../providers/restcalls/restcalls';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-emptimingsall',
  templateUrl: 'emptimingsall.html',
})
export class EmptimingsallPage {
  selectedDay:any;
  empCode:any; 
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public restCall:RestcallsProvider) {
    
  }
  TimeByDate(){ 
    if(this.selectedDay != undefined && this.empCode != undefined){     
      let date: Date = new Date(this.selectedDay); 
      this.restCall.EmployeeTimingsByEmpCodeAndDate(this.empCode, this.selectedDay);
    }else if(this.selectedDay != undefined && this.empCode == undefined){
      this.restCall.EmployeeTimingsByDate(this.selectedDay);
    }
  }
  
  ionViewWillEnter() {
    this.restCall.retrieveEmployee(); 
    if(this.navParams.get("empCode"))
    {
       this.empCode = this.navParams.data.empCode;
    }
    let date = new Date();
    date.setDate(date.getDate()-1); 
    this.selectedDay = date.getFullYear()+'-'+(("0" + (date.getMonth() + 1)).slice(-2))+'-'+(("0" + date.getDate()).slice(-2));
    this.TimeByDate();
  }
 
}
