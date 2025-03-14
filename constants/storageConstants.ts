import { MMKV } from "react-native-mmkv";

export const storage = new MMKV({
  id: "juno",
});

export const LAST_OTP_REQUEST_KEY = "lastOtpRequestTimestamp";
