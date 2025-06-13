"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, User, Bell, Shield, Palette } from "lucide-react"
import { useState } from "react"

export default function ConfiguracoesPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weekly: true,
    daily: false
  })

  const preferences = {
    theme: "system",
    language: "pt-BR",
    timezone: "America/Sao_Paulo"
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
      <p className="text-muted-foreground">Gerencie suas preferências e configurações da conta.</p>

      <div className="grid gap-6">
        {/* Perfil */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Perfil
            </CardTitle>
            <CardDescription>
              Gerencie suas informações pessoais e preferências de estudo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" placeholder="Seu nome completo" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" placeholder="seu@email.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="concurso">Concurso de Interesse</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um concurso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="policia-federal">Polícia Federal</SelectItem>
                  <SelectItem value="receita-federal">Receita Federal</SelectItem>
                  <SelectItem value="tribunais">Tribunais</SelectItem>
                  <SelectItem value="ministerios">Ministérios</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>Salvar Alterações</Button>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
            </CardTitle>
            <CardDescription>
              Configure como você quer receber notificações sobre seus estudos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações por E-mail</Label>
                <p className="text-sm text-muted-foreground">
                  Receba lembretes e atualizações por e-mail
                </p>
              </div>
              <Switch 
                checked={notifications.email} 
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações Push</Label>
                <p className="text-sm text-muted-foreground">
                  Receba notificações no navegador
                </p>
              </div>
              <Switch 
                checked={notifications.push} 
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Resumo Semanal</Label>
                <p className="text-sm text-muted-foreground">
                  Receba um resumo do seu progresso semanal
                </p>
              </div>
              <Switch 
                checked={notifications.weekly} 
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, weekly: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Lembretes Diários</Label>
                <p className="text-sm text-muted-foreground">
                  Lembretes para estudar todos os dias
                </p>
              </div>
              <Switch 
                checked={notifications.daily} 
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, daily: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Aparência */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Aparência
            </CardTitle>
            <CardDescription>
              Personalize a aparência da aplicação.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="theme">Tema</Label>
              <Select defaultValue="system">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um tema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Escuro</SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Segurança */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Segurança
            </CardTitle>
            <CardDescription>
              Gerencie a segurança da sua conta.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="current-password">Senha Atual</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-password">Nova Senha</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
              <Input id="confirm-password" type="password" />
            </div>
            <Button>Alterar Senha</Button>
          </CardContent>
        </Card>

        {/* Dados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Dados
            </CardTitle>
            <CardDescription>
              Gerencie seus dados e informações.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline">Exportar Dados</Button>
            <Button variant="destructive">Excluir Conta</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 