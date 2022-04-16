import React, { useCallback, useEffect, useState }from 'react';
import { Button, useToast } from "@chakra-ui/react";
import RecreationArea, { RecreationAreaListener } from '../../classes/RecreationArea';
import MafiaGame from '../../classes/MafiaGame';
import useCoveyAppState from '../../hooks/useCoveyAppState';

export enum Phase {
    'lobby',
    'day_discussion',
    'day_voting',
    'night',
    'win',
}

type ConversationAreaProps = {
    area: RecreationArea,
    myPlayerID: string,
};

export default function CreateGameButton({ area, myPlayerID }: ConversationAreaProps ): JSX.Element {
    const [mafiaGame, setMafiaGame] = useState<MafiaGame | undefined>(area.mafiaGame);

    const {apiClient, sessionToken, currentTownID} = useCoveyAppState();

    const toast = useToast();


    const createGameLobby = useCallback(async () => {
        try {
            await apiClient.createGameLobby({
                coveyTownID: currentTownID,
                sessionToken,
                recreationAreaLabel: area.label,
                hostID: myPlayerID,
            });
            toast({
                title: 'Mafia Game Lobby Created!',
                status: 'success',
            });
            if (!mafiaGame) {
                console.log('Mafia game undefined');
                console.log(`Area label: ${area.label}`);
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast({
                    title: 'Unable to create Mafia Game Lobby',
                    description: err.toString(),
                    status: 'error',
                })
            }
        }
    }, [apiClient, sessionToken, currentTownID, toast, area, mafiaGame, myPlayerID]); 

    useEffect(() => {
        console.log('IN USE EFFECT');
        const updateListener: RecreationAreaListener = {
            onMafiaGameCreated: (game: MafiaGame) => {
                console.log(`In Listener, on Mafia Game Created! Phase: ${game.phase}, HOST: ${game._host.userName}, NUM PLAYERS: ${game.players.length}`);
                setMafiaGame(game); 
            },
            onMafiaGameUpdated: (game: MafiaGame) => {
                setMafiaGame(game);
            }
            
        };
        area.addRecListener(updateListener);
        return () => {
            area.removeRecListener(updateListener);
        };
    }, [mafiaGame, setMafiaGame, area]);

    return (
        // if player has not started game in this recreation area yet, then show "start game"
        // once start game button is clicked, then mafia overlay should show
        // otherwise show "join game" or "spectate game"
        <div>
            <Button colorScheme='teal' onClick={createGameLobby}>Create Game</Button>
        </div>
    );
}