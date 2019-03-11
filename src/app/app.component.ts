import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, Events } from 'ionic-angular';
import { TabsPage } from '../pages/tabs/tabs';
import { ProfilePage } from '../pages/profile/profile';
import { SettingsPage } from '../pages/settings/settings';
import { MyQuestionsPage } from '../pages/my-questions/my-questions';
import { SavedQuestionsPage } from '../pages/saved-questions/saved-questions';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage = TabsPage;
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public storage: Storage,
    public event: Events
  ) {
    this.initializeApp();
    // set our app's pages
    this.pages = [
      { title: 'Profile', component: ProfilePage },
      { title: 'My Questions', component: MyQuestionsPage },
      { title: 'Saved Questions', component: SavedQuestionsPage },
      { title: 'Settings', component: SettingsPage },
    ];
    localStorage.removeItem('firebase:previous_websocket_failure');
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.statusBar.overlaysWebView(false);

      if(this.platform.is('android')){
        this.statusBar.backgroundColorByHexString('#000000');
        this.statusBar.styleBlackOpaque();
      }
    });
  }


  openPage(page) {
    this.menu.close();
    // navigate to the new page if it is not the current page
    console.log('open page');
    this.storage.set('animation', 0);
    this.nav.push(page.component);
  }
}
