import { AuditLogger } from '@/lib/audit-logger';
describe('AuditLogger', () => {
  it('instancia e chama métodos públicos', async () => {
    const logger = new AuditLogger();
    await logger.logLogin('userId', true);
    await logger.logFailedLogin('email', 'reason');
  });
}); 