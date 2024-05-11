import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AlertComponent } from '../../alert/alert.component';
import Book from '../../book';
import Pagination from '../../pagination';
import { AuthService } from '../../shared/auth.service';
import User from '../../user';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AlertComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css',
})
export class InventoryComponent implements OnInit {
  @ViewChild(AlertComponent) alertComponent!: AlertComponent;

  pagination: Pagination = {
    current_page: 1,
    data: [],
    from: 0,
    last_page: 0,
    per_page: 20,
    to: 0,
    total: 0,
  };
  books: Book[] = [];
  isEditting: string = '';
  user?: User;
  searchQuery = '';

  deletionBook?: Book;

  addBookForm: FormGroup = this.formBuilder.group<Book>({
    title: '',
    author: '',
    publisher: '',
    quantity: 0,
    price: 0,
  });

  editBookForm: FormGroup = this.formBuilder.group<Book>({
    title: '',
    author: '',
    publisher: '',
    quantity: 0,
    price: 0,
  });

  constructor(
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.profileUser().subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (err) => {
        if (err.status == 401) {
          this.router.navigate(['']);
        }
        console.error(err);

        let err_msg = '';
        if (err.error.message) {
          err_msg = ` ${err.error.message}`;
        }
        this.alertComponent.addAlert(
          `Failed to fetch user.${err_msg}`,
          'danger'
        );
      },
    });
    this.getBooks(this.pagination.current_page, this.pagination.per_page);
  }

  getBooks(page: number, perPage: number) {
    let url = `http://localhost:8000/api/books?page=${page}&perPage=${perPage}`;
    if (this.searchQuery.length) url = `${url}&query=${this.searchQuery}`;

    this.httpClient.get<Pagination>(url).subscribe({
      next: (pagination) => {
        this.pagination = pagination;
        this.books = pagination.data;
      },
      error: (err) => {
        console.error(err);

        let err_msg = '';
        if (err.error.message) {
          err_msg = ` ${err.error.message}`;
        }
        this.alertComponent.addAlert(
          `Failed to fetch books.${err_msg}`,
          'danger'
        );
      },
    });
  }

  searchBook() {
    this.getBooks(this.pagination.current_page, this.pagination.per_page);
  }

  clearSearch() {
    this.searchQuery = '';
    this.getBooks(this.pagination.current_page, this.pagination.per_page);
  }

  addBook() {
    this.httpClient
      .post('http://localhost:8000/api/books/add', this.addBookForm.value)
      .subscribe({
        complete: () => {
          this.alertComponent.addAlert(`Book added successfully.`, 'success');
          this.addBookForm.reset();
          this.getBooks(this.pagination.current_page, this.pagination.per_page);
        },
        error: (err) => {
          console.error(err);

          let err_msg = '';
          if (err.error.message) {
            err_msg = ` ${err.error.message}`;
          }
          this.alertComponent.addAlert(
            `Failed to add book.${err_msg}`,
            'danger'
          );
        },
      });
  }

  clickDeletionBook() {
    this.httpClient
      .put(
        `http://localhost:8000/api/books/${this.deletionBook?.id}/deletion`,
        {
          deletion: !this.deletionBook?.is_deleted,
        }
      )
      .subscribe({
        complete: () => {
          this.alertComponent.addAlert(
            `Book ${
              this.deletionBook?.is_deleted ? 'restored' : 'deleted'
            } successfully.`,
            'success'
          );
          this.getBooks(this.pagination.current_page, this.pagination.per_page);
        },
        error: (err) => {
          console.error(err);

          let err_msg = '';
          if (err.error.message) {
            err_msg = ` ${err.error.message}`;
          }
          this.alertComponent.addAlert(
            `Failed to delete book.${err_msg}`,
            'danger'
          );
        },
      });
  }

  clickEditBook(book: Book) {
    this.editBookForm = this.formBuilder.group<Book>(book);
  }

  updateBook() {
    this.httpClient
      .put(
        `http://localhost:8000/api/books/${this.editBookForm.value.id}/update`,
        this.editBookForm.value
      )
      .subscribe({
        complete: () => {
          this.getBooks(this.pagination.current_page, this.pagination.per_page);
          this.alertComponent.addAlert(`Book updated successfully.`, 'success');
        },
        error: (err) => {
          console.error(err);

          let err_msg = '';
          if (err.error.message) {
            err_msg = ` ${err.error.message}`;
          }
          this.alertComponent.addAlert(
            `Failed to update book.${err_msg}`,
            'danger'
          );
        },
      });
  }

  prevPage() {
    this.getBooks(this.pagination.current_page - 1, this.pagination.per_page);
  }

  nextPage() {
    this.getBooks(this.pagination.current_page + 1, this.pagination.per_page);
  }

  pageSelect(event: any) {
    const perPage: number = event.target.value;
    this.getBooks(this.pagination.current_page, perPage);
  }
}
