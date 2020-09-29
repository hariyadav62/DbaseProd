import { RestcallsProvider } from './../../providers/restcalls/restcalls';
import { Component, ElementRef } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, ViewController } from 'ionic-angular';
@Component({
  selector: 'page-tasks',
  templateUrl: 'tasks.html',
})
export class TasksPage {
  taskText: any;
  EmpIds: any;
  CreateisActive:boolean = false;
  isActive:boolean;
  active:boolean=true;
  notActive:boolean=false;   
 // allAnnouncements: any;
  createIsAll:boolean = true;
  CreateshowEmplist:boolean;
  msg: any;
  emps: any;
  isact: any;
  showEmplist: boolean;
  isAll: boolean;
  createemps: any = ["All"];
  notifyuser: any;
  employeeList: any;
  loader :any;
  constructor(public _TOAST: ToastController,public navCtrl: NavController, public navParams: NavParams,public loadingController: LoadingController, private elmenetRef: ElementRef, public restCall: RestcallsProvider,public viewCtrl: ViewController) {
    this.viewCtrl = this.navParams.get('viewCtrl');
  }
  public onClickCancel() {
    this.viewCtrl.dismiss();
  }
  ionViewWillEnter(){ 
    this.restCall.retrieveEmployee(); 
    this.restCall.LoadAllTasks('All','All');
  }
  Loader(loadingContent:string){
    this.loader = this.loadingController.create({
      content: loadingContent
    });
  }
  CreateTask(){
    this.Loader('Creating Task')
    this.loader.present();
    if(this.createemps.length!=0 && this.taskText != undefined && this.taskText != ''){
      let task = {
        TaskText:this.taskText,
        EmpIds: this.createemps.join(','),
        TaskStatus: 'Pending',
        CreatedOn: ''
      }
      this.restCall.CreateTask(task).then((data)=>{
        this.loader.dismiss();
        this.taskText = null;
        this.createemps = ['All']; 
        this.isActive = false;
        this.restCall.LoadAllTasks('All','All');
      });
    }else{
      alert('Please fill all required Fields');
    }
  }
  async ToggleAccrd(item,x){
    this.msg = item.Message;
    this.emps = await item.EmpIds.split(',');
    if(this.emps.includes('All')){
      this.isAll = true;
      this.showEmplist = false;
    }else{
      this.isAll = false;
      this.showEmplist = true; 
    }
    let list = this.elmenetRef.nativeElement.querySelectorAll('.allanc')
    for(let i =0;(i<list.length); i++){
      if(i == x){
      }
      else if(list[i].classList.contains('open')){
        list[i].classList.remove('open')
        console.log(i);
      }
    }
    this.isact = item.IsActive;
    if(list[x].classList.contains('open')){
      list[x].classList.remove('open')
    }else{
      list[x].classList.add('open');
    }
  }
  UpdtMsg(item,x){
    console.log(item);
    let loader = this.loadingController.create({
      content: "Updating.." 
    });
    loader.present();
    let task = {
      Tid: item.Tid,
      TaskText:this.msg,
      EmpIds: this.emps.join(','),
      TaskStatus: item.TaskStatus,
      CreatedOn: ''
    }
    console.log(task);
    this.restCall.UpdateTask(task).then(()=>loader.dismiss())
    // let headers: any = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    // this.http.put(this._HOST2 + '/UpdateAnnouncement', announce, headers)
    //   .subscribe((data: any) => {
    //     this.LoadAllAnnouncements();
    //     loader.dismiss();
    //   },
    //   (error: any) => {
    //     console.log(error);
    //     loader.dismiss();
    //   });
  }
  async UpdateTask(task){
    let loader = this.loadingController.create({
      content: "Updating.."
    });
    loader.present();
    let ids = await task.EmpIds.split(',');    
    // if(task.IsActive == 'true'){
    //   task.IsActive = 'false'
    // }else{ 
    //   task.IsActive = 'true'
    // }
    this.restCall.UpdateTask(task).then(()=>loader.dismiss())
  }

  displayNotification(message: string): void {
    let toast = this._TOAST.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
 
  // async UpdateAnnouncement(announce){
  //   console.log('2');
  //   console.log(announce);
  //   let loader = this.loadingController.create({
  //     content: "Updating.."
  //   });
  //   loader.present();
  //   let ids = await announce.EmpIds.split(',');    
  //   if(announce.IsActive == 'true'){
  //     announce.IsActive = 'false'
  //   }else{ 
  //     announce.IsActive = 'true'
  //   }
  //   // let headers: any = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
  //   // this.http.put(this._HOST2 + '/UpdateAnnouncement', announce, headers)
  //   //   .subscribe(async (data: any) => {
  //   //     this.LoadAllAnnouncements();
  //   //     if(ids.includes('All')){
  //   //       let notify = {
  //   //         SendTo: 'All',
  //   //         Title: "New Announcement",
  //   //         Body:`New Announcement from DBase Solutions`
  //   //       }
  //   //       this.sendNotification(notify);
  //   //     }else{
  //   //       let registrationIds = [];
  //   //       await this.employeeList.forEach(x => {
  //   //         if(ids.includes(x.EmpCode)){
  //   //           registrationIds.push(x.DeviceId)
  //   //         }
  //   //       });
  //   //       console.log(registrationIds);
  //   //       let notify = {
  //   //         SendTo: registrationIds,
  //   //         Title: "New Announcement",
  //   //         Body:`New Announcement from DBase Solutions`
  //   //       }
  //   //       this.sendNotification(notify);
  //   //     }
  //   //     loader.dismiss();
  //   //   },
  //   //   (error: any) => {
  //   //     console.log(error);
  //   //     loader.dismiss();
  //   //   });
    
  // }
  
  // Announcement(announce) {
  //   let loader = this.loadingController.create({
  //     content: "Creating.."
  //   });
  //   loader.present();
  //   let promise = new Promise((resolve,rejct)=>{
    // let headers: any = new HttpHeaders({ 'Content-Type': 'application/json' })
    // this.http
    //   .post(this._HOST2 + "/CreateTask", announce, headers)
    //   .subscribe(async (data: any) => {
    //     this.displayNotification('Announcement Created');
    //     loader.dismiss();
    //     if(this.createemps.includes('All')){
    //         let notify = {
    //           SendTo: 'All',
    //           Title: "New Announcement",
    //           Body:`New Announcement from DBase Solutions`
    //         }
    //         this.sendNotification(notify);
    //     }
    //     if(!this.createemps.includes('All')){
    //       let registrationIds = [];
    //       await this.employeeList.forEach(x => {
    //         if(this.createemps.includes(x.EmpCode)){
    //           registrationIds.push(x.DeviceId)
    //         }
    //       });
    //       console.log(registrationIds);
    //       let notify = {
    //         SendTo: registrationIds,
    //         Title: "New Announcement",
    //         Body:`New Announcement from DBase Solutions`
    //       }
    //       this.sendNotification(notify);
    //     }
    //     resolve();
    //   },
    //   (error: any) => {
    //     this.displayNotification(error);
    //     loader.dismiss();
    //   });
  //   });
  //   return promise;
  // }
  
  async sendNotification(notify) {
  //   let promise = new Promise((resolve,reject)=>{
  //     let body = {};
  //     if(notify.SendTo == "All"){
  //       body = {
  //         "to": "/topics/all",
  //         "notification": {
  //           "title": notify.Title,
  //           "body": notify.Body,
  //           "sound": "default",
  //           "click_action": "FCM_PLUGIN_ACTIVITY",
  //           "icon": "fcm_push_icon"
  //         },
  //         "data": {
  //           "notifyType": notify.type,
  //           "notifyBody": notify.Body
  //         },
  //         "priority": "high",
  //         "restricted_package_name": ""
  //     }
  //   }else{
  //       body = {
  //         "registration_ids": notify.SendTo,
  //         "notification": {
  //           "title": notify.Title,
  //           "body": notify.Body,
  //           "sound": "default",
  //           "click_action": "FCM_PLUGIN_ACTIVITY",
  //           "icon": "fcm_push_icon"
  //         },
  //         "data": {
  //           "notifyType": notify.type,
  //           "notifyBody": notify.Body
  //         },
  //         "priority": "high",
  //         "restricted_package_name": ""
  //       }
  //     }
  //     let options = new HttpHeaders().set('Content-Type', 'application/json');
  //     this.http.post("https://fcm.googleapis.com/fcm/send", body, {
  //       headers: options.set('Authorization', 'key=AAAAF6SCHfs:APA91bFzPumiOnin4U4c_UM0qGfz1PbQqUwZr8Mo8JEBjJX18kI14NwqtCbgtCyK_xjqumwJLb0Vclh833F-k7VcviJ4taXSVu1YqFfhvraRTTvtBYSur2pQ6feggy3pvdDQWFTRz9Wp'),
  //     }).subscribe((data)=>{
  //       resolve();
  //     });
  //   });
  //  return promise;
  } 
  
  protected adjustTextarea(event: any): void {
    let textarea: any		= event.target;
    textarea.style.overflow = 'hidden';
    textarea.style.height 	= 'auto';
    textarea.style.height 	= textarea.scrollHeight + 'px';
    return;
  } 
  All(event){
    if(event.value){
      this.emps = [];
      this.emps.push('All');
      this.showEmplist = false;
    }
    else if(!event.value){
      if(this.emps.includes('All')){
        this.emps.splice(this.emps.indexOf('All'), 1);
      }
      this.showEmplist = true;
    }
  }
  AddEmptoShowList(event,empid){
    if(event.value){
      if(!this.emps.includes(empid)){
        this.emps.push(empid);
      }
    }
    else{
      if(this.emps.includes(empid)){
        this.emps.splice(this.emps.indexOf(empid), 1);
      }
    }
  }
  CreateAddEmptoShowList(event,empid){
    if(event.value){
      if(!this.createemps.includes(empid)){
        this.createemps.push(empid);
      }
    }
    else{
      if(this.createemps.includes(empid)){
        this.createemps.splice(this.createemps.indexOf(empid), 1);
      }
    }
  }
  CreateAll(event){
    console.log(event.value);
    if(event.value){
      this.CreateshowEmplist = false;
      console.log(1);
    }
    else if(!event.value){
      console.log(2);
      if(this.createemps.includes('All')){
        console.log(3);
        this.createemps.splice(this.createemps.indexOf('All'), 1);
      }
      console.log(4);
      this.CreateshowEmplist = true;
    }
  }

}
