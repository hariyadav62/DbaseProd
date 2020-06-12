import { Component, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import { RestcallsProvider } from '../../providers/restcalls/restcalls';
import { IonicSelectableComponent } from 'ionic-selectable';
import { ModalratingPage } from '../modalrating/modalrating';
class Client {
  public value: any;
  public text: any;
}

@IonicPage()
@Component({
  selector: 'page-workstatus',
  templateUrl: 'workstatus.html',
})
export class WorkstatusPage {
  rr: any = [];
  msg: string;
 workdescription: string;
 client1: any;
 serviceType:string;
 currentuser:any;
 reports:any;
  empcode: any;
  reportForm: boolean;
  selectedMonth: any;
  selDay:any;
  month = new Array();
  searchHead: any = "Top 50";
  isPending: any = false;
  clientList: Client[];
  remarkForm: boolean;
  SingleStar: boolean = true;
  constructor(public navCtrl: NavController, public navParams: NavParams, public restCall: RestcallsProvider, public _TOAST: ToastController, public modalCtrl: ModalController, private elmenetRef: ElementRef) {
  }

  ionViewDidLoad() { 
    this.empcode = this.navParams.get('empcode');
    this.reportForm = this.navParams.get('reportForm');
    this.month[0] = "January";
    this.month[1] = "February";
    this.month[2] = "March";
    this.month[3] = "April";
    this.month[4] = "May";
    this.month[5] = "June";
    this.month[6] = "July";
    this.month[7] = "August";
    this.month[8] = "September";
    this.month[9] = "October";
    this.month[10] = "November";
    this.month[11] = "December"; 
  }  
  async ionViewWillEnter(){
    this.restCall.LoadWrClients().then(()=>{
      this.clientList = [];
      this.restCall.wrclientList.forEach(el => {
        let c = {
          text:'one',value:'two'
        } 
        c.text = el.Client_Name+'('+el.Client_Project+')';
        c.value = el.Client_Name+'-'+el.Client_Project+'-'+el.Client_Type;
       this.clientList.push(c)
      });
    }) 
    this.restCall.LoadWorkReports(this.empcode,'',0,0,0 );
    this.searchHead = "Top 50";
    await this.restCall.LoadWorkReportYearMonth(this.empcode,''); 
    this.selDay = null;
    this.selectedMonth = null;
    this.restCall.loadCheckinDates = null;
    this.restCall.LoadNotificationsCount(this.restCall.currentuser.EmpCode);
  }
  protected adjustTextarea(event: any): void {
    let textarea: any		= event.target;
    textarea.style.overflow = 'hidden';
    textarea.style.height 	= 'auto';
    textarea.style.height 	= textarea.scrollHeight + 'px';
    return;
  } 
  portChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
  }
  reportWork(){  
    if((this.client1 != null && this.client1 != undefined) && (this.serviceType != null && this.serviceType != undefined) && (this.workdescription != null && this. workdescription != undefined)){
        let client = this.client1.value.split('-',3); 
        let workreport:any   = { 
          StaffId: this.empcode, 
          Client_Name: client[0],
          Project_Name:client[1],
          Client_Project:this.client1.text, 
          Service_Type: this.serviceType, 
          WDescription : this.workdescription,
          WDate: new Date().toLocaleString(),
          ReportingDate: new Date().toLocaleString(),
          Client_Type: client[2],
          WStatus: 'Pending',
          RequestTo: this.restCall.currentuser.RequestTo
        };
        this.restCall.workreport(workreport);
        this.client1= null;
        this.serviceType = null;
        this.workdescription = null;
      }
 }  
 
  async SearchByCode(){ 
    this.restCall.LoadWorkReports(this.empcode,'',0,0,0 ); 
    this.searchHead = "Top 50";
    this.selectedMonth = null;
    this.selDay = null;
    await this.restCall.LoadWorkReportYearMonth(this.empcode,''); 
  }
  async SearchByYearMonth(){
    if(this.selectedMonth != null){
      let date = new Date(this.selectedMonth.toString());
      this.restCall.LoadWorkReports(this.empcode,'',date.getFullYear(),date.getMonth()+1,0);
      this.searchHead = this.month[date.getMonth()] + " " + date.getFullYear();
      this.selDay = null;
      await this.restCall.LoadWorkReportDates(this.empcode,'',date.getFullYear(),date.getMonth()+1); 
    }
  }
  async SearchByYearMonthDay(){
    let date = new Date(this.selectedMonth.toString());
    this.restCall.LoadWorkReports(this.empcode,'',date.getFullYear(),date.getMonth()+1,this.selDay);
    this.searchHead = this.month[date.getMonth()] + " "+this.selDay+","+date.getFullYear(); 
    this.selDay = null;
  }
  PendingReports(){
    if(this.isPending){
      this.restCall.LoadWorkReports(this.empcode,'Pending',0,0,0 );
    }
    else{
      this.ionViewWillEnter();
    }
    
  }
ApproveWorkStatus(item:any){
  item.WStatus = "Approved";
  this.restCall.ApproveWorkStatus(item).then(()=>{
    this.restCall.LoadNotificationsCount(this.restCall.currentuser.EmpCode);
  });
}
RejectWorkStatus(item:any){
  item.WStatus = "Rejected";
  this.restCall.ApproveWorkStatus(item).then(()=>{
    this.restCall.LoadNotificationsCount(this.restCall.currentuser.EmpCode);
  });
}
rate(eve,num,report,i){
  report.WStatus = "Approved";
  let starList = eve.target.offsetParent.children[0].children[4].children
  for(let x = 0; x < 5 ; x++){
    if(starList[x].classList.contains('rated')){
      starList[x].classList.remove('rated');
    }
  }
  for(let x = 0;x <= num; x++){
    starList[x].classList.add('rated');
  }
  if(this.restCall.currentuser.UserType == 'ADMIN'){
    report.AdminRating = num+1;
  }
  if((num+1)==1 || (num+1)==5){
    // var modalPage = this.modalCtrl.create(ModalratingPage, { report : report, rating: (num+1) });
    // modalPage.present();
    if((num+1)==1){
      this.SingleStar = true;
    }
    if((num+1)==5){
      this.SingleStar = false;
    }
    this.ToggleForm(i);
  }else{
    this.remarkForm = false;
    this.restCall.ApproveWorkStatus(report).then(()=>{
      let list = this.elmenetRef.nativeElement.querySelectorAll('.rateCard')
      for(let i =0;(i<list.length); i++){
        if(list[i].classList.contains('open')){
          list[i].classList.remove('open')
        }
      }
    });
  }
}

AddRatingRemark(event,remark){
  if(event.value){
    if(!this.rr.includes(remark)){
      this.rr.push(remark);
    }
  }
  else{
    if(this.rr.includes(remark)){
      this.rr.splice(this.rr.indexOf(remark), 1);
    }
  }
}
Submit(report,x){
  if((this.msg != '' && this.msg != ' ' && this.msg != undefined && this.msg != null)){
    this.rr.pop("Others");
      this.rr.push(this.msg);
      let y = this.rr.join(',');
      report.RatingRemarks =  y;
      this.restCall.ApproveWorkStatus(report).then(()=>{
        this.remarkForm = false;
        let list = this.elmenetRef.nativeElement.querySelectorAll('.rateCard')
        for(let i =0;(i<list.length); i++){
          if(i == x){
            list[i].classList.remove('open')
          }
        }
      });
  }
}
ToggleForm(x){
  let list = this.elmenetRef.nativeElement.querySelectorAll('.rateCard')
    for(let i = 0;(i<list.length); i++){
      if(i == x){
      }
      else if(list[i].classList.contains('open')){
        list[i].classList.remove('open')
      }
    }
    list[x].classList.add('open'); 
}
Comments(event,x,report){
  this.rr = event;
  if(event.includes("Others") ){
    let list = this.elmenetRef.nativeElement.querySelectorAll('.rateCard')
    console.log(list);
    for(let i = 0;(i<list.length); i++){
      if(i == x){
      }
      else if(list[i].classList.contains('others')){
        list[i].classList.remove('others')
      }
    }
    list[x].classList.add('others'); 
  }
  else{
    console.log(event.join(","));
    report.RatingRemarks = event.join(",");
    this.restCall.ApproveWorkStatus(report).then(()=>{
      let list = this.elmenetRef.nativeElement.querySelectorAll('.rateCard')
      for(let i =0;(i<list.length); i++){
        if(i == x){
          list[i].classList.remove('open')
        }
      }
    });
  }
}


}