import { Button, Container, Heading, HStack, StackDivider, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import MafiaGame, { Phase } from '../../classes/MafiaGame';
import RecreationArea, { RecreationAreaListener } from '../../classes/RecreationArea';
import usePlayersInTown from '../../hooks/usePlayersInTown';
import StartGameButton from '../SocialSidebar/StartGameButton';
import {
  GameUIAlivePlayerList,
  GameUIDeadPlayerList,
  GameUIHeader,
  GameUILobbyPlayersList,
  GameUILobbyRoles,
  GameUILobbyRules,
  GameUIRoleDescription,
  GameUIRoleList,
  GameUITimer,
  GameUIVideoOverlay,
} from './GameUIComponents';
import NextPhaseButton from './NextPhaseButton';

type GameUIProps = {
  myID: string;
  recArea: RecreationArea | undefined;
};

// this UI container just needs a hook for whether game has begun, time of day
export default function GameUI({ myID, recArea }: GameUIProps): JSX.Element {
  // for those with an undefined area state, this will be undefined
  const [occupants, setOccupants] = useState(recArea?.occupants);

  const [gameInstance, setGameInstance] = useState<MafiaGame | undefined>(recArea?.mafiaGame);
  const [gameCanStart, setGameCanStart] = useState<boolean>(gameInstance?.canStart() || false);
  const players = Array.from(usePlayersInTown());
  const [isPlayerHost, setIsPlayerHost] = useState<boolean>(false);

  const isPlayerInArea = (_occupants: string[] | undefined): boolean => {
    if (_occupants === undefined) {
      return false;
    }
    const found = _occupants.includes(myID);
    return found;
  };

  useEffect(() => {
    const updateListener: RecreationAreaListener = {
      onMafiaGameCreated: (game: MafiaGame) => {
        setGameInstance(game);
        setIsPlayerHost(game.host.id === myID);
      },
      onMafiaGameUpdated: (game: MafiaGame) => {
        setGameInstance(game);
        setGameCanStart(game.canStart());
      },
    };
    recArea?.addRecListener(updateListener);
    return () => {
      recArea?.removeListener(updateListener);
    };
  }, [gameInstance, setGameInstance, recArea]);

  if (recArea && gameInstance) {
    const inLobby = gameInstance._phase === Phase.lobby;

    const playersInRecArea = recArea.occupants.map(
      id => players.find(player => player.id === id)?.userName,
    );

    if (inLobby) {
      return (
        <Container
          align='left'
          spacing={2}
          border='2px'
          padding={15}
          borderColor='gray.500'
          minWidth='100%'
          minHeight='100%'
          borderRadius='50px'
          backgroundColor='#ededed'>
          <VStack>
            <Heading fontSize='xl' as='h1'>
              Welcome to MAFIA - {recArea.label}
            </Heading>
            <HStack
              width='full'
              borderColor='gray.500'
              divider={<StackDivider borderColor='black' />}>
              <GameUILobbyRoles />
              <GameUILobbyRules />
              <GameUILobbyPlayersList players={playersInRecArea} />
            </HStack>
            <HStack>
              {gameInstance && isPlayerHost && gameCanStart ? (
                <StartGameButton area={recArea} myPlayerID={myID} />
              ) : (
                <> </>
              )}
              <Button colorScheme='red'>Disband Lobby</Button>
            </HStack>
          </VStack>
        </Container>
      );
    }
    const isDay = gameInstance.phase === 'day_discussion' || gameInstance.phase === 'day_voting';
    return (
      <Container
        align='left'
        spacing={2}
        border='2px'
        padding={15}
        borderColor='gray.500'
        minWidth='100%'
        minHeight='100%'
        borderRadius='50px'
        backgroundColor={isDay ? '#ededed' : '#7d7d7d'}
        className={isDay ? 'ui-container-day' : 'ui-container-night'}>
        <VStack>
          <HStack>
            <div margin-left='100px'>
              <GameUIHeader gameName={recArea.label} gamePhase={gameInstance.phase.toString()} />
            </div>
            <Container width='455px' />
            <GameUITimer />
          </HStack>
          <HStack width='full' alignItems='stretch' align='flex-start'>
            <VStack align='left'>
              <GameUIRoleDescription playerRole={gameInstance.playerRole(myID)} />
              <GameUIRoleList />
            </VStack>
            <GameUIVideoOverlay />
            <VStack>
              <GameUIAlivePlayerList
                players={gameInstance.alivePlayers.map(player => player.userName)}
              />
              <GameUIDeadPlayerList
                players={gameInstance.deadPlayers.map(player => player.userName)}
              />
            </VStack>
          </HStack>
          <HStack>
            <NextPhaseButton area={recArea} />
          </HStack>
        </VStack>
      </Container>
    );
  }
  return <></>;
}
