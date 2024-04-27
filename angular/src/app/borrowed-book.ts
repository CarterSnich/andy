import Book from './book';
import User from './user';

interface BorrowedBook {
  id: number;
  book: Book;
  borrower: User;
  is_approved: boolean;
  is_returned: boolean;
  borrowed_date: string;
  returned_date: string;
}

export default BorrowedBook;
