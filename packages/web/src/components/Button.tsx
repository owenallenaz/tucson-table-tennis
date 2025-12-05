import type { ReactNode } from "react";

export default function Button({
	className = "",
	busy,
	size = "small",
	children,
	onClick
}: {
	busy?: boolean
	size?: "large" | "small"
	children: ReactNode
	className?: string
	onClick: (...args: any) => any
}) {
	return (
		<button className={`defaultButton ${size} ${className}`} onClick={onClick} aria-busy={busy}>
			{children}
		</button>
	)
}
