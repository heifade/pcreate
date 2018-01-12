import { ProjectConfigModel } from "pcreate-config/es";
import { saveFileUtf8Sync } from "fs-i/es";
import {join as pathJoin} from 'path';


export function ymlCreate(projectPath: string, projectConfig: ProjectConfigModel) {
  let fileContent = '';

  // if(projectConfig.)



  saveFileUtf8Sync(pathJoin(projectPath, '.travis.yml'), fileContent);
}