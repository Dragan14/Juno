import { useState, useEffect } from "react";
import { Keyboard } from "react-native";
import {
  emailSchema,
  passwordSchema,
  nameSchema,
} from "@/schemas/auth-schemas";
import { useSignUp, useResendVerificationEmail } from "@/api/useAuth";
import { z } from "zod";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import { CircleUser, Mail, Lock, Eye, EyeOff } from "lucide-react-native";
import { useAlert } from "@/context/ui/AlertContext";
import { useToast } from "@/context/ui/ToastContext";
import Text from "@/components/ui/Text";
import View from "@/components/ui/View";

function VerificationAlertContent({
  onClose,
  onResend,
}: {
  onClose: () => void;
  onResend: () => Promise<void>;
}) {
  const [cooldown, setCooldown] = useState(60);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async () => {
    await onResend();
    setCooldown(60);
  };

  return (
    <View style={{ gap: 20 }}>
      <Text style={{ textAlign: "center", fontSize: 20 }}>
        Check your Email for a verification link
      </Text>
      <Button
        onPress={onClose}
        variant="primary"
        outlined={true}
        style={{ flex: 1 }}
      >
        Ok
      </Button>
      {cooldown > 0 && (
        <Text style={{ textAlign: "center" }}>
          Resend the verification email in {cooldown} seconds.
        </Text>
      )}
      <Button
        onPress={handleResend}
        variant="primary"
        style={{ flex: 1 }}
        disabled={cooldown > 0}
      >
        Resend Verification Email
      </Button>
    </View>
  );
}

export default function SignUpForm() {
  const { showAlert, hideAlert } = useAlert();
  const { showToast } = useToast();

  const signUp = useSignUp();
  const resendVerificationEmail = useResendVerificationEmail();

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  // Password visibility state
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  // Toggle password visibility
  const togglePasswordVisibility = (field: "password" | "confirmPassword") => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Validate name input
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

  // Validate password input
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

  // Validate confirm password input
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

  // Validate all inputs
  const validateForm = () => {
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();
    return (
      isNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid
    );
  };

  // Handle sign up
  const handleSignUp = async () => {
    Keyboard.dismiss();
    if (validateForm()) {
      try {
        const { session, user } = await signUp.mutateAsync({
          email,
          password,
          name,
        });
        if (!session && !(user && user?.identities?.length === 0)) {
          showAlert({
            content: (
              <VerificationAlertContent
                onClose={hideAlert}
                onResend={async () => {
                  await resendVerificationEmail.mutateAsync(email);
                  showToast({
                    message:
                      "Verification email resent. Please check your inbox.",
                    variant: "success",
                  });
                }}
              />
            ),
          });
        }
        // Reset form
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setErrors({ name: "", email: "", password: "", confirmPassword: "" });
        setTouched({
          name: false,
          email: false,
          password: false,
          confirmPassword: false,
        });
      } catch (error) {
        showToast({
          message:
            error instanceof Error
              ? error.message
              : "Failed to sign up. Please try again.",
          variant: "error",
        });
      }
    }
  };

  return (
    <>
      <TextInput
        topLabel="Name"
        leftIcon={<CircleUser />}
        onChangeText={(val) => {
          setTouched((prev) => ({ ...prev, name: true }));
          setName(val);
        }}
        onBlur={() => touched.name && validateName()}
        value={name}
        placeholder="Name"
        autoCapitalize="words"
        error={!!errors.name}
        errorMessage={errors.name}
        retainErrorMessageSpace={true}
        autoComplete="name"
      />
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
        error={!!errors.email}
        errorMessage={errors.email}
        retainErrorMessageSpace={true}
        autoComplete="email"
      />
      <TextInput
        topLabel="Password"
        leftIcon={<Lock />}
        rightIcon={
          passwordVisibility.password ? (
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
        secureTextEntry={!passwordVisibility.password}
        placeholder="Password"
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
          passwordVisibility.confirmPassword ? (
            <Eye onPress={() => togglePasswordVisibility("confirmPassword")} />
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
        secureTextEntry={!passwordVisibility.confirmPassword}
        placeholder="Confirm Password"
        autoCapitalize="none"
        error={!!errors.confirmPassword}
        errorMessage={errors.confirmPassword}
        retainErrorMessageSpace={true}
      />
      <Button
        disabled={signUp.isPending}
        onPress={handleSignUp}
        loading={signUp.isPending}
      >
        Sign Up
      </Button>
    </>
  );
}
