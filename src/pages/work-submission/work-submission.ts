import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RestcallsProvider } from '../../providers/restcalls/restcalls';
@Component({
  selector: 'page-work-submission',
  templateUrl: 'work-submission.html',
})
export class WorkSubmissionPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public restCall: RestcallsProvider) {
  }

  ionViewWillEnter() {
    this.restCall.asyncretrieveEmployee('Y');
    this.restCall.LoadEmpPendingWorkReports(this.restCall.currentuser.Designation);
  } 
  ApproveWorkStatus(item:any){
      item.WStatus = "Approved";
      this.restCall.ApproveWorkStatus(item);
  }
  RejectWorkStatus(item:any){
      item.WStatus = "Rejected";
      this.restCall.ApproveWorkStatus(item);
  }
}
