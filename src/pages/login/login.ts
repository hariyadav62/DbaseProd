import { RestcallsProvider } from './../../providers/restcalls/restcalls';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


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
}
