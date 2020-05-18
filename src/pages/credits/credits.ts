import { Component, ElementRef } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
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
  constructor(public navCtrl: NavController, public navParams: NavParams, private elmenetRef: ElementRef, public restCall: RestcallsProvider, public modalCtrl: ModalController) {
    
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
  DeleteVoucher(id){
    console.log(id); 
    this.restCall.DeleteVoucher(id).then(()=>{
      this.restCall.LoadEmpAllTransactions(this.empcode,this.selectedYear,this.selectedMonth,this.transType);
    });  
  }
  VoucherDetails(x: string | number){ 
    let list = this.elmenetRef.nativeElement.querySelectorAll('.tcard')
    console.log(list);
    for(let i =0;i<list.length; i++){
      if(list[i].classList.contains('open')){
        list[i].classList.remove('open')
      }
    }
    list[x].classList.add('open');
  }
  ionViewWillEnter(){
    this.currentuser = this.restCall.currentuser;
    this.empcode = this.navParams.get('empcode');
    // let cin = this.restCall.LoadAllTransactionsByEmpId(this.empcode);  
    this.restCall.retrieveCashInHand(this.empcode) 
    this.selectedYear = 'All';
    this.selectedMonth = 'All';
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
}  
