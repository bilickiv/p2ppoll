import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CategorieChoosePage } from '../categorie-choose/categorie-choose';
import { ProfileSettingsPage } from '../profile-settings/profile-settings';
import { ThemeSettingsPage } from '../theme-settings/theme-settings';
import { AngularFireAuth } from '@angular/fire/auth';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public fire: AngularFireAuth) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }
  
  profileSettings(){
    this.navCtrl.push(ProfileSettingsPage);
  }

  categorieChoosen(){
    this.navCtrl.push(CategorieChoosePage);
  }

  themeColor(){
    this.navCtrl.push(ThemeSettingsPage);
  }

  logoutOfGoogle(){
    this.fire.auth.signOut();

  }

}
