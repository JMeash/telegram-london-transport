const {tube_names} = require('../types/lineNames');

function findMatchingLine(line:string) {
    return tube_names.filter(item => item.accepted_names.indexOf(line.toLocaleLowerCase()) !== -1);
}

export function requestLineStatus(line: string) {
    const matchedLine = findMatchingLine(line);
    if(matchedLine?.length){
        //console.log((matchedLine));

    } else{
        return new Error('Could not find a Line with that name')
    }

    //TODO return LineStatus
    return true;
}