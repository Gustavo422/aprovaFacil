import { vi } from 'vitest';
import '@testing-library/jest-dom';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.test
dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });

globalThis.fetch = vi.fn();