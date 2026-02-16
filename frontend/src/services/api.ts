import axios from "axios";
import { Player, PlayerFilterOptions } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export class ApiService {
  /**
   * Get all players or filter by team/position
   */
  /**
   * Get all players or filter by team/position
   * @param filters Optional filters for team, position, or player_id
   * @returns Promise resolving to an array of Player objects
   */
  static async getPlayers(filters?: PlayerFilterOptions): Promise<Player[]> {
    try {
      // Build query string dynamically
      const params: Record<string, string> = {};
      if (filters?.team) params.team = filters.team;
      if (filters?.position) params.position = filters.position;
      if (filters?.player_id) params.player_id = filters.player_id;

      // Make GET request with optional query params
      const response = await api.get<Player[]>("/players", { params });
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch players:", error);
      throw new Error(error?.message || "Error fetching players");
    }
  }

  // TODO: add additional endpoint calls as needed.

  /**
   * Health check endpoint
   */
  static async healthCheck(): Promise<{ status: string }> {
    return api.get("/health");
  }
}

export default ApiService;
