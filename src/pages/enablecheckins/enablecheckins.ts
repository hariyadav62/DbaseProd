import { Component } from '@angular/core';
import { LoadingController, NavController, NavParams } from 'ionic-angular';
import { RestcallsProvider } from '../../providers/restcalls/restcalls';

@Component({
  selector: 'page-enablecheckins',
  templateUrl: 'enablecheckins.html',
})
export class EnablecheckinsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public loadingController: LoadingController, public restCall: RestcallsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EnablecheckinsPage');
  }
  EnableCheckin(event,emp){
    emp.CheckinEnabled = event.value;
    this.restCall.UpdateEmployeeData(emp);
  }
}
