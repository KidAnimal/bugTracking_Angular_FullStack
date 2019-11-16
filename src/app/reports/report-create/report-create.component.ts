import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";

import { ReportsService } from "../reports.service";
import { Report } from "../Report";
import { mimeType } from "./mime-type.validator";
import { AuthService } from "../../auth/auth.service";
import { Status } from '../status.model';
import { Assignee } from '../assignee.model';

@Component({
  selector: "app-report-create",
  templateUrl: "./report-create.component.html",
  styleUrls: ["./report-create.component.css"]
})
export class ReportCreateComponent implements OnInit, OnDestroy {

  bugStatus: Status[];
  private users:any;
  selectedStatus:any; 
  private assignees: Assignee[] = [];
  enteredTitle = "";
  enteredContent = "";
  report: Report;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = "create";
  private reportId: string;
  private authStatusSub: Subscription;
  // private currentUser: string = new User; 

  constructor(
    public reportsService: ReportsService,
    public route: ActivatedRoute,
    private authService: AuthService,
  ) {}

  ngOnInit() {
  this.authService.getUsers().subscribe((data:any[])=>{
        for(let i=0; i<data.length;i++){
          this.assignees.push({value:JSON.stringify(data[i]).replace(/[{}]/g,""),viewValue: JSON.stringify(data[i]).replace(/username/i,"")});
        } 
      });
      // this.http.get<any[]>(this.userURL).subscribe(data => {
      //   // Populating usersArray with names from API
      //   data.forEach(element => {
      //     this.assignees.push(element.userName);
      //     console.log(this.assignees)
      //   });
      // })

    this.bugStatus = [
      { value: 'To-Do', viewValue:'To-Do' },
      { value: 'In Progress', viewValue:'In Progress' },
      { value: 'Completed', viewValue:'Done' }
    ]; 

  this.selectedStatus = "todo";


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
      creatorId: new FormControl(null),
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
            creatorId: reportData.creatorId,
            userName: reportData.userName,
            assignee: reportData.assignee,
            bugStatus: reportData.bugStatus 
          };
          this.form.setValue({
            title: this.report.title,
            summary: this.report.summary,
            image: this.report.imagePath,
            creatorId: this.report.creatorId,
            userName: this.report.userName,
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
        this.form.value.creatorId,
        this.form.value.userName,
        this.form.value.assignee,
        this.form.value.bugStatus 
      );
    } else {
      this.reportsService.updateReport(
        this.reportId,
        this.form.value.title,
        this.form.value.summary,
        this.form.value.image,
        this.form.value.creatorId,
        this.form.value.userName,
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
