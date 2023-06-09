import { OrbitControls } from "@react-three/drei";
import Lights from "./Lights.jsx";
import Level, { BlockSpinner } from "./Level.jsx";
import { Physics, Debug } from "@react-three/rapier";
import Player from "./Player.jsx";

export default function Experience() {
	return (
		<>
			<OrbitControls makeDefault />
			<Physics>
				<Lights />
				<Level />
				<Player />
			</Physics>
		</>
	);
}
