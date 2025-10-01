<template>
  <div class="loading-screen">
    <div class="loading-content">
      <!-- Logo -->
      <div class="logo-container">
        <div class="logo-text" :class="{ 'font-loaded': fontLoaded }">NOTFAROFF</div>
      </div>

      <!-- Loading Animation -->
      <div class="loader-container animate-fade-in-delay-2">
        <div class="loading-text">{{ loadingText }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  loadingText?: string;
}

withDefaults(defineProps<Props>(), {
  loadingText: "Loading...",
});

const fontLoaded = ref(false);

onMounted(async () => {
  try {
    // Wait for font to load
    await document.fonts.load('400 3.5rem "Zen Tokyo Zoo"');
    fontLoaded.value = true;
  } catch (error) {
    console.warn('Font loading failed, showing fallback');
    fontLoaded.value = true; // Show anyway
  }
});
</script>

<style scoped>
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(d, d, d, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  overflow: hidden;
}

.loading-content {
  text-align: center;
  color: #1976d2;
  position: relative;
  z-index: 2;
}

.logo-container {
  margin-bottom: 3rem;
}

.logo-text {
  font-family: "Zen Tokyo Zoo", monospace;
  font-size: 3.5rem;
  font-weight: 400;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  line-height: 1.1;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  /* Hide until font loads */
  visibility: hidden;
  transition: all 0.3s ease-in-out;
}

.logo-text.font-loaded {
  visibility: visible;
  animation: fadeInSmooth 0.6s ease-out forwards;
}

.logo-subtitle {
  font-size: 1.1rem;
  font-weight: 300;
  letter-spacing: 0.1em;
  opacity: 0.9;
  text-transform: uppercase;
}

.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.loading-text {
  font-size: 1rem;
  font-weight: 400;
  color: black;
  letter-spacing: 0.05em;
  opacity: 0.9;
  animation: pulse 2s ease-in-out infinite;
  min-height: 1.2rem;
}

.version-text {
  font-size: 0.8rem;
  font-weight: 300;
  opacity: 0.6;
  margin-top: 0.5rem;
}

/* Background decoration */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

/* Animations */
@keyframes pulse {
  0%,
  100% {
    opacity: 0.9;
  }
  50% {
    opacity: 1;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-20px) rotate(120deg);
  }
  66% {
    transform: translateY(20px) rotate(240deg);
  }
}

.animate-fade-in {
  animation: fadeIn 1s ease-out;
}

.animate-fade-in-delay {
  animation: fadeIn 1s ease-out 0.3s both;
}

.animate-fade-in-delay-2 {
  animation: fadeIn 1s ease-out 0.6s both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInSmooth {
  from {
    opacity: 0;
    transform: translateY(15px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .logo-text {
    font-size: 2.5rem;
  }

  .logo-subtitle {
    font-size: 0.9rem;
  }
}
</style>
