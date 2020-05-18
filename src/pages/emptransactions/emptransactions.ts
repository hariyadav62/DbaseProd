import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RestcallsProvider } from '../../providers/restcalls/restcalls';
import { CreditsPage } from '../credits/credits';
@Component({
  selector: 'page-emptransactions',
  templateUrl: 'emptransactions.html',
})
export class EmptransactionsPage {
  currentuser: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public restCall: RestcallsProvider) {
  }
  ionViewWillEnter() {
    this.currentuser = this.restCall.currentuser; 
    let cin = this.restCall.retrieveCashInHand('0')
  } 
 
  EmployeeTransById(id:any){
    this.navCtrl.push(CreditsPage,{empcode:id});
  }
}
