import { useState, useEffect } from "react";
import { Keyboard } from "react-native";
import { nameSchema } from "@/schemas/auth-schemas";
import { useSignOut } from "@/api/useAuth";
import { useGetUser } from "@/api/useUser";
import { useGetProfile, useUpdateProfile } from "@/api/useProfile";
import ErrorScreen from "@/components/ErrorScreen";
import { Text } from "react-native-paper";
import { z } from "zod";
import { useToastStore } from "@/stores/toastStore";
import View from "@/components/ui/View";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";

export default function Account() {
  // console.log("Account screen rendered");
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

  if (profile.isPending || user.isPending) {
    return (
      <View
        isSafeArea
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Loading...</Text>
      </View>
    );
  }

  if (
    (profile.isError || user.isError) &&
    !profile.isPending &&
    !user.isPending
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
    <View isSafeArea>
      <Text>Account</Text>
      <Text>Email</Text>
      <Text>{user.data?.email || "No email available"}</Text>
      <Text>Name</Text>
      <TextInput
        label="Name"
        value={name}
        onChangeText={setName}
        disabled={!isEditing || signOut.isPending}
        outlined={true}
        autoCapitalize="none"
        error={!!errors.name}
        errorMessage={errors.name}
      />
      {isEditing ? (
        <>
          <Button
            onPress={handleSave}
            loading={updateProfile.isPending}
            disabled={signOut.isPending || updateProfile.isPending}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            onPress={handleCancel}
            disabled={signOut.isPending || updateProfile.isPending}
          >
            Cancel
          </Button>
        </>
      ) : (
        <Button
          onPress={() => setIsEditing(true)}
          disabled={signOut.isPending || updateProfile.isPending}
        >
          Edit Name
        </Button>
      )}
      <Button
        variant="outlined"
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
