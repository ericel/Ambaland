import { ViewChild } from '@angular/core';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
//import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
// Do not import from 'firebase' as you'll lose the tree shaking benefits
import * as firebase from 'firebase/app';
import { AngularFireDatabase } from 'angularfire2/database';
import { Nav } from 'ionic-angular';
import { HomePage } from '../../pages/home/home';
/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {
  authState: any = null;
  @ViewChild('navCtrl') navCtrl: Nav;
    constructor(public http: Http, 
                private afAuth: AngularFireAuth,
                private db: AngularFireDatabase
                ) {
  
              this.afAuth.authState.subscribe((auth) => {
                this.authState = auth
              });
              
            }
  
    // Returns true if user is logged in
    get authenticated(): boolean {
      return this.authState !== null;
    }
  
    // Returns current user data
    get currentUser(): any {
      return this.authenticated ? this.authState : null;
    }
  
    // Returns
    get currentUserObservable(): any {
      return this.afAuth.authState
    }
  
    // Returns current user UID
    get currentUserId(): string {
      return this.authenticated ? this.authState.uid : '';
    }
  
    // Anonymous User
    get currentUserAnonymous(): boolean {
      return this.authenticated ? this.authState.isAnonymous : false
    }
  
    // Returns current user display name or Guest
    get currentUserDisplayName(): string {
      if (!this.authState) { return 'Guest' }
      else if (this.currentUserAnonymous) { return 'Anonymous' }
      else { return this.authState['displayName'] || 'User without a Name' }
    }
  
    //// Social Auth ////
  
    githubLogin() {
      const provider = new firebase.auth.GithubAuthProvider()
      return this.socialSignIn(provider);
    }
  
    googleLogin() {
      const provider = new firebase.auth.GoogleAuthProvider()
      return this.socialSignIn(provider);
    }
  
    facebookLogin() {
      const provider = new firebase.auth.FacebookAuthProvider()
      return this.socialSignIn(provider);
    }
  
    twitterLogin(){
      const provider = new firebase.auth.TwitterAuthProvider()
      return this.socialSignIn(provider);
    }
  
    private socialSignIn(provider: any) {
      return this.afAuth.auth.signInWithPopup(provider)
        .then((credential) =>  {
            this.authState = credential.user
            this.updateUserData()
        })
        .catch(error => console.log(error));
    }
  
  
    //// Anonymous Auth ////
  
    anonymousLogin() {
      return this.afAuth.auth.signInAnonymously()
      .then((user) => {
        this.authState = user
        this.updateUserData()
      })
      .catch(error => console.log(error));
    }
  
    //// Email/Password Auth ////
  
    emailSignUp(email:string, password:string) {
      return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
        .then((user) => {
          this.authState = user
          this.updateUserData()
        })
        .catch(error => console.log(error));
    }
  
    emailLogin(email:string, password:string) {
       return this.afAuth.auth.signInWithEmailAndPassword(email, password)
         .then((user) => {
           this.authState = user
           this.updateUserData()
         })
         .catch(error => console.log(error));
    }
  
    // Sends email allowing user to reset password
    resetPassword(email: string) {
      var auth = firebase.auth();
  
      return auth.sendPasswordResetEmail(email)
        .then(() => console.log("email sent"))
        .catch((error) => console.log(error))
    }
  
  
    //// Sign Out ////
   
    signOut(): firebase.Promise<any> {
      return this.afAuth.auth.signOut();

    }
  
  
    //// Helpers ////
  
    private updateUserData(): void {
    // Writes user name and email to realtime db
    // useful if your app displays information about users or for admin features
      //console.log(this.authState.displayName);
      let path = `users/${this.currentUserId}`; // Endpoint on firebase
      let data = {
                    email: this.authState.email,
                    name: this.authState.displayName
                  }
  
      this.db.object(path).update(data)
      .then(() => this.navCtrl.setPages([
        { page: HomePage }
      ]))
      .catch(error => console.log(error));
  
    }

   
}
