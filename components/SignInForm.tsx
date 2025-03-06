import { useState } from "react";
import { View, Keyboard } from "react-native";
import { useSignIn } from "../hooks/useAuth";
import { Button, TextInput } from "react-native-paper";

interface SignInFormProps {
  onSuccess: (message?: string) => void;
  onError: (message?: string) => void;
}

export default function SignInForm({ onSuccess, onError }: SignInFormProps) {
  const signIn = useSignIn();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  // Handle sign in
  const handleSignIn = async () => {
    Keyboard.dismiss();
    try {
      await signIn.mutateAsync({ email, password });
      onSuccess("Signed in successfully");
      // Reset form
      setEmail("");
      setPassword("");
    } catch {
      onError("Failed to sign in");
    }
  };

  return (
    <View>
      <TextInput
        label="Email"
        left={<TextInput.Icon icon="email" />}
        onChangeText={setEmail}
        value={email}
        placeholder="email@address.com"
        autoCapitalize="none"
        keyboardType="email-address"
        mode="outlined"
        autoComplete="email"
      />
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
        value={password}
        secureTextEntry={!passwordVisible}
        placeholder="Password"
        autoCapitalize="none"
        mode="outlined"
        autoComplete="password"
      />
      <Button
        mode="contained"
        disabled={signIn.isPending}
        onPress={handleSignIn}
        loading={signIn.isPending}
      >
        Sign in
      </Button>
    </View>
  );
}
