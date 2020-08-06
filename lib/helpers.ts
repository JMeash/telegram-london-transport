import {Line} from "../types/types";

export function statusWriter(status: Line.Status) {
    if (status.severityCode === 10 || status.severityCode === 18){
        return `${status.name} line currently has ${status.severity} 🎉`
    } else {
        return `${status.name} line is facing ${status.severity} 🙄 \n This is what I could find: ${status.disruption} - ${status.description}`
    }
}