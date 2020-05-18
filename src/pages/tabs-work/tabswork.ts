import { Component } from '@angular/core';
import { WorkSubmissionPage } from '../work-submission/work-submission';
import { WorkSubmissionAllPage } from '../work-submission-all/work-submission-all';


@Component({
  templateUrl: 'tabswork.html'
})
export class TabsWorkPage { 

  tab1Root = WorkSubmissionPage;
  tab2Root = WorkSubmissionAllPage;

  constructor() {
  }
}
