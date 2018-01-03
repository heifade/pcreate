


export async function readPackageJson(packageJsonFile: string) {
  return require(packageJsonFile);
}