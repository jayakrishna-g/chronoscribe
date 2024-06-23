from collections import defaultdict
from typing import Any

from fastapi import WebSocket


class ConnectionManager:
    def __init__(self) -> None:
        self.connected_clients: defaultdict[str, set[WebSocket]] = defaultdict(set)

    async def connect(self, websocket: WebSocket, room_id: str) -> None:
        await websocket.accept()
        self.connected_clients[room_id].add(websocket)

    async def disconnect(self, websocket: WebSocket, room_id: str) -> None:
        self.connected_clients[room_id].remove(websocket)
        if not self.connected_clients[room_id]:
            del self.connected_clients[room_id]

    async def broadcast(self, room_id: str, data: Any) -> None:
        for client in self.connected_clients.get(room_id, set()):
            await client.send_json(data)


def get_connection_manager() -> ConnectionManager | Any:
    if "connection_manager" not in globals():
        global connection_manager
        connection_manager = ConnectionManager()
    return connection_manager  # type: ignore
