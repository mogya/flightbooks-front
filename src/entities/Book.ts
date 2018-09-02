import firebase from "firebase";

export interface IBook {
  identifier?: string;
  title: string;
  userId?: string;
  genre?: number;
  createdAt?: firebase.firestore.Timestamp;
  updatedAt?: firebase.firestore.Timestamp;
  thumbanilUrl?: string;
  content: string
}

export default class BookEntity {
  props: IBook

  constructor(params: IBook) {
    const genre = params.genre || 0 
    this.props = {
      ...params,
      genre
    }
  }
}
