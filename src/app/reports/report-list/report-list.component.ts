import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material";
import { Subscription } from "rxjs";

import { Report } from "../Report";
import { ReportsService } from "../reports.service";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: "app-report-list",
  templateUrl: "./report-list.component.html",
  styleUrls: ["./report-list.component.css"]
})
export class ReportListComponent implements OnInit, OnDestroy {
  reports: Report[] = [];
  isLoading = false;
  totalReports = 0;
  reportsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  userName: string;
  private reportsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public reportsService: ReportsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.reportsService.getReports(this.reportsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.userName = this.authService.getUserName();

    this.reportsSub = this.reportsService
      .getReportUpdateListener()
      .subscribe((reportData: { reports: Report[]; reportCount: number }) => {
        this.isLoading = false;
        this.totalReports = reportData.reportCount;
        this.reports = reportData.reports;
        console.log(this.reports);
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
        this.userName = this.authService.getUserName();
        console.log("user ID: " + this.userId);
        console.log("user Name: " + this.userName);
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.reportsPerPage = pageData.pageSize;
    this.reportsService.getReports(this.reportsPerPage, this.currentPage);
  }

  onDelete(reportId: string) {
    this.isLoading = true;
    this.reportsService.deleteReport(reportId).subscribe(() => {
      this.reportsService.getReports(this.reportsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.reportsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
