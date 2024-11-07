import { HomePage } from '../pages/home/home';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
// import { FCM } from '@ionic-native/fcm';
import { HttpClient,HttpHeaders } from '@angular/common/http';


@Component({ 
  templateUrl: 'app.html'
}) 
export class MyApp {
  rootPage:any = "LoginPage"; 
  // rootPage:any = "WorkstatusPage"; 

 
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public http: HttpClient) {
    platform.ready().then(() => {
      //Notifications
      // fcm.subscribeToTopic('all');
      // fcm.getToken().then(token=>{
      //     console.log(token);
      // })
      // fcm.onNotification().subscribe(data=>{
      //   if(data.wasTapped){
      //     console.log("Received in background");
      //   } else { 
      //     //alert("New Notification");
      //   };
      // })
      // fcm.onTokenRefresh().subscribe(token=>{
      //   console.log(token + "refreshtoken");
      // });
      //end notifications.
      splashScreen.hide();
      statusBar.overlaysWebView( false );
      statusBar.backgroundColorByHexString('#00000000');
      statusBar.styleLightContent();
    });
  }

  sendNotification() 
  {  
  let body = {
    "to" : "",
      "notification":{
        "title":"New Notification has arrived",
        "body":"Notification Body",
        "sound":"default",
        "click_action":"FCM_PLUGIN_ACTIVITY",
        "icon":"fcm_push_icon"
      },
      "data":{
        "param1":"value1",
        "param2":"value2"
      },
        "priority":"high",
        "restricted_package_name":""
    }
    let options = new HttpHeaders().set('Content-Type','application/json');
    this.http.post("https://fcm.googleapis.com/fcm/send",body,{
      headers: options.set('Authorization', 'key='),
    })
      .subscribe();
  }

}
