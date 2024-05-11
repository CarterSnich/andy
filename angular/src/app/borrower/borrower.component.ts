import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AlertComponent } from '../alert/alert.component';
import Book from '../book';
import Page from '../pagination';
import { AuthService } from '../shared/auth.service';
import User from '../user';
import { GenerateQrPipe } from './generate-qr.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    GenerateQrPipe,
    AlertComponent,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './borrower.component.html',
  styleUrl: './borrower.component.css',
})
export class BorrowerComponent implements OnInit {
  @ViewChild(AlertComponent) alertComponent!: AlertComponent;

  page: Page | undefined;
  books: Book[] = [];
  user: User | undefined;
  isFetchingBooks = false;

  bookToBorrow?: Book;
  bookQuantity = 1;

  options = {
    root: document.querySelector('#scrollable'),
    rootMargin: '0px',
    threshold: 0.5,
  };

  observer = new IntersectionObserver((entries, observer) => {
    this.getBooks();
  }, this.options);

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.observer.observe(<HTMLElement>document.querySelector('#target'));
    this.authService.profileUser().subscribe({
      error: (err) => {
        if (err.status == 401) {
          this.router.navigate(['']);
          return;
        }

        console.error(err);
      },
    });

    this.authService.profileUser().subscribe((user) => (this.user = user));
    // this.getBooks();
  }

  getBooks() {
    console.log('fetching');
    if (this.isFetchingBooks) {
      console.log('already fetching');
      return;
    }
    this.isFetchingBooks = true;

    let current_page = this.page ? this.page.current_page : 0;

    this.httpClient
      .get<Page>(`http://localhost:8000/api/books?page=${current_page + 1}`)
      .subscribe({
        next: (page) => {
          this.page = page;
          this.books.push(...page.data);
        },
        complete: () => {
          this.isFetchingBooks = false;
          console.log('done fetching');
        },
        error(err) {},
      });
  }

  array(n: number) {
    return new Array(n);
  }

  borrowBook() {
    const url = `http://localhost:8000/api/borrowed-books/borrow/${this.bookToBorrow?.id}`;
    const body = { quantity: this.bookQuantity };

    this.httpClient.post(url, body).subscribe({
      complete: () => {
        this.alertComponent.addAlert(`Book borrowed successfully.`, 'success');
      },
      error: (err) => {
        console.error(err);

        let err_msg = '';
        if (err.error.message) {
          err_msg = ` ${err.error.message}`;
        }
        this.alertComponent.addAlert(
          `Failed to borrow book.${err_msg}`,
          'danger'
        );
      },
    });
  }

  clickBook(book: Book) {
    this.bookToBorrow = book;
  }

  logout() {
    this.authService.signout().subscribe({
      complete: () => {
        this.router.navigate(['']);
      },
    });
  }
}
