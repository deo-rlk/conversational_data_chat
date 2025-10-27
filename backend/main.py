import asyncio
import json
import os
import subprocess
import sys
from typing import Dict, Any
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from cryptography.fernet import Fernet
import base64

app = FastAPI(title="Looker Conversational Interface Backend")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Encryption key for credentials (in production, use environment variable)
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY", Fernet.generate_key())
cipher_suite = Fernet(ENCRYPTION_KEY)


class LookerConfig(BaseModel):
    url: str
    client_id: str
    client_secret: str
    use_demo: bool = False


class ConfigStatus(BaseModel):
    status: str  # 'loading', 'installing', 'done', 'error'
    message: str
    progress: int
    step: str


class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                # Remove disconnected connections
                self.active_connections.remove(connection)


manager = ConnectionManager()


def encrypt_credentials(config: LookerConfig) -> str:
    """Encrypt Looker credentials for secure storage"""
    data = {
        "url": config.url,
        "client_id": config.client_id,
        "client_secret": config.client_secret,
        "use_demo": config.use_demo,
    }
    encrypted_data = cipher_suite.encrypt(json.dumps(data).encode())
    return base64.b64encode(encrypted_data).decode()


def decrypt_credentials(encrypted_data: str) -> Dict[str, Any]:
    """Decrypt Looker credentials"""
    try:
        encrypted_bytes = base64.b64decode(encrypted_data.encode())
        decrypted_data = cipher_suite.decrypt(encrypted_bytes)
        return json.loads(decrypted_data.decode())
    except Exception as e:
        raise ValueError(f"Failed to decrypt credentials: {e}")


async def run_command_with_output(
    command: str, cwd: str = None, env: dict = None
) -> tuple[int, str, str]:
    """Run command and capture output"""
    try:
        # Merge with existing environment if env is provided
        process_env = os.environ.copy()
        if env:
            process_env.update(env)

        if sys.platform == "win32":
            # Windows: hide console window
            process = subprocess.Popen(
                command,
                shell=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                cwd=cwd,
                env=process_env,
                creationflags=subprocess.CREATE_NO_WINDOW,
            )
        else:
            # Unix-like systems
            process = subprocess.Popen(
                command,
                shell=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                cwd=cwd,
                env=process_env,
            )

        stdout, stderr = process.communicate()
        return process.returncode, stdout, stderr
    except Exception as e:
        return -1, "", str(e)


async def install_gemini_cli(websocket: WebSocket):
    """Install Gemini CLI"""
    try:
        await manager.send_personal_message(
            json.dumps(
                {
                    "status": "installing",
                    "message": "Instalando Gemini CLI...",
                    "progress": 10,
                    "step": "gemini_install",
                }
            ),
            websocket,
        )

        # Install Gemini CLI
        returncode, stdout, stderr = await run_command_with_output(
            "npx https://github.com/google-gemini/gemini-cli"
        )

        if returncode != 0:
            raise Exception(f"Failed to install Gemini CLI: {stderr}")

        await manager.send_personal_message(
            json.dumps(
                {
                    "status": "loading",
                    "message": "Gemini CLI instalado com sucesso",
                    "progress": 30,
                    "step": "gemini_install",
                }
            ),
            websocket,
        )

        return True
    except Exception as e:
        await manager.send_personal_message(
            json.dumps(
                {
                    "status": "error",
                    "message": f"Erro ao instalar Gemini CLI: {str(e)}",
                    "progress": 0,
                    "step": "gemini_install",
                }
            ),
            websocket,
        )
        return False


async def configure_looker_mcp(config: LookerConfig, websocket: WebSocket):
    """Configure Looker MCP with credentials and test the connection."""
    try:
        await manager.send_personal_message(
            json.dumps(
                {
                    "status": "loading",
                    "message": "Configurando e testando credenciais do Looker...",
                    "progress": 50,
                    "step": "looker_config",
                }
            ),
            websocket,
        )

        env_vars = {
            "LOOKER_BASE_URL": config.url,
            "LOOKER_CLIENT_ID": config.client_id,
            "LOOKER_CLIENT_SECRET": config.client_secret,
            "LOOKER_VERIFY_SSL": "false",
        }

        # Test the connection by trying to fetch models
        await manager.send_personal_message(
            json.dumps(
                {
                    "status": "loading",
                    "message": "Testando conexão com a API do Looker...",
                    "progress": 70,
                    "step": "looker_test",
                }
            ),
            websocket,
        )

        # Use the gemini cli to test the connection
        returncode, stdout, stderr = await run_command_with_output(
            "gemini looker get-models", env=env_vars
        )

        if returncode != 0:
            error_message = stderr or stdout
            await manager.send_personal_message(
                json.dumps(
                    {
                        "status": "error",
                        "message": f"Falha na conexão com o Looker: {error_message}",
                        "progress": 0,
                        "step": "looker_test",
                    }
                ),
                websocket,
            )
            return False

        await manager.send_personal_message(
            json.dumps(
                {
                    "status": "loading",
                    "message": "Conexão com o Looker estabelecida com sucesso!",
                    "progress": 90,
                    "step": "looker_test",
                }
            ),
            websocket,
        )

        return True
    except Exception as e:
        await manager.send_personal_message(
            json.dumps(
                {
                    "status": "error",
                    "message": f"Erro inesperado ao configurar o Looker: {str(e)}",
                    "progress": 0,
                    "step": "looker_config",
                }
            ),
            websocket,
        )
        return False


async def setup_conversational_interface(websocket: WebSocket):
    """Setup conversational interface"""
    try:
        await manager.send_personal_message(
            json.dumps(
                {
                    "status": "loading",
                    "message": "Preparando interface conversacional...",
                    "progress": 95,
                    "step": "interface_setup",
                }
            ),
            websocket,
        )

        # Simulate interface setup
        await asyncio.sleep(1)

        await manager.send_personal_message(
            json.dumps(
                {
                    "status": "done",
                    "message": "Configuração concluída com sucesso!",
                    "progress": 100,
                    "step": "complete",
                }
            ),
            websocket,
        )

        return True
    except Exception as e:
        await manager.send_personal_message(
            json.dumps(
                {
                    "status": "error",
                    "message": f"Erro ao preparar interface: {str(e)}",
                    "progress": 0,
                    "step": "interface_setup",
                }
            ),
            websocket,
        )
        return False


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)

            if message.get("type") == "start_config":
                config = LookerConfig(**message.get("config", {}))

                # Start configuration process
                success = True

                if not config.use_demo:
                    # Install Gemini CLI
                    if not await install_gemini_cli(websocket):
                        success = False

                    if success:
                        # Configure Looker MCP
                        if not await configure_looker_mcp(config, websocket):
                            success = False

                if success:
                    # Setup conversational interface
                    await setup_conversational_interface(websocket)
                else:
                    await manager.send_personal_message(
                        json.dumps(
                            {
                                "status": "error",
                                "message": "Falha na configuração. Tente novamente.",
                                "progress": 0,
                                "step": "error",
                            }
                        ),
                        websocket,
                    )

    except WebSocketDisconnect:
        manager.disconnect(websocket)


@app.get("/")
async def root():
    return {"message": "Looker Conversational Interface Backend"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
