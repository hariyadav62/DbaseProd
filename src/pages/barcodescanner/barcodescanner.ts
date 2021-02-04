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
  bundleNumber:number;
  scannerId: any;
  bundlecount: any;
  readBarcode= 2525252;
  constructor(public navCtrl: NavController, public navParams: NavParams, public restCall: RestcallsProvider, public loadingController: LoadingController) {
    
  }
  ionViewWillLeave(){
    if(this.restCall.barcodeAdmin){
      this.restCall.barcodeAdmin = false;
    }else{
      this.StopScanning();
    }
  }
  async ionViewWillEnter(){
    if(this.restCall.barcodeAdmin){
      let loader = this.loadingController.create({
        content: "Getting Admin Data.."
      });
      loader.present();
      if(this.restCall.selectedUniversity == "BRAU"){
        this.restCall.BarcodeAdminTable_brau().then(()=> loader.dismiss()).catch(()=>loader.dismiss());
      }else{
        this.restCall.BarcodeAdminTable().then(()=> loader.dismiss()).catch(()=>loader.dismiss());
      }
    }else{
      this.restCall.storage.get('scannerId').then(async (scannerId) => {
      if (scannerId != null && scannerId != undefined) {
        this.scannerId = scannerId;
        this.goToBarcodeScan();
        if(this.restCall.selectedUniversity == "BRAU"){
          await this.restCall.AssignBarcodeBundle_brau(scannerId,this.restCall.selectedCourseType).then((data)=>{
            this.bundleNumber = this.restCall.bundleId;
          });
        }else{
          await this.restCall.AssignBarcodeBundle(scannerId,this.restCall.selectedCourseType).then((data)=>{
            this.bundleNumber = this.restCall.bundleId;
          });
        }
        this.restCall.GetBundleCount(this.bundleNumber,this.restCall.selectedCourseType,this.restCall.selectedUniversity).then(data=>this.bundlecount = this.restCall.bundleCount);
        if(this.restCall.selectedUniversity == "BRAU"){
          this.restCall.LoadTodayScannedBarcodes_brau(this.bundleNumber,this.restCall.selectedCourseType).then(data => 
          {
            this.barcode = this.restCall.barcodes; 
            console.log(this.barcode);
            this.scanCount = this.restCall.barcodes.length;
          })
        }else{
          this.restCall.LoadTodayScannedBarcodes(this.bundleNumber,this.restCall.selectedCourseType).then(data => 
            {
              this.barcode = this.restCall.barcodes; 
              console.log(this.barcode);
              this.scanCount = this.restCall.barcodes.length;
            })
        }
      }
      });
    }
    
    
  }
  // scan(){
  //   this.readBarcode = this.readBarcode + 1;
  //   if((''+this.readBarcode).length == 7){
  //     // EmbeddedBarcodeReader.stopCamera();
  //     let loader = this.loadingController.create({
  //       content: "Loading.."
  //     });
  //     loader.present();
  //     console.log(this.readBarcode);
  //     let scanData = {
  //       USERID: this.scannerId,
  //       BARCODE: this.readBarcode,
  //       BUNDLEID: this.bundleNumber,
  //       COURSENAME: null,
  //       COURSETYPE: this.restCall.selectedCourseType
  //     }
  //     if(this.bundleNumber != null && this.bundleNumber != undefined){
  //       if(this.restCall.selectedUniversity == "BRAU"){
  //         this.restCall.AddBarcode_brau(scanData).then((data)=>{
  //           if(data == "Already Exist"){
  //             this.restCall.displayNotification("Barcode already Exist");
  //             loader.dismiss();
              
  //           }else if(data == "Bundle Complete"){
  //             alert("Bundle Complete with "+ this.readBarcode);
  //             this.restCall.AssignBarcodeBundle_brau(scanData.USERID,this.restCall.selectedCourseType).then((data)=>{
  //               this.bundleNumber = this.restCall.bundleId;
  //               loader.dismiss();
                
  //             });
  //           }
  //           else{
  //             this.restCall.LoadTodayScannedBarcodes_brau(this.bundleNumber,this.restCall.selectedCourseType).then(dataa => 
  //               {
  //                 console.log(this.restCall.bundleCount);
  //                 this.restCall.GetBundleCount(this.bundleNumber,this.restCall.selectedCourseType,this.restCall.selectedUniversity)
  //                 .then(()=>{
  //                   console.log(this.restCall.bundleCount,this.bundlecount);
  //                   this.bundlecount = this.restCall.bundleCount;
  //                   console.log(this.restCall.bundleCount,this.bundlecount);
  //                 });
  //                 this.barcode = this.restCall.barcodes;  
  //                 loader.dismiss();
                  
  //             })
  //           }
            
  //         })
  //       }else{
  //         this.restCall.AddBarcode(scanData).then((data)=>{
  //           if(data == "Already Exist"){
  //             this.restCall.displayNotification("Barcode already Exist");
  //             loader.dismiss();
              
  //           }else if(data == "Bundle Complete"){
  //             alert("Bundle Complete with "+ this.readBarcode);
  //             this.restCall.AssignBarcodeBundle(scanData.USERID,this.restCall.selectedCourseType).then((data)=>{
  //               this.bundleNumber = this.restCall.bundleId;
  //               loader.dismiss();
                
  //             });
  //           }
  //           else{
  //             this.restCall.LoadTodayScannedBarcodes(this.bundleNumber,this.restCall.selectedCourseType).then(dataa => 
  //               {
  //                 this.restCall.GetBundleCount(this.bundleNumber,this.restCall.selectedCourseType,this.restCall.selectedUniversity).then(data=>this.bundlecount = this.restCall.bundleCount);
  //                 this.barcode = this.restCall.barcodes;  
  //                 loader.dismiss();
                  
  //             })
  //           }
            
  //         })
  //       }
        
  //     }else{
  //       loader.dismiss();
  //       alert("Please enter Bundle Number");
  //      // EmbeddedBarcodeReader.startCamera(options);
  //     }
  //   }
  //   else{
  //     console.log("length is greater than 7")
  //   }
  // }
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
      if((''+readBarcode[0]).length == 8){
      EmbeddedBarcodeReader.stopCamera();
      let loader = this.loadingController.create({
        content: "Loading.."
      });
      loader.present();
      console.log(readBarcode[0]);
      let scanData = {
        USERID: this.scannerId,
        BARCODE: readBarcode[0],
        BUNDLEID: this.bundleNumber,
        COURSENAME: null,
        COURSETYPE: this.restCall.selectedCourseType
      }
      if(this.bundleNumber != null && this.bundleNumber != undefined){
        if(this.restCall.selectedUniversity == "BRAU"){
          this.restCall.AddBarcode_brau(scanData).then((data)=>{
            if(data == "Already Exist"){
              this.restCall.displayNotification("Barcode already Exist");
              loader.dismiss();
              this.goToBarcodeScan();
            }else if(data == "Bundle Complete"){
              alert("Bundle Complete with "+ readBarcode[0]);
              this.restCall.AssignBarcodeBundle_brau(scanData.USERID,this.restCall.selectedCourseType).then((data)=>{
                this.bundleNumber = this.restCall.bundleId;
                loader.dismiss();
                this.goToBarcodeScan();
              });
            }
            else{
              this.restCall.LoadTodayScannedBarcodes_brau(this.bundleNumber,this.restCall.selectedCourseType).then(dataa => 
                {
                  this.restCall.GetBundleCount(this.bundleNumber,this.restCall.selectedCourseType,this.restCall.selectedUniversity).then(()=>{
                    console.log(this.restCall.bundleCount);
                    this.bundlecount = this.restCall.bundleCount;
                    console.log(this.bundlecount);
                  });
                  this.barcode = this.restCall.barcodes;  
                  loader.dismiss();
                  this.goToBarcodeScan();
              })
            }
            
          })
        }else{
          this.restCall.AddBarcode(scanData).then((data)=>{
            if(data == "Already Exist"){
              this.restCall.displayNotification("Barcode already Exist");
              loader.dismiss();
              this.goToBarcodeScan();
            }else if(data == "Bundle Complete"){
              alert("Bundle Complete with "+ readBarcode[0]);
              this.restCall.AssignBarcodeBundle(scanData.USERID,this.restCall.selectedCourseType).then((data)=>{
                this.bundleNumber = this.restCall.bundleId;
                loader.dismiss();
                this.goToBarcodeScan();
              });
            }
            else{
              this.restCall.LoadTodayScannedBarcodes(this.bundleNumber,this.restCall.selectedCourseType).then(dataa => 
                {
                  this.restCall.GetBundleCount(this.bundleNumber,this.restCall.selectedCourseType,this.restCall.selectedUniversity).then(()=>{
                    console.log(this.restCall.bundleCount);
                    this.bundlecount = this.restCall.bundleCount;
                    console.log(this.bundlecount);
                  });
                  this.barcode = this.restCall.barcodes;  
                  loader.dismiss();
                  this.goToBarcodeScan();
              })
            }
            
          })
        }
        
      }else{
        loader.dismiss();
        alert("Please enter Bundle Number");
        EmbeddedBarcodeReader.startCamera(options);
      }
    }
    else{
      console.log("length is greater than 7")
    }
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
