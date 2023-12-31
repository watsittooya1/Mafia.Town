import { Heading, StackDivider, VStack } from '@chakra-ui/react';
import React from 'react';
import ConversationAreasList from './ConversationAreasList';
import PlayersList from './PlayersList';
import useCoveyAppState from '../../hooks/useCoveyAppState';
import GameLobby from './GameLobby';
import useCurrentRecreationArea from '../../hooks/useCurrentRecreationArea';

export default function SocialSidebar(): JSX.Element {
 
  // get all the recreation areas of this town
  // const recAreas = useRecreationAreas();
  const coveyApp = useCoveyAppState();
  // get my player's id
  const { myPlayerID } = coveyApp;
  const currentRecArea = useCurrentRecreationArea();


    return (
      <VStack align="left"
        spacing={2}
        border='2px'
        padding={2}
        marginLeft={2}
        borderColor='gray.500'
        height='100%'
        divider={<StackDivider borderColor='gray.200' />}
        borderRadius='4px'
        >
        <Heading fontSize='xl' as='h1'>Players In This Town</Heading>
        <PlayersList /> 
        
        <ConversationAreasList />
        
        {currentRecArea ? 
          <GameLobby key={currentRecArea.label} area={currentRecArea} playerID={myPlayerID} />
          :
          <></>
        }
        
      </VStack>
    );
  }