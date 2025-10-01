import '@fontsource/zen-tokyo-zoo'

export default defineNuxtPlugin(() => {
  // Preload font to prevent FOUT (Flash of Unstyled Text)
  if (process.client) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = '/node_modules/@fontsource/zen-tokyo-zoo/files/zen-tokyo-zoo-latin-400-normal.woff2';
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }
})