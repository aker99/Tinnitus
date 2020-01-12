export class Chapter {
    id: string;
    name: string;
    content: string;

    static findByIdInArray(chapters: Chapter[], id: string) {
        const found = chapters.find( chapter => {
            return chapter.id === id;
          });
        return found;
    }

    static findIndexInArray(chapters: Chapter[], id: string) {
        for (let index = 0; index < chapters.length; index++) {
            if (id === chapters[index].id) {
                return index;
            }
        }
        return -1;
    }
}
