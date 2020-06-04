import { HomePage } from '../pages/home/home';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FCM } from '@ionic-native/fcm';
import { HttpClient,HttpHeaders } from '@angular/common/http';


@Component({ 
  templateUrl: 'app.html'
}) 
export class MyApp {
  rootPage:any = "LoginPage"; 
 
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public http: HttpClient, private fcm: FCM) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      //Notifications
      fcm.subscribeToTopic('all');
      fcm.getToken().then(token=>{
          console.log(token);
      })
      fcm.onNotification().subscribe(data=>{
        if(data.wasTapped){
          console.log("Received in background");
        } else { 
          //alert("New Notification");
        };
      })
      fcm.onTokenRefresh().subscribe(token=>{
        console.log(token + "refreshtoken");
      });
      //end notifications.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  sendNotification() 
  {  
  let body = {
    "to" : "frPH2zPuyC8:APA91bF5MNPINigdHR4U94wHWBjZL4gzWYqE-rbNLBimPut2GWgEjHc77qu9C4qjgtju2aryjoHE5pWsiF6TGYA8ZYGEX_xA2oQxfU1ukzh5bNxTJZAv7dp8JM-vHOX5VwNDI_2JhJoh",
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
      headers: options.set('Authorization', 'key=AIzaSyBkWS9YTZ73M587MP2snHExdklalHC9hpo'),
    })
      .subscribe();
  }

}
