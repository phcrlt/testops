declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}
// src/global.d.ts
declare module '@types/*' {
  export interface MenuItem {
    id: string;
    label: string;
    icon: string | JSX.Element;
    path: string;
    exact?: boolean;
    children?: MenuItem[];
  }
  
  // Добавьте другие типы
}