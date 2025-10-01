<template>
  <div>
    <!-- Loading Screen -->
    <Transition name="fade" mode="out-in">
      <LoadingScreen v-if="isLoading" :loading-text="loadingText" />
      <div v-else>
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import LoadingScreen from "~/components/LoadingScreen.vue";

const { isLoading, loadingText, simulateLoadingSteps } = useAppLoading();

onMounted(() => {
  simulateLoadingSteps();
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
