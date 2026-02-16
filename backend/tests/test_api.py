import pytest
import os
import sys

from main import app, db, Player, Pitch


@pytest.fixture
def client():
    """Create a test client for the Flask application."""

    # Point to the actual baseball database for now
    app.config["TESTING"] = True
    baseball_db_path = os.path.join(
        os.path.dirname(__file__), "..", "data", "baseball.db"
    )
    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{baseball_db_path}"

    with app.test_client() as client:
        with app.app_context():
            yield client


class TestHealthCheck:
    """Test the health check endpoint."""

    def test_health_check(self, client):
        """Test that health check returns 200 status."""
        # TODO: Implement health check test
        pass


class TestPlayerAPI:
    """Test player-related API endpoints."""

    def test_get_all_players(self, client):
        response = client.get("/players")
        assert response.status_code == 200
        data = response.get_json()
        assert isinstance(data, list)

    def test_filter_players_by_team(self, client):
        """
        Test filtering players by team.
        This sends a GET request to /players?team=<team>
        and verifies that all returned players belong to that team.
        """
        # Example team to filter
        team_to_test = "TOR"

        # Make the GET request with team query param
        response = client.get(f"/players?team={team_to_test}")
        assert response.status_code == 200

        # Convert JSON response to Python list
        data = response.get_json()
        assert isinstance(data, list)

        # Ensure all returned players are from the requested team
        for player in data:
            assert player["team"] == team_to_test

    def test_filter_players_by_position(self, client):
        """
        Test filtering players by primary position.
        Sends a GET request to /players?position=<position>
        and verifies all returned players have that position.
        """
        # Example position to filter
        position_to_test = "RHS"  # Pitcher

        # Make the GET request with position query param
        response = client.get(f"/players?position={position_to_test}")
        assert response.status_code == 200

        # Convert JSON response to Python list
        data = response.get_json()
        assert isinstance(data, list)

        # Ensure all returned players match the requested position
        for player in data:
            assert player["primary_position"] == position_to_test

    def test_get_player_by_id(self, client):
        """Test retrieving a single player by player_id."""

        # Use a real player_id from baseball.db
        example_player_id = "453286"

        # Make GET request with the player_id filter
        response = client.get(f"/players?player_id={example_player_id}")
        assert response.status_code == 200

        # Convert JSON response to Python list
        data = response.get_json()
        assert isinstance(data, list)
        
        # There should be at least one player returned
        assert len(data) > 0

        # Make sure the returned player has the correct ID
        player = data[0]
        assert str(player["player_id"]) == example_player_id
        assert player["first_name"] == "Maxwell"
        assert player["last_name"] == "Scherzer"

    def test_get_nonexistent_player(self, client):
        """Test getting a player that doesn't exist."""
        # TODO: Implement test for 404 response
        pass
