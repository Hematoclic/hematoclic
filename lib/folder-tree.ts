import { Category } from './db'

export interface TreeFileItem {
  id: string
  name: string
  description?: string
  badge?: { text: string; color: string }
  href: string
  editHref?: string
  onDelete?: () => void
}

export interface TreeFolderNode {
  id?: string
  name: string
  files: TreeFileItem[]
  subfolders: TreeFolderNode[]
  onDeleteFolder?: () => void
}

interface CategorizedItem {
  categorie: string
}

interface BuildOptions<T extends CategorizedItem> {
  categories: Category[]
  items: T[]
  toFileItem: (item: T) => TreeFileItem
  onDeleteFolder?: (categoryId: string, name: string) => void
}

/**
 * Build a nested folder tree from a flat list of categories (with parent_id)
 * and items that reference a category by NAME (`item.categorie`).
 *
 * Items whose category name doesn't exist in the categories table are surfaced
 * as orphan folders at the root, so legacy data still renders.
 */
export function buildFolderTree<T extends CategorizedItem>({
  categories,
  items,
  toFileItem,
  onDeleteFolder,
}: BuildOptions<T>): TreeFolderNode[] {
  const itemsByCategoryName = new Map<string, T[]>()
  for (const item of items) {
    const list = itemsByCategoryName.get(item.categorie) ?? []
    list.push(item)
    itemsByCategoryName.set(item.categorie, list)
  }

  const buildSubtree = (parentId: string | null): TreeFolderNode[] =>
    categories
      .filter((c) => c.parentId === parentId)
      .map((c) => ({
        id: c.id,
        name: c.nom,
        files: (itemsByCategoryName.get(c.nom) ?? []).map(toFileItem),
        subfolders: buildSubtree(c.id),
        onDeleteFolder: onDeleteFolder ? () => onDeleteFolder(c.id, c.nom) : undefined,
      }))

  const rootFolders = buildSubtree(null)

  const knownNames = new Set(categories.map((c) => c.nom))
  const orphanNames = [...new Set(items.map((i) => i.categorie))].filter(
    (n) => n && !knownNames.has(n),
  )
  const orphanFolders: TreeFolderNode[] = orphanNames.map((name) => ({
    name,
    files: (itemsByCategoryName.get(name) ?? []).map(toFileItem),
    subfolders: [],
  }))

  return [...rootFolders, ...orphanFolders]
}

/**
 * Build a flat list of all categories with their full path label,
 * suitable for a <select> dropdown.
 */
export function flattenCategoriesWithPath(
  categories: Category[],
): Array<{ id: string; name: string; pathLabel: string }> {
  const result: Array<{ id: string; name: string; pathLabel: string }> = []

  const walk = (parentId: string | null, prefix: string[]) => {
    for (const c of categories.filter((x) => x.parentId === parentId)) {
      const path = [...prefix, c.nom]
      result.push({
        id: c.id,
        name: c.nom,
        pathLabel: path.join(' / '),
      })
      walk(c.id, path)
    }
  }

  walk(null, [])
  return result
}
