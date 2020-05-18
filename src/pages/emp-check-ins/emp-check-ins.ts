import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { RestcallsProvider } from '../../providers/restcalls/restcalls';

@Component({
  selector: 'page-emp-check-ins',
  templateUrl: 'emp-check-ins.html',
})
export class EmpCheckInsPage {
  selectedDay: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public restCall:RestcallsProvider,public alertCtrl: AlertController) {
  }

  
  TimeByDate(){ 
    if(this.selectedDay != undefined){  
      this.restCall.EmployeeReportingsByEmpCodeAndDate(this.restCall.currentuser.EmpCode, this.selectedDay);
    }
  }
  
  ionViewWillEnter() {
    this.restCall.EmployeeAllReportingsByEmpCode(this.restCall.currentuser.EmpCode);    
  }
  Recheckin(report){
    const confirm = this.alertCtrl.create({
      title: 'Recheck-in',
      message: 'Do you want to Recheck-in?',
      buttons: [
        { 
          text: 'Cancel',
          handler: () => {
            //this.navCtrl.push(EmpCheckInsPage);
          }
        },
        {
          text: 'Yes',
          handler: () => {
            report.Report_Staus = "Recheckin";
            this.restCall.respondToReport(report);
          }
        }
      ]
    });
    confirm.present();
  }

}
