interface User {
  firstname: string;
  lastname: string;
  id_number: string;
  email: string;
  type: string;
  contact: string;
  password?: string;
  is_deactivated?: boolean;
}

export default User;
