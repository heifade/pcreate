import { ProjectType } from './ProjectType';

export class GlobalData {
  private static get hash() {
    let key = "localData";
    let value: any = {};
    if (!Reflect.has(global, key)) {
      Reflect.set(global, key, value);
    } else {
      value = Reflect.get(global, key);
    }

    return value;
  }

  public static get projectName(): string {
    return this.hash.projectName;
  }
  public static set projectName(name: string) {
    this.hash.projectName = name;
  }

  public static get projectType(): ProjectType {
    return this.hash.projectType;
  }
  public static set projectType(type: ProjectType) {
    this.hash.projectType = type;
  }

  public static get projectRootPath(): string {
    return this.hash.projectRootPath;
  }
  public static set projectRootPath(path: string) {
    this.hash.projectRootPath = path;
  }


}
