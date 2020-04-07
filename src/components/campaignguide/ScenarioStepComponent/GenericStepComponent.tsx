import React from 'react';
import { Text } from 'react-native';

import BulletsComponent from './BulletsComponent';
import SetupStepWrapper from '../SetupStepWrapper';
import { GenericStep } from 'data/scenario/types';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import typography from 'styles/typography';
import { COLORS } from 'styles/colors';

interface Props {
  step: GenericStep;
}

export default class GenericStepComponent extends React.Component<Props> {
  render() {
    const { step } = this.props;
    if (!step.title && !step.text && !step.bullets) {
      return null;
    }
    return (
      <>
        <SetupStepWrapper bulletType={step.title ? 'none' : step.bullet_type}>
          { !!step.text && (
            <CampaignGuideTextComponent text={step.text} />
          ) }
        </SetupStepWrapper>
        <BulletsComponent bullets={step.bullets} />
      </>
    );
  }
}
