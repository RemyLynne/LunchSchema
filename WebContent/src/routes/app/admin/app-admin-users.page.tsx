import {Button} from "@/components/ui/button"
import {Plus} from "lucide-react"
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {useEffect, useState} from "react"
import {BasicPagination} from "@/components/basic-pagination"
import { Field ,FieldLabel} from "@/components/ui/field"
import {useDebounce} from "use-debounce"
import {type User, userSchema} from "@/models/iam/user"
import {api, isApiError} from "@/lib/api"
import {ToastManager} from "@/lib/toast"
import {getAppText} from "@/lib/app-text"
import {useTranslation} from "react-i18next"
import {getPageSchema} from "@/models/iam/page"
import {translateText} from "@/models/i18n/text"
import {Badge} from "@/components/ui/badge"
import {hasPermission} from "@/security/access-utils"
import {useUser} from "@/hooks/use-user"
import {permissionConstants} from "@/security/permission.constants"
import {getHighestRole} from "@/models/iam/role"

export default function AppAdminUsersPage() {
  const { t } = useTranslation()
  const user = useUser()
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <h1 className="text-3xl font-semibold">{t("auth:user.labelPlural")}</h1>
          {hasPermission(user.data!, permissionConstants.ADMIN_USERS_EDIT) && (
            <Button onClick={() => console.log("New user")}>
              <Plus/>
              {t("auth:user.create")}
            </Button>
          )}
        </div>
        <UserTable/>
      </div>
    </>
  )
}

const PAGE_SIZES: number[] = [10, 25, 50, 100]

function UserTable() {
  const { t } = useTranslation()
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_SIZES[0])
  const [debouncedRowsPerPage] = useDebounce(rowsPerPage, 500)
  const [page, setPage] = useState(1)
  const [debouncedPage] = useDebounce(page, 500)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [content, setContent] = useState<User[]>([])

  useEffect(() => {
    const controller = new AbortController()

    const fetch = async () => {
      const res = await api.get(`/api/users?size=${debouncedRowsPerPage}&page=${debouncedPage-1}`, controller.signal)
      if (controller.signal.aborted) return

      if (isApiError(res)) {
        ToastManager.add({priority: "high", title: res.error ? getAppText(res.error, t) : t("common:errors.unknown")})
        return
      }

      const parsed = getPageSchema(userSchema).safeParse(await res.response.json().catch(() => null))
      if (controller.signal.aborted) return
      if (!parsed.success || parsed.data == null) {
        console.error(parsed.error)
        ToastManager.add({priority: "high", title: t("common:errors.unknown")})
        return
      }

      setTotalPages(parsed.data.totalPages)
      setContent(parsed.data.content)
    }
    void fetch()

    return () => controller.abort()
  }, [debouncedPage, debouncedRowsPerPage, t])

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("auth:fields.name.label")}</TableHead>
          <TableHead>{t("auth:fields.email.label")}</TableHead>
          <TableHead>{t("auth:fields.role.label")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {content.map(item => (
          <TableRow
            key={item.id}
            className="relative cursor-pointer focus-within:bg-muted/50 has-[a:focus-visible]:outline has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-ring"
          >
            <TableCell>
              <button
                type="button"
                onClick={() => console.log("open user", item)}
                className="text-left font-medium outline-none after:absolute after:inset-0 after:content-['']"
              >{item.name}</button>
            </TableCell>
            <TableCell>{item.email}</TableCell>
            <TableCell>
              {item.roles.length && (
                <>
                  <Badge>{translateText(getHighestRole(item.roles)!.title)}</Badge>
                  {item.roles.length > 1 && (
                    <span className="ml-1">+{item.roles.length-1}</span>
                  )}
                </>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={4}>
            <div className="flex justify-between items-center">
              <div>
                <BasicPagination min={1} max={totalPages} value={page} setValue={setPage}/>
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
                    onValueChange={val => val != null && setRowsPerPage(val)}>
                    <SelectTrigger className="w-20" id="select-rows-per-page">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="start">
                      <SelectGroup>
                        {PAGE_SIZES.map((size, index) => (
                          <SelectItem key={index} value={size}>{size}</SelectItem>
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
  )
}