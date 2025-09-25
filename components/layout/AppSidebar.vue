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
      <div class="text-h5 font-weight-bold">{{ appName }}</div>
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

