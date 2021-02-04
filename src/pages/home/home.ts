import { TasksPage } from './../tasks/tasks';
import { AnnouncementpopupComponent } from './../../components/announcementpopup/announcementpopup';
import { AnnouncementsPage } from './../announcements/announcements';
import { RestcallsProvider } from '../../providers/restcalls/restcalls';
import { Component } from '@angular/core';
import { NavController, ToastController, DateTime, AlertController, ModalController, PopoverController, ViewController} from 'ionic-angular';
import { ReportabsPage } from '../employeereportingtabs/reportabs';
import { VouchersPage } from '../vouchers/vouchers';
import { MyTeamPage } from '../my-team/my-team';
import { InvoicePage } from '../invoice/invoice';
import { EmpCheckInsPage } from '../emp-check-ins/emp-check-ins';
import { EmployeetimingPage } from '../employeetiming/employeetiming';
import { DropdownComponent } from '../../components/dropdown/dropdown';
import { BarcodescannerPage } from '../barcodescanner/barcodescanner';
import { SalaryPage } from '../salary/salary';
import { TabsTaskPage } from '../tabs-tasks/tabstask';

@Component({
  selector: 'page-home', 
  templateUrl: 'home.html'
})
export class HomePage {
currentuser:any;
  reportStatus: any;
  timer: any;
  time: string; 
  creditcounts: any;
  notifications:any;
  activeCard: boolean=false;

   
  constructor(public navCtrl: NavController, public restCall: RestcallsProvider, public _TOAST: ToastController,public alertCtrl: AlertController, public modalCtrl: ModalController,public popoverCtrl: PopoverController,public viewCtrl: ViewController ) {
    //this.restCall.retrieveEmployeeById(this.restCall.currentuser.EmpCode); 
    this.currentuser=this.restCall.currentuser; 
    console.log(this.currentuser); 
    if(this.restCall.currentuser.EmpCode != '1501'){
      this.restCall.LoadAnnouncementByEmpid(this.restCall.currentuser.EmpCode).then(()=>{
        if(this.restCall.empAnnouncements.length != 0){
          let popover = this.popoverCtrl.create(AnnouncementpopupComponent,{data:this.restCall.empAnnouncements},{cssClass: 'announcement-popover'});
          popover.present({})
        }
      }); 
    }
  }
  dropdown(event){
    //this.viewCtrl.dismiss();
    let popover = this.popoverCtrl.create(DropdownComponent,{user:this.currentuser.UserType},{cssClass: 'dropdown-popover'});
    popover.present({
      ev: event
    })
  }
  ExpandAnnouncements(){
    this.activeCard = true;
  }
  HideAnnouncements(){ 
    console.log(this.activeCard);
    this.activeCard = false;
  }
  ionViewWillEnter() { 
    this.restCall.retrieveEmployeeById(this.restCall.currentuser.EmpCode).then((data)=>{
      this.creditcounts = data.UnseenCredits;
      console.log(this.creditcounts);
    }); 
    this.checktimeReport();
    this.restCall.LoadNotificationsCount(this.restCall.currentuser.EmpCode).then(()=>{
      this.notifications = this.restCall.notifications;
    });
    this.restCall.LoadEmpAllTransactions('1509','All','All','Advances').then(()=>{
    });
  } 
  Announcements(){
    this.navCtrl.push(AnnouncementsPage);
  } 
  applyLeave(){
    this.navCtrl.push("ApplyleavePage");
  } 
  prevLeave(){
    this.navCtrl.push("PreviousleavesPage",{
      empCode:this.restCall.currentuser.EmpCode
    });
  }
  async checktimeReport(){
    let today = new Date().toLocaleDateString().slice(0,10).replace(/-/g,'/');
    this.restCall.SetToday();
    let report = await this.restCall.CheckEmpReporting(this.restCall.currentuser.EmpCode, this.restCall.today);
  }
  employeeList(){
    this.navCtrl.push("EmployeelistPage");  
  }
  leaveRequests(){
    this.navCtrl.push('LeaverequestsPage');  
  }
  employeeTimings(){
    // this.navCtrl.push(EmptabsPage);  
    this.navCtrl.push(EmployeetimingPage);  
  }
  workStatus(){
    this.navCtrl.push("WorkstatusPage",{
      empcode:this.restCall.currentuser.EmpCode, reportForm:true
    });
  }
  Scanner(){
    this.navCtrl.push(BarcodescannerPage);  
  }
  Tasks(){
    this.navCtrl.push(TabsTaskPage);   
  }
  TimeReport(){ 
    console.log(this.restCall.employeeReportingsByDate.length);
    if( this.restCall.employeeReportingsByDate.length !=0 ){
      this.restCall.employeeReportingsByDate.forEach(el => {
        if(el.Report_Staus == 'Rejected'){
          const confirm = this.alertCtrl.create({ 
            title: 'Sign In',
            message: 'Do you want to sign in Now?',
            buttons: [
              {
                text: 'Cancel',
                handler: () => {
                  this.navCtrl.push(EmpCheckInsPage);
                }
              },
              {
                text: 'Yes',
                handler: () => {
                  let timereport:any   = { 
                    Emp_Id: this.restCall.currentuser.EmpCode, 
                    Emp_Name: this.restCall.currentuser.EmpName,
                    Report_Staus: "Pending",
                    Time: this.time,
                    Date: new Date().toLocaleDateString()
                  };
                  this.restCall.TimeReport(timereport);
                }
              }
            ]
          });
          confirm.present();
        }
      });
    }else if( this.restCall.employeeReportingsByDate.length ==0 ){ 
      const confirm = this.alertCtrl.create({
        title: 'Sign In',
        message: 'Do you want to sign in Now?',
        buttons: [
          {
            text: 'Cancel',
            handler: () => {
              this.navCtrl.push(EmpCheckInsPage);
            }
          },
          {
            text: 'Yes',
            handler: () => {
              let timereport:any   = { 
                Emp_Id: this.restCall.currentuser.EmpCode, 
                Emp_Name: this.restCall.currentuser.EmpName,
                Report_Staus: "Pending",
                Time: this.time,
                Date: new Date().toLocaleDateString()

              };
              this.restCall.TimeReport(timereport);
            }
          }
        ]
      });
      confirm.present();
    }   
  } 
  employeeReportings(){
    this.navCtrl.push(ReportabsPage);   
  }
  EmployeeAllCheckins(){
    this.navCtrl.push(EmpCheckInsPage);   
  }
  MyTeam(){
    this.navCtrl.push(MyTeamPage); 
  }
  GoToVouchers(){ 
    this.navCtrl.push(VouchersPage);  
  }
  GoToBills(){ 
    this.navCtrl.push(InvoicePage);  
  }
  public GoToMyProfile(){
    var modalPage = this.modalCtrl.create('ModelemployeePage', { record : this.restCall.currentuser });
    modalPage.present();
  }
  SalaryPaySlips(){
    this.navCtrl.push(SalaryPage);
  }
  ionViewDidEnter() {
    this.timer = setInterval(() => {
      this.setData();
    }, 1000);
  }
  GoToWorkReports(){
    this.navCtrl.push("WorkstatusPage",{
      empcode:'All', reportForm:false
    });
  }
  sendNotification(){
    let notify = {
      SendTo: "1501",
      Title: "Voucher Deleted",
      type:'Voucher',
      Body: `Voucher Deleted by ${this.currentuser.EmpCode} ${this.currentuser.EmpName} ${this.currentuser.Designation}`
    }
    this.restCall.sendNotification(notify);
  }

  setData(){
    // let time1 = new Date().getHours() + ":"+new Date().getMinutes()+":"+new Date().getSeconds();
    // //console.log(time1);
    // let time2 = (new Date().getUTCHours()+5) + ":"+(new Date().getUTCMinutes()+30)+":"+(new Date().getUTCSeconds());
    let y = new Date(new Date().getUTCFullYear(),new Date().getUTCMonth(),new Date().getUTCDate(),new Date().getUTCHours(),new Date().getUTCMinutes(),new Date().getUTCSeconds());
    y.setMinutes(y.getMinutes()+330);
    let time2 = (y.getHours() + ":"+y.getMinutes()+":"+y.getSeconds());
    this.time = time2;
  } 
  ionViewWillLeave() {
    clearTimeout(this.timer);
  }

}
