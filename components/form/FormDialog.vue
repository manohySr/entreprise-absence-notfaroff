<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :max-width="maxWidth"
    :persistent="persistent"
  >
    <v-card class="pt-5 pb-5 pf-5">
      <!-- Header -->
      <v-card-title class="d-flex align-center">
        <span class="text-h5 font-weight-bold">{{ title }}</span>
        <v-spacer></v-spacer>
        <v-btn
          v-if="showCloseButton"
          icon
          variant="text"
          size="small"
          @click="handleClose"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <!-- Subtitle -->
      <v-card-subtitle v-if="subtitle" class="mt-2 text-center">
        {{ subtitle }}
      </v-card-subtitle>

      <!-- Content -->
      <v-card-text class="pt-4">
        <v-form ref="form">
          <slot />
        </v-form>
      </v-card-text>

      <!-- Actions -->
      <v-card-actions class="pr-5">
        <v-spacer></v-spacer>
        <slot name="actions">
          <v-btn variant="text" @click="handleCancel">
            {{ cancelText }}
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            @click="handleSave"
            :loading="saving"
          >
            {{ saveText }}
          </v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean;
  title: string;
  subtitle?: string;
  maxWidth?: string | number;
  persistent?: boolean;
  showCloseButton?: boolean;
  cancelText?: string;
  saveText?: string;
  saving?: boolean;
}

withDefaults(defineProps<Props>(), {
  maxWidth: 500,
  persistent: false,
  showCloseButton: true,
  cancelText: 'Cancel',
  saveText: 'Save Changes',
  saving: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'save': [];
  'cancel': [];
  'close': [];
}>();

const form = ref();

const handleSave = () => {
  emit('save');
};

const handleCancel = () => {
  emit('cancel');
  emit('update:modelValue', false);
};

const handleClose = () => {
  emit('close');
  emit('update:modelValue', false);
};

const validate = () => {
  return form.value?.validate();
};

defineExpose({
  validate,
  form,
});
</script>