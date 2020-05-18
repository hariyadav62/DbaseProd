import { Component } from '@angular/core';
import { EmptimingsallPage } from '../emptimingsall/emptimingsall';
import { EmployeetimingPage } from '../employeetiming/employeetiming';


@Component({
  templateUrl: 'emptabs.html'
})
export class EmptabsPage {

  tab1Root = EmployeetimingPage;
  tab2Root = EmptimingsallPage;

  constructor() {

  }
}
