"use client"

import type React from "react"

import { useState } from "react"

interface DatePickerProps {
  onDateChange: (date: string) => void
  initialDate: string
}

export function DatePicker({ onDateChange, initialDate }: DatePickerProps) {
  const [selectedDate, setSelectedDate] = useState(initialDate)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value
    setSelectedDate(date)
    onDateChange(date)
  }

  // NASA APOD started on 1995-06-16
  const minDate = "1995-06-16"
  const maxDate = new Date().toISOString().split("T")[0]

  return (
    <div className="flex items-center gap-4">
      <label className="text-sm text-muted-foreground">Select Date:</label>
      <input
        type="date"
        value={selectedDate}
        onChange={handleChange}
        min={minDate}
        max={maxDate}
        className="px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
      />
    </div>
  )
}
