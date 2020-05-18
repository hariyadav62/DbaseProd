import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { RestcallsProvider } from '../../providers/restcalls/restcalls';

@IonicPage()
@Component({
  selector: 'page-workstatus',
  templateUrl: 'workstatus.html',
})
export class WorkstatusPage {
 workdescription: string;
 client1: string;
 serviceType:string;
 currentuser:any;
 reports:any;
  empcode: any;
  reportForm: boolean;
  selectedMonth: any;
  selDay:any;
  month = new Array();
  searchHead: any = "Top 50";
  constructor(public navCtrl: NavController, public navParams: NavParams, public restCall: RestcallsProvider, public _TOAST: ToastController) {
    this.restCall.LoadClients(); 
    
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
    this.restCall.LoadWorkReports(this.empcode,'',0,0,0 );
    this.searchHead = "Top 50";
    await this.restCall.LoadWorkReportYearMonth(this.empcode,''); 
    this.selDay = null;
    this.selectedMonth = null;
    this.restCall.loadCheckinDates = null;
  }
  protected adjustTextarea(event: any): void {
    let textarea: any		= event.target;
    textarea.style.overflow = 'hidden';
    textarea.style.height 	= 'auto';
    textarea.style.height 	= textarea.scrollHeight + 'px';
    return;
  } 
  reportWork(){  
    if((this.client1 != null && this.client1 != undefined) && (this.serviceType != null && this.serviceType != undefined) && (this.workdescription != null && this. workdescription != undefined)){
        let client = this.client1.split('-',3); 
        console.log('client1 is '+client);  
        let workreport:any   = { 
          StaffId: this.empcode, 
          Client_Name: client[0],
          Project_Name:client[1],
          Client_Project:this.client1,
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
  // async ReportsByMonth()
  // { 
  //   if(this.selectedMonth != undefined )
  //   {   
  //     let date: Date = new Date(this.selectedMonth);
  //     if(this.selDay != undefined)
  //     {
  //       this.restCall.LoadWorkReports(this.empcode,'Director',date.getFullYear(),date.getMonth()+1,this.selDay);
  //       this.searchHead = this.month[date.getMonth()] + " "+this.selDay+","+date.getFullYear(); 
  //     }
  //     else
  //     {
  //       this.restCall.LoadWorkReports(this.empcode,'Director',date.getFullYear(),date.getMonth()+1,0);
  //       this.searchHead = this.month[date.getMonth()] + " " + date.getFullYear();
  //     }
  //   } 
  //   else
  //   {
  //     this.restCall.LoadWorkReports(this.empcode,'Director',0,0,0 );
  //     this.searchHead = "Top 50";
    
  //   }
  // }
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
}
