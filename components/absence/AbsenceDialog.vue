<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="updateDialog"
    max-width="500"
  >
    <v-card class="pt-5 pb-5 pf-5">
      <v-card-title class="d-flex align-center">
        <span class="text-h5 font-weight-bold">{{
          isEditMode ? "Edit Absence" : "Create Absence"
        }}</span>
        <v-spacer></v-spacer>
        <v-btn icon variant="text" size="small" @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-subtitle class="mt-2 text-center">
        Manage absence details on {{ formattedDate }}
      </v-card-subtitle>
      <v-card-text class="pt-4">
        <v-form ref="absenceForm">
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="formData.employeeId"
                label="Employee"
                :items="formatEmployees"
                item-title="title"
                item-value="value"
                variant="outlined"
                density="compact"
                required
              ></v-select>
            </v-col>
          </v-row>

          <!-- Edit Mode Selection (only show for multi-day absences) -->
          <v-row v-if="isEditMode && isMultiDayAbsence">
            <v-col cols="12">
              <v-radio-group
                v-model="editMode"
                density="compact"
                label="What would you like to edit?"
              >
                <v-row dense gap="4">
                  <v-radio
                    label="This day only"
                    value="single"
                    color="primary"
                  />
                  <v-radio
                    label="Entire absence span"
                    value="full"
                    color="primary"
                  />
                </v-row>
              </v-radio-group>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="formData.startDate"
                label="Start Date"
                type="date"
                variant="outlined"
                density="compact"
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="formData.endDate"
                label="End Date"
                type="date"
                variant="outlined"
                density="compact"
                required
                :disabled="editMode === 'single'"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="formData.type"
                label="Type"
                :items="absenceTypes"
                variant="outlined"
                density="compact"
                required
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-textarea
                v-model="formData.reason"
                label="Reason"
                placeholder="Briefly describe the reason for absence..."
                variant="outlined"
                density="compact"
                rows="3"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="pr-5">
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="handleCancel">Cancel</v-btn>
        <v-btn color="primary" variant="flat" @click="handleSave">
          Save Changes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { Employee } from "~/types";
import { formatDateToString, validateDateRange } from "@/utils/dateUtils";
import {
  ABSENCE_TYPE_LABELS,
  mapAbsenceTypeToLabel,
  mapLabelToAbsenceType,
} from "@/types";

interface EmployeeSelectItem {
  title: string;
  value: Employee["id"];
}

interface AbsenceFormData {
  employeeId: string;
  startDate: string;
  endDate: string;
  type: string;
  reason: string;
}

const { employees } = useEmployees();
const { absences } = useAttendance();

const formatEmployees = computed<EmployeeSelectItem[]>(() =>
  (employees.value ?? []).map((employee: Employee) => ({
    title: `${employee.id} ${employee.firstName} ${employee.lastName}`,
    value: employee.id,
  })),
);

const props = defineProps<{
  modelValue: boolean;
  absenceId?: string;
  employeeId?: string;
  selectedDate?: Date;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  save: [data: AbsenceFormData];
  splitSave: [
    data: {
      originalId: string;
      clickedDate: Date;
      newAbsence: AbsenceFormData;
    },
  ];
  cancel: [];
}>();

const absenceForm = ref();

// Edit mode for multi-day absences
const editMode = ref<"single" | "full">("full");

const formData = ref<AbsenceFormData>({
  employeeId: "",
  startDate: "",
  endDate: "",
  type: "Vacation",
  reason: "",
});

const absenceTypes = ABSENCE_TYPE_LABELS;

const isEditMode = computed(() => !!props.absenceId);

const isMultiDayAbsence = computed(() => {
  if (!isEditMode.value) return false;
  const existingAbsence = absences.value.find((a) => a.id === props.absenceId);
  return (
    existingAbsence && existingAbsence.startDate !== existingAbsence.endDate
  );
});

const formattedDate = computed(() => {
  const date = props.selectedDate || new Date();
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
});

// Watch for selectedDate changes to update form
watch(
  () => props.selectedDate,
  (newDate) => {
    if (newDate) {
      const dateStr = formatDateToString(newDate);
      formData.value.startDate = dateStr;
      formData.value.endDate = dateStr;
    }
  },
  { immediate: true },
);

// Watch for employeeId changes to update form
watch(
  () => props.employeeId,
  (newEmployeeId) => {
    if (newEmployeeId) {
      formData.value.employeeId = newEmployeeId;
    }
  },
  { immediate: true },
);

// Watch editMode to update form behavior
watch(editMode, (newMode) => {
  if (newMode === "single" && props.selectedDate) {
    // Lock dates to clicked date
    const clickedDateStr = formatDateToString(props.selectedDate);
    formData.value.startDate = clickedDateStr;
    formData.value.endDate = clickedDateStr;
  } else if (newMode === "full" && props.absenceId) {
    // Restore original date range
    const existingAbsence = absences.value.find(
      (a) => a.id === props.absenceId,
    );
    if (existingAbsence) {
      formData.value.startDate = existingAbsence.startDate;
      formData.value.endDate = existingAbsence.endDate;
    }
  }
});

// Watch for dialog open to initialize dates and employee
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      // Reset edit mode to default
      editMode.value = "full";

      // Check if we're editing an existing absence
      if (props.absenceId) {
        const existingAbsence = absences.value.find(
          (a) => a.id === props.absenceId,
        );
        if (existingAbsence) {
          formData.value.employeeId = existingAbsence.employeeId;
          formData.value.startDate = existingAbsence.startDate;
          formData.value.endDate = existingAbsence.endDate;
          formData.value.type = mapAbsenceTypeToLabel(existingAbsence.type);
          formData.value.reason = existingAbsence.reason || "";
        }
      } else {
        // Set employee ID if provided for new absence
        if (props.employeeId) {
          formData.value.employeeId = props.employeeId;
        }
        // Set dates from selected date or use today
        if (props.selectedDate) {
          const dateStr = formatDateToString(props.selectedDate);
          formData.value.startDate = dateStr;
          formData.value.endDate = dateStr;
        } else {
          const todayStr = formatDateToString(new Date());
          formData.value.startDate = todayStr;
          formData.value.endDate = todayStr;
        }
      }
    }
  },
);

// Methods
const updateDialog = (value: boolean) => {
  emit("update:modelValue", value);
};

const closeDialog = () => {
  emit("update:modelValue", false);
};

const handleCancel = () => {
  emit("cancel");
  closeDialog();
  resetForm();
};

const handleSave = () => {
  // Validate date range
  if (!validateDateRange(formData.value.startDate, formData.value.endDate)) {
    // TODO: Show error message to user
    console.error("End date must be after or equal to start date");
    return;
  }

  const saveData = {
    employeeId: formData.value.employeeId,
    startDate: formData.value.startDate,
    endDate: formData.value.endDate,
    type: mapLabelToAbsenceType(formData.value.type),
    reason: formData.value.reason,
    approved: false, // Default to false for new absences
  };

  // Check if we're in single-day edit mode for a multi-day absence
  if (
    editMode.value === "single" &&
    isMultiDayAbsence.value &&
    props.selectedDate
  ) {
    // Emit split save event
    emit("splitSave", {
      originalId: props.absenceId!,
      clickedDate: props.selectedDate,
      newAbsence: saveData,
    });
  } else {
    // Regular save
    emit("save", saveData);
  }

  closeDialog();
  resetForm();
};

const resetForm = () => {
  formData.value = {
    employeeId: "",
    startDate: "",
    endDate: "",
    type: "Vacation",
    reason: "",
  };
};
</script>

<style scoped></style>
