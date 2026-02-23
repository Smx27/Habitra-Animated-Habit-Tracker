import * as Haptics from 'expo-haptics';

export async function triggerSuccessHaptic() {
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}
