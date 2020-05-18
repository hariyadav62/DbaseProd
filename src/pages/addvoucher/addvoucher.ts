import { Component, ElementRef } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { RestcallsProvider } from '../../providers/restcalls/restcalls';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'page-addvoucher',
  templateUrl: 'addvoucher.html',
})
export class AddvoucherPage {
  amount :any;
  updateamount:any;
  currentuser: any;
  uploadVoucher: any;
  voucherReason: any;
  selYears:any;
  selMonths: any;
  selectedYear: any = 'All';
  selectedMonth:any;
  options: CameraOptions = {
    quality: 10,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }
  selectedfile=null;
  uploadImage: Blob;
  open: boolean;
  unverifiedVouchers=[];
  verifiedVouchers=[]; 
  constructor(public navCtrl: NavController, public navParams: NavParams, private elmenetRef: ElementRef, public restCall: RestcallsProvider,private camera: Camera,public _DomSanitizationService: DomSanitizer, public modalCtrl: ModalController,public loadingController: LoadingController ) {
    this.currentuser=this.restCall.currentuser;  
  }
  onFileSelected(event){
    this.selectedfile = <File>event.target.files[0];
    console.log(this.selectedfile)
  }
  UploadFromGallery(){
    const fd = new FormData();
    fd.append('image',this.selectedfile,this.selectedfile.name);
    console.log(this.selectedfile)
    this.restCall.Upload(fd);
  }
  UploadCameraVoucher(){
    this.camera.getPicture(this.options).then((imageData) => {
     
      this.uploadVoucher = 'data:image/jpeg;base64,' + imageData;
     this.uploadImage = this.getBlob(this.uploadVoucher);
     console.log(this.uploadImage);
    }, (err) => {
    });
  }
 
  upload(){
    const fd = new FormData();
    if(this.uploadVoucher){
      fd.append('image',this.uploadImage,this.restCall.currentuser.EmpCode+".png");
    }else if(this.selectedfile){
      fd.append('image',this.selectedfile,this.restCall.currentuser.EmpCode+".png");
    }
    this.restCall.Upload(fd);
  }
  ionViewWillEnter(){
    this.restCall.retrieveCashInHand(this.restCall.currentuser.EmpCode);
    this.LoadAllVoucherTransactions();   
    this.restCall.LoadFyears(); 
    this.selMonths = null;
  }
  LoadAllVoucherTransactions(){
    this.restCall.AllVoucherTransactions('All',this.selectedYear,'').then(()=>{
      this.unverifiedVouchers=[];
      this.verifiedVouchers=[];
      this.restCall.allVoucherTransactions.forEach(x => {
        if(x.IsVerified == "Y"){
          this.verifiedVouchers.push(x);
        }else{
          this.unverifiedVouchers.push(x); 
        }
      });
      console.log(this.unverifiedVouchers); 
      console.log(this.verifiedVouchers);
    });
  }

  SearchByYear(){
    this.restCall.AllVoucherTransactions('All',this.selectedYear,'').then(()=>{
      this.unverifiedVouchers=[];
      this.verifiedVouchers=[];
      this.restCall.allVoucherTransactions.forEach(x => {
        if(x.IsVerified == "Y"){
          this.verifiedVouchers.push(x);
        }else{
          this.unverifiedVouchers.push(x); 
        }
      });
      console.log(this.unverifiedVouchers); 
      console.log(this.verifiedVouchers);
    });
    this.restCall.AllVoucherTransactionDates('All',this.selectedYear).then((data)=>{
      this.selMonths = this.restCall.allVoucherTransactionsDates;
    });
  }
  SearchByMonth(){
    this.restCall.AllVoucherTransactions('All',this.selectedYear,this.selectedMonth).then(()=>{
      this.unverifiedVouchers=[];
      this.verifiedVouchers=[]; 
      this.restCall.allVoucherTransactions.forEach(x => {
        if(x.IsVerified == "Y"){
          this.verifiedVouchers.push(x);
        }else{
          this.unverifiedVouchers.push(x); 
        }
      });
      console.log(this.unverifiedVouchers); 
      console.log(this.verifiedVouchers);
    }); 
  }
  
  applyVoucher(){
    if(this.amount != undefined && this.voucherReason != undefined && this.amount != null && this.voucherReason != null){
      let voucher:any ={
        amount : this.amount,
        fname: '',
        fpath:'',
        // fname: this.uploadVoucher,
        EmpId: this.currentuser.EmpCode,
        VDescription:this.voucherReason,
        VoucherId: '',
        Date:new Date().toLocaleString()
      } 
      this.restCall.ApplyVoucher(voucher);
      this.amount= null;
      this.voucherReason = null;
    }
  }
  UploadVoucher(){
    if((this.amount != undefined && this.voucherReason != undefined) && (this.amount != null && this.voucherReason != null)){
      if(this.uploadImage || this.selectedfile){
        const fd = new FormData();
        fd.append('amount',this.amount);
        fd.append('EmpId',this.currentuser.EmpCode);
        fd.append('VDescription',this.voucherReason);
        fd.append('Date',new Date().toLocaleString());
        console.log(this.uploadImage);
        if(this.uploadImage){
          fd.append('image',this.uploadImage,this.restCall.currentuser.EmpCode+".png");
        }else if(this.selectedfile){
          fd.append('image',this.selectedfile,this.restCall.currentuser.EmpCode+".png");
        }
        this.restCall.Upload(fd);
        this.amount= null;
        this.voucherReason = null;
        this.uploadVoucher = null;
        this.uploadImage = null;
        this.selectedfile = null;
        if(this.currentuser.UserTyper == 'ADMIN' || this.currentuser.UserTyper == 'ACCOUNTANT'){
          this.ionViewWillEnter();
        }
      }else{
        alert("Please attach Voucher Picture")
      }
    }else{
      alert("Both Amount and Voucher reason are required"); 
    }
  }
  VoucherDetails(item:any,x: string | number){ 
    let list = this.elmenetRef.nativeElement.querySelectorAll('.tcard.unverified')
    console.log(list);
    for(let i =0;(i<list.length); i++){
      if(i != x){
        if(list[i].classList.contains('open')){
          list[i].classList.remove('open')
        }
      }
    }
    this.updateamount = item.Amount;
    if(list[x].classList.contains('open')){
      list[x].classList.remove('open')
    }else{
      list[x].classList.add('open');
    }
  }
  VerifiedVoucherDetails(item:any,x: string | number){ 
    let list = this.elmenetRef.nativeElement.querySelectorAll('.tcard.verified')
    for(let i =0;i<list.length; i++){
      if(i != x){
        if(list[i].classList.contains('open')){ 
          list[i].classList.remove('open')
        }
      }
    }
    this.updateamount = item.Amount;
    if(list[x].classList.contains('open')){
      list[x].classList.remove('open')
    }else{
      list[x].classList.add('open');
    }
  }
  VerifyVoucher(item:any){
    if(item.Amount != this.updateamount){
      item.Amount = this.updateamount
    }
    item.Amount = this.updateamount
    item.IsVerified = "Y";
    this.restCall.UpdateVoucherAmount(item,'notice').then(()=>{
      this.ionViewWillEnter();
    });
  }
  // DeleteVoucher(item){
  //   console.log(item); 
  //   this.restCall.DeleteVoucher(item).then(()=>{
  //     this.LoadAllVoucherTransactions();  
  //   });  
  // }

  getBlob (b64Data) {
    let loader = this.loadingController.create({
      content: "B64 to BLOB.."
    });
    loader.present();
    let contentType = 'image/png';
    let sliceSize = 512;

    b64Data = b64Data.replace(/data\:image\/(jpeg|jpg|png)\;base64\,/gi, '');

    let byteCharacters = atob(b64Data); //decode base64
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
      }

      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    let blob = new Blob(byteArrays, {type: contentType});
    // console.log(blob);
    // alert('blob');
    loader.dismiss();
    return (blob);
  }
}


 