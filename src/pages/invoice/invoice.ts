import { Component, ElementRef, Renderer2 } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RestcallsProvider } from '../../providers/restcalls/restcalls';

@Component({
  selector: 'page-invoice',
  templateUrl: 'invoice.html',
})
export class InvoicePage {
  open:boolean = false;
  isFMonths:boolean = false;
  FinancialYear:any='All';
  selectedFMonth:any='';
  selectedClient:any='';
  constructor(public navCtrl: NavController, private elmenetRef: ElementRef,public navParams: NavParams, public restCall: RestcallsProvider) {
  } 
  ionViewWillEnter(){
    this.FinancialYear = 'All' 
    this.selectedFMonth ='';
    this.selectedClient ='';
    this.isFMonths = false;
    this.restCall.LoadBills(this.FinancialYear,this.selectedFMonth,this.selectedClient);  
    this.restCall.LoadFyears(); 
    this.restCall.LoadInvoiceClients(this.FinancialYear,this.selectedFMonth);
    this.restCall.LoadBillSmry(this.FinancialYear,this.selectedFMonth,this.selectedClient); 
  }
  
  ToggleDetails(el,x){
    let list = this.elmenetRef.nativeElement.querySelectorAll('ion-card')
    console.log(list);
    for(let i =0;i<list.length; i++){
      if(list[i].classList.contains('open')){
        list[i].classList.remove('open')
      }
    }
    list[x].classList.add('open');
  }
  SearchByFyear(){
    this.selectedClient = '';
    this.isFMonths = true;
    this.restCall.LoadFMonths(this.FinancialYear);
    this.restCall.LoadBillSmry(this.FinancialYear,this.selectedFMonth,this.selectedClient);
    this.restCall.LoadBills(this.FinancialYear,this.selectedFMonth,this.selectedClient);  
    this.restCall.LoadInvoiceClients(this.FinancialYear,this.selectedFMonth);
  }
  SearchByFYearMonth(){
    this.selectedClient = '';
    if(this.selectedClient == 'All' && this.selectedFMonth == 'All'){
      this.restCall.LoadBillSmry(this.FinancialYear,'','');
      this.restCall.LoadBills(this.FinancialYear,'','');  
    }else if(this.selectedClient != 'All' && this.selectedFMonth != 'All'){
      this.restCall.LoadBillSmry(this.FinancialYear,this.selectedFMonth,this.selectedClient);
      this.restCall.LoadBills(this.FinancialYear,this.selectedFMonth,this.selectedClient);  
    } else if(this.selectedClient == 'All' && this.selectedFMonth != 'All'){
      this.restCall.LoadBillSmry(this.FinancialYear,this.selectedFMonth,'');
      this.restCall.LoadBills(this.FinancialYear,this.selectedFMonth,'');  
    } else if(this.selectedClient != 'All' && this.selectedFMonth == 'All'){
      this.restCall.LoadBillSmry(this.FinancialYear,'',this.selectedClient);
      this.restCall.LoadBills(this.FinancialYear,'',this.selectedClient);  
    } 
    this.restCall.LoadInvoiceClients(this.FinancialYear,this.selectedFMonth);
  }
  SearchByClient(){
    if(this.selectedClient == 'All' && this.selectedFMonth == 'All'){
      this.restCall.LoadBillSmry(this.FinancialYear,'','');
      this.restCall.LoadBills(this.FinancialYear,'','');  
    }else if(this.selectedClient != 'All' && this.selectedFMonth != 'All'){
      this.restCall.LoadBillSmry(this.FinancialYear,this.selectedFMonth,this.selectedClient);
      this.restCall.LoadBills(this.FinancialYear,this.selectedFMonth,this.selectedClient);  
    } else if(this.selectedClient == 'All' && this.selectedFMonth != 'All'){
      this.restCall.LoadBillSmry(this.FinancialYear,this.selectedFMonth,'');
      this.restCall.LoadBills(this.FinancialYear,this.selectedFMonth,'');  
    } else if(this.selectedClient != 'All' && this.selectedFMonth == 'All'){
      this.restCall.LoadBillSmry(this.FinancialYear,'',this.selectedClient);
      this.restCall.LoadBills(this.FinancialYear,'',this.selectedClient);  
    } 
  }
  
}
