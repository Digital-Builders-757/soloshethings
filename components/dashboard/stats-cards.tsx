import { FileText, Clock, CheckCircle, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatsCardsProps {
  stats: {
    total: number
    published: number
    draft: number
    pending: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Posts",
      value: stats.total,
      icon: FileText,
      description: "All your community posts",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Published",
      value: stats.published,
      icon: CheckCircle,
      description: "Live on the community",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Drafts",
      value: stats.draft,
      icon: Clock,
      description: "Waiting to be published",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Pending Review",
      value: stats.pending,
      icon: Eye,
      description: "Under moderation",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
