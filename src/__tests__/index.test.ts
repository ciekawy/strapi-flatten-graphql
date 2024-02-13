import {
  flattenEntity,
  flattenEntityResponse,
  flattenEntityResponseCollection,
  StrapiEntity,
  StrapiEntityResponse,
  StrapiEntityResponseCollection
} from '../index';

describe('Strapi Entity Flattening with nested attibutes', () => {
  const mockEntity: StrapiEntity =  {
    __typename: "ArticleEntity",
    id: "1",
    attributes: {
        __typename: "Article",
        name: 'Test Entity',
        description: 'A simple test entity',
        author: {
          __typename: "AuthorEntityResponse",
          data: {
              __typename: "AuthorEntity",
              id: "1",
              attributes: {
                  __typename: "Author",
                  name: "Lorenzo Eroticon",
                  photo: {
                      __typename: "UploadFileEntityResponse",
                      data: {
                          __typename: "UploadFileEntity",
                          id: "1",
                          attributes: {
                              __typename: "UploadFile",
                              url: "/uploads/21_07fabdb9c9.jpg"
                          }
                      }
                  }
              }
          }
        },
        articles: {
            __typename: "ArticleRelationResponseCollection",
            data: [
                {
                    __typename: "ArticleEntity",
                    id: '1',
                    attributes: {
                        __typename: "Article",
                        name: 'Test Article',
                    }
                }
            ]
        },
    }
};

  const mockEntityResponse: StrapiEntityResponse = {
    data: mockEntity
  };

  const mockEntityResponseCollection: StrapiEntityResponseCollection = {
    data: [mockEntity, { ...mockEntity, id: '2' }]
  };

  test('flattenEntity should correctly flatten a Strapi entity', () => {
    expect(flattenEntity(mockEntity)).toEqual({
      __typename: "Article",
      id: '1',
      name: 'Test Entity',
      description: 'A simple test entity',
      articles: [
        { __typename: "Article", id: '1', name: 'Test Article' }
      ],
      author: {
        __typename: "Author",
        name: "Lorenzo Eroticon",
        id: "1",
        photo: {
          __typename: "UploadFile",
          id: "1",
          url: "/uploads/21_07fabdb9c9.jpg",
        }
      }
    });
  });

  test('flattenEntityResponse should correctly flatten a Strapi entity response', () => {
    expect(flattenEntityResponse(mockEntityResponse)).toEqual({
      __typename: "Article",
      id: '1',
      name: 'Test Entity',
      description: 'A simple test entity',
      articles: [
        { __typename: "Article", id: '1', name: 'Test Article' }
      ],
      author: {
        __typename: "Author",
        name: "Lorenzo Eroticon",
        id: "1",
        photo: {
          __typename: "UploadFile",
          id: "1",
          url: "/uploads/21_07fabdb9c9.jpg",
        }
      }
    });
  });

  test('flattenEntityResponse should throw an error for null response', () => {
    expect(() => flattenEntityResponse(null)).toThrow('wrong entity response');
  });

  test('flattenEntityResponse should throw an error for undefined response', () => {
    expect(() => flattenEntityResponse(undefined)).toThrow('wrong entity response');
  });

  test('flattenEntityResponse should throw an error for response with no data', () => {
    const response = {};
    expect(() => flattenEntityResponse(response as StrapiEntityResponse)).toThrow('wrong entity response');
  });

  test('flattenEntityResponseCollection should correctly flatten a collection of Strapi entity responses', () => {
    expect(flattenEntityResponseCollection(mockEntityResponseCollection)).toEqual([
      {
        __typename: "Article",
        id: '1',
        name: 'Test Entity',
        description: 'A simple test entity',
        articles: [
          { __typename: "Article", id: '1', name: 'Test Article' }
        ],
        author: {
          __typename: "Author",
          name: "Lorenzo Eroticon",
          id: "1",
          photo: {
            __typename: "UploadFile",
            id: "1",
            url: "/uploads/21_07fabdb9c9.jpg",
          }
        }
      },
      {
        __typename: "Article",
        id: '2',
        name: 'Test Entity',
        description: 'A simple test entity',
        articles: [
          { __typename: "Article", id: '1', name: 'Test Article' }
        ],
        author: {
          __typename: "Author",
          name: "Lorenzo Eroticon",
          id: "1",
          photo: {
            __typename: "UploadFile",
            id: "1",
            url: "/uploads/21_07fabdb9c9.jpg",
          }
        }
      }
    ]);
  });

  test('flattenEntityResponseCollection should return an empty array for empty data', () => {
    const responseCollection = { data: [] };
    expect(flattenEntityResponseCollection(responseCollection as StrapiEntityResponseCollection)).toEqual([]);
  });

  test('flattenEntityResponseCollection should throw an error for response with no data', () => {
    const responseCollection = {};
    expect(() => flattenEntityResponseCollection(responseCollection as StrapiEntityResponseCollection)).toThrow('wrong entity response collection');
  });
});
