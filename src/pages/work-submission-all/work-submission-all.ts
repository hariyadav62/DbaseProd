import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RestcallsProvider } from '../../providers/restcalls/restcalls';

@Component({
  selector: 'page-work-submission-all',
  templateUrl: 'work-submission-all.html',
})
export class WorkSubmissionAllPage {
  selectedMonth: any;
  empcode: any='All';
  searchHead: any = "Top 50";
  selDay: any;
  month= new Array();
  days = new Array();
 
  constructor(public navCtrl: NavController, public navParams: NavParams, public restCall: RestcallsProvider) {
    this.restCall.LoadMyTeam(this.restCall.currentuser.Designation);
  }

  async ionViewWillEnter() {
    this.restCall.TeamWorkReports(this.empcode,0,0,0,this.restCall.currentuser.Designation);
    this.searchHead = "Top 50"; 
    this.selectedMonth = null;
    this.selDay = null;
    this.empcode = 'All';
    this.restCall.loadCheckinDates = null;
    await this.restCall.LoadWorkReportYearMonth(this.empcode,this.restCall.currentuser.Designation); 
  } 
  ionViewDidLoad() { 
    this.month[0] = "January";
    this.month[1] = "February";
    this.month[2] = "March";
    this.month[3] = "April";
    this.month[4] = "May";
    this.month[5] = "June";
    this.month[6] = "July";
    this.month[7] = "August";
    this.month[8] = "September";
    this.month[9] = "October";
    this.month[10] = "November";
    this.month[11] = "December";
  }
  async SearchByCode(){
    this.restCall.TeamWorkReports(this.empcode,0,0,0,this.restCall.currentuser.Designation);
    this.searchHead = "Top 50";
    this.selectedMonth = null;
    this.selDay = null;
    await this.restCall.LoadWorkReportYearMonth(this.empcode,this.restCall.currentuser.Designation); 
  }
  async SearchByYearMonth(){
    if(this.selectedMonth != null){
      let date = new Date(this.selectedMonth.toString());
      this.restCall.TeamWorkReports(this.empcode,date.getMonth()+1, date.getFullYear(),0,this.restCall.currentuser.Designation);
      this.searchHead = this.month[date.getMonth()] + " " + date.getFullYear();
      this.selDay = null;
      await this.restCall.LoadWorkReportDates(this.empcode,this.restCall.currentuser.Designation,date.getFullYear(),date.getMonth()+1); 
    }
  }
  async SearchByYearMonthDay(){
    let date = new Date(this.selectedMonth.toString());
    this.restCall.TeamWorkReports(this.empcode,date.getMonth()+1, date.getFullYear(),this.selDay,this.restCall.currentuser.Designation);
    this.searchHead = this.month[date.getMonth()] + " "+this.selDay+","+date.getFullYear(); 
    this.selDay = null;
  }
}
