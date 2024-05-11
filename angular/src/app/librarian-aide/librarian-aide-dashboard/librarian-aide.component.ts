import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import User from '../../user';

@Component({
  selector: 'app-librarian-aide',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './librarian-aide.component.html',
  styleUrl: './librarian-aide.component.css',
})
export class LibrarianAideComponent implements OnInit {
  user: User | undefined;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.profileUser().subscribe({
      next: (user: User) => {
        this.user = user;
      },
      error: (err) => {
        if (err.status == 401) {
          this.router.navigate(['']);
          return;
        }
        console.error(err);
      },
    });
  }

  logout() {
    this.authService.signout().subscribe({
      complete: () => {
        this.router.navigate(['']);
      },
    });
  }
}
