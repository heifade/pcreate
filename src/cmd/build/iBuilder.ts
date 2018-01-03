import { IProjectConfig } from "../../model/IProjectConfig";

export interface iBuilder {
  run(projectPath: string, projectConfig: IProjectConfig): void;
}
