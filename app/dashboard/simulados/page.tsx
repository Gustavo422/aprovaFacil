import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Search } from "lucide-react"
import Link from "next/link"

export default function SimuladosPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Simulados</h1>
        <p className="text-sm md:text-base text-muted-foreground">Pratique com simulados completos para testar seus conhecimentos.</p>
      </div>

      {/* Search and Filter - Mobile optimized */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar simulados..." className="w-full pl-8 h-10" />
          </div>
          <Select defaultValue="todos">
            <SelectTrigger className="w-full sm:w-[180px] h-10">
              <SelectValue placeholder="Filtrar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os simulados</SelectItem>
              <SelectItem value="realizados">Realizados</SelectItem>
              <SelectItem value="nao-realizados">Não realizados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="disponiveis" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
          <TabsTrigger value="disponiveis" className="text-xs md:text-sm">Disponíveis</TabsTrigger>
          <TabsTrigger value="realizados" className="text-xs md:text-sm">Realizados</TabsTrigger>
          <TabsTrigger value="favoritos" className="text-xs md:text-sm">Favoritos</TabsTrigger>
        </TabsList>
        <TabsContent value="disponiveis" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                id: 1,
                title: "Simulado Completo - Direito Constitucional",
                description: "Simulado com 40 questões sobre Direito Constitucional",
                questions: 40,
                time: 120,
                difficulty: "Médio",
              },
              {
                id: 2,
                title: "Simulado Completo - Direito Administrativo",
                description: "Simulado com 30 questões sobre Direito Administrativo",
                questions: 30,
                time: 90,
                difficulty: "Médio",
              },
              {
                id: 3,
                title: "Simulado Completo - Português",
                description: "Simulado com 20 questões sobre Língua Portuguesa",
                questions: 20,
                time: 60,
                difficulty: "Fácil",
              },
              {
                id: 4,
                title: "Simulado Completo - Raciocínio Lógico",
                description: "Simulado com 15 questões sobre Raciocínio Lógico",
                questions: 15,
                time: 45,
                difficulty: "Difícil",
              },
              {
                id: 5,
                title: "Simulado Completo - Informática",
                description: "Simulado com 20 questões sobre Informática",
                questions: 20,
                time: 60,
                difficulty: "Médio",
              },
              {
                id: 6,
                title: "Simulado Completo - Direito Penal",
                description: "Simulado com 25 questões sobre Direito Penal",
                questions: 25,
                time: 75,
                difficulty: "Difícil",
              },
            ].map((simulado) => (
              <Card key={simulado.id} className="flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-start gap-2 text-sm md:text-base">
                    <FileText className="h-4 w-4 md:h-5 md:w-5 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{simulado.title}</span>
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm line-clamp-2">{simulado.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3 flex-1">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs md:text-sm">Questões:</span>
                      <span className="text-xs md:text-sm font-medium">{simulado.questions}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs md:text-sm">Tempo:</span>
                      <span className="text-xs md:text-sm font-medium">{simulado.time} min</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs md:text-sm">Dificuldade:</span>
                      <span className={`text-xs md:text-sm font-medium px-2 py-1 rounded-full ${
                        simulado.difficulty === 'Fácil' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        simulado.difficulty === 'Médio' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {simulado.difficulty}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Link href={`/dashboard/simulados/${simulado.id}`} className="w-full">
                    <Button className="w-full h-10 text-sm">Iniciar Simulado</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="realizados" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                id: 7,
                title: "Simulado Completo - Direito Constitucional",
                description: "Simulado com 40 questões sobre Direito Constitucional",
                questions: 40,
                time: 120,
                difficulty: "Médio",
                score: 32,
                date: "10/06/2025",
              },
              {
                id: 8,
                title: "Simulado Completo - Português",
                description: "Simulado com 20 questões sobre Língua Portuguesa",
                questions: 20,
                time: 60,
                difficulty: "Fácil",
                score: 18,
                date: "05/06/2025",
              },
            ].map((simulado) => (
              <Card key={simulado.id} className="flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-start gap-2 text-sm md:text-base">
                    <FileText className="h-4 w-4 md:h-5 md:w-5 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{simulado.title}</span>
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm line-clamp-2">{simulado.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3 flex-1">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs md:text-sm">Questões:</span>
                      <span className="text-xs md:text-sm font-medium">{simulado.questions}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs md:text-sm">Acertos:</span>
                      <span className="text-xs md:text-sm font-medium">
                        {simulado.score}/{simulado.questions}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs md:text-sm">Data:</span>
                      <span className="text-xs md:text-sm font-medium">{simulado.date}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs md:text-sm">Taxa de Acerto:</span>
                      <span className="text-xs md:text-sm font-medium text-green-600">
                        {Math.round((simulado.score / simulado.questions) * 100)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="flex w-full gap-2">
                    <Link href={`/dashboard/simulados/${simulado.id}/resultado`} className="flex-1">
                      <Button variant="outline" className="w-full h-10 text-xs">
                        Ver Resultado
                      </Button>
                    </Link>
                    <Link href={`/dashboard/simulados/${simulado.id}`} className="flex-1">
                      <Button className="w-full h-10 text-xs">Refazer</Button>
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="favoritos" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                id: 1,
                title: "Simulado Completo - Direito Constitucional",
                description: "Simulado com 40 questões sobre Direito Constitucional",
                questions: 40,
                time: 120,
                difficulty: "Médio",
              },
              {
                id: 3,
                title: "Simulado Completo - Português",
                description: "Simulado com 20 questões sobre Língua Portuguesa",
                questions: 20,
                time: 60,
                difficulty: "Fácil",
              },
            ].map((simulado) => (
              <Card key={simulado.id} className="flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-start gap-2 text-sm md:text-base">
                    <FileText className="h-4 w-4 md:h-5 md:w-5 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{simulado.title}</span>
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm line-clamp-2">{simulado.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3 flex-1">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs md:text-sm">Questões:</span>
                      <span className="text-xs md:text-sm font-medium">{simulado.questions}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs md:text-sm">Tempo:</span>
                      <span className="text-xs md:text-sm font-medium">{simulado.time} min</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs md:text-sm">Dificuldade:</span>
                      <span className={`text-xs md:text-sm font-medium px-2 py-1 rounded-full ${
                        simulado.difficulty === 'Fácil' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        simulado.difficulty === 'Médio' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {simulado.difficulty}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Link href={`/dashboard/simulados/${simulado.id}`} className="w-full">
                    <Button className="w-full h-10 text-sm">Iniciar Simulado</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
