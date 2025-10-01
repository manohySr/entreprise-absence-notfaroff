import type { Ref } from "vue";

interface DialogState {
  isOpen: boolean;
  selectedId?: string;
  selectedEmployeeId?: string;
  selectedDate?: Date;
  data?: any;
}

export const useDialog = () => {
  const state = ref<DialogState>({
    isOpen: false,
    selectedId: undefined,
    selectedEmployeeId: undefined,
    selectedDate: undefined,
    data: undefined,
  });

  const openDialog = (options?: {
    selectedId?: string;
    selectedEmployeeId?: string;
    selectedDate?: Date;
    data?: any;
  }) => {
    state.value = {
      isOpen: true,
      selectedId: options?.selectedId,
      selectedEmployeeId: options?.selectedEmployeeId,
      selectedDate: options?.selectedDate,
      data: options?.data,
    };
  };

  const closeDialog = () => {
    state.value.isOpen = false;
    resetDialog();
  };

  const resetDialog = () => {
    setTimeout(() => {
      state.value.selectedId = undefined;
      state.value.selectedEmployeeId = undefined;
      state.value.selectedDate = undefined;
      state.value.data = undefined;
    }, 300); // Small delay to allow for smooth dialog close animation
  };

  const updateDialogState = (updates: Partial<DialogState>) => {
    Object.assign(state.value, updates);
  };

  return {
    // State
    dialogState: readonly(state),
    isOpen: computed(() => state.value.isOpen),
    selectedId: computed(() => state.value.selectedId),
    selectedEmployeeId: computed(() => state.value.selectedEmployeeId),
    selectedDate: computed(() => state.value.selectedDate),
    dialogData: computed(() => state.value.data),

    // Actions
    openDialog,
    closeDialog,
    resetDialog,
    updateDialogState,
  };
};

export type UseDialogReturn = ReturnType<typeof useDialog>;