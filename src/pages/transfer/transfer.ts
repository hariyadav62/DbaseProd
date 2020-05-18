import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController, AlertController  } from 'ionic-angular';
import { RestcallsProvider } from '../../providers/restcalls/restcalls';
@IonicPage()
@Component({
  selector: 'page-transfer', 
  templateUrl: 'transfer.html',
})
export class TransferPage {
  RecieverEmpId:any; 
  AccountEmpId:any = '1509';
  amount: any;
  Tid: any;
  voucherReason: any;
  currentuser: any;
  remarks: any;
  TransferType: any;
  isSalary: boolean = false;
  isAdvance: boolean = false;
  isAdvanceRepay:boolean = false;
  enableRepayment:boolean = false;
  amountValidation: boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams, public restCall:RestcallsProvider,public viewCtrl: ViewController,public alertCtrl: AlertController) {
    this.currentuser=this.restCall.currentuser;     
  }
  LoadEmpbyStatus(){
    if(this.RecieverEmpId != null && this.RecieverEmpId != undefined){
      console.log(this.RecieverEmpId.substring(0,4));
      if(this.RecieverEmpId.substring(0,4) == '1501'){
        this.enableRepayment = true;
        console.log(this.enableRepayment)
      }
      else{
        this.enableRepayment = false;
      }
    }
    
  }
  
  async TransferAmount(){
    if(this.amount != undefined && this.amount!= null && this.RecieverEmpId != undefined && this.RecieverEmpId != null && this.TransferType != undefined && this.TransferType != null){
      if(this.isSalary && this.isAdvance){
        alert("Cannot select both Salary and Advance"); 
      }else if(this.isSalary || this.isAdvance || this.isAdvanceRepay){
        if(this.amount > 0){
          let credit:any ={
            Amount : this.amount,
            RecieverEmpId: this.RecieverEmpId.substring(0,4),
            SenderEmpId: this.restCall.currentuser.EmpCode,
            CDescription: "Amount transferred to "+this.RecieverEmpId+",through "+this.TransferType,
            Date:new Date().toLocaleString(),
            TransferType: this.TransferType,
            SALorAdv : 'Credit' 
          } 
          console.log(credit);  
          if(this.isSalary){
            credit.SALorADV = 'Salary';
            credit.CDescription= "Salary Amount transferred to "+this.RecieverEmpId.substring(0,4)+",through "+this.TransferType;
          }
          if(this.isAdvance){
            credit.SALorADV = 'Advance';
            credit.CDescription= "Advance Amount transferred to "+this.RecieverEmpId.substring(0,4)+",through "+this.TransferType;
          }
          if(this.isAdvanceRepay){
              credit.SALorADV = 'Advance Repayment';
              credit.CDescription= "Advnce Repayment Amount transferred to "+this.RecieverEmpId.substring(0,4)+",through "+this.TransferType;
          }
          if(this.restCall.currentuser.UserType == 'ADMIN'){
            let trans = await this.restCall.TransferAmount(credit);
            this.amount = null;
            this.RecieverEmpId = null;
            this.remarks = null;
            this.TransferType = null;
            this.viewCtrl.dismiss();
          }
          else{
           if(this.amount < this.restCall.cashinhand[0].CASHINHAND){
            let trans = await this.restCall.TransferAmount(credit);
            this.amount = null;
            this.RecieverEmpId = null;
            this.remarks = null;
            this.TransferType = null;
            this.viewCtrl.dismiss();
            } 
            else{
              const confirm = this.alertCtrl.create({
                title: 'Warning',
                message: 'Amount is greater than Cash In Hand, Do you want to Transfer?',
                buttons: [
                  {
                    text: 'Cancel',
                    handler: () => {
                      //this.navCtrl.push(EmpCheckInsPage);
                    }
                  },
                  {
                    text: 'Yes',
                    handler: () => {
                      let trans = this.restCall.TransferAmount(credit);
                      this.amount = null;
                      this.RecieverEmpId = null;
                      this.remarks = null;
                      this.TransferType = null;
                      this.viewCtrl.dismiss();
                    }
                  }
                ]
              });
              confirm.present();
            }
          }
        }
        else{
          alert("Please Enter amount greater than '0'");
        }
      }
      else{
        if(((this.amount < Number(this.RecieverEmpId.substring(5))) || (this.amount == Number(this.RecieverEmpId.substring(5)))) && (this.amount > 0)){
          let credit:any ={
            Amount : this.amount,
            RecieverEmpId: this.RecieverEmpId.substring(0,4),
            SenderEmpId: this.restCall.currentuser.EmpCode,
            CDescription: "Amount transferred to "+this.RecieverEmpId.substring(0,4)+",through "+this.TransferType,
            Date:new Date().toLocaleString(),
            TransferType: this.TransferType,
            SALorAdv : 'Credit' 
          }
          if(this.restCall.currentuser.UserType == 'ADMIN'){
            let trans = await this.restCall.TransferAmount(credit);
            this.amount = null;
            this.RecieverEmpId = null;
            this.remarks = null;
            this.TransferType = null;
            this.viewCtrl.dismiss();
          }
          else{
            if(this.amount < this.restCall.cashinhand[0].CASHINHAND){
              let trans = await this.restCall.TransferAmount(credit);
              this.amount = null;
              this.RecieverEmpId = null;
              this.remarks = null;
              this.TransferType = null;
              this.viewCtrl.dismiss();
            }
            else{
              const confirm = this.alertCtrl.create({
                // title:"Rs. "+ (this.amount - this.restCall.cashinhand[0].CASHINHAND)+"/",
                title:"Rs. "+ (this.amount)+"/",
                message: 'Amount is greater than Cash In Hand, Do you want to Transfer?',
                buttons: [
                  {
                    text: 'Cancel',
                    handler: () => {
                      //this.navCtrl.push(EmpCheckInsPage);
                    }
                  },
                  {
                    text: 'Yes',
                    handler: () => {
                      let trans = this.restCall.TransferAmount(credit);
                      this.amount = null;
                      this.RecieverEmpId = null;
                      this.remarks = null;
                      this.TransferType = null;
                      this.viewCtrl.dismiss();
                    }
                  }
                ]
              });
              confirm.present();
            }
          }
          
        }
        else{
          alert(this.amount+" Please Enter amount between 0 and "+this.RecieverEmpId.substring(5));
        }
      }
    }else{
      alert("Fill all required fields");
    }
    
  }
 
  ionViewWillEnter() {
    this.restCall.EmpListWithMaxTransferAmount();  
    this.restCall.retrieveCashInHand(this.restCall.currentuser.EmpCode)
  }
  AmountValidation(){
    console.log(this.restCall.currentuser.EmpCode); 
    if(this.restCall.currentuser.EmpCode == '1501'){
      this.amountValidation = false;
    }else{
      if(this.amount > this.restCall.cashinhand[0].CASHINHAND){ 
        this.amountValidation = true;
      }
      if(this.amount < this.restCall.cashinhand[0].CASHINHAND){
        this.amountValidation = false;
      }
    }
    
  }
}
