<template>
  <div>
    <!-- Page Header -->
    <v-row class="mb-4 pt-10">
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

    <v-card class="mt-4 mb-8">
      <v-card-text class="pa-0">
        <!-- Fixed Header -->
        <div class="bg-grey-lighten-4 border-b-2" style="position: sticky; top: 0; z-index: 1;">
          <v-row no-gutters class="align-center" style="min-height: 3rem;">
            <v-col style="width: 6.25rem; max-width: 6.25rem;" class="px-2 py-3 border-r text-subtitle-2 font-weight-medium">
              No.
            </v-col>
            <v-col style="width: 9.375rem; max-width: 9.375rem;" class="px-2 py-3 border-r text-subtitle-2 font-weight-medium">
              First Name
            </v-col>
            <v-col style="width: 9.375rem; max-width: 9.375rem;" class="px-2 py-3 border-r text-subtitle-2 font-weight-medium">
              Last Name
            </v-col>
            <v-col
              v-for="day in daysInMonth"
              :key="`header-${day}`"
              style="width: 2.1875rem; max-width: 2.1875rem;"
              class="px-1 py-3 border-r text-center text-subtitle-2 font-weight-medium"
            >
              {{ day }}
            </v-col>
          </v-row>
        </div>

        <!-- Virtual Scroll Body -->
        <div class="border" style="border-top: none; max-height: 31.25rem; overflow-x: auto;">
          <v-virtual-scroll :items="employees" height="500" :key-field="'id'">
            <template v-slot:default="{ item: employee }">
              <v-hover v-slot="{ isHovering, props }">
                <div v-bind="props" :class="isHovering ? 'bg-grey-lighten-5' : ''" class="border-b">
                  <v-row no-gutters class="align-center" style="min-height: 2.8125rem;">
                    <v-col style="width: 6.25rem; max-width: 6.25rem;" class="px-2 py-2 border-r">
                      {{ employee.id }}
                    </v-col>
                    <v-col style="width: 9.375rem; max-width: 9.375rem;" class="px-2 py-2 border-r">
                      {{ employee.firstName }}
                    </v-col>
                    <v-col style="width: 9.375rem; max-width: 9.375rem;" class="px-2 py-2 border-r">
                      {{ employee.lastName }}
                    </v-col>
                    <v-col
                      v-for="day in daysInMonth"
                      :key="`${employee.id}-${day}`"
                      style="width: 2.1875rem; max-width: 2.1875rem;"
                      class="px-1 py-1 border-r d-flex justify-center"
                    >
                      <v-sheet
                        :color="getCellColor(employee.id, day)"
                        height="24"
                        width="24"
                        class="d-flex align-center justify-center rounded border"
                      >
                        <span class="text-caption font-weight-bold text-white" style="font-size: 0.6875rem;">{{ day }}</span>
                      </v-sheet>
                    </v-col>
                  </v-row>
                </div>
              </v-hover>
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
/* Using rem units instead of px */
.gap-3 {
  gap: 0.75rem;
}
.gap-4 {
  gap: 1rem;
}
</style>
