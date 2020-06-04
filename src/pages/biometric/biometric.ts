import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RestcallsProvider } from '../../providers/restcalls/restcalls';

@Component({ 
  selector: 'page-biometric',
  templateUrl: 'biometric.html',
})
export class BiometricPage {
  selectedMonth: any='0';
  selDay: any;
  selectedYear: any;
  bioreports: any;
  years: any;
  months: any;
  days: any;
  empcode:any='All';
  ym: boolean;
  my: boolean;
  maxdate: any;
  mindate: any;
  selectedDate: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public restCall: RestcallsProvider) {
  }
  MaxMinDates(){
    this.restCall.MaxMinDatesfromEmptimes(this.empcode,0,0).then(()=>{
      let max = this.restCall.MaxMinEmptimesDates[this.restCall.MaxMinEmptimesDates.length-1].MAXDATE.substring(0,10);
      let min = this.restCall.MaxMinEmptimesDates[this.restCall.MaxMinEmptimesDates.length-1].MINDATE.substring(0,10);
      this.maxdate = max.substring(0,4)+"-"+max.substring(5,7)+"-"+max.substring(8,10);
      this.mindate = min.substring(0,4)+"-"+min.substring(5,7)+"-"+min.substring(8,10);
      console.log(this.maxdate, this.mindate);
      this.selectedDate = max.substring(0,7);
      this.days = [];
      if(this.empcode == 'All'){
        this.restCall.MaxMinEmptimesDates.forEach(x => {
          if(x.DAYS != null){
            this.days.push(x.DAYS);
          }
        });
          this.selDay = max.substring(8,10);
      }
    });
  }
  async ionViewWillEnter(){
    this.restCall.LoadBiometricAndCheckins(this.empcode,0,0,0).then(()=>{
      this.bioreports = this.restCall.biometricAndCheckins;
    });
    this.MaxMinDates();
  }

  SearchByEmpCode(){
    if(this.empcode == 'All'){
      this.restCall.LoadBiometricAndCheckins(this.empcode,0,0,0).then(()=>{
        this.bioreports = this.restCall.biometricAndCheckins;
      });
      this.MaxMinDates();
    }else{
      this.restCall.LoadBiometricAndCheckins(this.empcode,0,0,0).then(()=>{
        this.bioreports = this.restCall.biometricAndCheckins;
      });
      this.MaxMinDates();
      this.selDay = 0
    }
    
  }
  SearchByYearandMonth(){
    if(this.empcode == 'All'){
      this.restCall.LoadBiometricAndCheckins(this.empcode,this.selectedDate.substring(0,4),this.selectedDate.substring(5,7),0)
      .then(()=>{
        this.bioreports = this.restCall.biometricAndCheckins;
      })
      this.restCall.MaxMinDatesfromEmptimes(this.empcode,this.selectedDate.substring(0,4),this.selectedDate.substring(5,7)).then(()=>{
        this.days = [];
        this.restCall.MaxMinEmptimesDates.forEach(x => {
          if(x.DAYS != null){
            this.days.push(x.DAYS);
          }
        });
        //this.once = true;
        this.selDay = this.days[0];
      })
    }else{
      this.restCall.LoadBiometricAndCheckins(this.empcode,this.selectedDate.substring(0,4),this.selectedDate.substring(5,7),0)
      .then(()=>{
        this.bioreports = this.restCall.biometricAndCheckins;
      })
      this.selDay = 0
    }
    
  }
  
  SearchByDay(){
    this.restCall.LoadBiometricAndCheckins(this.empcode,this.selectedDate.substring(0,4),this.selectedDate.substring(5,7),this.selDay).then(()=>{
      this.bioreports = this.restCall.biometricAndCheckins;
    })
  }
}
