import { useEffect, useState } from "react";
import UserService from "../services/UserService";

export default function Protected() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProtectedData = async () => {
            try {
                const token = UserService.getToken();

                if (!token) {
                    throw new Error("Kein Authentifizierungs-Token gefunden");
                }

                const response = await fetch("http://localhost:2311/protected", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(
                        `Anfrage fehlgeschlagen mit Status ${response.status}: ${response.statusText}`
                    );
                }

                const jsonData = await response.json();
                setData(jsonData);
            } catch (err) {
                setError(err.message);
                console.error("Fehler beim Laden der geschützten Daten:", err);
            }
        };

        fetchProtectedData();
    }, []);

    if (error) {
        return (
            <div>Fehler beim Laden der geschützten Daten: {error}</div>
        );
    }

    return (
        <div>
            <div>
                <h2>Hallo {UserService.getUsername()}!</h2>
                <h2>{UserService.hasRole(['admin']) ? <p>Du bist Admin!</p> : null}</h2>
                <div>
          <pre>
            {JSON.stringify(data, null, 2)}
          </pre>
                </div>
            </div>
            <button onClick={() => UserService.doLogout()}>Lass mich raus!</button>
        </div>
    );
}