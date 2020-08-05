export namespace Line {
    export interface Status {
        severity: string;
        severityCode: string;
        disruption?: string;
        description?: string;
    }

    export interface Names {
        id: string;
        name: string;
        accepted_names: string;
    }
}