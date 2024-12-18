export function generateRandomCode() {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const codeLength = 6;
  const randomValues = new Uint8Array(codeLength);

  crypto.getRandomValues(randomValues);

  let randomCode = "";
  for (let i = 0; i < codeLength; i++) {
    const randomIndex = randomValues[i] % charset.length;
    randomCode += charset[randomIndex];
  }

  return randomCode;
}
