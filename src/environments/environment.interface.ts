export interface Environment {
    production: boolean;
    apiUrl: string;
    auth0: {
      domain: string;
      clientId: string;
    };
  }