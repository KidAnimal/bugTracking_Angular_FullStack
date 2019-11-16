import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ReportListComponent } from "./reports/report-list/report-list.component";
import { ReportCreateComponent } from "./reports/report-create/report-create.component";
import { AuthGuard } from "./auth/auth.guard";
import { ProjectListComponent } from "./projects/project-list/project-list.component";
import { TeamManagerComponent } from "./team-manager/team-manager.component";

const routes: Routes = [
  { path: "", component: ReportListComponent },
  { path: "create", component: ReportCreateComponent, canActivate: [AuthGuard] },
  { path: "edit/:postId", component: ReportCreateComponent, canActivate: [AuthGuard] },
  { path: "auth", loadChildren: "./auth/auth.module#AuthModule"},
  { path: "projects", component: ProjectListComponent },
  { path: "teamManager", component: TeamManagerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
