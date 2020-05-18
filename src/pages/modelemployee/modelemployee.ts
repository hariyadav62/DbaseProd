import { EmptimingsallPage } from './../emptimingsall/emptimingsall';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, App } from 'ionic-angular';
import { RestcallsProvider } from '../../providers/restcalls/restcalls';

@IonicPage()
@Component({
  selector: 'page-modelemployee',
  templateUrl: 'modelemployee.html',
})
export class ModelemployeePage {
  updateform: boolean = false;
  EmpCode: any;
  EmpName: any ; 
  Designation: any ; 
  DOJ: any; 
  Mobile: any ;
  Email: any;
  MaximumTransferAmount: any;
  Employee_ID: any;
  RequestTo: any;
  isActive: any;
  changePassword: boolean;
  oldPassword: any;
  password: any;
  newpassword: any;
  constructor(public navCtrl: NavController, public restCall: RestcallsProvider, public navParams: NavParams, public viewCtrl : ViewController,public app: App) {
  }
  public closeModal(){
    this.viewCtrl.dismiss(); 
  }
  ShowChangePassword(){
    this.changePassword = true;
  }
  closeChangePassword(){
    this.changePassword = false;
  }
  async ChangePassword(){
    if(this.oldPassword!= undefined){
      if(this.oldPassword.length !=0){
        if(this.oldPassword == this.password){
          if(this.newpassword!= undefined){
            if(this.newpassword.length != 0){
              if(this.newpassword != this.password){
                let emp =  this.navParams.data.record;
                if(this.restCall.currentuser.UserType == 'ADMIN'){
                  emp = this.restCall.currentuser;
                  console.log(emp.PassWord);
                }
                emp.PassWord = this.newpassword;
                await this.restCall.ChangePassword(emp);
                this.closeModal(); 
                this.changePassword = false;
                this.restCall.logOut();
              }else{
                this.restCall.displayNotification("New Password must be different from old password");
              }
            }else{
              this.restCall.displayNotification("Please enter New Password");
            }
          }else{
            this.restCall.displayNotification("Please enter New Password");
          }
        }else{
          this.restCall.displayNotification("Password Incorrect");
        }
      }
      else{
        this.restCall.displayNotification("Please enter old Password");
      } 
    }else{
      this.restCall.displayNotification("Please enter old Password");
    }  
  }
  Employeeleaves(id:any){
    this.navCtrl.push("PreviousleavesPage",{
      empCode:id
      });
  }
  EmployeeTime(id:any){
    this.navCtrl.push(EmptimingsallPage,{
      empCode:id
    });
  }
  EmployeeWorkReports(id:any){
    this.navCtrl.push("WorkstatusPage",{
      empcode:id, reportForm:false
      });
  }
  async ChangeStatus(){  
    let employe = this.navParams.get("record");
    let status = employe.isActive;
    employe.isActive = this.isActive;
    await this.restCall.ChangeEmployeeStatus(employe); 
    this.restCall.retrieveEmployeeByStatus(status);
  }
  editCandidateForm(){
    this.updateform = true;
  }
  async UpdateEmployeeData(status){
    let employe={
      Employee_ID : this.Employee_ID ,
      EmpCode: this.EmpCode ,
      EmpName:this.EmpName , 
      Designation: this.Designation,
      DOJ: this.DOJ,
      Mobile:this.Mobile,
      Email:this.Email,
      isActive: this.isActive,
      MaxTransferAmount:this.MaximumTransferAmount,
      RequestTo:this.RequestTo
    }
    await this.restCall.AsyncUpdateEmployeeData(employe); 
    this.restCall.retrieveEmployeeByStatus(status);
    this.updateform = false;
  }
  ionViewWillEnter() {
    this.restCall.LoadDesignations();
    if(this.navParams.get("record"))
    {
      this.Employee_ID = this.navParams.data.record.Employee_ID;
      this.EmpCode = this.navParams.data.record.EmpCode;
      this.EmpName = this.navParams.data.record.EmpName; 
      this.Designation = this.navParams.data.record.Designation;
      this.DOJ = this.navParams.data.record.DOJ;
      this.Mobile = this.navParams.data.record.Mobile;
      this.Email = this.navParams.data.record.Email;
      this.MaximumTransferAmount = this.navParams.data.record.MaxTransferAmount;
      this.RequestTo = this.navParams.data.record.RequestTo;
      this.isActive = this.navParams.data.record.isActive;
      this.password = this.navParams.data.record.PassWord;
    }
  }
}
