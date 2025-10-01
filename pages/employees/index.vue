<template>
  <div>
    <!-- Page Header -->
    <v-row class="mt-2 mb-4" align="center">
      <v-col>
        <h1 class="text-h4 font-weight-bold">Employees</h1>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" prepend-icon="mdi-plus"> Add Employee </v-btn>
      </v-col>
    </v-row>

    <!-- Search and Filter Bar -->
    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Search employees..."
          variant="outlined"
          density="compact"
          clearable
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          v-model="selectedDepartment"
          :items="departments"
          label="Department"
          variant="outlined"
          density="compact"
          clearable
        ></v-select>
      </v-col>
    </v-row>

    <!-- Employee Table -->
    <v-card>
      <v-data-table
        :headers="headers"
        :items="filteredEmployees"
        :search="search"
        :items-per-page="10"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon size="small" class="mr-2" @click="editEmployee(item)">
            mdi-pencil
          </v-icon>
          <v-icon size="small" @click="deleteEmployee(item)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup lang="ts">
// Use the employees composable
const { employees } = useEmployees();

// Component state
const search = ref("");
const selectedDepartment = ref(null);

// Table headers configuration
const headers = [
  { title: "ID", value: "id", key: "id" },
  { title: "First Name", value: "firstName", key: "firstName" },
  { title: "Last Name", value: "lastName", key: "lastName" },
  { title: "Department", value: "department", key: "department" },
  { title: "Email", value: "email", key: "email" },
  { title: "Actions", value: "actions", key: "actions", sortable: false },
];

// Get unique departments for filter
const departments = computed(() => {
  const depts = new Set(
    employees.value.map((e) => e.department).filter(Boolean),
  );
  return Array.from(depts);
});

// Filter employees based on department selection
const filteredEmployees = computed(() => {
  if (!selectedDepartment.value) return employees.value;
  return employees.value.filter(
    (e) => e.department === selectedDepartment.value,
  );
});

// Methods
const editEmployee = (employee: any) => {
  console.log("Edit employee:", employee);
  // Will implement edit dialog later
};

const deleteEmployee = (employee: any) => {
  console.log("Delete employee:", employee);
  // Will implement delete confirmation later
};
</script>
