import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertComponent } from '../../alert/alert.component';
import BorrowedBook from '../../borrowed-book';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [CommonModule, AlertComponent],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css',
})
export class TransactionComponent implements OnInit {
  @ViewChild(AlertComponent) alertComponent!: AlertComponent;

  borrowedBooks: BorrowedBook[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    this.authService.profileUser().subscribe({
      error: (err) => {
        if (err.status == 401) {
          this.router.navigate(['']);
          return;
        }

        console.error(err);
      },
    });
    this.getBorrowedBooks();
  }

  getBorrowedBooks() {
    this.httpClient
      .get<BorrowedBook[]>('http://localhost:8000/api/borrowed-books/')
      .subscribe((borrowedBooks) => {
        this.borrowedBooks = borrowedBooks;
      });
  }

  approve(borrowedBook: BorrowedBook) {
    this.httpClient
      .patch(
        `http://localhost:8000/api/borrowed-books/${borrowedBook.id}/approve`,
        null
      )
      .subscribe({
        complete: () => {
          this.alertComponent.addAlert(`Pending borrow approved.`, 'success');
          this.getBorrowedBooks();
        },
        error: (err) => {
          console.error(err);

          let err_msg = '';
          if (err.error.message) {
            err_msg = ` ${err.error.message}`;
          }
          this.alertComponent.addAlert(
            `Failed to approve pending borrow.${err_msg}`,
            'danger'
          );
        },
      });
  }
}
