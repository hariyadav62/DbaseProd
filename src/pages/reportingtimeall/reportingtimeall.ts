import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
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
  constructor(public navCtrl: NavController, public navParams: NavParams, public restCall:RestcallsProvider,public alertCtrl: AlertController) {
  }
  ionViewDidLoad() { 
    for(let i=0; i<31;i++){
      this.days[i] = i+1;
    }
    console.log(this.days);
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
    this.restCall.LoadCheckInDates(this.empCode,0,0).then((data)=>{
      this.Years = this.restCall.loadCheckinDates;
      if(this.restCall.loadCheckinDates.length != 0){
        this.selectedYear = this.restCall.loadCheckinDates[0].DATES;
        this.restCall.LoadCheckInDates(this.empCode,this.selectedYear,0).then(()=>{
          this.Months = this.restCall.loadCheckinDates;
          if(this.restCall.loadCheckinDates.length != 0){
            this.selectedMonth = this.restCall.loadCheckinDates[0].DATES;
            this.restCall.LoadCheckIns(this.empCode,this.selectedYear,this.selectedMonth,0);
            this.searchHead = this.selectedMonth +' '+this.selectedYear;
            this.restCall.LoadCheckInDates(this.empCode,this.selectedYear,this.selectedMonth).then((data)=>{
              this.Days = this.restCall.loadCheckinDates;
            }); 
          }
        });
      }
      else{
        this.restCall.loadCheckins = [];
      }
    }) 
  }
  async SearchByYear(){
    this.restCall.LoadCheckIns(this.empCode,this.selectedYear,0,0);
    await this.restCall.LoadCheckInDates(this.empCode,this.selectedYear,0).then((data)=>{
      this.Months = this.restCall.loadCheckinDates;
    });    
    this.searchHead = this.selectedYear; 
  }
  async SearchByYearMonth(){
    this.restCall.LoadCheckIns(this.empCode,this.selectedYear,this.selectedMonth,0);
    this.restCall.LoadCheckInDates(this.empCode,this.selectedYear,this.selectedMonth).then((data)=>{
      this.Days = this.restCall.loadCheckinDates;
    });  
    if(this.selectedMonth != null && this.selectedYear != null){  
      this.searchHead = this.selectedMonth+","+this.selectedYear; 
    }
  }
  async SearchByYearMonthDay(){
    this.restCall.LoadCheckIns(this.empCode,this.selectedYear,this.selectedMonth,this.selDay);
    this.searchHead = `${this.selDay} ${this.selectedMonth},${this.selectedYear}`; 
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
  async ionViewWillEnter() {
    this.restCall.retrieveEmployee(); 
    if(this.restCall.currentuser.UserType=="ADMIN")
    {
       this.empCode = "All"; 
    }else{
      this.empCode = this.restCall.currentuser.EmpCode;
    }
    this.restCall.LoadCheckInDates(this.empCode,0,0).then((data)=>{
      this.Years = this.restCall.loadCheckinDates;
      if(this.restCall.loadCheckinDates.length != 0){
        this.selectedYear = this.restCall.loadCheckinDates[0].DATES;
        this.restCall.LoadCheckInDates(this.empCode,this.selectedYear,0).then(()=>{
          this.Months = this.restCall.loadCheckinDates;
          if(this.restCall.loadCheckinDates.length != 0){
            this.selectedMonth = this.restCall.loadCheckinDates[0].DATES;
            this.restCall.LoadCheckIns(this.empCode,this.selectedYear,this.selectedMonth,0 );
            this.searchHead = this.selectedMonth +' '+this.selectedYear;
            this.restCall.LoadCheckInDates(this.empCode,this.selectedYear,this.selectedMonth).then((data)=>{
              this.Days = this.restCall.loadCheckinDates;
            }); 
          }
        });
      }
      else{
        this.restCall.loadCheckins = [];
      }
    }); 
  }
}
