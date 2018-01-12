export enum ProjectType {
  node,
  webpack,
  angular
}

export function getProjectTypeName(projectType: ProjectType) {
  switch (projectType) {
    case ProjectType.node:
      return "node";
    case ProjectType.webpack:
      return "webpack";
    case ProjectType.angular:
      return "angular";
  }
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
