import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { NavController } from 'ionic-angular';

import { UserData } from '../../providers/user-data';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

import { UserOptions } from '../../interfaces/user-options';

import { TabsPage } from '../tabs-page/tabs-page';
import { SignupPage } from '../signup/signup';


@Component({
  selector: 'page-user',
  templateUrl: 'login.html'
})
export class LoginPage {
  login: UserOptions = { username: '', password: '' };
  submitted = false;

  constructor(public navCtrl: NavController, public userData: UserData, public authService: AuthServiceProvider) {
    console.log(this.authService.authenticated);
   }

  onLogin(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      this.userData.login(this.login.username);
      this.navCtrl.push(TabsPage);
    }
  }

  onSignup() {
    this.navCtrl.push(SignupPage);
  }
 
  private afterSignIn(): void {
    // Do after login stuff here, such router redirects, toast messages, etc.
    //this.router.navigate(['/']);
    console.log("logged in");
  }
  signInWithGithub(): void {
    this.authService.githubLogin()
    .then(() => this.afterSignIn());
  }

  signInWithGoogle(): void {
    this.authService.googleLogin()
      .then(() => this.afterSignIn());
  }

  signInWithFacebook(){
    this.authService.facebookLogin()
    .then(() => this.afterSignIn());
  }
}
