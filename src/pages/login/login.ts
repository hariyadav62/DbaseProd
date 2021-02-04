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
  scanusers:any;
  user:any;
  barcodeusername: any;
  barcodepassword: any;
  universities: any;
  selectedUniversity: string;
  selectedCourseType: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public restCall: RestcallsProvider) {

  }
  ionViewWillEnter(){
    // this.restCall.LoadUniversities().then(()=> this.universities = this.restCall.universities)
  }
  LoadScanUsers(){
    this.restCall.selectedUniversity = this.selectedUniversity;
    this.restCall.LoadScanUsers(this.selectedUniversity).then(()=> this.scanusers = this.restCall.scanUsers)
  }
  SelectCourseType(){
    this.restCall.selectedCourseType = this.selectedCourseType;
  }
  login(){ 
    if(this.username != undefined && this.password != undefined){
      this.restCall.loginFunction(this.username, this.password);
    }else{
      this.restCall.displayNotification("Please use Valid Credentials");
    }
  }
  BarcodeScan(){
    if(this.user != undefined && this.selectedCourseType != undefined && this.selectedUniversity != undefined){
      let scannerId = this.user;
      console.log(scannerId)
      this.restCall.storage.set('scannerId',scannerId)
      this.navCtrl.push(BarcodescannerPage);  
    }else{
      this.restCall.displayNotification("Please select University, course type, user");
    }
  }
  async BarcodeAdminLogin(){
    if(this.barcodeusername != undefined && this.barcodepassword != undefined){
      this.restCall.BarcodeAdminLogin(this.barcodeusername, this.barcodepassword).then(()=>{
        if(this.restCall.barcodeAdmin){
          console.log(this.restCall.barcodeAdmin)
          this.navCtrl.push(BarcodescannerPage);
        }
      });
      
    }else{
      this.restCall.displayNotification("Please use Valid Credentials");
    }
  }
}
