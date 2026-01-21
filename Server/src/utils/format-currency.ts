// saveing the amount in db
export const convertToPaisa = (amount: number) => {
   return Math.round(amount * 100)
}
// retreving the amount from db
export const convertToRupee = (amount: number) => {
   return (amount / 100).toFixed(2)
}

export function formatCurrency(amount: number) {
   return new Intl.NumberFormat('en-IN', {
      style: "currency",
      currency: "INR"
   }).format(amount)
}