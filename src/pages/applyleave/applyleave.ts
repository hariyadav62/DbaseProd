import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { RestcallsProvider } from './../../providers/restcalls/restcalls';

@IonicPage()
@Component({
  selector: 'page-applyleave',
  templateUrl: 'applyleave.html',
})
export class ApplyleavePage {

  public leaveType : string = 'Leave';
  public startingDate :Date;
  public endingDate :Date;
  public totalDays :any;
  public leaveReason :any;
  currentuser:any;
  permission:boolean;
  halfday:boolean;
  permissionEndTime:any;
  permissionStartTime:any;
  session: any="AN";
  totalhrs: boolean;
  days: boolean;
  hrs:any;
  public leaves: any;
  selectedMonth: any;
  monthSelected: boolean;
  selDay:any;
  month = new Array();
  months: any=[];
  dayss: any=[];
  years: any=[];
  searchHead: any = "Top 50";
  selectedYear: any;
  maxdate: string;
  mindate: string;
  selectedDate: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public restCall: RestcallsProvider, public _TOAST: ToastController,public alertCtrl: AlertController) {
    this.currentuser=this.restCall.currentuser;
  }
  LoadInputs(){
    if(this.leaveType == "Half Day"){
      this.halfday = true;
      this.permission = false;
      this.days = true;
      this.totalhrs = false;
    }
    if(this.leaveType == "Permission"){
      this.permission = true;
      this.halfday = false;
      this.totalhrs = true;
      this.days = false;
    }
    if(this.leaveType == 'Leave'){
      this.halfday = false;
      this.permission = false; 
      this.totalhrs = false;
      this.days = true;
    }
  }
  calTotalDays(){
    if(this.endingDate != undefined || this.startingDate != undefined){
      if(this.leaveType == "Half Day"){
        this.endingDate = this.startingDate;
        this.totalDays = '0.5';
        console.log(this.totalDays);
      }else if(this.leaveType == "Permission"){
        this.endingDate = this.startingDate;
        this.totalDays ='0';  
      }
      else{
        this.totalDays = (new Date(this.endingDate).valueOf() - new Date(this.startingDate).valueOf())/86400000;
        this.totalDays++;
      }
    }
  }
  calTotalhrs(){
    if(this.permissionEndTime != undefined && this.permissionStartTime != undefined){
      this.hrs = (new Date().setHours(this.permissionEndTime.substring(0,2),this.permissionEndTime.substring(3))-new Date().setHours(this.permissionStartTime.substring(0,2),this.permissionStartTime.substring(3)))/60000 ;
    }
  } 
  
  applyLeave(){
    if(this.endingDate != undefined && this.startingDate != undefined && this.leaveType != undefined && this.totalDays != undefined && this.leaveReason != undefined){
     
      let applyleavedata:any   = {
        EmpCode: this.currentuser.EmpCode,
        EmpName: this.currentuser.EmpName,
        LType : this.leaveType,
        LFrom :this.startingDate,
        Lto :this.endingDate,
        Days :this.totalDays,
        PTime:'',
        Remarks :this.leaveReason,
        Request: this.currentuser.RequestTo,
        L_status: "Pending",
        CreatedDate: new Date().toLocaleString(),
        AppliedOn: new Date().toLocaleString()
      };
      if(this.leaveType == "Half Day"){
        applyleavedata.PTime = this.session;
        applyleavedata.Days = 0.5;
      }
      if(this.leaveType == "Permission"){
        applyleavedata.PTime = this.permissionStartTime + " to " + this.permissionEndTime;
      }
      this.restCall.ApplyLeave1(applyleavedata,this.currentuser.RequestTo);
      this.endingDate = null ;
      this.startingDate = null ;
      this.permissionStartTime = null;
      this.permissionEndTime = null;
      this.leaveType = '' ;
      this.totalDays = '' ;
      this.hrs = '' ;
      this.leaveReason = ''
    }
    else{
       console.log(this.endingDate , this.startingDate , this.leaveType , this.totalDays , this.leaveReason ,this.permissionStartTime,this.permissionEndTime);  
    } 
  }
  displayNotification(message : string) : void
  {
     let toast = this._TOAST.create({
        message 	: message,
        duration 	: 3000
     });
     toast.present();
  }
  LeavesByMonth(){ 
    if(this.selectedMonth != undefined){     
      this.monthSelected = true; 
      let date: Date = new Date(this.selectedMonth); 
      this.restCall.retrieveEmployeeLeavesByMonth(this.currentuser, date.getMonth()+1, date.getFullYear(),this.restCall.currentuser.Designation);

      console.log((date.getMonth()));
    }else{
      this.monthSelected = false;
      this.restCall.retrieveLeaves(this.currentuser);
    }
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
  MaxMinDates(){
    this.restCall.LoadDatesForLeaves(this.currentuser.EmpCode,0,0).then(()=>{
      if(this.restCall.datesLeave[this.restCall.datesLeave.length-1].MAXDATE != null 
        && this.restCall.datesLeave[this.restCall.datesLeave.length-1].MINDATE != null){
          let max = this.restCall.datesLeave[this.restCall.datesLeave.length-1].MAXDATE.substring(0,10);
          let min = this.restCall.datesLeave[this.restCall.datesLeave.length-1].MINDATE.substring(0,10);
          this.maxdate = max.substring(0,4)+"-"+max.substring(5,7)+"-"+max.substring(8,10);
          this.mindate = min.substring(0,4)+"-"+min.substring(5,7)+"-"+min.substring(8,10);
          this.selectedDate = max.substring(0,7);
      }
    });
  }
  async ionViewWillEnter(){
    this.restCall.retrieveEmployee();
    this.restCall.LoadAllLeaves(this.currentuser.EmpCode,'',0,0,0);
    this.MaxMinDates();
  }
  
  SearchByYearandMonth(){
    this.restCall.LoadAllLeaves(this.currentuser.EmpCode,'',this.selectedDate.substring(0,4),this.selectedDate.substring(5,7),0)
  }


  respondToLeave(leavedata:any,x:string){
    const confirm = this.alertCtrl.create({ 
      title: 'Leave Reapply',
      message: 'Do you want to Reapply?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            
          } 
        },
        {
          text: 'Yes',
          handler: () => {
            leavedata.L_status = x;
            this.restCall.respondTLeave(leavedata);
          }
        }
      ]
    });
    confirm.present();
  }
}
