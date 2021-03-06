import firebase from "firebase";
import uuid from "uuid/v4";
import ChapterEntity, { IChapter } from "@/entities/Chapter";
import PageEntity, { IPage } from "@/entities/Page";

export interface IProjectTree {
  identifier: Identifier;
  owner: string;
  chapters?: IChapter[];
  pages?: IPage[];
}

export default class ProjectTreeEntity {
  private _props: IProjectTree;

  constructor(params: IProjectTree) {
    this._props = {
      chapters: [],
      pages: [],
      ...params
    };
  }

  static newEntity({ owner }: { owner: string }): ProjectTreeEntity {
    return new ProjectTreeEntity({
      identifier: uuid(),
      owner
    });
  }

  get props() {
    return this._props;
  }

  get chapters(): ChapterEntity[] {
    return this._props.chapters.map(chapter => new ChapterEntity(chapter));
  }

  get pages(): PageEntity[] {
    return this._props.pages.map(page => new PageEntity(page));
  }

  registerChapter({ name, parentId }: { name: string; parentId: string }) {
    const chapterEntity = new ChapterEntity({
      name,
      owner: this._props.owner,
      identifier: uuid()
    });

    const pushToParent = (chapters: IChapter[]): IChapter[] => {
      return chapters.reduce((prev, chapter) => {
        if (chapter.identifier === parentId) {
          chapter.chapters.push(chapterEntity.props);
        } else {
          chapter.chapters = pushToParent(chapter.chapters);
        }
        prev.push(chapter);
        return prev;
      }, []);
    };

    if (this._props.identifier === parentId) {
      this._props.chapters.push(chapterEntity.props);
      return;
    } else {
      this._props.chapters = pushToParent(this._props.chapters);
    }
  }

  registerPage({
    name,
    pageContentRef,
    parentId
  }: {
    name: string;
    pageContentRef: firebase.firestore.DocumentReference;
    parentId: string;
  }) {
    const pageEntity = new PageEntity({
      name,
      owner: this._props.owner,
      pageContent: pageContentRef,
      identifier: uuid()
    });

    const pushToParent = (chapters: IChapter[]): IChapter[] => {
      return chapters.reduce((prev, chapter) => {
        if (chapter.identifier === parentId) {
          chapter.pages.push(pageEntity.props);
        } else {
          chapter.chapters = pushToParent(chapter.chapters);
        }
        prev.push(chapter);
        return prev;
      }, []);
    };

    if (this._props.identifier === parentId) {
      this._props.pages.push(pageEntity.props);
      return;
    } else {
      this._props.chapters = pushToParent(this._props.chapters);
    }
  }

  getAllPages(): firebase.firestore.DocumentReference[] {
    // Method to scan all pages in single chapter
    const walk = (chapter: IChapter): IPage[] => {
      const pagesInChapters = chapter.chapters
        ? chapter.chapters.reduce(
            (prev, current) => {
              return [...prev, ...walk(current)];
            },
            [] as IPage[]
          )
        : [];

      const pagesInRoot = chapter.pages ? chapter.pages : [];

      return [...pagesInChapters, ...pagesInRoot];
    };

    // Get all page IDs on the project
    const pagesInChapters = this._props.chapters.reduce(
      (prev, current) => {
        return [...prev, ...walk(current)];
      },
      [] as IPage[]
    );
    const pagesInRoot = this._props.pages;
    const pageRefs = [...pagesInChapters, ...pagesInRoot].map(
      page => page.pageContent
    );
    return pageRefs;
  }
}
