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
        """Test filtering players by team."""
        # TODO: Implement test for team filtering
        pass

    def test_filter_players_by_position(self, client):
        """Test filtering players by position."""
        # TODO: Implement test for position filtering
        pass

    def test_get_player_by_id(self, client):
        """Test getting a specific player by ID."""
        # TODO: Implement test for single player retrieval
        pass

    def test_get_nonexistent_player(self, client):
        """Test getting a player that doesn't exist."""
        # TODO: Implement test for 404 response
        pass
