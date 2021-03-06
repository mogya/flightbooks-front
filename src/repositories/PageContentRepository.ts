import firebase from "firebase";
import store from "@/store";
import { AddItem, StoreItem } from "@/store/modules/pageContent/types";
import PageContentEntity, { IPageContent } from "@/entities/PageContent";

const collection = "pages";

export default class ProjectTreeRepository {
  constructor() {}

  async create(
    item: PageContentEntity
  ): Promise<firebase.firestore.DocumentReference> {
    const props = item.props;
    const ref = firebase
      .firestore()
      .collection(collection)
      .doc(props.identifier);

    await ref.set({
      ...props
    });
    return ref;
  }

  async fetchItemByRef(
    ref: firebase.firestore.DocumentReference
  ): Promise<IPageContent> {
    const snapshot = await ref.get();
    const item = snapshot.data();

    return item as IPageContent;
  }

  async save(item: PageContentEntity): Promise<void> {
    const itemProps = item.props;
    const ref = firebase
      .firestore()
      .collection(collection)
      .doc(itemProps.identifier);
    await ref.update({
      ...itemProps
    });
  }

  addItem(item: IPageContent) {
    store.commit(new AddItem(item));
  }

  storeItem(item: IPageContent) {
    store.commit(new StoreItem(item));
  }

  getItem(): PageContentEntity {
    const pageContent = store.state.pageContent.item;
    return pageContent ? new PageContentEntity(pageContent) : null;
  }
}
