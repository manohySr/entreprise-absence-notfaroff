<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn icon v-bind="props" class="ml-2">
        <v-avatar size="32" color="primary">
          <span class="text-white">{{ userInitials }}</span>
        </v-avatar>
      </v-btn>
    </template>

    <!-- Dropdown menu content -->
    <v-list>
      <v-list-item @click="$emit('profile')">
        <v-list-item-title>My Profile</v-list-item-title>
      </v-list-item>
      <v-list-item @click="$emit('settings')">
        <v-list-item-title>Settings</v-list-item-title>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item @click="$emit('logout')">
        <v-list-item-title>Logout</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
interface Props {
  userInitials?: string;
}

withDefaults(defineProps<Props>(), {
  userInitials: 'JD'
});

defineEmits<{
  'profile': [];
  'settings': [];
  'logout': [];
}>();
</script>