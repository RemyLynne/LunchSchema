import {redirect} from "react-router"
import {queryClient} from "@/lib/query-client"
import {userQuery} from "@/hooks/use-user"

export async function requireAuthenticated() {
  const user = await queryClient.query(userQuery)

  if (user == null) throw redirect("/login")
}