import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type AuthTypes = "primary" | "admin"

interface AuthContextData {
	token?: string
	type?: AuthTypes
	setToken: (str: string) => void
	setType: (str: AuthTypes) => void
	logout: () => void
}

export const AuthContext = createContext<AuthContextData | null>(null);

export function AuthDataProvider({ children }: { children: ReactNode }) {
	const [token, setToken] = useState<string | null>(() => {
		return localStorage.getItem("token");
	});
	const [type, setType] = useState<AuthTypes | null>(() => {
		return localStorage.getItem("type") as any;
	});

	const contextData: AuthContextData = useMemo(() => {
		return {
			token: token !== null ? token : undefined,
			type: type !== null ? type : undefined,
			setToken: (token: string) => {
				setToken(token);
				localStorage.setItem("token", token);
			},
			setType: (type: AuthTypes) => {
				setType(type);
				localStorage.setItem("type", type);
			},
			logout: () => {
				setToken(null);
				localStorage.clear();
			}
		}
	}, [
		token,
		type,
		setToken,
		setType
	]);

	return (
		<AuthContext value={contextData}>
			{children}
		</AuthContext>
	)
}

export default function useAuth() {
	const contextData = useContext(AuthContext);
	if (contextData === null) {
		throw new Error("Missing data");
	}

	return contextData;
}
