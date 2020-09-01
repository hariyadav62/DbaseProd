import { RestcallsProvider } from './../../providers/restcalls/restcalls';
import { Component, ElementRef } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'page-announcements',
  templateUrl: 'announcements.html',
})
export class AnnouncementsPage {
   _HOST2 : string =	"http://app.dbasesolutions.in/api/dbaseapi";  
  // _HOST2: string = "http://localhost:21249/api/dbaseapi"; 
  
  announcementText: any;
  EmpIds: any;
  CreateisActive:boolean = false;
  isActive:boolean;
  active:boolean=true;
  notActive:boolean=false;   
  allAnnouncements: any;
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
  constructor(public http: HttpClient, public _TOAST: ToastController,public navCtrl: NavController, public navParams: NavParams,public loadingController: LoadingController, private elmenetRef: ElementRef) {
    this.retrieveEmployee(); 
    this.LoadAllAnnouncements();
  }
  ionViewWillEnter(){
    
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AnnouncementsPage');
  }
  CreateAnnouncement(){
    if(this.createemps.length!=0 && this.announcementText != undefined && this.announcementText != ''){
      let announce = {
        Message:this.announcementText,
        EmpIds: this.createemps.join(','),
        IsActive: this.CreateisActive,
        CreatedOn: ''
      }
      this.Announcement(announce).then((data)=>{
        this.announcementText = null;
        this.createemps = ['All']; 
        this.isActive = false;
        this.LoadAllAnnouncements();
      });
      //console.log(this.announcementText,this.EmpIds.join(','),this.isActive);
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
    console.log('upd');
    let loader = this.loadingController.create({
      content: "Updating.." 
    });
    loader.present();
    let announce = {
      Aid: item.Aid,
      Message:this.msg,
      EmpIds: this.emps.join(','),
      IsActive: item.IsActive,
      CreatedOn: ''
    }
    console.log(announce);
    let headers: any = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    this.http.put(this._HOST2 + '/UpdateAnnouncement', announce, headers)
      .subscribe((data: any) => {
        this.LoadAllAnnouncements();
        loader.dismiss();
      },
      (error: any) => {
        console.log(error);
        loader.dismiss();
      });
  }

  displayNotification(message: string): void {
    let toast = this._TOAST.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
  retrieveEmployee(): void {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    this.http
      .get(this._HOST2 + '/loadEmployee')
      .subscribe((data: any) => {
        this.employeeList = data;
        console.log(this.employeeList);
        loader.dismiss();
      },
        (error: any) => {
          console.dir(error);
          loader.dismiss();
        });
  }
  async UpdateAnnouncement(announce){
    console.log('2');
    console.log(announce);
    let loader = this.loadingController.create({
      content: "Updating.."
    });
    loader.present();
    let ids = await announce.EmpIds.split(',');    
    if(announce.IsActive == 'true'){
      announce.IsActive = 'false'
    }else{ 
      announce.IsActive = 'true'
    }
    let headers: any = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    this.http.put(this._HOST2 + '/UpdateAnnouncement', announce, headers)
      .subscribe(async (data: any) => {
        this.LoadAllAnnouncements();
        if(ids.includes('All')){
          let notify = {
            SendTo: 'All',
            Title: "New Announcement",
            Body:`New Announcement from DBase Solutions`
          }
          this.sendNotification(notify);
        }else{
          let registrationIds = [];
          await this.employeeList.forEach(x => {
            if(ids.includes(x.EmpCode)){
              registrationIds.push(x.DeviceId)
            }
          });
          console.log(registrationIds);
          let notify = {
            SendTo: registrationIds,
            Title: "New Announcement",
            Body:`New Announcement from DBase Solutions`
          }
          this.sendNotification(notify);
        }
        loader.dismiss();
      },
      (error: any) => {
        console.log(error);
        loader.dismiss();
      });
    
  }
  
  Announcement(announce) {
    let loader = this.loadingController.create({
      content: "Creating.."
    });
    loader.present();
    let promise = new Promise((resolve,rejct)=>{
    let headers: any = new HttpHeaders({ 'Content-Type': 'application/json' })
    this.http
      .post(this._HOST2 + "/CreateAnnouncement", announce, headers)
      .subscribe(async (data: any) => {
        this.displayNotification('Announcement Created');
        loader.dismiss();
        if(this.createemps.includes('All')){
            let notify = {
              SendTo: 'All',
              Title: "New Announcement",
              Body:`New Announcement from DBase Solutions`
            }
            this.sendNotification(notify);
        }
        if(!this.createemps.includes('All')){
          let registrationIds = [];
          await this.employeeList.forEach(x => {
            if(this.createemps.includes(x.EmpCode)){
              registrationIds.push(x.DeviceId)
            }
          });
          console.log(registrationIds);
          let notify = {
            SendTo: registrationIds,
            Title: "New Announcement",
            Body:`New Announcement from DBase Solutions`
          }
          this.sendNotification(notify);
        }
        resolve();
      },
      (error: any) => {
        this.displayNotification(error);
        loader.dismiss();
      });
    });
    return promise;
  }
  retrieveEmployeeById(id) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    this.notifyuser = this.http.get(this._HOST2 + '/loadEmployee?id=' + id).toPromise();
    // console.log(this.notifyUser.DeviceId);
    loader.dismiss();
    return this.notifyuser;
  }
  async sendNotification(notify) {
    let promise = new Promise((resolve,reject)=>{
      let body = {};
      if(notify.SendTo == "All"){
        body = {
          "to": "/topics/all",
          "notification": {
            "title": notify.Title,
            "body": notify.Body,
            "sound": "default",
            "click_action": "FCM_PLUGIN_ACTIVITY",
            "icon": "fcm_push_icon"
          },
          "data": {
            "notifyType": notify.type,
            "notifyBody": notify.Body
          },
          "priority": "high",
          "restricted_package_name": ""
      }
    }else{
        body = {
          "registration_ids": notify.SendTo,
          "notification": {
            "title": notify.Title,
            "body": notify.Body,
            "sound": "default",
            "click_action": "FCM_PLUGIN_ACTIVITY",
            "icon": "fcm_push_icon"
          },
          "data": {
            "notifyType": notify.type,
            "notifyBody": notify.Body
          },
          "priority": "high",
          "restricted_package_name": ""
        }
      }
      let options = new HttpHeaders().set('Content-Type', 'application/json');
      this.http.post("https://fcm.googleapis.com/fcm/send", body, {
        headers: options.set('Authorization', 'key=AIzaSyCU82goGE1vWQ4d3nfrGLVmFEdxyF268xQ'),
      }).subscribe((data)=>{
        resolve();
      });
    });
   return promise;
  } 
  LoadAllAnnouncements(){
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let promise = new Promise((resolve, reject) => {
      this.http
        .get(this._HOST2 + '/LoadAllAnnouncements')
        .subscribe((data: any) => {
          this.allAnnouncements = data;
          loader.dismiss();
          resolve();
        },
          (error: any) => {
            console.dir(error);
            loader.dismiss();
          });
    });
    return promise;
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
    if(event.value){
      this.CreateshowEmplist = false;
    }
    else if(!event.value){
      if(this.createemps.includes('All')){
        this.createemps.splice(this.createemps.indexOf('All'), 1);
      }
      this.CreateshowEmplist = true;
    }
  }
}
