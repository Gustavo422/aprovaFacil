"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useErrorHandler, useAuthErrorHandler, useDataErrorHandler } from "@/hooks/use-error-handler"
import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react"

export function ErrorExample() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  
  // Hook especializado para autenticação
  const authHandler = useAuthErrorHandler()
  
  // Hook especializado para dados
  const dataHandler = useDataErrorHandler()
  
  // Hook genérico para operações customizadas
  const customHandler = useErrorHandler({
    showToast: true,
    toastTitle: "Erro de Formulário",
    fallbackMessage: "Erro ao processar formulário."
  })

  // Simular login
  const handleLogin = async () => {
    await authHandler.execute(async () => {
      // Simular erro de credenciais inválidas
      if (email === "test@error.com") {
        throw new Error("Invalid login credentials")
      }
      
      // Simular erro de rate limit
      if (email === "rate@limit.com") {
        throw new Error("Request rate limit reached")
      }
      
      // Simular erro de rede
      if (email === "network@error.com") {
        throw new Error("fetch failed")
      }
      
      // Simular sucesso
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { success: true, user: { email } }
    })
  }

  // Simular busca de dados
  const handleFetchData = async () => {
    await dataHandler.execute(async () => {
      // Simular erro de servidor
      if (Math.random() > 0.7) {
        throw new Error("Internal server error")
      }
      
      // Simular timeout
      if (Math.random() > 0.5) {
        await new Promise(resolve => setTimeout(resolve, 3000))
      }
      
      return { data: "Dados carregados com sucesso!" }
    })
  }

  // Simular operação customizada
  const handleCustomOperation = async () => {
    await customHandler.execute(async () => {
      // Simular validação
      if (!email || !password) {
        throw new Error("validation failed")
      }
      
      // Simular operação
      await new Promise(resolve => setTimeout(resolve, 500))
      return { result: "Operação concluída!" }
    })
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Exemplo de Tratamento de Erros</CardTitle>
          <CardDescription>
            Teste diferentes cenários de erro para ver como o sistema responde.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@error.com para testar erros"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite qualquer senha"
            />
          </div>

          <div className="space-y-2">
            <Button 
              onClick={handleLogin} 
              disabled={authHandler.isLoading}
              className="w-full"
            >
              {authHandler.isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              Testar Login
            </Button>
            
            <Button 
              onClick={handleFetchData} 
              disabled={dataHandler.isLoading}
              variant="outline"
              className="w-full"
            >
              {dataHandler.isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              Buscar Dados
            </Button>
            
            <Button 
              onClick={handleCustomOperation} 
              disabled={customHandler.isLoading}
              variant="secondary"
              className="w-full"
            >
              {customHandler.isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              Operação Customizada
            </Button>
          </div>

          {/* Exibir erros */}
          {authHandler.error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Erro de Autenticação:</strong> {authHandler.error.message}
              </AlertDescription>
            </Alert>
          )}

          {dataHandler.error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Erro de Dados:</strong> {dataHandler.error.message}
              </AlertDescription>
            </Alert>
          )}

          {customHandler.error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Erro Customizado:</strong> {customHandler.error.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Exibir sucessos */}
          {authHandler.data && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Login bem-sucedido!</strong> {JSON.stringify(authHandler.data)}
              </AlertDescription>
            </Alert>
          )}

          {dataHandler.data && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Dados carregados!</strong> {JSON.stringify(dataHandler.data)}
              </AlertDescription>
            </Alert>
          )}

          {customHandler.data && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Operação concluída!</strong> {JSON.stringify(customHandler.data)}
              </AlertDescription>
            </Alert>
          )}

          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Emails para testar:</strong></p>
            <p>• test@error.com - Credenciais inválidas</p>
            <p>• rate@limit.com - Rate limit</p>
            <p>• network@error.com - Erro de rede</p>
            <p>• Qualquer outro - Sucesso</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 