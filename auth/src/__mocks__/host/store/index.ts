export interface RootState {
  auth: {
    user: null | {
      _id: string;
      email: string;
      name: string;
    };
    loading: boolean;
    error: string | null;
  };
}

export type AppDispatch = <T>(action: T) => Promise<T> & {
  unwrap: () => Promise<void>;
};
