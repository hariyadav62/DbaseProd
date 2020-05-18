import { Component } from '@angular/core';
import { ReportingtimePage } from '../reportingtime/reportingtime';
import { ReportingtimeallPage } from '../reportingtimeall/reportingtimeall';


@Component({
  templateUrl: 'reportabs.html'
})
export class ReportabsPage {

  tab1Root = ReportingtimePage;
  tab2Root = ReportingtimeallPage;  

  constructor() {

  }
}
