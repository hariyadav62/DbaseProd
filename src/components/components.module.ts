import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { TimechartComponent } from './timechart/timechart';
import { PiechartcompComponent } from './piechartcomp/piechartcomp';
import { CommonModule } from '@angular/common';
// import { DropdownComponent } from './dropdown/dropdown';  
@NgModule({
	declarations: [TimechartComponent,
    PiechartcompComponent], 
	imports: [CommonModule,IonicModule], 
	exports: [TimechartComponent,
    PiechartcompComponent]
})
export class ComponentsModule {}
