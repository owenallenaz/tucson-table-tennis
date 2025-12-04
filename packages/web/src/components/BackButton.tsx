import { NavLink } from "react-router";

export default function BackButton({ to }: { to: string }) {
	return (
		<div className="backButton">
			<NavLink to={to} >Back</NavLink>
		</div>
	)
}
