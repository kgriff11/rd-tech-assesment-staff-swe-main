import React, { useEffect, useState } from "react";
import "./App.css";
import { Player, PlayerFilterOptions } from "./types";
import PlayerFilterControls from "./components/PlayerFilterControls";
import PlayerTable from "./components/PlayerTable";
import ApiService from "./services/api";

const App: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [availableTeams, setAvailableTeams] = useState<string[]>([]);
  const [availablePositions, setAvailablePositions] = useState<string[]>([]);

  // Fetch all players initially to populate dropdowns and table
  useEffect(() => {
    const fetchInitialPlayers = async () => {
      setIsLoading(true);
      try {
        const data = await ApiService.getPlayers();
        setPlayers(data);

        // Extract unique teams and positions for filter dropdowns
        const teams = Array.from(new Set(data.map((p) => p.team))).sort();
        const positions = Array.from(new Set(data.map((p) => p.primary_position))).sort();

        setAvailableTeams(teams);
        setAvailablePositions(positions);
      } catch (err: any) {
        setError(err?.message || "Failed to load players");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialPlayers();
  }, []);

  // Handler for when filters change
  const handleFilterChange = async (filters: PlayerFilterOptions) => {
    setIsLoading(true);
    setError("");
    try {
      const filteredPlayers = await ApiService.getPlayers(filters);
      setPlayers(filteredPlayers);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch filtered players");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Baseball Player Statistics</h1>
        <p>Engineered by Kelso Griffin</p>
      </header>

      <main>
        {/* TODO: Player Filter controls */}
        <section className="filter-section">
          <PlayerFilterControls
            onFilterChange={handleFilterChange}
            availableTeams={availableTeams}
            availablePositions={availablePositions}
          />
        </section>

        {/* TODO: Player data table */}
        <section className="data-section">
          <PlayerTable players={players} isLoading={isLoading} error={error} />
        </section>

        {/* TODO: Pitch Filter Controls}
        {/* TODO: Implement pitches table */}
      </main>

      <footer>
        <p>Houston Astros - Staff Software Engineer Assessment</p>
      </footer>
    </div>
  );
};

export default App;
