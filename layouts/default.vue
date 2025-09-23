<template>
  <v-app>
    <!-- Sidebar Navigation -->
    <!-- v-model controls visibility, permanent keeps it always visible -->
    <v-navigation-drawer
      v-model="drawer"
      permanent
      color="grey-lighten-4"
      width="300"
    >
      <!-- App Logo/Title -->
      <div class="pa-4 text-center">
        <div class="text-h5 font-weight-bold">NOTFAROFF</div>
      </div>

      <!-- Navigation Menu Items -->
      <!-- NuxtLink provides client-side navigation without page reload -->
      <v-list density="compact" nav>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.route"
          :prepend-icon="item.icon"
          :title="item.title"
          color="primary"
        />
      </v-list>

      <!-- Logout button pinned to bottom -->
      <template v-slot:append>
        <div class="pa-4">
          <v-btn
            block
            color="primary"
            variant="flat"
            prepend-icon="mdi-logout"
            @click="handleLogout"
          >
            Log Out
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Top App Bar -->
    <v-app-bar flat color="white" density="compact" border="b" class="pa-2">
      <v-spacer></v-spacer>

      <!-- Notification Icon -->
      <v-btn icon="mdi-bell-outline" variant="text"></v-btn>

      <!-- Help Icon -->
      <v-btn icon="mdi-help-circle-outline" variant="text"></v-btn>

      <!-- User Profile Menu -->
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props" class="ml-2">
            <v-avatar size="32" color="primary">
              <span class="text-white">JD</span>
            </v-avatar>
          </v-btn>
        </template>

        <!-- Dropdown menu content -->
        <v-list>
          <v-list-item @click="handleProfile">
            <v-list-item-title>My Profile</v-list-item-title>
          </v-list-item>
          <v-list-item @click="handleSettings">
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="handleLogout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Main Content Area -->
    <!-- slot is where page content will be inserted -->
    <v-main>
      <v-container fluid class="pa-8">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
const drawer = ref(true);

const router = useRouter();

const menuItems = [
  {
    title: "Dashboard",
    icon: "mdi-view-dashboard",
    route: "/",
  },
  {
    title: "Employees",
    icon: "mdi-account-group",
    route: "/employees",
  },
  {
    title: "Reports",
    icon: "mdi-chart-bar",
    route: "/reports",
  },
  {
    title: "Settings",
    icon: "mdi-cog",
    route: "/settings",
  },
];

const handleLogout = () => {
  console.log("log out");
};

const handleProfile = () => {
  router.push("/profile");
};

const handleSettings = () => {
  router.push("/settings");
};
</script>

<style scoped></style>
