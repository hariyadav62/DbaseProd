import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmployeelistPage } from './employeelist';

@NgModule({
  declarations: [
    EmployeelistPage,
  ],
  imports: [
    IonicPageModule.forChild(EmployeelistPage),
  ],
})
export class EmployeelistPageModule {}
