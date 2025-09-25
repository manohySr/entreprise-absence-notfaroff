<template>
  <v-app-bar flat color="white" density="compact" border="b" class="pa-2">
    <v-spacer></v-spacer>

    <!-- Notification Icon -->
    <v-btn
      icon="mdi-bell-outline"
      variant="text"
      @click="$emit('notification')"
    ></v-btn>

    <!-- Help Icon -->
    <v-btn
      icon="mdi-help-circle-outline"
      variant="text"
      @click="$emit('help')"
    ></v-btn>

    <!-- User Profile Menu -->
    <UserMenu
      :user-initials="userInitials"
      @profile="$emit('profile')"
      @settings="$emit('settings')"
      @logout="$emit('logout')"
    />
  </v-app-bar>
</template>

<script setup lang="ts">
import UserMenu from './UserMenu.vue';

interface Props {
  userInitials?: string;
}

withDefaults(defineProps<Props>(), {
  userInitials: 'JD'
});

defineEmits<{
  'notification': [];
  'help': [];
  'profile': [];
  'settings': [];
  'logout': [];
}>();
</script>