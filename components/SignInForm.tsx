import { useState } from "react";
import { Keyboard, PixelRatio, Platform, ScrollView } from "react-native";
import { useSignIn, useGoogleSignIn, useAppleSignIn } from "@/api/useAuth";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import View from "@/components/ui/View";
import { emailSchema } from "@/schemas/auth-schemas";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff } from "lucide-react-native";
import { useAlert } from "@/context/ui/AlertContext";
import { useToast } from "@/context/ui/ToastContext";
import { useTheme } from "@/context/ui/ThemeContext";
import EmailVerificationAlert from "@/components/alerts/EmailVerificationAlert";
import ForgotPasswordAlert from "@/components/alerts/ForgotPasswordAlert";
import * as AppleAuthentication from "expo-apple-authentication";
import { Ionicons } from "@expo/vector-icons";

export default function SignInForm() {
  const { showAlert, hideAlert } = useAlert();
  const { showToast } = useToast();
  const { isDark } = useTheme();
  const signIn = useSignIn();
  const googleSignIn = useGoogleSignIn();
  const appleSignIn = useAppleSignIn();
  const appleButtonHeight = Math.round(34 * PixelRatio.getFontScale());

  // Form state
  const [email, setEmail] = useState(process.env.EXPO_PUBLIC_DEMO_EMAIL!);
  const [password, setPassword] = useState("Password123!");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
  });
  const [touched, setTouched] = useState({
    email: false,
  });
  const [containerHeight, setContainerHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  const shouldScroll = contentHeight > containerHeight + 1;
  const isWeb = Platform.OS === "web";

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  // Validate email input
  const validateEmail = () => {
    try {
      emailSchema.parse(email);
      setErrors((prev) => ({ ...prev, email: "" }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, email: error.errors[0].message }));
      }
      return false;
    }
  };

  // Handle forgot password
  const handleForgotPassword = () => {
    Keyboard.dismiss();
    showAlert({
      content: <ForgotPasswordAlert initialEmail={email} onClose={hideAlert} />,
    });
  };

  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    Keyboard.dismiss();
    try {
      await googleSignIn.mutateAsync();
    } catch (error) {
      showToast({
        message:
          error instanceof Error
            ? error.message
            : "Failed to sign in with Google. Please try again.",
        variant: "error",
      });
    }
  };

  // Handle Apple sign in
  const handleAppleSignIn = async () => {
    Keyboard.dismiss();
    try {
      await appleSignIn.mutateAsync();
    } catch (error) {
      showToast({
        message:
          error instanceof Error
            ? error.message
            : "Failed to sign in with Apple. Please try again.",
        variant: "error",
      });
    }
  };

  // Handle sign in
  const handleSignIn = async () => {
    Keyboard.dismiss();
    if (validateEmail()) {
      const submittedEmail = email;
      try {
        await signIn.mutateAsync({ email, password });
        // Reset form
        setEmail("");
        setPassword("");
        setErrors({ email: "" });
        setTouched({ email: false });
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.toLowerCase().includes("email not confirmed")
        ) {
          showAlert({
            content: (
              <EmailVerificationAlert
                email={submittedEmail}
                onClose={hideAlert}
                initialCooldown={0}
              />
            ),
          });
        } else {
          showToast({
            message:
              error instanceof Error
                ? error.message
                : "Failed to sign in. Please try again.",
            variant: "error",
          });
        }
      }
    }
  };

  const content = (
    <ScrollView
      scrollEnabled={isWeb || shouldScroll}
      style={{ flex: 1 }}
      onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
      onContentSizeChange={(_, height) => setContentHeight(height)}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View>
        <TextInput
          topLabel="Email"
          leftIcon={<Mail />}
          onChangeText={(val) => {
            setTouched((prev) => ({ ...prev, email: true }));
            setEmail(val);
          }}
          onBlur={() => touched.email && validateEmail()}
          value={email}
          placeholder="email@address.com"
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          error={!!errors.email}
          errorMessage={errors.email}
          retainErrorMessageSpace={true}
        />
        <TextInput
          topLabel="Password"
          leftIcon={<Lock />}
          rightIcon={
            passwordVisible ? (
              <Eye onPress={togglePasswordVisibility} />
            ) : (
              <EyeOff onPress={togglePasswordVisibility} />
            )
          }
          onChangeText={setPassword}
          value={password}
          secureTextEntry={!passwordVisible}
          placeholder="Password"
          autoCapitalize="none"
        />
      </View>
      <View style={{ gap: 15, marginTop: 50 }}>
        <Button
          onPress={handleSignIn}
          loading={signIn.isPending}
          style={{ width: "65%", alignSelf: "center" }}
        >
          Sign In
        </Button>
        <Button
          leftIcon={<Ionicons name="logo-google" />}
          onPress={handleGoogleSignIn}
          loading={googleSignIn.isPending}
          style={{ width: "65%", alignSelf: "center" }}
        >
          Continue with Google
        </Button>
        {Platform.OS === "ios" && (
          <View style={{ width: "65%", alignSelf: "center" }}>
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={
                AppleAuthentication.AppleAuthenticationButtonType.CONTINUE
              }
              buttonStyle={
                isDark
                  ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
                  : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
              }
              cornerRadius={5}
              style={{
                width: "100%",
                minHeight: appleButtonHeight,
                alignSelf: "center",
              }}
              onPress={handleAppleSignIn}
            />
          </View>
        )}
        <Button
          variant="secondary"
          outlined
          onPress={handleForgotPassword}
          style={{ width: "65%", alignSelf: "center", marginTop: 30 }}
        >
          Forgot your password?
        </Button>
      </View>
    </ScrollView>
  );

  if (isWeb) {
    return (
      <form
        onSubmit={(e) => e.preventDefault()}
        style={{ flex: 1, minHeight: 0 }}
      >
        {content}
      </form>
    );
  }
  return content;
}
