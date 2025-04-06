import { useState } from "react";
import { Keyboard } from "react-native";
import { useSignIn } from "@/api/useAuth";
import { Button } from "react-native-paper";
import TextInput from "@/components/ui/TextInput";
import Icon from "@/components/ui/Icon";

export default function SignInForm() {
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
    <>
      <TextInput
        label="Email"
        leftIcon={<Icon name="mail" size={24} />}
        onChangeText={setEmail}
        value={email}
        placeholder="email@address.com"
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
        outlined={true}
      />
      <TextInput
        label="Password"
        leftIcon={<Icon name="lock-closed" size={24} />}
        rightIcon={
          <Icon
            name={passwordVisible ? "eye" : "eye-off"}
            size={24}
            onPress={togglePasswordVisibility}
          />
        }
        onChangeText={setPassword}
        value={password}
        secureTextEntry={!passwordVisible}
        placeholder="Password"
        autoCapitalize="none"
        outlined={true}
      />
      <Button
        mode="contained"
        disabled={signIn.isPending}
        onPress={handleSignIn}
        loading={signIn.isPending}
      >
        Sign in
      </Button>
    </>
  );
}
