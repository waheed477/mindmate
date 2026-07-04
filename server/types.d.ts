declare global {
  namespace Express {
    interface User {
      id: string;
      role: 'patient' | 'doctor';
      email: string;
      fullName?: string;
      profilePicture?: string;
      _id: any;
    }
  }
}

export {};
