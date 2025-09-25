<template>
  <div>
    <!-- Page Header -->
    <v-row class="mb-4">
      <v-col>
        <h1 class="text-h4 font-weight-bold">Employee Attendance Overview</h1>
      </v-col>
    </v-row>

    <!-- Action Button -->
    <v-row class="mb-4">
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
                >mdi-checkbox-blank-outline</v-icon
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
        <v-row align="center" class="mb-4">
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

        <!-- Grid Table -->
        <v-table dense>
          <thead>
            <tr>
              <th class="text-left">Personnel No.</th>
              <th class="text-left">First Name</th>
              <th class="text-left">Last Name</th>
              <!-- Day columns -->
              <th
                v-for="day in daysInMonth"
                :key="day"
                class="text-center px-1"
                style="min-width: 30px"
              >
                {{ day }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in employees" :key="employee.id">
              <td>{{ employee.id }}</td>
              <td>{{ employee.firstName }}</td>
              <td>{{ employee.lastName }}</td>
              <!-- Attendance cells -->
              <td
                v-for="day in daysInMonth"
                :key="`${employee.id}-${day}`"
                class="text-center px-1"
              >
                <v-sheet
                  :color="getCellColor(employee.id, day)"
                  height="24"
                  width="24"
                  class="mx-auto"
                  rounded
                  >{{ day }}</v-sheet
                >
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>

    <v-divider></v-divider>

    <v-card class="attendance-grid-card">
      <v-card-title>Employee Attendance</v-card-title>
      <v-divider></v-divider>

      <v-card-text class="pa-0">
        <!-- Fixed Header Table -->
        <div class="attendance-header-container">
          <table class="attendance-table">
            <thead>
              <tr class="attendance-header">
                <th class="col-personnel">Personnel No.</th>
                <th class="col-name">First Name</th>
                <th class="col-name">Last Name</th>
                <th
                  v-for="day in daysInMonth"
                  :key="`header-${day}`"
                  class="col-day"
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
                        <div
                          class="attendance-cell"
                          :class="`status-${getAttendanceStatusForGrid(employee.id, day)}`"
                        >
                          {{ day }}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
          </v-virtual-scroll>
        </div>
      </v-card-text>
    </v-card>
    <!-- Add Absence Dialog (will be implemented as component later) -->
    <v-dialog v-model="showAddAbsenceDialog" max-width="500">
      <v-card>
        <v-card-title>Add New Absence</v-card-title>
        <v-card-text>
          <p>Add absence form will be implemented here</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showAddAbsenceDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="showAddAbsenceDialog = false"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
// Get data from our composables
const { employees } = useEmployees();
const { getAttendanceStatus } = useAttendance();

// Component state
const showAddAbsenceDialog = ref(false);
const currentDate = ref(new Date());

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

// Methods
const getCellColor = (employeeId: string, day: number) => {
  const date = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth(),
    day,
  );
  const status = getAttendanceStatus(employeeId, date);
  if (status == "absent") {
    console.log(day);
    console.log(date);
  }

  // Map status to Vuetify theme colors efficiently
  const colorMap = {
    present: "present",
    absent: "absent",
    weekend: "weekend",
    today: "today",
    holiday: "info",
  };

  return colorMap[status] || "transparent";
};

// Helper method to get attendance status for the grid cells
const getAttendanceStatusForGrid = (employeeId: string, day: number) => {
  const date = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth(),
    day,
  );
  return getAttendanceStatus(employeeId, date);
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
  currentDate.value = new Date();
};

onMounted(() => {
  console.log("Dashboard mounted with", employees.value.length, "employees");
});
</script>

<style scoped>
.gap-3 {
  gap: 12px;
}
.gap-4 {
  gap: 16px;
}

/* Attendance Grid Styles */
.attendance-grid-card {
  margin-top: 24px;
}

.attendance-header-container {
  background-color: #f5f5f5;
  border-bottom: 2px solid #ddd;
  position: sticky;
  top: 0;
  z-index: 1;
}

.attendance-body-container {
  border: 1px solid #ddd;
  border-top: none;
  overflow-x: auto;
  max-height: 500px;
}

.attendance-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.attendance-header th {
  padding: 12px 8px;
  text-align: left;
  font-weight: 600;
  border-right: 1px solid #ddd;
  background-color: #f5f5f5;
}

.attendance-header th:last-child {
  border-right: none;
}

.col-personnel {
  width: 100px;
}

.col-name {
  width: 150px;
}

.col-day {
  width: 35px;
  text-align: center;
  padding: 0 !important;
}

.attendance-row-wrapper {
  border-bottom: 1px solid #eee;
}

.attendance-row-wrapper:hover {
  background-color: #fafafa;
}

.attendance-row td {
  padding: 10px 8px;
  border-right: 1px solid #eee;
  vertical-align: middle;
  height: 45px;
}

.attendance-row td:last-child {
  border-right: none;
}

.attendance-row .col-day {
  padding: 5px 0;
}

.attendance-cell {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 500;
  color: white;
  margin: 0 auto;
}

/* Status-based colors matching the image */
.status-present {
  background-color: #4caf50; /* Green */
}

.status-absent {
  background-color: #ef5350; /* Red */
}

.status-weekend {
  background-color: #e0e0e0; /* Light gray */
  color: #666;
}

.status-today {
  background-color: #2196f3; /* Blue */
  border: 2px solid #1976d2;
}
</style>
