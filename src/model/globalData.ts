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
}
