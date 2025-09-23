// import this after install `@mdi/font` package
import "@mdi/font/css/materialdesignicons.css";

import "vuetify/styles";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { createVuetify } from "vuetify";

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      themes: {
        light: {
          dark: false,
          colors: {
            // Standard Material Design colors
            primary: '#1976D2',
            secondary: '#424242',
            accent: '#82B1FF',
            error: '#FF5252',
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FFC107',
            // Custom colors for our attendance system
            present: '#4CAF50',    // Green for present
            absent: '#EF5350',     // Red for absences
            weekend: '#E0E0E0',    // Gray for weekends
            today: '#2196F3'       // Blue for current day
          }
        }
      }
    }
  });
  app.vueApp.use(vuetify);
});
