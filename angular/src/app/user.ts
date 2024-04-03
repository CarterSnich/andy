interface User {
  name: string;
  id_number: string;
  email: string;
  type: string;
  contact: string;
  password_confirmation?: string;
}

export default User;
