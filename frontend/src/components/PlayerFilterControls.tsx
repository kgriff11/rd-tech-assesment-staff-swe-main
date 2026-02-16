import React, { useState, ChangeEvent } from "react";
import { PlayerFilterOptions } from "../types";
import "../styles/PlayerFilterControls.css";
import { getTeamLogoUrl } from "../constants/teamLogos";


interface PlayerFilterControlsProps {
  onFilterChange: (filters: PlayerFilterOptions) => void;
  availableTeams?: string[];
  availablePositions?: string[];
}

const PlayerFilterControls: React.FC<PlayerFilterControlsProps> = ({
  onFilterChange,
  availableTeams = [],
  availablePositions = [],
}) => {
  const [filters, setFilters] = useState<PlayerFilterOptions>({});

  const handleTeamChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const team = event.target.value || undefined; // undefined if empty
    const updatedFilters = { ...filters, team };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handlePositionChange = (event: ChangeEvent<HTMLSelectElement>) => {
  // Get the selected position from the dropdown
  const newPosition = event.target.value || undefined;

  // Update local filter state
  const updatedFilters = { ...filters, position: newPosition };
  setFilters(updatedFilters);

  // Notify parent component so it can fetch filtered players
  onFilterChange(updatedFilters);
};

  // Clear all filters
  const clearFilters = () => {
    const clearedFilters: PlayerFilterOptions = {};
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const logoUrl = getTeamLogoUrl(filters.team);

  return (
    <div className="baseball-card">
      <div className="card-content">
        
        <div className="card-left">
          <div className="card-header">
            <h2>PLAYER FILTER CARD</h2>
            <span className="card-subtitle">Official MLB Filter Series</span>
          </div>

          <div className="card-body">
            {/* Team */}
            <div className="card-row">
              <label htmlFor="team-filter">TEAM</label>
              <select
                id="team-filter"
                value={filters.team || ""}
                onChange={handleTeamChange}
              >
                <option value="">All Teams</option>
                {availableTeams.map((team) => (
                  <option key={team} value={team}>
                    {team}
                  </option>
                ))}
              </select>
            </div>

            {/* Position */}
            <div className="card-row">
              <label htmlFor="position-filter">POSITION</label>
              <select
                id="position-filter"
                value={filters.position || ""}
                onChange={handlePositionChange}
              >
                <option value="">All Positions</option>
                {availablePositions.map((pos) => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
              </select>
            </div>

            <button onClick={clearFilters} className="card-reset">
              RESET CARD
            </button>
          </div>
        </div>

        {/* Team Logo */}
        {logoUrl && (
          <div className="card-logo">
            <img src={logoUrl} alt={filters.team} />
          </div>
        )}

      </div>

      <div className="card-footer">
        ⚾ EST. 2026 ⚾
      </div>
    </div>
  );
};

export default PlayerFilterControls;
