export type StrapiEntity = { id?: string|null; attributes?: object|null };
export type StrapiEntityResponse<N extends object =object> = { data?: StrapiEntity|null };
export type StrapiEntityResponseCollection<N extends object =object> = { data?: Array<StrapiEntity>|null };

export type FlattenStrapi<T> =
    T extends StrapiEntityResponse ? Flatten<T> :
        T extends StrapiEntityResponseCollection? FlattenArray<T> :
            T;
export type FlattenEntity<E extends StrapiEntity> =
    FlattenAttributes<NonNullable<E['attributes']>> & { id: string; };
export type Flatten<T extends StrapiEntityResponse> =
    FlattenEntity<NonNullable<T['data']>>;
export type FlattenArray<T extends StrapiEntityResponseCollection> =
    Array<FlattenEntity<NonNullable<NonNullable<T['data']>[number]>>>;

export type FlattenAttributes<T> = {
    [K in keyof T]?: NonNullable<T[K]> extends StrapiEntityResponse
        ? FlattenEntity<NonNullable<NonNullable<T[K]>['data']>>
        : NonNullable<T[K]> extends StrapiEntityResponseCollection
            ? Array<FlattenEntity<NonNullable<NonNullable<T[K]>['data']>[number]>>
            : T[K];
};

export function flattenEntity<T extends StrapiEntity>({id, attributes}: T): FlattenEntity<T> {
    if (id === null || id === undefined || !attributes) {
        throw new Error('wrong entity');
    }

    // Apply flattenDeep to each attribute
    const flattenedAttributes = Object.entries(attributes).reduce((acc, [key, value]) => {
        acc[key] = flattenDeep(value);
        return acc;
    }, {} as any);

    return { ...flattenedAttributes, id };
}

export function flattenEntityResponse<T extends StrapiEntityResponse>
(response: T|null|undefined = {} as T): Flatten<T> {
    if (!response) {
        throw new Error('wrong entity response');
    }
    const {data} = response;
    if (!data) {
        throw new Error('wrong entity response');
    }

    return flattenEntity(data) as Flatten<T>;
}

export function flattenEntityResponseCollection<T extends StrapiEntityResponseCollection>(
    {data}: T
): FlattenArray<T> {
    if (!data) {
        throw new Error('wrong entity response collection');
    }

    return data
        .map<FlattenEntity<StrapiEntity>>(flattenEntity)
        .filter(Boolean) as FlattenArray<T>;
}

function isFlattenable(value: any): value is StrapiEntityResponse | StrapiEntityResponseCollection {
    return typeof value === 'object' && value !== null && '__typename' in value &&
        (value.__typename.endsWith('EntityResponse') || value.__typename.endsWith('ResponseCollection'));
}

export function flattenDeep<T extends StrapiEntityResponse|StrapiEntityResponseCollection>(obj: T): FlattenStrapi<T> {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    if (isFlattenable(obj)) {
        if (Array.isArray(obj.data)) {
            return flattenEntityResponseCollection(obj as StrapiEntityResponseCollection) as FlattenStrapi<T>;
        } else if (obj.data) {
            return flattenEntityResponse(obj as StrapiEntityResponse) as FlattenStrapi<T>;
        } else {
            return undefined as any as FlattenStrapi<T>; // TODO this may happen only in specific cases
        }
    }

    const result: any = Array.isArray(obj) ? [] : {};

    for (const key in obj as object) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];
            if (isFlattenable(value)) {
                if ('data' in value && Array.isArray((value as any).data)) {
                    result[key] = flattenEntityResponseCollection(value);
                }
                if (value.data) {
                    result[key] = flattenEntityResponse(value);
                }
            } else {
                result[key] = flattenDeep(value);
            }
        }
    }

    return result;
}
