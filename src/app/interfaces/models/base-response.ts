export interface BaseResponse<T> {
    isSucceed: boolean;
    result?: T;
    results?: T[];
    message: string;
}