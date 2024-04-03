import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import User from '../../user';

@Component({
  selector: 'app-librarian-dashboard',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './librarian-dashboard.component.html',
  styleUrl: './librarian-dashboard.component.css',
})
export class LibrarianDashboardComponent implements OnInit {
  user: User | undefined;

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService
      .profileUser()
      .subscribe((user: User) => (this.user = user));
  }
}
