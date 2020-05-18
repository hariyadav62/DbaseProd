import { RestcallsProvider } from './../../providers/restcalls/restcalls';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CreditsPage } from '../credits/credits';
import { AddvoucherPage } from '../addvoucher/addvoucher';
import { EmptransactionsPage } from '../emptransactions/emptransactions';
@Component({
  selector: 'page-vouchers',
  templateUrl: 'vouchers.html',
})
export class VouchersPage { 
  currentuser: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public restCall: RestcallsProvider) {
    
  }

  ionViewWillEnter() { 
    this.currentuser = this.restCall.currentuser;
    let cin = this.restCall.retrieveCashInHand(this.restCall.currentuser.EmpCode)
  }
  GoToTransfer(){ 
    this.navCtrl.push('TransferPage');  
  } 
  GoToCredits(){ 
    this.navCtrl.push(CreditsPage,{empcode:this.currentuser.EmpCode});  
    this.restCall.UnseenCreditToZero(this.currentuser);
  }
  GoToAddvoucher(){ 
    this.navCtrl.push(AddvoucherPage);  
  }
  EmpTransactions(){
    this.navCtrl.push(EmptransactionsPage);   
  }
}
