import { Component } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})


export class Tab2Page {
  items = [ 
    {id:1, avatarImage:"https://www.google.com/url?sa=i&source=images&cd=&ved=2ahUKEwis_dXS-OPlAhVqUN8KHUPABRkQjRx6BAgBEAQ&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fhuman&psig=AOvVaw09sVO8P0gDvlUaGANPYKkB&ust=1573623003240944"},
    {id:2, avatarImage:"https://www.google.com/url?sa=i&source=images&cd=&ved=2ahUKEwis_dXS-OPlAhVqUN8KHUPABRkQjRx6BAgBEAQ&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fhuman&psig=AOvVaw09sVO8P0gDvlUaGANPYKkB&ust=1573623003240944"},
    {id:3, avatarImage:"https://www.google.com/url?sa=i&source=images&cd=&ved=2ahUKEwis_dXS-OPlAhVqUN8KHUPABRkQjRx6BAgBEAQ&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fhuman&psig=AOvVaw09sVO8P0gDvlUaGANPYKkB&ust=1573623003240944"},
  ];
  
  constructor() {}

}
