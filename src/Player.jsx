import React, { useEffect } from "react";
import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useRef } from "react";
import { useRapier } from "@react-three/rapier";

import * as RAPIER from "@dimforge/rapier3d-compat";

const Player = () => {
	const test = useRapier();
  

	const body = useRef();
	const [subscribeKeys, getKeys] = useKeyboardControls();

	const jump = () => {
		const origin = body.current.translation();
		origin.y -= 0.31;
		const direction = { x: 0, y: -1, z: 0 };

		body.current.applyImpulse({ x: 0, y: 0.5, z: 0 });
	};

	useEffect(() => {
		subscribeKeys(
			(state) => state.jump,
			(value) => {
				if (value) {
					jump();
				}
			}
		);
	});

	useFrame((state, delta) => {
		const { forward, backward, leftward, rightward } = getKeys();
		const impulse = { x: 0, y: 0, z: 0 };
		const torque = { x: 0, y: 0, z: 0 };

		const impulseForce = 0.6 * delta;
		const impulseTorqueForce = 0.2 * delta;

		if (forward) {
			impulse.z += impulseForce;
			torque.x += impulseTorqueForce;
		}
		if (backward) {
			impulse.z -= impulseForce;
			torque.x -= impulseTorqueForce;
		}

		if (leftward) {
			impulse.x += impulseForce;
			torque.z -= impulseTorqueForce;
		}
		if (rightward) {
			impulse.x -= impulseForce;
			torque.z += impulseTorqueForce;
		}

		body.current.applyImpulse(impulse);
		body.current.applyTorqueImpulse(torque);
	});
	return (
		<>
			<RigidBody
				colliders="ball"
				restitution={0.5}
				A
				friction={1}
				ref={body}
				linearDamping={0.5}
				angularDamping={0.5}
			>
				<mesh position={[0, 1, 0]} castShadow>
					<icosahedronGeometry args={[0.3, 1]} />
					<meshStandardMaterial color="blue" />
				</mesh>
			</RigidBody>
		</>
	);
};

export default Player;
