import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { TasksPage } from '../tasks/tasks';
import { TasksCompletedPage } from '../tasks-completed/tasks-completed';
import { TasksPendingPage } from '../tasks-pending/tasks-pending';
import { RestcallsProvider } from '../../providers/restcalls/restcalls';


@Component({
  templateUrl: 'tabstask.html'
})
export class TabsTaskPage { 

  tab1Root = TasksPage;
  tab2Root = TasksPendingPage;
  tab3Root = TasksCompletedPage;
  data: any;

  constructor(public viewCtrl: ViewController, public restCall: RestcallsProvider) {
    this.data = {
      viewCtrl: this.viewCtrl
    }
  }
}
