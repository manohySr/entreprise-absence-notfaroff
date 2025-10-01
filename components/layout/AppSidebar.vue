<template>
  <v-navigation-drawer
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    permanent
    color="grey-lighten-4"
    width="300"
  >
    <!-- App Logo/Title -->
    <div class="pa-4 text-center">
      <div class="logo-text">{{ appName }}</div>
    </div>

    <!-- Navigation Menu Items -->
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
          @click="$emit('logout')"
        >
          Log Out
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
interface MenuItem {
  title: string;
  icon: string;
  route: string;
}

interface Props {
  modelValue?: boolean;
  menuItems?: MenuItem[];
  appName?: string;
}

withDefaults(defineProps<Props>(), {
  modelValue: true,
  appName: "NOTFAROFF",
  menuItems: () => [],
});

defineEmits<{
  "update:modelValue": [value: boolean];
  logout: [];
}>();
</script>

<style scoped>
.logo-text {
  font-family: "Zen Tokyo Zoo", cursive;
  font-size: 1.8rem;
  font-weight: 400;
  letter-spacing: 0.15em;
  color: #1976d2;
  text-transform: uppercase;
  line-height: 1.1;
  margin: 0.5rem 0;
}
</style>
