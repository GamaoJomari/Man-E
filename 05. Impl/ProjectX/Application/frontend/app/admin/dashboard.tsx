import { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function AdminDashboard() {
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    email: "",
    fullName: "",
    role: "student", // Default role for new users
  });

  const handleCreateUser = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();
      if (data.success) {
        alert("User created successfully!");
        setNewUser({
          username: "",
          password: "",
          email: "",
          fullName: "",
          role: "student",
        });
      } else {
        alert(data.message || "Failed to create user");
      }
    } catch (error) {
      alert("Error creating user");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Create New User</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={newUser.fullName}
          onChangeText={(text) => setNewUser({ ...newUser, fullName: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={newUser.email}
          onChangeText={(text) => setNewUser({ ...newUser, email: text })}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={newUser.username}
          onChangeText={(text) => setNewUser({ ...newUser, username: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={newUser.password}
          onChangeText={(text) => setNewUser({ ...newUser, password: text })}
          secureTextEntry
        />
        <View style={styles.roleSelector}>
          <TouchableOpacity
            style={[
              styles.roleButton,
              newUser.role === "student" && styles.roleButtonActive,
            ]}
            onPress={() => setNewUser({ ...newUser, role: "student" })}
          >
            <Text
              style={[
                styles.roleButtonText,
                newUser.role === "student" && styles.roleButtonTextActive,
              ]}
            >
              Student
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.roleButton,
              newUser.role === "instructor" && styles.roleButtonActive,
            ]}
            onPress={() => setNewUser({ ...newUser, role: "instructor" })}
          >
            <Text
              style={[
                styles.roleButtonText,
                newUser.role === "instructor" && styles.roleButtonTextActive,
              ]}
            >
              Instructor
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleCreateUser}>
          <Text style={styles.buttonText}>Create User</Text>
        </TouchableOpacity>
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
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
  roleSelector: {
    flexDirection: "row",
    marginBottom: 15,
  },
  roleButton: {
    flex: 1,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#007AFF",
    marginHorizontal: 5,
    borderRadius: 5,
  },
  roleButtonActive: {
    backgroundColor: "#007AFF",
  },
  roleButtonText: {
    color: "#007AFF",
  },
  roleButtonTextActive: {
    color: "#fff",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
