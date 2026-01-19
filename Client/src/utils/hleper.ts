type PasswordStrength = "weak" | "fair" | "strong"

export function generatePasswordStrenght(password: string): PasswordStrength {
   let score = 0;

   if (password.length >= 8) score++;
   if (/[A-Z]/.test(password)) score++;
   if (/[a-z]/.test(password)) score++;
   if (/[0-9]/.test(password)) score++;
   if (/[\W_]/.test(password)) score++;

   if (score <= 2) return "weak"
   if (score <= 4) return "fair";
   return "strong";
}