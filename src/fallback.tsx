import styled from "styled-components";

const Container = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	font-size: 3rem;
`

export const Fallback = () => {
	return <Container>
		Shoot
	</Container>
}