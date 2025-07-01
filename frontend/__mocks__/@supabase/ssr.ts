// Mock implementation for @supabase/ssr
const mockSupabaseClient = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  single: jest.fn().mockResolvedValue({ data: null, error: null }),
  maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
  auth: {
    getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
    signInWithPassword: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
    signUp: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
    signOut: jest.fn().mockResolvedValue({ error: null }),
    onAuthStateChange: jest.fn().mockImplementation((event, callback) => {
      // Return a cleanup function
      return () => {};
    }),
  },
  // Add other methods as needed
};

// Mock implementation for createBrowserClient
const createBrowserClient = jest.fn(() => mockSupabaseClient);

// Mock implementation for createServerClient
const createServerClient = jest.fn(() => mockSupabaseClient);

export {
  createBrowserClient,
  createServerClient,
  mockSupabaseClient as supabaseClient
};
