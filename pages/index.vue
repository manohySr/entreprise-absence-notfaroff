<template>
  <div>
    <!-- Page Header -->
    <v-row class="mt-2">
      <v-col>
        <h1 class="text-h4 font-weight-bold">Employee Attendance Overview</h1>
      </v-col>
    </v-row>

    <!-- Action Button -->
    <v-row class="mb-2">
      <v-col>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="showAddAbsenceDialog = true"
        >
          Add New Absence
        </v-btn>
      </v-col>
    </v-row>

    <!-- Legend -->
    <v-row class="mb-4">
      <v-col>
        <div class="d-flex align-center gap-4">
          <span class="text-subtitle-2 font-weight-medium">Legend:</span>
          <div class="d-flex align-center gap-3">
            <div class="d-flex align-center">
              <v-icon size="small" color="present" class="mr-1"
                >mdi-checkbox-blank</v-icon
              >
              <span class="text-body-2">Present</span>
            </div>
            <div class="d-flex align-center">
              <v-icon size="small" color="absent" class="mr-1"
                >mdi-checkbox-blank</v-icon
              >
              <span class="text-body-2">Absent</span>
            </div>
            <div class="d-flex align-center">
              <v-icon size="small" color="weekend" class="mr-1"
                >mdi-checkbox-blank</v-icon
              >
              <span class="text-body-2">Weekend</span>
            </div>
            <div class="d-flex align-center">
              <v-icon size="small" color="today" class="mr-1"
                >mdi-checkbox-blank</v-icon
              >
              <span class="text-body-2">Today</span>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Attendance Grid -->
    <v-card>
      <v-card-text>
        <!-- Year Navigation -->
        <v-row align="center">
          <v-col cols="auto">
            <v-btn
              icon="mdi-chevron-left"
              variant="text"
              @click="previousYear"
            ></v-btn>
          </v-col>
          <v-col cols="auto">
            <h2 class="text-h6">{{ currentYear }}</h2>
          </v-col>
          <v-col cols="auto">
            <v-btn
              icon="mdi-chevron-right"
              variant="text"
              @click="nextYear"
            ></v-btn>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="auto">
            <v-btn variant="outlined" @click="goToToday">Today</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card class="attendance-grid-card">
      <v-card-text class="pa-0">
        <!-- Scrollable container -->
        <div class="attendance-scroll-container">
          <!-- Fixed width wrapper for proper scrolling -->
          <div
            class="attendance-table-wrapper"
            :style="`min-width: ${minTableWidth}rem;`"
          >
            <!-- Fixed Header Table -->
            <div class="attendance-header-container">
              <table class="attendance-table">
                <thead>
                  <!-- Month separator row -->
                  <tr class="month-separator-header">
                    <th class="col-personnel"></th>
                    <th class="col-name"></th>
                    <th class="col-name"></th>
                    <template
                      v-for="(dayData, index) in daysInYear"
                      :key="`month-${index}`"
                    >
                      <th
                        v-if="dayData.isFirstOfMonth"
                        :colspan="
                          getDaysInMonth(
                            dayData.month,
                            dayData.date.getFullYear(),
                          )
                        "
                        class="col-month text-center"
                      >
                        {{ dayData.monthName }}
                      </th>
                    </template>
                  </tr>
                  <!-- Day numbers row -->
                  <tr class="attendance-header">
                    <th class="col-personnel">No.</th>
                    <th class="col-name">First Name</th>
                    <th class="col-name">Last Name</th>
                    <th class="days-header-container">
                      <RecycleScroller
                        class="days-header-scroller"
                        :items="daysInYear"
                        :item-size="35"
                        direction="horizontal"
                        key-field="dayOfYear"
                      >
                        <template #default="{ item }">
                          <div class="col-day text-center">
                            {{ item.day }}
                          </div>
                        </template>
                      </RecycleScroller>
                    </th>
                  </tr>
                </thead>
              </table>
            </div>

            <!-- Virtual Scroll Body -->
            <div class="attendance-body-container">
              <v-virtual-scroll
                :items="employees"
                height="500"
                item-height="45"
                :key-field="'id'"
                class="virtual-scroll-no-overflow"
              >
                <template v-slot:default="{ item: employee }">
                  <div class="attendance-row-wrapper">
                    <table class="attendance-table">
                      <tbody>
                        <tr class="attendance-row">
                          <td class="col-personnel">{{ employee.id }}</td>
                          <td class="col-name">{{ employee.firstName }}</td>
                          <td class="col-name">{{ employee.lastName }}</td>
                          <td class="days-body-container">
                            <RecycleScroller
                              class="days-body-scroller"
                              :items="daysInYear"
                              :item-size="35"
                              direction="horizontal"
                              key-field="dayOfYear"
                            >
                              <template #default="{ item: dayData }">
                                <div class="col-day">
                                  <v-sheet
                                    :key="`${employee.id}-${dayData.dayOfYear}-${updateKey}`"
                                    :color="getCellColor(employee.id, dayData)"
                                    class="attendance-cell"
                                    rounded
                                    :style="
                                      isWeekendDay(dayData)
                                        ? 'cursor: not-allowed'
                                        : 'cursor: pointer'
                                    "
                                    @click="
                                      handleCellClick(employee.id, dayData)
                                    "
                                  >
                                    <span
                                      class="text-caption font-weight-bold"
                                      >{{ dayData.day }}</span
                                    >
                                  </v-sheet>
                                </div>
                              </template>
                            </RecycleScroller>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </template>
              </v-virtual-scroll>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
    <!-- Add Absence Dialog -->
    <AbsenceDialog
      v-model="showAddAbsenceDialog"
      :absence-id="selectedAbsenceId"
      :employee-id="selectedEmployeeId"
      :selected-date="selectedAbsenceDate"
      @save="handleSaveAbsence"
      @cancel="handleCancelAbsence"
    />
  </div>
</template>

<script setup lang="ts">
import AbsenceDialog from "~/components/absence/AbsenceDialog.vue";
import { RecycleScroller } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";

// Get data from our composables
const { employees } = useEmployees();
const {
  absences,
  getAttendanceStatus,
  getAbsenceByEmployeeAndDate,
  addAbsence,
  updateAbsence,
  deleteAbsence,
  isWeekend,
} = useAttendance();

// Component state
const showAddAbsenceDialog = ref(false);
const currentDate = ref(new Date());
const selectedEmployeeId = ref<string>();
const selectedAbsenceDate = ref<Date>();
const selectedAbsenceId = ref<string>();

// Force update key for virtual scroll when absences change
const updateKey = ref(0);

// Column width constants (in rem)
const COLUMN_WIDTHS = {
  personnel: 6.25, // 100px
  name: 9.375, // 150px
  day: 2.1875, // 35px
};

// Computed properties
const currentYear = computed(() => {
  return currentDate.value.getFullYear();
});

const daysInYear = computed(() => {
  const year = currentDate.value.getFullYear();
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

// Calculate minimum table width
const minTableWidth = computed(() => {
  const fixedColumnsWidth = COLUMN_WIDTHS.personnel + COLUMN_WIDTHS.name * 2;
  const daysWidth = daysInYear.value.length * COLUMN_WIDTHS.day;
  return fixedColumnsWidth + daysWidth;
});

// Methods
const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getCellColor = (employeeId: string, dayData: any) => {
  const status = getAttendanceStatus(employeeId, dayData.date);

  const colorMap = {
    present: "present",
    absent: "absent",
    weekend: "weekend",
    today: "today",
    holiday: "info",
  };

  return colorMap[status] || "transparent";
};

const isWeekendDay = (dayData: any) => {
  return isWeekend(dayData.date);
};

const previousYear = () => {
  currentDate.value = new Date(currentDate.value.getFullYear() - 1, 0, 1);
};

const nextYear = () => {
  currentDate.value = new Date(currentDate.value.getFullYear() + 1, 0, 1);
};

const goToToday = () => {
  //TODO: Scroll to today
  currentDate.value = new Date();
};

const handleCellClick = (employeeId: string, dayData: any) => {
  // Don't allow clicks on weekend days
  if (isWeekendDay(dayData)) {
    return;
  }

  // Set the selected employee and date
  selectedEmployeeId.value = employeeId;
  selectedAbsenceDate.value = dayData.date;

  // Check if there's an existing absence for this employee and date
  const existingAbsence = getAbsenceByEmployeeAndDate(employeeId, dayData.date);

  if (existingAbsence) {
    selectedAbsenceId.value = existingAbsence.id;
  } else {
    selectedAbsenceId.value = undefined;
  }

  // Open the dialog
  showAddAbsenceDialog.value = true;
};

const handleSaveAbsence = (absenceData: any) => {
  // Check if user selected "Present" - this means delete the absence record
  if (absenceData.type === "present") {
    if (selectedAbsenceId.value) {
      deleteAbsence(selectedAbsenceId.value);
      console.log(
        "Deleted absence (marked as present):",
        selectedAbsenceId.value,
      );
    }
    // If no existing absence and type is "present", do nothing (already present)
  } else {
    // Handle regular absence types
    if (selectedAbsenceId.value) {
      updateAbsence(selectedAbsenceId.value, absenceData);
      console.log("Updated absence:", selectedAbsenceId.value, absenceData);
    } else {
      addAbsence(absenceData);
      console.log("Created new absence:", absenceData);
    }
  }

  // Reset selected values
  selectedAbsenceId.value = undefined;
  selectedEmployeeId.value = undefined;
  selectedAbsenceDate.value = undefined;

  // Force update the grid to reflect changes immediately
  updateKey.value++;

  // TODO: Success notification
};

const handleCancelAbsence = () => {
  console.log("Absence dialog cancelled");
  // Reset selected data
  selectedAbsenceId.value = undefined;
  selectedEmployeeId.value = undefined;
  selectedAbsenceDate.value = undefined;
};

// Watch for changes in absences to ensure live updates
watch(
  absences,
  () => {
    console.log("Absences updated, total:", absences.value.length);
  },
  { deep: true },
);

onMounted(() => {
  console.log("Dashboard mounted with", employees.value.length, "employees");
});
</script>

<style scoped>
.gap-3 {
  gap: 0.75rem;
}
.gap-4 {
  gap: 1rem;
}

/* Attendance Grid Styles */
.attendance-grid-card {
}

/* Scrollable container */
.attendance-scroll-container {
  overflow-x: auto;
  overflow-y: hidden;
}

/* Table wrapper with minimum width */
.attendance-table-wrapper {
  position: relative;
}

.attendance-header-container {
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
  position: sticky;
  top: 0;
  z-index: 1;
}

.attendance-body-container {
  border: 1px solid #ddd;
  border-top: none;
}

.attendance-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.month-separator-header th {
  padding: 0.5rem 0.25rem;
  text-align: center;
  font-weight: 700;
  font-size: 0.875rem;
  border-right: 0.0625rem solid #bbb;
  background-color: #e8e8e8;
  color: #555;
}

.month-separator-header th:last-child {
  border-right: none;
}

.col-month {
  border-bottom: 0.125rem solid #aaa;
}

.attendance-header th {
  padding: 0.75rem 0.5rem;
  text-align: left;
  font-weight: 600;
  border-right: 0.0625rem solid #ddd;
  background-color: #f5f5f5;
}

.attendance-header th:last-child {
  border-right: none;
}

.col-personnel {
  width: 6.25rem;
}

.col-name {
  width: 9.375rem;
}

.col-day {
  width: 2.1875rem;
  text-align: center;
  padding: 0 !important;
}

.attendance-row-wrapper {
  border-bottom: 0.0625rem solid #eee;
}

.attendance-row-wrapper:hover {
  background-color: #fafafa;
}

.attendance-row td {
  padding: 0.625rem 0.5rem;
  border-right: 0.0625rem solid #eee;
  vertical-align: middle;
  height: 2.8125rem;
}

.attendance-row td:last-child {
  border-right: none;
}

.attendance-row .col-day {
  padding: 0.3125rem 0;
}

.attendance-cell {
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.attendance-cell .text-caption {
  font-size: 0.75rem;
  color: white;
}

/* Prevent v-virtual-scroll from creating its own horizontal scrollbar */
.virtual-scroll-no-overflow {
  overflow-x: hidden !important;
}

/* Ensure the virtual scroll wrapper doesn't create horizontal scroll */
.attendance-body-container :deep(.v-virtual-scroll__container) {
  overflow-x: hidden !important;
}

/* RecycleScroller styles for horizontal scrolling */
.days-header-container,
.days-body-container {
  width: 100%;
}

.days-header-scroller,
.days-body-scroller {
  width: 100%;
  height: 100%;
}

/* Override vue-virtual-scroller for horizontal direction */
.days-header-scroller.vue-recycle-scroller,
.days-body-scroller.vue-recycle-scroller {
  overflow-x: auto;
  overflow-y: hidden;
  /* Hide scrollbar for Firefox */
  scrollbar-width: none;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.days-header-scroller.vue-recycle-scroller::-webkit-scrollbar,
.days-body-scroller.vue-recycle-scroller::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge */
.days-header-scroller.vue-recycle-scroller,
.days-body-scroller.vue-recycle-scroller {
  -ms-overflow-style: none;
}

.days-header-scroller .vue-recycle-scroller__item-wrapper,
.days-body-scroller .vue-recycle-scroller__item-wrapper {
  display: flex;
  flex-direction: row;
}
</style>
