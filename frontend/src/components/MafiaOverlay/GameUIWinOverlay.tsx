import { Button, Container, Heading, HStack } from '@chakra-ui/react';
import React from 'react';
import { Role, Team } from '../../classes/GamePlayer';
import MafiaGame from '../../classes/MafiaGame';
import { GameUIVideoOverlay } from './GameUIComponents';

type GameUIWinOverlayProps = {
  game: MafiaGame;
  isPlayerHost: boolean;
  disbandLobby: () => Promise<void>;
  startGame: () => Promise<void>;
  leaveLobby: () => Promise<void>;
};

export default function GameUIWinOverlay({
  game,
  isPlayerHost,
  disbandLobby,
  startGame,
  leaveLobby,
}: GameUIWinOverlayProps): JSX.Element {
  const getWinnerColor = () => {
    if (game.winner === Team.Town) return '#00a108';
    if (game.winner === Team.Mafia) return '#940000';
    return 'black';
  };
  return (
    <Container
      border='2px'
      padding='15'
      borderColor='gray.500'
      minWidth='100%'
      minHeight='100%'
      borderRadius='50px'
      backgroundColor='#ededed'
      className='ui-container-day'>
      <Heading fontSize='xl' as='h1' color={getWinnerColor()} margin='20px'>
        {game.winner !== Team.Unassigned ? `${Team[game.winner]} wins!` : 'Draw'}
      </Heading>

      <HStack>
        <div className='win-left-panel'>
          <Container width='200px' height='296px' className='ui-container'>
            <Heading fontSize='xl' as='h1'>
              Winners:
            </Heading>
            <ul>
              {game.gamePlayers
                .filter(p => p.team === game.winner)
                .map(player => (
                  <li key={player.id}>
                    {player.userName}: {Role[player.role]}
                  </li>
                ))}
            </ul>
          </Container>
          <div className='win-buttons'>
            {isPlayerHost ? (
              <>
                <Button
                  colorScheme='blue'
                  width='60%'
                  onClick={startGame}
                  isDisabled={!game.canStart()}>
                  New Game
                </Button>
                <Button colorScheme='red' width='60%' onClick={disbandLobby}>
                  Disband Lobby
                </Button>
              </>
            ) : (
              <Button colorScheme='red' onClick={leaveLobby}>
                Leave Game
              </Button>
            )}
          </div>
        </div>

        <GameUIVideoOverlay game={game} gamePhase={game.phase} />
      </HStack>
    </Container>
  );
}
