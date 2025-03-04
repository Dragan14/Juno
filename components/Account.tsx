import { useState, useEffect } from "react";
import { View } from "react-native";
import { usernameSchema } from "../schemas/validationSchemas";
import { useUser, useSignOut } from "../hooks/useAuth";
import {
  useProfile,
  useUpdateProfile,
  useClearProfile,
} from "../hooks/useProfile";
import {
  Button,
  TextInput,
  HelperText,
  Text,
  Snackbar,
} from "react-native-paper";
import { z } from "zod";

export default function Account() {
  const user = useUser();
  const signOut = useSignOut();
  const profile = useProfile();
  const updateProfile = useUpdateProfile();
  const clearProfile = useClearProfile();

  // Form state
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Load the initial username when profile data is available
  useEffect(() => {
    if (profile.data) {
      setUsername(profile.data.username || "");
    }
  }, [profile.data]);

  // Validate the username
  const validateUsername = () => {
    try {
      usernameSchema.parse(username);
      setUsernameError("");
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setUsernameError(error.errors[0].message);
        return false;
      }
    }
  };

  // Handle saving the updated username
  const handleSave = async () => {
    if (validateUsername()) {
      try {
        await updateProfile.mutateAsync({ username });
        setIsEditing(false);
        setSnackbarMessage("Username updated successfully");
        setSnackbarVisible(true);
      } catch {
        setSnackbarMessage("Failed to update username");
        setSnackbarVisible(true);
      }
    }
  };

  // Handle canceling edits
  const handleCancel = () => {
    if (profile.data) {
      setUsername(profile.data.username || "");
    }
    setIsEditing(false);
    setUsernameError("");
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut.mutateAsync();
      clearProfile();
    } catch {
      setSnackbarMessage("Failed to sign out");
      setSnackbarVisible(true);
    }
  };

  // Loading state
  if (profile.isLoading || user.isLoading) {
    return (
      <View>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  // Error state
  if (profile.isError || user.isError) {
    return (
      <View>
        <Text>Error loading profile. Please try again.</Text>
        <Button mode="contained" onPress={() => profile.refetch()}>
          Retry
        </Button>
      </View>
    );
  }

  return (
    <View>
      <Text>Account</Text>

      {/* Email display */}
      <View>
        <Text>Email</Text>
        <Text>{user.data?.email || "No email available"}</Text>
      </View>

      {/* Username edit field */}
      <View>
        <Text>Username</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          disabled={!isEditing}
          error={!!usernameError}
          mode="outlined"
        />
        {usernameError && (
          <HelperText type="error" visible={!!usernameError}>
            {usernameError}
          </HelperText>
        )}
      </View>

      {/* Edit/Save buttons */}
      <View>
        {isEditing ? (
          <>
            <Button
              mode="contained"
              onPress={handleSave}
              loading={updateProfile.isPending}
              disabled={updateProfile.isPending}
            >
              Save
            </Button>
            <Button
              mode="outlined"
              onPress={handleCancel}
              disabled={updateProfile.isPending}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button mode="contained" onPress={() => setIsEditing(true)}>
            Edit Username
          </Button>
        )}
      </View>

      {/* Sign out button */}
      <Button
        mode="outlined"
        onPress={handleSignOut}
        loading={signOut.isPending}
        disabled={signOut.isPending}
      >
        Sign Out
      </Button>

      {/* Notification snackbar */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: "Close",
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}
