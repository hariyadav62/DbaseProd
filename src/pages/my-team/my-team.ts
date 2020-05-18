import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RestcallsProvider } from '../../providers/restcalls/restcalls';
import { TabsPage } from '../tabs/tabs';
import { TabsWorkPage } from '../tabs-work/tabswork';
@Component({
  selector: 'page-my-team',
  templateUrl: 'my-team.html',
})
export class MyTeamPage {
  notifications: any;
 
  constructor(public navCtrl: NavController, public navParams: NavParams, public restCall: RestcallsProvider) {

  }
  leaveRequests(){
    this.navCtrl.push('LeaverequestsPage');  
  }
  ionViewWillEnter() {
    this.restCall.LoadMyTeam(this.restCall.currentuser.Designation);
    this.restCall.LoadNotificationsCount(this.restCall.currentuser.EmpCode).then(()=>{
      this.notifications = this.restCall.notifications;
    });  
  }
  EmpWorkReport(){
    this.navCtrl.push(TabsWorkPage);  
  }
}
