import { fileStorageService } from "./fileStorage";
import { courseStorageService } from "./localStorage";


class CourseDraftService {
  async saveDraft(data: any, files: { [key: string]: File }): Promise<void> {
    const cleanedData = {
      ...data,
      sections: data.sections?.map((section: any) => {
        const { id, ...rest } = section;
        return rest;
      })
    };

    courseStorageService.saveDraft(cleanedData);

    const filePromises = Object.entries(files).map(([key, file]) =>
      fileStorageService.saveFile(key, file)
    );

    await Promise.all(filePromises);
  }

  async loadDraft(): Promise<{
    data: any;
    files: { [key: string]: File };
  } | null> {
    const data = courseStorageService.getDraft();
    if (!data) return null;

    // Récupérer tous les fichiers
    const allFiles = await fileStorageService.getAllFiles();
    const filesMap: { [key: string]: File } = {};

    allFiles.forEach(({ id, file }) => {
      filesMap[id] = file;
    });

    return { data, files: filesMap };
  }

  async clearDraft(): Promise<void> {
    courseStorageService.clearDraft();
    await fileStorageService.clear();
  }

  hasDraft(): boolean {
    return courseStorageService.hasDraft();
  }
}

export const courseDraftService = new CourseDraftService();