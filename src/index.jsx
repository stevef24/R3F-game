import "./style.css";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import Experience from "./Experience.jsx";
import { KeyboardControls } from "@react-three/drei";

const root = ReactDOM.createRoot(document.querySelector("#root"));

root.render(
	<KeyboardControls
		map={[
			{ name: "forward", keys: ["ArrowUp", "w", "W"] },
			{ name: "backward", keys: ["ArrowDown", "s", "S"] },
			{ name: "leftward", keys: ["ArrowLeft", "a", "A"] },
			{ name: "rightward", keys: ["ArrowRight", "d", "D"] },
			{ name: "jump", keys: ["Space"] },
		]}
	>
		<Canvas
			shadows
			camera={{
				fov: 75,
				near: 0.1,
				far: 1000,
				position: [-6, 5, -2],
			}}
		>
			<Experience />
		</Canvas>
	</KeyboardControls>
);
