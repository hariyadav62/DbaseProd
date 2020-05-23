import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { RestcallsProvider } from './../../providers/restcalls/restcalls';

@IonicPage()
@Component({
  selector: 'page-previousleaves',
  templateUrl: 'previousleaves.html',
})
export class PreviousleavesPage {
  public leaves: any;
  selectedMonth: any;
  monthSelected: boolean;
  currentuser: any;
  selDay:any;
  month = new Array();
  months: any=[];
  days: any=[];
  years: any=[];
  searchHead: any = "Top 50";
  selectedYear: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public restCall: RestcallsProvider,public alertCtrl: AlertController) {
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
    this.currentuser = this.navParams.get('empCode');
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
  async ionViewWillEnter(){
    this.restCall.LoadDatesForLeaves(this.currentuser,'',0,'0').then(()=>{
      this.years = this.restCall.datesLeave;
      if(this.restCall.datesLeave.length != 0){
        this.selectedYear = this.restCall.datesLeave[0].DATES;
        this.restCall.LoadDatesForLeaves(this.currentuser,'',this.selectedYear,'0').then(()=>{
          this.months = this.restCall.datesLeave;
          if(this.restCall.datesLeave.length != 0){
            this.selectedMonth = this.restCall.datesLeave[0].DATES;
            this.restCall.LoadAllLeaves(this.currentuser,'',this.selectedYear,this.selectedMonth,0 );
            this.searchHead = this.selectedMonth +' '+this.selectedYear;
            this.restCall.LoadDatesForLeaves(this.currentuser,'',this.selectedYear,this.selectedMonth).then(()=>{
              this.days = this.restCall.datesLeave;
            });
          }
        });
      }
      else{
        this.restCall.leaves = [];
      }
    });
  }
  // async SearchByCode(){ 
  //   this.restCall.LoadAllLeaves(this.currentuser,'',0,0,0 ); 
  //   this.searchHead = "Top 50";
  //   this.selectedMonth = null;
  //   this.selDay = null;
  //   await this.restCall.LoadLeavesYearMonth(this.currentuser,''); 
  // }
  // async SearchByYearMonth(){
  //   if(this.selectedMonth != null){
  //     let date = new Date(this.selectedMonth.toString());
  //     this.restCall.LoadAllLeaves(this.currentuser,'',date.getFullYear(),date.getMonth()+1,0);
  //     this.searchHead = this.month[date.getMonth()] + " " + date.getFullYear();
  //     this.selDay = null;
  //     await this.restCall.LoadLeaveDates(this.currentuser,'',date.getFullYear(),date.getMonth()+1); 
  //   }
  // }
  // async SearchByYearMonthDay(){
  //   let date = new Date(this.selectedMonth.toString());
  //   this.restCall.LoadAllLeaves(this.currentuser,'',date.getFullYear(),date.getMonth()+1,this.selDay);
  //   this.searchHead = this.month[date.getMonth()] + " "+this.selDay+","+date.getFullYear(); 
  //   this.selDay = null;
  // }

  SearchByYear(){
    this.restCall.LoadAllLeaves(this.currentuser,'',this.selectedYear,0,0 );
    this.restCall.LoadDatesForLeaves(this.currentuser,'',this.selectedYear,'0').then(()=>{
      this.months = this.restCall.datesLeave;
    });
    this.searchHead = this.selectedYear;
    this.selectedMonth = null;
    this.days = [];
    this.selDay = null;
  }
  SearchByMonth(){
    this.restCall.LoadAllLeaves(this.currentuser,'',this.selectedYear,this.selectedMonth,0 );
    this.restCall.LoadDatesForLeaves(this.currentuser,'',this.selectedYear,this.selectedMonth).then(()=>{
      this.days = this.restCall.datesLeave;
    });
    if(this.selectedMonth != null && this.selectedYear != null){
      this.searchHead = this.selectedMonth+" "+ this.selectedYear;
    }
    this.selDay = null;
  }
  SearchByDay(){
    this.restCall.LoadAllLeaves(this.currentuser,'',this.selectedYear,this.selectedMonth,this.selDay );
    this.searchHead = this.selDay +" "+this.selectedMonth+" "+ this.selectedYear;
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
