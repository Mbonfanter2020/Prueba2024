export interface IMenu {
  text: string,
  icon: string,
  routerLink?: string;
  model?:string;
  children: IMenuItem[]
}
export interface IMenuItem {
  text: string,
  icon: string,
  routerLink: string;
  model:string;
}
