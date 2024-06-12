export interface BaseResponse<T> {
    isSuccess: boolean;
    result: T;
    message: string;
}