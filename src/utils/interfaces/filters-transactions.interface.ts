export interface FiltersTransaction {
    categoryIds?: number[] | null;
    walletIds?: number[] | null;
    repeats?: string[] | null;
    types?: string[] | null;
    year?: number | null;
    months?: number[] | null;
}
