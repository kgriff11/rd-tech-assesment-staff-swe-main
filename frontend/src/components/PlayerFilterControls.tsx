import React, { useState, ChangeEvent } from "react";
import { PlayerFilterOptions } from "../types";

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

  return (
    <div className="filter-controls">
      <h3>Filter Players</h3>

      <div className="filter-row">
        {/* Team filter dropdown */}
        <div className="filter-group">
          <label htmlFor="team-filter">Team:</label>
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

        {/* Position filter dropdown */}

        <div className="filter-group">
          <label htmlFor="position-filter">Position:</label>
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


        {/* Clear filters button */}
        <button onClick={clearFilters} className="clear-filters">
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default PlayerFilterControls;
