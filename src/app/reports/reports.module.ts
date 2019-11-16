import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { ReportCreateComponent } from "./report-create/report-create.component";
import { ReportListComponent } from "./report-list/report-list.component";
import { AngularMaterialModule } from "../angular-material.module";

@NgModule({
  declarations: [
    ReportCreateComponent, 
    ReportListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})
export class ReportsModule {}
