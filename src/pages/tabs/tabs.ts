import { Component } from '@angular/core';


@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage { 

  tab1Root = "LeaverequestsPage";
  tab2Root = "LeavesacceptedPage";

  constructor() {

  }
}
