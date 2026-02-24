import { createContext, useContext, useEffect, useState } from "react";

type LoadingContextValue = {
  minLoadingElapsed: boolean;
};

const LoadingContext = createContext<LoadingContextValue>({
  minLoadingElapsed: false,
});

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [minLoadingElapsed, setMinLoadingElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinLoadingElapsed(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LoadingContext.Provider value={{ minLoadingElapsed }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}
