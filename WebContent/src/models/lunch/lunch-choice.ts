import {z} from "zod"

export const lunchChoiceSchema = z.object({
  optionId: z.number(),
  day: z.number().min(0).max(6)
})

export type LunchChoice = z.infer<typeof lunchChoiceSchema>