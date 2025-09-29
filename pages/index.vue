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
        <!-- Month Navigation -->
        <v-row align="center">
          <v-col cols="auto">
            <v-btn
              icon="mdi-chevron-left"
              variant="text"
              @click="previousMonth"
            ></v-btn>
          </v-col>
          <v-col cols="auto">
            <h2 class="text-h6">{{ currentMonthYear }}</h2>
          </v-col>
          <v-col cols="auto">
            <v-btn
              icon="mdi-chevron-right"
              variant="text"
              @click="nextMonth"
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
                  <tr class="attendance-header">
                    <th class="col-personnel">No.</th>
                    <th class="col-name">First Name</th>
                    <th class="col-name">Last Name</th>
                    <th
                      v-for="day in daysInMonth"
                      :key="`header-${day}`"
                      class="col-day text-center"
                    >
                      {{ day }}
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
                          <td
                            v-for="day in daysInMonth"
                            :key="`${employee.id}-${day}`"
                            class="col-day"
                          >
                            <v-sheet
                              :key="updateKey"
                              :color="getCellColor(employee.id, day)"
                              class="attendance-cell"
                              rounded
                              :style="isWeekendDay(day) ? 'cursor: not-allowed' : 'cursor: pointer'"
                              @click="handleCellClick(employee.id, day)"
                            >
                              <span class="text-caption font-weight-bold">{{
                                day
                              }}</span>
                            </v-sheet>
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
const currentMonthYear = computed(() => {
  const date = currentDate.value;
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
});

const daysInMonth = computed(() => {
  const date = currentDate.value;
  const lastDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
  ).getDate();
  return Array.from({ length: lastDay }, (_, i) => i + 1);
});

// Calculate minimum table width
const minTableWidth = computed(() => {
  const fixedColumnsWidth = COLUMN_WIDTHS.personnel + COLUMN_WIDTHS.name * 2;
  const daysWidth = daysInMonth.value.length * COLUMN_WIDTHS.day;
  return fixedColumnsWidth + daysWidth;
});

// Methods
const getCellColor = (employeeId: string, day: number) => {
  const date = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth(),
    day,
  );
  const status = getAttendanceStatus(employeeId, date);

  const colorMap = {
    present: "present",
    absent: "absent",
    weekend: "weekend",
    today: "today",
    holiday: "info",
  };

  return colorMap[status] || "transparent";
};

const isWeekendDay = (day: number) => {
  const date = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth(),
    day,
  );
  return isWeekend(date);
};

const previousMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1,
  );
};

const nextMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1,
  );
};

const goToToday = () => {
  //TODO: Scroll to today
  currentDate.value = new Date();
};

const handleCellClick = (employeeId: string, day: number) => {
  // Don't allow clicks on weekend days
  if (isWeekendDay(day)) {
    return;
  }

  // Set the selected employee and date
  selectedEmployeeId.value = employeeId;
  const clickedDate = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth(),
    day,
  );

  selectedAbsenceDate.value = clickedDate;

  // Check if there's an existing absence for this employee and date
  const existingAbsence = getAbsenceByEmployeeAndDate(employeeId, clickedDate);

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
      // Delete existing absence to mark as present
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
      // Update existing absence
      updateAbsence(selectedAbsenceId.value, absenceData);
      console.log("Updated absence:", selectedAbsenceId.value, absenceData);
    } else {
      // Create new absence
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
    // This will trigger whenever absences array changes
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
</style>
