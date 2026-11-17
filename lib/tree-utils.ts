export interface TreeFolder {
  name: string
  files?: { id: string }[]
  subfolders?: TreeFolder[]
}

export function countFiles(folder: TreeFolder): number {
  let count = folder.files?.length ?? 0
  if (folder.subfolders) {
    count += folder.subfolders.reduce((acc, sub) => acc + countFiles(sub), 0)
  }
  return count
}

export function countAllFiles(folders: TreeFolder[]): number {
  return folders.reduce((acc, folder) => acc + countFiles(folder), 0)
}

export function countAllFolders(folders: TreeFolder[]): number {
  return folders.reduce((acc, folder) => {
    let count = 1
    if (folder.subfolders) {
      count += countAllFolders(folder.subfolders)
    }
    return acc + count
  }, 0)
}
