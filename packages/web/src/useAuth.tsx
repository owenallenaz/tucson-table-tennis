import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

interface AuthContextData {
	token?: string
	setToken: (str: string) => void
	logout: () => void
}

export const AuthContext = createContext<AuthContextData | null>(null);

export function AuthDataProvider({ children }: { children: ReactNode }) {
	const [token, setToken] = useState<string | null>(() => {
		return localStorage.getItem("token");
	});

	const contextData = useMemo(() => {
		return {
			token: token !== null ? token : undefined,
			setToken: (token: string) => {
				setToken(token);
				localStorage.setItem("token", token);
			},
			logout: () => {
				setToken(null);
				localStorage.clear();
			}
		}
	}, [
		token,
		setToken
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
