import React, { ComponentType } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import {
  compose,
  pure,
  setDisplayName,
  withState,
} from 'recompose';
import { theme } from '@ncigdc/theme/index';
import { Row, Column } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import ExploreLink, { defaultExploreQuery } from '@ncigdc/components/Links/ExploreLink';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import countComponents from '@ncigdc/modern_components/Counts';

import { TSetTypes } from '@ncigdc/dux/sets';
import { IGroupFilter } from '@ncigdc/utils/filters/types';
import { TSelectedSets } from './availableAnalysis';
import DemoButton from './DemoButton';

interface ICaseDemoSet {
  case: Record<string, string>;
}
interface IDemoData {
  message: string;
  sets: {
    case: ICaseDemoSet;
  };
  filters: IGroupFilter;
  type: string;
}

interface IProps {
  onCancel: () => void;
  onRun: (sets: TSelectedSets, config?: any) => void;
  type: string;
  label: string;
  Icon: () => React.Component;
  description: string;
  demoData: IDemoData; // fix
  setInstructions: string;
  // setDisabledMessage: (
  //   { sets, type }: { sets: Record<TSetTypes, string>; type: string },
  // ) => boolean | undefined;
  setTypes: string[];
  validateSets: (sets: TSelectedSets) => boolean;
  ResultComponent: () => React.Component;
  sets: Record<TSetTypes, string>;
  // selectedSets: { [K in TSetTypes]: string };
  selectedSet: Record<TSetTypes, string>;
  setSelectedSet: (arg: any) => void; // fix
}

// type TConfigVariables = string[];
// type TConfigName = string;
// type TConfig = Record<TConfigName, TConfigVariables>;

const styles = {
  rowStyle: {
    marginTop: 'auto',
    padding: '1rem 2.5rem 1rem',
    borderBottom: `1px solid ${theme.greyScale5}`,
    maxWidth: 1100,
  },
};

const ClinicalAnalysisLaunch: ComponentType<IProps> = ({
  demoData,
  description,
  Icon,
  label,
  onCancel,
  onRun,
  selectedSet,
  sets,
  setSelectedSet,
  setTypes,
  type,
  validateSets,
}: IProps) => {
  const cohortHeadings = [
    {
      key: 'select',
      title: 'Select',
    },
    {
      key: 'name',
      title: 'Case Set Name',
    },
    {
      key: 'count',
      title: '#Cases',
      style: { textAlign: 'right' },
    },
  ];

  const setArray: any[] = [];
  const setData: any[] = Object.entries(sets)
    .filter(([setType]) => setTypes.includes(setType))
    .map(([setType, mappedSets]) => {
      const CountComponent = countComponents[setType];

      return Object.entries(mappedSets).map(([setId, l]: [string, any]) => {
        const id = `set-table-${setType}-${setId}-select`;
        const checked = Boolean((selectedSet[setType] || {})[setId]);

        return {
          select: (
            <input
              aria-label={`Select ${name} set`}
              checked={checked}
              id={id}
              onChange={e => {
                const targetId = e.target.value;
                const setIdPath = [setType, targetId];
                setSelectedSet(_.set({}, setIdPath, mappedSets[targetId]));
              }}
              style={{
                marginLeft: 3,
              }}
              type="radio"
              value={setId}
              />
          ),
          name: <label htmlFor={id}>{_.truncate(l, { length: 70 })}</label>,
          count: (
            <CountComponent
              filters={{
                op: '=',
                content: {
                  field: `${setType}s.${setType}_id`,
                  value: `set_id:${setId}`,
                },
              }}
              />
          ),
        };
      });
    })
    .reduce((acc, rows) => acc.concat(rows), setArray);

  return (
    <Column
      style={{
        width: '70%',
        paddingLeft: '1rem',
        paddingTop: '2rem',
      }}
      >
      <Row
        spacing="10px"
        style={{
          ...styles.rowStyle,
          justifyContent: 'space-between',
        }}
        >
        <Icon />
        <Column>
          <Row>
            <h1 style={{ fontSize: '2rem' }}>{label}</h1>
          </Row>
          <Row>{description}</Row>
        </Column>
        <Column style={{ paddingTop: 5 }}>
          <Row spacing="5px">
            <Button onClick={onCancel}>Back</Button>
            <DemoButton demoData={demoData} type={type} />
          </Row>
        </Column>
      </Row>
      <Row style={styles.rowStyle}>
        <Column style={{ flex: 1 }}>
          <h2
            style={{
              color: '#c7254e',
              fontSize: '1.8rem',
            }}
            >
            Select a case set
          </h2>

          <div style={{ marginBottom: 15 }}>
            You can create and save case sets from the
            {' '}
            <ExploreLink query={defaultExploreQuery}>Exploration Page</ExploreLink>
            .
          </div>

          {setData && setData.length > 0 && (
            <EntityPageHorizontalTable
              data={setData}
              headings={cohortHeadings}
              />
          )}

          {setData && setData.length === 0 && (
            <Row>
              <strong>You have not saved any sets yet.</strong>
            </Row>
          )}
        </Column>
      </Row>
      <Row
        style={{
          ...styles.rowStyle,
          border: 'none',
          justifyContent: 'flex-end',
        }}
        >
        <Button
          disabled={!validateSets(selectedSet)}
          onClick={() => onRun(selectedSet)}
          >
          Run
        </Button>
      </Row>
    </Column>
  );
};

export default compose(
  setDisplayName('EnhancedClinicalAnalysisLaunch'),
  connect(({ sets }: any) => ({ sets })),
  withState('selectedSet', 'setSelectedSet', {}),
  pure,
)(ClinicalAnalysisLaunch);
