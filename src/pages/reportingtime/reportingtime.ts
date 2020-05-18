import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { RestcallsProvider } from '../../providers/restcalls/restcalls';
@Component({
  selector: 'page-reportingtime',
  templateUrl: 'reportingtime.html',
})
export class ReportingtimePage {
  recheck: boolean;
  pendin: boolean;
  respond: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public restCall: RestcallsProvider,public alertCtrl: AlertController) {
    
  }
  UpdateStatus(report:any) {
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
        this.restCall.respondToReport(report);
      }
    });
    alert.present();
  } 
  respondToReport(report:any,x:string){
    report.Report_Staus = x;
    this.restCall.respondToReport(report).then(()=>{
      this.recheck = false;
      this.pendin = false;
      this.respond = false;
      this.ionViewWillEnter();
    });
  }

ApproveReport(report:any,x:string){
  report.Report_Staus = x;
  this.restCall.ApproveReport(report).then(()=>{
    this.recheck = false;
    this.pendin = false;
    this.respond = false;
    this.ionViewWillEnter();
  }); 
}

  ionViewWillEnter(){
    this.restCall.TodayEmployeeReportings().then(()=>{
      this.restCall.todayEmployeeReportings.forEach(element => {
        if(element.Report_Staus == 'Recheckin'){
          this.recheck = true;
        }
        if(element.Report_Staus == 'Pending'){
          this.pendin = true;
        }
        if(element.Report_Staus == 'Approved' || element.Report_Staus == 'Rejected' ){
          this.respond = true;
        }
      }); 
    });
    
  }
}
