import { useState } from "react";
import { Keyboard, Platform } from "react-native";
import { router } from "expo-router";
import { passwordSchema } from "@/schemas/auth-schemas";
import { useUpdatePassword } from "@/api/useAuth";
import { z } from "zod";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";
import SafeAreaView from "@/components/ui/SafeAreaView";
import { Lock, Eye, EyeOff } from "lucide-react-native";
import { useToast } from "@/context/ui/ToastContext";

export default function ResetPasswordScreen() {
  console.log("Reset Password screen rendered");
  const { showToast } = useToast();
  const updatePassword = useUpdatePassword();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({ password: "", confirmPassword: "" });
  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false,
  });
  const [passwordVisible, setPasswordVisible] = useState({
    password: false,
    confirmPassword: false,
  });

  const togglePasswordVisibility = (field: "password" | "confirmPassword") => {
    setPasswordVisible((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validatePassword = () => {
    try {
      passwordSchema.parse(password);
      setErrors((prev) => ({ ...prev, password: "" }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, password: error.errors[0].message }));
      }
      return false;
    }
  };

  const validateConfirmPassword = () => {
    if (confirmPassword !== password) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    return true;
  };

  const validateForm = () => {
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();
    return isPasswordValid && isConfirmPasswordValid;
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
    if (!validateForm()) return;
    try {
      await updatePassword.mutateAsync(password);
      showToast({
        message: "Password updated successfully!",
        variant: "success",
      });
      router.replace("/(app)/");
    } catch (error) {
      showToast({
        message:
          error instanceof Error
            ? error.message
            : "Failed to update password. Please try again.",
        variant: "error",
      });
    }
  };

  const content = (
    <SafeAreaView>
      <View
        style={{
          flex: 1,
          width: "100%",
          maxWidth: 800,
          paddingHorizontal: 10,
          marginHorizontal: "auto",
          marginTop: 10,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 8,
          }}
        >
          Set new password
        </Text>
        <Text style={{ textAlign: "center", marginBottom: 24 }}>
          Choose a strong password for your account.
        </Text>
        <TextInput
          topLabel="New Password"
          leftIcon={<Lock />}
          rightIcon={
            passwordVisible.password ? (
              <Eye onPress={() => togglePasswordVisibility("password")} />
            ) : (
              <EyeOff onPress={() => togglePasswordVisibility("password")} />
            )
          }
          onChangeText={(val) => {
            setTouched((prev) => ({ ...prev, password: true }));
            setPassword(val);
          }}
          onBlur={() => touched.password && validatePassword()}
          value={password}
          secureTextEntry={!passwordVisible.password}
          placeholder="New password"
          autoCapitalize="none"
          error={!!errors.password}
          errorMessage={errors.password}
          retainErrorMessageSpace={true}
          autoComplete="password-new"
        />
        <TextInput
          topLabel="Confirm Password"
          leftIcon={<Lock />}
          rightIcon={
            passwordVisible.confirmPassword ? (
              <Eye
                onPress={() => togglePasswordVisibility("confirmPassword")}
              />
            ) : (
              <EyeOff
                onPress={() => togglePasswordVisibility("confirmPassword")}
              />
            )
          }
          onChangeText={(val) => {
            setTouched((prev) => ({ ...prev, confirmPassword: true }));
            setConfirmPassword(val);
          }}
          onBlur={() => touched.confirmPassword && validateConfirmPassword()}
          value={confirmPassword}
          secureTextEntry={!passwordVisible.confirmPassword}
          placeholder="Confirm new password"
          autoCapitalize="none"
          error={!!errors.confirmPassword}
          errorMessage={errors.confirmPassword}
          retainErrorMessageSpace={true}
        />
        <Button
          onPress={handleSubmit}
          loading={updatePassword.isPending}
          style={{ marginTop: 15 }}
        >
          Update Password
        </Button>
      </View>
    </SafeAreaView>
  );

  if (Platform.OS === "web") {
    return (
      <form
        onSubmit={(e) => e.preventDefault()}
        style={{ display: "flex", flex: 1 }}
      >
        {content}
      </form>
    );
  }
  return content;
}
