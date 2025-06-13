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
      <h1 className="text-3xl font-bold tracking-tight">Simulados</h1>
      <p className="text-muted-foreground">Pratique com simulados completos para testar seus conhecimentos.</p>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar simulados..." className="w-full pl-8" />
          </div>
          <Select defaultValue="todos">
            <SelectTrigger className="w-[180px]">
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
        <TabsList>
          <TabsTrigger value="disponiveis">Disponíveis</TabsTrigger>
          <TabsTrigger value="realizados">Realizados</TabsTrigger>
          <TabsTrigger value="favoritos">Favoritos</TabsTrigger>
        </TabsList>
        <TabsContent value="disponiveis" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
              <Card key={simulado.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {simulado.title}
                  </CardTitle>
                  <CardDescription>{simulado.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Questões:</span>
                      <span className="text-sm font-medium">{simulado.questions}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tempo:</span>
                      <span className="text-sm font-medium">{simulado.time} minutos</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Dificuldade:</span>
                      <span className="text-sm font-medium">{simulado.difficulty}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/dashboard/simulados/${simulado.id}`} className="w-full">
                    <Button className="w-full">Iniciar Simulado</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="realizados" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
              <Card key={simulado.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {simulado.title}
                  </CardTitle>
                  <CardDescription>{simulado.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Questões:</span>
                      <span className="text-sm font-medium">{simulado.questions}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Acertos:</span>
                      <span className="text-sm font-medium">
                        {simulado.score}/{simulado.questions}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Data:</span>
                      <span className="text-sm font-medium">{simulado.date}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex w-full gap-2">
                    <Link href={`/dashboard/simulados/${simulado.id}/resultado`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        Ver Resultado
                      </Button>
                    </Link>
                    <Link href={`/dashboard/simulados/${simulado.id}`} className="flex-1">
                      <Button className="w-full">Refazer</Button>
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="favoritos" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
              <Card key={simulado.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {simulado.title}
                  </CardTitle>
                  <CardDescription>{simulado.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Questões:</span>
                      <span className="text-sm font-medium">{simulado.questions}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tempo:</span>
                      <span className="text-sm font-medium">{simulado.time} minutos</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Dificuldade:</span>
                      <span className="text-sm font-medium">{simulado.difficulty}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/dashboard/simulados/${simulado.id}`} className="w-full">
                    <Button className="w-full">Iniciar Simulado</Button>
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
