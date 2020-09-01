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
  empcode: any = 'All';
  currentuser:any;
  maxdate: string;
  mindate: string;
  selectedDate: any;
  filterLeaves: any;
  showPermissions: any = false;
  public LeaveReason(item : any){
    var modalPage = this.modalCtrl.create(ModelleavedetailsPage, { record : item });
    modalPage.present();
  }
  constructor(public navCtrl: NavController, public navParams: NavParams, public restCall: RestcallsProvider, public modalCtrl: ModalController) {
    this.currentuser=this.restCall.currentuser;  
  }
  ShowPermissions(){
    if(this.showPermissions){
      this.restCall.LoadAllLeaves(this.empcode,'',this.selectedDate.substring(0,4),this.selectedDate.substring(5,7),0).then(data=>{
        this.filterLeaves = this.restCall.leaves;
      })
    }
    else{
      this.restCall.LoadAllLeaves(this.empcode,'',this.selectedDate.substring(0,4),this.selectedDate.substring(5,7),0).then(data=>{
        console.log("v");
        this.filterLeaves = this.restCall.leaves.filter(object => {
            return object['LType'] == 'Leave' || object['LType'] == '';
        });
      })
    }
  }
  respondToLeave(leavedata:any,x:string){
    leavedata.L_status = x;
    this.restCall.respondTLeave(leavedata);
  }
  MaxMinDates(){
    this.restCall.LoadDatesForLeaves(this.empcode,0,0).then(()=>{
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
    if(this.currentuser.UserType == 'TEAMLEADER' || this.currentuser.UserType == 'MANAGER' ){
      this.restCall.LoadAllLeaves(this.empcode,this.currentuser.Designation,0,0,0)
    }
    else if(this.currentuser.UserType == 'ADMIN'){
      this.restCall.LoadAllLeaves(this.empcode,'',0,0,0).then(data=>{
        this.filterLeaves = this.restCall.leaves.filter(object => {
          return object['LType'] == 'Leave' || object['LType'] == '';
        });
      })
    }
    this.MaxMinDates();
  }
  SearchByEmpCode(){
    if(this.currentuser.UserType == 'TEAMLEADER' || this.currentuser.UserType == 'MANAGER' ){
      this.restCall.LoadAllLeaves(this.empcode,this.currentuser.Designation,0,0,0)
    }
    else if(this.currentuser.UserType == 'ADMIN'){
      this.restCall.LoadAllLeaves(this.empcode,'',0,0,0).then(data=>{
        this.filterLeaves = this.restCall.leaves.filter(object => {
          return object['LType'] == 'Leave' || object['LType'] == '';
        });
      });
    }
    this.MaxMinDates();
  }
  SearchByYearandMonth(){
    if(this.currentuser.UserType == 'TEAMLEADER' || this.currentuser.UserType == 'MANAGER' ){
    this.restCall.LoadAllLeaves(this.empcode,this.currentuser.Designation,this.selectedDate.substring(0,4),this.selectedDate.substring(5,7),0)
    }
    else if(this.currentuser.UserType == 'ADMIN'){
      this.restCall.LoadAllLeaves(this.empcode,'',this.selectedDate.substring(0,4),this.selectedDate.substring(5,7),0).then(data=>{
        this.filterLeaves = this.restCall.leaves.filter(object => {
          return object['LType'] == 'Leave' || object['LType'] == '';
        });
      });
    }
  }
}
