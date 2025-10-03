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
    state.value.currentDate = new Date(
      state.value.currentDate.getFullYear() - 1,
      0,
      1,
    );
  };

  const nextYear = () => {
    state.value.currentDate = new Date(
      state.value.currentDate.getFullYear() + 1,
      0,
      1,
    );
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

  // Width constants from AttendanceTable.vue
  const COLUMN_WIDTHS = {
    personnel: 6.25, // 100px in rem
    name: 9.375, // 150px in rem
    day: 2.1875, // 35px in rem
  };

  const getTodayColumnIndex = () => {
    const today = new Date();
    if (today.getFullYear() !== currentYear.value) return null;

    const startOfYear = new Date(currentYear.value, 0, 1);
    const daysDiff = Math.floor(
      (today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24),
    );
    return daysDiff;
  };

  const getMonthsUpToToday = () => {
    const today = new Date();
    if (today.getFullYear() !== currentYear.value) return [];

    const months = [];
    for (let month = 0; month < today.getMonth(); month++) {
      const daysInMonth = new Date(currentYear.value, month + 1, 0).getDate();
      months.push({
        month,
        daysCount: daysInMonth,
        width: daysInMonth * COLUMN_WIDTHS.day
      });
    }
    return months;
  };

  const getTodayPositionInMonth = () => {
    const today = new Date();
    if (today.getFullYear() !== currentYear.value) return null;

    const dayOfMonth = today.getDate() - 1; // 0-based
    return dayOfMonth * COLUMN_WIDTHS.day;
  };

  const scrollToToday = () => {
    goToToday();

    nextTick(() => {
      const monthsBeforeToday = getMonthsUpToToday();
      const positionInCurrentMonth = getTodayPositionInMonth();

      if (positionInCurrentMonth === null) return;

      // Calculate total width of months before today (in rem)
      const monthsWidth = monthsBeforeToday.reduce((total, month) => total + month.width, 0);

      // Add position within current month (in rem)
      const totalPositionRem = monthsWidth + positionInCurrentMonth;

      const scrollContainer = document.querySelector(".attendance-scroll-container");
      if (!scrollContainer) return;

      // Employee columns width in rem (from AttendanceTable calculation)
      const employeeColumnsWidthRem = COLUMN_WIDTHS.personnel + COLUMN_WIDTHS.name * 2; // 25rem

      // Calculate scroll position in rem, then convert to pixels
      const scrollPositionRem = totalPositionRem + employeeColumnsWidthRem - (scrollContainer.clientWidth / 2 / 16);
      const scrollPositionPx = scrollPositionRem * 16; // Convert rem to px (1rem = 16px)

      scrollContainer.scrollTo({
        left: Math.max(0, scrollPositionPx),
        behavior: "smooth",
      });
    });
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
    getTodayColumnIndex,
    getMonthsUpToToday,
    getTodayPositionInMonth,
    scrollToToday,
  };
};

export type UseTableReturn = ReturnType<typeof useTable>;

