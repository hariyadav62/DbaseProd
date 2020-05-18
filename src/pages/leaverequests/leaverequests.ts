import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { RestcallsProvider } from './../../providers/restcalls/restcalls';
import { ModelleavedetailsPage } from '../modelleavedetails/modelleavedetails';

@IonicPage()
@Component({
  selector: 'page-leaverequests',
  templateUrl: 'leaverequests.html',
})
export class LeaverequestsPage {
  month = new Array();
  searchHead: any = "Top 50";
  empcode: any = 'All';
  currentuser:any;
  selectedMonth: any;
  selDay: any;
  selectedYear: any;
  months: any=[];
  days: any=[];
  years: any=[];
  public LeaveReason(item : any){
    var modalPage = this.modalCtrl.create(ModelleavedetailsPage, { record : item });
    modalPage.present();
  }
  constructor(public navCtrl: NavController, public navParams: NavParams, public restCall: RestcallsProvider, public modalCtrl: ModalController) {
    this.currentuser=this.restCall.currentuser;  
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
  respondToLeave(leavedata:any,x:string){
    leavedata.L_status = x;
    this.restCall.respondTLeave(leavedata);
  }
  async LeavesByMonth(){ 
    if(this.selectedMonth != undefined && this.empcode != 'All' ){     
      let date: Date = new Date(this.selectedMonth); 
      await this.restCall.retrieveEmployeeLeavesByMonth(this.empcode, date.getMonth()+1, date.getFullYear(),this.restCall.currentuser.Designation);
      this.searchHead = this.month[date.getMonth()] + " "+date.getFullYear();
    }else if(this.selectedMonth != undefined && this.empcode == 'All' ){ 
      this.restCall.retrieveEmployeeLeavesByMonth(this.empcode, 0, 0,this.restCall.currentuser.Designation);
    }
  }
  async ionViewWillEnter() { 
    this.searchHead = "Top 50";
    if(this.restCall.currentuser.UserType == 'ADMIN'){
      this.restCall.LoadAllLeaves(this.empcode,'',0,0,0 );
      this.restCall.LoadDatesForLeaves(this.empcode,'',0,'0').then(()=>{
        this.years = this.restCall.datesLeave;
      });
    }
    if(this.restCall.currentuser.UserType == 'TEAMLEADER' || this.restCall.currentuser.UserType == 'MANAGER'){
      this.restCall.LoadAllLeaves(this.empcode,this.restCall.currentuser.Designation,0,0,0 );
      this.restCall.LoadDatesForLeaves(this.empcode,this.restCall.currentuser.Designation,0,'0').then(()=>{
        this.years = this.restCall.datesLeave;
      });
    }
    this.selectedYear = null;
    this.selDay = null;
    this.selectedMonth = null;
    this.restCall.loadCheckinDates = null;
  }

  async SearchByCode(){ 
    if(this.restCall.currentuser.UserType == 'ADMIN'){
      this.restCall.LoadAllLeaves(this.empcode,'',0,0,0 );
      await this.restCall.LoadLeavesYearMonth(this.empcode,''); 
    }
    if(this.restCall.currentuser.UserType == 'TEAMLEADER' || this.restCall.currentuser.UserType == 'MANAGER'){
      this.restCall.LoadAllLeaves(this.empcode, this.restCall.currentuser.Designation,0,0,0);
      await this.restCall.LoadLeavesYearMonth(this.empcode,this.restCall.currentuser.Designation); 
    }
    this.searchHead = "Top 50";
    this.selectedMonth = null;
    this.selDay = null;
  }
  async SearchByYearMonth(){
    if(this.selectedMonth != null){
      let date = new Date(this.selectedMonth.toString());
      if(this.restCall.currentuser.UserType == 'ADMIN'){
        this.restCall.LoadAllLeaves(this.empcode,'',date.getFullYear(),date.getMonth()+1,0);
        await this.restCall.LoadLeaveDates(this.empcode,'',date.getFullYear(),date.getMonth()+1); 
      }
      if(this.restCall.currentuser.UserType == 'TEAMLEADER' || this.restCall.currentuser.UserType == 'MANAGER'){
        this.restCall.LoadAllLeaves(this.empcode, this.restCall.currentuser.Designation,date.getFullYear(),date.getMonth()+1,0);
        await this.restCall.LoadLeaveDates(this.empcode,this.restCall.currentuser.Designation,date.getFullYear(),date.getMonth()+1); 
      }
      this.searchHead = this.month[date.getMonth()] + " " + date.getFullYear();
      this.selDay = null;
    }
  }
  async SearchByYearMonthDay(){
    let date = new Date(this.selectedMonth.toString());
    if(this.restCall.currentuser.UserType == 'ADMIN'){
      this.restCall.LoadAllLeaves(this.empcode,'',date.getFullYear(),date.getMonth()+1,this.selDay);
    }else{
      this.restCall.LoadAllLeaves(this.empcode,this.restCall.currentuser.Designation,date.getFullYear(),date.getMonth()+1,this.selDay);
    }
    this.searchHead = this.month[date.getMonth()] + " "+this.selDay+","+date.getFullYear(); 
    this.selDay = null;
  }
  SearchByEmpCode(){
    if(this.restCall.currentuser.UserType == 'ADMIN'){
      this.restCall.LoadAllLeaves(this.empcode,'',0,0,0 );
      this.restCall.LoadDatesForLeaves(this.empcode,'',0,'0').then(()=>{
        this.years = this.restCall.datesLeave;
      });
    }
    if(this.restCall.currentuser.UserType == 'TEAMLEADER' || this.restCall.currentuser.UserType == 'MANAGER'){
      this.restCall.LoadAllLeaves(this.empcode,this.restCall.currentuser.Designation,0,0,0 );
      this.restCall.LoadDatesForLeaves(this.empcode,this.restCall.currentuser.Designation,0,'0').then(()=>{
        this.years = this.restCall.datesLeave;
      });
    }
    this.selectedYear = null;
    this.searchHead = "Top 50";
    this.selectedMonth = null;
    this.months = [];
    this.days = [];
    this.selDay = null;
  }
  SearchByYear(){
    if(this.restCall.currentuser.UserType == 'ADMIN'){
      this.restCall.LoadAllLeaves(this.empcode,'',this.selectedYear,0,0 );
      this.restCall.LoadDatesForLeaves(this.empcode,'',this.selectedYear,'0').then(()=>{
        this.months = this.restCall.datesLeave;
      });
    }
    if(this.restCall.currentuser.UserType == 'TEAMLEADER' || this.restCall.currentuser.UserType == 'MANAGER'){
      this.restCall.LoadAllLeaves(this.empcode,this.restCall.currentuser.Designation,this.selectedYear,0,0 );
      this.restCall.LoadDatesForLeaves(this.empcode,this.restCall.currentuser.Designation,this.selectedYear,'0').then(()=>{
        this.months = this.restCall.datesLeave;
      });
    }
    this.searchHead = this.selectedYear;
    this.selectedMonth = null;
    this.days = [];
    this.selDay = null;
  }
  SearchByMonth(){
    if(this.restCall.currentuser.UserType == 'ADMIN'){
      this.restCall.LoadAllLeaves(this.empcode,'',this.selectedYear,this.selectedMonth,0 );
      this.restCall.LoadDatesForLeaves(this.empcode,'',this.selectedYear,this.selectedMonth).then(()=>{
        this.days = this.restCall.datesLeave;
      });
    }
    if(this.restCall.currentuser.UserType == 'TEAMLEADER' || this.restCall.currentuser.UserType == 'MANAGER'){
      this.restCall.LoadAllLeaves(this.empcode,this.restCall.currentuser.Designation,this.selectedYear,this.selectedMonth,0 );
      this.restCall.LoadDatesForLeaves(this.empcode,this.restCall.currentuser.Designation,this.selectedYear,this.selectedMonth).then(()=>{
        this.days = this.restCall.datesLeave;
      });
    }
    this.searchHead = this.selectedMonth+" "+ this.selectedYear;
    this.selDay = null;
  }
  SearchByDay(){
    if(this.restCall.currentuser.UserType == 'ADMIN'){
      this.restCall.LoadAllLeaves(this.empcode,'',this.selectedYear,this.selectedMonth,this.selDay );
    }
    if(this.restCall.currentuser.UserType == 'TEAMLEADER' || this.restCall.currentuser.UserType == 'MANAGER'){
      this.restCall.LoadAllLeaves(this.empcode,this.restCall.currentuser.Designation,this.selectedYear,this.selectedMonth,this.selDay );
    }
    this.searchHead = this.selDay +" "+this.selectedMonth+" "+ this.selectedYear;

  }
  
}
