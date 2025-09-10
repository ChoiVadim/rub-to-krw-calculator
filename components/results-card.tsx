import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatKRW, formatPct } from "@/lib/formatters"

interface ResultsCardProps {
  title: string
  rubInput: number
  krwOut: number
  effRate: number
  lossPct: number
  lossKrw: number
  variant: "ideal" | "p2p" | "korona"
}

export function ResultsCard({ title, rubInput, krwOut, effRate, lossPct, lossKrw, variant }: ResultsCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "ideal":
        return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
      case "p2p":
        return "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950"
      case "korona":
        return "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950"
      default:
        return ""
    }
  }

  return (
    <Card className={getVariantStyles()}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="text-sm text-muted-foreground">RUB Input</div>
          <div className="text-xl font-semibold">{rubInput.toLocaleString()} ₽</div>
        </div>

        <div>
          <div className="text-sm text-muted-foreground">KRW Output</div>
          <div className="text-2xl font-bold">{formatKRW(krwOut)}</div>
        </div>

        <div>
          <div className="text-sm text-muted-foreground">Effective Rate</div>
          <div className="text-lg font-semibold">{effRate.toFixed(4)} ₩/₽</div>
        </div>

        {variant !== "ideal" && (
          <div>
            <div className="text-sm text-muted-foreground">Loss vs Mid</div>
            <div
              className={`text-lg font-semibold ${
                lossKrw < 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              }`}
            >
              {lossKrw < 0 ? "+" : ""}
              {formatPct(lossPct)} ({lossKrw < 0 ? "+" : "-"}
              {formatKRW(Math.abs(lossKrw))})
            </div>
          </div>
        )}

        {variant === "ideal" && (
          <div>
            <div className="text-sm text-muted-foreground">Loss vs Mid</div>
            <div className="text-lg font-semibold text-green-600 dark:text-green-400">0% (Ideal Rate)</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
