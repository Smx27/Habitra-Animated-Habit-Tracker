import LottieView from 'lottie-react-native';

export function SuccessLottie() {
  return (
    <LottieView
      source={require('@/assets/lottie/success-bounce.json')}
      autoPlay
      loop
      style={{ width: 120, height: 120 }}
    />
  );
}
