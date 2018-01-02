import * as path from "path";


export class TemplateData {
  private static templatePath: string;

  public static setPath(path: string) {
    this.templatePath = path;
  }

  public static getProjectTemplate(subPath: string) {
    return path.join(this.templatePath, 'project', subPath);
  }

  public static getComponentPath(subPath: string) {
    return path.join(this.templatePath, "component", subPath);
  }
}