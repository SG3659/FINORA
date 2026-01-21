import { z } from "zod"

export const updateUserschema = z.object({
   name: z.string().trim().min(1).max(255).optional(),

})

export type updateProfileType = z.infer<typeof updateUserschema>;