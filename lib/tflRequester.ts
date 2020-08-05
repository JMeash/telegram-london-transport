import {Line} from "../types/types";
import config = require('../config');

const axios = require('axios').default;
const {tube_names} = require('../types/lineNames');

function findMatchingLine(line:string): Line.Names[] {
    return tube_names.filter(item => item.accepted_names.indexOf(line.toLocaleLowerCase()) !== -1);
}

export async function requestLineStatus(line: string): Promise<Line.Status | Error> {
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
                    severity: result.data[0].lineStatuses[0].statusSeverityDescription,
                    severityCode: result.data[0].lineStatuses[0].statusSeverity,
                    disruption: result.data[0].lineStatuses[0].disruption.description,
                    description: result.data[0].lineStatuses[0].disruption.category,
                }
            }
            return {
                severity: result.data[0].lineStatuses[0].statusSeverityDescription,
                severityCode: result.data[0].lineStatuses[0].statusSeverity,
            }
        } else {
            return new Error('Tfl is experiencing problems at the moment, try another time')
        }
    }

    return new Error('Could not find a Line with that name')
}