import Book from './book';

interface Page {
  current_page: number;
  data: Book[];
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

export default Page;
