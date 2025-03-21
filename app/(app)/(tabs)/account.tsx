import { useState, useEffect } from "react";
import { View, Keyboard } from "react-native";
import { nameSchema } from "../../../schemas/auth-schemas";
import { useSignOut } from "../../../hooks/useAuth";
import { useGetUser } from "../../../hooks/useUser";
import {
  useGetProfile,
  useUpdateProfile,
  useClearProfile,
} from "../../../hooks/useProfile";
import LoadingScreen from "../../../components/LoadingScreen";
import ErrorScreen from "../../../components/ErrorScreen";
import {
  Button,
  TextInput,
  HelperText,
  Text,
  useTheme,
} from "react-native-paper";
import { z } from "zod";
import { useErrorStore } from "../../../stores/errorStore";

export default function Account() {
  const theme = useTheme();
  const showError = useErrorStore((state) => state.showError);

  // User and profile state
  const user = useGetUser();
  const signOut = useSignOut();
  const profile = useGetProfile();
  const updateProfile = useUpdateProfile();
  const clearProfile = useClearProfile();

  // Form state
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({ name: "" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (profile.data) {
      setName(profile.data.name || "");
    }
  }, [profile.data]);

  const validateName = () => {
    try {
      nameSchema.parse(name);
      setErrors((prev) => ({ ...prev, name: "" }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, name: error.errors[0].message }));
      }
      return false;
    }
  };

  const handleSave = async () => {
    Keyboard.dismiss();
    if (validateName()) {
      try {
        await updateProfile.mutateAsync({ name });
        setIsEditing(false);
        showError("Name updated successfully");
      } catch (error) {
        const err = error as Error;
        showError(err.message || "Failed to update name");
      }
    }
  };

  const handleCancel = () => {
    if (profile.data) {
      setName(profile.data.name || "");
    }
    setIsEditing(false);
    setErrors((prev) => ({ ...prev, name: "" }));
  };

  const handleSignOut = async () => {
    try {
      await signOut.mutateAsync();
      clearProfile();
    } catch (error) {
      const err = error as Error;
      showError(err.message || "Failed to sign out");
    }
  };

  if (profile.isLoading || user.isLoading) {
    return <LoadingScreen />;
  }

  if (
    (profile.isError || user.isError) &&
    !profile.isLoading &&
    !user.isLoading
  ) {
    return (
      <ErrorScreen
        text="Error loading profile. Please try again."
        onPress={() => {
          if (profile.isError) profile.refetch();
          if (user.isError) user.refetch();
        }}
      />
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <Text>Account</Text>
      <Text>Email</Text>
      <Text>{user.data?.email || "No email available"}</Text>
      <Text>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        disabled={!isEditing || signOut.isPending}
        error={!!errors.name}
        mode="outlined"
        autoCapitalize="none"
      />
      {errors.name && (
        <HelperText type="error" visible={!!errors.name}>
          {errors.name}
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
          Edit Name
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
    </View>
  );
}
