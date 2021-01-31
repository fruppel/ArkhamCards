import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

import CampaignGuideContext from '@components/campaignguide/CampaignGuideContext';
import { useCampaignGuideReduxData } from '@components/campaignguide/contextHelper';
import useCampaignGuideContext from './useCampaignGuideContext';
import { useInvestigatorCards } from '@components/core/hooks';
import LoadingSpinner from '@components/core/LoadingSpinner';
import { CampaignId } from '@actions/types';
import { useCampaignId } from '@components/campaign/hooks';

export interface CampaignGuideInputProps {
  campaignId: CampaignId;
}

export default function withCampaignGuideContext<Props>(
  WrappedComponent: React.ComponentType<Props & { setServerCampaignId: (serverId: string) => void }>
): React.ComponentType<Props & CampaignGuideInputProps> {
  function CampaignDataComponent(props: Props & CampaignGuideInputProps) {
    const [campaignId, setServerCampaignId] = useCampaignId(props.campaignId);
    const investigators = useInvestigatorCards();
    const campaignData = useCampaignGuideReduxData(campaignId, investigators);
    const context = useCampaignGuideContext(campaignId, campaignData);
    if (!campaignData || !context) {
      return (
        <LoadingSpinner />
      );
    }
    return (
      <CampaignGuideContext.Provider value={context}>
        <WrappedComponent {...props as Props} setServerCampaignId={setServerCampaignId} />
      </CampaignGuideContext.Provider>
    );
  }
  hoistNonReactStatic(CampaignDataComponent, WrappedComponent);
  return CampaignDataComponent;
}
