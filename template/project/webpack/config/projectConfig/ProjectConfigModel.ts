import { CompileModel } from "./CompileModel";

/**
 * 配置文件结构
 *
 * @export
 * @class ProjectConfigModel
 */
export class ProjectConfigModel {
  /**
   * 项目类型
   *
   * @type {("node" | "webpack" | "angular")}
   * @memberof ProjectConfigModel
   */
  projectType: "node" | "webpack" | "angular" = "node";

  /**
   * 编译选项
   * 
   * @type {(Array<CompileModel> | CompileModel)}
   * @memberof ProjectConfigModel
   */
  compile?: Array<CompileModel> | CompileModel;

  sourceInclude?: Array<string> = ["./src/**/*"];

  /**
   * 此项目是否是命令行
   * 1、boolean: 当有true时，以项目名作为命令行；当false或为null时，不作为命令行使用
   * 2、string: 命令行名称
   * 3、string[]: 多个命令行名称
   *
   * @type {(boolean | string | string[])}
   * @memberof ProjectConfigModel
   */
  command?: boolean | string | string[] = false;

  /**
   * 是否生成文档
   *
   * @type {boolean}
   * @memberof ProjectConfigModel
   */
  documents?: boolean = false;

  /**
   * 是否需要单元测试
   *
   * @type {boolean}
   * @memberof ProjectConfigModel
   */
  unitTest?: boolean = false;
}
