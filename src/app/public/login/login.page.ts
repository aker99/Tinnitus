import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(private authService: AuthService, private router: Router) { }

  protected email: string;
  protected password: string;
  protected errorMessage: string;

  @ViewChild('LoginSlide', { static: true })  slides: IonSlides;

  ngOnInit() {
  }
  tryLogin() {
    console.log('tryLogin');
    this.authService.doLogin(this.email, this.password).then(res => {
      this.router.navigate(['page/home']);
    }, err => {
      console.log(err);
      this.errorMessage = err.message;
    });
  }

  swipeNext(){
    console.log("inside swipeNext")
    this.slides.slideNext();
  }
  swipePrev(){
    console.log("inside swipePrev")
    this.slides.slidePrev();
  }
}
