import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { FileText, Search, Clock, Target, Calendar } from "lucide-react"
import Link from "next/link"

const simulados = [
  {
    id: 1,
    title: "Direito Constitucional",
    description: "Simulado completo com questões fundamentais",
    questions: 40,
    time: 120,
    difficulty: "Médio",
    category: "Direito",
  },
  {
    id: 2,
    title: "Direito Administrativo",
    description: "Questões sobre administração pública",
    questions: 30,
    time: 90,
    difficulty: "Médio",
    category: "Direito",
  },
  {
    id: 3,
    title: "Língua Portuguesa",
    description: "Interpretação de texto e gramática",
    questions: 20,
    time: 60,
    difficulty: "Fácil",
    category: "Português",
  },
  {
    id: 4,
    title: "Raciocínio Lógico",
    description: "Problemas de lógica e matemática",
    questions: 15,
    time: 45,
    difficulty: "Difícil",
    category: "Exatas",
  },
  {
    id: 5,
    title: "Informática",
    description: "Conceitos básicos e aplicações",
    questions: 20,
    time: 60,
    difficulty: "Médio",
    category: "Tecnologia",
  },
  {
    id: 6,
    title: "Direito Penal",
    description: "Crimes e penalidades",
    questions: 25,
    time: 75,
    difficulty: "Difícil",
    category: "Direito",
  },
]

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Fácil':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'Médio':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'Difícil':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

export default function SimuladosPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Simulados</h1>
        <p className="text-muted-foreground">
          Pratique com simulados completos para testar seus conhecimentos.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Buscar simulados..." 
              className="pl-9" 
            />
          </div>
          <Select defaultValue="todos">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas as categorias</SelectItem>
              <SelectItem value="direito">Direito</SelectItem>
              <SelectItem value="portugues">Português</SelectItem>
              <SelectItem value="exatas">Exatas</SelectItem>
              <SelectItem value="tecnologia">Tecnologia</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Simulados Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {simulados.map((simulado) => (
          <Card key={simulado.id} className="card-hover flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <FileText className="h-8 w-8 text-primary flex-shrink-0" />
                <Badge variant="secondary" className="text-xs">
                  {simulado.category}
                </Badge>
              </div>
              <CardTitle className="text-lg leading-tight">
                {simulado.title}
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {simulado.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span>{simulado.questions} questões</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{simulado.time} min</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Dificuldade:</span>
                <Badge className={getDifficultyColor(simulado.difficulty)}>
                  {simulado.difficulty}
                </Badge>
              </div>
            </CardContent>
            
            <CardFooter className="pt-0">
              <Link href={`/dashboard/simulados/${simulado.id}`} className="w-full">
                <Button className="w-full">
                  Iniciar Simulado
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}