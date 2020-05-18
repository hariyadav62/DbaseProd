import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { RestcallsProvider } from './../../providers/restcalls/restcalls';

@IonicPage()
@Component({
  selector: 'page-employeelist',
  templateUrl: 'employeelist.html',
})
export class EmployeelistPage { 
  EmpStatus: any;
  public openModal(item : any){
    var modalPage = this.modalCtrl.create('ModelemployeePage', { record : item });
    modalPage.present();
  }
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController , public restCall: RestcallsProvider) {
    
  }
  ionViewWillEnter(){
    this.EmpStatus = 'Y'
    this.restCall.retrieveEmployeeByStatus(this.EmpStatus); 
  }
  LoadEmpbyStatus(){
    this.restCall.retrieveEmployeeByStatus(this.EmpStatus); 
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad EmployeelistPage');
  }

} 
