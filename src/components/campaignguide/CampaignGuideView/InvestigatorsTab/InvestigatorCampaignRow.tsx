import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { map } from 'lodash';
import { t } from 'ttag';

import { showCard, showDeckModal } from 'components/nav/helper';
import CardSearchResult from 'components/cardlist/CardSearchResult';
import { Campaign, Deck, TraumaAndCardData } from 'actions/types';
import CardSectionHeader from 'components/core/CardSectionHeader';
import InvestigatorRow from 'components/core/InvestigatorRow';
import Card from 'data/Card';
import SingleCardWrapper from '../../SingleCardWrapper';
import typography from 'styles/typography';

interface Props {
  componentId: string;
  campaign: Campaign;
  investigator: Card;
  traumaAndCardData: TraumaAndCardData;
  fontScale: number;
  chooseDeckForInvestigator?: (investigator: Card) => void;
  deck?: Deck;
}

export default class InvestigatorCampaignRow extends React.Component<Props> {
  _onCardPress = (card: Card) => {
    const { componentId } = this.props;
    showCard(componentId, card.code, card, true);
  };

  _renderStoryAsset = (card: Card) => {
    const {
      fontScale,
    } = this.props;
    return (
      <CardSearchResult
        key={card.code}
        onPress={this._onCardPress}
        card={card}
        fontScale={fontScale}
      />
    );
  };

  renderTrauma() {
    const { traumaAndCardData, investigator, fontScale } =  this.props;
    return (
      <View style={styles.trauma}>
        <Text style={typography.text}>
          { investigator.traumaString(traumaAndCardData) }
        </Text>
      </View>
    );
  }

  renderStoryAssets() {
    const { traumaAndCardData, investigator, fontScale } =  this.props;
    if (!traumaAndCardData.storyAssets || !traumaAndCardData.storyAssets.length) {
      return null;
    }
    return (
      <>
        <CardSectionHeader
          investigator={investigator}
          fontScale={fontScale}
          section={{ superTitle: t`Campaign cards`}}
        />
        { map(traumaAndCardData.storyAssets, asset => (
          <SingleCardWrapper
            key={asset}
            code={asset}
            render={this._renderStoryAsset}
          />
        )) }
      </>
    );
  }

  renderDetail() {
    const {
      investigator,
      fontScale,
    } = this.props;
    return (
      <>
        <CardSectionHeader
          investigator={investigator}
          fontScale={fontScale}
          section={{ superTitle: t`Trauma`}}
        />
        { this.renderTrauma() }
        { this.renderStoryAssets() }
      </>
    );
  }

  _viewDeck = () => {
    const {
      campaign,
      componentId,
      investigator,
      deck,
    } = this.props;
    if (deck) {
      showDeckModal(
        componentId,
        deck,
        investigator,
        campaign.id,
        true
      );
    }
  };

  _selectDeck = () => {
    const {
      investigator,
      chooseDeckForInvestigator,
    } = this.props;
    chooseDeckForInvestigator && chooseDeckForInvestigator(investigator);
  };

  renderButton() {
    const {
      deck,
      chooseDeckForInvestigator,
    } = this.props;
    if (deck) {
      return (
        <Button
          title={t`View Deck`}
          onPress={this._viewDeck}
        />
      );
    }
    if (!chooseDeckForInvestigator) {
      return <View />;
    }
    return (
      <Button
        title={t`Select Deck`}
        onPress={this._selectDeck}
      />
    );
  };

  render() {
    const {
      investigator,
      traumaAndCardData,
    } = this.props;
    return (
      <InvestigatorRow
        investigator={investigator}
        button={this.renderButton()}
        eliminated={investigator.eliminated(traumaAndCardData)}
        detail={this.renderDetail()}
      />
    );
  }
}

const styles = StyleSheet.create({
  trauma: {
    padding: 8,
    paddingLeft: 16,
  },
  buttonPlaceholder: {
    minHeight: 24,
  },
});
