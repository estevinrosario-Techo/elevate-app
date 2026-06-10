import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.elevate.tasks',
  appName: 'Elévate',
  webDir: 'dist/elevate-app/browser',
  server: {
    androidScheme: 'https',
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#1A3A5C',
    },
  },
};

export default config;
