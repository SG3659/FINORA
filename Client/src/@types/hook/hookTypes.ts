export interface UseProgressLoaderOptions {
   initialProgress?: number;
   completionDelay?: number;
}

export interface UseProgressLoaderReturn {
   progress: number;
   isLoading: boolean;
   startProgress: (initial?: number) => void;
   updateProgress: (value: number) => void;
   doneProgress: () => void;
   resetProgress: () => void;
}