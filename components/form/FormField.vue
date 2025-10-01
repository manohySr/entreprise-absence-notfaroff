<template>
  <v-row>
    <v-col :cols="cols">
      <!-- Text Field -->
      <v-text-field
        v-if="type === 'text' || type === 'date'"
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
        :label="label"
        :type="type"
        :variant="variant"
        :density="density"
        :required="required"
        :disabled="disabled"
        :placeholder="placeholder"
      />

      <!-- Select Field -->
      <v-select
        v-else-if="type === 'select'"
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
        :label="label"
        :items="items"
        :item-title="itemTitle"
        :item-value="itemValue"
        :variant="variant"
        :density="density"
        :required="required"
        :disabled="disabled"
      />

      <!-- Textarea -->
      <v-textarea
        v-else-if="type === 'textarea'"
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
        :label="label"
        :placeholder="placeholder"
        :variant="variant"
        :density="density"
        :required="required"
        :disabled="disabled"
        :rows="rows"
      />

      <!-- Radio Group -->
      <v-radio-group
        v-else-if="type === 'radio'"
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
        :label="label"
        :density="density"
        :disabled="disabled"
      >
        <v-row dense gap="4">
          <v-radio
            v-for="option in radioOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
            color="primary"
          />
        </v-row>
      </v-radio-group>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
interface RadioOption {
  label: string;
  value: string | number;
}

interface Props {
  modelValue: any;
  type: 'text' | 'date' | 'select' | 'textarea' | 'radio';
  label: string;
  cols?: number;
  variant?: string;
  density?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  rows?: number;

  // Select specific props
  items?: any[];
  itemTitle?: string;
  itemValue?: string;

  // Radio specific props
  radioOptions?: RadioOption[];
}

withDefaults(defineProps<Props>(), {
  cols: 12,
  variant: 'outlined',
  density: 'compact',
  required: false,
  disabled: false,
  rows: 3,
  itemTitle: 'title',
  itemValue: 'value',
});

defineEmits<{
  'update:modelValue': [value: any];
}>();
</script>