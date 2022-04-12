import React, { useEffect, useState } from 'react'
import MafiaGame from '../../classes/MafiaGame'
import RecreationArea from '../../classes/RecreationArea'
import CreateGameButton from './CreateGameButton'
import JoinGameButton from './JoinGameButton'

type LobbyButtonProps = {
    area: RecreationArea, 
    mafiaGame: MafiaGame | undefined,
    playerID: string,
}

const LobbyButton = ({area, mafiaGame, playerID}: LobbyButtonProps): JSX.Element => { 
   
    const playerInMafiaGame = (): boolean => {
        const gamePlayer = mafiaGame?._players.find(p => p.id === playerID); 
        if (gamePlayer) {
            return true;
        }
        return false; 
    }

    const [playerInGame, setPlayerInGame] = useState(playerInMafiaGame());
    

    useEffect(() => {setPlayerInGame(playerInMafiaGame())}, [mafiaGame]); 




  return (
    <>
        {mafiaGame ? 
            <JoinGameButton hostID={mafiaGame._host.id} myPlayerID={playerID} area={area}/>
        :
            <CreateGameButton area={area} myPlayerID={playerID}/>}
    </>
  )
}

export default LobbyButton