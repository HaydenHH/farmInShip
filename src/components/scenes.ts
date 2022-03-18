import * as BABYLON from 'babylonjs'
import * as  GUI from 'babylonjs-gui';
import 'babylonjs-loaders'
import UI from './gui';
import './playerController'
import { inputController } from './playerController'
import PlayerStateMachine from './playerState'
import { MakePhysicsObject, RayCaster } from './tool'
// import * as CANNON from  'cannon'



var transformForce = function (mesh: BABYLON.Mesh | BABYLON.AbstractMesh, vec: BABYLON.Vector3) {
    var mymatrix = new BABYLON.Matrix();
    mesh.rotationQuaternion?.toRotationMatrix(mymatrix);
    return BABYLON.Vector3.TransformNormal(vec, mymatrix);
};


const createScene = (engine: BABYLON.Engine, canvas: HTMLCanvasElement): BABYLON.Scene => {
    const scene = new BABYLON.Scene(engine)
    scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
    scene.fogDensity = 0.01
    scene.fogStart = 50.0;
    scene.fogEnd = 300.0;
    scene.fogColor = BABYLON.Color3.FromHexString('#DAEEEC')
    var hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("./bg2.env", scene);

    hdrTexture.gammaSpace = false;
    scene.environmentTexture = hdrTexture;

    scene.enablePhysics(new BABYLON.Vector3(0, -110, 0), new BABYLON.AmmoJSPlugin());
    scene.clearColor = BABYLON.Color4.FromHexString('#000000')

    const skyBox = BABYLON.MeshBuilder.CreateBox('skyBox',{size:1000},scene)
    const skyBoxMtr = new BABYLON.StandardMaterial('skyMtr',scene)
    skyBoxMtr.reflectionTexture = hdrTexture
    skyBoxMtr.backFaceCulling = false;
    skyBox.material = skyBoxMtr
    // skyBoxMtr.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

    const light = new BABYLON.HemisphericLight('mainLight', new BABYLON.Vector3(3, 3, 3), scene)
    // const camera = new BABYLON.UniversalCamera('cam', new BABYLON.Vector3(39, 30, 9), scene)
    const camera = new BABYLON.FollowCamera('cam', new BABYLON.Vector3(0, 0, 0), scene)

    var ScreenWidth = engine.getRenderWidth();
    var ScreenHeight = engine.getRenderHeight();
    let cameraZoom = 50
    // camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
    // camera.orthoTop = ScreenHeight / cameraZoom;
    // camera.orthoBottom = -ScreenHeight / cameraZoom;
    // camera.orthoLeft = -ScreenWidth / cameraZoom;
    // camera.orthoRight = ScreenWidth / cameraZoom;


    camera.position.x = 130
    camera.position.y = 30
    camera.radius = 60
    camera.rotationOffset = -80;
    camera.heightOffset = 13
    // camera.offse
    // camera.maxZ =1300

    var defaultPipeline = new BABYLON.DefaultRenderingPipeline("default", true, scene, [camera]);
    defaultPipeline.bloomEnabled = true;
    // defaultPipeline.bloomWeight=1.2

   



    let player: BABYLON.AbstractMesh
    let car: BABYLON.AbstractMesh
    let carState: PlayerStateMachine
    let input: inputController
    let rayCaster: RayCaster
    let ui:UI

    // camera.attachControl()


    // const gnd = BABYLON.MeshBuilder.CreateTiledBox('gnd',{size:350,height:300,depth:1,tileSize:10},scene)
    const gnd = BABYLON.MeshBuilder.CreateTiledGround('gnd', { zmin: -1220, zmax: 1220, xmin: -1220, xmax: 1220, subdivisions: { w: 120, h: 120 } }, scene)

    gnd.physicsImpostor = new BABYLON.PhysicsImpostor(gnd, BABYLON.PhysicsImpostor.PlaneImpostor, { mass: 0, friction: 0.15 }, scene)
    const gndMtr = new BABYLON.StandardMaterial('gndMtr', scene)
    gndMtr.bumpTexture = new BABYLON.Texture('./NormalMap.png', scene)
    // gndMtr.diffuseTexture = new BABYLON.Texture('./gndDiff.png', scene)

    gndMtr.emissiveTexture = new BABYLON.Texture('./gndDiff.png', scene)
    gndMtr.emissiveColor=BABYLON.Color3.Red()
    // gndMtr.useEmissiveAsIllumination=true
    gndMtr.ambientTexture=new BABYLON.Texture('./AO.png', scene)
    
    gndMtr.diffuseColor = BABYLON.Color3.FromHexString('#CA260F')

    gndMtr.specularColor = BABYLON.Color3.White()
    gnd.material = gndMtr

    // const box = BABYLON.MeshBuilder.CreateBox('box',{size:7})
    // box.position = new BABYLON.Vector3(10,50,10)
    // box.physicsImpostor = new BABYLON.PhysicsImpostor(box,BABYLON.PhysicsImpostor.BoxImpostor,{mass:1,friction:0.5},scene)

    const spriteManagerTrees = new BABYLON.SpriteManager("maizis", "./maizi.png", 6000, { width: 293, height: 979 }, scene);
    for (let i = 0; i < 500; i++) {
        const tree = new BABYLON.Sprite("tree", spriteManagerTrees);
        // tree.width = BABYLON.Scalar.RandomRange(1,3);
        const randHeight = BABYLON.Scalar.RandomRange(10, 30);
        tree.height = randHeight
        tree.width = randHeight * 293 / 979
        tree.position.x = BABYLON.Scalar.RandomRange(-1500, 1500);
        tree.position.z = BABYLON.Scalar.RandomRange(-1500, 1500);
        tree.position.y = 1


        // tree.physicsImpostor = 
    }

    const maiziGroup:BABYLON.DeepImmutable<BABYLON.AbstractMesh>[]=[]

    const loadModel = async () => {

        // const machine = await BABYLON.SceneLoader.ImportMeshAsync('', './', 'tinyMachine.glb', scene)


        const carAsset = await BABYLON.SceneLoader.ImportMeshAsync('', './', 'farmerCar.glb', scene)

        car = MakePhysicsObject(carAsset.meshes, scene, 1,10)

        const carCaster = car.getDescendants().find(x => x.name === 'caster')
        // rayCaster = new RayCaster(carCaster as BABYLON.AbstractMesh, scene)
        carState = new PlayerStateMachine(car)
        input = new inputController(scene, carState)



        car.position.y = 10
        car.position.x = 30


        const fishAsset = await BABYLON.SceneLoader.ImportMeshAsync('', './', 'fishAni.glb', scene)
        const fish = MakePhysicsObject(fishAsset.meshes, scene, 0.4)
        fish.position.y = 3
        player = fish
        // cameraTarget.parent = car
        const tar = car.getDescendants().find(x => x.name.includes('camTar'))
        camera.target = (car as BABYLON.AbstractMesh).position
        camera.lockedTarget = (tar as BABYLON.AbstractMesh)

        ui= new UI(carState)
        ui.speedUI(car)

        for (let i = 0; i < 5; i++) {

            for (let y = 0; y < 5; y++) {
                const maizi = await BABYLON.SceneLoader.ImportMeshAsync('', './', 'maizi_.glb', scene)

                const maiziBox = MakePhysicsObject(maizi.meshes, scene, 5, 1)
                maiziBox.position.x = i * 30 + 50
                maiziBox.position.z = y * 30 + 50

                maiziGroup.push(maiziBox as BABYLON.DeepImmutable<BABYLON.AbstractMesh>)

            }

        }

        for (let i = 0; i < 3; i++) {

            for (let y = 0; y < 3; y++) {
                const food = await BABYLON.SceneLoader.ImportMeshAsync('', './', 'foodBox.glb', scene)

                const foodBox = MakePhysicsObject(food.meshes, scene, 5, 50)
                foodBox.position.x = i * 40 - 50
                foodBox.position.z = y * 40 - 50

                // foodGroup.push(foodBox as BABYLON.DeepImmutable<BABYLON.AbstractMesh>)

            }

        }
    }



    loadModel()

    

    let selected:BABYLON.AbstractMesh

    scene.registerBeforeRender(() => {
        carState?.updateState()
        rayCaster?.update()
        // console.log(rayCaster?.ray.intersectsMeshes(maiziGroup,false));
        scene.meshes.forEach(ele=>{
            ele.showBoundingBox=false
            if(ele.physicsImpostor&&!ele.name.includes('gnd')){
                ele.isVisible=false
            }
        })
        if(selected){
            selected.getChildMeshes().filter(x=>x.name.includes('box')||x.name.includes('Box')).forEach(ele=>{
                ele.showBoundingBox=true
                ele.isVisible = true
            })
        }
        
        ui?.udpate()
    })

    scene.onPointerDown=()=>{
        var mouseray = scene.createPickingRay(scene.pointerX, scene.pointerY, BABYLON.Matrix.Identity(), camera);	
        var mousehit = scene.pickWithRay(mouseray);

            if(mousehit?.pickedMesh){
                if(selected)selected.showBoundingBox=false
                let mesh:BABYLON.AbstractMesh = mousehit?.pickedMesh
                while(mesh.parent!=null){
                    mesh=mesh.parent as BABYLON.AbstractMesh
                    
                }
                console.log(mesh.name);
                selected=mesh
                
                // console.log(selected);

            }
    }

    scene.onPointerObservable.add((pointerInfo) => {
		if(pointerInfo.type==BABYLON.PointerEventTypes.POINTERDOUBLETAP){
            var mouseray = scene.createPickingRay(scene.pointerX, scene.pointerY, BABYLON.Matrix.Identity(), camera);	
            var mousehit = scene.pickWithRay(mouseray);

            if(selected&&mousehit?.pickedMesh?.isDescendantOf(selected)){
                (selected as BABYLON.TransformNode).position.y +=5
                // selected.position.y +=1
                
            }
        }
			
    });

    return scene
}

export { createScene }