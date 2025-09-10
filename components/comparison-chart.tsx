"use client"
import { formatKRW } from "@/lib/formatters"

interface ComparisonChartProps {
  midKrwOut: number
  p2pKrwOut: number
  koronaKrwOut: number
  gmoneyKrwOut: number
  p2pLossPct: number
  koronaLossPct: number
  gmoneyLossPct: number
}

export function ComparisonChart({
  midKrwOut,
  p2pKrwOut,
  koronaKrwOut,
  gmoneyKrwOut,
  p2pLossPct,
  koronaLossPct,
  gmoneyLossPct,
}: ComparisonChartProps) {
  const maxKrwOut = Math.max(midKrwOut, p2pKrwOut, koronaKrwOut, gmoneyKrwOut)
  const maxLoss = Math.max(p2pLossPct, koronaLossPct, gmoneyLossPct)

  const krwData = [
    { label: "Mid-Market", value: midKrwOut, color: "bg-green-500", percentage: (midKrwOut / maxKrwOut) * 100 },
    { label: "P2P", value: p2pKrwOut, color: "bg-blue-500", percentage: (p2pKrwOut / maxKrwOut) * 100 },
    {
      label: "Korona+E9Pay",
      value: koronaKrwOut,
      color: "bg-orange-500",
      percentage: (koronaKrwOut / maxKrwOut) * 100,
    },
    {
      label: "Gmoneytrans",
      value: gmoneyKrwOut,
      color: "bg-purple-500",
      percentage: (gmoneyKrwOut / maxKrwOut) * 100,
    },
  ]

  const lossData = [
    {
      label: "P2P",
      value: p2pLossPct,
      color: "bg-red-500",
      percentage: maxLoss > 0 ? (p2pLossPct / maxLoss) * 100 : 0,
    },
    {
      label: "Korona+E9Pay",
      value: koronaLossPct,
      color: "bg-red-600",
      percentage: maxLoss > 0 ? (koronaLossPct / maxLoss) * 100 : 0,
    },
    {
      label: "Gmoneytrans",
      value: gmoneyLossPct,
      color: "bg-red-700",
      percentage: maxLoss > 0 ? (gmoneyLossPct / maxLoss) * 100 : 0,
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">KRW Output Comparison</h3>
        <div className="space-y-3">
          {krwData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">{item.label}</span>
                <span className="font-mono">{formatKRW(item.value)}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full ${item.color} transition-all duration-500 ease-out`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Loss vs Mid-Market (%)</h3>
        <div className="space-y-3">
          {lossData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">{item.label}</span>
                <span className="font-mono">{item.value.toFixed(2)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full ${item.color} transition-all duration-500 ease-out`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
