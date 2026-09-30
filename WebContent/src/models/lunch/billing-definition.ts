import {z} from "zod"

export const billingPeriodSchema = z.enum(["day", "month"])

export type BillingPeriod = z.infer<typeof billingPeriodSchema>

export const billingDefinitionSchema = z.object({
  price: z.preprocess(
    (v: any) => (v === "" || v == null ? undefined : Number(String(v).replace(",", "."))),
    z.number().positive(),
  ),
  billingPeriod: billingPeriodSchema,
})

export type BillingDefinition = z.infer<typeof billingDefinitionSchema>
