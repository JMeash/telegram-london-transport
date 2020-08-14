export namespace Line {
    export interface Status {
        name: string,
        severity: string;
        severityCode: number;
        disruption?: string;
        description?: string;
    }

    export interface Names {
        id: string;
        name: string;
        accepted_names: string[];
    }
}
export namespace DynamoDB {
    export interface Commute {
        "telegram_id": string,
        "commute": string[],
        "recurrent_hour"?: string,
    }
}