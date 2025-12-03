import { useState, type FormEvent } from "react";
import callGas from "./callGas";
import useAuth from "./useAuth";

export default function Login() {
	const { setToken } = useAuth();
	const [password, setPassword] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	const onSubmit = async (e: FormEvent<HTMLButtonElement>) => {
		e.preventDefault();

		setLoading(true);
		const result = await callGas("checkToken", { token: password });
		setLoading(false);
		if (result.success !== true) {
			return alert("Invalid password");
		}

		setToken(password);
	}

	return (
		<form>
			<fieldset role="group">
				<input
					type="text"
					name="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.currentTarget.value)}
				/>
				<button aria-busy={loading} onClick={onSubmit}>Login</button>
			</fieldset>
		</form>
	)
}
