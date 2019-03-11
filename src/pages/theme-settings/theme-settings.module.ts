import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ThemeSettingsPage } from './theme-settings';

@NgModule({
  declarations: [
    ThemeSettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(ThemeSettingsPage),
  ],
})
export class ThemeSettingsPageModule {}
