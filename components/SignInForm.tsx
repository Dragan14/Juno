import { useState } from "react";
import { View, Keyboard } from "react-native";
import { useSignIn } from "@/hooks/useAuth";
import { Button, TextInput } from "react-native-paper";

export default function SignInForm() {
  console.log("Sign In Form rendered");
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
    await signIn.mutateAsync({ email, password });
    // Reset form
    setEmail("");
    setPassword("");
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
