import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { RestcallsProvider } from '../../providers/restcalls/restcalls';

@Component({
  selector: 'page-modelleavedetails',
  templateUrl: 'modelleavedetails.html',
})
export class ModelleavedetailsPage {
  Remarks: any;
  Lto: any;
  LFrom: any;
  leaveType: any;
  EmpName: any;
  EmpCode: any;
  LType: any;
  L_status: any;
  currentuser:any;

  constructor(public navCtrl: NavController, public restCall: RestcallsProvider, public navParams: NavParams, public viewCtrl : ViewController) {
    this.currentuser=this.restCall.currentuser; 

  }
  public closeModal(){
    this.viewCtrl.dismiss();
  }
  respondToLeave(x:string){
    this.navParams.data.record.L_status = x;
    this.restCall.respondTLeave(this.navParams.data.record);
  }
  ionViewDidLoad() {
    if(this.navParams.get("record"))
    {
       this.EmpCode = this.navParams.data.record.EmpCode;
        this.EmpName = this.navParams.data.record.EmpName; 
        this.leaveType = this.navParams.data.record.leaveType;
        this.LFrom = this.navParams.data.record.LFrom.substring(0, 10);
        this.Lto = this.navParams.data.record.Lto.substring(0, 10);
        this.Remarks = this.navParams.data.record.Remarks;
        this.LType = this.navParams.data.record.LType;
        this.L_status = this.navParams.data.record.L_status;
    }  }

}
