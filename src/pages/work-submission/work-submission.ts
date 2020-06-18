import { ModalratingPage } from './../modalrating/modalrating';
import { Component, ElementRef } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController, ModalController } from 'ionic-angular';
import { RestcallsProvider } from '../../providers/restcalls/restcalls';
@Component({
  selector: 'page-work-submission',
  templateUrl: 'work-submission.html',
})
export class WorkSubmissionPage {
  rr: any = [];
  msg: string;
  constructor(public navCtrl: NavController,public viewCtrl: ViewController, public navParams: NavParams, public restCall: RestcallsProvider,public alertCtrl: AlertController, public modalCtrl: ModalController, private elmenetRef: ElementRef) {
    this.viewCtrl = this.navParams.get('viewCtrl');
  }
  public onClickCancel() {
    this.viewCtrl.dismiss();
  }
  protected adjustTextarea(event: any): void {
    let textarea: any		= event.target;
    textarea.style.overflow = 'hidden';
    textarea.style.height 	= 'auto';
    textarea.style.height 	= textarea.scrollHeight + 'px';
    return;
  } 
  ionViewWillEnter() {
    this.restCall.asyncretrieveEmployee('Y');
    this.restCall.LoadEmpPendingWorkReports(this.restCall.currentuser.Designation);
  } 
  rate(eve,num,report,i){
    report.WStatus = "Pending";
    let starList = eve.target.offsetParent.children[0].children[4].children
    for(let x = 0; x < 5 ; x++){
      if(starList[x].classList.contains('rated')){
        starList[x].classList.remove('rated');
      }
    }
    for(let x = 0;x <= num; x++){
      starList[x].classList.add('rated');
    }
    if(this.restCall.currentuser.UserType == 'TEAMLEADER' || this.restCall.currentuser.UserType == 'MANAGER'){
      report.TLRating = num+1;
      report.AdminRating = 0;
    }
    if((num+1)==1 || (num+1)==5){
      this.ToggleForm(i,report.WorkId);
    }else{
      this.restCall.ApproveWorkStatus(report).then(()=>{
        this.rr = [];
        this.msg = undefined;
      })
    }
  }
  
 
  // Submit(report,x){
  //   if(this.rr != [] || (this.msg != '' && this.msg != undefined && this.msg != null)){
  //     if(this.rr != []){
  //       if(this.msg != '' && this.msg != undefined && this.msg != null){
  //         this.rr.push(this.msg);
  //       }
  //       let y = this.rr.join(',');
  //       report.RatingRemarks =  y;
  //       this.restCall.ApproveWorkStatus(report).then(()=>{
  //         this.remarkForm = false;
  //         let list = this.elmenetRef.nativeElement.querySelectorAll('.rateCard')
  //         for(let i =0;(i<list.length); i++){
  //           if(i == x){
  //             list[i].classList.remove('open')
  //           }
  //         }
  //         this.rr = [];
  //         this.msg = undefined;
  //       });
  //     }else{
  //       report.RatingRemarks =  this.msg;
  //       this.restCall.ApproveWorkStatus(report).then(()=>{
  //         let list = this.elmenetRef.nativeElement.querySelectorAll('.rateCard')
  //         for(let i =0;(i<list.length); i++){
  //           if(i == x){
  //             list[i].classList.remove('open')
  //           }
  //         }
  //         this.remarkForm = false;
  //         this.rr = [];
  //         this.msg = undefined;
  //       });
  //     }
  //   }else{
  //     alert("please select atleast one remark");
  //   }
  // }
  Submit(report,x){
    if((this.msg != '' && this.msg != ' ' && this.msg != undefined && this.msg != null)){
      this.rr.pop("Others");
        this.rr.push(this.msg);
        let y = this.rr.join(',');
        report.TLRemarks =  y;
        this.restCall.ApproveWorkStatus(report).then(()=>{
          let list = this.elmenetRef.nativeElement.querySelectorAll('.rateCard')
          for(let i =0;(i<list.length); i++){
            if(i == x){
              list[i].classList.remove('open')
            }
          }
        });
    }
  }
  ToggleForm(x,id){
    let list = this.elmenetRef.nativeElement.querySelectorAll('.rateCard')
    console.log(list);
      for(let i =0;(i<list.length); i++){
        if(i == x){
        }
        else if(list[i].classList.contains('open')){
          list[i].classList.remove('open')
          console.log(i);
        }
      }
      let ratecard = this.elmenetRef.nativeElement.querySelector('.rateCard.id'+id)
      ratecard.classList.add('open');
  }
  Comments(event,x,report,id){
    this.rr = event;
    if(event.includes("Others") ){
      let list = this.elmenetRef.nativeElement.querySelectorAll('.rateCard.id'+id)
      console.log(list);
      for(let i = 0;(i<list.length); i++){
        if(i == x){
        }
        else if(list[i].classList.contains('others')){
          list[i].classList.remove('others')
        }
      }
      list[x].classList.add('others'); 
    }
    else{
      console.log(event.join(","));
      report.TLRemarks = event.join(",");
      this.restCall.ApproveWorkStatus(report).then(()=>{
        let list = this.elmenetRef.nativeElement.querySelectorAll('.rateCard.id'+id)
        for(let i =0;(i<list.length); i++){
          if(i == x){
            list[i].classList.remove('open')
          }
        }
      });
    }
  }
  
}
