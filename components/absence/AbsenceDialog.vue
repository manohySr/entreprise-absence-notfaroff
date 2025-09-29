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
  cancel: [];
}>();

const absenceForm = ref();

const formData = ref<AbsenceFormData>({
  employeeId: "",
  startDate: "",
  endDate: "",
  type: "Vacation",
  reason: "",
});

const absenceTypes = [
  "Vacation",
  "Sick Leave",
  "Personal Leave",
  "Medical Leave",
  "Maternity Leave",
  "Paternity Leave",
  "Bereavement Leave",
  "Present",
  "Other",
];

// Computed to check if we're in edit mode
const isEditMode = computed(() => !!props.absenceId);

// Computed
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
      // Use local date formatting to avoid timezone issues
      const year = newDate.getFullYear();
      const month = String(newDate.getMonth() + 1).padStart(2, "0");
      const day = String(newDate.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;

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

// Watch for dialog open to initialize dates and employee
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      // Check if we're editing an existing absence
      if (props.absenceId) {
        const existingAbsence = absences.value.find(
          (a) => a.id === props.absenceId,
        );
        if (existingAbsence) {
          formData.value.employeeId = existingAbsence.employeeId;
          formData.value.startDate = existingAbsence.date;
          formData.value.endDate = existingAbsence.date;
          formData.value.type = mapAbsenceType(existingAbsence.type);
          formData.value.reason = existingAbsence.reason || "";
        }
      } else {
        // Set employee ID if provided for new absence
        if (props.employeeId) {
          formData.value.employeeId = props.employeeId;
        }
        // Set dates from selected date or use today
        if (props.selectedDate) {
          const year = props.selectedDate.getFullYear();
          const month = String(props.selectedDate.getMonth() + 1).padStart(
            2,
            "0",
          );
          const day = String(props.selectedDate.getDate()).padStart(2, "0");
          const dateStr = `${year}-${month}-${day}`;

          formData.value.startDate = dateStr;
          formData.value.endDate = dateStr;
        } else {
          const today = new Date();
          const year = today.getFullYear();
          const month = String(today.getMonth() + 1).padStart(2, "0");
          const day = String(today.getDate()).padStart(2, "0");
          const todayStr = `${year}-${month}-${day}`;

          formData.value.startDate = todayStr;
          formData.value.endDate = todayStr;
        }
      }
    }
  },
);

const mapAbsenceType = (type: string): string => {
  const typeMap: Record<string, string> = {
    sick: "Sick Leave",
    vacation: "Vacation",
    personal: "Personal Leave",
    medical: "Medical Leave",
    other: "Other",
  };
  return typeMap[type] || "Other";
};

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
  // TODO: Add validation before saving

  // Map the type back to backend format
  const reverseMapAbsenceType = (type: string): string => {
    const typeMap: Record<string, string> = {
      "Sick Leave": "sick",
      Vacation: "vacation",
      "Personal Leave": "personal",
      "Medical Leave": "medical",
      Present: "present",
      Other: "other",
    };
    return typeMap[type] || "other";
  };

  // Prepare the data for saving
  const saveData = {
    employeeId: formData.value.employeeId,
    date: formData.value.startDate,
    type: reverseMapAbsenceType(formData.value.type),
    reason: formData.value.reason,
    approved: false, // Default to false for new absences
  };

  emit("save", saveData);
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
