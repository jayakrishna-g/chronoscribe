from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self.connected_clients = {}  # Map room ID to sets of connected websockets

    async def connect(self, websocket: WebSocket, room_id: str):
        await websocket.accept()
        if room_id not in self.connected_clients:
            self.connected_clients[room_id] = set()
        self.connected_clients[room_id].add(websocket)

    async def disconnect(self, websocket: WebSocket, room_id: str):
        self.connected_clients[room_id].remove(websocket)
        if not self.connected_clients[room_id]:
            del self.connected_clients[room_id]  # Remove empty room entry

    async def broadcast(self, room_id: str, data):
        for client in self.connected_clients.get(room_id, set()):  # Handle non-existent rooms gracefully
            await client.send_json(data)


def get_connection_manager():
    if 'connection_manager' not in globals():
        global connection_manager
        connection_manager = ConnectionManager()
    return connection_manager
