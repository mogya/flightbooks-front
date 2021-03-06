import PageContentRepository from "@/repositories/PageContentRepository";
import BookRepository from "@/repositories/BookRepository";
import BookEntity from "@/entities/Book";
import PageContentEntity from "@/entities/PageContent";

export interface PresenterParams {
  bookRepository: BookRepository;
  pageContentRepository: PageContentRepository;
}

export interface IPresenter {
  book: BookEntity;
  content: string; // TODO: こいつを消す
  pageContent: PageContentEntity;
}

export default ({
  bookRepository,
  pageContentRepository
}: PresenterParams): IPresenter => {
  const item = bookRepository.getItem();
  const pageContent = pageContentRepository.getItem();
  return {
    book: item ? new BookEntity(item) : null,
    content: pageContent ? pageContent.props.content : "",
    pageContent
  };
};
