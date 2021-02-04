import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RestcallsProvider } from '../../providers/restcalls/restcalls';
import { CreditsPage } from '../credits/credits';

@Component({
  selector: 'page-advances',
  templateUrl: 'advances.html',
})
export class AdvancesPage {
  advanceTotal: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams,public restCall: RestcallsProvider) {
  }

  ionViewWillEnter() {
    this.restCall.LoadAdvancesAll().then(()=>{
      console.log(this.restCall.advancesAll)
      this.restCall.advancesAll.forEach(element => {
        this.advanceTotal = this.advanceTotal+element.Advance;
      });
      console.log(this.advanceTotal)
    });
  }

  LoadAdvancesInCreditsPage(id){
    this.navCtrl.push(CreditsPage,{empcode:id,from:'Advances'});
  }

}