"use client"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, FilterIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export function ReportsFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Get current filter values from URL
  const currentFilter = searchParams.get("filter") || "all"
  const fromDate = searchParams.get("from")
  const toDate = searchParams.get("to")

  // State for custom date range
  const [dateFrom, setDateFrom] = useState<Date | undefined>(fromDate ? new Date(fromDate) : undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(toDate ? new Date(toDate) : undefined)

  // Apply predefined filter
  const applyFilter = (filter: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams)
      params.set("filter", filter)

      // Clear custom date range when using predefined filters
      params.delete("from")
      params.delete("to")

      router.push(`?${params.toString()}`)
    })
  }

  // Apply custom date range
  const applyDateRange = () => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams)
      params.set("filter", "custom")

      if (dateFrom) {
        params.set("from", dateFrom.toISOString().split("T")[0])
      } else {
        params.delete("from")
      }

      if (dateTo) {
        params.set("to", dateTo.toISOString().split("T")[0])
      } else {
        params.delete("to")
      }

      router.push(`?${params.toString()}`)
    })
  }

  // Clear all filters
  const clearFilters = () => {
    startTransition(() => {
      router.push("?filter=all")
    })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
      <div className="flex items-center gap-2">
        <FilterIcon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Filter by:</span>
      </div>

      <div className="flex flex-wrap gap-2">
        <Select value={currentFilter} onValueChange={applyFilter} disabled={isPending}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="this-week">This Week</SelectItem>
            <SelectItem value="this-month">This Month</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>

        {currentFilter === "custom" && (
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-[140px] justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}
                  disabled={isPending}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFrom ? format(dateFrom, "PPP") : "From date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-[140px] justify-start text-left font-normal", !dateTo && "text-muted-foreground")}
                  disabled={isPending}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateTo ? format(dateTo, "PPP") : "To date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
              </PopoverContent>
            </Popover>

            <Button variant="secondary" onClick={applyDateRange} disabled={isPending || (!dateFrom && !dateTo)}>
              Apply
            </Button>
          </div>
        )}

        {currentFilter !== "all" && (
          <Button variant="ghost" onClick={clearFilters} disabled={isPending}>
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}
