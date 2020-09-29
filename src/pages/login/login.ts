import { RestcallsProvider } from './../../providers/restcalls/restcalls';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BarcodescannerPage } from '../barcodescanner/barcodescanner';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {  
  username:any; 
  password:any; 
  constructor(public navCtrl: NavController, public navParams: NavParams, public restCall: RestcallsProvider) {
  }
  login(){ 
    if(this.username != undefined && this.password != undefined){
      this.restCall.loginFunction(this.username, this.password);
    }else{
      this.restCall.displayNotification("Please use Valid Credentials");
    }
  }
  BarcodeScan(){
    this.restCall.storage.get('scannerId').then((id)=>{
      if(id != null || id != undefined){
        this.navCtrl.push(BarcodescannerPage);
      }else{
        let scannerId = Date.now();
        console.log(scannerId)
        this.restCall.storage.set('scannerId',scannerId)
        this.navCtrl.push(BarcodescannerPage);  
      }
    })
  }
}
