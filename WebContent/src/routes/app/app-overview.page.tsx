import {Button} from "@/components/ui/button"
import {CreditCard, FileSpreadsheet, Info, SquarePen, Users} from "lucide-react"
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Alert, AlertTitle} from "@/components/ui/alert"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {useUser} from "@/hooks/use-user"
import {hasPermission} from "@/security/access-utils"
import {permissionConstants} from "@/security/permission.constants"
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {BasicPagination} from "@/components/basic-pagination"
import {Field, FieldLabel} from "@/components/ui/field"
import {useState} from "react"
import {useTranslation} from "react-i18next"
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible"
import {Badge} from "@/components/ui/badge"

export default function AppOverviewPage() {
  const { t } = useTranslation()
  const user = useUser()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between">
        <h1 className="text-3xl font-semibold">{t("lunch:overview.label")}</h1>
        <div className="flex gap-2">
          {/*<Select>
            <SelectTrigger>
              <SelectValue/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Desember 2026 (Pågående)">Desember 2026 (Pågående)</SelectItem>
            </SelectContent>
          </Select>*/}
          <Button><FileSpreadsheet/>Export</Button>
        </div>
      </div>
      <Alert className="items-center" variant="info">
        <Info className="mb-2"/>
        <AlertTitle>{t("lunch:overview.period.current", {year: 2026, month: 9})}</AlertTitle>
      </Alert>
      <SummarySection/>
      <WeekOverview/>
      {hasPermission(user.data, permissionConstants.OVERVIEW_USERS_VIEW) && (<UserOverview/>)}
    </div>
  )
}

function SummarySection() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <Card className="grow">
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>{t("lunch:overview.period.activeUsers")}</CardTitle>
            <Users/>
          </div>
        </CardHeader>
        <CardContent>
          <span className="text-3xl font-semibold">{t("auth:user.count", {count: 45})}</span>
        </CardContent>
      </Card>
      <Card className="grow">
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>{t("lunch:price.label")}</CardTitle>
            <CreditCard/>
          </div>
        </CardHeader>
        <CardContent>
          <span className="text-3xl font-semibold">12 500 kr</span>
        </CardContent>
      </Card>
    </div>
  )
}

function WeekOverview() {
  const { t } = useTranslation()

  return (
    <Card variant="outline">
      <CardHeader>
        <CardTitle>{t("lunch:overview.week.label")}</CardTitle>
      </CardHeader>
      <CardContent>
        <OneWeekOverview/>
      </CardContent>
    </Card>
  )
}

function OneWeekOverview() {
  const { t } = useTranslation()

  return (
    <Card>
      <Collapsible>
        <CollapsibleTrigger
          nativeButton={false}
          render={
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle>{t("common:week.withRange", {week: 45, startDate: 1, endDate: 7, startMonth: 9, endMonth: 9})}</CardTitle>
                  <CardDescription>{t("auth:user.count", {count: 45})}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">Brødmat: 58</Badge>
                  <Badge variant="secondary">Varmamat: 58</Badge>
                </div>
              </div>
            </CardHeader>
          }
        />
        <CollapsibleContent>
          <CardContent className="my-4">
            <div className="grid grid-cols-[auto_auto_1fr] gap-x-8 gap-y-2">
              <div className="col-span-2 grid grid-cols-subgrid">
                <span>Man</span>
                <div className="flex gap-2">
                  <Badge variant="secondary">Brødmat: 12</Badge>
                </div>
              </div>
              <div className="col-span-2 grid grid-cols-subgrid">
                <span>Tir</span>
                <div className="flex gap-2">
                  <Badge variant="secondary">Brødmat: 12</Badge>
                </div>
              </div>
              <div className="col-span-2 grid grid-cols-subgrid">
                <span>Ons</span>
                <div className="flex gap-2">
                  <Badge variant="secondary">Brødmat: 11</Badge>
                  <Badge variant="secondary">Varmmat: 12</Badge>
                </div>
              </div>
              <div className="col-span-2 grid grid-cols-subgrid">
                <span>Tor</span>
                <div className="flex gap-2">
                  <Badge variant="secondary">Brødmat: 11</Badge>
                </div>
              </div>
              <div className="col-span-2 grid grid-cols-subgrid">
                <span>Fre</span>
                <div className="flex gap-2">
                  <Badge variant="secondary">Brødmat: 12</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

const PAGE_SIZES: number[] = [10, 25, 50, 100]

function UserOverview() {
  const { t } = useTranslation()
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_SIZES[0])

  return (
    <div className="rounded-xl border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("auth:user.label")}</TableHead>
            <TableHead>{t("lunch:price.label")}</TableHead>
            <TableHead className="text-end">{t("common:actions.action")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <strong>Ola nordmann</strong>
              <p className="text-muted-foreground">ola.nordmann@bedrift.no</p>
            </TableCell>
            <TableCell>
              1 400 kr
            </TableCell>
            <TableCell className="text-end">
              <Button variant="outline"><SquarePen/>{t("lunch:myChoices.edit.label")}</Button>
            </TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>
              <div className="flex justify-between items-center">
                <div>
                  <BasicPagination min={1} max={5} value={2} setValue={console.log}/>
                </div>
                <div>
                  <Field orientation="horizontal">
                    <FieldLabel
                      htmlFor="select-rows-per-page"
                      className="sr-only sm:not-sr-only"
                    >
                      {t("common:pagination.rowsPerPage")}
                    </FieldLabel>
                    <Select
                      value={rowsPerPage}
                      onValueChange={val => val != null && setRowsPerPage(val)}
                    >
                      <SelectTrigger className="w-20" id="select-rows-per-page">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent align="start">
                        <SelectGroup>
                          {PAGE_SIZES.map(size => (
                            <SelectItem key={size} value={size}>{size}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}