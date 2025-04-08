import { useState, useEffect } from "react";
import { Keyboard } from "react-native";
import { nameSchema } from "@/schemas/auth-schemas";
import { useSignOut } from "@/api/useAuth";
import { useGetUser } from "@/api/useUser";
import { useGetProfile, useUpdateProfile } from "@/api/useProfile";
import ErrorScreen from "@/components/ErrorScreen";
import { z } from "zod";
import { useToastStore } from "@/stores/toastStore";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import { SafeAreaView } from "@/components/ui/SafeAreaView";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import Icon from "@/components/ui/Icon";

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
      <SafeAreaView
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
    <SafeAreaView disableBottomSafeArea={true}>
      <View
        style={{
          flex: 1,
          maxWidth: 800,
          width: "100%",
          paddingHorizontal: 10,
          marginHorizontal: "auto",
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 32,
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          Account
        </Text>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 20,
            marginBottom: 10,
          }}
        >
          Email
        </Text>
        <Text
          style={{
            marginBottom: 15,
          }}
        >
          {user.data?.email || "No email available"}
        </Text>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 20,
            marginBottom: 10,
          }}
        >
          Name
        </Text>
        <TextInput
          value={name}
          onChangeText={setName}
          disabled={!isEditing || signOut.isPending || updateProfile.isPending}
          outlined={true}
          autoCapitalize="none"
          error={!!errors.name}
          errorMessage={errors.name}
          rightIcons={[
            <Icon
              name={isEditing ? "save" : "pencil"}
              size={24}
              onPress={() => {
                if (isEditing) {
                  Keyboard.dismiss();
                  handleSave();
                } else {
                  setIsEditing(true);
                }
              }}
            />,
            isEditing ? (
              <Icon
                name={"close-circle"}
                size={24}
                onPress={handleCancel}
                style={{ marginLeft: 10 }}
              />
            ) : null,
          ]}
        />
        <Button
          variant="outlined"
          onPress={async () => {
            await signOut.mutateAsync();
          }}
          loading={signOut.isPending}
          disabled={signOut.isPending || updateProfile.isPending}
          style={{
            width: 300,
            marginHorizontal: "auto",
            marginVertical: "auto",
            marginBottom: 50,
          }}
        >
          Sign Out
        </Button>
      </View>
    </SafeAreaView>
  );
}
