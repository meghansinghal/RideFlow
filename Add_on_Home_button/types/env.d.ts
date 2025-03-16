declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_HERE_API_KEY: string;
    }
  }
}

export {};