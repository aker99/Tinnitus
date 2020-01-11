import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  constructor(private userService: UserService, private toastController: ToastController) {
    this.userService.getCurrentUser().then((user) => this.user = user);
  }

  protected user = {};
  protected passwordToggle = false;
  protected oldpass: string;
  protected newpass: string;
  protected newpasscn: string;
  protected passRestMsg: string;

  ngOnInit() {
  }
  async presentToast() {
    const toast = await this.toastController.create({
     message: this.passRestMsg,
     color: 'warning',
     duration: 4000
   });
    toast.present();
    this.passRestMsg = null;
 }

 passwordToggleFunc() {
   this.passwordToggle = !this.passwordToggle;
 }

 updatePassword() {
   if (this.newpass !== this.newpasscn) {
     this.passRestMsg = 'New Password and Confirmation Password doesn\'t match.';
     this.presentToast();
     return;
   }
   this.userService.doUpdatePassword(this.user, this.oldpass, this.newpass)
   .then( data => this.passRestMsg = data)
   .finally(
     () => {
       this.presentToast();
       this.oldpass = null;
       this.newpass = null;
       this.newpasscn = null;
     }
   );
 }
}
