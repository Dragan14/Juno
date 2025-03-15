import { storage, LAST_OTP_REQUEST_KEY } from "../constants/localStorage";

export const validateOtpCooldown = () => {
  const lastOtpRequest = storage.getNumber(LAST_OTP_REQUEST_KEY) || 0;
  const currentTime = Date.now();
  const timeSinceLastRequest = currentTime - lastOtpRequest;

  if (lastOtpRequest > 0 && timeSinceLastRequest < 60000) {
    const remainingTime = Math.ceil((60000 - timeSinceLastRequest) / 1000);
    throw new Error(
      `Please wait ${remainingTime} seconds before requesting another verification code.`,
    );
  }

  storage.set(LAST_OTP_REQUEST_KEY, currentTime);
};
