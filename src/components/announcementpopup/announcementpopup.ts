import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
@Component({
  selector: 'announcementpopup',
  templateUrl: 'announcementpopup.html'
})
export class AnnouncementpopupComponent {

  announcements: any;

  constructor(public navParams:NavParams,public viewCtrl: ViewController) {
    this.announcements=this.navParams.get('data');
  }
  Close(){
    this.viewCtrl.dismiss();
  }
}
