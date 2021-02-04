import { EnablecheckinsPage } from './../enablecheckins/enablecheckins';
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
  tab3Root = EnablecheckinsPage; 
  data: any;

  constructor(public viewCtrl: ViewController) {
    this.data = {
      viewCtrl: this.viewCtrl
    }
  }
}
