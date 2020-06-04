import { Component } from '@angular/core';
import { ReportingtimePage } from '../reportingtime/reportingtime';
import { ReportingtimeallPage } from '../reportingtimeall/reportingtimeall';
import { ViewController } from 'ionic-angular';


@Component({
  templateUrl: 'reportabs.html'
})
export class ReportabsPage {

  tab1Root = ReportingtimePage;
  tab2Root = ReportingtimeallPage;  
  data: any;

  constructor(public viewCtrl: ViewController) {
    this.data = {
      viewCtrl: this.viewCtrl
    }
  }
}
