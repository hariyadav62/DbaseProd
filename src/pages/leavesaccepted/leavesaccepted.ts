import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { RestcallsProvider } from './../../providers/restcalls/restcalls';

@IonicPage()
@Component({
  selector: 'page-leavesaccepted',
  templateUrl: 'leavesaccepted.html',
})
export class LeavesacceptedPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public restCall: RestcallsProvider,public alertCtrl: AlertController) {
  }
  UpdateStatus(Leave:any) {
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
        Leave.L_status = data;
        this.restCall.respondTLeave(Leave);
      }
    });
    alert.present();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LeavesacceptedPage');
  }
  ionViewWillEnter() {
    if(this.restCall.currentuser.UserType == 'TEAMLEADER' || this.restCall.currentuser.UserType == 'MANAGER'){
      this.restCall.LoadTeamRespondedLeaves(this.restCall.currentuser.Designation);
    }
    if(this.restCall.currentuser.UserType == 'ADMIN'){
      this.restCall.retrieveRespondedRequests();
    }
  }

}
