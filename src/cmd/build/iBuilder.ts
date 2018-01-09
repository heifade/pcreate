import { ProjectConfigModel } from "pcreate-config";

export interface iBuilder {
  run(projectPath: string, projectConfig: ProjectConfigModel): void;
}
