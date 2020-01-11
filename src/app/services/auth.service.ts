import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { UserService } from './user.service';
import { resolve } from 'url';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth,
    private userService: UserService
  ) {}

  doLogin(email,password) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(email, password)
      .then(res => {
        resolve(res);
      }, err => reject(err));
    });
  }

  doLogout() {
    return new Promise((resolve, reject) => {
      if (firebase.auth().currentUser) {
        this.afAuth.auth.signOut();
        resolve();
      } else {
        reject();
      }
    });
  }

  doPasswordReset(email) {
    return firebase.auth().sendPasswordResetEmail(email)
    .then(()=> 'A password reset link has been sent to your email.')
    .catch(err => err.message);
  }
}
