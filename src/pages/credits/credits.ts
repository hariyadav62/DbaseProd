import { Component, ElementRef } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { RestcallsProvider } from '../../providers/restcalls/restcalls';
import { ModelVoucherDetailsPage } from '../model-voucher-details/model-voucher-details';
@Component({
  selector: 'page-credits',
  templateUrl: 'credits.html',
})
export class CreditsPage {
  currentuser: any;  
  transType: any='All';
  empcode:any
  selYears: any; 
  selMonths: any;
  selectedYear: any;
  selectedMonth: any ;
  adv: boolean;
  alltrans: boolean;
  testremark = "yolo yolo __ test remark";
  empAdv: any;
  validMsg: string='';

  constructor(public navCtrl: NavController, public navParams: NavParams, private elmenetRef: ElementRef, public restCall: RestcallsProvider, public modalCtrl: ModalController,public alertCtrl: AlertController) {
    
  }
  LoadTransactions(){
    if(this.transType == 'Advances'){
      this.restCall.LoadAdvances(this.empcode,'All','All').then(()=>{ 
        this.adv = true;
        this.alltrans = true;
      });
    }else{
      this.restCall.LoadEmpAllTransactions(this.empcode,this.selectedYear,this.selectedMonth,this.transType).then(()=>{
        this.adv = false;
        this.alltrans = true;
      });
    }
  }
  VoucherDetails(x: string | number){ 
    let list = this.elmenetRef.nativeElement.querySelectorAll('.tcard')
    console.log(list);
    for(let i =0;i<list.length; i++){
      if(i != x){
        if(list[i].classList.contains('open')){
          list[i].classList.remove('open')
        }
      }
    }
    if(list[x].classList.contains('open')){
      list[x].classList.remove('open')
    }else{
      list[x].classList.add('open');
    }
  }
  ionViewWillEnter(){
    this.currentuser = this.restCall.currentuser;
    this.empcode = this.navParams.get('empcode');
    this.restCall.retrieveCashInHand(this.empcode) 
    this.selectedYear = 'All';
    this.selectedMonth = 'All';
    this.restCall.LoadAdvances(this.empcode,'All','All').then(()=>{ 
      if(this.restCall.transactions.length != 0){
        this.empAdv = this.restCall.transactions[0].OUTSTANDING;
      }
    });
    if(this.navParams.get('from') == "Advances"){
      this.transType = 'Advances';
      this.LoadTransactions();
    }else{
      this.transType = 'All';
      this.LoadTransactions();
    }
    this.restCall.LoadEmpAllTransactions(this.empcode,this.selectedYear,this.selectedMonth,this.transType);
    this.restCall.LoadFyears(); 
    this.selMonths = null;
  }
  SearchByYear(){
    this.restCall.LoadEmpAllTransactions(this.empcode,this.selectedYear,this.selectedMonth,this.transType);
    this.restCall.AllTransactionDates(this.empcode,this.selectedYear).then((data)=>{
      this.selMonths = this.restCall.allTransactionsDates;
    });
  }
  SearchByMonth(){
    this.restCall.LoadEmpAllTransactions(this.empcode,this.selectedYear,this.selectedMonth,this.transType);
  }
  public AllVoucherDetails(itemm : any){
    let item:any = {};
    item.Amount = itemm.AMOUNT;
    item.VDescription = itemm.DESCRIPTION;
    item.fname = itemm.FNAME;
    item.Date = itemm.DATE.substring(0, 10);
    item.TransType = itemm.TRANSACTIONTYPE;
    item.Vid = itemm.ID;
    var modalPage = this.modalCtrl.create(ModelVoucherDetailsPage, { record : item });
    modalPage.present();
  }
  AdvanceRepayment(){
    const prompt = this.alertCtrl.create({
      title: 'Advance Repayment',
      message: this.validMsg,
      cssClass:'adv-repay',
      inputs: [
        {
          name: 'advRepayment',
          placeholder: 'upto '+ this.restCall.transactions[0].OUTSTANDING + ' can be repayed',
          type: 'tel'
        },
        {
          name: 'advRepaymentRemarks',
          placeholder: 'Remarks (optional)',
          type: 'text'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
          }
        },
        {
          text: 'Repay',
          handler: data => {
            console.log(data.advRepayment);
            if(0 < data.advRepayment && this.restCall.transactions[0].OUTSTANDING >= data.advRepayment){
              this.validMsg = '';
              let credit:any ={
                Amount : data.advRepayment,
                RecieverEmpId: this.restCall.currentuser.EmpCode,
                SenderEmpId: this.empcode,
                CDescription: "Advnce Repayment Amount transferred to "+this.empcode+",through DBS Mobile App __ "+data.advRepaymentRemarks,
                Date:new Date().toLocaleString(),
                TransferType: 'DBS Mobile',
                SALorAdv : 'Advance Repayment' 
              } 
              this.restCall.TransferAmount(credit);
              this.restCall.LoadAdvances(this.empcode,'All','All').then(()=>{ 
                if(this.restCall.transactions.length != 0){
                  this.empAdv = this.restCall.transactions[0].OUTSTANDING;
                }
              })
            }else{
              this.validMsg = 'Please enter amount between 0 and '+ this.restCall.transactions[0].OUTSTANDING;
              return false;
            }
             
          }
        }
      ]
    });
    prompt.present();
  }
}  
