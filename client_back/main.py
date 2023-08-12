import yaml
import motor.motor_asyncio
from bson import ObjectId
from fastapi.encoders import jsonable_encoder
from typing import List
from fastapi import FastAPI, Body
from model  import UserModel

with open("./assets/credentials.yaml") as f:
    credentials = yaml.safe_load(f)


app = FastAPI()
client = motor.motor_asyncio.AsyncIOMotorClient(credentials["mongo-url"])
db = client.PushHack


# Endpoint for listing all the users in the database
@app.get(
    "/users", response_description="List all users", response_model=List[UserModel]
)
async def list_users():
    users = await db["users"].find().to_list(1000)
    return users

# Endpoing for getting a user by email
@app.get(
    "/user/{email}", response_description="Get user by email.", response_model=UserModel
)
async def get_user_by_email(email: str):
    user = await db["users"].find_one({"email": email})
    if not user:
        print('user not found, use standard user')
        user = await db["users"].find_one({"email": "anil.kul@tum.de"})
    return user

# Endpoint for creating a new user
@app.post("/user/create", response_description="Add new user", response_model=UserModel)
async def create_user(user: UserModel = Body(...)):
    user.id = ObjectId(user.id)
    user = jsonable_encoder(user)
    user["_id"] = ObjectId(user["_id"])
    new_user = await db["users"].insert_one(user)
    created_user = await db["users"].find_one({"_id": new_user.inserted_id})
    return created_user
