import React, { createContext, useCallback, useContext } from 'react';
import _ from 'lodash';
import { Node } from './node';
import { Nodes } from './nodes';

export type DashStage = { type: string; id: string; }[][];
export type Item = { type: string; [id: string]: any; };

export const DashContext = createContext<{
  stage: any;
  setStage: (stage: any) => any;
  select: (path, item: Item) => any;
  unselect: (path) => any;
}>({
  stage: null,
  setStage: () => {},
  select: (path, item) => {},
  unselect: (path) => {},
});

export function Dash({
  stage, setStage,
}: {
  stage: DashStage;
  setStage: (stage: DashStage) => any;
}) {
  const select = useCallback((path, item: Item) => {
    const newDash: any = _.cloneDeep(stage);
    _.set(newDash, [...path, 'selected'], item);
    newDash[path[0] + 1] = newDash[path[0] + 1] || [];
    if (newDash[path[0] + 1].find(eItem => _.isEqual(item, eItem))) return;
    newDash[path[0] + 1].push(item);
    setStage(newDash);
  }, [stage]);

  const unselect = useCallback((path) => {
    const newDash = _.cloneDeep(stage);
    const value = _.get(newDash, path);
    const container = _.get(newDash, path.slice(0, path.length - 1));
    if (_.isArray(container)) {
      _.remove(container, (v) => _.isEqual(value, v));
    } else {
      _.unset(newDash, path);
    }
    for (let i = path.length - 1; i >= 0; i--) {
      const _path = path.slice(0, i);
      _.isEmpty(_.get(newDash, _path)) && _.unset(newDash, _path);
    }
    setStage(newDash);
  }, [stage]);

  return <div className="linecontainer" style={{ width: '100%', height: '100%', position: 'absolute', left: 0, top: 0, overflowX: 'scroll' }}>
    <table style={{ maxWidth: '100%', height: '100%' }}><tr>
      <DashContext.Provider value={{ stage, setStage, select, unselect }}>
        {stage.map((item, path) => {
          return <td key={path} style={{ borderLeft: '1px solid lightgrey' }}>
            <div style={{ height: '100%', overflowY: 'scroll' }} onScroll={() => {
              console.log(123);
            }}>
              <Nest path={[path]} item={item}/>
            </div>
          </td>;
        })}
      </DashContext.Provider>
    </tr></table>
  </div>;
};

function Nest({
  item,
  path,
}: {
  item: any;
  path: any[];
}) {
  return <>
    <Auto path={path} item={item}/>
  </>;
};

function Auto({
  item,
  path,
}: {
  item: Item | any[];
  path: any[];
}) {
  if (_.isArray(item)) {
    return <Array path={path} item={item}/>;
  }
  if (_.isObject(item)) {
    if (item?.type === 'node') {
      return <Node path={path} item={item}/>;
    } else if (item?.type === 'nodes') {
      return <Nodes path={path} item={item}/>;
    }
    return null;
  }
  return null;
};

function Array({
  item,
  path,
}: {
  item: any;
  path: any[];
}) {
  return <div style={{
    padding: '6px 12px 0px 12px',
    minHeight: 16, minWidth: 16,
  }}>
    {item.map((item, index) => {
      return <Auto key={item.id || index} path={[...path, index]} item={item}/>;
    })}
  </div>;
};
