import {Line} from "../types/types";

export function statusWriter(status: Line.Status) {
    if (status.severityCode === 10 || status.severityCode === 18){
        return `*${status.name}* line currently has _${status.severity}_! 🎉`
    } else {
        return `*${status.name}* line is facing _${status.severity}_ 🙄 \n\nThis is what I could find: \n${status.disruption} - ${status.description}`
    }
}