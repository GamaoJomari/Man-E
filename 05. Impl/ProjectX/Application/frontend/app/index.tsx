import { useState } from "react";
import { Text, View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";

export default function Index() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("student");

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, role: selectedRole }),
      });

      const data = await response.json();
      if (data.success) {
        // Navigate based on role
        switch (data.user.role) {
          case "admin":
            router.replace("/admin/dashboard");
            break;
          case "instructor":
            router.replace("/instructor/dashboard");
            break;
          case "student":
            router.replace("/student/dashboard");
            break;
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      alert("Error during login");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setIsMenuOpen(!isMenuOpen)}
      >
        <Ionicons name="menu" size={32} color="#333" />
      </TouchableOpacity>

      {isMenuOpen && (
        <View style={styles.menu}>
          <Text style={styles.menuTitle}>Select Role</Text>
          <TouchableOpacity
            style={[
              styles.roleButton,
              selectedRole === "student" && styles.roleButtonActive,
            ]}
            onPress={() => setSelectedRole("student")}
          >
            <Text
              style={[
                styles.roleButtonText,
                selectedRole === "student" && styles.roleButtonTextActive,
              ]}
            >
              Student
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.roleButton,
              selectedRole === "instructor" && styles.roleButtonActive,
            ]}
            onPress={() => setSelectedRole("instructor")}
          >
            <Text
              style={[
                styles.roleButtonText,
                selectedRole === "instructor" && styles.roleButtonTextActive,
              ]}
            >
              Instructor
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.roleButton,
              selectedRole === "admin" && styles.roleButtonActive,
            ]}
            onPress={() => setSelectedRole("admin")}
          >
            <Text
              style={[
                styles.roleButtonText,
                selectedRole === "admin" && styles.roleButtonTextActive,
              ]}
            >
              Admin
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.loginContainer}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Selected Role: {selectedRole}</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        
        {selectedRole === "admin" && (
          <TouchableOpacity 
            style={[styles.loginButton, styles.signupButton]}
            onPress={() => router.push("/auth/signup")}
          >
            <Text style={styles.loginButtonText}>Sign Up (Admin Only)</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  menuButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
  },
  menu: {
    position: "absolute",
    top: 80,
    left: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1,
    minWidth: 200,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  roleButton: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  roleButtonActive: {
    backgroundColor: "#007AFF",
  },
  roleButtonText: {
    color: "#007AFF",
    textAlign: "center",
  },
  roleButtonTextActive: {
    color: "#fff",
  },
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 10,
  },
  signupButton: {
    backgroundColor: "#4CAF50",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
