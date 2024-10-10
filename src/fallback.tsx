import styled from "styled-components";
import { Link } from "wouter";
import { shoot } from "./lib/client";
import { HashLoader } from "react-spinners";

const Centered = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	flex: 1;
	z-index: 1;
`;

// const Subtitle = styled.div`
/* margin-bottom: 20px; */
// `;

const Header = styled.h1`
	font-size: 3rem;
`;

const InstancePicker = styled.div`
	position: fixed;
	bottom: 0;
	left: 0;
	padding: 30px;
	z-index: 2;
	
	& a {
		cursor: pointer;
	}
`;

export const Fallback = () => {
	return (
		<>
			<Centered>
				<Header>Shoot</Header>
				{/* <Subtitle>We're getting things ready...</Subtitle> */}
			</Centered>

			<HashLoader
				style={{
					position: "absolute",
					top: "50%",
					left: "50%",
					rotate: "45deg",
				}}
				size={100}
				color="rgb(35, 33, 41)"
			/>

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
