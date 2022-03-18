import * as BABYLON from 'babylonjs'
import { createScene} from './scenes'

enum State  { START = 0, GAME = 1}

class Game{
    engine:BABYLON.Engine;
    scene: BABYLON.Scene;
    constructor(canvas:HTMLCanvasElement){
        this.engine = new BABYLON.Engine(canvas,true)
        this.scene = createScene(this.engine,canvas)
        this.update()
    }
    clicked(){
        // this.scene.clearColor = new BABYLON.Color4(1,1,1,1)
    }
    update(){
        this.engine.runRenderLoop(()=>{
            this.scene.render()
        })
    }
    
}

export {Game}