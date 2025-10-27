import pytest
from fastapi.testclient import TestClient
import json
from unittest.mock import AsyncMock

from .main import app  # Import your FastAPI app

# Create a TestClient instance
client = TestClient(app)


def test_health_check():
    """Tests the /health endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_root():
    """Tests the root / endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Looker Conversational Interface Backend"}


@pytest.mark.asyncio
async def test_websocket_config_flow(monkeypatch):
    """
    Tests the entire WebSocket configuration flow, mocking external commands.
    """
    # Mock the external command runners to avoid actual execution
    mock_run_command = AsyncMock()
    monkeypatch.setattr("backend.main.run_command_with_output", mock_run_command)

    mock_install_gemini = AsyncMock(return_value=True)
    monkeypatch.setattr("backend.main.install_gemini_cli", mock_install_gemini)

    # --- Test Case 1: Successful Configuration ---
    # Setup mock to return success (returncode 0)
    mock_run_command.return_value = (0, "Success", "")

    with client.websocket_connect("/ws") as websocket:
        # 1. Send start_config message
        websocket.send_json(
            {
                "type": "start_config",
                "config": {
                    "url": "https://test.looker.com",
                    "client_id": "test_id",
                    "client_secret": "test_secret",
                    "use_demo": False,
                },
            }
        )

        # 2. Check for Gemini install message (mocked)
        mock_install_gemini.assert_called_once()

        # 3. Check for Looker config message
        response = websocket.receive_json()
        assert response["step"] == "looker_config"
        assert response["progress"] == 50

        # 4. Check for Looker test message
        response = websocket.receive_json()
        assert response["step"] == "looker_test"
        assert response["progress"] == 70

        # 5. Check for Looker connection success message
        response = websocket.receive_json()
        assert response["step"] == "looker_test"
        assert response["progress"] == 90
        assert "estabelecida com sucesso" in response["message"]

        # 6. Check for interface setup message
        response = websocket.receive_json()
        assert response["step"] == "interface_setup"
        assert response["progress"] == 95

        # 7. Check for final "done" message
        response = websocket.receive_json()
        assert response["status"] == "done"
        assert response["progress"] == 100

    # --- Test Case 2: Failed Looker Connection ---
    # Reset mocks
    mock_run_command.reset_mock()
    mock_install_gemini.reset_mock()
    mock_install_gemini.return_value = True  # Assume gemini install works

    # Setup mock to return failure (returncode 1)
    mock_run_command.return_value = (1, "", "Invalid credentials")

    with client.websocket_connect("/ws") as websocket:
        websocket.send_json(
            {
                "type": "start_config",
                "config": {
                    "url": "https://test.looker.com",
                    "client_id": "wrong_id",
                    "client_secret": "wrong_secret",
                    "use_demo": False,
                },
            }
        )

        # Check for Looker config message
        response = websocket.receive_json()
        assert response["step"] == "looker_config"

        # Check for Looker test message
        response = websocket.receive_json()
        assert response["step"] == "looker_test"

        # Check for the specific error message from our new logic
        response = websocket.receive_json()
        assert response["status"] == "error"
        assert response["step"] == "looker_test"
        assert "Falha na conexão com o Looker" in response["message"]
        assert "Invalid credentials" in response["message"]
