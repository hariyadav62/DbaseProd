import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { RestcallsProvider } from './../../providers/restcalls/restcalls';

@IonicPage()
@Component({
  selector: 'page-applyleave',
  templateUrl: 'applyleave.html',
})
export class ApplyleavePage {

  public leaveType : string;
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

  constructor(public navCtrl: NavController, public restCall: RestcallsProvider, public _TOAST: ToastController) {
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
    if(this.leaveType == 'Casual Leave' || this.leaveType == 'Sick Leave'){
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
}
