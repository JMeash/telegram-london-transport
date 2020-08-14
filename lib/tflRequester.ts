import {Line} from "../types/types";
import config from '../config';
import {tube_names} from '../types/lineNames.json';

const axios = require('axios').default;

export function findMatchingLine(line: string): Line.Names {
    const matchedLines = tube_names.filter(item => item.accepted_names.indexOf(line.toLocaleLowerCase()) !== -1);
    if (matchedLines.length && matchedLines[0].id) {
        return matchedLines[0]
    }
    throw new Error(`Could not find a Line with the name ${line}`)
}

export async function requestLineStatus(line: string): Promise<Line.Status> {
    const matchedLine = findMatchingLine(line);
    const result = await axios.get(`${config.tfl.url}Line/${matchedLine.id}/Status`, {
        params: {
            app_id: config.tfl.token,
        }
    });

    if (result && result.status === 200){
        if(result.data[0].lineStatuses[0].disruption){
            return {
                name: matchedLine.name,
                severity: result.data[0].lineStatuses[0].statusSeverityDescription,
                severityCode: result.data[0].lineStatuses[0].statusSeverity,
                disruption: result.data[0].lineStatuses[0].disruption.category,
                description: result.data[0].lineStatuses[0].disruption.description,
            }
        }
        return {
            name: matchedLine.name,
            severity: result.data[0].lineStatuses[0].statusSeverityDescription,
            severityCode: result.data[0].lineStatuses[0].statusSeverity,
        }
    } else {
        throw new Error('Tfl API is experiencing problems at the moment, try another time')
    }
}