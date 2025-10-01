<template>
  <v-card>
    <v-card-text>
      <!-- Year Navigation -->
      <v-row align="center">
        <v-col cols="auto">
          <v-btn
            icon="mdi-chevron-left"
            variant="text"
            @click="$emit('previous-year')"
          ></v-btn>
        </v-col>
        <v-col cols="auto">
          <h2 class="text-h6">{{ currentYear }}</h2>
        </v-col>
        <v-col cols="auto">
          <v-btn
            icon="mdi-chevron-right"
            variant="text"
            @click="$emit('next-year')"
          ></v-btn>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="auto">
          <v-btn variant="outlined" @click="$emit('go-to-today')">Today</v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
interface Props {
  currentYear: number;
}

defineProps<Props>();

defineEmits<{
  "previous-year": [];
  "next-year": [];
  "go-to-today": [];
}>();
</script>