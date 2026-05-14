// ConectorAPI.ts — Substitui o ConectorSupabase
// Cliente HTTP com autenticação JWT para comunicação com o backend Express/MySQL

const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001';

// Chave para armazenar o token JWT no localStorage
const TOKEN_KEY = 'reforco_jwt_token';
const USER_KEY  = 'reforco_user';

// ─── Gerenciamento de Token ───────────────────────────────────────────────────

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): any {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setStoredUser(user: any) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// ─── Fetch com Auth ───────────────────────────────────────────────────────────

async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erro desconhecido' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// ─── Autenticação ─────────────────────────────────────────────────────────────

export const ConectorAPI = {
  auth: {
    async signUp({ email, password, nome, data_nasc }: any) {
      try {
        const data = await apiFetch('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify({ email, password, nome, data_nasc }),
        });
        setToken(data.token);
        setStoredUser(data.user);
        return { data, error: null };
      } catch (err: any) {
        return { data: null, error: { message: err.message } };
      }
    },

    async signInWithPassword({ email, password }: any) {
      try {
        const data = await apiFetch('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        setToken(data.token);
        setStoredUser(data.user);
        return { data, error: null };
      } catch (err: any) {
        return { data: null, error: { message: err.message } };
      }
    },

    async signOut() {
      removeToken();
      return { error: null };
    },

    async getSession() {
      const token = getToken();
      const user  = getStoredUser();
      if (token && user) {
        return { data: { session: { user: { email: user.email, id: user.id } } } };
      }
      return { data: { session: null } };
    },

    async getUser() {
      const user = getStoredUser();
      if (user) return { data: { user: { id: user.id, email: user.email } } };
      return { data: { user: null } };
    },

    async updateEmail({ currentPassword, newEmail }: any) {
      try {
        await apiFetch('/api/auth/update-email', {
          method: 'POST',
          body: JSON.stringify({ currentPassword, newEmail }),
        });
        const stored = getStoredUser();
        if (stored) setStoredUser({ ...stored, email: newEmail });
        return { error: null };
      } catch (err: any) {
        return { error: { message: err.message } };
      }
    },

    async updatePassword({ currentPassword, newPassword }: any) {
      try {
        await apiFetch('/api/auth/update-password', {
          method: 'POST',
          body: JSON.stringify({ currentPassword, newPassword }),
        });
        return { error: null };
      } catch (err: any) {
        return { error: { message: err.message } };
      }
    },

    // Listener de mudança de auth (compatibilidade com Supabase)
    onAuthStateChange(callback: (event: string, session: any) => void) {
      // Simula o padrão do Supabase. O real controle é via useAuth.
      const subscription = { unsubscribe: () => {} };
      return { data: { subscription } };
    },

    // Reset de senha simplificado
    async resetPasswordForEmail(email: string) {
      try {
        await apiFetch('/api/auth/forgot-password', {
          method: 'POST',
          body: JSON.stringify({ email }),
        });
        return { error: null };
      } catch (err: any) {
        return { error: { message: err.message } };
      }
    },

    async resetPassword({ token, newPassword }: any) {
      try {
        await apiFetch('/api/auth/reset-password', {
          method: 'POST',
          body: JSON.stringify({ token, newPassword }),
        });
        return { error: null };
      } catch (err: any) {
        return { error: { message: err.message } };
      }
    },
  },

  // ─── Métodos de Dados (CRUD via API REST) ──────────────────────────────────

  from(tabela: string) {
    return new QueryBuilder(tabela);
  },
};

// ─── Query Builder (compatibilidade com padrão Supabase) ─────────────────────

class QueryBuilder {
  private _tabela: string;
  private _filters: { field: string; value: any }[] = [];
  private _orderField: string | null = null;
  private _orderAsc: boolean = true;
  private _limit: number | null = null;

  constructor(tabela: string) {
    this._tabela = tabela;
  }

  eq(field: string, value: any) {
    this._filters.push({ field, value });
    return this;
  }

  order(field: string, options: { ascending: boolean }) {
    this._orderField = field;
    this._orderAsc = options.ascending;
    return this;
  }

  limit(n: number) {
    this._limit = n;
    return this;
  }

  select(_cols?: string) {
    // No nosso backend customizado, o select é implícito no GET
    return this;
  }

  // Torna o QueryBuilder "Thenable" (se comporta como uma Promise)
  // Isso permite usar: await ConectorAPI.from('tabela').select('*')
  async then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    try {
      const result = await this._execute('GET', null);
      if (typeof onfulfilled === 'function') {
        return onfulfilled(result);
      }
      return result;
    } catch (err) {
      if (typeof onrejected === 'function') {
        return onrejected(err);
      }
      throw err;
    }
  }

  maybeSingle() {
    return this._execute('GET', null, true);
  }

  async insert(items: any[]) {
    return this._execute('POST', items[0]);
  }

  async update(data: any) {
    return this._execute('PATCH', data);
  }

  async delete() {
    return this._execute('DELETE', null);
  }

  private async _execute(method: string, body: any, single = false): Promise<any> {
    try {
      // Determinar o endpoint e ID para operações específicas
      const idFilter = this._filters.find(f => f.field === 'id');
      const id = idFilter?.value;

      // Endpoints especiais
      if (this._tabela === 'mensalidades' && method === 'PATCH') {
        const statusFilter = this._filters.find(f => f.field === 'id');
        if (statusFilter && body?.status) {
          const data = await apiFetch(`/api/mensalidades/${statusFilter.value}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status: body.status }),
          });
          return { data, error: null };
        }
      }

      let endpoint = `/api/${this._tabela}`;
      if (id && (method === 'PATCH' || method === 'DELETE')) {
        endpoint += `/${id}`;
      }

      const data = await apiFetch(endpoint, {
        method,
        ...(body ? { body: JSON.stringify(body) } : {}),
      });

      if (single) {
        return { data: Array.isArray(data) ? (data[0] || null) : data, error: null };
      }
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: { message: err.message } };
    }
  }
}

// ─── Verificação de Conexão ───────────────────────────────────────────────────

export async function checkConnection(): Promise<boolean> {
  try {
    const BASE_URL_FETCH = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001';
    const res = await fetch(`${BASE_URL_FETCH}/api/health`);
    return res.ok;
  } catch {
    return false;
  }
}
