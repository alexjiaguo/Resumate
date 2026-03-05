/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENAI_API_KEY: string
  readonly VITE_OPENAI_BASE_URL: string
  readonly VITE_OPENAI_MODEL: string
  readonly VITE_GEMINI_API_KEY: string
  readonly VITE_GEMINI_BASE_URL: string
  readonly VITE_DEEPSEEK_API_KEY: string
  readonly VITE_CUSTOM_BASE_URL: string
  readonly VITE_CUSTOM_API_KEY: string
  readonly VITE_CUSTOM_MODEL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
