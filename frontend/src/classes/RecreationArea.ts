import MafiaGame, { Phase } from './MafiaGame';
import BoundingBox from './BoundingBox';
import ConversationArea, {ServerConversationArea, ConversationAreaListener} from './ConversationArea';
import Player from './Player';
import GamePlayer from './GamePlayer';


/**
* Represents type of ServerRecreationArea that can be created. Extends the ServerConversationArea properties and methods while also containing the property of a mafia game.
*/
export type ServerRecreationArea = {
    mafiaGame: MafiaGame | undefined; // undefined if not yet started
    // undefined if there are no players in the recArea
} & ServerConversationArea;

export type RecreationAreaListener = {
    onMafiaGameUpdated? : (game: MafiaGame) => void; 
    onMafiaGameCreated? : (game: MafiaGame) => void;
    onMafiaGameStarted? : (game: MafiaGame) => void;
} & ConversationAreaListener;

export default class RecreationArea extends ConversationArea {
    private _mafiaGame: MafiaGame | undefined; 
    
    
    private _recListeners: RecreationAreaListener[] = []; 
    
    // public isRecreationArea = true; 
    
    constructor(label: string, boundingBox: BoundingBox, mafiaGame?: MafiaGame, topic?: string) {
        super(label, boundingBox, topic); 
        this._mafiaGame = mafiaGame; 
        this._recListeners = [];
    }
    
    set mafiaGame(game: MafiaGame | undefined) {
        console.log('IN SET MAFIA GAME');
        
        if (!this._mafiaGame && game) {
            console.log('new game created, notifying listeners'); 
            this.addMafiaGame(game);
            
        }
        
        // disbanding mafiaGame?
        
    }
    
    get mafiaGame(): MafiaGame | undefined {
        return this._mafiaGame;
    }
    
    addMafiaGame(game: MafiaGame) {
        console.log(`In Add Mafia Game: ${game.id}`);
        this._recListeners.forEach(recListener => recListener.onMafiaGameCreated?.(game));
        this._mafiaGame = game;
        
    }
    
    toServerRecreationArea(): ServerRecreationArea {
        const serverArea = super.toServerConversationArea() as ServerRecreationArea;
        serverArea.mafiaGame = this._mafiaGame;
        return serverArea; 
    }
    
    addRecListener(listener: RecreationAreaListener) {
        this._recListeners.push(listener);
        this._listeners.push(listener);
    }
    
    removeRecListener(listener: RecreationAreaListener) {
        this._recListeners = this._recListeners.filter(eachListener => eachListener !== listener);
        this._listeners = this._listeners.filter(eachListener => eachListener !== listener);
    }
    
    static fromServerRecreationArea(serverArea: ServerRecreationArea): RecreationArea {
        const ret = new RecreationArea(serverArea.label, serverArea.boundingBox, serverArea.mafiaGame, serverArea.topic);
        ret.occupants = serverArea.occupantsByID;
        return ret;  
    }
    
    static isRecreationArea(): boolean {
        return true; 
    }
    
    containsPlayerID(playerID: string) {
        return this._occupants.includes(playerID);
    }
    
    
    /**
    * Attempts to add the given player to this rec areas game 
    * @param player The player to be added
    * @returns Whether or not the player was added 
    */
    addPlayerToGame(player: Player): boolean {
        const inArea = this._occupants.includes(player.id);
        if (!inArea) {
            return false;
        }
        const game = this.mafiaGame
        if (game && game.addPlayer(player)) {
            this._recListeners.forEach(recListener => recListener.onMafiaGameUpdated?.(game));
            return true;
        }
        
        return false; 
        
    }
    
    /**
    * Starts this Recreation Area's Mafia Game
    * @param playerRoles Roles assigned to players.
    */
    startGame(playerRoles: GamePlayer[]): void {
        if (this._mafiaGame) {
            if (this._mafiaGame.canStart()) {
                this._mafiaGame.gameStart(playerRoles);
                const game = this._mafiaGame;
                this._recListeners.forEach(listener => listener.onMafiaGameStarted?.(game));
            }
            
        }
    }
    
    notifyPlayerAdded() {
        console.log('Notify player added to game');
        const game = this.mafiaGame;
        if (game) {
            this._recListeners.forEach(listener => listener.onMafiaGameUpdated?.(game));
        }
    }
    
    
    
}
