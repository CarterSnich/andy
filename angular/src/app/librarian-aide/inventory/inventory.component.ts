import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import Book from '../../book';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css',
})
export class InventoryComponent implements OnInit {
  books: Book[] | undefined;
  isEditting: string = '';

  addBookForm: FormGroup = this.formBuilder.group<Book>({
    title: '',
    author: '',
    price: 0,
    publisher: '',
  });

  editBookForm: FormGroup = this.formBuilder.group<Book>({
    title: '',
    author: '',
    price: 0,
    publisher: '',
  });

  constructor(
    private httpClient: HttpClient,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
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
}
