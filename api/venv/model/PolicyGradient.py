import torch
import torch.nn as nn
import torch.optim as optim

class Policy_Gradient(nn.Module):
    def __init__(self,n_input_features,n_fc1,n_actions):
        super(Policy_Gradient, self).__init__()
        self.n_input_features = n_input_features
        self.n_fc1 = n_fc1
        self.n_actions = n_actions
        self.fc1 = nn.Linear(self.n_input_features,self.n_fc1)
        self.fc2 = nn.Linear(self.n_fc1,self.n_fc1)
        self.fc3 = nn.Linear(self.n_fc1,self.n_actions)
        self.optimiser = optim.Adam(self.parameters(),lr = 0.01)

    def forward(self,state):
        with torch.autograd.set_detect_anomaly(True):
            layer1 =  nn.functional.relu(self.fc1(state))
            layer2 =  nn.functional.relu(self.fc2(layer1))
            action = self.fc3(layer1)
        return action

