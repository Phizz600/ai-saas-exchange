interface Window {
  gapi: {
    load(api: string, callback: () => void): void;
    auth2: {
      init(params: { client_id: string; scope: string }): Promise<any>;
      getAuthInstance(): any;
    };
  };
}