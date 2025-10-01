interface LoadingState {
  isLoading: boolean;
  loadingText: string;
  progress: number;
}

export const useAppLoading = () => {
  const state = useState<LoadingState>("appLoading", () => ({
    isLoading: true,
    loadingText: "Initializing application...",
    progress: 0,
  }));

  const setLoading = (loading: boolean): void => {
    state.value.isLoading = loading;
  };

  const setLoadingText = (text: string): void => {
    state.value.loadingText = text;
  };

  const setProgress = (progress: number): void => {
    state.value.progress = Math.max(0, Math.min(100, progress));
  };

  const updateLoadingStep = (text: string, progress: number) => {
    setLoadingText(text);
    setProgress(progress);
  };

  const simulateLoadingSteps = async (): Promise<void> => {
    updateLoadingStep("Almost there!", 50);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    updateLoadingStep("Ready!", 100);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
  };

  return {
    isLoading: computed(() => state.value.isLoading),
    loadingText: computed(() => state.value.loadingText),
    progress: computed(() => state.value.progress),

    setLoading,
    setLoadingText,
    setProgress,
    updateLoadingStep,
    simulateLoadingSteps,
  };
};

export type UseAppLoadingReturn = ReturnType<typeof useAppLoading>;

