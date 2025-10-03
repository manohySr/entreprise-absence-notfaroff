interface TableState {
  currentDate: Date;
  updateKey: number;
  loading: boolean;
}

interface DayData {
  dayOfYear: number;
  date: Date;
  day: number;
  month: number;
  monthName: string;
  isFirstOfMonth: boolean;
}

export const useTable = () => {
  const state = ref<TableState>({
    currentDate: new Date(),
    updateKey: 0,
    loading: false,
  });

  // Computed properties
  const currentYear = computed(() => {
    return state.value.currentDate.getFullYear();
  });

  const daysInYear = computed(() => {
    const year = state.value.currentDate.getFullYear();
    const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    const totalDays = isLeapYear ? 366 : 365;

    return Array.from({ length: totalDays }, (_, i) => {
      const date = new Date(year, 0, i + 1);
      return {
        dayOfYear: i + 1,
        date: date,
        day: date.getDate(),
        month: date.getMonth(),
        monthName: date.toLocaleDateString("en-US", { month: "short" }),
        isFirstOfMonth: date.getDate() === 1,
      };
    });
  });

  // Navigation methods
  const previousYear = () => {
    state.value.currentDate = new Date(state.value.currentDate.getFullYear() - 1, 0, 1);
  };

  const nextYear = () => {
    state.value.currentDate = new Date(state.value.currentDate.getFullYear() + 1, 0, 1);
  };

  const goToToday = () => {
    state.value.currentDate = new Date();
  };

  const goToYear = (year: number) => {
    state.value.currentDate = new Date(year, 0, 1);
  };

  const goToDate = (date: Date) => {
    state.value.currentDate = new Date(date.getFullYear(), 0, 1);
  };

  // Update methods
  const forceUpdate = () => {
    state.value.updateKey++;
  };

  const setLoading = (loading: boolean) => {
    state.value.loading = loading;
  };

  // Utility methods
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const scrollToToday = () => {
    // This would need to be implemented with the specific scrolling logic
    // for the table component - placeholder for now
    goToToday();
  };

  return {
    // State
    tableState: readonly(state),
    currentYear,
    daysInYear,
    updateKey: computed(() => state.value.updateKey),
    loading: computed(() => state.value.loading),

    // Navigation
    previousYear,
    nextYear,
    goToToday,
    goToYear,
    goToDate,

    // Updates
    forceUpdate,
    setLoading,

    // Utilities
    getDaysInMonth,
    scrollToToday,
  };
};

export type UseTableReturn = ReturnType<typeof useTable>;