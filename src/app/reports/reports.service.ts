import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { environment } from "../../environments/environment";
import { Report } from "./Report";
import { createTokenForReference } from "@angular/compiler/src/identifiers";

const BACKEND_URL = environment.apiUrl + "/reports/";

@Injectable({ providedIn: "root" })
export class ReportsService {
  private reports: Report[] = [];
  private reportsUpdated = new Subject<{ reports: Report[]; reportCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getReports(reportsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${reportsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; reports: any; maxReports: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(reportData => {
          return {
            reports: reportData.reports.map(report => {
              return {
                title: report.title,
                summary: report.summary,
                id: report._id,
                imagePath: report.imagePath,
                creator: report.creator,
                assignee: report.assignee,
                bugStatus: report.bugStatus
              };
            }),
            maxReports: reportData.maxReports
          };
        })
      )
      .subscribe(transformedReportData => {
        this.reports = transformedReportData.reports;
        this.reportsUpdated.next({
          reports: [...this.reports],
          reportCount: transformedReportData.maxReports
        });
      });
  }

  getReportUpdateListener() {
    return this.reportsUpdated.asObservable();
  }

  getReport(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      summary: string;
      imagePath: string;
      creator: string;
      assignee: string;
      bugStatus: string;
    }>(BACKEND_URL + id);
  }

  addReport(title: string, summary: string, image: File, creator: string, assignee: string, bugStatus: string) {
    const reportData = new FormData();
    reportData.append("title", title);
    reportData.append("summary", summary);
    reportData.append("image", image, title);
    reportData.append("creator", creator);
    reportData.append("assignee", assignee);
    reportData.append("bugStatus", bugStatus);

    this.http
      .post<{ message: string; report: Report }>(
        BACKEND_URL,
        reportData
      )
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }

  updateReport(id: string, title: string, summary: string, image: File | string, creator: string, assignee: string, bugStatus: string) {
    let reportData: Report | FormData;
    if (typeof image === "object") {
      reportData = new FormData();
      reportData.append("id", id);
      reportData.append("title", title);
      reportData.append("summary", summary);
      reportData.append("image", image, title);
      reportData.append("creator", creator);
      reportData.append("assignee", assignee);
      reportData.append("bugStatus", bugStatus);
      
    } else {
      reportData = {
        id: id,
        title: title,
        summary: summary,
        imagePath: image,
        assignee: assignee,
        creator: creator, 
        bugStatus: bugStatus 
      };
    }
    this.http
      .put(BACKEND_URL + id, reportData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }

  deleteReport(reportId: string) {
    return this.http.delete(BACKEND_URL + reportId);
  }
}
