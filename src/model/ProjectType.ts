export enum ProjectType {
  node,
  webpack,
  angular2
}

export function newProjectType(typeName: string) {
  switch (typeName) {
    case "node":
      return ProjectType.node;
    case "webpack":
      return ProjectType.webpack;
    case "angular2":
      return ProjectType.angular2;
  }
}
