import styled from "styled-components";
import { Link } from "wouter";
import { shoot } from "./lib";

const Header = styled.h1`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	flex: 1;
	font-size: 3rem;
`;

const InstancePicker = styled.div`
	position: fixed;
	bottom: 0;
	left: 0;
	padding: 30px;
`;

export const Fallback = () => {
	return (
		<>
			<Header>Shoot</Header>

			<InstancePicker>
				<Link
					to="/login"
					onClick={() => {
						shoot.logout();
						window.location.reload();
					}}
				>
					Change instance
				</Link>
			</InstancePicker>
		</>
	);
};
