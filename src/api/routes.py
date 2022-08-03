"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager


#Create flask app
api = Blueprint('api', __name__)




# Create a route to authenticate your users and return JWTs. The
# create_access_token() function is used to actually generate the JWT.
@api.route("/token", methods=["POST"])
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    if email != "test" or password != "test":
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(identity=email)
    return jsonify(access_token=access_token)

   
   
   
@api.route("/hello", methods=["GET"])
@jwt_required()
def get_hello():

    dictionary  = {
        "message": "Hello World"
    }
    
    return jsonify(dictionary)


    return jsonify(response_body), 200

    # Signup route
@api.route('/signup', methods=['POST'])
def handle_signup():
    body = request.json # get the request body content
    email = request.json.get('email')
    fname = request.json.get('fname')
    lname = request.json.get('lname')
    password = request.json.get('password')
    
    if body is None:
        return "The request body is null", 400
    if not email:
        return 'You need to enter an email',400
    if not fname:
        return 'You need to enter an fname',400
    if not lname:
        return 'You need to enter an lname',400
    if not password:
        return 'You need to enter a password', 400

    # check_user = User.query.filter_by(email=email)
    check_user = User.query.filter_by(email=email).first()

    if check_user is not None:
        return jsonify({
            'msg': 'The email address already exists. Please login to your account to continue.'
        }),409

    user = User(email=email, fname=fname, lname=lname, password=password, is_active=True)

    db.session.add(user)
    db.session.commit()
   
    payload = {
        'msg': 'Your account has been registered successfully.',
        'user': user.serialize()
    }

    return jsonify(payload), 200


    # Bookmarks page end points
# @api.route('/bookmark/user/<int:user_id>', methods=['PUT', 'DELETE'])
# def handle_bookmarks(user_id):
#     bookmark = request.get_json()

#     # Add Bookmarks
#     if request.method == 'PUT':
#         user = User.query.get(user_id)
#         print("!!BOOKMARK: ", bookmark)

#         try:
#             user.bookmarks = []
#             bookmarkedGun = Gun.query.get(bookmark["gun"]["id"])
#             user.bookmarks.append(bookmarkedGun)
        
#         except Exception as e:
#             payload = {
#                 'msg': "Couldn't add bookmark. Try again later.",
#                 'error': e
#             }
#             return jsonify(payload), 409

#         db.session.commit()

#         payload = {
#             'msg': "Successfully added bookmark",
#             'user': user.serialize()
#         }
#         return jsonify(payload), 200


    # Delete Bookmarks
    # if request.method == 'DELETE':
    #     user = User.query.get(user_id)
    #     gun = Gun.query.get(bookmark["gun_id"])

    #     user.bookmarks.remove(gun)
    #     db.session.commit()

    #     return "Success", 200


# @api.route('/bookmark/user/<user_id>', methods=['GET'])
# def get_all_bookmarks(user_id):

#     user = User.query.get(user_id)

#     serialized_bookmarks = [item.serialize() for item in user.bookmarks]
#     return jsonify(serialized_bookmarks), 200