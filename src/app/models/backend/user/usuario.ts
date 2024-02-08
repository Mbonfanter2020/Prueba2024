export interface Usuario {
  id: Number,
  nombreRol: String,
  password: String,
  password2: String,
  is_superuser: boolean,
  first_name: String,
  last_name: String,
  username: String,
  email: String,
  phone_number: String,
  is_admin: boolean,
  is_staff: boolean,
  is_active: boolean,
  is_superadmin: boolean,
  group_id: Number,
  user_permissions: Number[]
}

