export interface Content {
  id: string;
  prompt: string;
  output: string;
  userId: string;
  contentType: string;
  createdAt: Date | string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface FormState {
  login: {
    email: string;
    password: string;
  };
  content: {
    prompt: string;
  };
}

export type ContentType = 
  | "blog-post" 
  | "social-media" 
  | "seo-optimized"
  | "dialogue" 
  | "email-campaign"
  | "content-repurposing"
  | "brand-voice";