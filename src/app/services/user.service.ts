import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
   public db: AngularFirestore,
   public afAuth: AngularFireAuth
 ){
 }


  getCurrentUser(){
    return new Promise<any>((resolve, reject) => {
      var user = firebase.auth().onAuthStateChanged(function(user){
        if (user) {
          resolve(user);
        } else {
          reject('No user logged in');
        }
      })
    })
  }

  updateCurrentUser(value){
    return new Promise<any>((resolve, reject) => {
      var user = firebase.auth().currentUser;
      user.updateProfile({
        displayName: value.name,
        photoURL: user.photoURL
      }).then(res => {
        resolve(res);
      }, err => reject(err))
    })
  }

  doUpdatePassword(user,opass: string,npass: string){
    const credentials = firebase.auth.EmailAuthProvider.credential(
      user.email, opass);
    return user.reauthenticateWithCredential(credentials)
    .then( () => user.updatePassword(npass))
    .then(() => 'Your password has been changed!!!')
    .catch( err => err.message);
  }

  doPasswordReset(email) {
    return firebase.auth().sendPasswordResetEmail(email)
    .then(()=> 'A password reset link has been sent to your email.')
    .catch(err => err.message);
  }
}

