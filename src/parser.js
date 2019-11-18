const {
  compose,
  concat,
  contains,
  find,
  flattenDeep,
  isEmpty,
  min,
  max,
  path,
  pipe,
  prop,
  reduce,
  omit,
  values,
} = require('lodash/fp');
const {
  ascend,
  clone,
  filter,
  mapObjIndexed,
  not,
  sortWith,
} = require('ramda');

const filterCells = filter(prop('tag'));
const notEmpty = compose(not, isEmpty);
const getSheetData = path(['data', 'dataTable']);
const mapSheets = fn => mapObjIndexed(pipe(getSheetData, fn));
const filterColumns = pipe(mapObjIndexed(filterCells), filter(notEmpty));
const sortByPos = sortWith([ascend(prop('x')), ascend(prop('y'))]);

const groupCells = mapObjIndexed(sheet =>
  compose(
    sortByPos,
    flattenDeep,
    values,
    mapObjIndexed,
  )(
    (row, rowNr) =>
      compose(values, mapObjIndexed)((cell, colNr) => {
        return {
          x: parseInt(colNr),
          y: parseInt(rowNr),
          v: cell,
        };
      }, row),
    sheet,
  ),
);

const getSpecCells = spec =>
  pipe(
    prop('sheets'),
    mapSheets(filterColumns),
    filter(notEmpty),
    groupCells,
  )(spec);

const groupCellsBySpec = spec =>
  mapObjIndexed(val =>
    reduce((acc, cur) => {
      const tag = cur.v.tag;
      const list = acc[tag] || (acc[tag] = []);
      list.push({
        x: cur.x,
        y: cur.y,
        v: omit(['tag'], cur.v),
      });
      return acc;
    }, {})(val),
  )(spec);

function parseSpecDef(spec) {
  const re = /repeat for ([^\s]+) in ([^\s]+) (.*)/;
  const parsed = spec.split('\n').map(x => {
    const params = x.match(re);
    return params && params.slice(1);
  });

  const below = find(contains('below'), parsed);
  const right = find(contains('to the right'), parsed);

  return Object.assign(
    {},
    below && { below: below.slice(0, -1) },
    right && { right: right.slice(0, -1) },
  );
}

const fnByProp = (fn, name, data) =>
  reduce((acc, elem) => fn([acc, prop(name, elem)]), prop(name, data[0]), data);

function getGroupRange(cells) {
  const minX = fnByProp(min, 'x', cells);
  const minY = fnByProp(min, 'y', cells);
  const maxX = fnByProp(max, 'x', cells);
  const maxY = fnByProp(max, 'y', cells);

  return {
    x: maxX - minX || 1,
    y: maxY - minY || 1,
  };
}

const reBuilder = name => RegExp(`(\\[${name}\\.(\\w*)\\])`, 'g');

function parseSpecCell(spec, cells, data) {
  const loops = parseSpecDef(spec);
  if (!loops.below && !loops.right) {
    return [];
  }

  const range = getGroupRange(cells);
  const firstLoop = (loops.below && data[loops.below[1]]) || [0];
  const secondLoop = (loops.right && data[loops.right[1]]) || [0];

  return firstLoop.reduce(
    (acc, cur, idx) =>
      acc.concat(
        secondLoop.reduce(
          (acc2, cur2, idx2) =>
            acc2.concat(
              cells.map(c => {
                const cell = clone(c);

                cell.x += range.x * idx2;
                cell.y += range.y * idx;
                cell.dx = idx2;
                cell.dy = idx;

                let type;
                if (c.v.value && typeof c.v.value === 'string') {
                  type = 'value';
                }

                if (c.v.formula && typeof c.v.formula === 'string') {
                  type = 'formula';
                }

                if (typeof c.v.value === 'object') {
                  delete cell.v.value;
                }

                if (type) {
                  cell.v[type] = cell.v[type]
                    .replace(
                      loops.below && reBuilder(loops.below[0]),
                      (_, __, key) => prop(key, cur),
                    )
                    .replace(
                      loops.right && reBuilder(loops.right[0]),
                      (_, __, key) => prop(key, cur2),
                    )
                    .replace(
                      reBuilder('(\\w*)'),
                      (expr, _, key, val) => path([key, val], data) || expr,
                    );
                }

                return cell;
              }),
            ),
          [],
        ),
      ),
    [],
  );
}

function parseSpec(template, data) {
  return pipe(
    getSpecCells,
    groupCellsBySpec,
    mapObjIndexed(
      mapObjIndexed((group, defs) => parseSpecCell(defs, group, data)),
    ),
    mapObjIndexed(pipe(values, reduce(concat, []))),
  )(template);
}

module.exports = {
  getSpecCells,
  parseSpecCell,
  parseSpec,
  parseSpecDef,
  groupCellsBySpec,
  getGroupRange,
};
