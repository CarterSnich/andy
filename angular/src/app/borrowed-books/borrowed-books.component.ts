import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AlertComponent } from '../alert/alert.component';
import BorrowedBook from '../borrowed-book';
import { AuthService } from '../shared/auth.service';
import User from '../user';

@Component({
  selector: 'app-borrowed-books',
  standalone: true,
  imports: [AlertComponent, CommonModule, RouterLink],
  templateUrl: './borrowed-books.component.html',
  styleUrl: './borrowed-books.component.css',
})
export class BorrowedBooksComponent implements OnInit {
  @ViewChild(AlertComponent) alertComponent!: AlertComponent;

  user?: User;
  borrowedBooks: BorrowedBook[] = [];

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.profileUser().subscribe({
      next: (user) => (this.user = user),
      error: (err) => {
        if (err.status == 401) {
          this.router.navigate(['/']);
        }

        console.error(err);
      },
    });

    this.getBorrowedBooks();
  }

  getBorrowedBooks() {
    this.httpClient
      .get<BorrowedBook[]>('http://localhost:8000/api/borrowed-books/user')
      .subscribe({
        next: (borrowedBooks) => {
          this.borrowedBooks = borrowedBooks;
        },
        error: (err) => {
          console.error(err);

          let err_msg = '';
          if (err.error.message) {
            err_msg = ` ${err.error.message}`;
          }
          this.alertComponent.addAlert(
            `Failed to fetch borrowed books.${err_msg}`,
            'danger'
          );
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
