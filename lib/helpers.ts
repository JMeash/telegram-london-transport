import {Line} from "../types/types";

export function statusWriter(status: Line.Status) : string{
    if (status.severityCode === 10 || status.severityCode === 18){
        return `*${status.name}* line currently has _${status.severity}_! 🎉`
    } else {
        return `*${status.name}* line is facing _${status.severity}_ 🙄 \n\nThis is what I could find: \n${status.disruption} - ${status.description}`
    }
}

export function commuteStatusWriter(statuses: Line.Status[]) : string{
    let reply = '';
    for (const status of statuses){
        if (status.severityCode === 10 || status.severityCode === 18){
            reply = reply.concat('\n', `*${status.name}* line currently has _${status.severity}_! 🎉`);
        } else {
            reply = reply.concat('\n', `*${status.name}* line is facing _${status.severity}_ 🙄 \n\nThis is what I could find: \n${status.disruption} - ${status.description}\n`);
        }
    }
    return reply;
}

export function isCommuteCompromised(statuses: Line.Status[]) : boolean{
    return statuses.some(status => (status.severityCode !== 10 && status.severityCode !== 18));
}