import { useState, useEffect } from "react";
import { View, Keyboard } from "react-native";
import { nameSchema } from "../../../schemas/auth-schemas";
import { useSignOut } from "../../../hooks/useAuth";
import { useGetUser } from "../../../hooks/useUser";
import { useGetProfile, useUpdateProfile } from "../../../hooks/useProfile";
import LoadingScreen from "../../../components/LoadingScreen";
import ErrorScreen from "../../../components/ErrorScreen";
import { Button, TextInput, HelperText, Text } from "react-native-paper";
import { z } from "zod";
import { useToastStore } from "../../../stores/toastStore";
import { useThemeStore } from "@/stores/themeStore";

export default function Account() {
  const theme = useThemeStore((state) => state.theme);
  const showToast = useToastStore((state) => state.showToast);

  // User and profile state
  const user = useGetUser();
  const signOut = useSignOut();
  const profile = useGetProfile();
  const updateProfile = useUpdateProfile();

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
      await updateProfile.mutateAsync({ name });
      setIsEditing(false);
      showToast("Name updated successfully");
    }
  };

  const handleCancel = () => {
    if (profile.data) {
      setName(profile.data.name || "");
    }
    setIsEditing(false);
    setErrors((prev) => ({ ...prev, name: "" }));
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
        onPress={async () => {
          if (profile.isError) await profile.refetch();
          if (user.isError) await user.refetch();
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
        onPress={async () => {
          await signOut.mutateAsync();
        }}
        loading={signOut.isPending}
        disabled={signOut.isPending || updateProfile.isPending}
      >
        Sign Out
      </Button>
    </View>
  );
}
