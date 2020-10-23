import React, { useContext } from 'react';
import {
  Text,
} from 'react-native';
import { t } from 'ttag';

import SetupStepWrapper from '@components/campaignguide/SetupStepWrapper';
import SingleCardWrapper from '@components/card/SingleCardWrapper';
import CampaignGuideContext from '../../CampaignGuideContext';
import Card from '@data/Card';
import { CampaignLogEffect, FreeformCampaignLogEffect, BulletType } from '@data/scenario/types';
import CampaignGuideTextComponent from '../../CampaignGuideTextComponent';

interface Props {
  effect: CampaignLogEffect | FreeformCampaignLogEffect;
  input?: string[];
  numberInput?: number[];
  bulletType?: BulletType;
}

function renderCard(card: Card, section: string) {
  return (
    <CampaignGuideTextComponent
      text={t`In your Campaign Log, under "${section}", record ${card.name}. `}
    />
  );
}

function CampaignLogEffectsContent({ effect, input }: {
  effect: CampaignLogEffect | FreeformCampaignLogEffect;
  input?: string[];
}) {
  const { campaignGuide } = useContext(CampaignGuideContext);
  if (effect.type === 'freeform_campaign_log') {
    const text = input && input.length ?
      input[0] : 'Missing text entry';
    return (
      <CampaignGuideTextComponent
        text={t`In your Campaign Log, record that <i>${text}</i>`}
      />
    );
  }
  if (effect.id) {
    const logEntry = campaignGuide.logEntry(effect.section, effect.id);
    if (!logEntry) {
      return (
        <Text>
          Unknown campaign log { effect.section }.
        </Text>
      );
    }
    switch (logEntry.type) {
      case 'text': {
        if (effect.cross_out) {
          const text = (effect.section === 'campaign_notes') ?
            t`In your Campaign Log, cross out <i>${logEntry.text}</i>` :
            t`In your Campaign Log, under "${logEntry.section}", cross out <i>${logEntry.text}</i>`;
          return (
            <CampaignGuideTextComponent text={text} />
          );
        }
        const text = (effect.section === 'campaign_notes') ?
          t`In your Campaign Log, record that <i>${logEntry.text}</i>` :
          t`In your Campaign Log, under "${logEntry.section}", record <i>${logEntry.text}</i>.`;
        return (
          <CampaignGuideTextComponent text={text} />
        );
      }
      case 'card': {
        return (
          <SingleCardWrapper
            code={logEntry.code}
            type="encounter"
          >
            { (card: Card) => renderCard(card, logEntry.section) }
          </SingleCardWrapper>
        );
      }
      case 'section_count': {
        // Not possible as a record
        return null;
      }
      case 'supplies': {
        // Not possible as a record?
        return null;
      }
    }
  }

  // No id, just a section / count
  const logSection = campaignGuide.logSection(effect.section);
  if (!logSection) {
    return (
      <Text>
        Unknown campaign log section { effect.section }.
      </Text>
    );
  }
  return <Text>Campaign Log Section: { logSection.section }</Text>;
}

export default function CampaignLogEffectComponent({
  effect,
  input,
  bulletType,
}: Props) {
  if (effect.section === 'hidden') {
    return null;
  }
  return (
    <SetupStepWrapper bulletType={bulletType}>
      <CampaignLogEffectsContent effect={effect} input={input} />
    </SetupStepWrapper>
  );
}
