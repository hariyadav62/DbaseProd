import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { RestcallsProvider } from '../../providers/restcalls/restcalls';

@Component({
  selector: 'page-reportingtimeall',
  templateUrl: 'reportingtimeall.html',
})
export class ReportingtimeallPage {
  empCode:any;
  selDay: any=0;
  selectedMonth: string | number | Date;
  searchHead: any = "Top 50";
  month= new Array();
  days= new Array();
  selectedYear: any;
  Years: any;
  Months: any;
  Days: any;
  maxdate: string;
  mindate: string;
  selectedDate: any;
  checkinReports: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController, public restCall:RestcallsProvider,public alertCtrl: AlertController) {
    this.viewCtrl = this.navParams.get('viewCtrl');
  }
  public onClickCancel() {
    this.viewCtrl.dismiss();
  }

  MaxMinDates(){
    this.restCall.LoadCheckInDates(this.empCode,0,0).then(()=>{
      if(this.restCall.loadCheckinDates[this.restCall.loadCheckinDates.length-1].MAXDATE != null 
        && this.restCall.loadCheckinDates[this.restCall.loadCheckinDates.length-1].MINDATE != null){
          let max = this.restCall.loadCheckinDates[this.restCall.loadCheckinDates.length-1].MAXDATE.substring(0,10);
          let min = this.restCall.loadCheckinDates[this.restCall.loadCheckinDates.length-1].MINDATE.substring(0,10);
          this.maxdate = max.substring(0,4)+"-"+max.substring(5,7)+"-"+max.substring(8,10);
          this.mindate = min.substring(0,4)+"-"+min.substring(5,7)+"-"+min.substring(8,10);
          this.selectedDate = max.substring(0,7);
          this.days = [];
          if(this.empCode == 'All'){
            this.restCall.loadCheckinDates.forEach(x => {
              if(x.DAYS != null){
                this.days.push(x.DAYS);
              }
            });
            this.selDay = max.substring(8,10);
          }
          else{
            this.selDay = 0
          }
      }
    });
  }
  async ionViewWillEnter(){
    this.restCall.retrieveEmployee();
    if(this.restCall.currentuser.UserType=="ADMIN")
    {
       this.empCode = "All"; 
    }else{
      this.empCode = this.restCall.currentuser.EmpCode;
    }
    this.restCall.LoadCheckIns(this.empCode,0,0,0).then(()=>{
      this.checkinReports = this.restCall.loadCheckins;
    });
    this.MaxMinDates();
  }

  SearchByEmpCode(){
      this.restCall.LoadCheckIns(this.empCode,0,0,0).then(()=>{
        this.checkinReports = this.restCall.loadCheckins;
      });
      this.MaxMinDates();    
  }
  SearchByYearandMonth(){
    this.restCall.LoadCheckIns(this.empCode,this.selectedDate.substring(0,4),this.selectedDate.substring(5,7),0)
    .then(()=>{
      this.checkinReports = this.restCall.loadCheckins;
    })
    this.restCall.LoadCheckInDates(this.empCode,this.selectedDate.substring(0,4),this.selectedDate.substring(5,7)).then(()=>{
      this.days = [];
      this.restCall.loadCheckinDates.forEach(x => {
        if(x.DAYS != null){
          this.days.push(x.DAYS);
        }
      });
      //this.once = true;
      this.selDay = this.days[0];
    })
  }
  SearchByDay(){
    this.restCall.LoadCheckIns(this.empCode,this.selectedDate.substring(0,4),this.selectedDate.substring(5,7),this.selDay).then(()=>{
      this.checkinReports = this.restCall.loadCheckins;
    })
  }
  async UpdateStatus(report:any) {
    let alert = this.alertCtrl.create();
    alert.setTitle('Update Status');

    alert.addInput({
      type: 'radio',
      label: 'Approve',
      value: 'Approved'
    });
    alert.addInput({
      type: 'radio',
      label: 'Reject',
      value: 'Rejected'
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        report.Report_Staus = data;
        if(data == 'Approved'){
          this.restCall.ApproveReport(report).then(()=>{
            this.restCall.LoadCheckIns(this.empCode,this.selectedYear,this.selectedMonth,this.selDay );
          });
        }else{
          this.restCall.respondToReport(report).then(()=>{
            this.restCall.LoadCheckIns(this.empCode,this.selectedYear,this.selectedMonth,this.selDay );
          });
        }
      }
    });
    alert.present();
  }  
}
