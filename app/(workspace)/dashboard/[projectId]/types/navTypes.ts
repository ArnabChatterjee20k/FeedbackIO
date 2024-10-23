export interface User {
  email: string;
  name: string;
}

export interface Space {
  plan: "free" | "premimum";
  name: string;
  logo: string;
}
