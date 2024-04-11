import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AlertComponent } from '../../alert/alert.component';
import Book from '../../book';
import { AuthService } from '../../shared/auth.service';
import User from '../../user';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, AlertComponent],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css',
})
export class InventoryComponent implements OnInit {
  @ViewChild(AlertComponent) alertComponent!: AlertComponent;

  previousUrl: string | undefined;
  books: Book[] | undefined;
  isEditting: string = '';
  user: User | undefined;
  searchQuery = new FormControl('');
  deleteBook: Book | undefined;

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
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.profileUser().subscribe({
      next: (user) => {
        this.user = user;
        this.previousUrl = user.type;
      },
      error: (err) => {
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
    this.getBooks();
  }

  setDeleteBook(book: Book) {
    this.deleteBook = book;
  }

  getBooks() {
    this.httpClient.get<Book[]>('http://localhost:8000/api/books').subscribe({
      next: (books) => {
        this.books = books;
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

  addBook() {
    this.httpClient
      .post('http://localhost:8000/api/books/add', this.addBookForm.value)
      .subscribe({
        complete: () => {
          this.alertComponent.addAlert(`Book added successfully.`, 'success');
          this.addBookForm.reset();
          this.getBooks();
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

  clickDeleteBook() {
    this.httpClient
      .delete(`http://localhost:8000/api/books/${this.deleteBook?.id}/delete`)
      .subscribe({
        complete: () => {
          this.getBooks();

          this.alertComponent.addAlert(`Book deleted successfully.`, 'success');
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
          this.getBooks();
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

  searchBooks() {
    if (this.searchQuery.value) {
      this.httpClient
        .get<Book[]>(
          `http://localhost:8000/api/books?query=${this.searchQuery.value}`
        )
        .subscribe({
          next: (books) => {
            this.books = books;
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
    } else {
      this.getBooks();
    }
  }
}
