import {z} from "zod"

export const billingPeriodSchema = z.enum(["day", "month"])

export type BillingPeriod = z.infer<typeof billingPeriodSchema>

export const billingDefinitionSchema = z.object({
  price: z.preprocess(
    (v: any) => (v === "" || v == null ? undefined : Number(String(v).replace(",", "."))),
    z.number().nonnegative(),
  ),
  billingPeriod: billingPeriodSchema,
})

export const weekDays = [0,1,2,3,4]

export const allowedEditsUntilDayOfMonth = 20

export type BillingDefinition = z.infer<typeof billingDefinitionSchema>
