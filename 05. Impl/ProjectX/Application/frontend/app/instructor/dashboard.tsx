import { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Instructor Dashboard</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Courses</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Create New Course</Text>
        </TouchableOpacity>
        {courses.length === 0 ? (
          <Text style={styles.emptyText}>No courses yet</Text>
        ) : (
          courses.map((course) => (
            <View key={course.id} style={styles.courseCard}>
              <Text style={styles.courseName}>{course.name}</Text>
              <Text style={styles.courseDetails}>{course.description}</Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Attendance Overview</Text>
        {/* Add attendance tracking functionality here */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#007AFF",
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    marginLeft: 5,
  },
  section: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    marginTop: 10,
  },
  courseCard: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  courseName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  courseDetails: {
    color: "#666",
  },
});
