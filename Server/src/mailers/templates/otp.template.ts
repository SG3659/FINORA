import { generateOtp } from "../../utils/otp-generator.js"
export const otpTemplate = (otp: string) => {

  return `
     <!DOCTYPE html>
<html>
<head>
<title>Enter this code to sign in</title>
<style>
body {
  font-family: sans-serif;
  color: #333;
}
.container {
  width: 80%;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
h1 {
  font-size: 24px;
  margin-bottom: 20px;
}
.code {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 10px;
}
.instructions {
  margin-bottom: 20px;
}
.security-note {
  margin-top: 30px;
  font-style: italic;
}
.netflix-team {
  margin-top: 20px;
  font-weight: bold;
}
</style>
</head>
<body>
  <div class="container">
    <h1>Enter this code to sign in</h1>
    <div class="code">${otp}</div>
    <div class="instructions">
      Enter the code above on your device to sign in to AuroraFi.<br>
      This code will expire in 10 minutes.
    </div>
    <div>
      If you didn't send this request, you can ignore this email or
      <a href="#">review your recent device activity</a>.
    </div>
    <div class="security-note">
      To help security, don't share this code with anyone outside your household.
    </div>
    <div class="netflix-team">
      The AuroraFi team
    </div>
  </div>
</body>
</html>
      `;
}