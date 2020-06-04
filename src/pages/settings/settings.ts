import { HolidaysPage } from './../holidays/holidays';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { RestcallsProvider } from '../../providers/restcalls/restcalls';
import { AnnouncementsPage } from '../announcements/announcements';
@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public restCall: RestcallsProvider, public viewCtrl : ViewController) {

  }

  ionViewWillEnter(){
    this.restCall.LoadAnnouncementByEmpid(this.restCall.currentuser.EmpCode)
    console.log(this.restCall.empAnnouncements);
  }


  Announcements(){
    this.navCtrl.push(AnnouncementsPage);
  } 
  Holidays(){
    this.navCtrl.push(HolidaysPage);
  } 
}
