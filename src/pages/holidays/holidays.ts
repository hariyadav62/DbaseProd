import { Component, ElementRef } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { RestcallsProvider } from '../../providers/restcalls/restcalls';
@Component({
  selector: 'page-holidays',
  templateUrl: 'holidays.html',
})
export class HolidaysPage {
  holidays: any;
  selectedDate:any;
  today: any;
  remarks: any;
  isact: any;
  onlyHolidays: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public restCall: RestcallsProvider, public _TOAST: ToastController, private elmenetRef: ElementRef) {
  }

  ionViewWillEnter() { 
    if(this.selectedDate == null || this.selectedDate == undefined){
      let y = new Date(new Date().getUTCFullYear(),new Date().getUTCMonth(),new Date().getUTCDate(),new Date().getUTCHours(),new Date().getUTCMinutes(),new Date().getUTCSeconds());
      y.setMinutes(y.getMinutes()+330);
      if(y.getMonth()+1 < 10){
        this.selectedDate = (y.getFullYear() + "-0"+(y.getMonth()+1));
      }else{
        this.selectedDate = (y.getFullYear() + "-"+(y.getMonth()+1));
      }
    }
    if(this.restCall.currentuser.UserType == 'ADMIN' || this.restCall.currentuser.UserType=='MANAGER'){
      let y = 'All';
      if(this.onlyHolidays){
        y = 'Holidays'
      }else{
        y = 'All';
      }
      this.restCall.LoadHolidays(y,this.selectedDate.substring(0,4),this.selectedDate.substring(5,7)).then(()=>{
        this.holidays = this.restCall.holidays;
      });
    }
    else{
      this.restCall.LoadHolidays('Holidays',this.selectedDate.substring(0,4),this.selectedDate.substring(5,7)).then(()=>{
        this.holidays = this.restCall.holidays;
      });
    }
  }
  SearchByYearandMonth(){
    if(this.restCall.currentuser.UserType == 'ADMIN' || this.restCall.currentuser.UserType=='MANAGER'){
      let y = 'All'
      if(this.onlyHolidays){
        y = 'Holidays'
      }else{
        y = 'All'
      }
      this.restCall.LoadHolidays(y,this.selectedDate.substring(0,4),this.selectedDate.substring(5,7)).then(()=>{
        this.holidays = this.restCall.holidays;
      });
    }
    else{
      this.restCall.LoadHolidays('Holidays',this.selectedDate.substring(0,4),this.selectedDate.substring(5,7)).then(()=>{
        this.holidays = this.restCall.holidays;
      });
    }
  }
  OnlyHolidays(){
    let y = 'All'
    if(this.onlyHolidays){
      y = 'Holidays'
    }else{
      y = 'All'
    }
    this.restCall.LoadHolidays(y,this.selectedDate.substring(0,4),this.selectedDate.substring(5,7)).then(()=>{
      this.holidays = this.restCall.holidays;
    });
  }
  async ToggleAccrd(item,x){
    this.remarks = item.Remark;
    let list = this.elmenetRef.nativeElement.querySelectorAll('.allanc')
    for(let i =0;(i<list.length); i++){
      if(i == x){
      }
      else if(list[i].classList.contains('open')){
        list[i].classList.remove('open')
      }
    }
    this.isact = item.FLAG;
    if(list[x].classList.contains('open')){
      list[x].classList.remove('open')
    }else{
      list[x].classList.add('open');
    }
  }
  protected adjustTextarea(event: any): void {
    let textarea: any		= event.target;
    textarea.style.overflow = 'hidden';
    textarea.style.height 	= 'auto';
    textarea.style.height 	= textarea.scrollHeight + 'px';
    return;
  } 
  ActiveHoliday(holiday){
    let flag = 'false';
    if(holiday.FLAG){
      flag = 'false'
    }else{ 
      flag = 'true'
    }
    if(holiday.Remark == undefined || holiday.Remark == null || holiday.Remark == 'null' || holiday.Remark == ''){
      holiday.Remark = 'Holiday'
    }
    this.restCall.SetHoliday(holiday.ident,holiday.Remark,flag).then(()=>{
      this.SearchByYearandMonth();
    });
  }
  UpdtHoliday(item,x){
    this.restCall.SetHoliday(item.ident,this.remarks,item.FLAG).then(()=>{
      this.SearchByYearandMonth();
    });
  }
}
