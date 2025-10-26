import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import type { LoginRequest, RegisterRequest } from "../../store/api/authApi";

export const AuthExample: React.FC = () => {
  const {
    user,
    isAuthenticated,
    isLoginLoading,
    isRegisterLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearAuthError,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showProfile, setShowProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const [loginForm, setLoginForm] = useState<LoginRequest>({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState<RegisterRequest>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(loginForm);
      setLoginForm({ email: "", password: "" });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(registerForm);
      setRegisterForm({ name: "", email: "", password: "", confirmPassword: "" });
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(profileForm);
      setShowProfile(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await changePassword(passwordForm);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowChangePassword(false);
      alert("Password changed successfully!");
    } catch (error) {
      console.error("Password change failed:", error);
    }
  };

  if (isAuthenticated && user) {
    return (
      <div className="auth-container">
        <div className="user-dashboard">
          <h2>Welcome, {user.name}!</h2>
          <div className="user-info">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role || "User"}</p>
            {user.createdAt && (
              <p><strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
            )}
          </div>

          <div className="actions">
            <button onClick={() => setShowProfile(!showProfile)}>
              {showProfile ? "Cancel" : "Edit Profile"}
            </button>
            <button onClick={() => setShowChangePassword(!showChangePassword)}>
              {showChangePassword ? "Cancel" : "Change Password"}
            </button>
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </div>

          {showProfile && (
            <form onSubmit={handleUpdateProfile} className="profile-form">
              <h3>Update Profile</h3>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  required
                />
              </div>
              <button type="submit">Update Profile</button>
            </form>
          )}

          {showChangePassword && (
            <form onSubmit={handleChangePassword} className="password-form">
              <h3>Change Password</h3>
              <div className="form-group">
                <label>Current Password:</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password:</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password:</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  required
                />
              </div>
              <button type="submit" disabled={isChangePasswordLoading}>
                {isChangePasswordLoading ? "Changing..." : "Change Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-tabs">
        <button
          className={activeTab === "login" ? "active" : ""}
          onClick={() => setActiveTab("login")}
        >
          Login
        </button>
        <button
          className={activeTab === "register" ? "active" : ""}
          onClick={() => setActiveTab("register")}
        >
          Register
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={clearAuthError}>×</button>
        </div>
      )}

      {activeTab === "login" ? (
        <form onSubmit={handleLogin} className="auth-form">
          <h2>Login</h2>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" disabled={isLoginLoading}>
            {isLoginLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="auth-form">
          <h2>Register</h2>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={registerForm.name}
              onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={registerForm.email}
              onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={registerForm.password}
              onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm Password:</label>
            <input
              type="password"
              value={registerForm.confirmPassword}
              onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
              required
            />
          </div>
          <button type="submit" disabled={isRegisterLoading}>
            {isRegisterLoading ? "Registering..." : "Register"}
          </button>
        </form>
      )}
    </div>
  );
};