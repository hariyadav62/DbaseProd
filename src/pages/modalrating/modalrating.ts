import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { RestcallsProvider } from '../../providers/restcalls/restcalls';

@Component({
  selector: 'page-modalrating',
  templateUrl: 'modalrating.html',
})
export class ModalratingPage {
  report: any;
  rating: any;
  rr: any = [];
  msg: string;

  constructor(public navCtrl: NavController, public restCall: RestcallsProvider, public navParams: NavParams, public viewCtrl : ViewController) {
  }
  public closeModal(){
    this.viewCtrl.dismiss();
  }
  protected adjustTextarea(event: any): void {
    let textarea: any		= event.target;
    textarea.style.overflow = 'hidden';
    textarea.style.height 	= 'auto';
    textarea.style.height 	= textarea.scrollHeight + 'px';
    return;
  }
  ionViewDidLoad() {
    if(this.navParams.get("report"))
    {
       this.report = this.navParams.get("report");
       this.rating = this.navParams.get("rating");
    }
  }
  AddRatingRemark(event,remark){
    if(event.value){
      if(!this.rr.includes(remark)){
        this.rr.push(remark);
      }
    }
    else{
      if(this.rr.includes(remark)){
        this.rr.splice(this.rr.indexOf(remark), 1);
      }
    }
  }
  Submit(){
    if(this.rr != [] || (this.msg != '' && this.msg != undefined && this.msg != null)){
      if(this.rr != []){
        if(this.msg != '' && this.msg != undefined && this.msg != null){
          this.rr.push(this.msg);
        }
        let y = this.rr.join(',');
        this.report.RatingRemarks =  y;
        this.restCall.ApproveWorkStatus(this.report).then(()=>{
          this.viewCtrl.dismiss();
        });
      }else{
        this.report.RatingRemarks =  this.msg;
        this.restCall.ApproveWorkStatus(this.report).then(()=>{
          this.viewCtrl.dismiss();
        });
      }
    }else{
      alert("please select atleast one remark");
    }
  }
}
