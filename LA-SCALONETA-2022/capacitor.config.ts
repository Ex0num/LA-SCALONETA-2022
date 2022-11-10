import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Ribato',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
		"SplashScreen": {
		  "launchAutoHide": false,
		  "showSpinner": false
		}
	}
};

export default config;
