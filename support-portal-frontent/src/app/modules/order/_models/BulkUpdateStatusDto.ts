export interface BulkUpdateStatusDto {
    NewStatus: string;
    Reason: string;
    OrderIds: number[];
}