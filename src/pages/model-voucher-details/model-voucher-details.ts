import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { RestcallsProvider } from '../../providers/restcalls/restcalls';
@Component({
  selector: 'page-model-voucher-details',
  templateUrl: 'model-voucher-details.html',
})
export class ModelVoucherDetailsPage {
  VDescription: any;
  Amount: any;
  fname: any;
  Date: any;
  Vid: any;
  TransType: any;
  updateForm: boolean=false;
  updateAmount: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl : ViewController, public restCall:RestcallsProvider) {
  }
  public closeModal(){
    this.viewCtrl.dismiss();
  }
  ionViewWillEnter() {
    if(this.navParams.get("record"))
    {
      this.Amount = this.navParams.data.record.Amount;
      this.VDescription = this.navParams.data.record.VDescription; 
      this.fname = this.navParams.data.record.fname;
      this.Date = this.navParams.data.record.Date;
      this.Vid = this.navParams.data.record.Vid;
      this.TransType = this.navParams.data.record.TransType;
      console.log(this.navParams.data.record);
    }  
  }
  UpdateVoucher(){
    let voucher:any={};
    voucher.Vid = this.Vid;
    voucher.Amount = this.updateAmount;
    this.restCall.UpdateVoucherAmount(voucher,'notice').then((data)=>{
      this.updateForm = false;
      this.Amount = this.updateAmount;
      this.restCall.AllTransactions('All',0,0);
    });
  }
  UpdateForm(){
    this.updateAmount = this.Amount;
    this.updateForm = true;
  }

}
