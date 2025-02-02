interface Window {
  gapi: {
    load(api: string, options: {
      callback: () => void;
      onerror: () => void;
    }): void;
    auth2: {
      init(params: { client_id: string; scope: string }): Promise<GoogleAuth>;
      getAuthInstance(): GoogleAuth;
    };
  };
}

interface GoogleAuth {
  signIn(): Promise<GoogleUser>;
}

interface GoogleUser {
  getAuthResponse(): {
    access_token: string;
  };
}