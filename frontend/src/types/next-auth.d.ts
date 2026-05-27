import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      role: 'READER' | 'AUTHOR' | 'ADMIN';
      accessToken: string;
    };
  }

  interface User {
    id: string;
    role: 'READER' | 'AUTHOR' | 'ADMIN';
    accessToken: string;
    refreshToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'READER' | 'AUTHOR' | 'ADMIN';
    accessToken: string;
    refreshToken: string;
  }
}
