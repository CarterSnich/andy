import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import Book from '../../book';
import { AuthService } from '../../shared/auth.service';
import User from '../../user';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css',
})
export class InventoryComponent implements OnInit {
  previousUrl: string | undefined;
  books: Book[] | undefined;
  isEditting: string = '';
  user: User | undefined;
  searchQuery = new FormControl('');

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
    this.authService.profileUser().subscribe((user) => {
      this.user = user;
      this.previousUrl = user.type;
    });
    this.getBooks();
  }

  getBooks() {
    this.httpClient
      .get<Book[]>('http://localhost:8000/api/books')
      .subscribe((books) => {
        this.books = books;
      });
  }

  addBook() {
    this.httpClient
      .post('http://localhost:8000/api/books/add', this.addBookForm.value)
      .subscribe(() => {
        this.addBookForm.reset();
        this.getBooks();
      });
  }

  deleteBook(book: Book) {
    this.httpClient
      .delete(`http://localhost:8000/api/books/${book.id}/delete`)
      .subscribe(() => {
        this.getBooks();
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
      .subscribe(() => {
        this.getBooks();
      });
  }

  searchBooks() {
    if (this.searchQuery.value) {
      this.httpClient
        .get<Book[]>(
          `http://localhost:8000/api/books?query=${this.searchQuery.value}`
        )
        .subscribe((books) => {
          this.books = books;
        });
    } else {
      this.getBooks();
    }
  }
}
