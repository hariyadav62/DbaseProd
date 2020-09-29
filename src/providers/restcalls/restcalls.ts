import { HomePage } from './../../pages/home/home';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController, App, Platform, LoadingController, AlertController } from 'ionic-angular';
// import { FCM } from '@ionic-native/fcm';
import { OneSignal } from '@ionic-native/onesignal';
import { Storage } from '@ionic/storage';
@Injectable() 
export class RestcallsProvider {   
  //  _HOST2 : string =	"http://app.dbasesolutions.in/api/dbaseapi";  
  _HOST2: string = "http://localhost:21249/api/dbaseapi";  
  userLoggedIn: boolean = false;
  isAdmin: boolean = false;
  totalPendingLeaves: any = [];
  respondedLeaves: any = [];
  leaves: any = [];
  clientList: any = [];
  workReports: any = [];
  employeeList: any = [];
  employee: any;
  employeePendingLeave: any;
  employeeLastLeave: any;
  todayEmployeeOnLeave: any;
  todayEmployeeTimings: any;
  todayEmployeeReportings: any;
  employeeTimingsByDate: any;
  employeeReportingsByDate: any;
  currentuser: any;
  notifyUser: any;
  deviceId: any;
  cashinhand: any;
  transactions: any;
  disableTimeReport: boolean;
  submittedWorks: any;
  empListWithMaxTransferAmount: Object;
  myTeam: any;
  myTeamLeaves: any;
  bills: Object;
  today: any;
  employeeAllReportingsByDate: Object;
  designationList: any;
  loadCheckins: any;
  loadCheckinDates: any;
  loadCheckinYearMonth: any;
  maxdate: any;
  mindate: string;
  pieChart: any;
  barChart: any;
  lineChart: any;
  timingMonths: any;
  FYears: any;
  FMonths: any;
  Fbill: any;
  FClients: any;
  allTransactions: any;
  allTransactionsDates: any;
  notifications: any;
  FVoucherMonths: any;
  allVoucherTransactionsDates: any;
  allVoucherTransactions: any;
  loadEmpAllTransactions: any;
  empAnnouncements: any;
  datesLeave: any;
  biometricAndCheckins: any;
  datesBiometric: any;
  MaxMinEmptimesDates: any;
  emp: any;
  empcih: any;
  holidays: any;
  wrclientList: any;
  barcodes:any;
  salPaySlip: any;
  monthSalDetails: any;
  bundleId: any;
  allTasks: any;
  constructor(public http: HttpClient, public _TOAST: ToastController, public app: App, platform: Platform, public storage: Storage, public loadingController: LoadingController,public alertCtrl: AlertController,private oneSignal: OneSignal) {
    storage.get('id').then((id) => {
      if (id != null) {
        storage.get('pass').then((pass) => {
          this.loginFunction(id, pass);
        });
      }
    });
    platform.ready().then(() => {
     // setTimeout(() => {
      //Notifications  
      // fcm.subscribeToTopic('all');
      // fcm.getToken().then(token=>{
      //   this.deviceId = token; 
      //     console.log(this.deviceId);
      // })
      // fcm.onNotification().subscribe(data=>{
      //   if(data.wasTapped){
      //     console.log('data');
      //     this.LoadNotificationsCount(this.currentuser.EmpCode);
      //   } else {
      //     //alert("New Notification");
      //     const confirm = this.alertCtrl.create({ 
      //       //title: data.notifyType+" Notification",
      //       title: data.notifyType,
      //       message: data.notifyBody,
      //       buttons: [
      //         {
      //           text: 'Ok',
      //           handler: () => {
      //              this.LoadNotificationsCount(this.currentuser.EmpCode);
      //              this.CheckEmpReporting(this.currentuser.EmpCode,'2020-05-02');
      //           }
      //         }
      //       ],
      //       cssClass: 'NotificationPop'
      //     });
      //     confirm.present();
      //   };
      // })
      // fcm.onTokenRefresh().subscribe(token=>{
      //   this.deviceId = token;
      //   console.log(this.deviceId + "refreshtoken");
      // });
    //}, 100);
      // end notifications.
      this.oneSignal.startInit('9ac11fa0-538b-4857-a1ed-ad4295be3b16', '972001020683');

      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

      this.oneSignal.handleNotificationReceived().subscribe(() => {
      // do something when notification is received
      });

      this.oneSignal.handleNotificationOpened().subscribe(() => {
        // do something when a notification is opened
      });
      
      this.oneSignal.endInit();
    });
    console.log('Restcall Provider');
    this.retrieveEmployee();
  }

  // Barcodes
  LoadTodayScannedBarcodes(empid: string) {
    let promise = new Promise((resolve, reject) => {
      this.http
        .get(this._HOST2 + '/LoadTodayScannedBarcodes?empid=' + empid)
        .subscribe((data: any) => {
          this.barcodes = data;
          resolve();
        },
          (error: any) => {
            console.dir(error);
          });
    });
    return promise;
  }
  AddBarcode(barcode) {
    // let loader = this.loadingController.create({
    //   content: "Loading.."
    // });
    // loader.present();
    let promise = new Promise((resolve,reject)=>{
    let headers: any = new HttpHeaders({ 'Content-Type': 'application/json' })
    let resp: any;
    this.http
      .post(this._HOST2 + "/AddBarcode", barcode, headers)
      .subscribe((data: any) => {
        // this.displayNotification('Barcode Scanned');
        // loader.dismiss();
        //return data;
        //console.log(data);
        resolve(data);
      },
        (error: any) => {
          this.displayNotification(error);
          // loader.dismiss();
        });
      })
      return promise;

  }
  AssignBarcodeBundle(empid: string){
    let promise = new Promise((resolve, reject) => {
      this.http
        .get(this._HOST2 + '/AssignBarcodeBundle?empid=' + empid)
        .subscribe((data: any) => {
          this.bundleId = data;
          resolve();
        },
          (error: any) => {
            console.dir(error);
          });
    });
    return promise;
  }
  // Barcodes End



  SetToday() {
    let date = new Date();
    this.today = date.getFullYear() + '-' + (("0" + (date.getMonth() + 1)).slice(-2)) + '-' + (("0" + date.getDate()).slice(-2));
    console.log(this.today);
  }
  loginFunction(id, pass) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    this.http
      .get(this._HOST2 + "/Login?userName=" + id + "&pwd=" + pass)
      .subscribe((data: any) => {
        this.userLoggedIn = true;
        let nav = this.app.getActiveNav();
        this.currentuser = data;
        this.oneSignal.getIds().then((users)=> {
          this.currentuser.DeviceId = users.userId;
        });
        // if(this.currentuser.DeviceId != null && this.currentuser.DeviceId != undefined){
          this.SetDeviceId();
          this.storage.set('id', id);
          this.storage.set('pass', pass);
          loader.dismiss();
          nav.setRoot(HomePage);  
        // }else{
        //   loader.dismiss();
        //   alert("Please close the app and Login again");
        // }
      },
        (error: any) => {
          loader.dismiss();
          console.dir(error.error);
          this.displayNotification(error.error);
        });
    // loader.dismiss();
  }
  logOut() {
    this.storage.clear();
    this.userLoggedIn = false;
    let nav = this.app.getActiveNav();
    nav.setRoot('LoginPage');
  }
  LoadAnnouncementByEmpid(empid: string) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let promise = new Promise((resolve, reject) => {
      this.http
        .get(this._HOST2 + '/LoadAnnouncements?empid=' + empid)
        .subscribe((data: any) => {
          this.empAnnouncements = data;
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
  async retrieveCashInHand(empCode: string) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    this.cashinhand = await this.http.get(this._HOST2 + '/EmpCashInHand?empCode=' + empCode).toPromise();
    loader.dismiss();
  }
   CashInHandById(empCode: string) {
    let promise = new Promise((resolve,reject)=>{
      this.http.get(this._HOST2 + '/EmpCashInHand?empCode=' + empCode).subscribe((data)=>{
        this.empcih = data[0].CASHINHAND;
        //console.log(data,this.empcih);
        resolve();
      })
    });
    return promise;
  }
  DeleteVoucher(item: any){
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let promise = new Promise((resolve, reject) => {
      this.http
      .delete(this._HOST2+"/DeleteVoucher?Vid="+item.Vid)  
      .subscribe((data : any) =>
      {
        this.displayNotification('Voucher Deleted Successfully');
        loader.dismiss();
        let notify = {
          SendTo: item.EmpId,
          Title: "Voucher Deleted",
          type:'Voucher',
          Body: `Voucher Deleted by ${this.currentuser.EmpCode} ${this.currentuser.EmpName} ${this.currentuser.Designation}`
        }
        this.sendNotification(notify);
        resolve();
      },
      (error : any) => 
      {
        this.displayNotification(error);
        loader.dismiss();
      }); 
    });
    return promise;
}
  Upload(fd: any) {
    let loader = this.loadingController.create({
      content: "Uploading.."
    });
    loader.present();
    this.http.post(this._HOST2 + '/UploadImage', fd).subscribe((data) => {
      console.log(fd);
      this.AllVoucherTransactions('All','All','');
      this.displayNotification('Voucher Applied Successfully');
      loader.dismiss();
    },
    (error: any) => {
      console.dir(error);
      loader.dismiss();
    });
  }
  async LoadAllTransactionsByEmpId(empCode: string) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    this.transactions = await this.http.get(this._HOST2 + '/LoadAllTransactionsByEmpId?empid=' + empCode).toPromise();
    loader.dismiss();
  }
  async LoadDebitTransactionsByEmpId(empCode: string) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    this.transactions = await this.http.get(this._HOST2 + '/LoadDebitTransactionsByEmpId?empid=' + empCode).toPromise();
    loader.dismiss();
  }
  async LoadCreditTransactionsByEmpId(empCode: string) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    this.transactions = await this.http.get(this._HOST2 + '/LoadCreditTransactionsByEmpId?empid=' + empCode).toPromise();
    loader.dismiss();
  }
  LoadAdvorSalTransactionsByEmpId(empCode: string, sal: string) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let promise = new Promise((resolve, reject) => {
      this.http.get(this._HOST2 + '/LoadAdvTransactionsByEmpId?empid=' + empCode + '&sal=' + sal).subscribe((data: any) => {
        this.transactions = data;
        console.log(this.transactions);
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
  LoadEmpAllTransactions(empid: any, year: any, month: any,transtype:string) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let promise = new Promise((resolve, reject) => {
      this.http.get(this._HOST2 + '/LoadEmpAllTransactions?empid=' + empid + '&year=' + year + '&month=' + month+'&transtype='+transtype).subscribe((data: any) => {
        this.loadEmpAllTransactions = data;
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
  AllTransactions(year: any, empid: any, month: any) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let promise = new Promise((resolve, reject) => {
      this.http.get(this._HOST2 + '/AllTransactions?empid=' + empid + '&year=' + year + '&month=' + month).subscribe((data: any) => {
        this.allTransactions = data;
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
  AllTransactionDates(empid: any, year: any) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let promise = new Promise((resolve, reject) => {
      this.http.get(this._HOST2 + '/AllTransactionDates?empid=' + empid + '&year=' + year).subscribe((data: any) => {
        this.allTransactionsDates = data;
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
  AllVoucherTransactionDates(empid: any, year: any) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let promise = new Promise((resolve, reject) => {
      this.http.get(this._HOST2 + '/AllVoucherTransactionDates?empid=' + empid + '&year=' + year).subscribe((data: any) => {
        this.allVoucherTransactionsDates = data;
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
  AllVoucherTransactions(empid: any, year: any, month: any) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let promise = new Promise((resolve, reject) => {
      this.http.get(this._HOST2 + '/AllVoucherTransaction?empid=' + empid + '&year=' + year + '&month=' + month).subscribe((data: any) => {
        this.allVoucherTransactions = JSON.parse(data.toString());
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
  LoadBiometricAndCheckins(empid: any, year: any, month: any,day:any) {
    if(day == 'All'){
      day = 0;
    }
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let promise = new Promise((resolve, reject) => {
      this.http.get(this._HOST2 + '/LoadBiometricAndCheckins?id=' + empid + '&year=' + year + '&month=' + month + '&day='+day).subscribe((data: any) => {
        this.biometricAndCheckins = JSON.parse(data.toString());
        console.log();
        loader.dismiss(this.biometricAndCheckins);
        resolve();
      },
        (error: any) => {
          console.dir(error);
          loader.dismiss();
        });
    });
    return promise;
  }
  BIOMETRICandCHECKINDATES(employeeId: string, year: any, month: string) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let promise = new Promise((resolve, reject) => {
      this.http
        .get(this._HOST2 + '/BIOMETRICandCHECKINDATES?id=' + employeeId + '&year=' + year + '&month=' + month)
        .subscribe((data: any) => {
          this.datesBiometric = data;
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

  async LoadEmpPendingWorkReports(designation: string) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let str = await this.http.get(this._HOST2 + '/LoadEmpPendingWorkReports?designation=' + designation).toPromise();
    this.submittedWorks = JSON.parse(str.toString());
    loader.dismiss();
    console.log(this.submittedWorks)
  }
  LoadFyears() {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let promise = new Promise((resolve, reject) => {
      this.http.get(this._HOST2 + '/LoadFyears').subscribe((data: any) => {
        this.FYears = data;
        console.log(this.FYears)
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
  LoadInvoiceClients(fyear,fmonth) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let promise = new Promise((resolve, reject) => {
      this.http.get(this._HOST2 + '/LoadInvoiceClients?fyear='+fyear+'&fmonth='+fmonth).subscribe((data: any) => {
        this.FClients = data;
        console.log(this.FClients)
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
  LoadFMonths(FYear) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let promise = new Promise((resolve, reject) => {
      this.http.get(this._HOST2 + '/LoadFMonths?FYear=' + FYear).subscribe((data: any) => {
        this.FMonths = data;
        console.log(this.FMonths)
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
  LoadFVoucherMonths(FYear) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let promise = new Promise((resolve, reject) => {
      this.http.get(this._HOST2 + '/LoadFVoucherMonths?FYear=' + FYear).subscribe((data: any) => {
        this.FVoucherMonths = data;
        console.log(this.FVoucherMonths)
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
  LoadBillSmry(FYear, FMonth, Client) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let promise = new Promise((resolve, reject) => {
      this.http.get(this._HOST2 + '/LoadBillSmry?FYear=' + FYear + '&FMonth=' + FMonth + '&Client=' + Client).subscribe((data: any) => {
        this.Fbill = data;
        console.log(this.Fbill)
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
  LoadAdvances(empid: string,FYear:any,FMonth:string) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let promise = new Promise((resolve, reject) => {
      this.http.get(this._HOST2 + '/LoadAdvances?EmpId=' + empid+'&FYear='+FYear+'&FMonth='+FMonth).subscribe((data: any) => {
        this.transactions = data;
        console.log(this.transactions)
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
  async LoadBills(FYear, FMonth, Client) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    this.bills = await this.http.get(this._HOST2 + '/LoadBills?FYear=' + FYear + '&FMonth=' + FMonth + '&Client=' + Client).toPromise();
    loader.dismiss();
    console.log(this.bills)
  }
  async EmpListWithMaxTransferAmount() {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    this.empListWithMaxTransferAmount = await this.http.get(this._HOST2 + '/EmpListWithMaxTransferAmount').toPromise();
    loader.dismiss();
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
  retrieveEmployeeByStatus(status): void {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    this.http
      .get(this._HOST2 + '/loadEmployeeByStatus?status=' + status)
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
  async retrieveEmployeeByDesignation(designation) {
    this.notifyUser = await this.http.get(this._HOST2 + '/loadEmployeeByDesignation?designation=' + designation).toPromise();
    return this.notifyUser;
  }
  async retrieveEmployeeById(id) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    this.notifyUser = await this.http.get(this._HOST2 + '/loadEmployee?id=' + id).toPromise();
    console.log(this.notifyUser.DeviceId);
    loader.dismiss();
    return this.notifyUser;
  }
  EmployeeById(id) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let promise = new Promise((resolve,reject)=>{
      this.http.get(this._HOST2 + '/loadEmployee?id=' + id).subscribe((data)=>{
        this.emp =  data;
        loader.dismiss();
        resolve();
      })
    });
    return promise;
  }
  workreport(workreport) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let headers: any = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    this.http
      .post(this._HOST2 + "/SubmitWorkReport", workreport, headers)
      .subscribe((data: any) => {
        this.displayNotification('Work Reported ✍️');
        console.log(data);
        this.retrieveEmployee();
        loader.dismiss();
        let notify = {
          SendTo: this.currentuser.RequestTo,
          Title: "New Work Report Notification",
          type:'Work Report',
          Body: `Work report submitted by ${this.currentuser.EmpCode} ${this.currentuser.EmpName}`
          
        }
        this.employeeList.forEach(employee => {
          if (employee.Designation == this.currentuser.RequestTo) {
            notify.SendTo = employee.EmpCode;
          }
        });
        this.sendNotification(notify);
      },
        (error: any) => {
          loader.dismiss();
          this.displayNotification(error);

        });
  }
  TimeReport(timereport) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let headers: any = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    this.http
      .post(this._HOST2 + "/SubmitEmpReporting", timereport, headers)
      .subscribe((data: any) => {
        this.disableTimeReport = true;
        let date = new Date();
        let today = date.getFullYear() + '-' + (("0" + (date.getMonth() + 1)).slice(-2)) + '-' + (("0" + date.getDate()).slice(-2));
        this.EmployeeReportingsByEmpCodeAndDate(this.currentuser.EmpCode, today);
        let notify = {
          SendTo: '1501',
          Title: "Check In Notification",
          type:'Checkin',
          Body: this.currentuser.EmpName + " " + this.currentuser.EmpCode + " Checked In"
        }
        this.sendNotification(notify);
        this.displayNotification('Time Reported ✍️');
        console.log(data);
        loader.dismiss();
      },
        (error: any) => {
          this.displayNotification(error);
          loader.dismiss();

        });
  }



  MaxMinDatesfromEmptimes(employeeId: string,year:any,month:any) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let promise = new Promise((resolve, reject) => {
      this.http
        .get(this._HOST2 + '/MaxMinDatesfromEmptimes?id=' + employeeId+'&year='+year+'&month='+month)
        .subscribe((data: any) => {
          this.MaxMinEmptimesDates = data;
          loader.dismiss();
          console.log(this.MaxMinEmptimesDates);
          resolve();
        },
          (error: any) => {
            console.dir(error);
            loader.dismiss();
          });
    });
    return promise;

  }



  LoadCheckIns(employeeId: string, year: any, month: any, day: any) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let promise = new Promise((resolve, reject) => {
      this.http
        .get(this._HOST2 + '/LoadCheckins?id=' + employeeId + '&year=' + year + '&month=' + month + '&day=' + day)
        .subscribe((data: any) => {
          this.loadCheckins = data;
          loader.dismiss();
          console.log(this.loadCheckins);
          resolve();
        },
          (error: any) => {
            console.dir(error);
            loader.dismiss();
          });
    });
    return promise;

  }
  LoadCheckInYearMonth(employeeId: string) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let promise = new Promise((resolve, reject) => {
      this.http
        .get(this._HOST2 + '/LoadCheckinDates?id=' + employeeId + '&year=0&month=0')
        .subscribe((data: any) => {
          this.loadCheckinYearMonth = data;
          if (this.loadCheckinYearMonth[0].MONTH.toString().length == 1) {
            this.maxdate = this.loadCheckinYearMonth[0].YEAR + '-0' + this.loadCheckinYearMonth[0].MONTH + '-' + '01';
          } else {
            this.maxdate = this.loadCheckinYearMonth[0].YEAR + '-' + this.loadCheckinYearMonth[0].MONTH + '-' + '01';
          }
          if (this.loadCheckinYearMonth[1].MONTH.toString().length == 1) {
            this.mindate = this.loadCheckinYearMonth[1].YEAR + '-0' + this.loadCheckinYearMonth[1].MONTH + '-' + '01';
          } else {
            this.mindate = this.loadCheckinYearMonth[1].YEAR + '-' + this.loadCheckinYearMonth[1].MONTH + '-' + '01';
          }
          loader.dismiss();
          console.log(this.maxdate, this.loadCheckinYearMonth[1].MONTH.toString().length);
          resolve();
        },
          (error: any) => {
            console.dir(error);
            loader.dismiss();
          });
    });
    return promise;
  }
  LoadCheckInDates(employeeId: string, year: any, month: any) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let promise = new Promise((resolve, reject) => {
      this.http
        .get(this._HOST2 + '/LoadCheckinDates?id=' + employeeId + '&year=' + year + '&month=' + month)
        .subscribe((data: any) => {
          this.loadCheckinDates = data;
          loader.dismiss();
          console.log(this.loadCheckinDates);
          resolve();
        },
          (error: any) => {
            console.dir(error);
            loader.dismiss();
          });
    });
    return promise;
  }

  LoadWorkReports(employeeId: string, reqto: string, year: any, month: any, day: any) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    this.http
      .get(this._HOST2 + '/LoadReports?id=' + employeeId + '&reqto=' + reqto + '&year=' + year + '&month=' + month + '&day=' + day)
      .subscribe((data: any) => {
        this.workReports = data;
        loader.dismiss();
      },
        (error: any) => {
          console.dir(error);
          loader.dismiss();
        });
  }
  LoadWorkReportYearMonth(employeeId: string, designation: any) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let promise = new Promise((resolve, reject) => {
      this.http
        .get(this._HOST2 + '/LoadWrkReportDates?id=' + employeeId + '&designation=' + designation + '&year=0&month=0')
        .subscribe((data: any) => {
          this.loadCheckinYearMonth = data;
          if (this.loadCheckinYearMonth.length != 0) {
            if (this.loadCheckinYearMonth[0].MONTH.toString().length == 1) {
              this.maxdate = this.loadCheckinYearMonth[0].YEAR + '-0' + this.loadCheckinYearMonth[0].MONTH + '-' + '01';
            } else {
              this.maxdate = this.loadCheckinYearMonth[0].YEAR + '-' + this.loadCheckinYearMonth[0].MONTH + '-' + '01';
            }
            if (this.loadCheckinYearMonth[1].MONTH.toString().length == 1) {
              this.mindate = this.loadCheckinYearMonth[1].YEAR + '-0' + this.loadCheckinYearMonth[1].MONTH + '-' + '01';
            } else {
              this.mindate = this.loadCheckinYearMonth[1].YEAR + '-' + this.loadCheckinYearMonth[1].MONTH + '-' + '01';
            }
          }
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
  LoadWorkReportDates(employeeId: string, designation: string, year: any, month: any) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let promise = new Promise((resolve, reject) => {
      this.http
        .get(this._HOST2 + '/LoadWrkReportDates?id=' + employeeId + '&designation=' + designation + '&year=' + year + '&month=' + month)
        .subscribe((data: any) => {
          this.loadCheckinDates = data;
          loader.dismiss();
          console.log(this.loadCheckinDates);
          resolve();
        },
          (error: any) => {
            console.dir(error);
            loader.dismiss();
          });
    });
    return promise;
  }

  LoadAllLeaves(employeeId: string, reqto: string, year: any, month: any, day: any) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let promise = new Promise((resolve, reject) => {
      this.http
      .get(this._HOST2 + '/LoadAllLeaves?id=' + employeeId + '&reqto=' + reqto + '&year=' + year + '&month=' + month + '&day=' + day)
      .subscribe((data: any) => {
        this.leaves = data;
        loader.dismiss();
        resolve();
      },
        (error: any) => {
          console.dir(error);
          loader.dismiss();
        });
    })
    return promise;
  }
  LoadLeavesYearMonth(employeeId: string, designation: any) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let promise = new Promise((resolve, reject) => {
      this.http
        .get(this._HOST2 + '/LoadLeaveDates?id=' + employeeId + '&designation=' + designation + '&year=0&month=0')
        .subscribe((data: any) => {
          this.loadCheckinYearMonth = data;
          if (this.loadCheckinYearMonth.length != 0) {
            if (this.loadCheckinYearMonth[0].MONTH.toString().length == 1) {
              this.maxdate = this.loadCheckinYearMonth[0].YEAR + '-0' + this.loadCheckinYearMonth[0].MONTH + '-' + '01';
            } else {
              this.maxdate = this.loadCheckinYearMonth[0].YEAR + '-' + this.loadCheckinYearMonth[0].MONTH + '-' + '01';
            }
            if (this.loadCheckinYearMonth[1].MONTH.toString().length == 1) {
              this.mindate = this.loadCheckinYearMonth[1].YEAR + '-0' + this.loadCheckinYearMonth[1].MONTH + '-' + '01';
            } else {
              this.mindate = this.loadCheckinYearMonth[1].YEAR + '-' + this.loadCheckinYearMonth[1].MONTH + '-' + '01';
            }
          }
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
  LoadLeaveDates(employeeId: String, year: any, month: any) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let promise = new Promise((resolve, reject) => {
      this.http
        .get(this._HOST2 + '/LoadLeaveDates?id=' + employeeId +'&year=' + year + '&month=' + month)
        .subscribe((data: any) => {
          this.loadCheckinDates = data;
          loader.dismiss();
          console.log(this.loadCheckinDates);
          resolve();
        },
          (error: any) => {
            console.dir(error);
            loader.dismiss();
          });
    });
    return promise;
  }
  LoadDatesForLeaves(employeeId: string, year: any, month: any) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let promise = new Promise((resolve, reject) => {
      this.http
        .get(this._HOST2 + '/LoadLeaveDates?id=' + employeeId + '&year=' + year + '&month=' + month)
        .subscribe((data: any) => {
          this.datesLeave = data;
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

  // Timing Charts

  LoadHomeTimingChart() {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let promise = new Promise((resolve, reject) => {
      this.http
        .get(this._HOST2 + '/LoadHomeTimingChart')
        .subscribe((data: any) => {
          this.pieChart = data;
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
  LoadNotificationsCount(empcode) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let promise = new Promise((resolve, reject) => {
      this.http
        .get(this._HOST2 + '/LoadNotificationsCount?empcode=' + empcode)
        .subscribe((data: any) => {
          this.notifications = data;
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
  LoadEmpTimingMonths(empid: string, year: any, month: any) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let promise = new Promise((resolve, reject) => {
      this.http
        .get(this._HOST2 + '/LoadEmpTimeMonths?empid=' + empid + '&year=' + year + '&month=' + month)
        .subscribe((data: any) => {
          this.timingMonths = data;
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
  LoadEmpTimingBarChart(empid: string, year: any, month: any) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let promise = new Promise((resolve, reject) => {
      this.http
        .get(this._HOST2 + '/LoadAllEmpTimingChart?empid=' + empid + '&year=' + year + '&month=' + month)
        .subscribe((data: any) => {
          this.barChart = data;
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
  LoadEmpTimingChart(empid: string) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let promise = new Promise((resolve, reject) => {
      this.http
        .get(this._HOST2 + '/LoadEmpMonthlyTimingChart?empid=' + empid)
        .subscribe((data: any) => {
          this.lineChart = data;
          loader.dismiss();
          console.log(this.lineChart);
          resolve();
        },
          (error: any) => {
            console.dir(error);
            loader.dismiss();
          });
    });
    return promise;
  }



  LoadClients() {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    this.http
      .get(this._HOST2 + '/LoadClients')
      .subscribe((data: any) => {
        this.clientList = data;
        loader.dismiss();
        console.log(this.clientList);
      },
        (error: any) => {
          console.dir(error);
          loader.dismiss();
        });
  }
  LoadWrClients() {
    let promise = new Promise((resolve,reject)=>{
      let loader = this.loadingController.create({
        content: "Loading.."
      });
      loader.present();
      this.http
        .get(this._HOST2 + '/LoadClients')
        .subscribe((data: any) => {
          this.wrclientList = data;
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
  LoadMyTeam(requestTo) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    this.http
      .get(this._HOST2 + '/LoadMyTeam?RequestTo=' + requestTo)
      .subscribe((data: any) => {
        this.myTeam = data;
        loader.dismiss();
        console.log(this.myTeam);
      },
        (error: any) => {
          console.dir(error);
          loader.dismiss();
        });
  }
  MyTeamLeaves(id: string, designation: string) {
    this.http
      .get(this._HOST2 + "/LoadTeamLeaves?id=" + id + "&Request=" + designation)
      .subscribe((data: any) => {
        this.leaves = data;
        console.log(this.leaves);
      },
        (error: any) => {
          console.dir(error);
        });
  }
  MyTeamPendingLeaves(designation: string) {
    this.http
      .get(this._HOST2 + "/LoadTeamPendingLeaves?Request=" + designation)
      .subscribe((data: any) => {
        this.myTeamLeaves = data;
        console.log(this.myTeamLeaves);
      },
        (error: any) => {
          console.dir(error);
        });
  }
  LoadTeamRespondedLeaves(designation: string) {
    this.http
      .get(this._HOST2 + "/LoadTeamRespondedLeaves?Request=" + designation)
      .subscribe((data: any) => {
        this.myTeamLeaves = data;
        console.log(this.myTeamLeaves);
      },
        (error: any) => {
          console.dir(error);
        });
  }
  ApplyLeave1(leave, RequestTo) {
    let loader = this.loadingController.create({
      content: "Applying.."
    });
    loader.present();
    let headers: any = new HttpHeaders({ 'Content-Type': 'application/json' })
    let resp: any;
    this.http
      .post(this._HOST2 + "/ApplyLeave", leave, headers)
      .subscribe((data: any) => {
        this.displayNotification('Leave Applied');
        loader.dismiss();
        let notify = {
          SendTo: '1501',
          Title: "Leave Request Notification",
          type:'Leave',
          Body: `Leave Request from ${this.currentuser.EmpCode} ${this.currentuser.EmpName}`
        }
        this.sendNotification(notify).then((data)=>{
          this.employeeList.forEach(employee => {
            if (employee.Designation == this.currentuser.RequestTo && employee.Designation != 'Director') {
              notify.SendTo = employee.EmpCode;
              this.sendNotification(notify);
            }
          });
        });
        console.log(data);
      },
        (error: any) => {
          this.displayNotification(error);
          loader.dismiss();
        });
  }
  ApplyVoucher(voucher) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let headers: any = new HttpHeaders({ 'Content-Type': 'application/json' })
    let resp: any;
    this.http
      .post(this._HOST2 + "/AddVoucher", voucher, headers)
      .subscribe((data: any) => {
        this.displayNotification('Voucher Applied');
        loader.dismiss();
        console.log(data);
      },
        (error: any) => {
          this.displayNotification(error);
          loader.dismiss();
        });
  }

  TransferAmount(credit) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let headers: any = new HttpHeaders({ 'Content-Type': 'application/json' })
    let resp: any;
    this.http
      .post(this._HOST2 + "/CreditVoucher", credit, headers)
      .subscribe((data: any) => {
        this.displayNotification('Money Transffered');
        loader.dismiss();
        let credittype = '';
        if(credit.SALorAdv != 'Credit'){
          credittype = credit.SALorAdv;
        }
        let notify = {
          SendTo: credit.RecieverEmpId,
          Title: "Money Credited",
          type:'Transaction',
          Body:`You have Recieved ${credittype} amount of Rs${credit.Amount}/- from ${this.currentuser.EmpCode} ${this.currentuser.EmpName} through ${credit.TransferType}`
        }
        this.sendNotification(notify);
        this.retrieveCashInHand(this.currentuser.EmpCode)
        console.log(data);
      },
        (error: any) => {
          this.displayNotification(error);
          loader.dismiss();
        });
  }

  UnseenCreditToZero(empcode) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let promise = new Promise((resolve, reject) => {
      let headers: any = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
      this.http
        .put(this._HOST2 + '/UnseenCreditToZero', empcode, headers)
        .subscribe((data: any) => {
          loader.dismiss();
          resolve();
        },
          (error: any) => {
            console.log(error);
            loader.dismiss();
          });
    });
    return promise;
  }

  AsyncTransferAmount(credit) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let promise = new Promise((resolve, reject) => {
      let headers: any = new HttpHeaders({ 'Content-Type': 'application/json' })
      let resp: any;
      this.http
        .post(this._HOST2 + "/CreditVoucher", credit, headers)
        .subscribe((data: any) => {
          this.displayNotification('Money Transffered');
          this.retrieveCashInHand(this.currentuser.EmpCode)
          loader.dismiss();
          resolve();
          let notify = {
            SendTo: credit.RecieverEmpId,
            Title: "Money Credited",
            type:'Transaction',
            Body: `${this.currentuser.EmpCode} transffered Rs${credit.Amount} to you`
          }
          this.sendNotification(notify);
          console.log(data);
        },
          (error: any) => {
            this.displayNotification(error);
            loader.dismiss();
          });
    });
    return promise;
  }
  ChangePassword(EmpCode) {
    let loader = this.loadingController.create({
      content: "Changing.."
    });
    loader.present();
    let promise = new Promise((resolve, reject) => {
      let headers: any = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
      this.http
        .put(this._HOST2 + '/ChangePassword', EmpCode, headers)
        .subscribe((data: any) => {
          loader.dismiss();
          alert("Password Changed");
          resolve();
        },
          (error: any) => {
            this.displayNotification(error);
            loader.dismiss();

          });
    });
    return promise;
  }
  // TodayEmployeeOnLeave() : void
  // {let loader = this.loadingController.create({
  //     content: "Loading.."
  //   }); 
  //   loader.present();
  //     this.http
  //     .get(this._HOST2 + "/EmployeeOnLeave")
  //     .subscribe((data : any) =>
  //     {
  //       this.todayEmployeeOnLeave = data;
  //       loader.dismiss();
  //       console.log(this.todayEmployeeOnLeave);
  //     },
  //     (error : any) =>
  //     { 
  //       console.dir(error);  
  //       loader.dismiss();
  //     }); 
  // }
  TodayEmployeeTimings(): void {
    this.SetToday();
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    this.http
      .get(this._HOST2 + "/LoadTodayEmpTimings?date=" + this.today)
      .subscribe((data: any) => {
        this.todayEmployeeTimings = data;
        loader.dismiss();
        console.log(this.todayEmployeeTimings);
      },
        (error: any) => {
          console.dir(error);
          loader.dismiss();
        });
  }
  TodayEmployeeReportings() {
    let promise = new Promise((resolve, reject) => {
      this.SetToday();
      let loader = this.loadingController.create({
        content: "Loading.."
      });
      loader.present();
      this.http
        .get(this._HOST2 + "/LoadTodayEmpReportings?date=" + this.today)
        .subscribe((data: any) => {
          this.todayEmployeeReportings = data;
          loader.dismiss();
          console.log(this.todayEmployeeReportings);
          resolve();
        },
          (error: any) => {
            console.dir(error);
            loader.dismiss();
          });
    });
    return promise;

  }
  EmployeeTimingsByDate(date: any): void {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    this.http
      .get(this._HOST2 + "/LoadTodayEmpTimingsByDate?date=" + date)
      .subscribe((data: any) => {
        this.employeeTimingsByDate = data;
        loader.dismiss();
        console.log(this.employeeTimingsByDate);
      },
        (error: any) => {
          console.dir(error);
          loader.dismiss();
        });
  }
  EmployeeReportingsByDate(date: any): void {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    this.http
      .get(this._HOST2 + "/LoadTodayEmpReportingsByDate?date=" + date)
      .subscribe((data: any) => {
        this.employeeReportingsByDate = data;
        loader.dismiss();
        console.log(this.employeeReportingsByDate);
      },
        (error: any) => {
          console.dir(error);
          loader.dismiss();
        });
  }
  EmployeeTimingsByEmpCodeAndDate(empCode: any, date: any): void {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    this.http
      .get(this._HOST2 + "/LoadEmpTimingsById?employeeCode=" + empCode + "&date=" + date)
      .subscribe((data: any) => {
        this.employeeTimingsByDate = data;
        console.log(this.employeeTimingsByDate);
        loader.dismiss();
      },
        (error: any) => {
          console.dir(error);
          loader.dismiss();
        });
  }
  async EmployeeReportingsByEmpCodeAndDate(empCode: any, date: any) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    // this.SetToday();
    this.employeeReportingsByDate = await this.http.get(this._HOST2 + "/LoadEmpReportingsById?employeeCode=" + empCode + "&date=" + date).toPromise();

    loader.dismiss();
    console.log(this.employeeReportingsByDate);
    return this.employeeReportingsByDate;
  }

  async CheckEmpReporting(empCode: any, date: any) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    // this.SetToday();
    this.employeeReportingsByDate = await this.http.get(this._HOST2 + "/CheckEmpReporting?employeeCode=" + empCode + "&date=" + date).toPromise();

    loader.dismiss();
    console.log(this.employeeReportingsByDate);
    return this.employeeReportingsByDate;
  }

  async EmployeeAllReportingsByEmpCode(empCode: any) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    this.SetToday();
    this.employeeReportingsByDate = await this.http.get(this._HOST2 + "/LoadAllReportingsById?employeeCode=" + empCode).toPromise();
    loader.dismiss();
    console.log(this.employeeReportingsByDate);
    return this.employeeReportingsByDate;
  }
  retrieveRespondedRequests(): void {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    this.http
      .get(this._HOST2 + "/RespondedLeaves")
      .subscribe((data: any) => {
        this.leaves = data;
        loader.dismiss();
        console.log(this.leaves);
      },
        (error: any) => {
          console.dir(error);
          loader.dismiss();
        });
  }
  LoadDesignations(): void {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    this.http
      .get(this._HOST2 + "/LoadDesignations")
      .subscribe((data: any) => {
        this.designationList = data;
        loader.dismiss();
      },
        (error: any) => {
          console.dir(error);
          loader.dismiss();
        });
  }

  retrieveLastLeavesById(employeeId: string) {
    console.log("hello is " + employeeId);
    this.http
      .get(this._HOST2 + "/LoadLastLeave?employeeCode=" + employeeId)
      .subscribe((data: any) => {
        this.employeeLastLeave = data;
        console.log(this.employeeLastLeave);
      },
        (error: any) => {
          console.dir(error);
        });
  }
  retrieveLeaves(employeeId: string) {
    this.http
      .get(this._HOST2 + "/LoadPreviousLeaves?employeeCode=" + employeeId)
      .subscribe((data: any) => {
        this.leaves = data;
        console.log(this.leaves);
      },
        (error: any) => {
          console.dir(error);
        });
  }
  retrieveEmployeeLeavesByMonth(employeeId: string, month: number, year: number, designation: string) {
    this.http
      .get(this._HOST2 + "/EmployeeMonthlyLeave?id=" + employeeId + "&month=" + month + "&year=" + year + "&designation=" + designation)
      .subscribe((data: any) => {
        this.leaves = data;
        console.log(this.leaves);
      },
        (error: any) => {
          console.dir(error);
        });
  }
  retrieveEmployeeWorkReportsByMonth(employeeId: string, month: number, year: number) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let promise = new Promise((resolve, reject) => {
      this.http
        .get(this._HOST2 + "/EmployeeMonthlyWorkReports?id=" + employeeId + "&month=" + month + "&year=" + year)
        .subscribe((data: any) => {
          this.workReports = data;
          console.log(this.workReports);
          resolve();
          loader.dismiss();
        },
          (error: any) => {
            console.dir(error);
            loader.dismiss();
          });
    })
    return promise;
  }
  async TeamWorkReports(id: string, month: number, year: number, day: number, designation: string) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let str = await this.http.get(this._HOST2 + "/TeamMemberWorkReports?id=" + id + "&month=" + month + "&year=" + year + "&day=" + day + "&designation=" + designation).toPromise();
    this.submittedWorks = JSON.parse(str.toString());
    loader.dismiss();
    console.log(this.submittedWorks)
  }

  TeamMemberWorkReports(employeeId: string, designation: string) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let promise = new Promise((resolve, reject) => {
      this.http
        .get(this._HOST2 + "/TeamMemberWorkReports?id=" + employeeId + "&designation=" + designation)
        .subscribe((data: any) => {
          this.submittedWorks = data;
          console.log(this.submittedWorks);
          resolve();
          loader.dismiss();
        },
          (error: any) => {
            console.dir(error);
            loader.dismiss();
          });
    })
    return promise;
  }
  retrieveLeavesByMonth(month: number, year: number) {
    this.http
      .get(this._HOST2 + "/TotalMonthlyLeaves?&month=" + month + "&year=" + year)
      .subscribe((data: any) => {
        this.leaves = data;
        console.log(this.leaves);
      },
        (error: any) => {
          console.dir(error);
        });
  }
  retrievePendingLeaves() {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    this.http
      .get(this._HOST2 + "/LoadPendingLeaves")
      .subscribe((data: any) => {
        this.totalPendingLeaves = data;
        loader.dismiss();
        console.log(this.totalPendingLeaves);
      },
        (error: any) => {
          console.dir(error);
          loader.dismiss();
        });
  }
  respondTLeave(leavedata: any) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    let headers: any = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    this.http
      .put(this._HOST2 + '/RespondToLeaveRequest', leavedata, headers)
      .subscribe((data: any) => {
        loader.dismiss();
        //alert("Leave " + leavedata.L_status);
        if(leavedata.L_status == 'Pending' || leavedata.L_status == 'Reapplied'){
          let notify = {
            SendTo: '1501',
            Title: "Leave Reapplied",
            type:'Leave',
            Body: `Leave Reapplied by ${this.currentuser.EmpCode} ${this.currentuser.EmpName}`
          }
          this.sendNotification(notify).then((data)=>{
            this.employeeList.forEach(employee => {
              if (employee.Designation == this.currentuser.RequestTo && employee.Designation != 'Director') {
                notify.SendTo = employee.EmpCode;
                this.sendNotification(notify);
              }
            });
          });
        }else{
          let notify = {
            SendTo: leavedata.EmpCode,
            Title: `Leave ${leavedata.L_status}`,
            type:'Leave',
            Body: `Your Leave Request has been ${leavedata.L_status.substring(0,8)} by ${this.currentuser.EmpCode} ${this.currentuser.EmpName} ${this.currentuser.Designation}`
          }
          this.sendNotification(notify);
        }
        this.retrievePendingLeaves();
      },
        (error: any) => {
          this.displayNotification(error);
          loader.dismiss();

        });
  }
  respondToReport(report: any) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    let promise = new Promise((resolve,reject)=>{
      let headers: any = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
      this.http
        .put(this._HOST2 + '/ChangeEmployeeReportingStatus', report, headers)
        .subscribe((data: any) => {
          this.TodayEmployeeReportings();
          loader.dismiss();
          //alert("Report " + report.Report_Staus);
          let notify = {
            SendTo: report.Emp_Id,
            Title: "Check In Notification",
            type:'Checkin',
            Body: report.Date.substring(0,10)+" Check In " + report.Report_Staus
          }
          if(report.Report_Staus == 'Recheckin'){
            notify.SendTo = '1501';
            notify.Body = report.Date.substring(0,10)+' Recheckin By '+report.Emp_Id +' '+ report.Emp_Name
          }
          this.sendNotification(notify);
          resolve();
        },
          (error: any) => {
            this.displayNotification(error);
            loader.dismiss();
          });
    });
    return promise;
    
  }

  ApproveReport(report: any) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    let promise = new Promise((resolve,reject)=>{
      this.http
        .get(this._HOST2 + '/RespondToCheckin?EmpId='+report.Emp_Id+'&Date='+report.Date+'&Rid='+report.Rid)
        .subscribe((data: any) => {
          this.TodayEmployeeReportings();
          loader.dismiss();
          //alert("Report " + report.Report_Staus);
          let notify = {
            SendTo: report.Emp_Id,
            Title: "Check In Notification",
            type:'Checkin',
            Body: report.Date.substring(0,10)+" Check In " + report.Report_Staus
          }
          if(report.Report_Staus == 'Recheckin'){
            notify.SendTo = '1501';
            notify.Body = report.Date.substring(0,10)+' Recheckin By '+report.Emp_Id +' '+ report.Emp_Name
          }
          this.sendNotification(notify);
          resolve();
        },
          (error: any) => {
            this.displayNotification(error);
            loader.dismiss();
          });
    });
    return promise;
  }





  ChangeEmployeeStatus(employe: any) {
    let promise = new Promise((resolve, reject) => {
      let headers: any = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
      this.http
        .put(this._HOST2 + '/ChangeEmployeeStatus', employe, headers)
        .subscribe((data: any) => {
          this.displayNotification("Status changed to " + employe.EmployeeStatus);
          resolve();
        },
          (error: any) => {
            this.displayNotification(error);
          });
    })
    return promise;
  }
  UpdateEmployeeData(employe: any) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    let headers: any = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    this.http
      .put(this._HOST2 + '/UpdateEmployeeData', employe, headers)
      .subscribe((data: any) => {
        this.displayNotification("Employee Data Updated");
        loader.dismiss();
        //return this.retrieveEmployeeByStatus('Y');
      },
        (error: any) => {
          this.displayNotification(error);
          loader.dismiss();
        });
  }
  AsyncUpdateEmployeeData(employe: any) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let promise = new Promise((resolve, reject) => {
      let headers: any = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
      this.http
        .put(this._HOST2 + '/UpdateEmployeeData', employe, headers)
        .subscribe((data: any) => {
          this.displayNotification("Employee Data Updated");
          loader.dismiss();
          resolve();
        },
          (error: any) => {
            this.displayNotification(error);
            loader.dismiss();
          });
    })
    return promise;
  }
  asyncretrieveEmployee(status) {
    let promise = new Promise((resolve, reject) => {
      this.http
        .get(this._HOST2 + '/loadEmployeeByStatus?status=' + status)
        .subscribe((data: any) => {
          this.employeeList = data;
          console.log(this.employeeList);
          resolve();
        },
          (error: any) => {
            console.dir(error);
            return (error);
          });
    });
    return promise;
  }
  async updateemp() {
    await this.asyncretrieveEmployee('Y');
    console.log(this.employeeList);
  }
  ChangeEmployeeReportingStatus(employe: any) {
    let headers: any = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    this.http
      .put(this._HOST2 + '/ChangeEmployeeReportingStatus', employe, headers)
      .subscribe((data: any) => {
        this.displayNotification("Status changed to " + employe.Report_Staus);
      },
        (error: any) => {
          this.displayNotification(error);
        });
  }
  ApproveWorkStatus(report: any) {
    let loader = this.loadingController.create({
      content: "Rating.."
    });
    loader.present();
    let promise = new Promise((resolve,reject)=>{
      let headers: any = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
      this.http
        .put(this._HOST2 + '/ApproveWorkStatus', report, headers)
        .subscribe((data: any) => {
          this.displayNotification("Work Report " + report.WStatus);
          this.LoadEmpPendingWorkReports(this.currentuser.Designation);
          loader.dismiss();
          if(report.WStatus == 'Approved'){
            let notify = {
              SendTo: report.StaffId,
              Title: "New Work Report Notification",
              type:'Work Report',
              // Body: `Work report ${report.WStatus} by ${this.currentuser.EmpCode} ${this.currentuser.EmpName} ${this.currentuser.Designation}`
              Body: `Your Work report has been Approved`
            }
            this.sendNotification(notify);
          }
          resolve();
        },
          (error: any) => {
            this.displayNotification(error);
            loader.dismiss();
          });
    })
    return promise;
    
  }
  UpdateVoucherAmount(voucher: any, notice: any) {
    let promise = new Promise((resolve, reject) => {
      let loader = this.loadingController.create({
        content: "Loading.."
      });
      loader.present();
      let headers: any = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
      this.http
        .put(this._HOST2 + '/UpdateVoucher', voucher, headers)
        .subscribe((data: any) => {
          this.displayNotification("Voucher Updated");
          loader.dismiss();
          let notify = {
            SendTo: voucher.EmpId,
            Title: "Voucher updated",
            type:'Voucher Update',
            Body:`Your voucher dated ${voucher.Date.substring(0,10)} for the amount of Rs${voucher.OriginalAmount}/- has been updated to Rs${voucher.Amount}/-`
            //Body: "Voucher ("+voucher.Date.substring(0,10)+") has been updated"
          }
          if(notice == 'update'){
            notify.Title = 'Voucher Updated';
            notify.type = 'Voucher Updated';
            notify.Body=`Your voucher dated ${voucher.Date.substring(0,10)} for the amount of Rs${voucher.OriginalAmount}/- has been updated to Rs${voucher.Amount}/-`
          }
          if(notice == 'deleted'){
            notify.Title = 'Voucher Rejected';
            notify.type = 'Voucher Rejected';
            notify.Body=`Your voucher dated ${voucher.Date.substring(0,10)} for the amount of Rs${voucher.OriginalAmount}/- has been rejected`
          }
          if(notice == 'approved'){
            notify.Title = 'Voucher Approved';
            notify.type = 'Voucher Approved';
            notify.Body=`Your voucher dated ${voucher.Date.substring(0,10)} for the amount of Rs${voucher.OriginalAmount}/- has been approved`;
          }
          this.sendNotification(notify);
          resolve()
        },
          (error: any) => {
            this.displayNotification(error);
            loader.dismiss();
          });
    });
    return promise;
  }
  displayNotification(message: string): void {
    let toast = this._TOAST.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
  async sendNotification(notify) {
    let noted = await this.retrieveEmployeeById(notify.SendTo);
    let promise = new Promise((resolve,reject)=>{
      // let body = {
      //   "to": this.notifyUser.DeviceId,
      //   "notification": {
      //     "title": notify.Title,
      //     "body": notify.Body,
      //     "sound": "default",
      //     "click_action": "FCM_PLUGIN_ACTIVITY",
      //     "icon": "fcm_push_icon"
      //   },
      //   "data": { 
      //     "notifyType": notify.type,
      //     "notifyBody": notify.Body
      //   },
      //   "priority": "high",
      //   "restricted_package_name": ""
      // }
      let body = {
        "app_id": "9ac11fa0-538b-4857-a1ed-ad4295be3b16",
        "include_player_ids": [this.notifyUser.DeviceId],
        // "include_player_ids": ["ef627212-aafa-4390-a733-111d58b0f97d"],
        // "data": {
        //   "notifyType": notify.type,
        //   "notifyBody": notify.Body
        // },
        "contents": {"en": `${notify.Body} Notification`},
        "headings": {"en": `${notify.type}`},
      }
      let options = new HttpHeaders().set('Content-Type', 'application/json');
      this.http.post("https://onesignal.com/api/v1/notifications", body, {
        headers: options.set('Authorization', 'Basic ODY3ZDY5MGYtNzAwYy00YzliLWIwNWUtNmQ2MzAyZWQ2Mjgz'),
      }).subscribe((data)=>{
        resolve();
      });
    });
   return promise;
  }
  SetDeviceId() {
    let promise = new Promise((data)=>{
      console.log(this.currentuser.DeviceId)
      this.http
        .get(this._HOST2 + '/SetDeviceId?EmpCode='+ this.currentuser.EmpCode +'&DeviceId='+this.currentuser.DeviceId)
        .subscribe((data: any) => {
        },
        (error: any) => {
          this.displayNotification(error);
        });
    });
  }
  LoadHolidays(daytype:any,year: any, month: any) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let promise = new Promise((resolve, reject) => {
      this.http.get(this._HOST2 + '/LoadHolidays?daytype=' + daytype + '&year=' + year + '&month=' + month).subscribe((data: any) => {
        this.holidays = data;
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
  SetHoliday(id:any,remark:any,flag:any) {
    let promise = new Promise((resolve,reject)=>{
      let loader = this.loadingController.create({
        content: "Loading.."
      });
      loader.present();
      this.http.get(this._HOST2 + '/SetHoliday?id='+ id +'&remark='+remark+'&flag='+flag)
        .subscribe((data: any) => {
          loader.dismiss();
          resolve();
        },
        (error: any) => {
          loader.dismiss();
          this.displayNotification(error);
        });
    });
    return promise;
  }
  
  // PaySlips
  SalaryPaySlip(my: string) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let promise = new Promise((resolve, reject) => {
      this.http
        .get(this._HOST2 + '/SalaryPaySlip?my=' + my)
        .subscribe((data: any) => {
          this.salPaySlip = data;
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
  MonthSalDetails(my: string,empcode:string) {
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let promise = new Promise((resolve, reject) => {
      this.http
        .get(this._HOST2 + '/MonthSalDetails?my=' + my +'&empcode='+empcode)
        .subscribe((data: any) => {
          this.monthSalDetails = data;
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
  // Payslips end


  // Tasks
  LoadAllTasks(empid:string,status:string){
    let loader = this.loadingController.create({
      content: "Loading All Tasks"
    });
    loader.present();
    let promise = new Promise((resolve, reject) => {
      this.http
        .get(this._HOST2 + '/LoadAllTasks?empid='+empid+'&status='+status)
        .subscribe((data: any) => {
          this.allTasks = data;
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
  LoadAllTasksById(empid:string){
    let loader = this.loadingController.create({
      content: "Loading.."
    });
    loader.present();
    let promise = new Promise((resolve, reject) => {
      this.http
        .get(this._HOST2 + '/LoadTasksById?empid='+empid)
        .subscribe((data: any) => {
          this.allTasks = data;
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
  UpdateTask(task){
    let promise = new Promise((resolve, reject) => {
      let headers: any = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
      this.http
        .put(this._HOST2 + '/UpdateTask', task, headers)
        .subscribe((data: any) => {
          //this.LoadAllTasks();
          resolve();
        },
        (error: any) => {
          console.log(error);
        });
    });
    return promise;
  }
  CreateTask(task){
    let promise = new Promise((resolve, reject) => {
      let headers: any = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
      this.http
          .post(this._HOST2 + "/CreateTask", task, headers)
          .subscribe((data: any) => {
            this.displayNotification('Task Created');
            resolve();
          },
          (error: any) => {
            this.displayNotification(error);
          });
    });
      return promise;
  }


  // Tasks End





}
