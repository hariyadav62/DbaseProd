import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { RestcallsProvider } from '../../providers/restcalls/restcalls';
declare var EmbeddedBarcodeReader: any;
@Component({
  selector: 'page-barcodescanner',
  templateUrl: 'barcodescanner.html',
})
export class BarcodescannerPage {
  barcode: any;
  scanCount: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public restCall: RestcallsProvider, public loadingController: LoadingController) {
    
  }
  ionViewWillLeave(){
    this.StopScanning();
  }
  ionViewWillEnter(){
    this.goToBarcodeScan();
    this.restCall.LoadTodayScannedBarcodes(this.restCall.currentuser.EmpCode).then(data => 
      {
        this.barcode = this.restCall.barcodes; 
        console.log(this.barcode)
        this.scanCount = this.restCall.barcodes.length;
      })
  }
  goToBarcodeScan() {
    let options = {
      x: 0,
      y: 50,
      width: window.screen.width,
      height: 300,
      camera: EmbeddedBarcodeReader.CAMERA_DIRECTION.BACK,
      toBack: false
    };
    EmbeddedBarcodeReader.startCamera(options);
    EmbeddedBarcodeReader.addBarcodeReadListener((readBarcode)=>{
      let loader = this.loadingController.create({
        content: "Loading.."
      });
      loader.present();
      console.log(readBarcode[0]);
      let scanData = {
        USERID: this.restCall.currentuser.EmpCode,
        BARCODE: readBarcode[0]
      }
      this.restCall.AddBarcode(scanData).then((data)=>{
        if(data == "Already Exist"){
          this.restCall.displayNotification("Barcode already Exist");
          loader.dismiss();
        }else{
          this.restCall.LoadTodayScannedBarcodes(this.restCall.currentuser.EmpCode).then(dataa => 
            {
              this.barcode = this.restCall.barcodes;  
              this.scanCount = this.restCall.barcodes.length;
              console.log(this.barcode)
              loader.dismiss();
          })
        }
        
      })
    });
  }
// Addbar(){
//   let scanData = {
//     USERID: this.restCall.currentuser.EmpCode,
//     BARCODE: "98765432"
//     // BARCODE: readBarcode[0]
//   }
//   this.restCall.AddBarcode(scanData).then((data)=>{
//     if(data == "Already Exist"){
//       this.restCall.displayNotification("Barcode already Exist");
//     }
//     this.restCall.LoadTodayScannedBarcodes(this.restCall.currentuser.EmpCode).then(dataa => {this.barcode = this.restCall.barcodes; console.log(this.barcode);this.scanCount = this.restCall.barcodes.length;})
//   })
// }

  SwitchCam(){
    EmbeddedBarcodeReader.switchCamera();
  }
  StopScanning(){
    EmbeddedBarcodeReader.stopCamera();
  }


}
