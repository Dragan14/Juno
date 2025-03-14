export type AuthEvent = {
  type: string;
  user?: any;
  session?: any;
} | null;

export type SignInCredentials = {
  email: string;
  password: string;
};

export type SignUpCredentials = SignInCredentials & {
  name: string;
};
