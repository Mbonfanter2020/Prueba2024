export interface User{
  id:Number
  email: string;
  username : string;
  token: Token;
  first_name: string;
  last_name:String;
  phone_number: String;
  is_admin:boolean
  is_superadmin:boolean
  groups: Number[]
}

interface Token{
  refresh: string;
  access: string;
}
