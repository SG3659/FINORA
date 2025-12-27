import { z } from "zod"

export const updateUserschema = z.object({
   name: z.string().min(2).max(50).optional(),

})

export type updateProfileType = z.infer<typeof updateUserschema>;