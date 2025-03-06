import { useState, useEffect } from "react";
import { Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usernameSchema } from "../../schemas/validationSchemas";
import { useUser, useSignOut } from "../../hooks/useAuth";
import {
  useProfile,
  useUpdateProfile,
  useClearProfile,
} from "../../hooks/useProfile";
import {
  Button,
  TextInput,
  HelperText,
  Text,
  Snackbar,
  useTheme,
  ActivityIndicator,
} from "react-native-paper";
import { z } from "zod";

export default function Account() {
  // Theme
  const theme = useTheme();

  // User and profile state
  const user = useUser();
  const signOut = useSignOut();
  const profile = useProfile();
  const updateProfile = useUpdateProfile();
  const clearProfile = useClearProfile();

  // Form state
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState({ username: "" });
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
      setErrors((prev) => ({ ...prev, username: "" }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, username: error.errors[0].message }));
      }
      return false;
    }
  };

  // Handle saving the updated username
  const handleSave = async () => {
    Keyboard.dismiss();
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
    setErrors((prev) => ({ ...prev, username: "" }));
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
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background,
        }}
      >
        <Text>Loading Profile...</Text>
        <ActivityIndicator animating={true} size="large" />
      </SafeAreaView>
    );
  }

  // Error state
  if (profile.isError || user.isError) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background,
        }}
      >
        <Text>Error loading profile. Please try again.</Text>
        <Button
          mode="contained"
          onPress={() => {
            if (profile.isError) profile.refetch();
            if (user.isError) user.refetch();
          }}
        >
          Retry
        </Button>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <Text>Account</Text>
      <Text>Email</Text>
      <Text>{user.data?.email || "No email available"}</Text>
      <Text>Username</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        disabled={!isEditing || signOut.isPending}
        error={!!errors.username}
        mode="outlined"
        autoCapitalize="none"
      />
      {errors.username && (
        <HelperText type="error" visible={!!errors.username}>
          {errors.username}
        </HelperText>
      )}
      {isEditing ? (
        <>
          <Button
            mode="contained"
            onPress={handleSave}
            loading={updateProfile.isPending}
            disabled={signOut.isPending || updateProfile.isPending}
          >
            Save
          </Button>
          <Button
            mode="outlined"
            onPress={handleCancel}
            disabled={signOut.isPending || updateProfile.isPending}
          >
            Cancel
          </Button>
        </>
      ) : (
        <Button
          mode="contained"
          onPress={() => setIsEditing(true)}
          disabled={signOut.isPending || updateProfile.isPending}
        >
          Edit Username
        </Button>
      )}
      <Button
        mode="outlined"
        onPress={handleSignOut}
        loading={signOut.isPending}
        disabled={signOut.isPending || updateProfile.isPending}
      >
        Sign Out
      </Button>
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
    </SafeAreaView>
  );
}
