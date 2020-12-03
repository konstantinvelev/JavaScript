import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'src/app/shared/interfaces';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  get currentUser(): IUser {
    return this.userService.currentUser;
  }

  isInEditMode = false;
  constructor(
    private userService: UserService,
    private router: Router) { }

  ngOnInit(): void {
  }

  toggleEditMode(): void {
    this.isInEditMode = !this.isInEditMode;
  }

  submitFormHandler(data: any): void {
    this.userService.updateProfile(data).subscribe({
      next: () => {
        this.isInEditMode = false;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
