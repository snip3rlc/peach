
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.43850a35330a44149cf660c43b21fd78',
  appName: 'Peach',
  webDir: 'dist',
  server: {
    url: 'https://43850a35-330a-4414-9cf6-60c43b21fd78.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    scheme: 'Peach'
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
      signingType: undefined
    }
  }
};

export default config;
