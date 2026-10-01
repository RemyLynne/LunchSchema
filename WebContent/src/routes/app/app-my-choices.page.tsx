import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Table, TableBody, TableCell, TableRow} from "@/components/ui/table"
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field"
import {Checkbox} from "@/components/ui/checkbox"
import {Button} from "@/components/ui/button"
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"
import {InfoIcon} from "lucide-react"
import {menuQuery, useMenu} from "@/hooks/use-menu"
import {allowedEditsUntilDayOfMonth, weekDays} from "@/models/lunch/billing-definition"
import {translateText} from "@/models/i18n/text"
import {useTranslation} from "react-i18next"
import {useEffect, useMemo, useState} from "react"
import {countWeekdayInMonth, getMonthBounds} from "@/lib/date-utils"
import {useQuery} from "@tanstack/react-query"
import {type userChoices, userChoicesSchema} from "@/models/lunch/user-choices"
import {type LunchChoice} from "@/models/lunch/lunch-choice"
import {queryClient} from "@/lib/query-client"
import {Controller, type SubmitHandler, useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {z} from "zod"
import {toggled} from "@/lib/utils"
import {api, isApiError} from "@/lib/api"
import {ToastManager} from "@/lib/toast"
import {getAppText} from "@/lib/app-text"
import {t} from "i18next"

export default function AppMyChoicesPage() {
  const { t } = useTranslation()
  const canEdit = useMemo(() => new Date().getDate() <= allowedEditsUntilDayOfMonth, [])
  const {month: currentMonth} = getMonthBounds()
  const {month: nextMonth, firstOfMonth: firstOfNextMonth} = getMonthBounds(1)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold">{t("lunch:myChoices.label")}</h1>
      <Alert className="items-center" variant={canEdit ? "info" : "destructive"}>
        <InfoIcon className="mb-2"/>
        <AlertTitle>{t(canEdit ? "lunch:myChoices.edit.deadline.upcomming.title" : "lunch:myChoices.edit.deadline.upcomming.title")}</AlertTitle>
        <AlertDescription>
          {t(canEdit ? "lunch:myChoices.edit.deadline.upcomming.description" : "lunch:myChoices.edit.deadline.passed.description", {currentMonth, nextMonth, deadline: allowedEditsUntilDayOfMonth, firstOfNextMonth})}
        </AlertDescription>
      </Alert>
      <CurrentPeriod/>
      <NextPeriod/>
    </div>
  )
}

function CurrentPeriod() {
  const [cost, setCost] = useState<number>(0)
  const { t } = useTranslation()
  const {firstOfMonth, lastOfMonth, month, year} = getMonthBounds()
  const userChoices = useMyChoices()
  const menu = useMenu()

  useEffect(() => {
    const controller = new AbortController()

    const calculate = async () => {
      if (userChoices.data == null) return setCost(0)
      const constInternal = await getCost(userChoices.data.currentChoices)
      if (!controller.signal.aborted) setCost(constInternal)
    }
    void calculate()

    return () => controller.abort()
  }, [userChoices.data])

  return (
    <Card variant="outline">
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>{t("lunch:billing.period.current.label", {month, year})}</CardTitle>
          <Badge variant="success">{t("common:status.enabled")}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <Alert className="items-center" variant="info">
          <InfoIcon className="mb-2"/>
          <AlertTitle>{t("lunch:billing.period.activeRange", {first: firstOfMonth, last: lastOfMonth, month, year})}</AlertTitle>
          <AlertDescription>{t("lunch:billing.period.current.activeRangeDescription")}</AlertDescription>
        </Alert>
        <div className="flex flex-col md:flex-row gap-4">
          {weekDays.map(day => (
            <Card key={day} className="flex-1 bg-muted dark:bg-muted/50">
              <CardHeader>
                <CardTitle>{t(`common:day.${day}.name`)}</CardTitle>
              </CardHeader>
              <CardContent>
                {menu.data != null && userChoices.data != null && (
                  <div className="flex flex-col gap-2 items-stretch">
                    {menu.data
                      .filter(option => option.currentBilling != null && option.currentAvailableDays.includes(day))
                      .filter(option => userChoices.data?.currentChoices.some(choice => choice.day === day && choice.optionId === option.id))
                      .map(option => (
                        <div key={option.id} className="flex flex-col">
                          <span>{translateText(option.name)}</span>
                          <span className="text-muted-foreground">{t(`lunch:price.every.${option.currentBilling!.billingPeriod}`, {price: option.currentBilling!.price, unit: "kr"})}</span>
                        </div>
                      ))
                    }
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="ring-0">
          <CardContent className="flex justify-between items-center">
            <span className="text-muted-foreground">{t("lunch:priceEstimate.calculatedForMonth", {month})}</span>
            <h3 className="text-lg font-semibold">{t("lunch:priceEstimate.price", {price: cost, unit: "kr"})}</h3>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}

const schema = z.record(z.string(), z.number().array()) // key has to be string because object

type FormValues = z.infer<typeof schema>

function NextPeriod() {
  const [cost, setCost] = useState<number>(0)
  const { t } = useTranslation()
  const {firstOfMonth, lastOfMonth, month, year} = getMonthBounds(1)
  const userChoices = useMyChoices()
  const menu = useMenu()

  const canEdit = useMemo(() => new Date().getDate() <= allowedEditsUntilDayOfMonth, [])

  const { control: formControl, handleSubmit, setError, formState: { errors, isValid }, reset, resetDefaultValues } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {}
  })

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const items = Object.entries(data).map(([day, optionIds]) => optionIds.map(optionId => ({day: Number(day), optionId}))).flat()

    const res = await api.post("/api/my-choices", items)

    if (isApiError(res)) {
      if (res.error) setError("root", { message: getAppText(res.error, t)})
      return
    }

    const parsed = userChoicesSchema.safeParse(await res.response.json().catch(() => null))
    if (!parsed.success) {
      console.error(parsed.error)
      setError("root", { message: t("common:errors.unknown") })
    }

    queryClient.setQueryData(["myChoices"], parsed.data)
  }

  useEffect(() => {
    const controller = new AbortController()

    const calculate = async () => {
      if (userChoices.data == null) return setCost(0)
      const constInternal = await getCost(userChoices.data.newChoices, true)
      if (!controller.signal.aborted) setCost(constInternal)
    }
    void calculate()

    return () => controller.abort()
  }, [userChoices.data])

  useEffect(() => {
    const map: Record<string, number[]> = {} // day -> optionId | day has to be string because object

    if (userChoices.data == null) return resetDefaultValues(map)

    for (const choice of userChoices.data.newChoices) {
      const options = (map[choice.day]??=[])
      if (!options.includes(choice.optionId)) options.push(choice.optionId)
    }
    weekDays.forEach(day => map[day]??=[]) //fixes a validity bug due to controlled fields not having any value

    resetDefaultValues(map)
    reset()
  }, [reset, resetDefaultValues, userChoices.data])

  return (
    <Card variant="outline">
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>{t("lunch:billing.period.next.label", {month, year})}</CardTitle>
          <Badge
            variant={canEdit ? "secondary" : "destructive"}
          >{t(canEdit ? "lunch:myChoices.edit.allowed" : "lunch:myChoices.edit.locked")}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <Alert className="items-center" variant={canEdit ? "info" : "destructive"}>
          <InfoIcon className="mb-2"/>
          <AlertTitle>{t("lunch:billing.period.activeRange", {first: firstOfMonth, last: lastOfMonth, month, year})}</AlertTitle>
          <AlertDescription>{t("lunch:billing.period.next.activeRangeDescription")}</AlertDescription>
        </Alert>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          {errors.root?.message && <FieldError className="mb-2">{t(errors.root.message)}</FieldError>}
          <Table className="border-transparent!">
            <TableBody>
              {weekDays.map(day => (
                <Controller
                  key={day}
                  name={day+""}
                  control={formControl}
                  render={({field}) => (
                    <TableRow className="hover:bg-transparent">
                      <TableCell className="font-semibold align-top">{t(`common:day.${day}.name`)}</TableCell>
                      <TableCell>
                        {menu.data != null && (
                          <FieldGroup className="gap-3">
                            {menu.data
                              .filter(option => option.newAvailableDays.includes(day) && option.removalDate == null && option.newBilling != null)
                              .map(option => (
                                <Field key={option.id} orientation="horizontal">
                                  <Checkbox
                                    id={field.name+"."+option.id}
                                    checked={field.value?.includes(option.id!)||false}
                                    onCheckedChange={() => field.onChange(toggled(field.value, option.id!))}
                                    disabled={!canEdit}
                                  />
                                  <FieldLabel htmlFor={field.name+"."+option.id}>
                                    <div className="flex flex-col">
                                      <span>{translateText(option.name)}</span>
                                      <span className="text-muted-foreground">{t(`lunch:price.every.${option.newBilling!.billingPeriod}`, {price: option.newBilling!.price, unit: "kr"})}</span>
                                    </div>
                                  </FieldLabel>
                                </Field>
                              ))
                            }
                          </FieldGroup>
                        )}
                      </TableCell>
                      <TableCell className="w-full"/>
                    </TableRow>
                  )}
                />
              ))}
            </TableBody>
          </Table>
          <Card className="ring-0">
            <CardContent className="flex justify-between items-center">
              <span className="text-muted-foreground">{t("lunch:priceEstimate.forMonth", {month})}</span>
              <h3 className="text-lg font-semibold">{t("lunch:priceEstimate.price", {price: cost, unit: "kr"})}</h3>
            </CardContent>
          </Card>
          {canEdit && (
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => reset()}>{t("common:actions.reset")}</Button>
              <Button type="submit" disabled={!isValid}>{t("common:actions.save")}</Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

async function getCost(choices: LunchChoice[], future = false): Promise<number> {
  const menu = await queryClient.query(menuQuery)
  if (menu == null) return 0

  const unique = new Map<number, Set<number>>() // optionId -> days
  for (const choice of choices) {
    let days = unique.get(choice.optionId)
    if (!days) unique.set(choice.optionId, (days = new Set()))
    days.add(choice.day)
  }

  let cost = 0
  for (const [optionId, days] of unique) {
    const option = menu.find(menuItem => menuItem.id === optionId)
    if (option == null) continue

    const billing = future ? option.newBilling : option.currentBilling
    if (billing == null) continue

    switch (billing.billingPeriod) {
      case "month":
        cost += billing.price
        break
      case "day":
        days.forEach(day =>
          cost += countWeekdayInMonth(day, future ? 1 : 1)*billing.price
        )
        break
    }
  }

  return cost
}

const myChoicesQuery = {
  queryKey: ["myChoices"],
  queryFn: () => fetchMyChoices(),
  staleTime: 5 * 60 * 1000,
}

function useMyChoices() {
  return useQuery(myChoicesQuery)
}

async function fetchMyChoices(): Promise<userChoices | null> {
  const res = await api.get("/api/my-choices")

  if (res.code === 401 || res.code === 403) return null

  if (isApiError(res)) {
    if (res.error)
      ToastManager.add({
        type: "error",
        title: getAppText(res.error, t)
      })
    return null
  }

  const parsed = userChoicesSchema.safeParse(await res.response.json().catch(() => null))
  if (!parsed.success) {
    console.error(parsed.error)
    ToastManager.add({
      type: "error",
      title: t("common:errors.unknown"),
    })
    return null
  }

  return parsed.data
}