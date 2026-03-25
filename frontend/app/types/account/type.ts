export interface IRole {
  _id: string;
  roleName: string;
  roleType: string;
  claims: string[];
}

export interface IAccount {
  accountId: string;
  username: string;
  email: string;
  role: IRole; 
}