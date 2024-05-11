import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AlertComponent } from '../../alert/alert.component';
import BorrowedBook from '../../borrowed-book';
import { AuthService } from '../../shared/auth.service';
import User from '../../user';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [CommonModule, AlertComponent, RouterLink],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css',
})
export class TransactionComponent implements OnInit {
  @ViewChild(AlertComponent) alertComponent!: AlertComponent;

  user?: User;
  borrowedBooks: BorrowedBook[] = [];
  bookToReturn?: BorrowedBook;

  constructor(
    private authService: AuthService,
    private router: Router,
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    this.authService.profileUser().subscribe({
      next: (user) => {
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
    this.getBorrowedBooks();
  }

  getBorrowedBooks() {
    this.httpClient
      .get<BorrowedBook[]>('http://localhost:8000/api/borrowed-books/')
      .subscribe((borrowedBooks) => {
        this.borrowedBooks = borrowedBooks;
      });
  }

  clickReturn(bb: BorrowedBook) {
    this.bookToReturn = bb;
  }

  returnBook() {
    let bb = <BorrowedBook>this.bookToReturn;
    this.httpClient
      .patch(`http://localhost:8000/api/borrowed-books/${bb.id}/return`, null)
      .subscribe({
        complete: () => {
          this.alertComponent.addAlert(
            `Book returned successfully.`,
            'success'
          );
          this.getBorrowedBooks();
        },
        error: (err) => {
          console.error(err);

          let err_msg = '';
          if (err.error.message) {
            err_msg = ` ${err.error.message}`;
          }
          this.alertComponent.addAlert(
            `Failed to mark as returned.${err_msg}`,
            'danger'
          );
        },
      });
  }
}
