import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xjfsceqdidndtqftncum.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqZnNjZXFkaWRuZHRxZnRuY3VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMTYwNTgsImV4cCI6MjA5MDg5MjA1OH0.yqC9ml_Jwf7XOnvvpWuYcMoBbD1VD4RsNrtotkM508w';

// 1. Conector Supabase
export const ConectorSupabase = createClient(supabaseUrl, supabaseAnonKey);

export async function checkConnection() {
  try {
    const { error } = await ConectorSupabase.from('alunos').select('id').limit(1);
    // Mesmo que a tabela não exista, se não for erro de rede, a conexão está ok
    if (error && error.message === 'Failed to fetch') {
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
}
