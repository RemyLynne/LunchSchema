import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {Field, FieldDescription, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {Link} from "react-router"
import {Trans, useTranslation} from "react-i18next"
import {z} from "zod"
import {Controller, type SubmitHandler, useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {api, isApiError} from "@/lib/api"
import {userSchema} from "@/models/user"
import {useUser} from "@/state/user.store"
import {getAppText} from "@/lib/app-text.ts";

const schema = z
  .object({
    email: z.email("fields.email.invalid"),
    password: z.string().min(1, "fields.password.missing")
  })

type FormValues = z.infer<typeof schema>

export default function LoginPage() {
  const { setUser } = useUser()
  const { t } = useTranslation("auth")

  const { control: formControl, handleSubmit, setError, formState: { errors, isValid } } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    }
  })

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const res = await api.post("/api/auth/login", data)

    if (isApiError(res)) {
      if (res.error) setError("root", { message: getAppText(res.error, t) })
      return
    }

    const parsed = userSchema.safeParse(await res.response.json().catch(() => null))
    if (!parsed.success) {
      setError("root", { message: t("common:errors.unknown") })
    }

    setUser(parsed.data!)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("login.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          {errors.root?.message && <FieldError>{errors.root.message}</FieldError>}
          <FieldGroup>
            <Controller
              name="email"
              control={formControl}
              render={({field, fieldState}) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>{t("fields.email.label")}</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="email"
                    placeholder="user@example.com"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.error?.message && (
                    <FieldError>{t(fieldState.error.message)}</FieldError>
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={formControl}
              render={({field, fieldState}) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>{t("fields.password.label")}</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="password"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.error?.message && (
                    <FieldError>{t(fieldState.error.message)}</FieldError>
                  )}
                </Field>
              )}
            />
            <Field>
              <Button type="submit" disabled={!isValid}>{t("actions.login")}</Button>
              <FieldDescription className="text-center">
                <Trans
                  t={t}
                  i18nKey="login.notRegisteredPrompt"
                  components={{ registerLink: <Link to="/register" /> }}
                />
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}