interface Book {
  isbn?: string;
  id?: string;
  title: string;
  author: string;
  publisher: string;
  quantity: number;
  price: number;
  is_deleted?: boolean;
}

export default Book;
