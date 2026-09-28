import {
  Pagination,
  PaginationContent, PaginationEllipsis,
  PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination"
import {cn} from "cn"

interface BasicPaginationProps {
  min: number,
  max: number,
  value: number,
  //How many to always show before and after current (if enough pages are available)
  margin?: number,
  setValue: (value: number) => void
}

export function BasicPagination({min, max, margin = 1, value, setValue}: BasicPaginationProps) {
  if (min > max)
    throw new Error("Minimum value is greater than the maximum value")
  if (min === max)
    return

  const lo = Math.max(min, value - margin)
  const hi = Math.min(max, value + margin)

  const getItem = (page: number) => (
    <PaginationItem key={page}>
      <PaginationLink
        isActive={page === value}
        onClick={() => setValue(page)}
      >
        {page}
      </PaginationLink>
    </PaginationItem>
  )

  const ellipsis = (key: string) => (
    <PaginationItem key={key}>
      <PaginationEllipsis />
    </PaginationItem>
  )

  const pages = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i)
  const atStart = value <= min
  const atEnd = value >= max

  return (
    <Pagination>
      <PaginationContent className="sm:hidden">
        <PaginationItem>
          <PaginationPrevious
            onClick={() => !atStart && setValue(value - 1)}
            aria-disabled={atStart}
            className={cn(atStart && "pointer-events-none opacity-50")}
          />
        </PaginationItem>
        <PaginationItem>
        <span className="px-2 text-sm tabular-nums text-muted-foreground">
          {value} / {max}
        </span>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            onClick={() => !atEnd && setValue(value + 1)}
            aria-disabled={atEnd}
            className={cn(atEnd && "pointer-events-none opacity-50")}
          />
        </PaginationItem>
      </PaginationContent>

      <PaginationContent className="hidden sm:flex">
        {lo > min && getItem(min)}
        {lo > min + 1 && ellipsis("start-ellipsis")}
        {pages.map(getItem)}
        {hi < max - 1 && ellipsis("end-ellipsis")}
        {hi < max && getItem(max)}
      </PaginationContent>
    </Pagination>
  )
}