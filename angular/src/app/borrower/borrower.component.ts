import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';

import { Router } from '@angular/router';
import { AlertComponent } from '../alert/alert.component';
import Book from '../book';
import { AuthService } from '../shared/auth.service';
import User from '../user';
import { GenerateQrPipe } from './generate-qr.pipe';

interface Page {
  current_page: number;
  data: Book[];
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, GenerateQrPipe, AlertComponent],
  templateUrl: './borrower.component.html',
  styleUrl: './borrower.component.css',
})
export class BorrowerComponent implements OnInit {
  @ViewChild(AlertComponent) alertComponent!: AlertComponent;

  page: Page | undefined;
  books: Book[] = [];
  user: User | undefined;

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private router: Router
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

    this.authService.profileUser().subscribe((user) => (this.user = user));
    this.getBooks();
  }

  getBooks() {
    this.httpClient
      .get<Page>('http://localhost:8000/api/books?page=1')
      .subscribe((page) => {
        this.page = page;
        this.books = page.data;
      });
  }

  array(n: number) {
    return new Array(n);
  }

  onEnter(event: any) {
    event.target.children[0].classList.remove('d-none');
    event.target.children[1].classList.add('invisible');
  }

  onLeave(event: any) {
    event.target.children[0].classList.add('d-none');
    event.target.children[1].classList.remove('invisible');
  }

  borrowBook(book: Book) {
    this.httpClient
      .post(`http://localhost:8000/api/borrowed-books/borrow/${book.id}`, book)
      .subscribe({
        complete: () => {
          this.alertComponent.addAlert(
            `Book borrowed successfully.`,
            'success'
          );
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

  logout() {
    this.authService.signout().subscribe({
      complete: () => {
        this.router.navigate(['']);
      },
    });
  }
}
