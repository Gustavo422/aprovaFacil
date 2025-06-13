import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Concursos Study App</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Cadastrar</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Sua plataforma completa para concursos públicos
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Simulados, questões semanais, planos de estudo personalizados e muito mais para você conquistar sua
                  aprovação.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register">
                  <Button size="lg">Começar agora</Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline">
                    Saiba mais
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Recursos principais</h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Tudo o que você precisa para se preparar para concursos públicos.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Simulados</CardTitle>
                    <CardDescription>Pratique com simulados completos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Simulados personalizados com timer e correção automática.</p>
                  </CardContent>
                  <CardFooter>
                    <Link href="/login" className="w-full">
                      <Button className="w-full">Acessar</Button>
                    </Link>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>100 Questões Semanais</CardTitle>
                    <CardDescription>Pratique com questões selecionadas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Questões selecionadas para praticar semanalmente.</p>
                  </CardContent>
                  <CardFooter>
                    <Link href="/login" className="w-full">
                      <Button className="w-full">Acessar</Button>
                    </Link>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Plano de Estudos</CardTitle>
                    <CardDescription>Plano personalizado para você</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Plano de estudos inteligente baseado no seu tempo disponível.</p>
                  </CardContent>
                  <CardFooter>
                    <Link href="/login" className="w-full">
                      <Button className="w-full">Acessar</Button>
                    </Link>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Flashcards</CardTitle>
                    <CardDescription>Memorize conceitos importantes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Flashcards dinâmicos baseados nos seus pontos fracos.</p>
                  </CardContent>
                  <CardFooter>
                    <Link href="/login" className="w-full">
                      <Button className="w-full">Acessar</Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Concursos Study App. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
