-- Criação da tabela de logs de auditoria
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN DEFAULT false,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_success ON audit_logs(success);
CREATE INDEX IF NOT EXISTS idx_audit_logs_ip_address ON audit_logs(ip_address);

-- Índice para consultas de atividades suspeitas
CREATE INDEX IF NOT EXISTS idx_audit_logs_suspicious ON audit_logs(action, created_at DESC) 
WHERE action IN ('LOGIN_FAILED', 'SUSPICIOUS_ACTIVITY', 'ACCOUNT_LOCKED', 'ACCESS_DENIED');

-- Função para atualizar o timestamp de updated_at
CREATE OR REPLACE FUNCTION update_audit_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER trigger_audit_logs_updated_at
    BEFORE UPDATE ON audit_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_audit_logs_updated_at();

-- Políticas RLS (Row Level Security)
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas seus próprios logs
CREATE POLICY "Users can view their own audit logs" ON audit_logs
    FOR SELECT
    USING (auth.uid() = user_id);

-- Política para o sistema inserir logs (apenas para usuários autenticados)
CREATE POLICY "System can insert audit logs" ON audit_logs
    FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- Política para administradores verem todos os logs
CREATE POLICY "Admins can view all audit logs" ON audit_logs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Função para limpar logs antigos (manter apenas 90 dias)
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM audit_logs 
    WHERE created_at < NOW() - INTERVAL '90 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Comentários para documentação
COMMENT ON TABLE audit_logs IS 'Tabela para armazenar logs de auditoria de autenticação e segurança';
COMMENT ON COLUMN audit_logs.user_id IS 'ID do usuário relacionado à ação (pode ser null para ações anônimas)';
COMMENT ON COLUMN audit_logs.action IS 'Tipo de ação realizada (LOGIN, LOGOUT, LOGIN_FAILED, etc.)';
COMMENT ON COLUMN audit_logs.details IS 'Detalhes adicionais da ação em formato JSON';
COMMENT ON COLUMN audit_logs.ip_address IS 'Endereço IP do usuário';
COMMENT ON COLUMN audit_logs.user_agent IS 'User agent do navegador';
COMMENT ON COLUMN audit_logs.success IS 'Indica se a ação foi bem-sucedida';
COMMENT ON COLUMN audit_logs.error_message IS 'Mensagem de erro em caso de falha';

-- Inserir alguns logs de exemplo (opcional)
-- INSERT INTO audit_logs (user_id, action, details, success) VALUES 
-- (NULL, 'SYSTEM_STARTUP', '{"version": "1.0.0"}', true); 