import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OneComponentComponent } from './one-component/one-component.component';
import {Routes, RouterModule} from '@angular/router'
import { TwoComponentComponent } from './two-component/two-component.component';
import { LoginComponent } from './login/login.component';
const routes: Routes=[
  {path:'one' ,component:OneComponentComponent},
  {path :'two',component:TwoComponentComponent},
  {path:'' ,component:LoginComponent}
]
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ]
  ,
  exports:[RouterModule]
})
export class AppRoutingModule { }
