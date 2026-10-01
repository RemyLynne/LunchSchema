import {Button} from "@/components/ui/button"
import {Plus} from "lucide-react"
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {useCallback, useEffect, useState} from "react"
import {BasicPagination} from "@/components/basic-pagination"
import {Field, FieldDescription, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field"
import {useDebounce} from "use-debounce"
import {type User, userSchema} from "@/models/iam/user"
import {api, isApiError} from "@/lib/api"
import {ToastManager} from "@/lib/toast"
import {getAppText} from "@/lib/app-text"
import {Trans, useTranslation} from "react-i18next"
import {getPageSchema} from "@/models/iam/page"
import {translateText} from "@/models/i18n/text"
import {Badge} from "@/components/ui/badge"
import {hasPermission} from "@/security/access-utils"
import {useUser} from "@/hooks/use-user"
import {permissionConstants} from "@/security/permission.constants"
import {getHighestRole, type Role, roleSchema} from "@/models/iam/role"
import {Popup} from "@/components/popup"
import { Input } from "@/components/ui/input"
import {z} from "zod"
import {Controller, type SubmitHandler, useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {useRoles} from "@/hooks/use-roles"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {ConfirmPopup} from "@/components/confirm-popup"

const PASSWORD_MIN_LENGTH = 8

export default function AppAdminUsersPage() {
  const { t } = useTranslation()
  const [counter, setCounter] = useState<number>(0)
  const user = useUser()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-semibold">{t("auth:user.labelPlural")}</h1>
        {hasPermission(user.data, permissionConstants.ADMIN_USERS_EDIT) && (
          <Popup
            trigger={<Button><Plus/>{t("auth:user.create")}</Button>}
            title={t("auth:user.create")}
          >
            {close => (<UserAdminPopup close={close} setUser={() => setCounter(prev => prev+1)}/>)}
          </Popup>
        )}
      </div>
      <UserTable key={counter}/>
    </div>
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
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const controller = new AbortController()

    const fetch = async () => {
      const res = await api.get(`/api/admin/users?size=${debouncedRowsPerPage}&page=${debouncedPage-1}`, controller.signal)
      if (controller.signal.aborted) return

      if (isApiError(res)) {
        ToastManager.add({type: "error", title: res.error ? getAppText(res.error, t) : t("common:errors.unknown")})
        return
      }

      const parsed = getPageSchema(userSchema).safeParse(await res.response.json().catch(() => null))
      if (controller.signal.aborted) return
      if (!parsed.success || parsed.data == null) {
        console.error(parsed.error)
        ToastManager.add({type: "error", title: t("common:errors.unknown")})
        return
      }

      setTotalPages(parsed.data.totalPages)
      setUsers(parsed.data.content)
    }
    void fetch()

    return () => controller.abort()
  }, [debouncedPage, debouncedRowsPerPage, t])

  const replaceUser = useCallback((newUser: User) => {
    setUsers((prev) => {
      const index = prev.findIndex(u => u.id === newUser.id)
      if (index === -1) return [...prev, newUser]

      return [
        ...prev.slice(0, index),
        newUser,
        ...prev.slice(index+1)
      ]
    })
  }, [])

  return (
    <div className="rounded-xl border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("auth:fields.name.label")}</TableHead>
            <TableHead>{t("auth:fields.email.label")}</TableHead>
            <TableHead>{t("auth:fields.role.label")}</TableHead>
            <TableHead>{t("common:status.label")}</TableHead>
            <TableHead className="text-end">{t("common:actions.action")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              className="relative cursor-pointer focus-within:bg-muted/50 has-[a:focus-visible]:outline has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-ring"
            >
              <TableCell>
                <Popup
                  trigger={<button type="button" className="text-left font-medium outline-none after:absolute after:inset-0 after:content-['']">{user.name}</button>}
                  title={t("auth:user.edit")}
                >
                  {close => (
                    <UserAdminPopup
                      close={close}
                      user={user}
                      setUser={replaceUser}
                    />
                  )}
                </Popup>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <RoleList roles={user.roles}/>
              </TableCell>
              <TableCell>
                {user.disabled ? (
                  <Badge variant="secondary" className="text-muted-foreground">{t("common:status.disabled")}</Badge>
                ) : (
                  <Badge variant="success">{t("common:status.enabled")}</Badge>
                )}
              </TableCell>
              <TableCell className="text-end">
                <Button variant="outline">{t("common:actions.edit")}</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>
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

interface UserAdminPopupProps {
  user?: User,
  setUser: (user: User) => void,
  close: () => void
}

const schema = z
  .object({
    id: z.number().nullish(),
    name: z.string().min(1, "auth:fields.name.missing"),
    email: z.email("auth:fields.email.invalid"),
    password: z.string(),
    confirmPassword: z.string(),
    roles: roleSchema.array()
  })
  .refine((data) => ((data.id != null && data.password.length === 0) || data.password.length >= PASSWORD_MIN_LENGTH), {
    message: "auth:fields.password.minLength",
    path: ["password"]
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "auth:fields.confirmPassword.inequal",
    path: ["confirmPassword"]
  })

type FormValues = z.infer<typeof schema>

function UserAdminPopup({user, setUser, close}: UserAdminPopupProps) {
  const { t } = useTranslation()
  const me = useUser()
  const roles = useRoles()

  const sortedRoles = (roles.data??[]).sort((a,b) => a.sort - b.sort)

  const { control: formControl, handleSubmit, setError, formState: { errors, isValid } } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      id: user?.id,
      name: user?.name ?? "",
      email: user?.email ?? "",
      password: "",
      confirmPassword: "",
      roles: user?.roles ?? []
    }
  })

  const onSubmit: SubmitHandler<FormValues> = async ({confirmPassword: _confirmPassword, roles, ...data}) => {
    const res = await api.post("/api/admin/users", {
      ...data,
      roles: roles.map(role => role.id)
    })

    if (isApiError(res)) {
      if (res.error) setError("root", { message: getAppText(res.error, t)})
      return
    }

    const parsed = userSchema.safeParse(await res.response.json().catch(() => null))
    if (!parsed.success) {
      console.error(parsed.error)
      setError("root", { message: t("common:errors.unknown")})
      return
    }

    setUser(parsed.data)
    close()
  }

  const deactivate = useCallback(async () => {
    const res = await api.post(`/api/admin/users/${user!.id}/deactivate`, {})

    if (isApiError(res) && res.error)
      ToastManager.add({
        type: "error",
        title: getAppText(res.error, t)
      })

    setUser({...user!, disabled: true})
    close()
  }, [close, setUser, t, user])

  const reactivate = useCallback(async () => {
    const res = await api.post(`/api/admin/users/${user!.id}/reactivate`, {})

    if (isApiError(res) && res.error)
      ToastManager.add({
        type: "error",
        title: getAppText(res.error, t)
      })

    setUser({...user!, disabled: false})
    close()
  }, [close, setUser, t, user])

  return (
    <form className="grid items-start gap-6" onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        {errors.root?.message && <FieldError className="mb-2">{t(errors.root.message)}</FieldError>}
        <Controller
          name="name"
          control={formControl}
          render={({field, fieldState}) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>{t("auth:fields.name.label")}</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="text"
                aria-invalid={fieldState.invalid}
                disabled={!hasPermission(me.data, permissionConstants.ADMIN_USERS_EDIT)}
              />
              {fieldState.error?.message && (
                <FieldError>{t(fieldState.error.message)}</FieldError>
              )}
            </Field>
          )}
        />
        <Controller
          name="email"
          control={formControl}
          render={({field, fieldState}) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>{t("auth:fields.email.label")}</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="email"
                placeholder="user@example.com"
                aria-invalid={fieldState.invalid}
                disabled={!hasPermission(me.data, permissionConstants.ADMIN_USERS_EDIT) || user?.id != null}
              />
              {fieldState.error?.message && (
                <FieldError>{t(fieldState.error.message)}</FieldError>
              )}
            </Field>
          )}
        />
        {hasPermission(me.data, permissionConstants.ADMIN_USERS_EDIT) && (
          <>
            <Controller
              name="password"
              control={formControl}
              render={({field, fieldState}) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>{t(user?.id ? "auth:fields.password.label" : "auth:fields.password.labelNew")}</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="password"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.error?.message && (
                    <FieldError>{t(fieldState.error.message, {min: PASSWORD_MIN_LENGTH})}</FieldError>
                  )}
                </Field>
              )}
            />
            <Controller
              name="confirmPassword"
              control={formControl}
              render={({field, fieldState}) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>{t("auth:fields.confirmPassword.label")}</FieldLabel>
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
          </>
        )}
        {sortedRoles.length > 0 && (
          <Controller
            name="roles"
            control={formControl}
            render={({field, fieldState}) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>{t("auth:fields.role.labelPlural")}</FieldLabel>
                <Select
                  multiple
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  isItemEqualToValue={(a,b) => a.id === b.id}
                >
                  <SelectTrigger
                    id={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue>
                      {(roles: Role[]) => roles.length
                        ? (<RoleList roles={roles}/>)
                        : t("auth:fields.role.selectPlural")
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {sortedRoles.map(role => (
                      <SelectItem
                        key={role.id}
                        value={role}
                        disabled={!hasPermission(me.data, permissionConstants.ADMIN_USERS_EDIT)  || role.id! <= (getHighestRole(me.data!.roles ?? [])?.id??Number.MAX_VALUE)}
                      >
                        {translateText(role.title)}
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
        )}
        {hasPermission(me.data, permissionConstants.ADMIN_USERS_EDIT) && user?.id && user.id != me.data!.id && (
          <Field className="mt-2">
            <Card variant="destructive">
              <CardHeader>
                <CardTitle>{t("common:dangerZone")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <FieldLabel>{t(user.disabled ? "auth:user.prompt.reactivate.title" : "auth:user.prompt.deactivate.title")}</FieldLabel>
                    <FieldDescription>{t(user.disabled ? "auth:user.prompt.reactivate.description" : "auth:user.prompt.deactivate.description")}</FieldDescription>
                  </div>
                  <ConfirmPopup
                    trigger={<Button size="sm" variant="destructive">{t(user.disabled ? "common:actions.reactivate" : "common:actions.deactivate")}</Button>}
                    title={t(user.disabled ? "auth:user.prompt.reactivate.confirm.title" : "auth:user.prompt.deactivate.confirm.title")}
                    content={
                      <span>
                        <Trans
                          i18nKey={user.disabled ? "auth:user.prompt.reactivate.confirm.description" : "auth:user.prompt.deactivate.confirm.description"}
                          values={{email: user.email}}
                          components={{ bold: <strong/> }}
                        />
                      </span>
                    }
                    confirmButtonText={t(user.disabled ? "common:actions.reactivate" : "common:actions.deactivate")}
                    callback={user.disabled ? reactivate : deactivate}
                  />
                </div>
              </CardContent>
            </Card>
          </Field>
        )}
        <Field>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={close}
            >
              {t(hasPermission(me.data, permissionConstants.ADMIN_USERS_EDIT) ? "common:actions.cancel" : "common:actions.close")}
            </Button>
            {hasPermission(me.data, permissionConstants.ADMIN_USERS_EDIT) && (
              <Button type="submit" disabled={!isValid}>{t(user?.id ? "common:actions.save" : "common:actions.create")}</Button>
            )}
          </div>
        </Field>
      </FieldGroup>
    </form>
  )
}

interface RoleListProps {
  roles: Role[],
  length?: number
}

function RoleList({roles, length = 1}: RoleListProps) {
  const sorted = roles.sort((a, b) => a.sort - b.sort)

  const elements = sorted.slice(0, length)
  const remaining = sorted.slice(length).length

  return (
    <>
      {elements.map(role => (
        <Badge key={role.id}>{translateText(role.title)}</Badge>
      ))}
      {remaining > 0 && (
        <span className="ml-1">+{remaining}</span>
      )}
    </>
  )
}