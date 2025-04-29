import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Attendance System</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome to ProjectX</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: SIZES.xxLarge * 2,
    paddingBottom: SIZES.large,
    paddingHorizontal: SIZES.large,
    backgroundColor: COLORS.primary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
  headerText: {
    fontSize: SIZES.xLarge,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.large,
  },
  welcomeText: {
    fontSize: SIZES.large,
    color: COLORS.text,
    textAlign: 'center',
  },
});
