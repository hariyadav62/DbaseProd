import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { RestcallsProvider } from '../../providers/restcalls/restcalls';

@Component({
  selector: 'page-tasks-pending',
  templateUrl: 'tasks-pending.html',
})
export class TasksPendingPage {
  empid: string;
  status: string = 'Pending';
  pendingtasks: any;
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
    if(this.restCall.currentuser.UserType == 'ADMIN'){
      if(task.TaskStatus == "Completed,Pending"){
        task.TaskStatus = "Completed"
      }
    }else{
      if(task.TaskStatus == "Completed,Pending"){
        task.TaskStatus = "Pending"
      }else{
        task.TaskStatus = "Completed,Pending"
      }
    }
    
    this.restCall.UpdateTask(task).then(()=>{
      loader.dismiss();
      this.ionViewWillEnter();
    })
  }
  SearchByCode(){
    this.restCall.LoadAllTasks(this.empid,this.status).then(()=>{
      this.pendingtasks = this.restCall.allTasks;
    });
  }
  Filter(status:string){
    this.status = status;
    this.restCall.LoadAllTasks(this.empid,this.status).then(()=>{
      this.pendingtasks = this.restCall.allTasks;
    });
  }
  ionViewWillEnter() {
    if(this.restCall.currentuser.UserType == 'ADMIN'){
      this.empid = 'All'
    }else{
      this.empid = this.restCall.currentuser.EmpCode;
    }
    this.restCall.LoadAllTasks(this.empid,'Pending').then(()=>{
      this.pendingtasks = this.restCall.allTasks;
    });
  }
}
