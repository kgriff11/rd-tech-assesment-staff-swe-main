import React from "react";
import { Player } from "../types";
import "../styles/PlayerTable.css";

interface PlayerTableProps {
  players: Player[];
  isLoading?: boolean;
  error?: string;
}

const PlayerTable: React.FC<PlayerTableProps> = ({
  players,
  isLoading = false,
  error,
}) => {
  if (isLoading) {
    return (
      <div className="player-table">
        <div className="loading">Loading players...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="player-table">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="player-table">
        <div className="no-data">No players found.</div>
      </div>
    );
  }

  return (
    <div className="player-table">
      <h2>Players ({players.length} players)</h2>

      {/* TODO: Implement player table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Team</th>
              <th>Position</th>
              <th>Height</th>
              <th>Weight</th>
              <th>Throws</th>
              <th>Bats</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player.player_id}>
                <td>{`${player.first_name} ${player.last_name}`}</td>
                <td>{player.team}</td>
                <td>{player.primary_position}</td>
                <td>{`${player.height_feet}'${player.height_inches}"`}</td>
                <td>{player.weight} lbs</td>
                <td>{player.throws}</td>
                <td>{player.bats}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TODO: Add table features if time permits */}
      {/* Consider adding:
          - Sorting by column headers
          - Pagination for large datasets
          - Row highlighting on hover
          - Click to view player details
      */}
    </div>
  );
};

export default PlayerTable;
