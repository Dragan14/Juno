import { useState, useEffect } from "react";
import { Keyboard } from "react-native";
import { nameSchema } from "@/schemas/auth-schemas";
import { useSignOut } from "@/api/useAuth";
import { useGetUser } from "@/api/useUser";
import { useGetProfile, useUpdateProfile } from "@/api/useProfile";
import { z } from "zod";
import SafeAreaView from "@/components/ui/SafeAreaView";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import { Ionicons } from "@expo/vector-icons";
import { useToast } from "@/context/ToastContext";
import ErrorScreen from "@/components/ErrorScreen";

export default function Account() {
  console.log("Account screen rendered");

  const { showToast } = useToast();

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
      // Only update if name has changed
      if (name !== (profile.data?.name || "")) {
        console.log("Updating name to:", name);
        await updateProfile.mutateAsync({ name });
      }
      setIsEditing(false);
      showToast({
        message: "Name updated successfully",
        position: "top",
        variant: "success",
      });
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
      <SafeAreaView
        disableBottomSafeArea={true}
        disableTopSafeArea={true}
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (
    (profile.isError || user.isError) &&
    !profile.isPending &&
    !user.isPending
  ) {
    return (
      <SafeAreaView disableBottomSafeArea={true} disableTopSafeArea={true}>
        <ErrorScreen
          text="Error loading profile"
          onPress={async () => {
            if (profile.isError) await profile.refetch();
            if (user.isError) await user.refetch();
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView disableBottomSafeArea={true} disableTopSafeArea={true}>
      <View
        style={{
          flex: 1,
          maxWidth: 800,
          width: "100%",
          paddingHorizontal: 10,
          marginHorizontal: "auto",
          marginTop: 10,
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 18,
            marginBottom: 5,
          }}
        >
          Email
        </Text>
        <Text
          style={{
            marginBottom: 20,
          }}
        >
          {user.data?.email || "No email available"}
        </Text>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 18,
            marginBottom: 5,
          }}
        >
          Name
        </Text>
        <TextInput
          value={name}
          onChangeText={setName}
          disabled={!isEditing || signOut.isPending || updateProfile.isPending}
          variant="solid"
          autoCapitalize="words"
          error={!!errors.name}
          errorMessage={errors.name}
          retainErrorMessageSpace={true}
          leftIcon={
            <Ionicons
              name={isEditing ? "checkmark-circle" : "pencil"}
              onPress={() => {
                if (isEditing) {
                  Keyboard.dismiss();
                  handleSave();
                } else {
                  setIsEditing(true);
                }
              }}
            />
          }
          rightIcon={
            isEditing ? (
              <Ionicons
                name="close-circle"
                onPress={() => {
                  Keyboard.dismiss();
                  handleCancel();
                }}
              />
            ) : undefined
          }
        />
        <Button
          onPress={async () => {
            await signOut.mutateAsync();
          }}
          style={{
            width: 300,
            marginHorizontal: "auto",
            marginTop: 10,
          }}
        >
          Sign Out
        </Button>
      </View>
    </SafeAreaView>
  );
}
