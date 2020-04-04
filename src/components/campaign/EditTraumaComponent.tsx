import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import { DEFAULT_TRAUMA_DATA } from './trauma';
import CardSectionHeader from 'components/core/CardSectionHeader';
import NavButton from 'components/core/NavButton';
import LabeledTextBox from 'components/core/LabeledTextBox';
import { t } from 'ttag';
import { InvestigatorData, Trauma } from 'actions/types';
import Card from 'data/Card';

interface Props {
  investigator: Card;
  investigatorData?: InvestigatorData;
  showTraumaDialog: (investigator: Card, traumaData: Trauma) => void;
  fontScale: number;
  sectionHeader?: boolean;
}

export default class EditTraumaComponent extends React.Component<Props> {
  traumaData() {
    const {
      investigatorData,
      investigator,
    } = this.props;
    return (
      investigatorData && investigatorData[investigator.code]
    ) || DEFAULT_TRAUMA_DATA;
  }

  _editTraumaPressed = () => {
    const {
      investigator,
      showTraumaDialog,
    } = this.props;
    showTraumaDialog(investigator, this.traumaData());
  };

  render() {
    const {
      investigator,
      sectionHeader,
      fontScale,
    } = this.props;
    const traumaString = investigator.traumaString(this.traumaData());
    if (sectionHeader) {
      return (
        <>
          <CardSectionHeader
            investigator={investigator}
            fontScale={fontScale}
            section={{ superTitle: t`Trauma` }}
          />
          <NavButton 
            text={traumaString}
            fontScale={fontScale}
            onPress={this._editTraumaPressed}
          />
        </>
      )
    }
    return (
      <View style={styles.traumaBlock}>
        <LabeledTextBox
          column
          label={t`Trauma`}
          onPress={this._editTraumaPressed}
          value={traumaString}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  traumaBlock: {
    marginBottom: 4,
  },
});