export class CompileModel {
  noImplicitAny?: boolean = true;
  outDir: string;
  sourceMap?: boolean = true;
  module?: "none" | "commonjs" | "amd" | "system" | "umd" | "es2015" | "ESNext" = "commonjs";
  target?: "ES3" | "ES5" | "ES2015" | "ES2016" | "ES2017" | "ESNEXT" = "ES5";
  declaration?: boolean = true;
  allowJs?: boolean = false;
}
