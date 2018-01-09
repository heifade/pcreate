import { ProjectConfigModel } from "../../model/projectConfig/ProjectConfigModel";

export interface iBuilder {
  run(projectPath: string, projectConfig: ProjectConfigModel): void;
}
