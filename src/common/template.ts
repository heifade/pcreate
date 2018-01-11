import {join as pathJoin} from "path";


export class TemplateData {
  private static templatePath: string;

  public static setPath(path: string) {
    this.templatePath = path;
  }

  public static getProjectTemplate(subPath: string) {
    return pathJoin(this.templatePath, 'project', subPath);
  }

  public static getComponentPath(subPath: string) {
    return pathJoin(this.templatePath, "component", subPath);
  }
}