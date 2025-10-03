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

    <!-- Attendance Header with Navigation -->
    <AttendanceHeader
      :current-year="currentYear"
      @previous-year="previousYear"
      @next-year="nextYear"
      @go-to-today="goToToday"
    />

    <!-- Attendance Table -->
    <AttendanceTable
      :employees="employees"
      :days-in-year="daysInYear"
      :current-year="currentYear"
      :update-key="updateKey"
      :get-attendance-status="getAttendanceStatus"
      @cell-click="handleCellClick"
    />

    <!-- Add Absence Dialog -->
    <AbsenceDialog
      v-model="showAddAbsenceDialog"
      :absence-id="selectedAbsenceId"
      :employee-id="selectedEmployeeId"
      :selected-date="selectedAbsenceDate"
      @save="handleSaveAbsence"
      @split-save="handleSplitSaveAbsence"
      @cancel="handleCancelAbsence"
    />
  </div>
</template>

<script setup lang="ts">
import AbsenceDialog from "~/components/absence/AbsenceDialog.vue";
import AttendanceHeader from "~/components/attendance/AttendanceHeader.vue";
import AttendanceTable from "~/components/attendance/AttendanceTable.vue";

// Get data from our stores
const { employees } = useEmployeeStore();
const {
  absences,
  getAttendanceStatus,
  getAbsenceByEmployeeAndDate,
  addAbsence,
  updateAbsence,
  deleteAbsence,
  splitAbsenceAtDate,
} = useAttendanceStore();

// Use table composable for table-related state and methods
const {
  currentYear,
  daysInYear,
  updateKey,
  previousYear,
  nextYear,
  goToToday,
  forceUpdate,
} = useTable();

// Use dialog composable for dialog management
const {
  isOpen: showAddAbsenceDialog,
  selectedId: selectedAbsenceId,
  selectedEmployeeId,
  selectedDate: selectedAbsenceDate,
  openDialog,
  closeDialog,
} = useDialog();

// Methods
const handleCellClick = (employeeId: string, dayData: any) => {
  // Check if there's an existing absence for this employee and date
  const existingAbsence = getAbsenceByEmployeeAndDate(employeeId, dayData.date);

  // Open dialog with appropriate data
  openDialog({
    selectedId: existingAbsence?.id,
    selectedEmployeeId: employeeId,
    selectedDate: dayData.date,
  });
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

  // Close dialog and force update the grid
  closeDialog();
  forceUpdate();

  // TODO: Success notification
};

const handleSplitSaveAbsence = (data: any) => {
  console.log("Split save absence:", data);

  // Find the original absence
  const originalAbsence = absences.value.find(a => a.id === data.originalId);
  if (!originalAbsence) {
    console.error("Original absence not found");
    return;
  }

  // Get the remaining absence ranges after splitting
  const remainingRanges = splitAbsenceAtDate(originalAbsence, data.clickedDate);

  // Delete the original absence
  deleteAbsence(data.originalId);

  // Only add new absence if type is NOT "present"
  // If type is "present", we don't create any absence (day becomes present)
  if (data.newAbsence.type !== "present") {
    addAbsence(data.newAbsence);
    console.log("Created new absence for clicked date:", data.newAbsence);
  } else {
    console.log("Marked clicked date as present (no absence created)");
  }

  // Add any remaining ranges
  remainingRanges.forEach(range => addAbsence(range));

  // Close dialog and force update the grid
  closeDialog();
  forceUpdate();

  console.log("Split save completed");
};

const handleCancelAbsence = () => {
  console.log("Absence dialog cancelled");
  closeDialog();
};

// Watch for changes in absences to ensure live updates
watch(
  absences,
  () => {
    console.log("Absences updated, total:", absences.value.length);
    forceUpdate();
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
</style>
