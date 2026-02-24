import * as Haptics from 'expo-haptics';

export async function triggerSuccessHaptic() {
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

export async function triggerImpact() {
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export async function triggerMilestoneHaptic() {
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
}
