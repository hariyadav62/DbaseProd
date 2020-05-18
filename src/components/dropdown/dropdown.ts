import { Component } from '@angular/core';
import { NavController, App, ViewController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'dropdown',
  templateUrl: 'dropdown.html'
})
export class DropdownComponent {
  user: any; 
  constructor(public navParams:NavParams,public navCtrl: NavController, public app: App, private storage: Storage,public viewCtrl: ViewController) {
    this.user=this.navParams.get('user');
  }
  logOut() {
    this.viewCtrl.dismiss();
    this.storage.clear();
    let nav = this.app.getActiveNav();
    nav.setRoot('LoginPage');
  }
  Settings(){
    this.viewCtrl.dismiss();
    this.navCtrl.push('SettingsPage');
  }
  Announcements(){
    this.viewCtrl.dismiss();
    this.navCtrl.push('SettingsPage');
  }
}
