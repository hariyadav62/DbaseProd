import { Component } from '@angular/core';
import { WorkSubmissionPage } from '../work-submission/work-submission';
import { WorkSubmissionAllPage } from '../work-submission-all/work-submission-all';
import { ViewController } from 'ionic-angular';


@Component({
  templateUrl: 'tabswork.html'
})
export class TabsWorkPage { 

  tab1Root = WorkSubmissionPage;
  tab2Root = WorkSubmissionAllPage;
  data: any;

  constructor(public viewCtrl: ViewController) {
    this.data = {
      viewCtrl: this.viewCtrl
    }
  }
}
