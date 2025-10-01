<template>
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
                <tr class="separator-header">
                  <th class="col-personnel text-left">No.</th>
                  <th class="col-name text-left">First Name</th>
                  <th class="col-name text-left">Last Name</th>
                  <template
                    v-for="(dayData, index) in daysInYear"
                    :key="`month-${index}`"
                  >
                    <th
                      v-if="dayData.isFirstOfMonth"
                      :colspan="getDaysInMonth(dayData.month, currentYear)"
                      class="col-month text-center"
                    >
                      {{ dayData.monthName }}
                    </th>
                  </template>
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
                              <AttendanceCell
                                :key="`${employee.id}-${dayData.dayOfYear}-${updateKey}`"
                                :employee-id="employee.id"
                                :day-data="dayData"
                                :status="getAttendanceStatus(employee.id, dayData.date)"
                                :update-key="updateKey"
                                @click="handleCellClick"
                              />
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
</template>

<script setup lang="ts">
import { RecycleScroller } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import AttendanceCell from "./AttendanceCell.vue";
import type { Employee } from "~/types";

interface DayData {
  dayOfYear: number;
  date: Date;
  day: number;
  month: number;
  monthName: string;
  isFirstOfMonth: boolean;
}

interface Props {
  employees: Employee[];
  daysInYear: DayData[];
  currentYear: number;
  updateKey: number;
  getAttendanceStatus: (employeeId: string, date: Date) => string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "cell-click": [employeeId: string, dayData: DayData];
}>();

// Column width constants (in rem)
const COLUMN_WIDTHS = {
  personnel: 6.25, // 100px
  name: 9.375, // 150px
  day: 2.1875, // 35px
};

// Calculate minimum table width
const minTableWidth = computed(() => {
  const fixedColumnsWidth = COLUMN_WIDTHS.personnel + COLUMN_WIDTHS.name * 2;
  const daysWidth = props.daysInYear.length * COLUMN_WIDTHS.day;
  return fixedColumnsWidth + daysWidth;
});

const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const handleCellClick = (employeeId: string, dayData: DayData) => {
  emit("cell-click", employeeId, dayData);
};
</script>

<style scoped>
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
  border: 1px solid #ddd;
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

.separator-header th {
  text-align: center;
  font-weight: 700;
  font-size: 0.875rem;
  border-right: 1px solid #bbb;
  background-color: #e8e8e8;
  color: #555;
  padding: 0.8rem;
}

.separator-header th:last-child {
  border-right: none;
}

.col-month {
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

.attendance-row-wrapper {
  border-bottom: 0.0625rem solid #eee;
}

.attendance-row-wrapper:hover {
  background-color: #fafafa;
}

.attendance-row td {
  vertical-align: middle;
  height: 2.8125rem;
}

.attendance-row td:nth-child(-n + 3) {
  vertical-align: middle;
  padding-left: 0.5rem;
}

.attendance-row td:last-child {
  border-right: none;
}

.attendance-row .col-day {
  border: 1px solid #ddd;
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
  height: 100%;
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