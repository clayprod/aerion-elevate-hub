/**
 * Wrapper para DOMPurify que só funciona no browser
 * Este arquivo permite que o Vite resolva o módulo durante o build
 * mas só executa no browser
 */

let DOMPurifyInstance: any = null;

export async function getDOMPurify() {
  if (typeof window === 'undefined') {
    // SSR - retornar uma função mock que não faz nada
    return {
      default: {
        sanitize: (html: string) => html,
      },
    };
  }

  if (!DOMPurifyInstance) {
    // Usar string literal para ajudar o Vite a resolver o módulo
    const dompurifyModule = 'dompurify';
    DOMPurifyInstance = await import(/* @vite-ignore */ dompurifyModule);
  }

  return DOMPurifyInstance;
}

