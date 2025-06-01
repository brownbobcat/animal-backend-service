export interface User {
  id: number;
  username: string;
  hash: string;
}

export interface Animal {
  id: number;
  name: string;
  sciName: string;
  description: string[];
  images: string[];
  video: string;
  events: Event[];
  createdByUser: number;
}

export interface Event {
  name: string;
  date: string;
  url: string;
}

export interface LoginResult {
  token: string;
}

export interface TokenPayload {
  userId: number;
  iat?: number;
  exp?: number;
}
