import { useState, useCallback } from "react";
import { Button, TextInput, HelperText } from "react-native-paper";
import { Keyboard } from "react-native";
import AppScreen from "./AppScreen";
import { emailSchema, passwordSchema } from "../schemas/validationSchemas";
import { useSignIn, useSignUp } from "../hooks/useAuth";
import { z } from "zod";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { mutate: signIn, isPending: isSigningIn } = useSignIn();
  const { mutate: signUp, isPending: isSigningUp } = useSignUp();

  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisible((prev) => !prev);
  }, []);

  // Validate email input
  const validateEmail = useCallback(() => {
    try {
      emailSchema.parse(email);
      setEmailError("");
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setEmailError(error.errors[0].message);
      }
      return false;
    }
  }, [email]);

  // Validate password input
  const validatePassword = useCallback(() => {
    try {
      passwordSchema.parse(password);
      setPasswordError("");
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setPasswordError(error.errors[0].message);
      }
      return false;
    }
  }, [password]);

  // Validate all inputs
  const validateForm = useCallback(() => {
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    return isEmailValid && isPasswordValid;
  }, [validateEmail, validatePassword]);

  const handleSignIn = useCallback(async () => {
    Keyboard.dismiss();
    if (!validateForm()) {
      return;
    }

    signIn({ email, password });
  }, [email, password, validateForm, signIn]);

  const handleSignUp = useCallback(async () => {
    Keyboard.dismiss();
    if (!validateForm()) {
      return;
    }

    signUp({ email, password });
  }, [email, password, validateForm, signUp]);

  return (
    <AppScreen>
      <TextInput
        label="Email"
        left={<TextInput.Icon icon="email" />}
        onChangeText={setEmail}
        onBlur={validateEmail}
        value={email}
        placeholder="email@address.com"
        autoCapitalize="none"
        keyboardType="email-address"
        mode="outlined"
        error={!!emailError}
        autoComplete="email"
      />
      {emailError ? <HelperText type="error">{emailError}</HelperText> : null}

      <TextInput
        label="Password"
        left={<TextInput.Icon icon="lock" />}
        right={
          <TextInput.Icon
            icon={passwordVisible ? "eye" : "eye-off"}
            onPress={togglePasswordVisibility}
          />
        }
        onChangeText={setPassword}
        onBlur={validatePassword}
        value={password}
        secureTextEntry={!passwordVisible}
        placeholder="Password"
        autoCapitalize="none"
        mode="outlined"
        error={!!passwordError}
        autoComplete="password"
      />
      {passwordError ? (
        <HelperText type="error">{passwordError}</HelperText>
      ) : null}

      <Button
        mode="contained"
        disabled={isSigningIn || isSigningUp}
        onPress={handleSignIn}
        loading={isSigningIn}
        style={{ marginTop: 16 }}
      >
        Sign in
      </Button>
      <Button
        mode="contained"
        disabled={isSigningIn || isSigningUp}
        onPress={handleSignUp}
        loading={isSigningUp}
        style={{ marginTop: 8 }}
      >
        Sign up
      </Button>
    </AppScreen>
  );
}
