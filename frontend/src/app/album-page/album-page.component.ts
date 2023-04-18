// album-page.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { stickers } from '../stickers'; // Import stickers

@Component({
  selector: 'app-album-page',
  templateUrl: './album-page.component.html',
  styleUrls: ['./album-page.component.css'],
})
export class AlbumPageComponent implements OnInit {
  loggedIn: boolean = false;
  selectedSticker: string | null = null; 

  userAlbum: any[] = []; 

  constructor(private authService: AuthService) {} // Inject AuthService

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.loggedIn = !!user;
      if (user) {
        const uid = user.uid;
        console.log("uid:" + uid);

        // Call getUserData() to get user data from the API
        this.authService.getUserData(uid).subscribe(
          (userData) => {
            this.userAlbum = userData.album; // Update userAlbum with the data from API
            console.log("this.userAlbum:" + this.userAlbum);
          },
          (error) => {
            console.error("Error fetching user data:", error);
          }
        );
      }
    });
  }

  getStickerUrl(stickerName: string): string | undefined {
    const sticker = stickers.find((sticker) => sticker.name === stickerName);
    return sticker?.url;
  }

  selectSticker(stickerName: string): void {
    this.selectedSticker = stickerName;
  }

  deselectSticker(): void {
    this.selectedSticker = null;
  }
}
