import { router } from 'expo-router';
import SplashScreen from './components/SplashScreen';

export default function Index() {
  const handleSplashFinish = () => {
    router.replace('/(auth)/login');
  };

  return <SplashScreen onFinish={handleSplashFinish} />;
}
