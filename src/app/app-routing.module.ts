import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
]

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {
        enableTracing: true,
        useHash: true
      }
    ),
  ],
  exports: [
    RouterModule
  ],
  providers: [
  ]
})

export class AppRoutingModule {}
