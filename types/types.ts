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
        accepted_names: string;
    }
}