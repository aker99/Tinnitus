import { Component, NgZone } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [
    // {
    //   title: 'DashBoard',
    //   url: 'home',
    //   icon: 'home'
    // },
    {
      title: 'Chapters',
      url: 'chapters',
      icon: 'document'
    },
    {
      title: 'Settings',
      url: 'settings',
      icon: 'settings'
    }
  ];
  protected isLoggedIn: boolean;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private authService: AuthService,
    private ngZone: NgZone
  ) {
    firebase.auth().onIdTokenChanged((user) => {
      if (user) {
        console.log('loggedIn');
        this.isLoggedIn = true;
      } else {
      console.log('loggedOut');
      this.isLoggedIn = false;
      }
    });
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  tryLogout() {
    this.authService.doLogout().then(res => {
      this.ngZone.run(() => this.router.navigate(['']));
    }, err => {
      console.log(err);
    });
  }
}
