import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Clock, XCircle } from "lucide-react"
import Link from "next/link"

// Simulado de exemplo
const simuladoExemplo = {
  id: 1,
  title: "Simulado Completo - Direito Constitucional",
  description: "Simulado com 40 questões sobre Direito Constitucional",
  questions: [
    {
      id: 1,
      text: "De acordo com a Constituição Federal de 1988, são Poderes da União, independentes e harmônicos entre si:",
      options: [
        { id: "a", text: "O Legislativo, o Executivo, o Judiciário e o Ministério Público." },
        { id: "b", text: "O Legislativo, o Executivo e o Judiciário." },
        { id: "c", text: "O Legislativo, o Executivo, o Judiciário e o Tribunal de Contas." },
        { id: "d", text: "O Legislativo, o Executivo, o Judiciário e a Defensoria Pública." },
        { id: "e", text: "O Legislativo, o Executivo, o Judiciário e a Advocacia Pública." },
      ],
      correctAnswer: "b",
      userAnswer: "b",
      explanation:
        "Conforme o art. 2º da Constituição Federal, 'São Poderes da União, independentes e harmônicos entre si, o Legislativo, o Executivo e o Judiciário'. O Ministério Público, o Tribunal de Contas, a Defensoria Pública e a Advocacia Pública são órgãos com funções essenciais à Justiça, mas não são Poderes da República.",
    },
    {
      id: 2,
      text: "Sobre os direitos e garantias fundamentais previstos na Constituição Federal, é correto afirmar que:",
      options: [
        { id: "a", text: "São garantidos apenas aos brasileiros natos." },
        { id: "b", text: "Não podem ser objeto de emenda constitucional." },
        { id: "c", text: "Podem ser suspensos durante o estado de sítio." },
        { id: "d", text: "Não se aplicam às relações privadas." },
        { id: "e", text: "São taxativamente enumerados na Constituição." },
      ],
      correctAnswer: "c",
      userAnswer: "b",
      explanation:
        "De acordo com o art. 138, § 1º, da Constituição Federal, durante o estado de sítio decretado com fundamento no art. 137, I, só poderão ser tomadas contra as pessoas as seguintes medidas: obrigação de permanência em localidade determinada; detenção em edifício não destinado a acusados ou condenados por crimes comuns; restrições relativas à inviolabilidade da correspondência, ao sigilo das comunicações, à prestação de informações e à liberdade de imprensa, radiodifusão e televisão; suspensão da liberdade de reunião; busca e apreensão em domicílio; intervenção nas empresas de serviços públicos; requisição de bens.",
    },
    {
      id: 3,
      text: "A respeito do controle de constitucionalidade no Brasil, é correto afirmar que:",
      options: [
        { id: "a", text: "O controle difuso só pode ser exercido pelo Supremo Tribunal Federal." },
        { id: "b", text: "O controle concentrado pode ser exercido por qualquer juiz ou tribunal." },
        { id: "c", text: "A decisão no controle difuso tem efeito erga omnes." },
        { id: "d", text: "A Ação Direta de Inconstitucionalidade pode ser proposta por qualquer cidadão." },
        { id: "e", text: "O Supremo Tribunal Federal exerce tanto o controle concentrado quanto o difuso." },
      ],
      correctAnswer: "e",
      userAnswer: "e",
      explanation:
        "O Supremo Tribunal Federal exerce o controle concentrado de constitucionalidade por meio das ações diretas (ADI, ADC, ADPF) e também o controle difuso, quando julga recursos extraordinários ou outras ações originárias que envolvam questão constitucional.",
    },
    {
      id: 4,
      text: "Sobre o processo legislativo previsto na Constituição Federal, é correto afirmar que:",
      options: [
        { id: "a", text: "As medidas provisórias podem versar sobre qualquer matéria." },
        {
          id: "b",
          text: "A iniciativa popular de lei exige a subscrição de, no mínimo, um por cento do eleitorado nacional.",
        },
        { id: "c", text: "As emendas constitucionais podem ser propostas por qualquer membro do Congresso Nacional." },
        {
          id: "d",
          text: "O veto presidencial pode ser derrubado por maioria absoluta dos membros do Congresso Nacional.",
        },
        { id: "e", text: "As leis complementares são aprovadas por maioria simples." },
      ],
      correctAnswer: "d",
      userAnswer: "a",
      explanation:
        "Conforme o art. 66, § 4º, da Constituição Federal, 'O veto será apreciado em sessão conjunta, dentro de trinta dias a contar de seu recebimento, só podendo ser rejeitado pelo voto da maioria absoluta dos Deputados e Senadores'.",
    },
    {
      id: 5,
      text: "Sobre a organização político-administrativa do Estado brasileiro, é correto afirmar que:",
      options: [
        { id: "a", text: "Os Municípios não são considerados entes federativos." },
        { id: "b", text: "O Distrito Federal possui competências legislativas reservadas aos Estados e Municípios." },
        { id: "c", text: "Os Territórios Federais integram a União como autarquias territoriais." },
        { id: "d", text: "Os Estados podem incorporar-se entre si mediante aprovação do Congresso Nacional." },
        { id: "e", text: "A criação de novos Municípios depende de lei federal." },
      ],
      correctAnswer: "b",
      userAnswer: "d",
      explanation:
        "De acordo com o art. 32, § 1º, da Constituição Federal, 'Ao Distrito Federal são atribuídas as competências legislativas reservadas aos Estados e Municípios'.",
    },
  ],
  time: 15, // 15 minutos para o simulado de exemplo (reduzido para fins de demonstração)
  userTime: 12, // tempo que o usuário levou para concluir o simulado
}

export default function ResultadoPage({ params }: { params: { id: string } }) {
  // Calcular estatísticas
  const totalQuestions = simuladoExemplo.questions.length
  const correctAnswers = simuladoExemplo.questions.filter((q) => q.userAnswer === q.correctAnswer).length
  const wrongAnswers = totalQuestions - correctAnswers
  const score = (correctAnswers / totalQuestions) * 100

  // Formatar o tempo
  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hrs > 0 ? `${hrs}h ${mins}min` : `${mins}min`
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Resultado do Simulado</h1>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          <span className="font-medium">{formatTime(simuladoExemplo.userTime)}</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{simuladoExemplo.title}</CardTitle>
          <CardDescription>{simuladoExemplo.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pontuação</span>
                <span className="text-sm font-medium">{score.toFixed(1)}%</span>
              </div>
              <Progress value={score} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center rounded-lg border p-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <span className="mt-2 text-2xl font-bold">{correctAnswers}</span>
                <span className="text-sm text-muted-foreground">Acertos</span>
              </div>
              <div className="flex flex-col items-center rounded-lg border p-4">
                <XCircle className="h-8 w-8 text-red-500" />
                <span className="mt-2 text-2xl font-bold">{wrongAnswers}</span>
                <span className="text-sm text-muted-foreground">Erros</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col rounded-lg border p-4">
                <span className="text-sm text-muted-foreground">Tempo Total</span>
                <span className="text-lg font-medium">{formatTime(simuladoExemplo.userTime)}</span>
              </div>
              <div className="flex flex-col rounded-lg border p-4">
                <span className="text-sm text-muted-foreground">Tempo Médio por Questão</span>
                <span className="text-lg font-medium">
                  {formatTime(Math.round(simuladoExemplo.userTime / totalQuestions))}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/dashboard/simulados">
            <Button variant="outline">Voltar para Simulados</Button>
          </Link>
          <Link href={`/dashboard/simulados/${params.id}`}>
            <Button>Refazer Simulado</Button>
          </Link>
        </CardFooter>
      </Card>

      <h2 className="mt-4 text-xl font-bold tracking-tight">Revisão das Questões</h2>

      <Tabs defaultValue="todas" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="corretas">Corretas</TabsTrigger>
          <TabsTrigger value="incorretas">Incorretas</TabsTrigger>
        </TabsList>
        <TabsContent value="todas" className="space-y-4">
          {simuladoExemplo.questions.map((question) => (
            <Card
              key={question.id}
              className={question.userAnswer === question.correctAnswer ? "border-green-200" : "border-red-200"}
            >
              <CardHeader>
                <CardTitle className="flex items-start gap-2">
                  {question.userAnswer === question.correctAnswer ? (
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                  ) : (
                    <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                  )}
                  <span>{question.text}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {question.options.map((option) => (
                    <div
                      key={option.id}
                      className={`flex items-start space-x-2 rounded-md border p-3 ${
                        option.id === question.correctAnswer
                          ? "border-green-500 bg-green-50 dark:bg-green-950"
                          : option.id === question.userAnswer && option.id !== question.correctAnswer
                            ? "border-red-500 bg-red-50 dark:bg-red-950"
                            : ""
                      }`}
                    >
                      <div className="flex h-5 w-5 items-center justify-center rounded-full border">{option.id}</div>
                      <span className="text-sm">{option.text}</span>
                    </div>
                  ))}

                  <div className="mt-4 rounded-md bg-muted p-4">
                    <h4 className="mb-2 font-medium">Explicação:</h4>
                    <p className="text-sm">{question.explanation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="corretas" className="space-y-4">
          {simuladoExemplo.questions
            .filter((question) => question.userAnswer === question.correctAnswer)
            .map((question) => (
              <Card key={question.id} className="border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                    <span>{question.text}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {question.options.map((option) => (
                      <div
                        key={option.id}
                        className={`flex items-start space-x-2 rounded-md border p-3 ${
                          option.id === question.correctAnswer ? "border-green-500 bg-green-50 dark:bg-green-950" : ""
                        }`}
                      >
                        <div className="flex h-5 w-5 items-center justify-center rounded-full border">{option.id}</div>
                        <span className="text-sm">{option.text}</span>
                      </div>
                    ))}

                    <div className="mt-4 rounded-md bg-muted p-4">
                      <h4 className="mb-2 font-medium">Explicação:</h4>
                      <p className="text-sm">{question.explanation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
        <TabsContent value="incorretas" className="space-y-4">
          {simuladoExemplo.questions
            .filter((question) => question.userAnswer !== question.correctAnswer)
            .map((question) => (
              <Card key={question.id} className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-start gap-2">
                    <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                    <span>{question.text}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {question.options.map((option) => (
                      <div
                        key={option.id}
                        className={`flex items-start space-x-2 rounded-md border p-3 ${
                          option.id === question.correctAnswer
                            ? "border-green-500 bg-green-50 dark:bg-green-950"
                            : option.id === question.userAnswer
                              ? "border-red-500 bg-red-50 dark:bg-red-950"
                              : ""
                        }`}
                      >
                        <div className="flex h-5 w-5 items-center justify-center rounded-full border">{option.id}</div>
                        <span className="text-sm">{option.text}</span>
                      </div>
                    ))}

                    <div className="mt-4 rounded-md bg-muted p-4">
                      <h4 className="mb-2 font-medium">Explicação:</h4>
                      <p className="text-sm">{question.explanation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
