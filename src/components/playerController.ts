import * as BABYLON from 'babylonjs'
import { Action, ActionManager, Engine, ExecuteCodeAction, Scalar, TransformNode } from 'babylonjs';
import PlayerStateMachine from './playerState';

export class inputController {
    public inputMap: any = {}
    private _scene: BABYLON.Scene

    private playerStateMachine: PlayerStateMachine
  	

    constructor(scene: BABYLON.Scene, stateMachine: PlayerStateMachine) {

        this.playerStateMachine = stateMachine
        this._scene = scene;
        this._scene.actionManager = new ActionManager(this._scene)
        this._scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, e => {
            this.inputMap[e.sourceEvent.key] = e.sourceEvent.type == "keydown"


        }))
        this._scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, e => {
            this.inputMap[e.sourceEvent.key] = e.sourceEvent.type == "keydown"
        }))

        scene.onBeforeRenderObservable.add(() => {
            // this._updateFromKeyboard();
            this._update()
        });
    }

    _update() {
        if (this.inputMap["a"]) {
            // this.playerStateMachine.changeState(this.playerStateMachine.states.rotateL)
            this.playerStateMachine.inState(this.playerStateMachine.states.rotateL)
        } else if (this.inputMap["d"]) {
            // this.playerStateMachine.changeState(this.playerStateMachine.states.rotateR)
            this.playerStateMachine.inState(this.playerStateMachine.states.rotateR)
        }else{
            // this.playerStateMachine.inState(this.playerStateMachine.states.stop)

        }
        
        if (this.inputMap["w"]) {

            // this.playerStateMachine.changeState(this.playerStateMachine.states.move)
            this.playerStateMachine.inState(this.playerStateMachine.states.move)

        } else if (this.inputMap["s"]) {
            this.playerStateMachine.inState(this.playerStateMachine.states.back)
        } else {
            // this.playerStateMachine.changeState(this.playerStateMachine.states.stop)
            this.playerStateMachine.inState(this.playerStateMachine.states.stop)
            
            




        }

        if (this.inputMap[" "]) {

        } else {
            // this.isJump = false
        }

        if (this.inputMap['f']) {

        } else {

        }


    }
}

