import {Line} from "../types/types";
import config from '../config';
import {tube_names} from '../types/lineNames.json';

const axios = require('axios').default;

function findMatchingLine(line:string): Line.Names[] {
    return tube_names.filter(item => item.accepted_names.indexOf(line.toLocaleLowerCase()) !== -1);
}

export async function requestLineStatus(line: string): Promise<Line.Status> {
    const matchedLine = findMatchingLine(line);
    if (matchedLine.length) {
        const result = await axios.get(`${config.tfl.url}Line/${matchedLine[0].id}/Status`, {
            params: {
                app_id: config.tfl.token,
            }
        });

        if (result && result.status === 200){
            if(result.data[0].lineStatuses[0].disruption){
                return {
                    name: matchedLine[0].name,
                    severity: result.data[0].lineStatuses[0].statusSeverityDescription,
                    severityCode: result.data[0].lineStatuses[0].statusSeverity,
                    disruption: result.data[0].lineStatuses[0].disruption.category,
                    description: result.data[0].lineStatuses[0].disruption.description,
                }
            }
            return {
                name: matchedLine[0].name,
                severity: result.data[0].lineStatuses[0].statusSeverityDescription,
                severityCode: result.data[0].lineStatuses[0].statusSeverity,
            }
        } else {
            throw new Error('Tfl is experiencing problems at the moment, try another time')
        }
    }

    throw new Error(`Could not find a Line with the name ${line}`)
}