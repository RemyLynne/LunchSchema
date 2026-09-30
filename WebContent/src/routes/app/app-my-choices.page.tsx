import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Table, TableBody, TableCell, TableRow} from "@/components/ui/table"
import {Field, FieldGroup, FieldLabel} from "@/components/ui/field"
import {Checkbox} from "@/components/ui/checkbox"
import {Button} from "@/components/ui/button"
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"
import {InfoIcon} from "lucide-react"

export default function AppMyChoicesPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold">Mine valg <Badge>Example</Badge></h1>
      <Alert className="items-center" variant="info">
        <InfoIcon className="mb-2"/>
        <AlertTitle>Endringsfrist for neste periode</AlertTitle>
        <AlertDescription>Endringer for neste periode (desember) må registreres innen 20. november. Nye valg trer i kraft 1. desember</AlertDescription>
      </Alert>
      <CurrentPeriod/>
      <NextPeriod/>
    </div>
  )
}

function CurrentPeriod() {
  return (
    <Card variant="outline">
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>Inneværende periode - November 2026</CardTitle>
          <Badge variant="success">Aktiv</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <Alert className="items-center" variant="info">
          <InfoIcon className="mb-2"/>
          <AlertTitle>Aktiv periode: 1. November - 30. November 2026</AlertTitle>
          <AlertDescription>Dager utenfor denne perioden er ikke synlig</AlertDescription>
        </Alert>
        <div className="flex flex-col md:flex-row gap-4">
          <Card className="grow bg-muted dark:bg-muted/50">
            <CardHeader>
              <CardTitle>Mandag</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2 items-stretch">
                <div className="flex flex-col">
                  <span>Brødmat</span>
                  <span className="text-muted-foreground">70 kr/dag</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="grow bg-muted dark:bg-muted/50">
            <CardHeader>
              <CardTitle>Tirsdag</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2 items-stretch">
                <div className="flex flex-col">
                  <span>Brødmat</span>
                  <span className="text-muted-foreground">70 kr/dag</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="grow bg-muted dark:bg-muted/50">
            <CardHeader>
              <CardTitle>Onsdag</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2 items-stretch">
                <div className="flex flex-col">
                  <span>Brødmat</span>
                  <span className="text-muted-foreground">70 kr/dag</span>
                </div>
                <div className="flex flex-col">
                  <span>Varmmat</span>
                  <span className="text-muted-foreground">250 kr/mnd</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="grow bg-muted dark:bg-muted/50">
            <CardHeader>
              <CardTitle>Torsdag</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2 items-stretch">
                <div className="flex flex-col">
                  <span>Brødmat</span>
                  <span className="text-muted-foreground">70 kr/dag</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="grow bg-muted dark:bg-muted/50">
            <CardHeader>
              <CardTitle>Fredag</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2 items-stretch">
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="ring-0">
          <CardContent className="flex justify-between items-center">
            <span className="text-muted-foreground">Månedlig kalkulert kostnad for November</span>
            <h3 className="text-lg font-semibold">Ca. 1 570 kr</h3>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}

function NextPeriod() {
  return (
    <Card variant="outline">
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>Neste periode - Desember 2026</CardTitle>
          <Badge variant="secondary">Åpen for endring</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <Alert className="items-center" variant="info">
          <InfoIcon className="mb-2"/>
          <AlertTitle>Aktiv periode: 1. Desember - 31. Desember 2026</AlertTitle>
          <AlertDescription>Dager utenfor denne perioden er ikke tilgjengelige for valg</AlertDescription>
        </Alert>
        <Table className="border-transparent!">
          <TableBody>
            <TableRow className="hover:bg-transparent">
              <TableCell className="font-semibold align-top">Mandag</TableCell>
              <TableCell>
                <FieldGroup className="gap-3">
                  <Field orientation="horizontal">
                    <Checkbox
                      id="mandag-brødmat"
                    />
                    <FieldLabel htmlFor="mandag-brødmat">
                      <div className="flex flex-col">
                        <span>Brødmat</span>
                        <span className="text-muted-foreground">70 kr/mnd</span>
                      </div>
                    </FieldLabel>
                  </Field>
                </FieldGroup>
              </TableCell>
              <TableCell className="w-full"/>
            </TableRow>
            <TableRow className="hover:bg-transparent">
              <TableCell className="font-semibold align-top">Tirsdag</TableCell>
              <TableCell>
                <FieldGroup className="gap-3">
                  <Field orientation="horizontal">
                    <Checkbox
                      id="tirsdag-brødmat"
                    />
                    <FieldLabel htmlFor="tirsdag-brødmat">
                      <div className="flex flex-col">
                        <span>Brødmat</span>
                        <span className="text-muted-foreground">70 kr/mnd</span>
                      </div>
                    </FieldLabel>
                  </Field>
                </FieldGroup>
              </TableCell>
              <TableCell className="w-full"/>
            </TableRow>
            <TableRow className="hover:bg-transparent">
              <TableCell className="font-semibold align-top">Onsdag</TableCell>
              <TableCell>
                <FieldGroup className="gap-3">
                  <Field orientation="horizontal">
                    <Checkbox
                      id="onsdag-brødmat"
                    />
                    <FieldLabel htmlFor="onsdag-brødmat">
                      <div className="flex flex-col">
                        <span>Brødmat</span>
                        <span className="text-muted-foreground">70 kr/mnd</span>
                      </div>
                    </FieldLabel>
                  </Field>
                  <Field orientation="horizontal">
                    <Checkbox
                      id="onsdag-varmmat"
                    />
                    <FieldLabel htmlFor="onsdag-varmmat">
                      <div className="flex flex-col">
                        <span>Varmmat</span>
                        <span className="text-muted-foreground">70 kr/mnd</span>
                      </div>
                    </FieldLabel>
                  </Field>
                </FieldGroup>
              </TableCell>
              <TableCell className="w-full"/>
            </TableRow>
            <TableRow className="hover:bg-transparent">
              <TableCell className="font-semibold align-top">Torsdag</TableCell>
              <TableCell>
                <FieldGroup className="gap-3">
                  <Field orientation="horizontal">
                    <Checkbox
                      id="torsdag-brødmat"
                    />
                    <FieldLabel htmlFor="torsdag-brødmat">
                      <div className="flex flex-col">
                        <span>Brødmat</span>
                        <span className="text-muted-foreground">70 kr/mnd</span>
                      </div>
                    </FieldLabel>
                  </Field>
                </FieldGroup>
              </TableCell>
              <TableCell className="w-full"/>
            </TableRow>
            <TableRow className="hover:bg-transparent">
              <TableCell className="font-semibold align-top">Fredag</TableCell>
              <TableCell>
                <FieldGroup className="gap-3">
                  <Field orientation="horizontal">
                    <Checkbox
                      id="fredag-brødmat"
                    />
                    <FieldLabel htmlFor="fredag-brødmat">
                      <div className="flex flex-col">
                        <span>Brødmat</span>
                        <span className="text-muted-foreground">70 kr/mnd</span>
                      </div>
                    </FieldLabel>
                  </Field>
                </FieldGroup>
              </TableCell>
              <TableCell className="w-full"/>
            </TableRow>
          </TableBody>
        </Table>
        <Card className="ring-0">
          <CardContent className="flex justify-between items-center">
            <span className="text-muted-foreground">Estimert pris for Desember</span>
            <h3 className="text-lg font-semibold">Ca. 1 600 kr</h3>
          </CardContent>
        </Card>
        <div className="flex justify-end gap-2">
          <Button variant="outline">Nullstill endringer</Button>
          <Button>Lagre endringer</Button>
        </div>
      </CardContent>
    </Card>
  )
}