export interface RootState {
  product: {
    product: any;
    loading: boolean;
    error: string | null;
  };
}

export type AppDispatch = () => any;
