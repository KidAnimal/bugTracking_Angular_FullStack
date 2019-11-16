import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from "@angular/common/http";
import { User } from '../auth/user.model';
import { NgModel, FormsModule } from '@angular/forms';
import { SearchFilterPipe } from '../search-filter.pipe';

const BACKEND_URL = environment.apiUrl;

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  //Search By User, Report, or Both
  userURL: string = BACKEND_URL + "/user";
  usersArray: any[] = [];
  searchFilter: SearchFilterPipe;

  constructor(private http: HttpClient) {
    this.http.get<any[]>(this.userURL).subscribe(data => {
      // Populating usersArray with names from API
      data.forEach(element => {
        this.usersArray.push(element.userName);
      })  
    });
  };

  ngOnInit() {
  }

}
