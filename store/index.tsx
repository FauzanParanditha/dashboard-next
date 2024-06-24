import { create } from "zustand";
interface StoreState {
  isLoading: Boolean;
  setIsLoading: (isLoading: Boolean) => void;
}

const useStore = create<StoreState>((set) => ({
  isLoading: true,
  setIsLoading: (loading: Boolean) => set((state) => ({ isLoading: loading })),
  isLogin: false,
}));

export default useStore;
