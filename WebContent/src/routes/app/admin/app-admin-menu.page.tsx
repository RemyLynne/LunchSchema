import { Button } from "@/components/ui/button"
import {Plus} from "lucide-react"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Badge} from "@/components/ui/badge"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {type LunchOption, lunchOptionSchema} from "@/models/lunch/lunch-option"
import {textSchema, translateText} from "@/models/i18n/text"
import {cn, toggled} from "@/lib/utils"
import {useTranslation} from "react-i18next"
import {useUser} from "@/hooks/use-user"
import {hasPermission} from "@/security/access-utils"
import {permissionConstants} from "@/security/permission.constants"
import {Popup} from "@/components/popup"
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import {billingDefinitionSchema, type BillingPeriod, billingPeriodSchema} from "@/models/lunch/billing-definition"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {I18nInput} from "@/components/i18n-input"
import {Controller, type SubmitHandler, useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {useMenu} from "@/hooks/use-menu"
import {queryClient} from "@/lib/query-client"
import {api, isApiError} from "@/lib/api"
import {getAppText} from "@/lib/app-text"
import {z} from "zod"

export default function AppAdminMenuPage() {
  const { t } = useTranslation()
  const user = useUser()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-semibold">{t("lunch:menu.label")}</h1>
        </div>
        {hasPermission(user.data, permissionConstants.ADMIN_MENU_VIEW) && (
          <Popup
            trigger={<Button><Plus/>{t("lunch:menu.choice.create")}</Button>}
            title={t("lunch:menu.choice.create")}
          >
            {close => (<MenuAdminPopup close={close}/>)}
          </Popup>
        )}
      </div>
      <div className="flex flex-col gap-6">
        <MenuList/>
        <WeekOverview/>
      </div>
    </div>
  )
}

function MenuList() {
  const { t } = useTranslation()
  const menu = useMenu()

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/5">{t("lunch:category.label")}</TableHead>
          <TableHead className="w-1/5">{t("lunch:billing.price.current")}</TableHead>
          <TableHead className="w-1/5">{t("lunch:billing.price.planned")}</TableHead>
          <TableHead className="w-1/5">{t("lunch:availability.label")}</TableHead>
          <TableHead className="w-1/5 text-end">{t("common:actions.action")}</TableHead>
        </TableRow>
      </TableHeader>
      {menu.data != null && (
        <TableBody>
          {menu.data.map(option => (
            <TableRow
              key={option.id}
              className="relative cursor-pointer focus-within:bg-muted/50 has-[a:focus-visible]:outline has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-ring"
            >
              <TableCell>
                <Popup
                  trigger={<button type="button" className="text-left font-medium outline-none after:absolute after:inset-0 after:content-['']">{translateText(option.name)}</button>}
                  title={t("lunch:menu.choice.edit")}
                >
                  {close => (
                    <MenuAdminPopup
                      close={close}
                      option={option}
                    />
                  )}
                </Popup>
              </TableCell>
              <TableCell>
                {option.currentBilling && (
                  <>
                    <p>{option.currentBilling.price} kr</p>
                    <p className="text-muted-foreground">
                      {t(`lunch:billing.each.${option.currentBilling.billingPeriod}`)}
                    </p>
                  </>
                )}
              </TableCell>
              <TableCell>
                {option.newBilling && (
                  <>
                    <p>{option.newBilling.price} kr</p>
                    <p className="text-muted-foreground">
                      {t(`lunch:billing.each.${option.newBilling.billingPeriod}`)}
                    </p>
                  </>
                )}
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-1">
                    <p className="text-muted-foreground pe-1">{t("lunch:availability.current")}</p>
                    {option.currentAvailableDays.sort().map(day => (
                      <Badge key={day} variant="secondary">{t(`common:day.${day}.short`)}</Badge>
                    ))}
                  </div>
                  <div className="flex gap-1">
                    <p className="text-muted-foreground pe-1">{t("lunch:availability.planned")}</p>
                    {option.newAvailableDays.sort().map(day => (
                      <Badge key={day} variant="secondary">{t(`common:day.${day}.short`)}</Badge>
                    ))}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-end">
                <Button variant="outline">{t("common:actions.edit")}</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      )}
    </Table>
  )
}

const days = [0,1,2,3,4]

function WeekOverview() {
  const { t } = useTranslation()
  const menu = useMenu()

  return (
    <Card variant="outline">
      <CardHeader>
        <CardTitle>{t("lunch:overview.week.label")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          {days.map(day => (
            <Card key={day} className="grow bg-muted dark:bg-muted/50">
              <CardHeader>
                <CardTitle>{t(`common:day.${day}.name`)}</CardTitle>
              </CardHeader>
              <CardContent>
                {menu.data && (
                  <div className="flex flex-col gap-2 items-stretch">
                    {menu.data
                      .filter(option => option.currentAvailableDays.includes(day)||option.newAvailableDays.includes(day))
                      .map(option => (
                        <Popup
                          key={option.id}
                          trigger={
                            <Button
                              className={cn("justify-start",
                                option.currentAvailableDays.includes(day)
                                  ? (
                                    option.newAvailableDays.includes(day)
                                      ? "bg-background! hover:bg-muted/10! border-border!"
                                      : "bg-destructive/10! border-destructive/30! text-destructive hover:bg-destructive/20! hover:border-destructive/40! hover:text-destructive"
                                  )
                                  : "bg-success/10! border-success/30! text-success hover:bg-success/20! hover:border-success/40! hover:text-success"
                              )}
                              variant="outline"
                            >
                              {translateText(option.name)}
                            </Button>
                          }
                          title={t("lunch:menu.choice.edit")}
                        >
                          {close => (
                            <MenuAdminPopup
                              close={close}
                              option={option}
                            />
                          )}
                        </Popup>
                      ))
                    }
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface MenuAdminPopupProps {
  option?: LunchOption,
  close: () => void
}

const schema = z
  .object({
    id: z.number().nullish(),
    name: textSchema,
    billing: billingDefinitionSchema,
    availableDays: z.array(z.number().min(0).max(6))
  })

type FormValues = z.infer<typeof schema>

function MenuAdminPopup({option, close}: MenuAdminPopupProps) {
  const { t } = useTranslation()
  const user = useUser()
  const menu = useMenu()

  const { control: formControl, handleSubmit, setError, formState: { errors, isValid } } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      id: option?.id,
      name: option?.name ?? {
        content: "",
        translations: {}
      },
      billing: option?.newBilling ?? {
        price: 0,
        billingPeriod: "day"
      },
      availableDays: option?.newAvailableDays ?? days,
    }
  })

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const res = await api.post("/api/menu", data)

    if (isApiError(res)) {
      if (res.error) setError("root", { message: getAppText(res.error, t)})
      return
    }

    const parsed = lunchOptionSchema.safeParse(await res.response.json().catch(() => null))
    if (!parsed.success) {
      console.error(parsed.error)
      setError("root", { message: t("common:errors.unknown")})
      return
    }

    const index = menu.data?.findIndex(item => item.id === parsed.data.id) ?? -1
    let rtn: LunchOption[]
    if (index === -1)
      rtn = [...menu.data??[], parsed.data]
    else
      rtn = [
        ...menu.data!.slice(0, index),
        parsed.data,
        ...menu.data!.slice(index+1)
      ]

    queryClient.setQueryData(["menu"], rtn)
    close()
  }

  return (
    <form className="grid items-start gap-6" onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        {errors.root?.message && <FieldError className="mb-2">{t(errors.root.message)}</FieldError>}
        <Controller
          name="name"
          control={formControl}
          render={({field, fieldState}) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>{t("lunch:category.fieldLabel")}</FieldLabel>
              <I18nInput
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                disabled={!hasPermission(user.data, permissionConstants.ADMIN_MENU_EDIT)}
              />
              {fieldState.error?.message && (
                <FieldError>{t(fieldState.error.message)}</FieldError>
              )}
            </Field>
          )}
        ></Controller>
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="billing.price"
            control={formControl}
            render={({field, fieldState}) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>{t("lunch:billing.price.fieldLabel", {unit: "kr"})}</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  disabled={!hasPermission(user.data, permissionConstants.ADMIN_MENU_EDIT)}
                />
                {fieldState.error?.message && (
                  <FieldError>{t(fieldState.error.message)}</FieldError>
                )}
              </Field>
            )}
          />
          <Controller
            name="billing.billingPeriod"
            control={formControl}
            render={({field, fieldState}) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>{t("lunch:billing.period.fieldLabel")}</FieldLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue>
                      {(billingPeriod: BillingPeriod) => t(`lunch:billing.each.${billingPeriod}`)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {billingPeriodSchema.options.map((billingPeriod) => (
                      <SelectItem
                        key={billingPeriod}
                        value={billingPeriod}
                      >
                        {t(`lunch:billing.each.${billingPeriod}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.error?.message && (
                  <FieldError>{t(fieldState.error.message)}</FieldError>
                )}
              </Field>
            )}
          />
        </div>
        <Controller
          name="availableDays"
          control={formControl}
          render={({field, fieldState}) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>{t("lunch:availability.label")}</FieldLabel>
              <div className="flex gap-2">
                {days.map(day => (
                  <Button
                    key={day}
                    className="grow"
                    variant={field.value.includes(day) ? "success" : "destructive"}
                    onClick={() => field.onChange(toggled(field.value, day))}
                  >
                    {t(`common:day.${day}.short`)}
                  </Button>
                ))}
              </div>
              {fieldState.error?.message && (
                <FieldError>{t(fieldState.error.message)}</FieldError>
              )}
            </Field>
          )}
        />
        <Field>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={close}
            >
              {t(hasPermission(user.data, permissionConstants.ADMIN_USERS_EDIT) ? "common:actions.cancel" : "common:actions.close")}
            </Button>
            {hasPermission(user.data, permissionConstants.ADMIN_USERS_EDIT) && (
              <Button type="submit" disabled={!isValid}>{t(option?.id ? "common:actions.save" : "common:actions.create")}</Button>
            )}
          </div>
        </Field>
      </FieldGroup>
    </form>
  )
}