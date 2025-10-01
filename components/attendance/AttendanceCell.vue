<template>
  <div class="col-day">
    <v-sheet
      :color="cellColor"
      class="attendance-cell"
      rounded
      :style="cellStyle"
      @click="handleClick"
    >
      <span class="text-caption font-weight-bold">{{ dayData.day }}</span>
    </v-sheet>
  </div>
</template>

<script setup lang="ts">
import type { AttendanceStatus } from "~/types";
import { isWeekend } from "@/utils/dateUtils";

interface DayData {
  dayOfYear: number;
  date: Date;
  day: number;
  month: number;
  monthName: string;
  isFirstOfMonth: boolean;
}

interface Props {
  employeeId: string;
  dayData: DayData;
  status: AttendanceStatus;
  updateKey?: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  click: [employeeId: string, dayData: DayData];
}>();

const cellColor = computed(() => {
  const colorMap = {
    present: "present",
    absent: "absent",
    weekend: "weekend",
    today: "today",
    holiday: "info",
  };

  return colorMap[props.status] || "transparent";
});

const cellStyle = computed(() => {
  return isWeekend(props.dayData.date)
    ? "cursor: not-allowed"
    : "cursor: pointer";
});

const handleClick = () => {
  if (!isWeekend(props.dayData.date)) {
    emit("click", props.employeeId, props.dayData);
  }
};
</script>

<style scoped>
.col-day {
  padding: 0 !important;
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
}

.attendance-cell {
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0;
}

.attendance-cell .text-caption {
  font-size: 0.75rem;
  color: white;
}
</style>