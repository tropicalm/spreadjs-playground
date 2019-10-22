const { compose, equals, filter, flatten, isEmpty, mapObjIndexed, not, path, prop, values } = require('ramda');

function getSpecCells(template) {
    const isSpec = compose(equals('spec'), path(['style', 'parentName']));
    const getValues = mapObjIndexed(prop('value'));
    const filterCells = compose(getValues, filter(isSpec));

    const notEmpty = compose(not, isEmpty);
    const filterColumns = compose(filter(notEmpty), mapObjIndexed(filterCells));

    const getDatatables = path(['data', 'dataTable']);
    const filterSheets = compose(filter(notEmpty), mapObjIndexed(compose(filterColumns, getDatatables)));
    
    return filterSheets(template.sheets);
}

function parseSpecCell(spec, data) {
    const re = /^\[(.*)\](.*)/
    const steps = re.exec(spec) || ["",""]
    const loops = steps[1].split(",").map(el => el.split(" as "));
    
    let res;
    if(loops[0][0]) {
        const range = parseInt(loops[0][0]) ? Array.from(Array(parseInt(loops[0][0])).keys()) : data[loops[0][0]];
        res = range.map(el => {
            if(loops[1] && loops[1][0]) {
                return data[loops[1][0]].map(el2 => {
                    return steps[2].replace(/\{(.*)\}/, (str, str2) => {
                        const strPath = str2.split(".");
                        if(strPath[0] === loops[0][1]) {
                            return path(strPath.slice(1), el)
                        } else if(strPath[0] === loops[1][1]) {
                            return path(strPath.slice(1), el2)
                        } else {
                            return path(strPath, data)
                        }
                    })
                });
            }

            else {

                return steps[2].replace(/\{(.*)\}/, (str, str2) => {
                    const strPath = str2.split(".");
                    return strPath[0] === loops[0][1] ? path(strPath.slice(1), el) : path(strPath, data)
                })
            }
        })
    }
    return res
}

function parseSpec(spec, data, fn) {
    return flatten(values(mapObjIndexed((sheet, sheetName) => {
        return flatten(values(mapObjIndexed((row, rowNr) => {
            return values(mapObjIndexed((cell, colNr) => {
                const val = parseSpecCell(cell, data)
                return {val, sheetName, rowNr, colNr}
            }, row))
        }, sheet)))
    }, spec)))
}


module.exports = {getSpecCells, parseSpecCell, parseSpec};