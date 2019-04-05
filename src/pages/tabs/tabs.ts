import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { IndexPage } from '../index/index';
import { HotThemesPage } from '../hot-themes/hot-themes';
import { TopPage } from '../top/top';

import { Storage } from '@ionic/storage';

/**
 * Generated class for the TabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tab1Root = HotThemesPage;
  tab2Root = IndexPage;
  tab3Root = TopPage;

  theme: string;
 
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {
  }

  ionViewWillEnter(){
   
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }
  

}
