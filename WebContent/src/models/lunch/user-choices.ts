import {z} from "zod"
import {lunchChoiceSchema} from "@/models/lunch/lunch-choice"

export const userChoicesSchema = z.object({
  currentChoices: lunchChoiceSchema.array(),
  newChoices: lunchChoiceSchema.array(),
})

export type userChoices = z.infer<typeof userChoicesSchema>