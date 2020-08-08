import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RestcallsProvider } from '../../providers/restcalls/restcalls';
declare var EmbeddedBarcodeReader: any;
@Component({
  selector: 'page-barcodescanner',
  templateUrl: 'barcodescanner.html',
})
export class BarcodescannerPage {
  barcode: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public restCall: RestcallsProvider) {
    
  }
  ionViewWillEnter(){
    this.goToBarcodeScan();
    this.restCall.LoadTodayScannedBarcodes(this.restCall.currentuser.EmpCode).then(data => {this.barcode = this.restCall.barcodes; console.log(this.barcode)})
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
      console.log(readBarcode[0]);
      let scanData = {
        USERID: this.restCall.currentuser.EmpCode,
        BARCODE: readBarcode[0]
      }
      this.restCall.AddBarcode(scanData).then(()=>{
        this.restCall.LoadTodayScannedBarcodes(this.restCall.currentuser.EmpCode).then(data => {this.barcode = this.restCall.barcodes; console.log(this.barcode)})
      })
    });
  }
// Addbar(){
//   let scanData = {
//     USERID: this.restCall.currentuser.EmpCode,
//     BARCODE: "987654321"
//     // BARCODE: readBarcode[0]
//   }
//   this.restCall.AddBarcode(scanData).then(()=>{
//     this.restCall.LoadTodayScannedBarcodes(this.restCall.currentuser.EmpCode).then(data => {this.barcode = this.restCall.barcodes; console.log(this.barcode)})
//   })
// }



  SwitchCam(){
    EmbeddedBarcodeReader.switchCamera();
  }
  StopScanning(){
    EmbeddedBarcodeReader.stopCamera();
  }


}
