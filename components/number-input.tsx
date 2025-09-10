"use client"

import type { React } from "react"
import { useState, useEffect } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface NumberInputProps {
  label: string
  value: number
  onChange: (value: number) => void
  unit?: string
  min?: number
  max?: number
  step?: number
  placeholder?: string
}

export function NumberInput({ label, value, onChange, unit, min = 0, max, step = 1, placeholder }: NumberInputProps) {
  const [displayValue, setDisplayValue] = useState(value.toString())

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setDisplayValue(inputValue)

    if (inputValue === "") {
      onChange(0)
      return
    }

    const newValue = Number.parseFloat(inputValue)
    if (!isNaN(newValue) && newValue >= min && (!max || newValue <= max)) {
      onChange(newValue)
    }
  }

  const handleBlur = () => {
    if (displayValue === "") {
      setDisplayValue("0")
    }
  }

  useEffect(() => {
    setDisplayValue(value.toString())
  }, [value])

  return (
    <div className="space-y-2">
      <Label htmlFor={label} className="text-sm font-medium">
        {label} {unit && <span className="text-muted-foreground">({unit})</span>}
      </Label>
      <Input
        id={label}
        type="number"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        className="w-full"
      />
    </div>
  )
}
