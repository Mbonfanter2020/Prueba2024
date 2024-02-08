export interface UsuarioGet {
  id: Number,
  nombreRol: String,
  password: String,
  is_superuser: boolean,
  first_name: String,
  last_name: String,
  username: String,
  email: String,
  phone_number: String,
  date_joined: Date,
  last_login: Date
  is_admin: boolean,
  is_staff: boolean,
  is_active: boolean,
  is_superadmin: boolean,
  groups: Number[],
  user_permissions: Number[]
}

