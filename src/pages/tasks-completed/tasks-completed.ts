import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { RestcallsProvider } from '../../providers/restcalls/restcalls';

@Component({
  selector: 'page-tasks-completed',
  templateUrl: 'tasks-completed.html',
})
export class TasksCompletedPage {
  empid:string;
  completedTasks: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController, public restCall: RestcallsProvider,public loadingController: LoadingController) {
    this.viewCtrl = this.navParams.get('viewCtrl');
  }
  public onClickCancel() {
    this.viewCtrl.dismiss();
  }
  async UpdateTask(task){
    let loader = this.loadingController.create({
      content: "Updating.." 
    });
    loader.present();
    if(task.TaskStatus == "Completed"){
      task.TaskStatus = "Pending"
    }else{
      task.TaskStatus = "Completed"
    }
    this.restCall.UpdateTask(task).then(()=>loader.dismiss())
  }
  ionViewWillEnter() {
    if(this.restCall.currentuser.UserType == 'ADMIN'){
      this.empid = 'All'
    }else{
      this.empid = this.restCall.currentuser.EmpCode;
    }
    this.restCall.LoadAllTasks(this.empid,'Completed').then(()=>{
      this.completedTasks = this.restCall.allTasks;
    })
  }

}
