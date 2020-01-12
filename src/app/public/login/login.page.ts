import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { IonSlides, Events } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(private authService: AuthService, private router: Router, private events: Events, private userService: UserService, private ngZone: NgZone) { }

  protected email: string;
  protected password: string;
  protected errorMessage: string;
  protected pageTitle: string;
  protected passReset: boolean;
  @ViewChild('LoginSlide', { static: false })  slides: IonSlides;

  ngOnInit() {}

  tryLogin() {
    console.log('tryLogin');
    this.authService.doLogin(this.email, this.password).then(res => {
      this.ngZone.run(() => this.router.navigate(['home']));
      this.errorMessage = null;
    }, err => {
      console.log(err);
      this.errorMessage = err.message;
    });
  }

  tryResetPassword() {
    this.userService.doPasswordReset(this.email)
    .then((data) => {
      this.errorMessage = data;
      this.passResetCheckToggle();
    });
  }
  passResetCheckToggle() {
    this.passReset = !this.passReset;
    if (this.passReset) {
    this.errorMessage = 'Enter your email';
    }
  }

}
