import * as THREE from "three";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useState, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

THREE.ColorManagement.legacyMode = false;

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

const floor1Material = new THREE.MeshStandardMaterial({ color: "limegreen" });
const floor2Material = new THREE.MeshStandardMaterial({ color: "greenyellow" });
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: "orangered" });
const wallMaterial = new THREE.MeshStandardMaterial({ color: "slategrey" });

export function BlockEnd({ position = [0, 0, 0] }) {
	const hamburger = useGLTF("/hamburger.glb");

	hamburger.scene.children.forEach((mesh) => {
		mesh.castShadow = true;
	});

	return (
		<group position={position}>
			<mesh
				geometry={boxGeometry}
				position={[0, -0.1, 0]}
				scale={[4, 0.2, 4]}
				receiveShadow
				material={floor1Material}
			/>
			<RigidBody type="fixed" colliders="hull" position={[0, 0.25, 0]}>
				<primitive object={hamburger.scene} scale={0.2} />
			</RigidBody>
		</group>
	);
}
export function BlockStart({ position = [0, 0, 0] }) {
	return (
		<group position={position}>
			<mesh
				geometry={boxGeometry}
				position={[0, -0.1, 0]}
				scale={[4, 0.2, 4]}
				receiveShadow
				material={floor1Material}
			/>
		</group>
	);
}
export function BlockSpinner({ position = [0, 0, 0] }) {
	const obstacleRef = useRef();

	const [speed] = useState(
		() => (Math.random() + 0.2) * (Math.random() > 0.5 ? 1 : -1)
	);

	useFrame((state) => {
		const time = state.clock.getElapsedTime();
		const rotation = new THREE.Quaternion();
		rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));

		obstacleRef.current.setNextKinematicRotation(rotation);
	});

	return (
		<group position={position}>
			<mesh
				geometry={boxGeometry}
				position={[0, -0.1, 0]}
				scale={[4, 0.2, 4]}
				receiveShadow
				material={floor2Material}
			/>
			<RigidBody
				type="kinematicPosition"
				restitution={0.2}
				friction={0}
				ref={obstacleRef}
			>
				<mesh
					geometry={boxGeometry}
					position={[0, 0.2, 0]}
					scale={[3.5, 0.3, 0.3]}
					receiveShadow
					material={obstacleMaterial}
					castShadow
				/>
			</RigidBody>
		</group>
	);
}
export function Limbo({ position = [0, 0, 0] }) {
	const obstacleRef = useRef();

	const [timeOffset] = useState(() => Math.random() * Math.PI * 2);

	useFrame((state) => {
		const time = state.clock.getElapsedTime();
		const y = Math.sin(time + timeOffset);
		obstacleRef.current.setNextKinematicTranslation({
			x: position[0],
			y: position[1] + y,
			z: position[2],
		});
	});

	return (
		<group position={position}>
			<mesh
				geometry={boxGeometry}
				position={[0, -0.1, 0]}
				scale={[4, 0.2, 4]}
				receiveShadow
				material={floor2Material}
			/>
			<RigidBody
				type="kinematicPosition"
				restitution={0.2}
				friction={0}
				ref={obstacleRef}
			>
				<mesh
					geometry={boxGeometry}
					position={[0, 1.2, 0]}
					scale={[3.5, 0.3, 0.3]}
					receiveShadow
					material={obstacleMaterial}
					castShadow
				/>
			</RigidBody>
		</group>
	);
}
export function LimboAxe({ position = [0, 0, 0] }) {
	const obstacleRef = useRef();

	const [timeOffset] = useState(() => Math.random() * Math.PI * 2);

	useFrame((state, delta) => {
		const time = state.clock.getElapsedTime();

		const x = Math.sin(time + timeOffset) * 1.25;
		obstacleRef.current.setNextKinematicTranslation({
			x: position[0] + x,
			y: position[1] - 0.4,
			z: position[2],
		});
	});

	return (
		<group position={position}>
			<mesh
				geometry={boxGeometry}
				position={[0, -0.1, 0]}
				scale={[4, 0.2, 4]}
				receiveShadow
				material={floor2Material}
			/>
			<RigidBody
				type="kinematicPosition"
				restitution={0.2}
				friction={0}
				ref={obstacleRef}
			>
				<mesh
					geometry={boxGeometry}
					position={[0, 1.2, 0]}
					scale={[1.5, 1.5, 0.3]}
					receiveShadow
					material={obstacleMaterial}
					castShadow
				/>
			</RigidBody>
		</group>
	);
}

function Bounds({ length = 1 }) {
	return (
		<>
			<RigidBody type="fixed">
				<mesh
					position={[-2.15, 0.75, length * 2 - 2]}
					geometry={boxGeometry}
					material={wallMaterial}
					scale={[0.3, 1.5, 4 * length]}
				/>

				<mesh
					position={[2.15, 0.75, length * 2 - 2]}
					geometry={boxGeometry}
					material={wallMaterial}
					scale={[0.3, 1.5, 4 * length]}
					castShadow
				/>
				<mesh
					position={[0, 0.75, length * 4 - 2]}
					geometry={boxGeometry}
					material={wallMaterial}
					scale={[4, 1.5, 0.3]}
					castShadow
				/>
				<CuboidCollider
					args={[2, 0.1, 2 * length]}
					position={[0, -0.1, length * 2 - 2]}
					restitution={0.2}
					friction={1}
				/>
			</RigidBody>
		</>
	);
}

const Level = ({ levels = 10, types = [BlockSpinner, Limbo, LimboAxe] }) => {
	const blocks = useMemo(() => {
		const blocks = [];
		for (let i = 0; i < levels; i++) {
			const type = types[Math.floor(Math.random() * types.length)];
			blocks.push(type);
		}
		return blocks;
	}, [levels, types]);

	return (
		<>
			<BlockStart position={[0, 0, 0]} />
			{blocks.map((Block, index) => (
				<Block position={[0, 0, index * 4 + 4]} key={index} />
			))}
			<BlockEnd position={[0, 0, (levels + 1) * 4]} />
			<Bounds length={levels + 2} />
		</>
	);
};

export default Level;
