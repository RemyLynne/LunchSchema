import {z} from "zod"
import {textSchema} from "@/models/i18n/text"
import {billingDefinitionSchema} from "@/models/lunch/billing-definition"

export const lunchOptionSchema = z.object({
  id: z.number().nullish(),
  name: textSchema,
  currentBilling: billingDefinitionSchema.nullish(),
  newBilling: billingDefinitionSchema.nullish(),
  currentAvailableDays: z.array(z.number().min(0).max(6)),
  newAvailableDays: z.array(z.number().min(0).max(6)),
})

export type LunchOption = z.infer<typeof lunchOptionSchema>