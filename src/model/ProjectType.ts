export enum ProjectType {
  node,
  webpack,
  angular
}

export function newProjectType(typeName: string) {
  switch (typeName) {
    case "node":
      return ProjectType.node;
    case "webpack":
      return ProjectType.webpack;
    case "angular":
      return ProjectType.angular;
  }
}
