import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

import { AuthService } from "../auth/auth.service";
import { Report } from "../reports/Report";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  getUser: string;
  userName: string; 
  reports: Report[] = [];

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    if(localStorage.getItem("userName")) {
      this.getUser = localStorage.getItem("userName").replace(/\"/g, "");
      this.userName = this.getUser; 
    };
    if(this.userName){
      this.userName;
    }
    // this.userName = localStorage.getItem("userName").replace(/\"/g, "");
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userName = this.getUser;
      });
  }
  onLogin(){ 
    this.userName = this.getUser;
    console.log(this.userName);
  }
  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
