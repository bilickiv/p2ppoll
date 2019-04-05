import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { IndexPage } from '../pages/index/index';
import { QuestionListPage } from '../pages/question-list/question-list';
import { QuestionPage } from '../pages/question/question';
import { StatisticsPage } from '../pages/statistics/statistics';
import { SavedQuestionsPage } from '../pages/saved-questions/saved-questions';
import { TabsPage } from '../pages/tabs/tabs';
import { ProfilePage } from '../pages/profile/profile';
import { SettingsPage } from '../pages/settings/settings';
import { HotThemesPage } from '../pages/hot-themes/hot-themes';
import { MyQuestionsPage } from '../pages/my-questions/my-questions';
import { CategorieChoosePage } from '../pages/categorie-choose/categorie-choose';
import { NewQuestionPage } from '../pages/new-question/new-question';
import { QuestionCategorieChoosePage } from '../pages/question-categorie-choose/question-categorie-choose';
import { ProfileSettingsPage } from '../pages/profile-settings/profile-settings';
import { ThemeSettingsPage } from '../pages/theme-settings/theme-settings';
import { AllCountryPage } from '../pages/all-country/all-country';
import { TopPage } from '../pages/top/top';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { TagCloudModule } from 'angular-tag-cloud-module';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { ChartsModule } from 'ng2-charts';
import { HttpClientModule } from '@angular/common/http';

import firebase from 'firebase';
import { CONFIG } from './envrionment';

firebase.initializeApp(CONFIG);

@NgModule({
  declarations: [
    MyApp,
    IndexPage,
    QuestionListPage,
    QuestionPage,
    StatisticsPage,
    SavedQuestionsPage,
    TabsPage,
    ProfilePage,
    SettingsPage,
    HotThemesPage,
    MyQuestionsPage,
    CategorieChoosePage,
    NewQuestionPage,
    QuestionCategorieChoosePage,
    ProfileSettingsPage,
    ThemeSettingsPage,
    AllCountryPage,
    TopPage
  ],
  imports: [
    TagCloudModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    ChartsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(CONFIG)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    IndexPage,
    QuestionListPage,
    QuestionPage,
    StatisticsPage,
    SavedQuestionsPage,
    TabsPage,
    ProfilePage,
    SettingsPage,
    HotThemesPage,
    MyQuestionsPage,
    CategorieChoosePage,
    NewQuestionPage,
    QuestionCategorieChoosePage,
    ProfileSettingsPage,
    ThemeSettingsPage,
    AllCountryPage,
    TopPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}
