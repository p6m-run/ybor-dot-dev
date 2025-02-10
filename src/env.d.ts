interface ImportMetaEnv {
    readonly NOTION_TOKEN: string;
    readonly PAGE_ID: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }