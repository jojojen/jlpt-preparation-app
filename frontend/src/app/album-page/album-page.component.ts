// album-page.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-album-page',
  templateUrl: './album-page.component.html',
  styleUrls: ['./album-page.component.css'],
})
export class AlbumPageComponent implements OnInit {
  loggedIn: boolean = false;

  constructor(private authService: AuthService) {} // Inject AuthService

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.loggedIn = !!user;
    });
  }
}
