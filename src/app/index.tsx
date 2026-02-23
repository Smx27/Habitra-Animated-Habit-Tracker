import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Habitra</Text>
      <Text style={styles.subtitle}>Dashboard coming soon.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
    padding: 24,
  },
  title: {
    color: '#f8fafc',
    fontSize: 34,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: '#cbd5e1',
    fontSize: 16,
  },
});
