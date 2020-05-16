import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
from model.PolicyGradient import Policy_Gradient
from torchviz import make_dot
from graphviz import Source
#diagram = make_dot(loss,params=dict(model.named_parameters()))
# #Source(diagram).render("api/model_digram")
action_list = []

def assignModel():
    global model
    model  = Policy_Gradient(16,64,4)
    print("=========================")

def calculateAction(state):
    with torch.autograd.set_detect_anomaly(True):
        state = torch.tensor(state,dtype = torch.float).view(16)
        model_action = model.forward(state)
        softmax_action = F.softmax(model_action,dim=0)
        actions_dist = torch.distributions.Categorical(softmax_action)
        print(actions_dist.probs)
        action = actions_dist.sample()
        log_prob = actions_dist.log_prob(action)
        action_list.append(log_prob)

    return action.item()

def trainModel(reward_list):
    with torch.autograd.set_detect_anomaly(True):
        model.optimiser.zero_grad()
        gamma=torch.tensor(0.99,dtype=torch.float)
        G = np.zeros_like(reward_list,dtype=np.float64)
        for i in range(len(reward_list)):
            Rt = 0
            for t in range(i,len(reward_list)):
                Rt = Rt + reward_list[t]*gamma**(t-i)
            G[i] = Rt
        print(sum(reward_list))
        f = open("data2.txt", "a")
        f.write(str(G[0]) + "\n")
        f.close()
        mean = np.mean(G)
        std = np.std(G) if np.std(G)>0 else 1
        G = (G-mean)/std
        G = torch.tensor(G,dtype= torch.float)
        loss = 0 
        for i in range(len(reward_list)):
            loss = loss - action_list[i]*G[i]
        print(loss)
        loss.backward(retain_graph = True)
        model.optimiser.step()
        action_list.clear()