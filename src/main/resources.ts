import { app } from 'electron'
import path from 'path'

export function getResourcesRoot(): string {
  return app.isPackaged
    ? path.join(process.resourcesPath, 'resources')
    : path.join(app.getAppPath(), 'resources')
}

export function getIconPath(fileName: string): string {
  return path.join(getResourcesRoot(), fileName)
}
