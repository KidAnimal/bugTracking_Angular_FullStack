import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";

import { ReportsService } from "../reports.service";
import { Report } from "../Report";
import { mimeType } from "./mime-type.validator";
import { AuthService } from "../../auth/auth.service";
import { Status } from '../status.model';

@Component({
  selector: "app-report-create",
  templateUrl: "./report-create.component.html",
  styleUrls: ["./report-create.component.css"]
})
export class ReportCreateComponent implements OnInit, OnDestroy {

  bugStatus: Status[] = [
    { value: 'todo', viewValue:'To-Do' },
    { value: 'progress', viewValue:'In Progress' },
    { value: 'completed', viewValue:'Done' }
  ];
  enteredTitle = "";
  enteredContent = "";
  report: Report;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = "create";
  private reportId: string;
  private authStatusSub: Subscription;

  constructor(
    public reportsService: ReportsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      summary: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
      creator: new FormControl(null),
      userName: new FormControl(null),
      assignee: new FormControl(null),
      bugStatus: new FormControl(null),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("reportId")) {
        this.mode = "edit";
        this.reportId = paramMap.get("reportId");
        this.isLoading = true;
        this.reportsService.getReport(this.reportId).subscribe(reportData => {
          this.isLoading = false;
          this.report = {
            id: reportData._id,
            title: reportData.title,
            summary: reportData.summary,
            imagePath: reportData.imagePath,
            creator: reportData.creator,
            assignee: reportData.assignee,
            bugStatus: reportData.bugStatus 
          };
          this.form.setValue({
            title: this.report.title,
            summary: this.report.summary,
            image: this.report.imagePath,
            creator: this.report.creator,
            assignee: this.report.assignee,
            bugStatus: this.report.bugStatus 
          });
        });
      } else {
        this.mode = "create";
        this.reportId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSaveReport() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.reportsService.addReport(
        this.form.value.title,
        this.form.value.summary,
        this.form.value.image,
        this.form.value.creator,
        this.form.value.assignee,
        this.form.value.bugStatus 
      );
    } else {
      this.reportsService.updateReport(
        this.reportId,
        this.form.value.title,
        this.form.value.summary,
        this.form.value.image,
        this.form.value.creator,
        this.form.value.assignee,
        this.form.value.bugStatus 
      );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
