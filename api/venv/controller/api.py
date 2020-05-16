import time
from flask import Flask,request
import random
import torch
from model.Agent import assignModel,calculateAction,trainModel
import numpy as np
from model.PolicyGradient import Policy_Gradient

app = Flask(__name__)

@app.route('/setupModel')
def setupTrainEnvApi():
    assignModel()
    return "Model assigned"

@app.route('/action',methods=['POST'])
def getActionApi():
    state = request.get_json()
    action_index = calculateAction(state)
    actions = ["up","down","left","right"]
    action = actions[action_index]
    time.sleep(1)
    return {'action' : action}

@app.route('/train',methods=['POST'])
def trainModelApi():
    reward_list = request.get_json()
    trainModel(reward_list)
    return "trained"