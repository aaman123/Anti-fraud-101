import os
import warnings
import numpy as np
import pandas as pd
from pandas import Series, DataFrame
import seaborn as sns
import matplotlib.pyplot as plt
from termcolor import colored as cl

data = pd.read_csv("../sample_files/transactional-sample.csv")

Total_transactions = len(data)
normal = len(data[data.has_cbk == False])
fraudulent = len(data[data.has_cbk == True])
fraud_percentage = round(fraudulent/normal * 100 / 2)
print(cl('Total number of Trnsactions are {}'.format(Total_transactions), attrs = ['bold']))
print(cl('Number of Normal Transactions are {}'.format(normal), attrs = ['bold']))
print(cl('Number of fraudulent Transactions are {}'.format(fraudulent), attrs = ['bold']))
print(cl('Percentage of fraud Transactions is {}'.format(fraud_percentage), attrs = ['bold']))

