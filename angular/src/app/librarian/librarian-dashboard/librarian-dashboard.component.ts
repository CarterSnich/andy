import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AlertComponent } from '../../alert/alert.component';
import { AuthService } from '../../shared/auth.service';
import User from '../../user';

@Component({
  selector: 'app-librarian-dashboard',
  standalone: true,
  imports: [RouterModule, AlertComponent],
  templateUrl: './librarian-dashboard.component.html',
  styleUrl: './librarian-dashboard.component.css',
})
export class LibrarianDashboardComponent implements OnInit {
  user: User | undefined;
  errors: any;

  @ViewChild(AlertComponent) alertComponent!: AlertComponent;

  constructor(public router: Router, private authService: AuthService) {}

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
        this.alertComponent.addAlert('Failed to fetch user profile.', 'danger');
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
