import { AnnouncementsPage } from './../pages/announcements/announcements';
import { ComponentsModule } from './../components/components.module';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpClientModule } from '@angular/common/http'
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { ChartsModule } from 'ng2-charts-x';
import { OneSignal } from '@ionic-native/onesignal';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { RestcallsProvider } from '../providers/restcalls/restcalls';  
// import { FCM } from '@ionic-native/fcm';
import { EmployeetimingPage } from '../pages/employeetiming/employeetiming';
import { EmptimingsallPage } from '../pages/emptimingsall/emptimingsall';
import { EmptabsPage } from '../pages/employeetimingtabs/emptabs';
import { ModelleavedetailsPage } from '../pages/modelleavedetails/modelleavedetails';
import { ReportingtimePage } from '../pages/reportingtime/reportingtime';
import { ReportabsPage } from '../pages/employeereportingtabs/reportabs';
import { ReportingtimeallPage } from '../pages/reportingtimeall/reportingtimeall';
import { VouchersPage } from '../pages/vouchers/vouchers';
import { CreditsPage } from '../pages/credits/credits';
import { AddvoucherPage } from '../pages/addvoucher/addvoucher';
import { Camera } from '@ionic-native/camera';
import { EmptransactionsPage } from '../pages/emptransactions/emptransactions';
import { WorkSubmissionPage } from '../pages/work-submission/work-submission';
import { ModelVoucherDetailsPage } from '../pages/model-voucher-details/model-voucher-details';
import { MyTeamPage } from '../pages/my-team/my-team';
import { WorkSubmissionAllPage } from '../pages/work-submission-all/work-submission-all';
import { TabsWorkPage } from '../pages/tabs-work/tabswork';
import { InvoicePage } from '../pages/invoice/invoice';
import { EmpCheckInsPage } from '../pages/emp-check-ins/emp-check-ins';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { DropdownComponent } from '../components/dropdown/dropdown';
import { AnnouncementpopupComponent } from '../components/announcementpopup/announcementpopup';
import { BiometricPage } from '../pages/biometric/biometric';
import { HolidaysPage } from '../pages/holidays/holidays';
import { IonicSelectableModule } from 'ionic-selectable';
import { ModalratingPage } from '../pages/modalrating/modalrating';
import { BarcodescannerPage } from '../pages/barcodescanner/barcodescanner';
import { SalaryPage } from '../pages/salary/salary';
import { DatePipe } from '@angular/common';
import { TasksPage } from '../pages/tasks/tasks';
import { TabsTaskPage } from '../pages/tabs-tasks/tabstask';
import { TasksCompletedPage } from '../pages/tasks-completed/tasks-completed';
import { TasksPendingPage } from '../pages/tasks-pending/tasks-pending';
@NgModule({ 
  declarations: [
    MyApp,
    AboutPage, 
    ContactPage,
    HomePage,
    TabsPage,
    EmployeetimingPage,
    EmptimingsallPage,
    EmptabsPage,
    ModelleavedetailsPage,
    ReportingtimePage,
    ReportabsPage,
    ReportingtimeallPage,
    VouchersPage,
    CreditsPage,
    AddvoucherPage,
    EmptransactionsPage,
    WorkSubmissionPage,
    ModelVoucherDetailsPage,
    MyTeamPage, 
    WorkSubmissionAllPage,
    TabsWorkPage,
    TabsTaskPage,
    InvoicePage,
    EmpCheckInsPage ,
    AnnouncementsPage,  
    AnnouncementpopupComponent, 
    BiometricPage, 
    HolidaysPage,
    ModalratingPage,
    DropdownComponent,
    SalaryPage,
    TasksPage,
    TasksCompletedPage,
    TasksPendingPage,
    BarcodescannerPage
  ],
  imports: [ 
    BrowserModule,
    HttpClientModule,
    ChartsModule,
    ComponentsModule,
    IonicSelectableModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp], 
  entryComponents: [
    MyApp,
    AboutPage,
    HolidaysPage,
    AnnouncementpopupComponent,
    SalaryPage,
    DropdownComponent,
    ModalratingPage,
    BiometricPage,
    ContactPage,
    HomePage,
    TabsPage,
    EmployeetimingPage,
    EmptimingsallPage,
    EmptabsPage,
    ModelleavedetailsPage,
    ReportingtimePage,
    ReportabsPage,
    ReportingtimeallPage,
    VouchersPage,
    CreditsPage,
    AddvoucherPage,
    EmptransactionsPage,
    WorkSubmissionPage,
    ModelVoucherDetailsPage,
    MyTeamPage,
    WorkSubmissionAllPage,
    TabsWorkPage, 
    TabsTaskPage,
    InvoicePage,
    EmpCheckInsPage ,
    AnnouncementsPage,   
    TasksPage,
    TasksCompletedPage,
    TasksPendingPage,
    BarcodescannerPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RestcallsProvider,File,FileTransfer, FileTransferObject,DatePipe,
    OneSignal
  ]
})
export class AppModule {}
