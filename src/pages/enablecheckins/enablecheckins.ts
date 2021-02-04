import { Component } from '@angular/core';
import { LoadingController, NavController, NavParams, ViewController } from 'ionic-angular';
import { RestcallsProvider } from '../../providers/restcalls/restcalls';

@Component({
  selector: 'page-enablecheckins',
  templateUrl: 'enablecheckins.html',
})
export class EnablecheckinsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public loadingController: LoadingController, public restCall: RestcallsProvider,public viewCtrl: ViewController) {
  }
  public onClickCancel() {
    this.viewCtrl.dismiss();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad EnablecheckinsPage');
  }
  EnableCheckin(event,emp){
    emp.IsChekin_Enable = event.value;
    this.restCall.UpdateEmployeeData(emp);
  }
}
