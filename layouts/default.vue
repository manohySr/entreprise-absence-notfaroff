<template>
  <v-app>
    <!-- Sidebar Navigation -->
    <AppSidebar
      v-model="drawer"
      :menu-items="menuItems"
      @logout="handleLogout"
    />

    <!-- Top App Bar -->
    <AppHeader
      :user-initials="userInitials"
      @notification="handleNotification"
      @help="handleHelp"
      @profile="handleProfile"
      @settings="handleSettings"
      @logout="handleLogout"
    />

    <!-- Main Content Area -->
    <v-main>
      <v-container fluid class="pa-5">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import AppSidebar from "~/components/layout/AppSidebar.vue";
import AppHeader from "~/components/layout/AppHeader.vue";

const drawer = ref(true);
const router = useRouter();

const userInitials = ref("JD");

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

const handleNotification = () => {
  console.log("Notification clicked");
};

const handleHelp = () => {
  console.log("Help clicked");
};
</script>

<style scoped></style>

